// Daily Vercel cron (see vercel.json). Supabase pauses free projects after a week without
// activity, which would make every form submission fail; one small read a day prevents that.
import { leadsConfigured, pingLeads } from "../lib/leads.js";

export default async function keepalive(req, res) {
  res.setHeader("Cache-Control", "no-store");
  // Vercel sends CRON_SECRET as a bearer token on scheduled invocations.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`)
    return res.status(401).json({ ok: false });
  if (!leadsConfigured()) return res.status(503).json({ ok: false });
  try {
    await pingLeads();
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false });
  }
}
