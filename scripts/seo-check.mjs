// SEO guardrails as code. `npm run seo:check` prints a table of failures and
// exits 1 if any exist; tests/seo.test.mjs runs the same checks under `npm test`.
//
// Pages are rendered straight from src/layout.js, exactly as scripts/build.mjs
// does, so this needs no node_modules and no build output.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { renderPage } from "../src/layout.js";
import {
  notFoundPage,
  pages,
  redirectPrefixes,
  redirects,
  resolveRedirect,
  utilityPages,
} from "../src/pages.js";

export const ORIGIN = "https://www.veltramedia.com";

export const LIMITS = {
  titleMax: 65,
  titleAimMin: 50,
  titleAimMax: 60,
  descMin: 120,
  descMax: 158,
  contextualLinks: 3,
};

// Keys that must never appear anywhere in structured data (hard rule 1).
const FORBIDDEN_JSON_LD_KEYS = new Set([
  "streetAddress",
  "aggregateRating",
  "review",
  "reviews",
  "reviewCount",
  "ratingValue",
]);
const FORBIDDEN_JSON_LD_TYPES = new Set(["Review", "AggregateRating"]);

// ───────────────────────── Loading ─────────────────────────

/** Renders every route once. Pass overrides to test the checks against a broken site. */
export function loadSite(overrides = {}) {
  const site = {
    origin: ORIGIN,
    pages,
    utilityPages,
    notFoundPage,
    redirects,
    redirectPrefixes,
    resolveRedirect,
    vercel: JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")),
    buildSource: readFileSync(new URL("./build.mjs", import.meta.url), "utf8"),
    ...overrides,
  };
  const render = (page) =>
    renderPage(page, { origin: site.origin, chat: false, voice: false });
  site.html = new Map(
    [...site.pages, ...site.utilityPages, site.notFoundPage].map((page) => [
      page.path,
      overrides.html?.get(page.path) ?? render(page),
    ]),
  );
  return site;
}

// ───────────────────────── Parsing ─────────────────────────

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export const decode = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (whole, name) => {
    if (name[0] === "#") {
      const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1));
      return String.fromCodePoint(code);
    }
    return ENTITIES[name.toLowerCase()] ?? whole;
  });

const textOf = (html) =>
  decode(
    html
      .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const chars = (text) => [...text].length;

function mainOf(html) {
  const start = html.indexOf("<main");
  const end = html.indexOf("</main>");
  return start === -1 || end === -1 ? "" : html.slice(start, end);
}

/** Internal link targets as clean paths: no query, fragment or trailing slash. */
export function internalLinks(html) {
  const targets = [];
  for (const [, href] of html.matchAll(/\shref="([^"]*)"/g)) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    let path = href.split("#")[0].split("?")[0];
    if (!path) continue;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    if (path.startsWith("/assets/") || path === "/favicon.ico") continue;
    targets.push(path);
  }
  return targets;
}

function jsonLdBlocks(html) {
  return [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((match) => match[1]);
}

function walk(node, visit) {
  if (Array.isArray(node)) return node.forEach((item) => walk(item, visit));
  if (node && typeof node === "object")
    for (const [key, value] of Object.entries(node)) {
      visit(key, value);
      walk(value, visit);
    }
}

/** Everything the checks (and the audit) need to know about one rendered page. */
export function analyse(page, html) {
  const title = /<title>([\s\S]*?)<\/title>/.exec(html);
  const desc = /<meta name="description" content="([^"]*)"/.exec(html);
  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => textOf(m[1]));
  const h1Tags = html.match(/<h1[\s>]/g)?.length ?? 0;
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);

  const jsonLd = { parsed: [], errors: [], types: new Set(), forbidden: [] };
  jsonLdBlocks(html).forEach((block, index) => {
    try {
      const data = JSON.parse(block);
      jsonLd.parsed.push(data);
      walk(data, (key, value) => {
        if (key === "@type") [value].flat().forEach((type) => jsonLd.types.add(type));
        if (FORBIDDEN_JSON_LD_KEYS.has(key)) jsonLd.forbidden.push(key);
        if (key === "@type" && [value].flat().some((type) => FORBIDDEN_JSON_LD_TYPES.has(type)))
          jsonLd.forbidden.push(`@type ${[value].flat().join(",")}`);
      });
    } catch (error) {
      jsonLd.errors.push(`block ${index + 1}: ${error.message}`);
    }
  });

  const main = mainOf(html);
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);

  return {
    path: page.path,
    title: title ? decode(title[1]).trim() : "",
    description: desc ? decode(desc[1]).trim() : "",
    canonical: canonical ? canonical[1] : "",
    h1s,
    h1Tags,
    noindex,
    jsonLd,
    words: textOf(main).split(/\s+/).filter(Boolean).length,
    linksAll: new Set(internalLinks(html)),
    linksMain: new Set(internalLinks(main)),
    imagesMissing: images
      .map((tag) => ({
        src: /\ssrc="([^"]*)"/.exec(tag)?.[1] ?? "(no src)",
        missing: ["alt", "width", "height"].filter((attr) => !new RegExp(`\\s${attr}=`).test(tag)),
      }))
      .filter((image) => image.missing.length),
    imageCount: images.length,
    hasTodo: html.includes("TODO(owner)"),
  };
}

