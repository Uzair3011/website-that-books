// Stripe over its REST API with fetch, matching the raw-fetch clients used for Google Calendar
// and Supabase, so payments add no runtime dependency. Server-only: the secret key never leaves
// this process. Card details never touch our servers either; customers pay on Stripe Checkout.
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.stripe.com/v1";
// Stripe's own default: signatures older than five minutes are treated as replays.
export const SIGNATURE_TOLERANCE_SECONDS = 300;

/** "test" or "live" from the key prefix; anything else is not a usable key. */
export function stripeMode(key) {
  const match = /^(?:sk|rk)_(test|live)_[A-Za-z0-9]+$/.exec(key || "");
  return match ? match[1] : null;
}

// Payments are on when a valid key and webhook secret are set. A live key additionally needs
// STRIPE_LIVE_PAYMENTS=enabled, so pasting the wrong key can never start taking real money.
export function paymentSettings(env = process.env) {
  const key = env.STRIPE_SECRET_KEY || "";
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET || "";
  const mode = stripeMode(key);
  const liveApproved = env.STRIPE_LIVE_PAYMENTS === "enabled";
  const taxRate = /^txr_[A-Za-z0-9]+$/.test(env.STRIPE_TAX_RATE_ID || "")
    ? env.STRIPE_TAX_RATE_ID
    : null;
  return {
    key,
    webhookSecret,
    mode,
    testMode: mode === "test",
    taxRate,
    enabled:
      Boolean(mode && /^whsec_/.test(webhookSecret)) &&
      (mode === "test" || liveApproved),
  };
}

/** Flattens nested objects and arrays into Stripe's bracketed form encoding. */
export function formEncode(value, prefix = "", out = new URLSearchParams()) {
  if (value === undefined || value === null) return out;
  if (Array.isArray(value))
    value.forEach((entry, index) =>
      formEncode(entry, `${prefix}[${index}]`, out),
    );
  else if (typeof value === "object")
    for (const [key, entry] of Object.entries(value))
      formEncode(entry, prefix ? `${prefix}[${key}]` : key, out);
  else out.append(prefix, String(value));
  return out;
}

export async function stripeRequest(
  path,
  { method = "GET", params, idempotencyKey, env = process.env } = {},
) {
  const { key } = paymentSettings(env);
  if (!stripeMode(key)) throw new Error("Stripe is not configured");
  const body = params && formEncode(params).toString();
  const url = method === "GET" && body ? `${API}/${path}?${body}` : `${API}/${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(method !== "GET" && {
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      ...(idempotencyKey && { "Idempotency-Key": idempotencyKey }),
    },
    body: method === "GET" ? undefined : body,
    signal: AbortSignal.timeout(10000),
    redirect: "error",
  });
  const result = await response.json().catch(() => ({}));
  // Stripe's message can echo request data, so only its type and code leave this function.
  if (!response.ok) {
    const error = new Error("Stripe rejected the request");
    error.type = result.error?.type;
    error.code = result.error?.code;
    error.status = response.status;
    throw error;
  }
  return result;
}

/**
 * Verifies a Stripe-Signature header against the raw request body and returns the parsed
 * event, or null. Any v1 signature may match (Stripe sends several while a secret rolls).
 */
export function verifyStripeEvent(
  rawBody,
  header,
  secret,
  { now = Date.now(), tolerance = SIGNATURE_TOLERANCE_SECONDS } = {},
) {
  if (!secret || typeof header !== "string") return null;
  const parts = header.split(",").map((part) => part.trim().split("="));
  const timestamp = Number(parts.find(([k]) => k === "t")?.[1]);
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!Number.isInteger(timestamp) || !signatures.length) return null;
  if (Math.abs(now / 1000 - timestamp) > tolerance) return null;
  const payload = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody || "");
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.`)
    .update(payload)
    .digest();
  const matched = signatures.some((signature) => {
    if (!/^[0-9a-f]{64}$/.test(signature)) return false;
    return timingSafeEqual(expected, Buffer.from(signature, "hex"));
  });
  if (!matched) return null;
  try {
    const event = JSON.parse(payload.toString("utf8"));
    return event && typeof event.id === "string" && event.data?.object
      ? event
      : null;
  } catch {
    return null;
  }
}

/** Builds a valid signature header; used by the tests and the local webhook self-test. */
export function signStripePayload(payload, secret, timestamp = Math.floor(Date.now() / 1000)) {
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}
