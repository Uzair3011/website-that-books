// Payment records in Supabase: the services table checkout charges from, one payments row per
// checkout, and stripe_events, which makes webhook delivery idempotent. Stripe stays the source
// of truth for money; these rows are the site's record of what was bought. Server-only.
import { paymentSettings } from "./stripe.js";
import { supabaseConfigured, supabaseRest } from "./supabase.js";

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "expired",
  "refunded",
  "partially_refunded",
];

// Which statuses each update may move from. Every write is filtered on these, so a duplicate,
// late or out-of-order webhook can never undo a later state (e.g. turn "paid" back into "failed").
export const TRANSITIONS = {
  processing: ["pending"],
  paid: ["pending", "processing", "failed", "expired"],
  failed: ["pending", "processing"],
  expired: ["pending"],
  refunded: ["paid", "partially_refunded"],
  partially_refunded: ["paid", "partially_refunded"],
};

const rest = (path, options) =>
  supabaseRest(path, { ...options, failure: "Payment storage rejected the request" });
const eq = (value) => `eq.${encodeURIComponent(value)}`;

export function paymentsStorageConfigured(env = process.env) {
  return supabaseConfigured(env);
}

/**
 * Whether the site sells online. Pages read this at build time: without Stripe and Supabase
 * configured (or with a live key not yet approved), no "Buy now" button is rendered at all.
 */
export function checkoutEnabled(env = process.env) {
  return paymentSettings(env).enabled && supabaseConfigured(env);
}

/** The trusted price for a service, from the database rather than anything the browser sent. */
export async function findService(slug, env = process.env) {
  const response = await rest(
    `services?select=slug,name,description,amount,currency,purchasable,test_only&slug=${eq(slug)}&limit=1`,
    { env },
  );
  const [service] = await response.json();
  return service || null;
}

export async function createPayment(row, env = process.env) {
  await rest("payments", {
    method: "POST",
    body: row,
    prefer: "return=minimal",
    env,
  });
}

export async function findPayment(filters, env = process.env) {
  const query = Object.entries(filters)
    .map(([column, value]) => `${column}=${eq(value)}`)
    .join("&");
  const response = await rest(`payments?select=*&${query}&limit=1`, { env });
  const [payment] = await response.json();
  return payment || null;
}

/**
 * Moves a payment to `status` only if it is currently in an allowed earlier state, and returns
 * the updated row, or null when nothing changed (already there, or a later state won).
 */
export async function transitionPayment(id, status, changes = {}, env = process.env) {
  const from = TRANSITIONS[status];
  if (!from) throw new Error(`Unknown payment status ${status}`);
  const response = await rest(
    `payments?id=${eq(id)}&status=in.(${from.join(",")})`,
    {
      method: "PATCH",
      body: { ...changes, status },
      prefer: "return=representation",
      env,
    },
  );
  const [row] = await response.json();
  return row || null;
}

/** Records details that do not change the status, such as the latest decline reason. */
export async function annotatePayment(id, changes, env = process.env) {
  await rest(`payments?id=${eq(id)}`, {
    method: "PATCH",
    body: changes,
    prefer: "return=minimal",
    env,
  });
}

/**
 * Claims a webhook event. Returns "new" the first time an event id is seen, "retry" if an
 * earlier delivery was claimed but never finished, and "done" if it was already processed.
 */
export async function claimEvent(event, env = process.env) {
  const inserted = await rest("stripe_events?on_conflict=id", {
    method: "POST",
    body: { id: event.id, type: event.type, livemode: Boolean(event.livemode) },
    prefer: "return=representation,resolution=ignore-duplicates",
    env,
  });
  if ((await inserted.json()).length) return "new";
  const found = await rest(
    `stripe_events?select=processed_at&id=${eq(event.id)}`,
    { env },
  );
  const [existing] = await found.json();
  return existing?.processed_at ? "done" : "retry";
}

export async function finishEvent(eventId, paymentId, env = process.env) {
  await rest(`stripe_events?id=${eq(eventId)}`, {
    method: "PATCH",
    body: {
      processed_at: new Date().toISOString(),
      payment_id: paymentId || null,
    },
    prefer: "return=minimal",
    env,
  });
}
