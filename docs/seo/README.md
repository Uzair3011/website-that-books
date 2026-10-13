# SEO tooling

The rules are in `.cursor/rules/seo.mdc`. The latest audit is `audit-2026-10.md`. Core Web Vitals measurements, before and after, are in `performance-baseline.md`. This page covers the scripts and files that enforce the rules, and how to fill in the monthly rank tracker.

Handover documents (13 Oct 2026):

- `owner-summary.md`: what was done, and what is still needed from the owner.
- `launch-checklist.md`: the final QA results, plus the Search Console, Bing and Rich Results Test steps.
- `30-60-90.md`: what to do and measure in the first three months.
- `rank-tracking.csv`: the monthly keyword tracker (see "Monthly rank tracking" below).

## Monthly rank tracking

`rank-tracking.csv` has one row for each page's main keyword, taken from `keyword-map.md`. Once a month, ideally in the first week, copy the rows from Search Console into it. It takes about 30 minutes.

**What the columns mean**

- **date**: the month the figures cover, written as `2026-11` for November 2026.
- **keyword**, **target URL**, **area**: already filled in. The area is the town the keyword is about, "UK" for keywords with no town, or "Brand".
- **impressions**: how many times the site showed up in Google results for searches like this.
- **clicks**: how many of those people clicked through to the site.
- **average position**: where the site usually appeared. 1 is the top result; 1-10 is page one; 11-20 is page two.
- **notes**: anything worth remembering, for example "page rewritten 4 Nov" or "first click".

**How to fill it in**

1. Open Search Console, choose the `veltramedia.com` property, then **Performance → Search results**.
2. Set the **Date** filter to the previous full month: click **Date**, then **Custom**, then pick the first and last day of that month.
3. Make sure **Total clicks**, **Total impressions** and **Average position** are all switched on (click each box so it is coloured).
4. Click **+ Add filter** → **Query** → **Queries containing**. Type a short, distinctive part of the keyword:
   - For town keywords, type the town name: `middlesbrough`, `teesside`, `stockton`, `billingham`, `redcar`, `hartlepool`, `tees valley`.
   - For keywords without a town, type the distinctive part: `ai receptionist`, `facebook`, `local seo checklist`, `service area`, `google maps`, `med spa`, `website cost`.
   - For the brand, type `veltra media`.
5. Click the **Pages** tab below the chart and find the row for the target URL. Copy its clicks, impressions and position into that keyword's row. Then click the **Queries** tab to see the actual searches people used. If one of them looks like a new page idea, write it in the notes.
6. Clear the filter (click the **x** on it) and repeat for the next keyword. One town filter covers every row for that town, so do all the Middlesbrough rows together.
7. Next month, **add new rows** with the new date rather than overwriting old ones. Copy the previous month's rows, change the date and replace the numbers. Sorting by keyword then shows the trend for each one.

**Reading it**

- Blank or zero rows are normal for the first few months. A new page often takes 4-12 weeks to collect impressions.
- **Impressions rising** means Google is starting to show the page. That comes before clicks.
- **Average position between 8 and 20** means the page is close to page one. These are the pages to improve first (see `30-60-90.md`).
- Average position is unreliable on very small numbers. A position of 3 from 4 impressions means little. Look at trends over 2-3 months.
- Search Console keeps 16 months of data and its figures are 2-3 days behind, so fill in a month after its first few days have passed.
- The figures are Google's own. They are better than any third-party rank checker for a site this size, because they show real searches in your area.

## Checks

```sh
npm run seo:check              # failures only; exits 1 if there are any
npm run seo:check -- --verbose # also lists warnings
npm run seo:check -- --dist    # also checks dist/sitemap.xml (run after npm run build)
```

`npm test` runs the same checks (`tests/seo.test.mjs`), plus tests that feed the checker a broken site to prove each check still fires.

