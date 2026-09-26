// Lead storage in Supabase (Postgres) through its REST API, matching the raw-fetch approach used
// for Google Calendar. Server-only: the service role key bypasses row-level security, so it must
// never reach the browser. The admin dashboard reads leads with its own signed-in session instead.
export const LEAD_SOURCES = ["website", "booking", "call", "chat"];

function settings(env) {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? { url: parsed.origin, key } : null;
  } catch {
    return null;
  }
}

export function leadsConfigured(env = process.env) {
  return Boolean(settings(env));
}

async function rest(path, { method = "GET", body, prefer, env = process.env }) {
  const config = settings(env);
  if (!config) throw new Error("Lead storage is not configured");
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(prefer && { Prefer: prefer }),
    },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    redirect: "error",
  });
  if (!response.ok) throw new Error(`Lead storage rejected the request`);
  return response;
}

// One row per lead. `reference` makes retries idempotent: the same booking or call id is only
// stored once, and a repeat is silently ignored rather than failing the request.
export function leadRow({
  name,
  email,
  phone,
  business,
  service,
  source,
  reference,
  bookedStart,
  details = {},
}) {
  return {
    name,
    email: email || null,
    phone,
    business_name: business || null,
    service: service || null,
    source,
    reference: reference || null,
    booked_start: bookedStart || null,
    details,
  };
}

export async function saveLead(lead, env = process.env) {
  await rest("leads?on_conflict=reference", {
    method: "POST",
    body: leadRow(lead),
    prefer: "return=minimal,resolution=ignore-duplicates",
    env,
  });
}

// For conversations that save more than once (a call or chat that learns the business name
// after the phone number): details given now replace earlier ones, details left out keep what
// was already known, and the team's status and notes are never touched. Reports whether the
// lead is new, so the team is only notified once.
const given = (value) => value !== null && value !== undefined && value !== "";
export async function mergeLead(lead, env = process.env) {
  const row = leadRow(lead);
  const found = await rest(
    `leads?select=details&reference=eq.${encodeURIComponent(row.reference)}`,
    { env },
  );
  const [existing] = await found.json();
  const known = Object.fromEntries(
    Object.entries(row).filter(
      ([key, value]) => key !== "details" && given(value),
    ),
  );
  const details = {
    ...existing?.details,
    ...Object.fromEntries(
      Object.entries(row.details).filter(([, value]) => given(value)),
    ),
  };
  await rest("leads?on_conflict=reference", {
    method: "POST",
    body: { ...known, details },
    prefer: "return=minimal,resolution=merge-duplicates",
    env,
  });
  return { created: !existing };
}

// A tiny read so the free Supabase project never counts as inactive and pauses.
export async function pingLeads(env = process.env) {
  await rest("leads?select=id&limit=1", { env });
}
