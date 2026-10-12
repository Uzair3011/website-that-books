# Claims review, October 2026

Written 12 Oct 2026 on branch `seo/tees-valley`, after the keyword-map changes in the same commit. It lists every numeric or outcome claim on the site that a visitor would read as a real result, guarantee, valuation or deadline. Line numbers in sections A to F are for the files as they were before the owner decisions were applied.

**Update, 12 Oct 2026:** the owner's decisions have been applied. Section I records the action taken for every row. Rows C7, C8 and C9 had no decision and are unchanged.

**Who decides.** Each row needs an owner decision: **prove** it (add evidence to the repo and keep it), **relabel** it as an illustrative example in the visible copy, or **remove** it. The recommendation column is a starting point, not a decision.

## Summary

- **45 claims** in six groups across the five sales pages, the services copy and the illustrative visuals. **None has supporting evidence in the repo.**
- **6 client case studies** are presented as real results. The repo says the opposite: `src/projects.js` marks every trades project as a concept for a fictional business, `src/reviews.js` is empty, `docs/validation.md:87` and `docs/activation.md:38` say there are no evidenced client results yet, and the comment at `src/service-visuals.js:1-5` calls the proof figures "illustrative mock-ups, not client data".
- **6 guarantees** (five "work for free" promises and "Live in 14 days, or you don't pay"). `/terms` sets out only one guarantee, the med-spa launch delivery guarantee (`src/pages/terms.js:48-51`), and says "No search ranking is guaranteed" (`src/pages/terms.js:38`). None of the six has written terms.
- **5 "Total Real-World Value" stacks** (£3,100 to £5,500) built from 30 item valuations that have no stated basis.
- **3 scarcity or urgency lines**, none tied to a real deadline or limit.
- **Contradictions.** The same site says results are not invented (`/work`, `/terms`) and that no ranking can be guaranteed (`/`, `/about`, `/google-business-profile`, `/web-design-teesside`, `/terms`, and now the new FAQs on the sales pages). The sales pages also promise "Live in 14 days", while `/how-it-works` and the new FAQs give 10 to 15 working days for a five-page site.

Highest-risk items to settle first: the six case studies (A1-A6), the "Top 3" Promise (C2), and the value stacks (D). Under the CAP Code and UK consumer protection law, fabricated testimonials, unsupported performance claims and invented "value" comparisons can all be treated as misleading.

## How evidence was checked

Searched the repo for anything that could support a claim: `src/reviews.js` (empty array), `src/projects.js` (one real project, the med-spa build; three concepts), `docs/validation.md`, `docs/activation.md`, `docs/positioning.md`, `docs/off-page-seo/`, `assets/`, and the comments in `src/service-visuals.js` and `src/visuals.js`. No analytics export, call log, Search Console data, invoice, testimonial or written permission exists in the repo for any claim below. "Evidence in repo: none" means exactly that. It does not mean the claim is false; the owner may hold evidence elsewhere.

## A. Client results presented as real

| # | File:line | Exact text | Evidence in repo | Recommended action |
|---|---|---|---|---|
| A1 | `src/pages/web-design-middlesbrough.js:33` | "Don’t take our word for it. Look at the numbers." (heading over A2 and A3) | None | Remove, or relabel the section as example scenarios |
| A2 | `src/pages/web-design-middlesbrough.js:36-41` | "Local Electrician" … "The Old Way" "2" "leads a month from a clunky 10-year-old site." … "The Veltra Way" "18" "high-value leads last month." | None. `src/projects.js` lists the only trades sites as concepts | Prove (evidence plus written permission) or remove |
| A3 | `src/pages/web-design-middlesbrough.js:45-48` | "Local Joinery" … "The Result" "312%" "increase in inbound calls within 30 days of launch." | None. "Ashfield Joinery" is a concept in `src/projects.js:43-49` | Prove or remove |
| A4 | `src/pages/local-seo-middlesbrough.js:30-37` | "The Proof is in the Pipeline." … "Local Plumber" "Went from Page 3 of Google to the #1 Map Pack spot in Middlesbrough for “Emergency Plumber.”" … "45" "inbound calls generated directly from Google Maps last month. Zero ad spend." | None | Prove or remove. A ranking result is also a ranking promise by implication (hard rule 5) |
| A5 | `src/pages/landing-page-design.js:30-38` | "We Buy Clients For Pennies On The Pound." … "Google Ads Client" "They were spending £500/mo on Google Ads … Cost per lead: £85." … "4x" "Cost per lead dropped to £12. They got 4x the leads for the exact same ad spend." | None | Prove or remove |
| A6 | `src/pages/ai-receptionist-middlesbrough.js:25-32` | "The Employee That Never Sleeps." … "Real Lead Captured" "“Hey, do you do emergency callouts in Billingham?” → AI confirms, gives pricing, and books the appointment at 2:15 AM." … "£250" "That is £250 in revenue that would have been lost to a voicemail box." | None. Labelled "Real" with no source | Remove "Real", then relabel as an example conversation, or prove |
| A7 | `src/pages/crm-booking-automation.js:24-31` | "From Chaos to Clockwork." … "Before Veltra" "40%" "of quotes sent were never followed up on." … "After Veltra" "65%" "Automated SMS follow-ups increased quote-acceptance rate by 65%. Zero manual admin required." | None | Prove or remove |

