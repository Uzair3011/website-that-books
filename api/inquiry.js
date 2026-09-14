import { validateInquiry } from "../assets/validation.js";
import { randomUUID } from "node:crypto";

const buckets = new Map();
const LIMIT = 6;
const WINDOW = 10 * 60 * 1000;
export function hasIntake() {
  try {
    return new URL(process.env.LEAD_WEBHOOK_URL).protocol === "https:";
  } catch {
    return false;
  }
}
export function createInquiryHandler({
  deliver,
  configured,
  now = Date.now,
  rateLimit = true,
} = {}) {
  return async function inquiry(req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res
        .status(405)
        .json({
          ok: false,
          message: "Please submit the inquiry form using POST.",
        });
    }
    const origin = req.headers.origin;
    const expected = process.env.SITE_URL || `https://${req.headers.host}`;
    if (origin) {
      try {
        if (new URL(origin).host !== new URL(expected).host)
          return res
            .status(403)
            .json({
              ok: false,
              message:
                "Please submit your request from the Veltra Media website.",
            });
      } catch {
        return res
          .status(403)
          .json({ ok: false, message: "Invalid request origin." });
      }
    }
    if (
      !(req.headers["content-type"] || "")
        .toLowerCase()
        .startsWith("application/json")
    )
      return res
        .status(415)
        .json({ ok: false, message: "Please use the website inquiry form." });
    let raw = req.body;
    try {
      if (typeof raw === "string") raw = JSON.parse(raw);
      if (!raw || typeof raw !== "object" || Array.isArray(raw))
        throw new Error();
      if (Buffer.byteLength(JSON.stringify(raw)) > 8192)
        return res
          .status(413)
          .json({
            ok: false,
            message: "Your request is too long. Please shorten your message.",
          });
    } catch {
      return res
        .status(400)
        .json({
          ok: false,
          message: "We couldn’t read your request. Please try again.",
        });
    }
    if (raw.fax)
      return res
        .status(400)
        .json({ ok: false, message: "Unable to process this request." });
    const { data, errors, valid } = validateInquiry(raw);
    if (!valid)
      return res
        .status(422)
        .json({
          ok: false,
          errors,
          message: "Please check the highlighted fields.",
        });
    if (!(configured ? configured() : hasIntake()))
      return res
        .status(503)
        .json({
          ok: false,
          message:
            "Online requests are temporarily unavailable. Your request has not been sent. Please use a direct contact option, or try again later.",
        });
    if (rateLimit) {
      const stamp = now();
      for (const [key, value] of buckets)
        if (value.expires <= stamp) buckets.delete(key);
      const address = String(
        req.headers["x-forwarded-for"] ||
          req.socket?.remoteAddress ||
          "unknown",
      )
        .split(",")[0]
        .trim();
      const bucket = buckets.get(address) || {
        count: 0,
        expires: stamp + WINDOW,
      };
      if (bucket.count >= LIMIT) {
        res.setHeader(
          "Retry-After",
          String(Math.ceil((bucket.expires - stamp) / 1000)),
        );
        return res
          .status(429)
          .json({
            ok: false,
            message:
              "Too many requests. Please wait a few minutes before trying again.",
          });
      }
      bucket.count++;
      buckets.set(address, bucket);
    }
    const payload = {
      ...data,
      source: "veltra-media-strategy-call",
      submittedAt: new Date(now()).toISOString(),
      requestId: randomUUID(),
      consentText: "Contact me about this request; no marketing subscription.",
      privacyVersion: "2026-09-13",
    };
    try {
      const send =
        deliver ||
        (async (body) => {
          const headers = { "Content-Type": "application/json" };
          if (process.env.LEAD_WEBHOOK_TOKEN)
            headers.Authorization = `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}`;
          const result = await fetch(process.env.LEAD_WEBHOOK_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(8000),
            redirect: "error",
          });
          if (!result.ok) throw new Error("Upstream rejected inquiry");
        });
      await send(payload);
      return res.status(200).json({ ok: true });
    } catch {
      // No personal data, provider payloads, secrets, or speculative success in logs/responses.
      return res
        .status(502)
        .json({
          ok: false,
          message:
            "We couldn’t confirm delivery. Your details are still in the form. Please use a direct contact option or try again.",
        });
    }
  };
}
export default createInquiryHandler();
