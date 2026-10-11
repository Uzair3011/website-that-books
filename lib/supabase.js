// Supabase (Postgres) through its REST API, matching the raw-fetch approach used for Google
// Calendar and Stripe. Server-only: the service role key bypasses row-level security, so it must
// never reach the browser. The admin dashboard reads with its own signed-in session instead.
export function supabaseSettings(env = process.env) {
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

export function supabaseConfigured(env = process.env) {
  return Boolean(supabaseSettings(env));
}

export async function supabaseRest(
  path,
  { method = "GET", body, prefer, env = process.env, failure = "Storage rejected the request" } = {},
) {
  const config = supabaseSettings(env);
  if (!config) throw new Error("Storage is not configured");
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
  if (!response.ok) throw new Error(failure);
  return response;
}
