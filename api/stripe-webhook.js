// POST /api/stripe-webhook: Stripe tells us when a payment succeeds, fails, expires or is refunded,
// and this is the only code that changes a payment's status. Every request must carry a valid
// Stripe signature over the exact raw body; each event id is processed once (stripe_events), and
// status changes only move forward (lib/payments.js TRANSITIONS), so retries and duplicates are safe.
//
// It uses Vercel's Web-standard `POST(request)` export rather than the (req, res) helpers the other
// endpoints use, because those helpers parse JSON bodies and the signature needs the raw bytes.
import {
  annotatePayment,
  claimEvent,
  findPayment,
  finishEvent,
  transitionPayment,
} from "../lib/payments.js";
import { paymentSettings, verifyStripeEvent } from "../lib/stripe.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const id = (value) => (typeof value === "string" ? value : value?.id) || null;
const iso = (seconds) => new Date(seconds * 1000).toISOString();

export function createStripeWebhook({
  settings = paymentSettings,
  claim = claimEvent,
  finish = finishEvent,
  find = findPayment,
  transition = transitionPayment,
  annotate = annotatePayment,
  now = Date.now,
} = {}) {
  // A payment row may only be changed by an event from the same Stripe mode.
  const sameMode = (payment, event) => payment.livemode === Boolean(event.livemode);

  async function sessionEvent(event, session) {
    const payment = await find({ stripe_checkout_session_id: session.id });
    if (!payment || !sameMode(payment, event)) return null;
    const customer = session.customer_details || {};
    const fromSession = {
      stripe_payment_intent_id: id(session.payment_intent),
      stripe_customer_id: id(session.customer),
      customer_email: customer.email?.toLowerCase() || payment.customer_email,
      customer_name: customer.name || payment.customer_name,
      customer_phone: customer.phone || payment.customer_phone,
    };
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        if (session.payment_status !== "paid") {
          // Delayed methods (e.g. Bacs Direct Debit) complete first and settle later.
          await transition(payment.id, "processing", fromSession);
          break;
        }
        // Stripe charged what the session asked for; a difference means the services table
        // changed mid-checkout, so it is flagged for a person to check rather than hidden.
        const mismatch =
          session.amount_subtotal !== payment.amount ||
          session.currency !== payment.currency;
        await transition(payment.id, "paid", {
          ...fromSession,
          amount_total: session.amount_total,
          paid_at: iso(event.created),
          ...(mismatch && {
            details: {
              ...payment.details,
              amountMismatch: {
                charged: session.amount_subtotal,
                currency: session.currency,
              },
            },
          }),
        });
        break;
      }
      case "checkout.session.async_payment_failed":
        await transition(payment.id, "failed", {
          ...fromSession,
          failed_at: iso(event.created),
        });
        break;
      case "checkout.session.expired":
        await transition(payment.id, "expired", {});
        break;
    }
    return payment.id;
  }

  // A declined card inside Checkout: the customer can still retry, which would then complete.
  async function paymentFailed(event, intent) {
    const paymentId = intent.metadata?.payment_id;
    if (!UUID.test(paymentId || "")) return null;
    const payment = await find({ id: paymentId });
    if (!payment || !sameMode(payment, event)) return null;
    const error = intent.last_payment_error || {};
    const details = {
      ...payment.details,
      lastError: {
        code: error.code || null,
        declineCode: error.decline_code || null,
        at: iso(event.created),
      },
    };
    const moved = await transition(payment.id, "failed", {
      stripe_payment_intent_id: intent.id,
      failed_at: iso(event.created),
      details,
    });
    if (!moved) await annotate(payment.id, { details });
    return payment.id;
  }

  async function chargeRefunded(event, charge) {
    const intent = id(charge.payment_intent);
    let payment = intent && (await find({ stripe_payment_intent_id: intent }));
    if (!payment && UUID.test(charge.metadata?.payment_id || ""))
      payment = await find({ id: charge.metadata.payment_id });
    if (!payment || !sameMode(payment, event)) return null;
    const status = charge.refunded ? "refunded" : "partially_refunded";
    const moved = await transition(payment.id, status, {
      amount_refunded: charge.amount_refunded,
      refunded_at: iso(event.created),
    });
    // A refund that overtook its payment's success event: fail so Stripe redelivers it later.
    if (!moved && ["pending", "processing"].includes(payment.status))
      throw new Error("Refund arrived before the payment was recorded");
    return payment.id;
  }

  const handlers = {
    "checkout.session.completed": sessionEvent,
    "checkout.session.async_payment_succeeded": sessionEvent,
    "checkout.session.async_payment_failed": sessionEvent,
    "checkout.session.expired": sessionEvent,
    "payment_intent.payment_failed": paymentFailed,
    "charge.refunded": chargeRefunded,
  };

  /** Returns { status, body } for a raw request body and its Stripe-Signature header. */
  return async function handle(rawBody, signature) {
    const config = settings();
    if (!config.mode || !config.webhookSecret)
      return { status: 503, body: { ok: false } };
    const event = verifyStripeEvent(rawBody, signature, config.webhookSecret, {
      now: now(),
    });
    if (!event) return { status: 400, body: { ok: false, message: "Invalid signature." } };
    // A test event sent to a live endpoint (or the reverse) is acknowledged and ignored.
    if (Boolean(event.livemode) !== (config.mode === "live"))
      return { status: 200, body: { ok: true, ignored: "mode" } };
    const handler = handlers[event.type];
    if (!handler) return { status: 200, body: { ok: true, ignored: "type" } };
    try {
      if ((await claim(event)) === "done")
        return { status: 200, body: { ok: true, duplicate: true } };
      const paymentId = await handler(event, event.data.object);
      await finish(event.id, paymentId);
      return { status: 200, body: { ok: true } };
    } catch {
      // Unfinished events stay claimed but unprocessed, so Stripe's retry runs them again.
      return { status: 500, body: { ok: false } };
    }
  };
}

export const handleStripeWebhook = createStripeWebhook();
const MAX_BODY_BYTES = 512 * 1024;

export async function POST(request) {
  const raw = Buffer.from(await request.arrayBuffer());
  if (raw.length > MAX_BODY_BYTES)
    return Response.json({ ok: false }, { status: 413 });
  const { status, body } = await handleStripeWebhook(
    raw,
    request.headers.get("stripe-signature"),
  );
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
