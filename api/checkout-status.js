// GET /api/checkout-status?session_id=cs_…: what the success page shows. Read-only: it never
// changes a payment (only verified webhooks do). The unguessable Checkout Session id is the only
// key, and the reply carries just enough to confirm the purchase, with the email masked.
import { catalogItem } from "../assets/catalog.js";
import { createRateLimiter, sendRateLimited } from "../lib/http.js";
import { findPayment, paymentsStorageConfigured } from "../lib/payments.js";
import { paymentSettings, stripeRequest } from "../lib/stripe.js";

const limiter = createRateLimiter({ limit: 40, windowMs: 10 * 60 * 1000 });
export const SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;

export function maskEmail(email) {
  const [local, domain] = String(email || "").split("@");
  if (!local || !domain) return null;
  return `${local[0]}${"•".repeat(Math.min(Math.max(local.length - 1, 1), 6))}@${domain}`;
}

// Stripe's live view wins while a payment is in flight, so the page is right even if the webhook
// has not arrived yet; refunds and failures recorded from webhooks are kept.
export function displayStatus(payment, session) {
  if (["refunded", "partially_refunded"].includes(payment.status)) return payment.status;
  if (!session) return payment.status;
  if (session.status === "complete")
    return session.payment_status === "paid" ? "paid" : "processing";
  if (session.status === "expired")
    return payment.status === "failed" ? "failed" : "expired";
  return payment.status === "failed" ? "failed" : "pending";
}

export function createCheckoutStatusHandler({
  settings = paymentSettings,
  storageReady = paymentsStorageConfigured,
  find = findPayment,
  stripe = stripeRequest,
  now = Date.now,
  rateLimit = true,
} = {}) {
  return async function checkoutStatus(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ ok: false, message: "Use GET." });
    }
    const url = new URL(req.url, "http://localhost");
    const sessionId = url.searchParams.get("session_id") || "";
    if (!SESSION_ID.test(sessionId))
      return res.status(400).json({ ok: false, message: "Missing or invalid payment reference." });
    if (!settings().mode || !storageReady())
      return res.status(503).json({ ok: false, message: "Payments are not available." });
    if (rateLimit) {
      const { limited, retryAfter } = limiter(req, now());
      if (limited) return sendRateLimited(res, retryAfter);
    }
    let payment;
    try {
      payment = await find({ stripe_checkout_session_id: sessionId });
    } catch {
      return res.status(502).json({ ok: false, message: "We couldn’t check this payment just now." });
    }
    if (!payment)
      return res.status(404).json({ ok: false, message: "We couldn’t find that payment." });
    const session = await stripe(`checkout/sessions/${sessionId}`).catch(() => null);
    const item = catalogItem(payment.service_slug);
    return res.status(200).json({
      ok: true,
      status: displayStatus(payment, session),
      reference: payment.id.slice(0, 8).toUpperCase(),
      service: {
        slug: payment.service_slug,
        name: payment.service_name,
        description: item?.description || "",
      },
      amount: payment.amount,
      currency: payment.currency,
      email: maskEmail(payment.customer_email || session?.customer_details?.email),
      paidAt: payment.paid_at,
      testMode: payment.livemode === false,
    });
  };
}
export default createCheckoutStatusHandler();
