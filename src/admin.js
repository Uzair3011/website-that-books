// The private lead dashboard at /admin. Rendered like every other page, but with its own
// chrome and no lead data: the browser signs in and reads leads directly from Supabase, where
// row-level security only answers the admin account. The URL and anon key are public by design.
import { esc } from "./site.js";

export function adminConfig(env = process.env) {
  return {
    url: env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "",
    key:
      env.SUPABASE_ANON_KEY ||
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      env.SUPABASE_PUBLISHABLE_KEY ||
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "",
  };
}

export function renderAdminPage(config = adminConfig()) {
  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Leads · Veltra Media</title>
    <meta name="theme-color" content="#f4f5ef" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="/assets/admin.css" />
    <script src="/assets/theme.js"></script>
    <script src="/assets/vendor/supabase.js" defer></script>
    <script src="/assets/admin.js" defer></script>
  </head>
  <body class="admin" data-supabase-url="${esc(config.url)}" data-supabase-key="${esc(config.key)}">
    <main class="login" id="login" hidden>
      <form class="login-card" id="login-form" novalidate>
        <span class="brand-mark" aria-hidden="true">V</span>
        <h1>Lead dashboard</h1>
        <p class="muted">Private to Veltra Media. Sign in to see new leads as they arrive.</p>
        <label for="login-email">Email</label>
        <input id="login-email" name="email" type="email" autocomplete="username" required />
        <label for="login-password">Password</label>
        <input id="login-password" name="password" type="password" autocomplete="current-password" required />
        <p class="form-error" id="login-error" role="alert"></p>
        <button class="a-btn primary block" type="submit" id="login-submit">Sign in</button>
      </form>
    </main>

    <div class="app" id="app" hidden>
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="/admin"><span class="brand-mark" aria-hidden="true">V</span><span>Veltra Media <b>Leads</b></span></a>
          <span class="live" id="live" data-state="connecting" role="status"><i aria-hidden="true"></i><span id="live-label">Connecting…</span></span>
          <div class="topbar-actions">
            <button class="a-btn ghost" type="button" id="alerts-toggle" aria-pressed="false" title="Desktop alerts for new leads">Alerts off</button>
            <button class="a-btn ghost icon" type="button" id="theme-toggle" aria-label="Switch light or dark theme">◐</button>
            <button class="a-btn ghost" type="button" id="sign-out">Sign out</button>
          </div>
        </div>
      </header>

      <main class="shell" id="main">
        <h1 class="visually-hidden">Leads</h1>
        <section class="stats" aria-label="Summary">
          <div class="stat"><span class="stat-label">New today</span><strong id="stat-today">–</strong></div>
          <div class="stat"><span class="stat-label">Last 7 days</span><strong id="stat-week">–</strong></div>
          <div class="stat accent"><span class="stat-label">Awaiting contact</span><strong id="stat-new">–</strong></div>
          <div class="stat"><span class="stat-label">Upcoming calls</span><strong id="stat-calls">–</strong></div>
        </section>

        <section class="toolbar" aria-label="Filters">
          <div class="search">
            <label class="visually-hidden" for="search">Search leads</label>
            <input id="search" type="search" placeholder="Search name, email, phone or business" autocomplete="off" />
          </div>
          <div class="segmented" id="source-filter" role="group" aria-label="Source"></div>
          <label class="visually-hidden" for="status-filter">Status</label>
          <select id="status-filter"></select>
          <button class="a-btn" type="button" id="export">Export CSV</button>
        </section>

        <p class="banner" id="banner" role="alert" hidden></p>

        <div class="table-card">
          <table class="leads">
            <thead>
              <tr><th scope="col">Received</th><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Phone</th><th scope="col">Business</th><th scope="col">Service</th><th scope="col">Source</th><th scope="col">Status</th></tr>
            </thead>
            <tbody id="rows"></tbody>
          </table>
          <p class="empty" id="empty">Loading leads…</p>
        </div>
        <p class="footnote" id="footnote"></p>
      </main>
    </div>

    <div class="drawer-backdrop" id="drawer-backdrop" hidden></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" hidden>
      <div class="drawer-head">
        <div>
          <p class="drawer-kicker" id="drawer-kicker"></p>
          <h2 id="drawer-title"></h2>
        </div>
        <button class="a-btn ghost icon" type="button" id="drawer-close" aria-label="Close">✕</button>
      </div>
      <div class="drawer-body" id="drawer-body"></div>
    </aside>

    <div class="toasts" id="toasts" aria-live="polite"></div>
    <noscript><p class="banner">The dashboard needs JavaScript.</p></noscript>
  </body>
</html>
`;
}
