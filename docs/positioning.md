# Veltra Media positioning and offer

Research reviewed September 13, 2026. Recommendation: start with independent, established med spas and aesthetic clinics that have consistent inquiries, unused consultation capacity, and an owner willing to improve intake. This is a positioning judgment, not a claim that research proves one niche universally wins.

## Niche comparison

Ratings below are qualitative judgments against this particular six-part offer; they are not measured market scores.

| Niche                   | Customer value / ability to pay | Missed lead pain | Booking dependence                   | Automation fit                                | Main constraint                                                           |
| ----------------------- | ------------------------------- | ---------------- | ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------- |
| Independent med spas    | High                            | High             | Very high                            | Strong across all six components              | Existing clinical software, appropriate handling of sensitive information |
| Premium salons          | Medium                          | High             | Very high                            | Strong for reception and rebooking            | Lower ticket economics and established booking apps                       |
| Boutique fitness / gyms | Medium; premium studios higher  | Medium           | Medium; higher for personal training | Strong for trial follow-up and retention      | Membership sales and attendance are different from appointment intake     |
| Trades / home services  | High for selected trades        | Very high        | High, but scheduling can be complex  | Excellent for phone capture and qualification | Dispatch, emergency routing, travel areas, and job estimates vary widely  |

Med spas narrowly lead for the complete connected offer: consultations provide a natural conversion event, visits can be valuable, repeat relationships matter, and owner-operated locations offer an identifiable buyer. Home services is the strongest second niche, particularly for an AI-phone-first offer, but should get its own copy and operational workflows rather than share a generic homepage.

## Evidence and limits

- [AmSpa’s 2024 industry report recap](https://www.americanmedspa.org/news/2024-medical-spa-state-of-the-industry-executive-report-recap/) reports $527 average spend per visit, 73% repeat patients, 81% single-location businesses, and approximately $1.4m average annual revenue. These are survey findings, not a forecast for a specific clinic. They support the customer-value, relationship, and identifiable-buyer rationale.
- [Zenoti’s 2025 benchmark overview](https://www.zenoti.com/thecheckin/beauty-wellness-industry-statistics-2025) reports an 11% online booking rate for the average med spa, compared with 30% for salons. The article also cites a 2025 consumer survey finding that 97% of med spa clients want mobile booking. The platform benchmark and consumer survey are different samples: the site cites the 11% benchmark without presenting a manufactured combined statistic or asserting causation.
- [Invoca’s 2025 home services call report](https://www.invoca.com/reports/the-invoca-call-conversion-benchmarks-report-for-the-home-services-industry-2025) reports that 55% of callers speak with a person, with 46% of identified leads converting on the call. The analysis draws on a broader dataset of over 60m calls. “Not speaking with a person” is not equivalent to “every one of these calls was missed”; voicemail and automated handling can be part of the remainder. This supports phone importance without exaggerating lost revenue.
- [HFA’s 2025 fitness benchmarking announcement](https://www.healthandfitness.org/hfa-releases-2025-fitness-industry-benchmarking-report/) reports 66.4% average member retention, 9.9% median revenue growth, and 23.6% median EBITDA margins, based on 175 companies representing more than 17,000 facilities. Fitness has a commercial opportunity, but this sample does not establish med-spa-style appointment pain or prove the economics of a small independent gym.

## Message and journey

“Your next client is calling. Be there.”

Sell one managed acquisition and booking system, not a menu of agency tasks. The sequence is: recognize the missed opportunity → show the connected journey → explain each capability → let the buyer test their own economics → show the value and ongoing costs → remove delivery risk → show relevant industry evidence → explain onboarding → resolve objections → request a useful strategy call.

The site describes intake and administrative AI, with approved information, handoff, and consent-based follow-up. It does not imply clinical advice, universal integration support, revenue guarantees, or compliance certification. Industry findings are visibly separate from the dashboard’s fictional example data. No testimonials, client logos, fake results, or fabricated live activity are used.

## Commercial offer implemented in the site

Superseded 22 September 2026. The site now sells in GBP only, and the med-spa
system is not a separately priced bundle. It is four standard services at their
standard `/pricing` prices:

| Service                               |    GBP |
| ------------------------------------- | -----: |
| Business website, up to five pages    |    895 |
| AI receptionist                       |    495 |
| Website chat                          |    295 |
| CRM, booking and follow-up automation |    395 |
| **One-off total**                     | **2,080** |

Optional website care is £49 a month. AI provider usage is passed through at
cost. All prices exclude VAT. There is no bundle discount and no expiring launch
price; the figures live in `assets/business.js` and a test fails if the page,
the calculator and `/terms` disagree.

Retired in the same change: the USD bundle ($2,490 launch through 31 October
2026 / $3,490 standard / $399 per month), the client/admin dashboard line — which
has no GBP price and is not one of the five services the agency now sells — and
the 200 AI voice minutes / 500 SMS segments monthly allowance, replaced by
at-cost provider usage. The earlier USD figures remain in git history.

## ROI methodology

Additional completed visits × average visit revenue × contribution margin − £49 monthly care plan = illustrative incremental monthly contribution. The margin represents revenue remaining after variable treatment costs, not net business profit. The model separately computes visits needed to cover the plan and setup payback using positive contribution. Zero or negative contribution explicitly shows no setup payback. Fixed overhead, VAT, advertising and AI provider usage are excluded and labeled. Defaults are example inputs, not a claim about likely results.
