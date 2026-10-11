import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { SYSTEM } from "../assets/business.js";
import {
  CATALOG,
  amountMinor,
  catalogItem,
  purchasableItems,
} from "../assets/catalog.js";
import { validateCheckout } from "../assets/validation.js";
import {
  checkoutSessionParams,
  createCheckoutHandler,
  siteOrigin,
} from "../api/checkout.js";
import {
  createCheckoutStatusHandler,
  displayStatus,
  maskEmail,
} from "../api/checkout-status.js";
import { createStripeWebhook } from "../api/stripe-webhook.js";
import { TRANSITIONS, checkoutEnabled, transitionPayment } from "../lib/payments.js";
import {
  formEncode,
  paymentSettings,
  signStripePayload,
  stripeMode,
  verifyStripeEvent,
} from "../lib/stripe.js";
import { services as pricingCards } from "../src/pages/pricing.js";

const TEST_ENV = {
  STRIPE_SECRET_KEY: "sk_test_abc123",
  STRIPE_WEBHOOK_SECRET: "whsec_testsecret",
};
const SECRET = TEST_ENV.STRIPE_WEBHOOK_SECRET;
const PAYMENT_ID = "11111111-2222-4333-8444-555555555555";

function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}
const dbService = (slug) => {
  const item = catalogItem(slug);
  return {
    slug,
    name: item.name,
    description: item.description,
    amount: amountMinor(item),
    currency: "gbp",
    purchasable: item.purchasable,
    test_only: item.testOnly,
  };
};

// ── Catalogue ───────────────────────────────────────────────────────────────

test("one catalogue drives /pricing, the package and the checkout", () => {
  assert.deepEqual(
    pricingCards.map((card) => [card.slug, card.price]),
    [
      ["landing-page", 99],
      ["multi-page-website", 179],
      ["local-seo-google-business-profile", 99],
      ["ai-receptionist-website-chat", 199],
      ["crm-booking-automation", 199],
      ["website-care", 49],
    ],
  );
  assert.equal(SYSTEM.price, catalogItem("growth-launch-package").price);
  assert.deepEqual(
    SYSTEM.components.map((c) => c.price),
    catalogItem("growth-launch-package").includes.map((slug) => catalogItem(slug).price),
  );
  assert.equal(new Set(CATALOG.map((item) => item.slug)).size, CATALOG.length);
  for (const item of CATALOG) {
    assert.match(item.slug, /^[a-z0-9-]{2,60}$/);
    assert.ok(item.name && item.description, item.slug);
    assert.ok(Number.isInteger(amountMinor(item)) && amountMinor(item) > 0, item.slug);
  }
});

test("the £1 test payment is £1, test-only, and absent from live sales and /pricing", () => {
  const item = catalogItem("test-payment");
  assert.equal(amountMinor(item), 100);
  assert.equal(item.testOnly, true);
  assert.ok(!purchasableItems().some((i) => i.testOnly));
  assert.ok(purchasableItems({ testMode: true }).some((i) => i.slug === "test-payment"));
  assert.ok(!pricingCards.some((card) => card.slug === "test-payment"));
  // A "from" monthly price is not a fixed amount, so care is never sold at checkout.
  assert.equal(catalogItem("website-care").purchasable, false);
});

// ── Stripe settings and signatures ─────────────────────────────────────────

test("only test keys switch payments on unless live payments are explicitly approved", () => {
  assert.equal(stripeMode("sk_test_123"), "test");
  assert.equal(stripeMode("rk_live_123"), "live");
  assert.equal(stripeMode("pk_test_123"), null);
  assert.equal(stripeMode(""), null);
  assert.equal(paymentSettings(TEST_ENV).enabled, true);
  assert.equal(paymentSettings({ ...TEST_ENV, STRIPE_WEBHOOK_SECRET: "" }).enabled, false);
  const live = { STRIPE_SECRET_KEY: "sk_live_abc", STRIPE_WEBHOOK_SECRET: SECRET };
  assert.equal(paymentSettings(live).enabled, false);
  assert.equal(paymentSettings({ ...live, STRIPE_LIVE_PAYMENTS: "yes" }).enabled, false);
  assert.equal(paymentSettings({ ...live, STRIPE_LIVE_PAYMENTS: "enabled" }).enabled, true);
  assert.equal(checkoutEnabled(TEST_ENV), false, "needs Supabase too");
  assert.equal(
    checkoutEnabled({ ...TEST_ENV, SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "k" }),
    true,
  );
});

