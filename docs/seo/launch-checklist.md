# Launch checklist

Final QA run on 13 October 2026 against `main` at `1d1b87e`, which is the commit deployed on https://www.veltramedia.com (local `main` and `origin/main` match). Nothing in the page copy or design needed to change.

## 1. Verification results

### Commands

| Command | Result |
|---|---|
| `npm test` | 120 tests, 120 pass, 0 fail |
| `npm run seo:check` | Passed: 37 routes, 0 failures, 12 warnings (below) |
| `npm run build` | Built 33 pages into `dist/`, with `sitemap.xml`, `robots.txt` and `llms.txt` |
| `npm run seo:check -- --dist` | Passed (checks the built sitemap too) |
| `npm run seo:crawl -- http://localhost:4175` (built site via `npm run preview`) | Passed, 0 failures |
| `npm run seo:crawl -- https://www.veltramedia.com --live` | Passed, 0 failures |

The 12 `seo:check` warnings are the same as before this task and none blocks launch. Ten titles are shorter than the 50-60 character target: `/web-design-teesside` (48), `/local-seo-middlesbrough` (49), `/website-care` (48), `/work` (45), `/how-it-works` (41), `/contact` (47), `/resources/do-i-need-a-website-if-i-have-facebook` (46), `/privacy`, `/cookie-policy`, `/terms`. Short titles are not an error; they come from the keyword map. The other two warnings are that `/privacy` and `/cookie-policy` have fewer than 3 body links out. They are legal pages.

### Crawl results, built site and live site

`scripts/site-crawl.mjs` (new, `npm run seo:crawl`) fetches the site over HTTP the way a search engine does. Both runs gave the same answers unless noted.

| Check | Built site (preview) | Live site |
|---|---|---|
| Every sitemap URL returns 200 | Pass: 33 of 33 | Pass: 33 of 33 |
| Every sitemap URL is self-canonical (`https://www.veltramedia.com/...`) | Pass | Pass |
| No indexable page missing from the sitemap | Pass: the crawl found 33 indexable pages, all in the sitemap | Pass |
| No noindex page in the sitemap | Pass | Pass: `/checkout` is linked from `/pricing` on live, is `noindex`, and is correctly left out |
| The live sitemap lists the same URLs as the local build | n/a | Pass: identical `<loc>` lists |
| robots.txt allows the site, blocks only `/api/`, and names `https://www.veltramedia.com/sitemap.xml` | Pass | Pass |
| `/admin` is `noindex, nofollow` (meta tag and `X-Robots-Tag` header) and not blocked in robots.txt | Pass (meta tag) | Pass (both) |
| `/checkout/success` and `/checkout/cancelled` are `noindex` | Pass | Pass |
| All 15 redirect rules return 308 and land on a 200 page | Pass | Pass |
| `/ai-automation-middlesbrough` → `/ai-receptionist-middlesbrough` | Pass: 308, then 200 | Pass: 308, then 200 |
| `/marketing-services`, `/marketing-services/web-design`, `/marketing-services/seo` and any other `/marketing-services/...` | Pass: 308 to `/services`, `/web-design-middlesbrough`, `/local-seo-middlesbrough` and `/services` | Pass |
| Old `.html` URLs and trailing slashes (`/about.html`, `/index.html`, `/web-design-middlesbrough/`) | Pass: 308 to the clean URL | Pass |
| `veltramedia.com` (apex) → `https://www.veltramedia.com` | Not testable locally | Pass: `https://veltramedia.com/` 308 → www; `http://veltramedia.com/` 308 → 308 → www; deep links keep their path |
| `http://www.` → `https://www.` | Not testable locally | Pass: 308 |
| A random unknown URL returns a real 404 | Pass: `/qa-<random>`, `/qa-<random>/deeper` and `/resources/not-a-real-article` all return 404 with the `noindex` 404 page | Pass |
| Every internal link resolves to a 200 page with no redirect hop | Pass: 33 link targets | Pass: 39 link targets (the extra six are `/checkout?service=...` links that only appear when payments are configured) |
| Every image, stylesheet and script a page references returns 200 | Pass: 61 | Pass: 64 |
| Exactly one H1 per page | Pass: 33 of 33 | Pass |
| Unique title and unique meta description on every page | Pass | Pass |
| Valid JSON-LD on every page (parses, `@context` is `https://schema.org`, every node has an `@type`) | Pass | Pass |

**Redirect status codes.** Every redirect returns **308**, not 301. That is how Vercel sends `"permanent": true`. Google treats 301 and 308 the same way: both are permanent and both pass the old URL's signals to the new one (see `keyword-map.md` section 2, step 6).

**Two-hop redirects.** These come from the platform and cost nothing in SEO terms (see `README.md`, "How redirects work on Vercel"):

