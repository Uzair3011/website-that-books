# Veltra Media

The website for a local web, SEO, conversion and enquiry-growth studio serving
Middlesbrough and Teesside. Five services — website design, local SEO and Google
Business Profile, landing pages and CRO, AI receptionist and website chat, and
CRM/booking/follow-up automation — each sold on its own, with a free website and
Google audit as the primary call to action.

Static HTML generated at build time from plain JavaScript modules, with CSS and
browser JavaScript; Node serverless handlers do real booking and lead delivery.
No production frontend framework and no runtime dependency.

`/med-spa-growth-system` is a specialist landing page for med spas and aesthetic
clinics, and carries the original bundled offer.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:4174. Node 22+ is required. `npm run build` writes static production assets into `dist/`; Vercel builds the root `api/` functions separately. The local server provides the same clean page routes, legacy redirects, and API behavior.

## Configuration

All configuration lives in environment variables: `.env` locally (copy `.env.example`) and **Vercel → Project → Settings → Environment Variables** in production. Nothing business-specific or secret is committed. Vercel builds read Vercel variables, not GitHub repository variables, so set them in Vercel. After changing a `PUBLIC_*` variable, redeploy, because those values are written into `/assets/config.js` at build time. A malformed value fails the build instead of shipping a broken page.

| Variable                                                                 | Scope            | Purpose                                                                  |
| ------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------ |
| `PUBLIC_CONTACT_EMAIL`, `PUBLIC_CONTACT_PHONE`, `PUBLIC_WHATSAPP_NUMBER` | Public           | Email, click-to-call, and WhatsApp buttons                               |
| `PUBLIC_BOOKING_URL`                                                     | Public, optional | External scheduler link, shown only when live booking is unavailable     |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`       | **Secret**       | Live booking in Google Calendar                                          |
| `GOOGLE_CALENDAR_ID`                                                     | Server           | Calendar that receives bookings (default `primary`)                      |
| `BOOKING_*`                                                              | Server           | Time zone, hours, duration, interval, buffer, notice, horizon, Meet link |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`        | **Secret**       | Booking confirmation and internal notification email (Zoho Mail SMTP)    |
| `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL`                                      | Server           | Sender identity on booking emails                                        |
| `ADMIN_EMAIL`                                                            | Server, optional | Where the internal "new booking" email is sent (defaults to `SMTP_FROM_EMAIL`) |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN`                                 | **Secret**       | CRM/automation webhook for inquiries and bookings                        |
| `SITE_URL`                                                               | Build + server   | Canonical URLs, social image URLs, sitemap, and the same-origin check on form POSTs |

Mark secrets as **Sensitive** in Vercel. Never prefix a secret with `PUBLIC_`.

`SITE_URL` is also what the form endpoints check POST `Origin` against. If it is
set to the production domain while you develop locally, the local server rejects
its own forms with "Please submit your request from the Veltra Media website."
Run the dev server with `SITE_URL=http://localhost:4174` when testing forms;
`playwright.config.js` already does this for the browser suite.

## Live booking (Google Calendar + email)

The booking picker appears on any page carrying the shared enquiry form — today `/`, `/contact` and `/free-website-audit`.

`/contact` and `/free-website-audit` show real open times from the business calendar. Visitors pick a date and time (shown in their own time zone), add their details, and get a booked call. The event lands in your calendar (Meet link included) with the lead details in its description, and two branded emails go out over SMTP: a confirmation to the client from `SMTP_FROM_EMAIL`, and an internal notification to `ADMIN_EMAIL`.