test("form encoding matches Stripe's bracket syntax", () => {
  assert.equal(
    decodeURIComponent(
      formEncode({ a: 1, line_items: [{ price_data: { currency: "gbp" } }], skip: undefined }).toString(),
    ),
    "a=1&line_items[0][price_data][currency]=gbp",
  );
});

test("webhook signatures are checked against the raw body, secret and timestamp", () => {
  const now = Date.now();
  const payload = JSON.stringify({ id: "evt_1", type: "x", data: { object: {} } }, null, 2);
  const header = signStripePayload(payload, SECRET, Math.floor(now / 1000));
  assert.equal(verifyStripeEvent(payload, header, SECRET, { now }).id, "evt_1");
  assert.equal(verifyStripeEvent(Buffer.from(payload), header, SECRET, { now }).id, "evt_1");
  assert.equal(verifyStripeEvent(payload.replace("evt_1", "evt_2"), header, SECRET, { now }), null);
  assert.equal(verifyStripeEvent(payload, header, "whsec_other", { now }), null);
  assert.equal(verifyStripeEvent(payload, header, SECRET, { now: now + 301_000 }), null);
  assert.equal(verifyStripeEvent(payload, "t=1,v1=zz", SECRET, { now }), null);
  assert.equal(verifyStripeEvent(payload, undefined, SECRET, { now }), null);
  // While a secret rolls, Stripe sends several v1 signatures; any one may match.
  const rolled = `${header},v1=${"0".repeat(64)}`;
  assert.equal(verifyStripeEvent(payload, rolled, SECRET, { now }).id, "evt_1");
});

// ── Checkout ───────────────────────────────────────────────────────────────

test("checkout validation only accepts a slug and the buyer's details", () => {
  const { valid, data } = validateCheckout({
    service: "landing-page",
    name: " Ann ",
    email: "Ann@Example.com",
    terms: true,
    amount: 1,
  });
  assert.equal(valid, true);
  assert.deepEqual(data, { service: "landing-page", name: "Ann", email: "ann@example.com", business: "", terms: true });
  assert.deepEqual(
    Object.keys(validateCheckout({ service: "<x>", name: "", email: "no", terms: false }).errors),
    ["service", "name", "email", "terms"],
  );
});

function checkoutHarness(overrides = {}) {
  const calls = { stripe: [], records: [] };
  const handler = createCheckoutHandler({
    settings: () => paymentSettings(TEST_ENV),
    storageReady: () => true,
    lookup: async (slug) => (catalogItem(slug) ? dbService(slug) : null),
    record: async (row) => calls.records.push(row),
    stripe: async (path, options) => {
      calls.stripe.push({ path, ...options });
      if (path.endsWith("/expire")) return {};
      return {
        id: "cs_test_a1b2c3d4e5f6",
        url: "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5f6",
        livemode: false,
        expires_at: 1_900_000_000,
      };
    },
    origin: () => "https://www.veltramedia.com",
    uuid: () => PAYMENT_ID,
    rateLimit: false,
    ...overrides,
  });
  return { handler, calls };
}
const order = (service, extra = {}) => ({
  method: "POST",
  headers: { "content-type": "application/json" },
  body: { service, name: "Ann Buyer", email: "ann@example.com", terms: true, ...extra },
});

