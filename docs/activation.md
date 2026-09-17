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

The current website is in English and prices are USD. Public contact values belong in the `PUBLIC_*` environment variables. The form currently delivers through an HTTPS webhook, configured server-side as `LEAD_WEBHOOK_URL` with an optional `LEAD_WEBHOOK_TOKEN`. If inquiries should go to email, connect a suitable email/automation provider to that intake path. An email address alone does not activate the backend. Secrets belong in hosting environment settings, not in this repository or public chat.

The exact provider is a setup decision; the owner only needs to identify the desired inbox/CRM first. The recipient must accept a test request before the site is treated as ready for live lead capture. Until then, the form clearly reports unavailability instead of showing a fake receipt.

The offer currently advertises $2,490 launch setup through October 31, 2026, then $3,490 standard setup, plus $399/month. Before taking payment, ensure delivery costs, the included usage, and the written launch guarantee are commercially supported. The website takes no payments.