A1 is the heading for A2 and A3, so A has six case studies and seven rows.

## B. Unsourced statistics and outcome statements

| # | File:line | Exact text | Evidence in repo | Recommended action |
|---|---|---|---|---|
| B1 | `src/pages/web-design-middlesbrough.js:14` | "More local leads, without spending a single penny more on ads." (moved from the old H1 in this task, minus "3x"; see section F) | None | Relabel as an aim ("built to win more local enquiries") or prove |
| B2 | `src/pages/web-design-middlesbrough.js:71` | "70% of your traffic is on a phone." | None. No source cited; it cannot be true of every reader's site | Remove the figure. Other pages already say "Most local searches happen on a phone" |
| B3 | `src/pages/web-design-middlesbrough.js:86` | "Multi-step forms that double conversion rates." | None | Remove |
| B4 | `src/pages/web-design-middlesbrough.js:54` | "You’re losing thousands of pounds a month to competitors…" | None | Relabel as a possibility ("could be losing") or remove |
| B5 | `src/pages/ai-receptionist-middlesbrough.js:14` | "Hire a 24/7 AI receptionist for less than the cost of your monthly coffee bill." (moved from the old H1 in this task) | None. `/pricing` shows £199 setup plus AI usage at cost, with no monthly figure to compare against | Prove with a stated typical monthly usage cost, or remove |
| B6 | `src/pages/ai-receptionist-middlesbrough.js:39` | "You just lost a £1,500 job because you were 3 minutes late to the phone. Hiring a human receptionist costs £25,000+ a year." | None. No salary source cited | Relabel the £1,500 job as an example. Prove the £25,000+ with a cited source, or remove it |
| B7 | `src/pages/ai-receptionist-middlesbrough.js:86-87` | "Stop losing £1,000 jobs because you were" "3 minutes late to the phone." | None | Relabel as an example or remove. It also disagrees with the £1,500 in B6 |
| B8 | `src/pages/crm-booking-automation.js:19` | "10+ hours a week" "of admin work saved, or we work for free" | None | Remove, or prove and put terms in `/terms` (see C6) |
| B9 | `src/pages/crm-booking-automation.js:70` | "Kills your no-show rate and asks for reviews automatically." | None | Soften ("reduces no-shows") or remove |
| B10 | `src/pages/landing-page-design.js:92-93` | "Ready to halve your cost-per-lead and" "double your booked jobs?" | None | Remove the figures |
| B11 | `src/pages/landing-page-design.js:44` | "If you are paying Mark Zuckerberg or Google £10 every time someone clicks your ad…" | None. Click prices vary widely | Relabel as an example ("say £10") |
| B12 | `src/pages/local-seo-middlesbrough.js:49` | "SEO agencies will sell you a £1,000/month retainer to write blog posts nobody reads." | None | Soften to a general statement or remove the figure |
| B13 | `src/pages/local-seo-middlesbrough.js:76` | "50+ directory syncs to build undeniable trust with Google’s algorithm." | None. "50+ directory syncs" is not in the £99 scope on `/pricing` (`assets/catalog.js:59-64`) | Prove the deliverable and add it to the published scope, or remove |
| B14 | `src/pages/services.js:62` and `src/services-showcase.js:52` | "Never Miss a Lead at 11 PM … When a customer lands on your site after hours, you get the job, not the guy who opens at 9 AM." | None | Soften ("answer enquiries at 11 PM") |