test("checkout charges the database price for every service, never a browser amount", async () => {
  for (const item of purchasableItems({ testMode: true })) {
    const { handler, calls } = checkoutHarness();
    const res = response();
    await handler(order(item.slug, { amount: 1, price: 1, unit_amount: 1 }), res);
    assert.equal(res.statusCode, 200, item.slug);
    assert.equal(res.body.url, "https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5f6");
    const [{ params, idempotencyKey }] = calls.stripe;
    assert.equal(params.line_items[0].price_data.unit_amount, amountMinor(item), item.slug);
    assert.equal(params.line_items[0].price_data.currency, "gbp");
    assert.equal(params.line_items[0].price_data.product_data.name, item.name);
    assert.equal(params.client_reference_id, PAYMENT_ID);
    assert.equal(params.payment_intent_data.metadata.payment_id, PAYMENT_ID);
    assert.equal(idempotencyKey, `checkout-${PAYMENT_ID}`);
    assert.match(params.success_url, /^https:\/\/www\.veltramedia\.com\/checkout\/success\?session_id=\{CHECKOUT_SESSION_ID\}$/);
    const [row] = calls.records;
    assert.equal(row.amount, amountMinor(item));
    assert.equal(row.status, "pending");
    assert.equal(row.livemode, false);
    assert.equal(row.stripe_checkout_session_id, "cs_test_a1b2c3d4e5f6");
  }
});

test("the £1 test payment is charged as 100 pence in test mode and refused in live mode", async () => {
  const test1 = checkoutHarness();
  const res = response();
  await test1.handler(order("test-payment"), res);
  assert.equal(res.statusCode, 200);
  assert.equal(test1.calls.stripe[0].params.line_items[0].price_data.unit_amount, 100);

  const live = checkoutHarness({
    settings: () =>
      paymentSettings({ STRIPE_SECRET_KEY: "sk_live_x", STRIPE_WEBHOOK_SECRET: SECRET, STRIPE_LIVE_PAYMENTS: "enabled" }),
  });
  const refused = response();
  await live.handler(order("test-payment"), refused);
  assert.equal(refused.statusCode, 404);
  assert.equal(live.calls.stripe.length, 0);
});

test("checkout refuses when switched off, unknown, unpurchasable or out of step with the database", async () => {
  const cases = [
    [{ settings: () => paymentSettings({}) }, "landing-page", 503],
    [{ storageReady: () => false }, "landing-page", 503],
    [{ origin: () => null }, "landing-page", 503],
    [{}, "no-such-service", 404],
    [{}, "website-care", 404],
    [{ lookup: async () => null }, "landing-page", 404],
    [{ lookup: async () => ({ ...dbService("landing-page"), purchasable: false }) }, "landing-page", 404],
    [{ lookup: async () => ({ ...dbService("landing-page"), amount: 100 }) }, "landing-page", 503],
    [{ lookup: async () => ({ ...dbService("landing-page"), currency: "usd" }) }, "landing-page", 503],
    [{ lookup: async () => { throw new Error("down"); } }, "landing-page", 502],
    [{ stripe: async () => { throw new Error("declined"); } }, "landing-page", 502],
  ];
  const quiet = console.error;
  console.error = () => {};
  try {
    for (const [overrides, slug, status] of cases) {
      const { handler, calls } = checkoutHarness(overrides);
      const res = response();
      await handler(order(slug), res);
      assert.equal(res.statusCode, status, `${slug} ${Object.keys(overrides)}`);
      assert.equal(calls.records.length, 0);
      assert.equal(res.body.ok, false);
    }
  } finally {
    console.error = quiet;
  }
  const { handler } = checkoutHarness();
  const invalid = response();
  await handler(order("landing-page", { terms: false }), invalid);
  assert.equal(invalid.statusCode, 422);
});

test("a checkout that cannot be recorded is closed on Stripe and reports failure", async () => {
  const { handler, calls } = checkoutHarness({
    record: async () => {
      throw new Error("db down");
    },
  });
  const res = response();
  await handler(order("landing-page"), res);
  assert.equal(res.statusCode, 502);
  assert.equal(calls.stripe.at(-1).path, "checkout/sessions/cs_test_a1b2c3d4e5f6/expire");
});

