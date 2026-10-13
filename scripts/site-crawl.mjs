// Crawls a running site over HTTP and checks what a search engine sees:
// robots.txt, every sitemap URL (200, self-canonical, indexable), pages the
// crawl finds that the sitemap misses, every internal link and asset, every
// redirect in src/pages.js, a real 404 for unknown URLs, and one H1, a unique
// title and description and parseable JSON-LD per page. Exits 1 on failure.
//
//   npm run build && npm run preview          # then, in a second terminal:
//   npm run seo:crawl -- http://localhost:4175
//   npm run seo:crawl -- https://www.veltramedia.com --live   # adds apex/http checks
import { redirects, redirectPrefixes } from "../src/pages.js";

const base = (process.argv[2] || "http://localhost:4175").replace(/\/$/, "");
const live = process.argv.includes("--live");
const CANON = "https://www.veltramedia.com";

const fails = [];
const notes = [];
const rows = [];
const fail = (check, detail) => fails.push(`${check}: ${detail}`);
const pathOf = (u) => new URL(u, CANON).pathname;

const cache = new Map();
function get(url) {
  if (!cache.has(url))
    cache.set(
      url,
      (async () => {
        for (let attempt = 0; ; attempt++) {
          try {
            const r = await fetch(url, { redirect: "manual" });
            const body = [200, 404].includes(r.status) ? await r.text() : "";
            return { status: r.status, location: r.headers.get("location"), headers: r.headers, body };
          } catch (error) {
            if (attempt === 2) return { status: 0, body: "", error: String(error) };
          }
        }
      })(),
    );
  return cache.get(url);
}

async function follow(url) {
  const hops = [];
  let current = url;
  for (let i = 0; i < 6; i++) {
    const r = await get(current);
    hops.push({ url: current, status: r.status });
    if (![301, 302, 307, 308].includes(r.status) || !r.location) return { hops, final: r, finalUrl: current };
    current = new URL(r.location, current).href;
  }
  return { hops, final: { status: -1 }, finalUrl: current };
}

function parse(html) {
  const attr = (re) => re.exec(html)?.[1];
  const all = (re) => [...html.matchAll(re)].map((m) => m[1].replace(/&amp;/g, "&"));
  return {
    title: attr(/<title>([^<]*)<\/title>/i)?.trim(),
    description: attr(/<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: attr(/<link\s+rel="canonical"\s+href="([^"]*)"/i),
    robots: attr(/<meta\s+name="robots"\s+content="([^"]*)"/i) || "",
    h1: (html.match(/<h1[\s>]/gi) || []).length,
    jsonLd: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]),
    links: all(/<a\s[^>]*href="([^"]+)"/g),
    assets: [
      ...all(/<(?:img|script)\s[^>]*src="([^"]+)"/g),
      ...all(/<link\s[^>]*href="([^"]+)"/g),
      ...all(/srcset="([^"]+)"/g).flatMap((s) => s.split(",").map((part) => part.trim().split(/\s+/)[0])),
    ],
  };
}

// robots.txt
const robots = await get(`${base}/robots.txt`);
if (robots.status !== 200) fail("robots.txt", `status ${robots.status}`);
if (!/^Sitemap: https:\/\/www\.veltramedia\.com\/sitemap\.xml$/m.test(robots.body)) fail("robots.txt", "no Sitemap line for the www sitemap");
if (/^Disallow:\s*\/\s*$/m.test(robots.body)) fail("robots.txt", "disallows the whole site");

// Sitemap URLs
const sitemap = await get(`${base}/sitemap.xml`);
if (sitemap.status !== 200) fail("sitemap", `status ${sitemap.status}`);
const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const sitemapPaths = new Set(locs.map(pathOf));
for (const loc of locs) if (!loc.startsWith(`${CANON}/`)) fail("sitemap", `not a www URL: ${loc}`);
notes.push(`sitemap: ${locs.length} URLs`);

const pages = new Map();
async function visit(path) {
  if (pages.has(path)) return;
  const r = await get(base + path);
  const headerRobots = r.headers?.get("x-robots-tag") || "";
  pages.set(path, r.status === 200 ? { status: 200, headerRobots, ...parse(r.body) } : { status: r.status });
  if (r.status !== 200 && sitemapPaths.has(path)) fail("sitemap URL not 200", `${path} → ${r.status}`);
}
for (const path of sitemapPaths) await visit(path);

