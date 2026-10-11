// Creates or updates everything the lead dashboard and payments need in Supabase. Safe to re-run.
//   npm run db:setup                    schema, security rules, realtime, admin account,
//                                       and the services price list from assets/catalog.js
//   npm run db:setup -- --reset-password  also issues a new admin password
// Needs the variables the Vercel Supabase integration provides (vercel env pull .env.local).
import { randomInt } from "node:crypto";
import postgres from "postgres";
import { CATALOG, CURRENCY, amountMinor } from "../assets/catalog.js";

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

// Payments. Stripe is the source of truth for money; these tables are the site's record of what
// was bought. Only the service role (the checkout API and the verified Stripe webhook) writes to
// them. Signed-in clients can read: the lead admin sees every payment, and a customer account,
// if one is ever linked through user_id, sees only its own. Nobody can write from a browser.
const paymentsSchema = `
create or replace function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- The price list checkout charges from, copied from assets/catalog.js below. Amounts are in
-- minor units (pence). Rows are never deleted, so old payments keep their service.
create table if not exists public.services (
  slug text primary key check (slug ~ '^[a-z0-9-]{2,60}$'),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 500),
  amount integer not null check (amount > 0),
  currency text not null default 'gbp' check (currency ~ '^[a-z]{3}$'),
  purchasable boolean not null default false,
  test_only boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists services_touch_updated_at on public.services;
create trigger services_touch_updated_at before update on public.services
  for each row execute function private.touch_updated_at();

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  service_slug text not null references public.services (slug) on update cascade,
  service_name text not null check (char_length(service_name) between 1 and 120),
  amount integer not null check (amount > 0),
  amount_total integer check (amount_total is null or amount_total >= 0),
  amount_refunded integer not null default 0 check (amount_refunded >= 0),
  currency text not null check (currency ~ '^[a-z]{3}$'),
  status text not null default 'pending' check (status in
    ('pending', 'processing', 'paid', 'failed', 'expired', 'refunded', 'partially_refunded')),
  livemode boolean not null,
  user_id uuid references auth.users (id) on delete set null,
  customer_name text check (customer_name is null or char_length(customer_name) <= 100),
  customer_email text check (customer_email is null or char_length(customer_email) <= 254),
  customer_phone text check (customer_phone is null or char_length(customer_phone) <= 30),
  business_name text check (business_name is null or char_length(business_name) <= 150),
  stripe_checkout_session_id text unique
    check (stripe_checkout_session_id is null or stripe_checkout_session_id ~ '^cs_(test|live)_'),
  stripe_payment_intent_id text unique
    check (stripe_payment_intent_id is null or stripe_payment_intent_id ~ '^pi_'),
  stripe_customer_id text check (stripe_customer_id is null or stripe_customer_id ~ '^cus_'),
  paid_at timestamptz,
  failed_at timestamptz,
  refunded_at timestamptz,
  details jsonb not null default '{}'::jsonb,
  constraint payments_refund_within_total
    check (amount_refunded <= coalesce(amount_total, amount)),
  -- A cs_live_ session is a live payment and a cs_test_ session a test one, nothing else.
  constraint payments_session_matches_mode
    check (stripe_checkout_session_id is null
      or (stripe_checkout_session_id like 'cs_live_%') = livemode)
);
create index if not exists payments_created_at_idx on public.payments (created_at desc);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_service_slug_idx on public.payments (service_slug);
create index if not exists payments_customer_email_idx on public.payments (lower(customer_email));
create index if not exists payments_user_id_idx on public.payments (user_id)
  where user_id is not null;
drop trigger if exists payments_touch_updated_at on public.payments;
create trigger payments_touch_updated_at before update on public.payments
  for each row execute function private.touch_updated_at();

-- The £1 test item can never be recorded as a live payment, whatever the code does.
create or replace function private.payments_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.livemode and exists (
    select 1 from public.services s where s.slug = new.service_slug and s.test_only
  ) then
    raise exception 'Test-only service % cannot be a live payment', new.service_slug;
  end if;
  -- What was bought, for how much and in which mode is fixed once recorded.
  if tg_op = 'UPDATE' and (
    new.service_slug is distinct from old.service_slug
    or new.amount is distinct from old.amount
    or new.currency is distinct from old.currency
    or new.livemode is distinct from old.livemode
    or (old.stripe_checkout_session_id is not null
      and new.stripe_checkout_session_id is distinct from old.stripe_checkout_session_id)
  ) then
    raise exception 'A payment''s service, amount, currency, mode and session cannot change';
  end if;
  return new;
end $$;
drop trigger if exists payments_guard on public.payments;
create trigger payments_guard before insert or update on public.payments
  for each row execute function private.payments_guard();

-- Every Stripe webhook event id seen, so a redelivered event is never applied twice.
create table if not exists public.stripe_events (
  id text primary key check (id ~ '^evt_'),
  type text not null check (char_length(type) <= 100),
  livemode boolean not null,
  payment_id uuid references public.payments (id) on delete set null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
create index if not exists stripe_events_payment_id_idx on public.stripe_events (payment_id);

alter table public.services enable row level security;
alter table public.payments enable row level security;
alter table public.stripe_events enable row level security;
revoke all on public.services, public.payments, public.stripe_events from anon, authenticated;
grant select on public.services, public.payments to authenticated;
drop policy if exists "lead admin reads services" on public.services;
create policy "lead admin reads services" on public.services for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'lead_admin');
drop policy if exists "lead admin reads payments" on public.payments;
create policy "lead admin reads payments" on public.payments for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'lead_admin');
drop policy if exists "customers read their own payments" on public.payments;
create policy "customers read their own payments" on public.payments for select to authenticated
  using (user_id is not null and user_id = (select auth.uid()));
-- stripe_events has no policy at all: only the service role can touch it.

do $$ begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'payments'
  ) then
    alter publication supabase_realtime add table public.payments;
  end if;
end $$;
`;

// The services table mirrors assets/catalog.js. Anything dropped from the catalogue stops being
// purchasable but stays, because past payments refer to it.
async function syncServices(sql) {
  const rows = CATALOG.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    amount: amountMinor(item),
    currency: CURRENCY.toLowerCase(),
    purchasable: item.purchasable,
    test_only: item.testOnly,
  }));
  await sql`
    insert into public.services ${sql(rows)}
    on conflict (slug) do update set
      name = excluded.name, description = excluded.description, amount = excluded.amount,
      currency = excluded.currency, purchasable = excluded.purchasable, test_only = excluded.test_only
    where (services.name, services.description, services.amount, services.currency,
      services.purchasable, services.test_only) is distinct from (excluded.name,
      excluded.description, excluded.amount, excluded.currency, excluded.purchasable,
      excluded.test_only)`;
  await sql`update public.services set purchasable = false
    where purchasable and slug not in ${sql(rows.map((row) => row.slug))}`;
}

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
  await sql.unsafe(paymentsSchema);
  await syncServices(sql);
  console.log(`✓ payments tables ready; ${CATALOG.length} services synced from the catalogue`);
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
