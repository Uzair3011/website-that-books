# Validation and handoff

Last run 22 September 2026, after the agency redesign. Preview: http://localhost:4174.

## Automated results

| Suite                                        | Result           |
| -------------------------------------------- | ---------------- |
| `npm test` (Node, unit + build/SEO)          | **29/29 passed** |
| `npx playwright test` (3 browser projects)   | **36/36 passed** |
| `npm run build`                              | passed, 15 pages |

`npm test` covers the composed med-spa price and its agreement with `/pricing`,
margin-aware opportunity maths, zero and negative contribution, shared validation, method/origin/payload guards, delivery
acceptance and rejection, missing configuration, rate limiting, booking
idempotency and race resolution, and the new build assertions: every route
emitted with a correct absolute canonical and absolute `og:image`, exactly one
`<h1>` per page, `noindex` on 404, a sitemap that lists every route and no
redirect source or 404, a robots file that disallows `/api/` and points at the
sitemap, a rejected non-HTTPS `SITE_URL`, every internal link and same-page
fragment resolving, and structured data that parses and claims no
`aggregateRating`, `reviewCount`, `ratingValue` or `streetAddress`.

Browser tests run on desktop Chromium (1440×1000), mobile Chromium (Pixel 7) and
mobile Safari (iPhone 13). They cover all fifteen routes plus 404, internal link
resolution, legacy and med-spa redirects returning 308 to the right target,
unique canonical/title/description per page, valid JSON-LD, no horizontal
overflow at 320/375/768/1024/1920, theme persistence, the mobile menu, FAQ
disclosure, the med-spa calculator, form validation and entry preservation,
confirmed delivery, the unconfigured-intake path, live booking including a
taken-slot retry and idempotent booking key, configured contact links, and the
no-JavaScript fallback.

Automated axe WCAG 2.0/2.1 A and AA checks pass on `/`, `/pricing`, `/work`,
`/free-website-audit`, `/contact` and `/med-spa-growth-system`, in both light
and dark themes, on all three browser projects. These are automated checks, not
a compliance certification or a substitute for assistive-technology testing.

## Currency consolidation — 22 September 2026

The med-spa page previously priced in USD ($2,490 launch / $3,490 standard /
$399 per month) on an otherwise GBP site. It is now composed from the standard
GBP service list — £895 + £495 + £295 + £395 = £2,080, plus optional care at
£49 a month — with no invented figures. The retired launch offer, the
client/admin dashboard line and the voice-minute/SMS allowances are gone; the
opportunity calculator now computes against £49 and £2,080 in `en-GB`.

Converted in: `assets/business.js`, `assets/app.js`, `/med-spa-growth-system`
(card, FAQs, calculator, hero, meta description), `/terms`, and the docs. No
structured data contained a price. Two new tests fail the build if any page
shows a dollar amount or "USD", if the med-spa figures drift from `/pricing`,
or if the retired offer reappears in copy.

## Issues found and fixed during this pass

- The footer's fourth column forced 7px of horizontal overflow at 768px, because
  an email address has no break opportunity. Fixed with a two-column footer
  breakpoint and `overflow-wrap: anywhere`.
- Two portfolio mockups were authored on a 1000×900 canvas while the rest were
  1280×900, which misaligned the captions in the two-column work grid. All
  mockups are now 1280×900.
- The hero mockup carried three small callout labels that were illegible at
  render size and duplicated the hero's own "Get found. Build trust. Respond
  fast." line. Removed.
- Two browser tests depended on whether a real Google Calendar happened to be
  connected. They now pin `/api/availability` explicitly.
- The dev server rejected its own form POSTs whenever `SITE_URL` pointed at the
  production domain. `playwright.config.js` now runs the server with a matching
  `SITE_URL`; the README documents the same for manual local testing.

## Manual review

Desktop and mobile hero, services, portfolio, pricing and audit sections
reviewed in both themes at 1440px and 390px. Sticky mobile action bar (call +
audit) verified for touch-target size. All imagery is locally hosted SVG; the
font is self-hosted.

## Still required before production

- **Search Console is not connected.** Vercel Web Analytics is installed, but
  Search Console needs DNS or tag verification. See the README section
  "Analytics and Search Console".
- `LEAD_WEBHOOK_URL` is still unset, so the enquiry form correctly reports that
  requests cannot be sent. Connect a destination and submit a real test request.
- Client case studies on `/work` are labelled design examples. Replace them with
  real screenshots and evidenced results as permission allows.
- Confirm the med-spa page's composed price (£2,080) and the £49 care plan are
  commercially supported before taking a deposit against them.