// Follow internal links from every page found, so pages missing from the sitemap show up.
const linkTargets = new Map();
const queue = [...pages.keys()];
while (queue.length) {
  const from = queue.shift();
  for (const href of pages.get(from).links || []) {
    if (/^(#|mailto:|tel:|javascript:)/.test(href)) continue;
    const u = new URL(href, CANON + from);
    if (u.host !== "www.veltramedia.com") {
      if (u.host.endsWith("veltramedia.com")) fail("internal link host", `${from} links to ${u.href}`);
      continue;
    }
    const target = u.pathname + u.search;
    if (!linkTargets.has(target)) linkTargets.set(target, new Set());
    linkTargets.get(target).add(from);
    if (!pages.has(u.pathname) && !/\.\w+$/.test(u.pathname) && (await get(base + u.pathname)).status === 200) {
      await visit(u.pathname);
      queue.push(u.pathname);
    }
  }
}

for (const [target, from] of linkTargets) {
  const { hops, final, finalUrl } = await follow(base + target);
  const sources = [...from].slice(0, 3).join(", ");
  if (final.status !== 200) fail("internal link", `${target} → ${final.status} (from ${sources})`);
  else if (hops.length > 1) fail("internal link redirects", `${target} → ${pathOf(finalUrl)} (from ${sources})`);
}
notes.push(`internal link targets: ${linkTargets.size}`);

const assets = new Set();
for (const [path, page] of pages)
  for (const a of page.assets || []) {
    const u = new URL(a, CANON + path);
    if (u.host === "www.veltramedia.com") assets.add(u.pathname + u.search);
  }
for (const a of assets) {
  const { status } = await get(base + a);
  if (status !== 200) fail("asset", `${a} → ${status}`);
}
notes.push(`assets: ${assets.size}`);

// Per-page checks
const titles = new Map();
const descriptions = new Map();
const group = (map, key, path) => map.set(key, [...(map.get(key) || []), path]);
for (const [path, page] of pages) {
  if (page.status !== 200) continue;
  const noindex = /noindex/i.test(`${page.robots} ${page.headerRobots}`);
  if (noindex) {
    if (sitemapPaths.has(path)) fail("noindex page in sitemap", path);
    else notes.push(`noindex, not in sitemap (correct): ${path}`);
    continue;
  }
  if (!sitemapPaths.has(path)) fail("indexable page missing from sitemap", path);
  if (page.canonical !== CANON + path) fail("canonical", `${path} → ${page.canonical}`);
  if (page.h1 !== 1) fail("H1 count", `${path} has ${page.h1}`);
  if (!page.title) fail("title", `${path} has none`);
  if (!page.description) fail("description", `${path} has none`);
  group(titles, page.title, path);
  group(descriptions, page.description, path);
  if (!page.jsonLd.length) fail("JSON-LD", `${path} has none`);
  for (const block of page.jsonLd) {
    try {
      const data = JSON.parse(block);
      if (data["@context"] !== "https://schema.org") fail("JSON-LD", `${path}: @context is ${data["@context"]}`);
      for (const node of data["@graph"] || [data]) if (!node["@type"]) fail("JSON-LD", `${path}: node without @type`);
    } catch (error) {
      fail("JSON-LD", `${path} does not parse: ${error.message}`);
    }
  }
}
for (const [title, paths] of titles) if (paths.length > 1) fail("duplicate title", `"${title}" on ${paths.join(", ")}`);
for (const [, paths] of descriptions) if (paths.length > 1) fail("duplicate description", paths.join(", "));
notes.push(`pages crawled: ${[...pages.values()].filter((p) => p.status === 200).length}`);

// Redirects: the whole table, a prefix match, and the platform hops (.html, trailing slash).
const cases = [
  ...Object.entries(redirects),
  ...Object.entries(redirectPrefixes).map(([prefix, to]) => [`${prefix}an-old-page`, to]),
  ["/marketing-services/", "/services"],
  ["/ai-automation-middlesbrough/", "/ai-receptionist-middlesbrough"],
  ["/ai-receptionist-for-med-spas.html", "/med-spa-growth-system"],
  ["/about.html", "/about"],
  ["/index.html", "/"],
  ["/web-design-middlesbrough/", "/web-design-middlesbrough"],
];
const describe = ({ hops, final }) => `${hops.map((h) => `${h.status} ${pathOf(h.url)}`).join(" → ")} (final ${final.status})`;
for (const [from, to] of cases) {
  const result = await follow(base + from);
  const ok =
    [301, 308].includes(result.hops[0].status) &&
    result.final.status === 200 &&
    result.finalUrl === new URL(to, base).href;
  rows.push(`${ok ? "PASS" : "FAIL"} ${describe(result)}`);
  if (!ok) fail("redirect", `${from}: ${describe(result)}, expected ${to}`);
}

if (live)
  for (const [from, to] of [
    ["https://veltramedia.com/", "/"],
    ["http://veltramedia.com/", "/"],
    ["http://www.veltramedia.com/", "/"],
    ["https://veltramedia.com/web-design-redcar", "/web-design-redcar"],
    ["https://veltramedia.com/contact-us", "/contact"],
  ]) {
    const result = await follow(from);
    const ok = [301, 308].includes(result.hops[0].status) && result.final.status === 200 && result.finalUrl === CANON + to;
    const line = `${from} → ${result.hops.map((h) => h.status).join(" → ")} ${result.finalUrl}`;
    rows.push(`${ok ? "PASS" : "FAIL"} ${line}`);
    if (!ok) fail("host redirect", line);
  }

// Unknown URLs must answer 404 with the noindex 404 page, not a soft 200.
const random = `/qa-${Math.random().toString(36).slice(2, 10)}`;
for (const path of [random, `${random}/deeper`, "/resources/not-a-real-article"]) {
  const r = await get(base + path);
  const ok = r.status === 404 && /<meta\s+name="robots"\s+content="[^"]*noindex/.test(r.body);
  rows.push(`${ok ? "PASS" : "FAIL"} ${path} → ${r.status}`);
  if (!ok) fail("404", `${path} → ${r.status}`);
}

console.log(`Crawl of ${base}\n${notes.join("\n")}\n\n${rows.join("\n")}\n`);
if (fails.length) {
  console.log(`${fails.length} failure(s):\n${fails.join("\n")}`);
  process.exit(1);
}
console.log("Crawl passed.");