test("return URLs come only from SITE_URL", () => {
  assert.equal(siteOrigin("https://www.veltramedia.com/"), "https://www.veltramedia.com");
  assert.equal(siteOrigin("http://localhost:4174"), "http://localhost:4174");
  assert.equal(siteOrigin("http://evil.example"), null);
  assert.equal(siteOrigin(undefined), null);
  const params = checkoutSessionParams({
    paymentId: PAYMENT_ID,
    item: catalogItem("landing-page"),
    service: dbService("landing-page"),
    customer: { email: "a@b.co" },
    origin: "https://www.veltramedia.com",
    settings: { taxRate: "txr_123" },
    now: 0,
  });
  assert.deepEqual(params.line_items[0].tax_rates, ["txr_123"]);
  assert.ok(params.expires_at >= 30 * 60, "Stripe needs at least 30 minutes");
});

// ── Webhook ────────────────────────────────────────────────────────────────

const basePayment = () => ({
  id: PAYMENT_ID,
  status: "pending",
  livemode: false,
  amount: 9900,
  currency: "gbp",
  customer_email: "ann@example.com",
  customer_name: "Ann Buyer",
  customer_phone: null,
  stripe_checkout_session_id: "cs_test_a1b2c3d4e5f6",
  stripe_payment_intent_id: "pi_123",
  details: { termsVersion: "x" },
});

function webhookHarness({ payment = basePayment(), claimResult = "new", ...overrides } = {}) {
  const log = { transitions: [], finished: [], annotated: [] };
  const handle = createStripeWebhook({
    settings: () => paymentSettings(TEST_ENV),
    claim: async () => claimResult,
    finish: async (eventId, paymentId) => log.finished.push([eventId, paymentId]),
    find: async (filters) => {
      log.find = filters;
      return payment;
    },
    transition: async (id, status, changes) => {
      log.transitions.push({ id, status, changes });
      return TRANSITIONS[status].includes(payment.status) ? { ...payment, status } : null;
    },
    annotate: async (id, changes) => log.annotated.push(changes),
    ...overrides,
  });
  return { log, send: (event) => sendEvent(handle, event) };
}
function sendEvent(handle, event) {
  const payload = JSON.stringify({ livemode: false, created: 1_800_000_000, ...event }, null, 2);
  return handle(payload, signStripePayload(payload, SECRET));
}
const sessionEvent = (type, session = {}) => ({
  id: `evt_${type}`,
  type,
  data: {
    object: {
      id: "cs_test_a1b2c3d4e5f6",
      payment_status: "paid",
      status: "complete",
      amount_subtotal: 9900,
      amount_total: 9900,
      currency: "gbp",
      payment_intent: "pi_123",
      customer: "cus_123",
      customer_details: { email: "Ann@Example.com", name: "Ann B", phone: "+447123456789" },
      ...session,
    },
  },
});

test("a completed checkout marks the payment paid with Stripe's details", async () => {
  const { log, send } = webhookHarness();
  const result = await send(sessionEvent("checkout.session.completed"));
  assert.equal(result.status, 200);
  assert.deepEqual(log.find, { stripe_checkout_session_id: "cs_test_a1b2c3d4e5f6" });
  const [{ status, changes }] = log.transitions;
  assert.equal(status, "paid");
  assert.equal(changes.stripe_payment_intent_id, "pi_123");
  assert.equal(changes.customer_email, "ann@example.com");
  assert.equal(changes.customer_phone, "+447123456789");
  assert.equal(changes.paid_at, new Date(1_800_000_000_000).toISOString());
  assert.equal(changes.details, undefined, "no mismatch flag when the amount matches");
  assert.deepEqual(log.finished, [["evt_checkout.session.completed", PAYMENT_ID]]);
});

