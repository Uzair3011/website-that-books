# Performance baseline (Core Web Vitals, mobile)

Measured 13 October 2026. Goal: LCP under 2.5 s, CLS under 0.1 and good INP (TBT is the lab stand-in) on mobile.

## How it was measured

- Lighthouse 13.5.0 (`npx lighthouse`), Chrome 154 headless, mobile emulation, default simulated throttling (150 ms RTT, ~1.6 Mbps, 4× CPU slowdown), performance category only.
- Against the **production build** served by `npm run preview` (`scripts/preview.mjs`), which applies the `vercel.json` headers and brotli compression the way Vercel does. The dev server sends `Cache-Control: no-store` and no compression, so it would overstate the problems.
- Built with placeholder chat and voice keys, so `chat.js` and `voice.js` load as they do in production.
- Each URL was run 3 times; the tables show the **median**. Lab numbers on one Windows laptop vary between runs: TBT on the same unchanged page ranged from 17 to 156 ms. Treat changes of a few tens of milliseconds as noise.

To repeat: `npm run build && npm run preview`, then `npx lighthouse http://localhost:4175/<path> --only-categories=performance`.

## Before

| Page | Score | FCP | LCP | CLS | TBT | Speed Index | Page weight |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | 95 | 1.59 s | **2.73 s** | 0.000 | 88 ms | 2.7 s | 283 KB |
| /web-design-middlesbrough | 93 | 1.78 s | 2.17 s | 0.000 | 139 ms | 5.0 s | 86 KB |
| /web-design-stockton-on-tees | 95 | 1.76 s | 2.02 s | 0.000 | 73 ms | 5.0 s | 82 KB |
| /ai-receptionist-middlesbrough | 93 | 1.79 s | 1.97 s | 0.000 | 115 ms | 5.0 s | 83 KB |
| /resources | 95 | 1.59 s | 1.83 s | 0.000 | 65 ms | 4.8 s | 80 KB |
| /resources/how-much-does-a-website-cost | 94 | 1.72 s | 1.93 s | 0.000 | 110 ms | 4.9 s | 81 KB |

Only the homepage failed a Core Web Vital (LCP 2.73 s). CLS was already 0 everywhere.

### Top opportunities Lighthouse reported

1. **Image delivery (homepage): ~117 KiB.** The hero was a 113 KB PNG at 1200×880 shown at 372 px wide on a phone; the two service screenshots (1200 px) were shown at under 200 px.
2. **Cache lifetimes: 39–194 KiB per page.** Everything under `/assets/` was cached for one hour, including the versioned (`?v=`) CSS and JS.
3. **Unused CSS: 16–21 KiB, and unminified CSS: ~8 KiB.** One 147 KB stylesheet (24 KB brotli) serves every page and is render-blocking.
4. **Render-blocking requests: 30–230 ms.** `styles.css` and the tiny `init.js`.
5. **LCP render delay.** On every page the LCP element is hero text (the lede or H1), not an image. Its delay comes from the bytes that load before it, not from the hero entrance animation: forcing reduced motion only moved homepage LCP from 2.73 s to 2.65 s.
6. **Speed Index ~5 s on inner pages.** This comes from the cookie banner, which `consent.js` adds after load. It is fixed-position, so it causes no layout shift, and Speed Index is not a Core Web Vital.

## What changed

| Change | Why |
| --- | --- |
| Homepage hero: `hero-poster.png` (113 KB) → `hero-poster.webp` (36 KB) plus an 800 px version (21 KB), with `srcset`/`sizes` | The biggest byte cost before the homepage LCP. It keeps `loading="eager" fetchpriority="high"`. |
| `tees-transporter-bridge.webp` 177 KiB → 146 KiB (149,440 bytes) at the same 1600×1047, plus an 800 px version (54 KB) with `srcset` on the homepage and service pages | Was over the 150 KB budget. Phones now load the 800 px version. Compared at 100% crop: no visible difference. |
| Service screenshots: 600 px versions (16 KB each) with `srcset` | Shown at 160–500 px; the 1200 px files stay for high-density screens. |
| `npm run build` minifies CSS (`scripts/minify-css.mjs`) | Removes only comments and whitespace. Checked with lightningcss: the original and minified stylesheets parse to identical output. `styles.css` 147 KB → 95 KB raw, 24 KB → 16 KB brotli. |
| Removed CSS rules for classes that appear nowhere in the code (`.dim`, the old audit-offer block, `.offer-banner`, `.marquee-track`, `.custom-row`, `.price-note` and others) | Only provably dead rules. The rest of the "unused CSS" is used on other pages, because one stylesheet serves the whole site. |
| `vercel.json`: `/assets/*` requests **with** `?v=` are cached for a year (`immutable`) | Every CSS and JS reference is versioned with a hash of the contents (checked in the built HTML and module imports). Images, `/assets/vendor/*` and icons are referenced without `?v=`, so they keep the one-hour cache. A blanket long cache would have served stale images after a deploy. A build test enforces this. |
| `src/asset-version.js` also hashes the minifier | A change to the minifier changes the CSS output, so it must change the version too. |