`npm run seo:crawl -- <base URL>` (`scripts/site-crawl.mjs`) checks a running site over HTTP. Point it at `npm run preview` (http://localhost:4175) or the live site. Add `--live` to also check the apex and `http://` redirects. It checks robots.txt, that every sitemap URL is 200, self-canonical and indexable, that no crawled indexable page is missing from the sitemap, every internal link and asset, every redirect in `src/pages.js`, a real 404 for unknown URLs, and one H1, a unique title and description and parseable JSON-LD per page. `npm run preview` applies the same redirects as Vercel, so the built site can be checked before deploy.

The checker fails on:

- Titles, descriptions, H1 count, canonicals, JSON-LD parsing, TODO text and orphan pages (see the rules file).
- **Sitemap.** Every indexable page is listed and nothing else is. Every `<url>` has a `<lastmod>` in `YYYY-MM-DD` form, and there is no `<priority>`.
- **Redirects.** `src/pages.js` (`redirects`, `redirectPrefixes`) and `vercel.json` (`redirects`) must hold exactly the same rules. Every destination must be a live page, so there are no chains. No source may end in `.html`, `/index` or `/` (see below). `vercel.json` must keep `cleanUrls: true` and `trailingSlash: false`.
- **robots.txt and /admin.** robots.txt must not disallow `/admin`, so crawlers can fetch it and see its `noindex` meta tag and `X-Robots-Tag` header.
- **404.** The 404 page is `noindex` and links to every service page. `vercel.json` has no catch-all rewrite or legacy `routes`, either of which would answer unknown URLs with a 200.
- **llms.txt.** It links only to live, indexable pages.
- **Structured data.** Every JSON-LD block has `"@context": "https://schema.org"`, only `@type`s listed in `KNOWN_JSON_LD_TYPES`, and no empty strings or arrays. No `address`, `streetAddress`, `openingHours`, `aggregateRating`, `review` or rating keys anywhere. Every `{"@id": …}` reference resolves to a node on the same page, and the organisation node (`/#organization`, emitted by `src/layout.js`) is defined exactly once per page. Every `Service` has a `serviceType`, the organisation as `provider` and an `areaServed`. `FAQPage` questions and answers match the visible FAQ text, in order.
- **Breadcrumbs.** Every indexable page below the homepage has one `BreadcrumbList` from Home to itself, and the visible breadcrumb (drawn by `src/layout.js` from that list) shows the same names and links.
- **Images.** Every `<img>` has a non-empty `alt` (or `alt=""` plus `aria-hidden="true"` for a purely decorative image), and a numeric `width` and `height`. Each page's hero/LCP image has `loading="eager" fetchpriority="high"`, and no page has more than one. Every other image has `loading="lazy" decoding="async"`. The homepage's first image must be the priority image.

The checker warns on (does not fail): title length outside 50-60, fewer than 3 contextual links in or out, and image files over 150 KB.

## Generated files

`scripts/seo-files.mjs` builds three files. `scripts/build.mjs` writes them into `dist/`, `scripts/dev.mjs` serves the sitemap and llms.txt, and the checker reads the same output.

| File | Contents |
|---|---|
| `sitemap.xml` | Indexable pages only. `lastmod` is the date of the last commit to the page's own `src/pages/*.js` file (`git log -1 --format=%cs`), or the build date if git cannot say. |
| `robots.txt` | Allows everything except `/api/`, and names the sitemap. |
| `llms.txt` | A short summary for AI search tools: the about-page description, services, areas served, key pages with their meta descriptions, and contact details. Every line is generated from `SITE`, `SERVICES` or page metadata, so it only repeats what the site already says. Legal pages are left out. |

Notes on `lastmod`:

- Shared templates (`src/service-sales-page.js`, `src/site.js`) are not counted. A change to a shared template does not move the dates of the pages that use it.
- Vercel may build from a shallow clone with limited history. If a page's last commit is outside that history, its `lastmod` falls back to the build date. Check `/sitemap.xml` after a deploy if the dates matter.

## How redirects work on Vercel

Vercel handles a request in this order: `cleanUrls`, then `trailingSlash`, then `vercel.json` `redirects`.

- `cleanUrls` sends `/x.html`, `/x/index` and `/x/index.html` to `/x`.
- `trailingSlash: false` sends `/x/` to `/x`.
- A `vercel.json` rule whose source ends in `.html` therefore never fires. Before this change, `/website-that-books-fixed.html` was redirected to `/website-that-books-fixed`, which had no rule and returned a 404.

`platformRedirect()` in `src/pages.js` copies these platform hops, and `resolveRedirect()` applies them before the table. The dev server then answers exactly as Vercel would.

Two chains remain because the platform creates them, and no redirect table can avoid them:

- An old `.html` URL whose clean path is itself redirected takes two hops, for example `/ai-receptionist-for-med-spas.html` → `/ai-receptionist-for-med-spas` → `/med-spa-growth-system`.
- A request to the apex domain for a redirected path takes two hops, for example `veltramedia.com/contact-us` → `www.veltramedia.com/contact-us` → `/contact`.

Search engines follow both, so there is no SEO cost.

To add a redirect, add it to `redirects` in `src/pages.js` **and** `vercel.json`, then run `npm run seo:check`.

## IndexNow (optional)

IndexNow tells Bing, Yandex, Seznam and Naver that URLs have changed, so they recrawl sooner. Google does not use it. Nothing runs it automatically.

1. Generate a key (8-128 letters, digits or hyphens). For example, run `node -e "console.log(crypto.randomUUID())"`.
2. In Vercel, add `INDEXNOW_KEY` as an environment variable for Production, then redeploy. The build writes `dist/<key>.txt` containing the key, which is how IndexNow checks you own the site. If the variable is not set, no key file ships.
3. After a deploy that changed pages, run this locally:

   ```sh
   SITE_URL=https://www.veltramedia.com INDEXNOW_KEY=<key> node scripts/indexnow.mjs --dry-run   # prints the payload
   SITE_URL=https://www.veltramedia.com INDEXNOW_KEY=<key> node scripts/indexnow.mjs             # submits it
   ```

   On Windows PowerShell, set the variables first: `$env:SITE_URL="https://www.veltramedia.com"; $env:INDEXNOW_KEY="<key>"`.

The script checks that `https://www.veltramedia.com/<key>.txt` serves the key, reads the live `sitemap.xml`, and posts every URL on that host to `https://www.bing.com/indexnow`. HTTP 200 or 202 means the URLs were accepted. Submit only when pages have actually changed, not on every deploy.