- `/marketing-services/` → `/marketing-services` → `/services`
- `/ai-receptionist-for-med-spas.html` → `/ai-receptionist-for-med-spas` → `/med-spa-growth-system`
- `http://veltramedia.com/` → `https://veltramedia.com/` → `https://www.veltramedia.com/`
- `https://veltramedia.com/contact-us` → `https://www.veltramedia.com/contact-us` → `/contact`

### What was fixed in this task

No check failed on the site itself. One gap was in the tooling:

- **`npm run preview` did not apply redirects.** It served files only, so every redirect URL returned 404 on the built site and could not be checked there. `scripts/preview.mjs` now answers redirects with `resolveRedirect()` from `src/pages.js`, which is the same table the dev server uses and the one `seo:check` keeps in step with `vercel.json`. After the fix, every redirect on the built site behaves exactly as it does on live.
- **Added `npm run seo:crawl`** (`scripts/site-crawl.mjs`) so these checks can be repeated after any deploy. It exits with code 1 if anything fails.

### Not covered by these checks

- **Rich result eligibility.** Use Google's Rich Results Test on the URLs in section 4. The crawl only checks that the JSON-LD parses and is well formed.
- **Field Core Web Vitals.** The lab results are in `performance-baseline.md`. Real-user data appears in Search Console about 28 days after enough visits.

## 2. Google Search Console, step by step

Read `docs/off-page-seo/search-console-ownership.md` first. A `google-site-verification` TXT record already exists on `veltramedia.com`, but nobody has yet confirmed which Google account it belongs to. **Do not delete or edit that record.**

### Step 1: add or confirm the property

1. Go to https://search.google.com/search-console and sign in with the Google account you want to own the property.
2. Open the property selector (top left). If `veltramedia.com` or `https://www.veltramedia.com/` is listed, select it and go to step 2 below.
3. If it is not listed, try each other candidate account (the worksheet in `docs/off-page-seo/search-console-account-check.md` lists them). If someone else holds it, ask them to add you as an Owner under **Settings → Users and permissions**.
4. Only if no account has it: click **Add property** → **Domain**, enter `veltramedia.com` and click **Continue**. Google shows a TXT value. If it matches the existing record (it starts `google-site-verification=waZ3ukEc`), click **Verify**. If it is different, **add** the new TXT record at the registrar next to the old one (never replace it), wait 10-60 minutes and click **Verify**.

A Domain property is the best choice because it covers `www`, the apex and both `http` and `https` in one place.

### Step 2: submit the sitemap

1. In the property, open **Indexing → Sitemaps**.
2. Under "Add a new sitemap", enter `https://www.veltramedia.com/sitemap.xml` (on a Domain property, type the full URL) and click **Submit**.
3. Within a day or two the status should read **Success** with **33** discovered pages. If it says "Couldn't fetch", wait a day and resubmit. The file is reachable and valid as of this check.
4. If an old sitemap URL from the previous site is listed (anything other than the one above), select it and remove it.

### Step 3: request indexing for the 10 most important URLs

Google allows roughly 10-12 "Request indexing" submissions per property per day, so this list fits in one day. For each URL, in this order:

1. Paste the URL into the **URL Inspection** bar at the top of Search Console and press Enter.
2. Wait for the result. "URL is not on Google" is normal for a new page.
3. Click **Test live URL**. Check that it says "URL is available to Google" and that **Page indexing** → **User-declared canonical** shows the same URL.
4. Click **Request indexing** and wait for the confirmation (about a minute).

| # | URL | Why it is in this position |
|---|---|---|
| 1 | https://www.veltramedia.com/ | The homepage. It carries the brand and links to everything. |
| 2 | https://www.veltramedia.com/web-design-middlesbrough | The main money page, for the highest-intent keyword. |
| 3 | https://www.veltramedia.com/ai-receptionist-middlesbrough | New URL that replaces `/ai-automation-middlesbrough`. Google needs to swap the old URL for this one. |
| 4 | https://www.veltramedia.com/local-seo-middlesbrough | Core service; also covers "SEO Teesside" for now. |
| 5 | https://www.veltramedia.com/pricing | Answers "website cost Middlesbrough". Buyers close to a decision land here. |
| 6 | https://www.veltramedia.com/web-design-teesside | The regional web design page that links to every town page. |
| 7 | https://www.veltramedia.com/web-design-stockton-on-tees | New. The largest town after Middlesbrough, and it also covers Billingham. |
| 8 | https://www.veltramedia.com/web-design-for-trades-teesside | New. The page for trades, the second-strongest niche. |
| 9 | https://www.veltramedia.com/google-business-profile | A £99 service with its own keyword. |
| 10 | https://www.veltramedia.com/ai-agents-teesside | New overview page for "AI agents Teesside" and "AI automation". |

Next day, if you want: `/web-design-redcar`, `/web-design-hartlepool`, `/areas`, `/resources` and the six articles. They are in the sitemap, so Google will find them without a request, but a request can speed it up.

Do not request indexing for redirected URLs such as `/ai-automation-middlesbrough`. Google picks up the redirect when it next crawls the old URL.

