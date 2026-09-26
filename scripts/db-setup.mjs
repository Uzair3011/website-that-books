// Creates or updates everything the lead dashboard needs in Supabase. Safe to re-run.
//   npm run db:setup                    schema, security rules, realtime, admin account
//   npm run db:setup -- --reset-password  also issues a new admin password
// Needs the variables the Vercel Supabase integration provides (vercel env pull .env.local).
import { randomInt } from "node:crypto";
import postgres from "postgres";

const env = process.env;
const connection =
  env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL || env.DATABASE_URL;
const apiUrl = (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "").replace(
  /\/$/,
  "",
);
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
const adminEmail = (
  env.ADMIN_DASHBOARD_EMAIL ||
  env.ADMIN_EMAIL ||
  "hello@veltramedia.com"
).toLowerCase();
const resetPassword = process.argv.includes("--reset-password");

if (!connection || !apiUrl || !serviceKey) {
  console.error(
    "Missing Supabase settings. Run `vercel env pull .env.local` first, then `npm run db:setup`.",
  );
  process.exit(1);
}

const schema = `
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text check (email is null or char_length(email) <= 254),
  phone text not null check (phone ~ '^\\+[1-9][0-9]{7,14}$'),
  business_name text check (business_name is null or char_length(business_name) <= 150),
  service text check (service is null or char_length(service) <= 100),
  source text not null check (source in ('website', 'booking', 'call', 'chat')),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'won', 'lost')),
  booked_start timestamptz,
  reference text unique,
  details jsonb not null default '{}'::jsonb,
  notes text not null default '' check (char_length(notes) <= 5000)
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

create schema if not exists private;
create or replace function private.leads_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at before update on public.leads
  for each row execute function private.leads_touch_updated_at();

-- Only the account marked lead_admin (app_metadata, which only the service role can set)
-- may read, triage or delete leads. The website writes with the service role key, which
-- bypasses these rules; the public anon key can do nothing at all.
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant select, delete on public.leads to authenticated;
grant update (status, notes) on public.leads to authenticated;
drop policy if exists "lead admin reads" on public.leads;
create policy "lead admin reads" on public.leads for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'lead_admin');
drop policy if exists "lead admin updates" on public.leads;
create policy "lead admin updates" on public.leads for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'lead_admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'lead_admin');
drop policy if exists "lead admin deletes" on public.leads;
create policy "lead admin deletes" on public.leads for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'lead_admin');

-- Live dashboard updates.
do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;
end $$;
`;

// Nobody but the dashboard owner can create an account, even with the public key.
const signupLock = (email) => `
create or replace function private.only_lead_admin_signups()
returns trigger language plpgsql set search_path = '' as $$
begin
  if lower(coalesce(new.email, '')) <> ${email} then
    raise exception 'Sign-ups are disabled for this project';
  end if;
  return new;
end $$;
grant usage on schema private to supabase_auth_admin;
grant execute on function private.only_lead_admin_signups() to supabase_auth_admin;
drop trigger if exists only_lead_admin_signups on auth.users;
create trigger only_lead_admin_signups before insert on auth.users
  for each row execute function private.only_lead_admin_signups();
`;

// Readable but strong: five groups of five from an alphabet without look-alike characters,
// with at least one upper, lower and digit so any password policy accepts it (~140 bits).
function newPassword() {
  const sets = [
    "ABCDEFGHJKMNPQRSTUVWXYZ",
    "abcdefghijkmnpqrstuvwxyz",
    "23456789",
  ];
  const all = sets.join("");
  for (;;) {
    const chars = Array.from({ length: 25 }, () => all[randomInt(all.length)]);
    if (sets.every((set) => chars.some((c) => set.includes(c))))
      return chars.join("").match(/.{5}/g).join("-");
  }
}

async function auth(path, { method = "GET", body } = {}) {
  const response = await fetch(`${apiUrl}/auth/v1/admin/${path}`, {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: body && JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      `Auth API ${method} ${path}: ${result.msg || result.message || response.status}`,
    );
  return result;
}

const sql = postgres(connection, {
  ssl: "require",
  prepare: false,
  max: 1,
  onnotice: () => {}, // "does not exist, skipping" on first run is expected
});
try {
  await sql.unsafe(schema);
  console.log("✓ leads table, security rules and realtime ready");
  try {
    await sql.unsafe(signupLock(`'${adminEmail.replaceAll("'", "''")}'`));
    console.log("✓ public sign-ups blocked");
  } catch (error) {
    console.warn(
      `! Could not block sign-ups (${error.message}). Leads stay private either way.`,
    );
  }
} finally {
  await sql.end();
}

let existing;
for (let page = 1; !existing; page++) {
  const { users = [] } = await auth(`users?page=${page}&per_page=200`);
  existing = users.find((user) => user.email?.toLowerCase() === adminEmail);
  if (users.length < 200) break;
}
const app_metadata = { role: "lead_admin" };
let password;
if (!existing) {
  password = newPassword();
  await auth("users", {
    method: "POST",
    body: { email: adminEmail, password, email_confirm: true, app_metadata },
  });
  console.log(`✓ admin account created for ${adminEmail}`);
} else {
  if (resetPassword) password = newPassword();
  await auth(`users/${existing.id}`, {
    method: "PUT",
    body: { app_metadata, ...(password && { password }) },
  });
  console.log(
    `✓ admin account ${adminEmail} ${password ? "given a new password" : "confirmed"}`,
  );
}
if (password)
  console.log(
    `\nDashboard login\n  email:    ${adminEmail}\n  password: ${password}\nStore it in a password manager; it is not saved anywhere else.`,
  );
