// POST /api/checkout: starts a Stripe Checkout session for one service and returns its URL.
// The browser sends only which service and who is buying. The price comes from the Supabase
// services table, and must match assets/catalog.js (what the page showed), or nothing is charged.
import { randomUUID } from "node:crypto";
import { amountMinor, catalogItem } from "../assets/catalog.js";
import { validateCheckout } from "../assets/validation.js";
import {
  createRateLimiter,
  readJsonPost,
  sendRateLimited,
} from "../lib/http.js";
import {
  createPayment,
  findService,
  paymentsStorageConfigured,
} from "../lib/payments.js";
import { paymentSettings, stripeRequest } from "../lib/stripe.js";

// The /terms version a customer agrees to at checkout; bump it when the terms change.
export const TERMS_VERSION = "2026-10-11";
// Stripe's minimum is 30 minutes. An abandoned session expires (and its record with it) after this.
const SESSION_MINUTES = 60;
const limiter = createRateLimiter({ limit: 10, windowMs: 10 * 60 * 1000 });

const unavailable = {
  ok: false,
  message:
    "Online payment isn’t available right now, and you have not been charged. Please message us on WhatsApp or email and we’ll send a secure payment link.",
};
const unknownService = {
  ok: false,
  errors: { service: "Please choose a service." },
  message: "That service can’t be bought online. Please choose another.",
};

// Stripe needs absolute return URLs. They are built from SITE_URL, never from request headers.
export function siteOrigin(value = process.env.SITE_URL) {
  try {
    const url = new URL(value);
    const local = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
    return url.protocol === "https:" || local ? url.origin : null;
  } catch {
    return null;
  }
}

export function checkoutSessionParams({ paymentId, item, service, customer, origin, settings, now }) {
  return {
    mode: "payment",
    client_reference_id: paymentId,
    customer_email: customer.email,
    customer_creation: "always",
    submit_type: "pay",
    billing_address_collection: "auto",
    phone_number_collection: { enabled: true },
    expires_at: Math.floor(now / 1000) + SESSION_MINUTES * 60,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: service.currency,
          unit_amount: service.amount,
          product_data: {
            name: service.name,
            ...(service.description && { description: service.description }),
            metadata: { service: item.slug },
          },
        },
        ...(settings.taxRate && { tax_rates: [settings.taxRate] }),
      },
    ],
    metadata: { payment_id: paymentId, service: item.slug },
    payment_intent_data: {
      description: `Veltra Media: ${service.name}`,
      // Stripe emails its receipt here once the payment succeeds (live mode only).
      receipt_email: customer.email,
      metadata: { payment_id: paymentId, service: item.slug },
    },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancelled?service=${encodeURIComponent(item.slug)}`,
  };
}

export function createCheckoutHandler({
  settings = paymentSettings,
  storageReady = paymentsStorageConfigured,
  lookup = findService,
  record = createPayment,
  stripe = stripeRequest,
  origin = siteOrigin,
  now = Date.now,
  uuid = randomUUID,
  rateLimit = true,
} = {}) {
  return async function checkout(req, res) {
    const raw = readJsonPost(req, res);
    if (!raw) return;
    const { data, errors, valid } = validateCheckout(raw);
    if (!valid)
      return res.status(422).json({
        ok: false,
        errors,
        message: "Please check the highlighted fields.",
      });
    const config = settings();
    const returnTo = origin();
    if (!config.enabled || !storageReady() || !returnTo)
      return res.status(503).json(unavailable);
    if (rateLimit) {
      const { limited, retryAfter } = limiter(req, now());
      if (limited) return sendRateLimited(res, retryAfter);
    }

    // The test item is only sold with a test key; with a live key it does not exist.
    const item = catalogItem(data.service);
    if (!item?.purchasable || (item.testOnly && !config.testMode))
      return res.status(404).json(unknownService);

    let service;
    try {
      service = await lookup(item.slug);
    } catch {
      return res.status(502).json(unavailable);
    }
    if (!service?.purchasable || (service.test_only && !config.testMode))
      return res.status(404).json(unknownService);
    // The page showed the catalogue price; never charge a different one.
    if (
      service.amount !== amountMinor(item) ||
      service.currency !== "gbp" ||
      service.test_only !== item.testOnly
    ) {
      console.error(`Checkout refused: ${item.slug} differs between the catalogue and the services table. Run npm run db:setup.`);
      return res.status(503).json(unavailable);
    }

    const paymentId = uuid();
    const stamp = now();
    let session;
    try {
      session = await stripe("checkout/sessions", {
        method: "POST",
        idempotencyKey: `checkout-${paymentId}`,
        params: checkoutSessionParams({
          paymentId,
          item,
          service,
          customer: data,
          origin: returnTo,
          settings: config,
          now: stamp,
        }),
      });
      if (!/^cs_(test|live)_/.test(session.id) || !/^https:\/\//.test(session.url))
        throw new Error("Unexpected Checkout response");
    } catch {
      return res.status(502).json(unavailable);
    }

    try {
      await record({
        id: paymentId,
        service_slug: service.slug,
        service_name: service.name,
        amount: service.amount,
        currency: service.currency,
        status: "pending",
        livemode: session.livemode === true,
        customer_name: data.name,
        customer_email: data.email,
        business_name: data.business || null,
        stripe_checkout_session_id: session.id,
        details: {
          termsVersion: TERMS_VERSION,
          termsAcceptedAt: new Date(stamp).toISOString(),
          expiresAt: new Date(session.expires_at * 1000).toISOString(),
        },
      });
    } catch {
      // Without a record the payment could not be matched, so the session is closed unused.
      await stripe(`checkout/sessions/${session.id}/expire`, { method: "POST" }).catch(() => {});
      return res.status(502).json(unavailable);
    }
    return res.status(200).json({ ok: true, url: session.url });
  };
}
export default createCheckoutHandler();