## C. Guarantees and ranking promises

| # | File:line | Exact text | Evidence in repo | Recommended action |
|---|---|---|---|---|
| C1 | `src/pages/web-design-middlesbrough.js:15`, `:24`, `:102-103` | "Live in 14 days, or you don’t pay." / "Live in 14 days" "or you don’t pay" / "The 14-Day “Booked Solid” Guarantee" "…If it doesn’t actively increase your inbound enquiry rate, we will work for free until it does." | No terms in `/terms`. `/how-it-works` and the new FAQ on this page give 10-15 working days for up to five pages, from content approval | Prove: write the trigger, measure and limit into `/terms` and align the timescale. Otherwise remove |
| C2 | `src/pages/local-seo-middlesbrough.js:26`, `:87-88` | "The “Top 3” Promise" "We work for free until calls increase" / "…If your local visibility and inbound calls don’t measurably increase, we work for free until they do." | No terms. Contradicts `/terms:38` and the new FAQ on the same page ("No ranking is guaranteed") | Remove the "Top 3" name in every case (hard rule 5). Keep a "work for free" promise only if it is written into `/terms` |
| C3 | `src/pages/landing-page-design.js:26`, `:88-89` | "The “Profitable Click” Guarantee" "Beat your homepage, or we work for free" / "…If it doesn’t beat the conversion rate of your current homepage, we work for free." | No terms | Prove with written terms (test length, how the rate is measured) or remove |
| C4 | `src/pages/ai-receptionist-middlesbrough.js:21`, `:82-83` | "Never miss a lead" "Or we work for free" / "The “Never Miss a Lead” Guarantee" "…If it doesn’t capture a lead you would have otherwise missed in your first 30 days, we’ll work for free." | No terms | Prove with written terms or remove. "Never miss a lead" is an absolute claim |
| C5 | `src/pages/ai-receptionist-middlesbrough.js:19`, `src/pages/landing-page-design.js:24`, `src/pages/crm-booking-automation.js:18`, `src/pages/local-seo-middlesbrough.js:24` | "Deployed in 14 days" / "Deployed in 14 days" / "Launched in 14 days" / "Built in 14 days" | No terms. The new FAQs say the timeline is set in the written proposal | Prove (commit to it in `/terms`) or change to "timeline agreed in writing" |
| C6 | `src/pages/crm-booking-automation.js:81-82` | "The “Get Your Evenings Back” Guarantee" "…If it doesn’t save you at least 10 hours of admin work a week, we work for free until it does." | No terms. Hours saved cannot be measured without a baseline | Remove, or prove with written terms and a measurement method |
| C7 | `src/pages/local-seo-middlesbrough.js:15` | "We hijack the Google Map Pack so when Teesside customers search for your service, your phone rings first." | None | Remove. Implies a ranking outcome (hard rule 5) |
| C8 | `src/pages/local-seo-middlesbrough.js:60`, `:74` | "…building massive trust and forcing Google to rank you higher." / "We rank you for the high-intent terms your best customers actually search for." | None | Remove. Ranking promises (hard rule 5) |
| C9 | `src/pages/web-design-middlesbrough.js:94` | "We set up your map pack foundation so you rank faster." | None | Remove "so you rank faster" (hard rule 5) |

## D. "Total Real-World Value" stacks

The template (`src/service-sales-page.js:227-233` and `:264`) prints "Total Real-World Value" and "Your Investment" side by side, with a bar comparing them. It checks that the items add up to the total. It does not check where any item value comes from. No valuation has a stated basis (no competitor quotes, no previous price, no hourly rate).

| # | File:line | Exact text | Evidence in repo | Recommended action |
|---|---|---|---|---|
| D1 | `src/pages/web-design-middlesbrough.js:84-97` | Items "£1,500", "£800", "£500", "£400"; bonuses "£350", "£250"; "total: "£3,800"" against a £179 price | None | Remove the valuations, or prove each with a documented basis |
| D2 | `src/pages/local-seo-middlesbrough.js:73-84` | Items "£1,200", "£800", "£600", "£500"; bonuses "£400", "£300"; "total: "£3,800"" against £99 | None | Remove or prove |
| D3 | `src/pages/landing-page-design.js:74-85` | Items "£1,000", "£600", "£500", "£400"; bonuses "£350", "£250"; "total: "£3,100"" against £99 | None | Remove or prove |
| D4 | `src/pages/ai-receptionist-middlesbrough.js:68-79` | Items "£1,500/yr", "£600", "£800", "£500"; bonuses "£400", "£300"; "total: "£4,100"" against £199 | None. It adds a yearly value to one-off values | Remove or prove |
| D5 | `src/pages/crm-booking-automation.js:67-78` | Items "£2,000", "£1,200", "£800", "£600"; bonuses "£500", "£400"; "total: "£5,500"" against £199 | None | Remove or prove |

