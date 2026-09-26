// POST /api/leads: where the AI calling agent and website chatbot send the leads they capture.
// Server-to-server only, authenticated with LEAD_INGEST_TOKEN as a bearer token. Transcripts
// make these bodies larger than the website forms', so it has its own size limit.
import { createHash, timingSafeEqual } from "node:crypto";
import { normalizePhone } from "../assets/validation.js";
import { leadsConfigured, saveLead } from "../lib/leads.js";

const MAX_BODY_BYTES = 256 * 1024;
const text = (value, max) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;
const digest = (value) => createHash("sha256").update(String(value)).digest();

function authorized(req, token) {
  const header = String(req.headers.authorization || "");
  const supplied = header.startsWith("Bearer ") ? header.slice(7) : "";
  // Hashing first keeps the comparison constant-time regardless of length.
  return Boolean(supplied) && timingSafeEqual(digest(supplied), digest(token));
}

export function validateAgentLead(raw) {
  const errors = {};
  const source = raw.source;
  if (!["call", "chat"].includes(source))
    errors.source = 'Use "call" or "chat".';
  const phone = normalizePhone(raw.phone, raw.dialCode);
  if (!phone) errors.phone = "A valid phone number is required.";
  const email = text(raw.email, 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Email is not valid.";
  let recordingUrl = text(raw.recordingUrl, 1000);
  if (recordingUrl) {
    try {
      if (new URL(recordingUrl).protocol !== "https:") throw new Error();
    } catch {
      recordingUrl = null;
    }
  }
  const duration = Number(raw.durationSeconds);
  const externalId = text(raw.externalId, 200);
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    lead: {
      source,
      name:
        text(raw.name, 100) ||
        (source === "call" ? "Unknown caller" : "Chat visitor"),
      email,
      phone,
      business: text(raw.businessName, 150),
      service: text(raw.service, 100),
      reference: externalId && `${source}:${externalId}`,
      details: {
        summary: text(raw.summary, 5000),
        transcript: text(raw.transcript, 100000),
        recordingUrl,
        durationSeconds:
          Number.isFinite(duration) && duration >= 0
            ? Math.round(duration)
            : null,
        agent: text(raw.agent, 100),
      },
    },
  };
}

export function createLeadIngestHandler({
  store = saveLead,
  stored = leadsConfigured,
  token = () => process.env.LEAD_INGEST_TOKEN,
} = {}) {
  return async function leads(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, message: "Use POST." });
    }
    const secret = token();
    if (!secret || !stored())
      return res
        .status(503)
        .json({ ok: false, message: "Lead intake is not configured." });
    if (!authorized(req, secret))
      return res.status(401).json({ ok: false, message: "Unauthorized." });
    let raw = req.body;
    try {
      if (typeof raw === "string") raw = JSON.parse(raw);
      if (!raw || typeof raw !== "object" || Array.isArray(raw))
        throw new Error();
      if (Buffer.byteLength(JSON.stringify(raw)) > MAX_BODY_BYTES)
        return res.status(413).json({ ok: false, message: "Too large." });
    } catch {
      return res.status(400).json({ ok: false, message: "Send JSON." });
    }
    const { valid, errors, lead } = validateAgentLead(raw);
    if (!valid) return res.status(422).json({ ok: false, errors });
    try {
      await store(lead);
      return res.status(200).json({ ok: true });
    } catch {
      return res
        .status(502)
        .json({ ok: false, message: "The lead could not be stored." });
    }
  };
}
export default createLeadIngestHandler();