test("a charged amount that differs from the record is flagged, not hidden", async () => {
  const { log, send } = webhookHarness();
  await send(sessionEvent("checkout.session.completed", { amount_subtotal: 100 }));
  assert.deepEqual(log.transitions[0].changes.details.amountMismatch, { charged: 100, currency: "gbp" });
});

test("delayed payment methods go to processing, then paid or failed", async () => {
  const unpaid = webhookHarness();
  await unpaid.send(sessionEvent("checkout.session.completed", { payment_status: "unpaid" }));
  assert.equal(unpaid.log.transitions[0].status, "processing");
  const failed = webhookHarness({ payment: { ...basePayment(), status: "processing" } });
  await failed.send(sessionEvent("checkout.session.async_payment_failed", { payment_status: "unpaid" }));
  assert.equal(failed.log.transitions[0].status, "failed");
  const ok = webhookHarness({ payment: { ...basePayment(), status: "processing" } });
  await ok.send(sessionEvent("checkout.session.async_payment_succeeded"));
  assert.equal(ok.log.transitions[0].status, "paid");
});

test("expired sessions, declined cards and refunds update the record", async () => {
  const expired = webhookHarness();
  await expired.send(sessionEvent("checkout.session.expired", { status: "expired", payment_status: "unpaid" }));
  assert.equal(expired.log.transitions[0].status, "expired");

  const declined = webhookHarness();
  await declined.send({
    id: "evt_pf",
    type: "payment_intent.payment_failed",
    data: {
      object: {
        id: "pi_123",
        metadata: { payment_id: PAYMENT_ID },
        last_payment_error: { code: "card_declined", decline_code: "insufficient_funds", message: "secret detail" },
      },
    },
  });
  assert.deepEqual(declined.log.find, { id: PAYMENT_ID });
  assert.equal(declined.log.transitions[0].status, "failed");
  assert.deepEqual(
    { code: "card_declined", declineCode: "insufficient_funds" },
    (({ code, declineCode }) => ({ code, declineCode }))(declined.log.transitions[0].changes.details.lastError),
  );

  for (const [refunded, amount, status] of [[true, 9900, "refunded"], [false, 2000, "partially_refunded"]]) {
    const { log, send } = webhookHarness({ payment: { ...basePayment(), status: "paid" } });
    await send({
      id: `evt_refund_${status}`,
      type: "charge.refunded",
      data: { object: { id: "ch_1", payment_intent: "pi_123", refunded, amount_refunded: amount, metadata: {} } },
    });
    assert.deepEqual(log.find, { stripe_payment_intent_id: "pi_123" });
    assert.equal(log.transitions[0].status, status);
    assert.equal(log.transitions[0].changes.amount_refunded, amount);
  }
});

test("duplicate deliveries are acknowledged without being applied again", async () => {
  const { log, send } = webhookHarness({ claimResult: "done" });
  const result = await send(sessionEvent("checkout.session.completed"));
  assert.equal(result.status, 200);
  assert.equal(result.body.duplicate, true);
  assert.equal(log.transitions.length, 0);
  assert.equal(log.finished.length, 0);
  // A delivery claimed earlier but never finished is processed on retry.
  const retry = webhookHarness({ claimResult: "retry" });
  await retry.send(sessionEvent("checkout.session.completed"));
  assert.equal(retry.log.transitions.length, 1);
});

test("a late failure event cannot undo a paid payment", async () => {
  const { log, send } = webhookHarness({ payment: { ...basePayment(), status: "paid" } });
  const result = await send(sessionEvent("checkout.session.async_payment_failed"));
  assert.equal(result.status, 200);
  assert.equal(log.transitions[0].status, "failed");
  assert.ok(!TRANSITIONS.failed.includes("paid"));
  assert.ok(!TRANSITIONS.expired.includes("paid"));
});