## E. Scarcity and urgency

| # | File:line | Exact text | Evidence in repo | Recommended action |
|---|---|---|---|---|
| E1 | `src/pages/web-design-middlesbrough.js:91` | "Plus, when you book your build this week, you get these bonuses entirely for free:" | None. The line never changes, so "this week" is every week | Remove "this week", or run a real dated offer |
| E2 | `src/pages/local-seo-middlesbrough.js:91-92` | "Only 3 businesses can fit in the Map Pack." "Claim your spot before your competitor does." | Partly. Google's local pack usually shows three businesses, but nobody can "claim" a place in it | Remove "Claim your spot", or relabel as a plain description of how results look |
| E3 | `src/pages/local-seo-middlesbrough.js:44` | "Google shows them exactly three businesses on a map. If you aren’t one of those three, you do not exist." | Partly, as for E2. The layout varies by search and device | Soften ("usually shows three") |

## F. Claims in illustrative visuals

These figures are drawn into the SVG images, so they render as image text beside the claims above. The code comments call them illustrative, but nothing visible on the page says so.

| # | File:line | Exact text | Evidence in repo | Recommended action |
|---|---|---|---|---|
| F1 | `src/service-visuals.js:136-170` (on `/local-seo-middlesbrough`) | "Calls from Google Maps" "45"; "Ad spend" "£0"; "#1" "Map Pack spot"; "Before" "Page 3 of Google"; "After" "#1 in the Map Pack" | None. Comment at lines 1-5 says illustrative | Relabel with a visible "Illustration" caption, or remove the figures with A4 |
| F2 | `src/service-visuals.js:210-239` (on `/landing-page-design`) | "£85", "£12", "Same ad spend · 4x the leads" | None | Relabel or remove with A5 |
| F3 | `src/service-visuals.js:305` (on `/ai-receptionist-middlesbrough`) | "£250 job saved" | None | Relabel or remove with A6 |
| F4 | `src/service-visuals.js:312`, `:328` (on `/ai-receptionist-middlesbrough`) | "…a £1,500 job gone to a competitor." / "£1,500 job" | None | Relabel as an example |
| F5 | `src/visuals.js:172` (homepage and `/services` card) | "Ashfield Joinery" "4.9 (86 reviews)" | None. Ashfield Joinery is a fictional business (`src/projects.js:43-49`) | Remove the review count, or caption the card "Illustration" (audit I8) |
| F6 | `src/visuals.js:88` (homepage card) | "4.9" "Google" "reviews" | None | As F5 |
| F7 | `src/visuals.js:196-197` (homepage card) | "Enquiries this month" "42" "↑ 38%" | None | Caption as an illustration or remove the figures |

## G. What this task changed

These are recorded so nobody thinks a claim moved without a decision. None of them was a rewrite of a claim's wording beyond what the H1 change required.

- **Removed with the old H1, not moved.** `/web-design-middlesbrough`: "How Teesside Service Businesses Are Getting 3x More Local Leads Without Spending a Single Penny More on Ads." The "3x" figure is gone from the page. The rest of the hook is now B1. `/local-seo-middlesbrough`: "If You Aren’t in the Top 3 on Google Maps, You Are Handing Your Best Local Jobs to Your Competitors." It is now the lede opener, reworded to "If customers can’t find you on Google Maps…" with no "Top 3". The keyword map requires this, because the H1 position must not promise a Top 3 place (hard rule 5).
- **Moved into the lede unchanged.** The AI receptionist hook, including the coffee-bill comparison (B5). The landing page and CRM hooks contain no numeric claims.
- **Left where they were.** Every claim in sections A to F, including all the numeric results.
- **The `/about` meta description no longer says "no invented results".** The new description was written from the keyword map, and that phrase contradicted section A. If the claims in section A are removed, the phrase could go back.

## H. Suggested order

