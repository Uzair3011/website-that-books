# Validation and handoff

Completed September 14, 2026. Preview: http://localhost:4174.

- Latest source was pulled at `e08eeb4`; both original pages were inspected and run before the redesign. The old waitlist failed against its missing endpoint, and the old contact form simulated success without delivery.
- `npm test`: **11/11 passed**. Covers fixed offer expiry, margin-aware ROI, zero/negative contribution, shared validation, method/origin/payload checks, delivery acceptance/rejection, missing configuration, and rate limiting.
- `npx playwright test --workers=2`: **27/27 passed** across desktop Chromium, mobile Chromium, and iPhone Safari emulation. Covers routes, legacy redirect and 404, internal links, navigation, keyboard tabs, FAQs, theme persistence, calculator, form validation and data preservation, confirmed-delivery states, configured contact links, no-JavaScript fallback, and widths from 320 to 1920 pixels.
- Automated axe WCAG 2/2.1 A and AA checks passed on home, contact, privacy, and terms in both themes for all three browser projects. These are automated checks, not a compliance certification or a substitute for comprehensive assistive-technology testing.
- `npm run build`: passed. Production canonical/social URLs, robots, sitemap generation, and 404 noindex were additionally checked with a temporary test origin, then the normal build was restored. No placeholder production domain was published.
- `git diff --check`: passed.
- Manual visual review: desktop/mobile hero, full funnel, contact in both themes, SVG wordmarks, and mobile page layout. Fixed low-contrast example-dashboard text and iPhone form font sizes. All visual assets and the font are locally hosted.

## Lighthouse

Local lab checks against the running site, with default mobile throttling and the actual desktop configuration:

| Category       | Mobile | Desktop |
| -------------- | -----: | ------: |
| Performance    |     99 |     100 |
| Accessibility  |    100 |     100 |
| Best practices |    100 |     100 |
| SEO            |    100 |     100 |

Lighthouse measurements were recorded before the final palette refinements. The final navy/cobalt/cyan palette subsequently passed the automated WCAG route checks in both themes on desktop Chromium, mobile Chromium, and mobile Safari.

Isolated mobile run: LCP 1.8s, total blocking time 60ms, cumulative layout shift 0. Earlier measurements varied while other browser jobs were competing for CPU; these scores are lab measurements, not production field guarantees. Raw HTML/JSON reports and review screenshots are in `/tmp/veltra-review/` for this workspace session.

## Activation still required

The site has no invented phone number, calendar URL, email address, or CRM endpoint. Set the real Google Calendar appointment-schedule / Calendly URL and phone, WhatsApp, and email in `assets/config.js`. Configure the HTTPS lead webhook and optional token in server environment variables, plus `SITE_URL` for the final domain. See the README for the exact configuration.

Until a lead destination is configured, the form clearly reports that online requests are unavailable; it never reports a fictitious delivery. Browser success-path tests intercept the response, and endpoint tests independently verify delivery/error handling. A live provider submission cannot be verified until the business supplies that destination. No appointment is reserved by the inquiry form; the external calendar handles confirmed scheduling.

Repository publication is tracked in Git history. A successful push does not by itself verify the hosting deployment or activate a missing lead destination.
