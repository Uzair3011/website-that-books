# SEO tooling

The rules are in `.cursor/rules/seo.mdc`. The latest audit is `audit-2026-10.md`. Core Web Vitals measurements, before and after, are in `performance-baseline.md`. This page covers the scripts and files that enforce the rules.

## Checks

```sh
npm run seo:check              # failures only; exits 1 if there are any
npm run seo:check -- --verbose # also lists warnings
npm run seo:check -- --dist    # also checks dist/sitemap.xml (run after npm run build)
```

`npm test` runs the same checks (`tests/seo.test.mjs`), plus tests that feed the checker a broken site to prove each check still fires.

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