Google Calendar events are created with `sendUpdates: "none"`, so Google never sends its own guest-invite email — that email always comes from whichever account holds `GOOGLE_REFRESH_TOKEN` (your personal Google account, if that's who ran `npm run google:auth`), not the business address, and there was previously no separate internal notification at all. `lib/email.js` (a small hand-rolled SMTP client, in keeping with this project having no runtime dependency) and `lib/email-templates.js` own that instead.

How it works:

- `GET /api/availability` builds slots from `BOOKING_HOURS` in `BOOKING_TIMEZONE`. It handles daylight saving time, removes busy time from Google free/busy (including buffers), and applies minimum notice and the booking horizon.
- `POST /api/book` validates the form, then re-checks the chosen slot against live rules and busy time before creating the event, so the client is never trusted. The event ID is derived from a per-visit booking key, so a retry after a timeout can't double-book. If two visitors book the same slot at once, the earliest event wins and the other visitor is asked to choose again. Once confirmed, the booking is forwarded to `LEAD_WEBHOOK_URL` (when set) and both booking emails are sent; both are best effort, because the calendar is the system of record — a delivery failure never undoes a real booking or reports a false one.
- If Google isn't configured or is unreachable, the page falls back to the call-request form, and never shows a false confirmation. If SMTP isn't configured, the calendar event and CRM forwarding still happen; only the two emails are skipped.

One-time setup:

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Google Calendar API**.
2. Configure the **OAuth consent screen**. With Google Workspace, choose **Internal**. With a personal Google account, choose **External** and then **publish the app (In production)**. Refresh tokens for apps left in _Testing_ expire after 7 days, and booking would stop working.
3. Create an **OAuth client ID** of type **Desktop app**. Put its ID and secret in `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
4. Run `npm run google:auth`, open the printed link, and sign in with the account that owns the booking calendar. Copy the printed `GOOGLE_REFRESH_TOKEN`.
5. Add the three `GOOGLE_*` values (Sensitive), plus any `BOOKING_*` overrides, in Vercel for Production (and Preview if wanted). Then redeploy.
6. In [Zoho Mail](https://mail.zoho.com/) → **Security** → **App Passwords**, create an app password for the mailbox that should send booking emails (e.g. `hello@veltramedia.com`). Set `SMTP_HOST` (`smtp.zoho.com`, or `smtp.zoho.eu` for an EU-hosted mailbox), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`, and `ADMIN_EMAIL` (Sensitive) in Vercel. Then redeploy.
7. Make a test booking on the live site and confirm the calendar event, the client confirmation email, and the internal notification email all arrive — and that the confirmation email's sender is `SMTP_FROM_EMAIL`, not a personal Gmail address.

Scopes requested: `calendar.events` and `calendar.freebusy` only. To revoke access, remove the app at myaccount.google.com/permissions.

## Lead intake

The request form validates on both client and server. An accepted request is forwarded with a UUID, timestamp, consent wording, and privacy-policy version. It is never logged or saved to browser storage. Unconfigured intake returns 503 and tells the visitor no request was sent. Upstream failure returns 502 without a fake success.

The endpoints accept same-origin JSON only, cap payload size, include a honeypot, time out upstream requests, and limit repeated requests. The in-memory limiter works per serverless instance, not as a global anti-abuse system; use host or provider protection for global limits.

## Structure

Pages are rendered from JavaScript modules at build time. `scripts/dev.mjs` and
`scripts/build.mjs` both call the same renderer, so a route cannot drift between
local development and production. There is no client-side framework: the output
is plain static HTML.

- `src/pages.js`: the route table, the redirect map, and the source of the sitemap.
- `src/pages/*.js`: one module per route, each exporting `{ path, title, description, jsonLd, body }`.
- `src/layout.js`: the document shell — head, metadata, Open Graph, structured data, header, footer.
- `src/site.js`: business facts, navigation, the five services, shared sections and JSON-LD builders.
- `src/service-page.js`: the shared layout behind the five service pages.
- `src/form.js`: the enquiry/audit form markup, whose element ids are a contract with `assets/app.js` and `api/`.
- `assets/styles.css`: the design system — tokens, typography scale, layout primitives, light/dark themes, reduced motion.
- `assets/work/*.svg`: the website mockups used as imagery. Items labelled "design example" are not client projects.
- `assets/app.js`: navigation, theme, contact-link wiring, the med-spa calculator, and enquiry/booking states.
- `assets/business.js`: the med-spa bundle's fixed offer expiry, pricing and ROI math.
- `assets/validation.js`: shared field validation and normalization, used by the browser and the API.
- `lib/`: request guards, availability rules, Google Calendar client, SMTP client and templates, public config generation.
- `api/`: Vercel availability, booking, inquiry and readiness handlers.
- `scripts/`: dependency-free local server, production build, Google authorization helper.
- `tests/`: unit tests for business rules and endpoints, build/SEO tests, and desktop/mobile browser tests.
- `docs/positioning.md`: sourced niche research and rationale for the med-spa offer.

### Routes

`/` `/web-design-middlesbrough` `/local-seo-middlesbrough` `/landing-page-design`
`/ai-automation-middlesbrough` `/crm-booking-automation` `/work` `/about`
`/free-website-audit` `/contact` `/resources` `/pricing` `/med-spa-growth-system`
`/privacy` `/terms`, plus a `noindex` 404.

Adding a page means adding a module under `src/pages/` and listing it in
`src/pages.js`. The sitemap, the internal-link test and the SEO tests pick it up
automatically. Redirects live in `src/pages.js` for the dev server and in
`vercel.json` for production; keep the two in step.

## Brand assets

The palette is **measured, not estimated**: every value was sampled pixel-by-pixel
from screenshots of the approved homepage concept (`veltra-homepage-concept`).
It is declared once, as custom properties at the top of `assets/styles.css`.

| Role                              | Value     |
| --------------------------------- | --------- |
| Cream canvas                      | `#F4F5EF` |
| Dark canvas, ink, black buttons   | `#071313` |
| Dark card                         | `#112624` |
| Lime (action, numbering)          | `#C9FF4A` |
| Teal (panels, eyebrows, badges)   | `#83E7DA` |
| Body text on cream                | `#66706D` |
| Muted text on dark                | `#A7B6B3` |
| Borders (light / dark)            | `#D5D7D2` / `#263A38` |

Two accents with distinct jobs: lime is the action colour (primary buttons,
process numerals, ticks); teal is the atmosphere colour (the closing CTA panel,
eyebrows and footer headings on dark, the phone badge). Black pill buttons are
used for the header CTA and form submit, as on the concept.

**Contrast rule:** neither accent is ever used as *text* on the cream canvas
(1.07:1 and 1.33:1). There they appear only as fills carrying ink, or on dark
surfaces. `npm run test:browser` runs axe WCAG AA in both themes to enforce it.

Two values are derived, not sampled, and are marked as such in the stylesheet:
`--accent-lime-strong` (the button hover shade) and the dark-mode `sunken` and
`raised` surface steps.

The logo is a near-black rounded square with a lime "V" (`.logo-mark`), also
rendered as `assets/favicon.svg`, `favicon.ico`, `apple-touch-icon.png` and the
social card. Manrope is self-hosted; `assets/logo-*.svg` are legacy and unused.
No external fonts, stock photos, tracking pixels or third-party widgets load.

### Imagery

`assets/work/` holds hand-built SVG website mockups. They are labelled on the
site as **design examples** — they show how a given kind of site is structured,
and they are not client projects. Replace them with real screenshots as client
permission allows, keeping the 1280×900 canvas so the portfolio grid stays
aligned, and update the `alt` text with it.

## Pricing maintenance

The site sells in **GBP only**. There is one price list, on `/pricing`, defined
in `src/pages/pricing.js`: website packages £495 / £895 / £1,495, individual
services priced separately, and an optional £2,195 connected setup.

`/med-spa-growth-system` has **no bundle price of its own**. It is four of those
standard services at those same prices — Business website £895, AI receptionist
£495, website chat £295, CRM/booking/follow-up £395, £2,080 in total — composed
in `assets/business.js`, which is also what the opportunity calculator and the
`/terms` clauses read from. Optional website care is £49 a month; AI provider
usage is passed through at cost.

If a component price changes on `/pricing`, change it in `assets/business.js`
too. `npm test` fails if the two disagree, if any page shows a dollar amount or
the string "USD", or if the retired launch offer reappears in copy.

The previous USD bundle ($2,490 launch / $3,490 standard / $399 per month, with
a 31 October 2026 deadline, a client/admin dashboard line and 200 voice minutes
plus 500 SMS segments a month) has been retired. Reintroducing any of it means
reintroducing a second currency, so treat it as a commercial decision first.

## Validation

```sh
npm test
npx playwright install chromium webkit
npm run test:browser
npm run build
```

Browser tests cover desktop Chromium, mobile Chromium and mobile Safari: every route, internal links, 404 and legacy redirects, unique canonical/title/description per page, valid structured data, responsive widths from 320px to 1920px, theme persistence, menu, FAQs, ROI changes, form validation, success/error preservation, configured contact links, the no-JavaScript fallback, and WCAG AA automated checks in both themes. `npm test` additionally asserts the production build's canonicals, sitemap, robots file and one-H1-per-page rule, and fails if any structured data claims a rating, review count or street address. Form success tests use an intercepted provider response; the endpoint tests independently exercise accepted and rejected deliveries. An actual live destination still needs to be connected and verified before production use.

## Analytics and Search Console

**Vercel Web Analytics is installed.** `src/layout.js` loads
`/_vercel/insights/script.js` on every page. Vercel serves it from the site's own
domain, so the existing `'self'` Content-Security-Policy already allows it. It is
cookieless, and `/privacy` and `/cookie-policy` name it. The script only exists
on Vercel deployments, so it 404s harmlessly under `npm run dev`. Page views
appear in the Vercel project's Analytics tab.

There is no Google Analytics, no Google Tag Manager, no Search Console
verification tag and no third-party pixel. Search Console cannot be connected
from code alone. To do it:

1. **Search Console** — add `https://www.veltramedia.com` as a property. Prefer
   DNS (TXT record) verification, which needs no site change. If you use the
   HTML-tag method instead, add the `<meta name="google-site-verification">` tag
   to the `<head>` in `src/layout.js` so it ships on every page.
2. **Submit the sitemap** at `https://www.veltramedia.com/sitemap.xml`.
3. **Other analytics** — if you add GA4 or another third-party tool, the
   Content-Security-Policy in `vercel.json` must be widened to allow that origin
   in `script-src` and `connect-src`. Do not loosen the policy to a wildcard.
4. **Update `/privacy`** (`src/pages/privacy.js`) and `/cookie-policy` to name
   whatever else you connect.
5. **Conversion events** — the events worth tracking are
   primary CTA click, form start, form submit, booking confirmed, phone click and
   email click. `assets/app.js` already has the exact points in the submit and
   booking-confirmation paths where these should fire.

## Redesign notes

The site was previously a single-funnel med-spa offer across nine hand-written
HTML files that each duplicated roughly 200 lines of `<head>`, an inline SVG
sprite, header and footer. It is now fifteen routes rendered from one shared
layout, which is why `src/` exists.

What was kept unchanged: the booking pipeline (`api/`, `lib/`), the shared
validation used by both the browser and the server, the SMTP email templates,
the public-config build step, rate limiting, the honeypot, the same-origin POST
check and the security headers. The enquiry form's element ids are a deliberate
contract with `assets/app.js` and the API handlers — changing them silently
breaks booking.

The three former med-spa landing pages (`/ai-receptionist-for-med-spas`,
`/med-spa-website-design`, `/med-spa-online-booking`) now permanently redirect
into `/med-spa-growth-system`, which keeps their content, the bundled offer and
the ROI calculator. Earlier history retains the original design; the very first
homepage URL still redirects to `/`.