### Step 4: check the reports after 1-2 weeks

1. **Indexing → Pages.** "Indexed" should rise towards 33. For anything under "Why pages aren't indexed":
   - *Page with redirect*, *Not found (404)* and *Excluded by 'noindex' tag* are expected for the old URLs, unknown URLs, `/checkout` and `/admin`.
   - *Crawled - currently not indexed* or *Discovered - currently not indexed* on a sitemap URL: wait another week, then inspect the URL and request indexing again. If it is still out after a month, the page may need stronger content or more links in.
   - *Duplicate, Google chose different canonical than user* on any sitemap URL: note it and investigate; every page declares itself as canonical.
2. **Experience → Core Web Vitals.** There may be "Not enough usage data" for several weeks on a new or low-traffic site. That is normal. When data appears, the goal is every URL group "Good" on mobile (LCP under 2.5 s, INP under 200 ms, CLS under 0.1). Compare with `performance-baseline.md`.
3. **Performance → Search results.** Start the monthly rank tracking (see `README.md` and `rank-tracking.csv`).
4. **Enhancements** (left menu: Breadcrumbs, FAQ, and similar). Fix anything listed as invalid. Warnings about optional fields can wait.
5. **Settings → Crawl stats** (optional). A large number of 404s or server errors here would be worth a look.

## 3. Bing Webmaster Tools

Bing also supplies results to DuckDuckGo, Yahoo and Ecosia, and ChatGPT search uses Bing's index.

1. Finish the Search Console steps first, so the property is verified there.
2. Go to https://www.bing.com/webmasters and sign in with a Microsoft, Google or Facebook account.
3. Choose **Import from Google Search Console**, allow access with the Google account that owns the property, tick `veltramedia.com` and click **Import**. This verifies the site and imports the sitemap in one step.
4. Open **Sitemaps** and check that `https://www.veltramedia.com/sitemap.xml` is listed. If not, add it.
5. Optional: set up IndexNow (see `README.md`, "IndexNow") so Bing is told about changed pages straight away.
6. After 1-2 weeks, check **Search Performance** and **Site Explorer** in the same way as the Search Console reports.

## 4. Rich Results Test

Test each URL at https://search.google.com/test/rich-results (choose **URL** and paste it in). For a fuller check of every schema type, use https://validator.schema.org on the same URLs.

| URL | Markup on the page | What the test should detect |
|---|---|---|
| https://www.veltramedia.com/ | ProfessionalService, WebSite, Service, FAQPage | Organisation or Local business (see below); FAQ |
| https://www.veltramedia.com/web-design-middlesbrough | + Service, FAQPage, BreadcrumbList | Breadcrumbs; FAQ |
| https://www.veltramedia.com/ai-receptionist-middlesbrough | + Service, FAQPage, BreadcrumbList | Breadcrumbs; FAQ |
| https://www.veltramedia.com/web-design-stockton-on-tees | + Service, FAQPage, BreadcrumbList | Breadcrumbs; FAQ |
| https://www.veltramedia.com/pricing | + FAQPage, BreadcrumbList | Breadcrumbs; FAQ |
| https://www.veltramedia.com/areas | + CollectionPage, BreadcrumbList | Breadcrumbs |
| https://www.veltramedia.com/resources/how-much-does-a-website-cost | + BlogPosting, BreadcrumbList | Article; Breadcrumbs |
| https://www.veltramedia.com/resources/what-is-an-ai-receptionist | + BlogPosting, BreadcrumbList | Article; Breadcrumbs |
| https://www.veltramedia.com/how-it-works | + FAQPage, BreadcrumbList | Breadcrumbs; FAQ |

What to expect:

- **Breadcrumbs, Article and FAQ** items should have no errors. Warnings about optional fields are fine.
- **FAQ.** The test may find the FAQ markup, but since 2023 Google shows FAQ rich results only for well-known government and health sites. The markup is still valid and still helps search engines read the page. Do not expect FAQ drop-downs in results.
- **Local business.** The organisation is marked up as `ProfessionalService`, which is a kind of `LocalBusiness`. The site deliberately publishes no street address, so the test may list a "Local business" item as invalid because `address` is missing. **That is expected. Do not add an address to fix it.** The rules forbid inventing one, and a service area business should not publish a home address. The Google Business Profile, not the website markup, is what puts the business in Maps. If you would rather not see the warning, the alternative is a code change from `ProfessionalService` to `Organization`. That is a decision for you, not a launch blocker.
- If a URL shows "Page not eligible" with no errors, that is fine for pages whose only markup is the organisation and breadcrumbs.

## 5. Re-running these checks

After any deploy that changes pages, redirects or `vercel.json`:

```sh
npm test
npm run build
npm run preview                                                # leave running
npm run seo:crawl -- http://localhost:4175                     # in a second terminal
npm run seo:crawl -- https://www.veltramedia.com --live        # after the deploy is live
```