/** Redirects a page's links through the redirect table (one hop). */
const resolved = (site, path) => site.resolveRedirect(path) ?? path;

/**
 * Builds the link graph between pages. `inAll` counts every inbound link,
 * `inMain` only links from the body copy of another page (nav and footer
 * link to almost everything, so they say nothing about internal-link quality).
 */
export function linkGraph(site, analyses) {
  const inAll = new Map();
  const inMain = new Map();
  for (const a of analyses.values()) {
    for (const [set, bucket] of [[a.linksAll, inAll], [a.linksMain, inMain]])
      for (const target of set) {
        const to = resolved(site, target);
        if (to === a.path) continue;
        if (!bucket.has(to)) bucket.set(to, new Set());
        bucket.get(to).add(a.path);
      }
  }
  return { inAll, inMain };
}

// ───────────────────────── Redirects ─────────────────────────

function vercelRedirects(vercel) {
  const exact = new Map();
  const prefixes = new Map();
  for (const rule of vercel.redirects ?? []) {
    if (rule.has) continue; // the apex-to-www host rule
    if (rule.source.endsWith("/:path*"))
      prefixes.set(rule.source.slice(0, -"/:path*".length) + "/", rule.destination);
    else exact.set(rule.source, rule.destination);
  }
  return { exact, prefixes };
}

function redirectProblems(site) {
  const problems = [];
  const code = site.redirects;
  const v = vercelRedirects(site.vercel);
  const registered = new Set([...site.pages, ...site.utilityPages].map((p) => p.path));

  // vercel.json has cleanUrls on, so Vercel itself 308s /x.html to /x. A `.html`
  // line in src/pages.js therefore only needs a vercel.json twin when the clean
  // URL is not a real page or redirect (e.g. /index.html).
  const impliedByCleanUrls = (source) => {
    if (!source.endsWith(".html") || !site.vercel.cleanUrls) return false;
    const stem = source.slice(0, -".html".length);
    return registered.has(stem) || stem in code;
  };

  for (const [source, destination] of Object.entries(code)) {
    if (impliedByCleanUrls(source)) continue;
    // `/marketing-services/:path*` also matches `/marketing-services` itself.
    const viaPrefix = [...v.prefixes].find(([prefix]) => source === prefix.slice(0, -1));
    const actual = v.exact.get(source) ?? viaPrefix?.[1];
    if (actual === undefined)
      problems.push([source, `in src/pages.js (→ ${destination}) but not in vercel.json`]);
    else if (actual !== destination)
      problems.push([source, `src/pages.js → ${destination}, vercel.json → ${actual}`]);
  }
  for (const [source, destination] of v.exact)
    if (!(source in code)) problems.push([source, `in vercel.json (→ ${destination}) but not in src/pages.js`]);
  for (const [prefix, destination] of v.prefixes) {
    const mine = site.redirectPrefixes[prefix];
    if (mine === undefined) problems.push([`${prefix}*`, `in vercel.json (→ ${destination}) but not in redirectPrefixes`]);
    else if (mine !== destination) problems.push([`${prefix}*`, `src/pages.js → ${mine}, vercel.json → ${destination}`]);
  }
  for (const [prefix, destination] of Object.entries(site.redirectPrefixes))
    if (!v.prefixes.has(prefix)) problems.push([`${prefix}*`, `in redirectPrefixes (→ ${destination}) but not in vercel.json`]);

  // Every destination must be a live page, not another redirect (no chains).
  const targets = [
    ...Object.entries(code),
    ...Object.entries(site.redirectPrefixes),
    ...v.exact,
    ...v.prefixes,
  ];
  for (const [source, destination] of targets)
    if (!registered.has(destination))
      problems.push([source, `destination ${destination} is not a registered page`]);

  return problems;
}