test("events are refused without a valid signature and ignored from the other Stripe mode", async () => {
  const { log } = webhookHarness();
  const handle = createStripeWebhook({ settings: () => paymentSettings(TEST_ENV) });
  const payload = JSON.stringify(sessionEvent("checkout.session.completed"));
  assert.equal((await handle(payload, "t=1,v1=00")).status, 400);
  assert.equal((await handle(payload, signStripePayload(payload, "whsec_wrong"))).status, 400);
  assert.equal((await createStripeWebhook({ settings: () => paymentSettings({}) })(payload, "")).status, 503);

  const live = await sendEvent(
    createStripeWebhook({ settings: () => paymentSettings(TEST_ENV), claim: async () => { throw new Error("must not run"); } }),
    { ...sessionEvent("checkout.session.completed"), livemode: true },
  );
  assert.equal(live.status, 200);
  assert.equal(live.body.ignored, "mode");
  assert.equal(log.transitions.length, 0);

  // A test-mode row is never changed by a live event, even with matching ids.
  const liveRow = webhookHarness({ payment: { ...basePayment(), livemode: true } });
  await liveRow.send(sessionEvent("checkout.session.completed"));
  assert.equal(liveRow.log.transitions.length, 0);
});

test("a failure while processing returns 500 so Stripe retries, and leaves the event unfinished", async () => {
  const { log, send } = webhookHarness({
    transition: async () => {
      throw new Error("db down");
    },
  });
  const result = await send(sessionEvent("checkout.session.completed"));
  assert.equal(result.status, 500);
  assert.equal(log.finished.length, 0);
  // A refund that overtakes its payment is retried too.
  const early = webhookHarness();
  const refund = await early.send({
    id: "evt_r",
    type: "charge.refunded",
    data: { object: { payment_intent: "pi_123", refunded: true, amount_refunded: 9900 } },
  });
  assert.equal(refund.status, 500);
});

test("unrelated event types are acknowledged and ignored", async () => {
  const { log, send } = webhookHarness();
  const result = await send({ id: "evt_x", type: "customer.created", data: { object: {} } });
  assert.equal(result.status, 200);
  assert.equal(log.transitions.length, 0);
});

test("status changes are written with a filter on the allowed earlier states", async () => {
  const original = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), init });
    return new Response("[]", { status: 200 });
  };
  try {
    const env = { SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "service" };
    assert.equal(await transitionPayment(PAYMENT_ID, "paid", { paid_at: "now" }, env), null);
    const [{ url, init }] = requests;
    assert.equal(url, `https://x.supabase.co/rest/v1/payments?id=eq.${PAYMENT_ID}&status=in.(pending,processing,failed,expired)`);
    assert.equal(init.method, "PATCH");
    assert.deepEqual(JSON.parse(init.body), { paid_at: "now", status: "paid" });
  } finally {
    globalThis.fetch = original;
  }
});

// ── Status page API ────────────────────────────────────────────────────────

test("the status page shows Stripe's live outcome and keeps recorded refunds", () => {
  const pending = { status: "pending" };
  assert.equal(displayStatus(pending, { status: "complete", payment_status: "paid" }), "paid");
  assert.equal(displayStatus(pending, { status: "complete", payment_status: "unpaid" }), "processing");
  assert.equal(displayStatus(pending, { status: "expired" }), "expired");
  assert.equal(displayStatus({ status: "failed" }, { status: "open" }), "failed");
  assert.equal(displayStatus(pending, { status: "open" }), "pending");
  assert.equal(displayStatus({ status: "refunded" }, { status: "complete", payment_status: "paid" }), "refunded");
  assert.equal(displayStatus({ status: "paid" }, null), "paid");
  assert.equal(maskEmail("ann@example.com"), "a••@example.com");
  assert.equal(maskEmail(""), null);
});