1. Owner answers audit question 1 (are any case studies real?) and question 2 (will the "work for free" guarantees be honoured in writing?).
2. Remove or relabel A1-A7 and F1-F7 together, so the copy and the images agree.
3. Remove the "Top 3" wording and the ranking language (C2, C7-C9).
4. Decide on the guarantees (C1, C3-C6). Either write them into `/terms` with triggers and limits, or remove them.
5. Remove the value stacks (D), or document a basis for each figure. If they go, `serviceSalesPage()` needs its "Total Real-World Value" block made optional.
6. Fix the scarcity lines (E) and the unsourced statistics (B).

## I. Owner decisions and action taken

Applied 12 Oct 2026 on branch `seo/tees-valley`. The owner decided:

1. Keep the client-result case studies, but label each one visibly as "Illustrative example, not a real client result", and rename headings that imply a real client to "Example scenario".
2. Remove every "work for free" guarantee and the "Top 3" Promise, including headings, CTAs and repeated mentions.
3. Replace "Live in 14 days or you don't pay" and similar delivery promises with wording that matches `/how-it-works` and `/terms`. Keep a refund or guarantee only if `/terms` already sets it out. None of these pages' guarantees is in `/terms`, so all were removed.
4. Rewrite unsourced statistics as plain statements without figures, or remove them. No sources were invented.
5. Remove the £ value of each item and the "Total Real-World Value", but keep the list of what is included.
6. Remove scarcity and urgency wording, and keep a neutral CTA.
7. Leave the figures drawn inside the illustrative images unchanged.

**Template changes (`src/service-sales-page.js`).** Every case card now shows a visible "Illustrative example, not a real client result" label. The section eyebrow changed from "The proof" to "Illustrative examples", which also covers the proof image in that section. The item values, the "Total Real-World Value" block, the value-against-price bars and the closing "Total Real-World Value" line are gone, along with the check that the values added up. The price box now shows only "Your Investment". The guarantee section became an "In writing" section (prop `commitment`) that states the timeline and ownership in the same terms as `/how-it-works` and `/terms`. It is not a guarantee.

### A. Client results

| # | Action taken |
|---|---|
| A1 | Heading "Don’t take our word for it. Look at the numbers." renamed to "Example scenarios" (two cards). |
| A2 | Kept, labelled "Illustrative example, not a real client result". Title now "Example scenario: a local electrician". Stat label "The Veltra Way" renamed to "The new way". Figures unchanged. |
| A3 | Kept and labelled. Title now "Example scenario: a local joinery firm". "312%" unchanged. |
| A4 | Kept and labelled. Section heading "The Proof is in the Pipeline." renamed to "Example scenario". Title now "Example scenario: a local plumber". Text unchanged, including "#1 Map Pack spot", which still reads as a ranking outcome (hard rule 5). Flagged for the owner. |
| A5 | Kept and labelled. Section heading "We Buy Clients For Pennies On The Pound." renamed to "Example scenario". Title "Google Ads Client" now "Example scenario: a business running Google Ads". Stat label "The Veltra Fix" renamed to "The fix". Figures unchanged. |
| A6 | Kept and labelled. "Real Lead Captured" renamed to "Example scenario: an after-hours enquiry". Section heading "The Employee That Never Sleeps." kept, as it does not imply a client. "£250" unchanged. |
| A7 | Kept and labelled. Title now "Example scenario: automated follow-up". Stat labels "Before Veltra" and "After Veltra" renamed to "Before" and "After". Section heading "From Chaos to Clockwork." kept. Figures unchanged. |

### B. Unsourced statistics

