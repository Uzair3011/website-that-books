# Veltra Media

A fast, responsive sales funnel for a managed med-spa customer acquisition and booking system. Plain HTML, CSS, and browser JavaScript; Node serverless handlers handle real lead delivery. No production frontend framework or runtime dependency.

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
| `SITE_URL`                                                               | Build            | Canonical URLs, social image URLs, sitemap                               |

Mark secrets as **Sensitive** in Vercel. Never prefix a secret with `PUBLIC_`.

## Live booking (Google Calendar + email)

`/contact` shows real open times from the business calendar. Visitors pick a date and time (shown in their own time zone), add their details, and get a booked call. The event lands in your calendar (Meet link included) with the lead details in its description, and two branded emails go out over SMTP: a confirmation to the client from `SMTP_FROM_EMAIL`, and an internal notification to `ADMIN_EMAIL`.

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

- `index.html`: complete funnel with system walkthrough, ROI calculator, offer, and FAQs.
- `contact.html`: live booking picker, request form fallback, and phone, WhatsApp, and email links.
- `privacy.html`, `terms.html`, `404.html`: real supporting pages.
- `assets/styles.css`: responsive design system, product illustrations, light/dark themes, reduced motion, and print behavior.
- `assets/app.js`: navigation, accessible tabs, calculator, contact-link wiring, inquiry states.
- `assets/business.js`: fixed offer expiry, pricing, and ROI math.
- `assets/validation.js`: shared field validation and normalization.
- `lib/`: shared request guards, availability rules, Google Calendar client, SMTP email client and templates, and public config generation.
- `api/`: Vercel availability, booking, inquiry, and readiness handlers.
- `scripts/`: dependency-free local server, production build, and Google authorization helper.
- `tests/`: business/endpoint unit tests and desktop/mobile browser tests.
- `docs/positioning.md`: sourced niche research and rationale for the offer.

## Brand assets

The visual palette uses midnight navy, cobalt blue, and icy cyan against warm off-white. Amber is reserved for selected follow-up and scheduling details. The wordmark and icon assets use the same blue palette in light and dark variants.

`assets/logo-dark.svg` and `assets/logo-light.svg` are outlined text wordmark variants that render without an external font. The live site uses a matching selectable text wordmark with the self-hosted Manrope font. `assets/favicon.svg`, `favicon.ico`, and `assets/apple-touch-icon.png` cover browser and touch icons. `assets/social-card.png` is the 1200×630 sharing image. The Manrope license is included beside the locally hosted font. No external fonts, stock photos, tracking pixels, or embedded third-party widgets are loaded.

## Offer maintenance

The launch price is $2,490 setup through October 31, 2026, 23:59 Los Angeles time; standard setup is $3,490. Monthly management is $399. Values are proposed commercial terms, as requested, and must be supported by actual delivery. The launch expiry is centralized in `assets/business.js`; the terms page states the exact eligibility condition. If scope or commercial terms change, update the visible copy and `/terms` together. Standalone values are explicitly estimates, not supposed historical prices. See `docs/positioning.md` for assumptions and exclusions.

## Validation

```sh
npm test
npx playwright install chromium webkit
npm run test:browser
npm run build
```

Browser tests cover desktop Chromium, mobile Chromium, and mobile Safari: important routes, local links, 404/legacy redirects, responsive widths, theme persistence, keyboard tabs, menu, FAQs, ROI changes, form validation, success/error preservation, configured contact links, and WCAG AA automated checks. Form success tests use an intercepted provider response; the endpoint tests independently exercise accepted and rejected deliveries. An actual live destination still needs to be connected and verified before production use.

## Original implementation

Pulled latest `origin/main` at `e08eeb4`. It contained two static HTML pages and Vercel rewrites. The useful zero-framework architecture, native FAQ pattern, appearance preference, illustrative system concept, and contact route were retained and rebuilt. The old waitlist called a missing `/api/waitlist` endpoint; the original contact form only logged to the console and displayed simulated success. Both were replaced by the single real intake path. Git history retains the original design; the old homepage URL permanently redirects to `/`.