Not changed, on purpose:

- **Fonts.** `manrope-latin.woff2` is already preloaded and uses `font-display: swap`, and CLS is 0.
- **Scripts.** `app.js` is a module (deferred by default) and `consent.js`, `chat.js` and `voice.js` are already `defer`. `init.js` (319 bytes) must run before first paint to set the `js` class, and the Content-Security-Policy rules out inlining it.
- **Hero entrance animation.** It is part of the design, and the reduced-motion test showed it is not the LCP problem.
- **Cookie banner.** It drives Speed Index, but not CLS or LCP.
- **The Content-Security-Policy and other security headers** are unchanged.

## After

Same method: 3 runs per URL, medians.

| Page | Score | LCP | CLS | TBT | FCP | Speed Index | Page weight |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | 95 → **98** | 2.73 → **2.09 s** | 0.000 → 0.000 | 88 → 84 ms | 1.59 → 1.52 s | 2.7 → 2.4 s | 283 → **136 KB** |
| /web-design-middlesbrough | 93 → 92 | 2.17 → 2.05 s | 0.000 → 0.000 | 139 → **189 ms** (worse) | 1.78 → 1.59 s | 5.0 → 5.1 s | 86 → 77 KB |
| /web-design-stockton-on-tees | 95 → 95 | 2.02 → 1.95 s | 0.000 → 0.000 | 73 → 46 ms | 1.76 → 1.59 s | 5.0 → 4.9 s | 82 → 73 KB |
| /ai-receptionist-middlesbrough | 93 → 95 | 1.97 → 1.80 s | 0.000 → 0.000 | 115 → 97 ms | 1.79 → 1.63 s | 5.0 → 5.0 s | 83 → 75 KB |
| /resources | 95 → 95 | 1.83 → 1.88 s (no gain) | 0.000 → 0.000 | 65 → 74 ms | 1.59 → 1.66 s | 4.8 → 4.8 s | 80 → 71 KB |
| /resources/how-much-does-a-website-cost | 94 → 95 | 1.93 → 1.92 s | 0.000 → 0.000 | 110 → 71 ms | 1.72 → 1.68 s | 4.9 → 4.9 s | 81 → 73 KB |

All six pages now pass LCP (< 2.5 s) and CLS (< 0.1) in the lab.

### What did not improve

- **/web-design-middlesbrough TBT went up.** In a separate 5-run A/B on this page, the median TBT was 124 ms before and 185–202 ms after. Serving the after build with the unminified stylesheet brought it back to 123 ms, even though total main-thread work in that batch was the highest of all. So the rise is not extra work. TBT only counts blocking time after First Contentful Paint. The smaller stylesheet moves FCP earlier, so long tasks that already existed now land inside that window. The largest long task (~300 ms on the throttled CPU) is `chat.js` adding its launcher, plus the initial style and layout of a long page. It sits at or just above Lighthouse's 200 ms "good" line, so it is the next thing to work on (see below).
- **/resources:** LCP and FCP were 0.05–0.07 s slower. This is within run-to-run noise; the only changes on that page are the CSS ones.
- **Speed Index stays at ~5 s on inner pages** because of the late cookie banner (see above).
- **Remaining "unused CSS" (~12–13 KiB per page)** is used elsewhere on the site. Removing it would mean splitting the stylesheet per page.

## Next steps (not done here)

1. **`chat.js` start-up (affects INP and TBT on every page).** Its long task comes from injecting the launcher during load. Building the launcher markup into the page, or deferring the injection until idle, would remove most of it. This file falls under the "do not touch chat" rule for SEO work, so it needs its own task.
2. **Cookie banner first paint.** Rendering the banner markup in the HTML, hidden by `init.js` when a choice is already saved, would bring Speed Index on inner pages down to around 2.5 s.
3. **Image cache lifetime.** Images are unversioned, so they keep a one-hour cache. Content-hashed image names (or `?v=` on image URLs) would let them be cached for a year too.
4. **Field data.** These are lab numbers. Check the Core Web Vitals report in Search Console (and Vercel Speed Insights, if enabled) about 28 days after deploy.
