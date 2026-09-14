# Veltra Media

A fast, responsive sales funnel for a managed med-spa customer acquisition and booking system. Plain HTML, CSS, and browser JavaScript; Node serverless handlers handle real lead delivery. No production frontend framework or runtime dependency.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:4174. Node 22+ is required. `npm run build` writes static production assets into `dist/`; Vercel builds the root `api/` functions separately. The local server provides the same clean page routes, legacy redirects, and API behavior.

## Connect the real business

The repository did not contain a real calendar link, phone number, WhatsApp number, contact email, or lead backend. These have deliberately not been invented. The website is fully previewable, but production lead delivery needs the following configuration:

1. Put the Google Calendar **appointment-schedule booking URL** or Calendly URL into `assets/config.js`. A private calendar ID or calendar sharing link is not a public booking page. The direct booking button appears on `/contact` when configured.
2. Add the real `email`, international `phone`, and digits-only international `whatsapp` number in the same public configuration. Only configured, valid contact methods are rendered. Never put secrets here.
3. Copy `.env.example` to `.env` locally. Configure `LEAD_WEBHOOK_URL` as an HTTPS endpoint that accepts the JSON inquiry and returns a 2xx response after acceptance. Set optional `LEAD_WEBHOOK_TOKEN` for Bearer authentication. For Vercel, set these in project environment settings.
4. Set `SITE_URL` to the final HTTPS domain and run a production build. This generates canonical URLs, absolute social-image URLs, and `sitemap.xml` without inventing the business domain.

The inquiry form validates on both client and server. An accepted request is forwarded with a UUID, timestamp, consent wording, and privacy-policy version. It is never logged or saved to browser storage. Unconfigured intake returns 503 and tells the visitor no request was sent. Upstream failure returns 502 without a fake success. A strategy-call inquiry does not reserve a calendar slot. Booking is handled by the configured scheduling provider.

The endpoint accepts JSON only, rejects cross-origin browser submissions, caps payload size, includes a honeypot, times out the upstream request, and limits repeated requests. The in-memory limiter is per serverless instance, not a global durable anti-abuse system. Use host/provider protection for global limits. There is no delivery queue: failed submissions remain in the visitor’s form for retry, and a timeout is reported as unconfirmed delivery.

## Structure

- `index.html`: complete funnel with system walkthrough, ROI calculator, offer, and FAQs.
- `contact.html`: lead form and optional calendar, phone, WhatsApp, and email links.
- `privacy.html`, `terms.html`, `404.html`: real supporting pages.
- `assets/styles.css`: responsive design system, product illustrations, light/dark themes, reduced motion, and print behavior.
- `assets/app.js`: navigation, accessible tabs, calculator, contact-link wiring, inquiry states.
- `assets/business.js`: fixed offer expiry, pricing, and ROI math.
- `assets/validation.js`: shared field validation and normalization.
- `assets/config.js`: public contact configuration.
- `api/`: Vercel inquiry and readiness handlers.
- `scripts/`: dependency-free local server and production build.
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