test("payment status needs a real session id and reveals no full personal data", async () => {
  const handler = createCheckoutStatusHandler({
    settings: () => paymentSettings(TEST_ENV),
    storageReady: () => true,
    find: async ({ stripe_checkout_session_id: id }) =>
      id === "cs_test_a1b2c3d4e5f6" ? { ...basePayment(), service_slug: "landing-page", service_name: "Simple Landing Page", paid_at: null } : null,
    stripe: async () => ({ status: "complete", payment_status: "paid" }),
    rateLimit: false,
  });
  const ask = async (query, method = "GET") => {
    const res = response();
    await handler({ method, url: `/api/checkout-status${query}`, headers: {} }, res);
    return res;
  };
  assert.equal((await ask("")).statusCode, 400);
  assert.equal((await ask("?session_id=cs_test_../../x")).statusCode, 400);
  assert.equal((await ask("?session_id=cs_test_a1b2c3d4e5f6", "POST")).statusCode, 405);
  assert.equal((await ask("?session_id=cs_test_zzzzzzzzzzzz")).statusCode, 404);
  const ok = await ask("?session_id=cs_test_a1b2c3d4e5f6");
  assert.equal(ok.statusCode, 200);
  assert.equal(ok.body.status, "paid");
  assert.equal(ok.body.amount, 9900);
  assert.equal(ok.body.email, "a••@example.com");
  assert.equal(ok.body.testMode, true);
  assert.equal(ok.body.reference, "11111111");
  assert.ok(!JSON.stringify(ok.body).includes("ann@example.com"));
  assert.ok(!JSON.stringify(ok.body).includes("Ann Buyer"));
});

// ── Pages ──────────────────────────────────────────────────────────────────

// Pages read the payment switch when they are built, so each mode renders in its own process.
function renderWith(env, path) {
  return execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `const { renderPage } = await import("./src/layout.js");
       const { pageByPath } = await import("./src/pages.js");
       process.stdout.write(renderPage(pageByPath.get(${JSON.stringify(path)})));`,
    ],
    { env: { PATH: process.env.PATH, ...env }, encoding: "utf8" },
  );
}
const ENABLED = { ...TEST_ENV, SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "k" };

test("without Stripe configured, no page offers to take a payment", () => {
  const pricing = renderWith({}, "/pricing");
  assert.ok(!pricing.includes("/checkout"));
  assert.ok(pricing.includes("This website does not take payments."));
  assert.ok(renderWith({}, "/checkout").includes("Online payment isn’t available yet."));
  assert.ok(!renderWith({}, "/privacy").includes("Stripe"));
});

test("with checkout on, /pricing and the service pages link each service to its checkout", () => {
  const pricing = renderWith(ENABLED, "/pricing");
  for (const item of purchasableItems().filter((i) => !i.package))
    assert.ok(pricing.includes(`href="/checkout?service=${item.slug}"`), item.slug);
  assert.ok(pricing.includes(`href="/checkout?service=growth-launch-package"`));
  assert.ok(!pricing.includes("service=website-care"));
  assert.ok(!pricing.includes("service=test-payment"));
  assert.ok(!pricing.includes("This website does not take payments."));
  assert.ok(renderWith(ENABLED, "/landing-page-design").includes(`href="/checkout?service=landing-page"`));
  const privacy = renderWith(ENABLED, "/privacy");
  assert.ok(privacy.includes("Stripe"));
  assert.ok(!renderWith(ENABLED, "/terms").includes("This website does not take payments."));
});

test("the checkout lists the £1 test payment only with a test key", () => {
  const testPage = renderWith(ENABLED, "/checkout");
  assert.ok(testPage.includes('value="test-payment"'));
  assert.ok(testPage.includes('<meta name="robots" content="noindex" />'));
  assert.ok(testPage.includes('src="/assets/checkout.js"'));
  const livePage = renderWith(
    { ...ENABLED, STRIPE_SECRET_KEY: "sk_live_x", STRIPE_LIVE_PAYMENTS: "enabled" },
    "/checkout",
  );
  assert.ok(livePage.includes('value="landing-page"'));
  assert.ok(!livePage.includes('value="test-payment"'));
  // A live key without approval sells nothing at all.
  const unapproved = renderWith({ ...ENABLED, STRIPE_SECRET_KEY: "sk_live_x" }, "/checkout");
  assert.ok(unapproved.includes("Online payment isn’t available yet."));
});