// ───────────────────────── Checks ─────────────────────────

/**
 * @returns {{failures: {check:string,page:string,detail:string}[], warnings: {check:string,page:string,detail:string}[], analyses: Map}}
 */
export function runChecks(site = loadSite(), { dist = null } = {}) {
  const failures = [];
  const warnings = [];
  const fail = (check, page, detail) => failures.push({ check, page, detail });
  const warn = (check, page, detail) => warnings.push({ check, page, detail });

  const everyPage = [...site.pages, ...site.utilityPages, site.notFoundPage];
  const analyses = new Map(everyPage.map((page) => [page.path, analyse(page, site.html.get(page.path))]));
  const indexable = site.pages.map((page) => analyses.get(page.path));
  const registered = new Set([...site.pages, ...site.utilityPages].map((p) => p.path));
  const { inAll, inMain } = linkGraph(site, analyses);

  // Titles, descriptions, H1, canonical: every route, indexable or not.
  const titleCount = new Map();
  const descCount = new Map();
  for (const a of indexable) {
    titleCount.set(a.title, (titleCount.get(a.title) ?? 0) + 1);
    descCount.set(a.description, (descCount.get(a.description) ?? 0) + 1);
  }
  for (const a of analyses.values()) {
    const isIndexable = site.pages.some((page) => page.path === a.path);
    if (!a.title) fail("title", a.path, "missing title");
    else {
      if (chars(a.title) > LIMITS.titleMax)
        fail("title length", a.path, `${chars(a.title)} chars (max ${LIMITS.titleMax}): ${a.title}`);
      else if (isIndexable && (chars(a.title) < LIMITS.titleAimMin || chars(a.title) > LIMITS.titleAimMax))
        warn("title length", a.path, `${chars(a.title)} chars (aim ${LIMITS.titleAimMin}-${LIMITS.titleAimMax})`);
      if (isIndexable && titleCount.get(a.title) > 1)
        fail("title duplicate", a.path, `shared with ${indexable.filter((o) => o.title === a.title && o !== a).map((o) => o.path).join(", ")}`);
    }
    if (isIndexable) {
      if (!a.description) fail("description", a.path, "missing meta description");
      else {
        const n = chars(a.description);
        if (n < LIMITS.descMin || n > LIMITS.descMax)
          fail("description length", a.path, `${n} chars (need ${LIMITS.descMin}-${LIMITS.descMax})`);
        if (descCount.get(a.description) > 1)
          fail("description duplicate", a.path, `shared with ${indexable.filter((o) => o.description === a.description && o !== a).map((o) => o.path).join(", ")}`);
      }
    }
    if (a.h1Tags !== 1) fail("h1 count", a.path, `${a.h1Tags} h1 elements (need exactly 1)`);
    if (!a.canonical) fail("canonical", a.path, "missing canonical");
    else if (isIndexable && a.canonical !== site.origin + a.path)
      fail("canonical", a.path, `${a.canonical} is not self-referencing (${site.origin + a.path})`);
    if (a.jsonLd.errors.length) fail("json-ld parse", a.path, a.jsonLd.errors.join("; "));
    if (a.jsonLd.forbidden.length)
      fail("json-ld claims", a.path, `forbidden: ${[...new Set(a.jsonLd.forbidden)].join(", ")}`);
    if (a.hasTodo) fail("todo in html", a.path, 'rendered HTML contains "TODO(owner)"');
  }

  // Sitemap. Mirrors scripts/build.mjs, which writes one <url> per entry in `pages`.
  if (!/pages\s*\.map\(\s*\(page\)\s*=>[\s\S]{0,200}<loc>\$\{origin\}\$\{page\.path\}<\/loc>/.test(site.buildSource))
    fail("sitemap", "scripts/build.mjs", "sitemap is no longer built from `pages`; update scripts/seo-check.mjs to match");
  const sitemapPaths = new Set(site.pages.map((page) => page.path));
  if (dist) for (const path of dist.sitemapPaths) sitemapPaths.add(path);
  for (const page of site.pages)
    if (!sitemapPaths.has(page.path)) fail("sitemap missing", page.path, "page is not in the sitemap");
  for (const path of sitemapPaths) {
    if (analyses.get(path)?.noindex) fail("sitemap noindex", path, "noindex page is in the sitemap");
    if (!registered.has(path)) fail("sitemap unknown", path, "sitemap URL is not a registered page");
    if (site.pages.some((page) => page.path === path) === false && registered.has(path))
      fail("sitemap utility", path, "utility page is in the sitemap");
  }
  if (dist)
    for (const page of site.pages)
      if (!dist.sitemapPaths.has(page.path)) fail("sitemap missing", page.path, "page is not in dist/sitemap.xml");

  // Links.
  for (const a of analyses.values())
    for (const target of a.linksAll) {
      const known = registered.has(target) || site.resolveRedirect(target) !== null || target === "/404";
      if (!known) fail("broken link", a.path, `${target} is neither a page nor a redirect`);
      else if (site.resolveRedirect(target) !== null && !registered.has(target))
        warn("link to redirect", a.path, `${target} → ${site.resolveRedirect(target)}; link to the final URL`);
    }

  // Orphans: no other page links here at all. Nav and footer count, so this
  // only catches pages nobody linked; the contextual-link warning is stricter.
  for (const page of site.pages) {
    if (!inAll.get(page.path)?.size) fail("orphan page", page.path, "no inbound internal links from any other page");
    const out = [...analyses.get(page.path).linksMain].filter((t) => resolved(site, t) !== page.path).length;
    const into = inMain.get(page.path)?.size ?? 0;
    if (out < LIMITS.contextualLinks) warn("contextual links out", page.path, `${out} distinct internal links in the body (want ${LIMITS.contextualLinks}+)`);
    if (into < LIMITS.contextualLinks) warn("contextual links in", page.path, `${into} other pages link here from their body (want ${LIMITS.contextualLinks}+)`);
    if (!analyses.get(page.path).jsonLd.types.has("BreadcrumbList") && page.path !== "/")
      warn("breadcrumb", page.path, "no BreadcrumbList JSON-LD");
  }

  for (const a of analyses.values())
    for (const image of a.imagesMissing)
      warn("image attributes", a.path, `${image.src} missing ${image.missing.join(", ")}`);

  // Redirect tables.
  for (const [source, detail] of redirectProblems(site)) fail("redirect mismatch", source, detail);

  return { failures, warnings, analyses, graph: { inAll, inMain } };
}

// ───────────────────────── Output ─────────────────────────

export function formatTable(rows, columns = ["check", "page", "detail"]) {
  if (!rows.length) return "";
  const width = columns.map((column) => Math.max(column.length, ...rows.map((row) => String(row[column]).length)));
  const line = (cells) => cells.map((cell, i) => String(cell).padEnd(width[i])).join("  ");
  return [
    line(columns.map((c) => c.toUpperCase())),
    line(width.map((w) => "-".repeat(w))),
    ...rows.map((row) => line(columns.map((c) => row[c]))),
  ].join("\n");
}

function main() {
  const verbose = process.argv.includes("--verbose");
  let dist = null;
  if (process.argv.includes("--dist")) {
    const xml = readFileSync(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
    dist = { sitemapPaths: new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)) };
  }
  const { failures, warnings, analyses } = runChecks(loadSite(), { dist });
  if (verbose && warnings.length) {
    console.log(`Warnings (${warnings.length}, do not fail the check):\n`);
    console.log(formatTable(warnings), "\n");
  }
  if (failures.length) {
    console.error(`SEO check failed: ${failures.length} problem(s) across ${analyses.size} routes.\n`);
    console.error(formatTable(failures));
    console.error(`\n${warnings.length} warning(s) not shown${verbose ? "" : "; re-run with --verbose to list them"}.`);
    process.exit(1);
  }
  console.log(`SEO check passed: ${analyses.size} routes, ${warnings.length} warning(s)${verbose ? "" : " (--verbose to list)"}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
