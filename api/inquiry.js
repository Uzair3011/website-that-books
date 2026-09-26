import { validateInquiry } from "../assets/validation.js";
import { randomUUID } from "node:crypto";
import { inquiryAdminEmail } from "../lib/email-templates.js";
import { adminAddress, emailConfigured, sendEmail } from "../lib/email.js";
import {
  createRateLimiter,
  readJsonPost,
  sendRateLimited,
} from "../lib/http.js";
import { leadsConfigured, saveLead } from "../lib/leads.js";

export const PRIVACY_VERSION = "2026-09-26";
export const CONSENT_TEXT =
  "Contact me about this request; no marketing subscription.";
const limiter = createRateLimiter({ limit: 6, windowMs: 10 * 60 * 1000 });

export function hasIntake() {
  try {
    return new URL(process.env.LEAD_WEBHOOK_URL).protocol === "https:";
  } catch {
    return false;
  }
}
export async function deliverToWebhook(body) {
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
}

// The page the form was sent from, kept only if it looks like a site path.
export function formPage(raw) {
  return typeof raw.page === "string" && /^\/[\w\-/]{0,120}$/.test(raw.page)
    ? raw.page
    : null;
}

export function createInquiryHandler({
  store = saveLead,
  stored = leadsConfigured,
  deliver = deliverToWebhook,
  configured = hasIntake,
  notifyAdmin = async (payload) => {
    if (!emailConfigured()) return;
    await sendEmail({
      html: inquiryAdminEmail(payload),
      replyTo: payload.email,
      subject: `New website enquiry - ${payload.name}`,
      to: adminAddress(),
    });
  },
  now = Date.now,
  rateLimit = true,
} = {}) {
  return async function inquiry(req, res) {
    const raw = readJsonPost(req, res);
    if (!raw) return;
    const { data, errors, valid } = validateInquiry(raw);
    if (!valid)
      return res.status(422).json({
        ok: false,
        errors,
        message: "Please check the highlighted fields.",
      });
    const toStore = stored();
    const toWebhook = configured();
    if (!toStore && !toWebhook)
      return res.status(503).json({
        ok: false,
        message:
          "Online requests are temporarily unavailable. Your request has not been sent. Please use a direct contact option, or try again later.",
      });
    if (rateLimit) {
      const { limited, retryAfter } = limiter(req, now());
      if (limited) return sendRateLimited(res, retryAfter);
    }
    const payload = {
      ...data,
      source: "veltra-media-strategy-call",
      page: formPage(raw),
      submittedAt: new Date(now()).toISOString(),
      requestId: randomUUID(),
      consentText: CONSENT_TEXT,
      privacyVersion: PRIVACY_VERSION,
    };
    const deliveries = await Promise.allSettled([
      toStore &&
        store({
          ...data,
          source: "website",
          reference: payload.requestId,
          details: {
            page: payload.page,
            consentText: CONSENT_TEXT,
            privacyVersion: PRIVACY_VERSION,
          },
        }),
      toWebhook && deliver(payload),
    ]);
    // Success means at least one destination we actually tried accepted the lead.
    const delivered = deliveries.some(
      (result, index) =>
        [toStore, toWebhook][index] && result.status === "fulfilled",
    );
    if (!delivered)
      // No personal data, provider payloads, secrets, or speculative success in logs/responses.
      return res.status(502).json({
        ok: false,
        message:
          "We couldn’t confirm delivery. Your details are still in the form. Please use a direct contact option or try again.",
      });
    await notifyAdmin(payload).catch(() => {});
    return res.status(200).json({ ok: true });
  };
}
export default createInquiryHandler();