| # | Action taken |
|---|---|
| B1 | Rewritten: "A website built to win more local enquiries, without adding to your ad spend." |
| B2 | Rewritten: "Most local customers search on a phone." |
| B3 | Rewritten: "Short, simple forms that make it easy to get in touch." |
| B4 | Rewritten: "You could be losing work to competitors who are worse at the job than you are…" |
| B5 | Rewritten: "Missed calls = missed money. Let a 24/7 AI receptionist answer when you can’t." Coffee-bill comparison removed. |
| B6 | Rewritten without figures: "That could be a big job lost because you were a few minutes late to the phone. A full-time human receptionist is a serious yearly cost, and letting calls go to voicemail costs you work too." |
| B7 | Closing rewritten: "Stop losing jobs because you were a few minutes late to the phone." |
| B8 | Removed. The hero point is now "Every enquiry in one place: Calls, texts and emails logged together", taken from the page's own description. |
| B9 | Rewritten: "Reminds clients before each job to help cut no-shows, and asks for a review afterwards." |
| B10 | Closing rewritten: "Ready to get more from every ad click?" |
| B11 | Figures removed from the heading and body ("£10" twice, "12 different services", "2 seconds"). |
| B12 | Rewritten: "Some SEO agencies will sell you a monthly retainer to write blog posts nobody reads." |
| B13 | Rewritten to match the published scope ("consistent business details"): "The same business name, phone number and service areas across the main directories, so Google sees consistent details everywhere." |
| B14 | Both files: heading "Never Miss a Lead at 11 PM" now "Answer Enquiries at 11 PM", and the closing sentence now says the customer "get[s] an answer straight away instead of waiting until morning." |

### C. Guarantees and ranking promises

| # | Action taken |
|---|---|
| C1 | Removed from the lede, hero point and guarantee section. The lede now says "Typically live in 10 to 15 working days after content approval." The hero point now says "Typically live in 10–15 working days, after content approval." The "In writing" section gives the `/how-it-works` timelines (around 7 working days for one page, 10 to 15 for up to five) and the `/terms` ownership wording. |
| C2 | Removed in every place: the hero point (now "You own your profile: It stays under your own Google account") and the guarantee section (now "A fixed scope and a timeline in writing"). No "Top 3" wording remains in the page copy. |
| C3 | Removed: the hero point (now "Tracking included: See what each click turns into") and the guarantee section. The landing page is the £99 one-page product, so the delivery wording is "typically live in around seven working days after content approval", from `/how-it-works`. |
| C4 | Removed: the hero point (now "Answers you approve: With clear handover to you when needed") and the guarantee section. |
| C5 | All four "in 14 days" points changed. `/landing-page-design` now says "Typically live in around 7 working days". `/local-seo-middlesbrough`, `/ai-receptionist-middlesbrough` and `/crm-booking-automation` now say "Timeline agreed in writing", which matches their FAQs and `/how-it-works`. |
| C6 | Removed, with B8. |
| C7 | **No owner decision. Unchanged.** "We hijack the Google Map Pack…" is still the lede on `/local-seo-middlesbrough`. |
| C8 | **No owner decision. Unchanged.** "forcing Google to rank you higher" and "We rank you for the high-intent terms…" remain. The £800 value was removed under D2. |
| C9 | **No owner decision. Unchanged.** "so you rank faster" remains in the bonus text. The £350 value was removed under D1. |

### D. Value stacks

| # | Action taken |
|---|---|
| D1 | All six item values and the £3,800 total removed. "A fraction of that." was removed because it only made sense next to the total. The list of what is included is kept. |
| D2 | All six values and the £3,800 total removed. List kept. |
| D3 | All six values and the £3,100 total removed. List kept. |
| D4 | All six values and the £4,100 total removed. List kept. |
| D5 | All six values and the £5,500 total removed. List kept. |

### E. Scarcity and urgency

| # | Action taken |
|---|---|
| E1 | Rewritten: "Plus, these bonuses are included at no extra cost:" |
| E2 | Closing rewritten as a neutral prompt: "Ready to be easier to find on Google Maps?" The CTA button is unchanged ("Book Your Local SEO Strategy Call"). |
| E3 | Softened: "Google usually shows them a few businesses on a map. If you aren’t one of them, most of those customers will never see you." |

### F. Illustrative visuals

| # | Action taken |
|---|---|
| F1-F4 | Image figures unchanged (decision 7). On the sales pages they sit in the section now headed "Illustrative examples", and every case card next to them carries the visible label. |
| F5-F7 | Unchanged (decision 7). These are on the homepage and `/services`, outside the sales template, so no visible "illustration" caption has been added. Still open. |

### Still open

- C7, C8 and C9 (ranking language on `/local-seo-middlesbrough` and `/web-design-middlesbrough`) need a decision. Hard rule 5 says never promise rankings.
- A4 keeps the "#1 Map Pack spot" wording inside a labelled example. The owner may want the figure removed too.
- F5-F7 need a visible caption or removal on the homepage and `/services`.
- If a real, evidenced client result is added later, it needs a card without the illustrative label. The template currently labels every case card.
