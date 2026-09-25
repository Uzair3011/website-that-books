# What Veltra Media needs to go live

The site, live booking, and form infrastructure are implemented. Contact details are known (hello@veltramedia.com, +44 7466 539736). Google Calendar credentials and the lead destination still need to be connected in Vercel; see the README.

| Needed from the owner                                       | Used for                                                                      |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| WhatsApp number, including country code                     | Public click-to-WhatsApp button                                               |
| Business phone number, including country code               | Public click-to-call button; may be the same number                           |
| Public business email                                       | Website email link                                                            |
| Inbox or CRM where new inquiries should arrive              | Actual form delivery; can be the same business inbox                          |
| Public Google Calendar appointment-schedule or Calendly URL | Scheduling a confirmed strategy call                                          |
| Booking timezone, working hours, and call duration          | Correct scheduling setup; page currently promises a 20-minute call            |
| Final domain and hosting project                            | Canonical URLs, social sharing URLs, sitemap, and server environment settings |
| Initial target country/region                               | Localized positioning, currency, scheduling, and contact expectations         |
| Legal business name and operating location                  | Accurate business identity and final policy details                           |

The current website is in English and all public prices are GBP, excluding VAT. Public contact values belong in the `PUBLIC_*` environment variables. The form currently delivers through an HTTPS webhook, configured server-side as `LEAD_WEBHOOK_URL` with an optional `LEAD_WEBHOOK_TOKEN`. If inquiries should go to email, connect a suitable email/automation provider to that intake path. An email address alone does not activate the backend. Secrets belong in hosting environment settings, not in this repository or public chat.

The exact provider is a setup decision; the owner only needs to identify the desired inbox/CRM first. The recipient must accept a test request before the site is treated as ready for live lead capture. Until then, the form clearly reports unavailability instead of showing a fake receipt.

Superseded: the med-spa system is now priced in GBP from the standard service list (£2,080 one-off, optional care from £49/month). Before taking payment, ensure delivery costs, the included usage, and the written launch guarantee are commercially supported. The website takes no payments.

## Redesign update — 22 September 2026

The site is now a general local web, SEO, conversion and automation studio for
Middlesbrough and Teesside, with five separately purchasable services and a free
website and Google audit as the primary call to action. The med-spa offer lives
on at `/med-spa-growth-system` as a specialist landing page.

Still outstanding, in priority order:

| Needed from the owner | Used for |
| --------------------- | -------- |
| A lead destination (inbox, CRM or automation webhook) set as `LEAD_WEBHOOK_URL` | The enquiry and audit forms currently report that requests cannot be sent |
| Google Search Console property + sitemap submission | Indexation and search reporting; DNS verification needs no code change |
| An analytics decision (GA4 or a lighter alternative) | No analytics exists today; adding one also requires widening the CSP in `vercel.json` |
| A Google Business Profile for Veltra itself | The site is built to support one; the profile is a Google process, not a code change |
| Real client screenshots and permission to publish results | `/work` currently shows labelled design examples, not client case studies |
| Confirmation of VAT wording, revision limits and delivery capacity against the published GBP prices | `/pricing` and `/terms` publish these commitments |

No address is published anywhere on the site, because there is no verified,
staffed location a client can visit. The business name, phone number
(+44 7466 539736) and email (hello@veltramedia.com) are identical on every page
and in the structured data, which is what local search actually needs.
