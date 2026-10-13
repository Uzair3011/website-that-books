# SEO project: summary for the owner

October 2026. A plain-English summary of what was done to the Veltra Media website for search, and what we still need from you.

## In one paragraph

The website went from 21 pages that Google could list to 33. Every page now has a clear job (one main search phrase per page, so pages don't compete with each other). Claims we couldn't back up have been removed or clearly labelled. The technical set-up is clean: every final check passed, on the built site and on the live site. The homepage now loads noticeably faster on phones. The next step is yours: get access to Google Search Console and submit the site (`launch-checklist.md`). After that, the main tasks are steady reviews, local listings and real case studies (`30-60-90.md`).

## What was done

### New pages (12)

- **Town pages:** Stockton-on-Tees (with a Billingham section), Redcar and Hartlepool, each with its own local content, plus an **Areas we cover** page linking them all. Middlesbrough and Teesside already had pages.
- **AI agents for Teesside businesses:** an overview of what AI can sensibly do for a local business, linking to the AI receptionist and booking pages.
- **Website design for tradesmen:** a page aimed at trades, like the existing med-spa page.
- **Six guides** under Resources: how much a website costs, whether you need a website if you have Facebook, a local SEO checklist, Google Business Profile for businesses without a shop, ranking in Google Maps without a shop, and what an AI receptionist is.

### Pages improved

- **Every page** has a new title and description, written for the phrase that page should be found for, and short enough that Google shows them in full. Before, 18 of the 21 descriptions were too long.
- **Main headings** on the homepage and the sales pages now say what the page is about ("Web design in Middlesbrough…"), instead of sales slogans that didn't mention the service or the town.
- **The AI receptionist page** moved to a clearer address: `/ai-receptionist-middlesbrough`. The old address forwards to it automatically.
- **Claims cleaned up**, following your decisions of 12 October:
  - The "work for free" guarantees, the "Top 3 on Google Maps" promise, the "Live in 14 days or you don't pay" lines and the "Total Real-World Value" price stacks are gone.
  - The example client stories stay, but each one now carries the label "Illustrative example, not a real client result".
  - Statistics with no source were rewritten without numbers.
- **Links between pages:** every page now links to at least three related pages and is linked from at least three, so visitors and Google can find everything within a few clicks.

### Technical fixes

- **Sitemap** (the list of pages for Google): lists exactly the 33 pages Google should show, with the date each one last changed.
- **Old addresses** from the previous Veltra site (`/marketing-services`, `/contact-us`, `/about-us` and others) and renamed pages forward permanently to the right current page, so any old Google listings or links still work.
- **`veltramedia.com` without "www"** and `http://` addresses forward to `https://www.veltramedia.com`.
- **Unknown addresses** show a proper "page not found" page that Google won't list, with links to every service.
- **Structured data** (hidden labels that tell Google what each page is): one consistent business description on every page, breadcrumbs, service details, article details and FAQs. None of it claims an address, reviews or ratings, because we don't publish those.
- **Accessibility** fixes found by automated testing: larger tap areas for small links on phones, tables that can be reached with the keyboard, a labelled mobile contact bar and headings in the right order.
- **Automatic checks:** every future change is tested against all these rules before it can pass. A new check, `npm run seo:crawl`, tests the live site the way Google sees it.

### Speed (measured on a simulated mid-range phone)

| Page | Before | After |
|---|---|---|
| Homepage: time until the main content shows (Google wants under 2.5 s) | 2.73 s, a fail | **2.09 s, a pass** |
| Homepage: total download size | 283 KB | **136 KB** |
| Five other key pages | All under 2.5 s | All still under 2.5 s, most slightly faster |
| Layout jumping while the page loads (all pages) | None | None |

Images were made smaller and sized for phones, and the stylesheet was compressed. One measure (how long the page is busy while loading) rose a little on the Middlesbrough web design page. The cause is the chat button starting up, and that is a separate job. Details are in `performance-baseline.md`.

### Final checks (13 October 2026)

All passed, both on the built site and on the live site. Every page in the sitemap loads and is listed correctly. Every redirect works. Every link on the site works. Each page has one main heading and its own title and description. Full results are in `launch-checklist.md`.

## What we need from you, most important first

1. **Google Search Console access.** Nothing can be measured until this is done. Find which Google account already holds the property, or add it, then submit the sitemap and request indexing for the 10 key pages. The steps are in `launch-checklist.md` section 2; the account worksheet is in `docs/off-page-seo/search-console-account-check.md`. Then add Bing Webmaster Tools (one click once Search Console is set up).
2. **The example figures on the homepage and the services page.** The illustrations there show results figures but have no "illustrative example" caption, unlike the sales pages. Tell us whether to add a caption or remove the figures. Unlabelled result figures could mislead visitors, so this one matters (`claims-review.md`, items F5-F7).
3. **Check the local facts on the town pages.** The Stockton, Redcar and Hartlepool pages use local details (areas, landmarks, postcodes, history) written from general knowledge. Please tick or correct each one in `owner-todo.md`. Wrong local facts would undermine the pages.
4. **Check the Google rules quoted in the guides.** Ten statements about Google Business Profile rules (for example "up to 20 service areas") are listed in `owner-todo.md`. Google changes these, so please confirm each one is still current.
5. **Google Business Profile and social profiles.** Once your Google Business Profile, LinkedIn and Facebook pages are live and in the business's name, send the links. We will connect them to the website, which helps Google treat them as the same business.
6. **A real case study, when you have one.** One finished project, with the client's written permission, screenshots and any results they can back up. This would do more for trust than anything else. Real examples for the guides help too (anonymised is fine).
7. **Your name, a short bio and a photo, if you want to be named.** These would go on the About page and as the author of the guides. If you prefer to stay unnamed, nothing changes.
8. **Details for the guides:** typical third-party costs your clients pay (domain, email, AI usage per month), and for the AI receptionist which phone systems and calendars you support, whether calls are recorded, and how long setup takes.
9. **Optional decisions:**
   - A price range to show Google. There is none now, because larger jobs are quoted individually.
   - Whether to mention UK fake-review law (DMCC Act 2024) or the rules on missed-call text messages in the guides. Both are left out until confirmed.
   - Google's Rich Results Test may warn that the business has no address. That is expected and fine, but it can be removed with a small code change if you prefer (`launch-checklist.md` section 4).
   - Search volumes for the chosen phrases are unknown. Search Console will show real figures after a few weeks.

## Where to find things

| File | What it is |
|---|---|
| `launch-checklist.md` | Final check results, plus step-by-step Search Console, Bing and Rich Results Test instructions |
| `30-60-90.md` | What to do and measure over the next three months |
| `rank-tracking.csv` and `README.md` | The monthly keyword tracker, and how to fill it in from Search Console |
| `owner-todo.md` | Every fact to confirm, with tick boxes |
| `claims-review.md` | Every claim reviewed, and what was done with it |
| `keyword-map.md` | Which page targets which search phrase, and pages to build later |
| `performance-baseline.md` | Speed measurements, before and after |
