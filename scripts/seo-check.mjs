// SEO guardrails as code. `npm run seo:check` prints a table of failures and
// exits 1 if any exist; tests/seo.test.mjs runs the same checks under `npm test`.
//
// Pages are rendered straight from src/layout.js, exactly as scripts/build.mjs
// does, so this needs no node_modules and no build output.
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { renderAdminPage } from "../src/admin.js";
import { renderPage } from "../src/layout.js";
import {
  notFoundPage,
  pages,
  platformRedirect,
  redirectPrefixes,
  redirects,
  resolveRedirect,
  utilityPages,
} from "../src/pages.js";
import { SERVICES } from "../src/site.js";
import { llmsTxt, robotsTxt, sitemapXml } from "./seo-files.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));

export const ORIGIN = "https://www.veltramedia.com";

export const LIMITS = {
  titleMax: 65,
  titleAimMin: 50,
  titleAimMax: 60,
  descMin: 120,
  descMax: 158,
  contextualLinks: 3,
  maxClickDepth: 3,
  maxAnchorRepeats: 3,
  imageBytes: 150 * 1024,
};

// Keys that must never appear anywhere in structured data (hard rule 1): the
// site publishes no address, no opening hours and no reviews or ratings.
const FORBIDDEN_JSON_LD_KEYS = new Set([
  "address",
  "streetAddress",
  "openingHours",
  "openingHoursSpecification",
  "aggregateRating",
  "review",
  "reviews",
  "reviewCount",
  "ratingValue",
]);
const FORBIDDEN_JSON_LD_TYPES = new Set([
  "Review",
  "AggregateRating",
  "PostalAddress",
  "OpeningHoursSpecification",
]);

// Every @type the site emits. A new type is added here on purpose, after
// checking it against schema.org, so a typo cannot ship.
const KNOWN_JSON_LD_TYPES = new Set([
  "ProfessionalService",
  "WebSite",
  "WebPage",
  "CollectionPage",
  "ItemList",
  "ListItem",
  "BreadcrumbList",
  "Service",
  "FAQPage",
  "Question",
  "Answer",
  "ContactPoint",
  "City",
  "AdministrativeArea",
  "BlogPosting",
  "Person",
  "ImageObject",
]);

export const ORG_ID = `${ORIGIN}/#organization`;

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
    adminHtml: renderAdminPage(),
    ...overrides,
  };
  // Generated from the (possibly overridden) page list, exactly as the build does.
  site.sitemap = overrides.sitemap ?? sitemapXml(site.origin, site.pages);
  site.robots = overrides.robots ?? robotsTxt(site.origin);
  site.llms = overrides.llms ?? llmsTxt(site.origin, site.pages);
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

/** Every object node in a parsed JSON-LD value, nested ones included. */
function nodesOf(data) {
  const nodes = [];
  const visit = (node) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== "object") return;
    nodes.push(node);
    Object.values(node).forEach(visit);
  };
  visit(data);
  return nodes;
}

/** What is wrong with one parsed JSON-LD block on its own. */
function blockProblems(data) {
  const problems = [];
  if (data["@context"] !== "https://schema.org") problems.push(`@context is ${JSON.stringify(data["@context"])}, want "https://schema.org"`);
  const top = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
  if (!top.length) problems.push("empty @graph");
  for (const node of top) if (!node["@type"]) problems.push("a top-level node has no @type");
  for (const node of nodesOf(data))
    for (const [key, value] of Object.entries(node)) {
      if (key === "@type")
        for (const type of [value].flat())
          if (!KNOWN_JSON_LD_TYPES.has(type)) problems.push(`unknown @type "${type}"`);
      if (typeof value === "string" && !value.trim()) problems.push(`empty string in "${key}"`);
      if (Array.isArray(value) && !value.length) problems.push(`empty array in "${key}"`);
      if (Array.isArray(value) && value.some((item) => typeof item === "string" && !item.trim()))
        problems.push(`empty string in "${key}"`);
    }
  return problems;
}

/** `{ "@id": x }` with nothing else is a reference; any other node with an @id defines it. */
const isReference = (node) => typeof node["@id"] === "string" && Object.keys(node).length === 1;

const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];

/** One <img>: its src and anything wrong with its alt, size or loading hints. */
function imageFacts(tag) {
  const problems = [];
  const alt = attr(tag, "alt");
  if (alt === undefined) problems.push("no alt attribute");
  // An empty alt is right only for a decorative image, and must say so.
  else if (!alt.trim() && attr(tag, "aria-hidden") !== "true")
    problems.push('empty alt without aria-hidden="true"');
  for (const name of ["width", "height"])
    if (!/^\d+$/.test(attr(tag, name) ?? "")) problems.push(`no numeric ${name}`);
  const priority = attr(tag, "fetchpriority") === "high";
  const loading = attr(tag, "loading");
  if (priority && loading === "lazy") problems.push('fetchpriority="high" on a lazy image');
  if (!priority && loading !== "lazy")
    problems.push('below-the-fold image needs loading="lazy" (or fetchpriority="high" if it is the LCP image)');
  if (!priority && attr(tag, "decoding") !== "async") problems.push('lazy image needs decoding="async"');
  return { src: attr(tag, "src") ?? "(no src)", priority, problems };
}

/** Everything the checks (and the audit) need to know about one rendered page. */
export function analyse(page, html) {
  const title = /<title>([\s\S]*?)<\/title>/.exec(html);
  const desc = /<meta name="description" content="([^"]*)"/.exec(html);
  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html);
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => textOf(m[1]));
  const h1Tags = html.match(/<h1[\s>]/g)?.length ?? 0;
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);

  const jsonLd = { parsed: [], errors: [], types: new Set(), forbidden: [], problems: [] };
  jsonLdBlocks(html).forEach((block, index) => {
    try {
      const data = JSON.parse(block);
      jsonLd.parsed.push(data);
      for (const problem of blockProblems(data)) jsonLd.problems.push(`block ${index + 1}: ${problem}`);
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

  // Every node across the page's blocks, for @id resolution and per-type checks.
  const nodes = jsonLd.parsed.flatMap(nodesOf);
  jsonLd.nodes = nodes;
  jsonLd.defined = nodes.filter((node) => node["@id"] && !isReference(node)).map((node) => node["@id"]);
  jsonLd.referenced = nodes.filter(isReference).map((node) => node["@id"]);

  const main = mainOf(html);
  const anchors = bodyAnchors(html);
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);

  // The visible FAQ (faqSection in src/site.js) and breadcrumb (breadcrumbNav).
  const faq = [...main.matchAll(/<details><summary>([\s\S]*?)<\/summary><div>([\s\S]*?)<\/div><\/details>/g)].map(
    ([, q, a]) => ({ q: textOf(q), a: textOf(a) }),
  );
  const crumbNav = /<nav class="breadcrumbs" aria-label="Breadcrumb">([\s\S]*?)<\/nav>/.exec(main);
  const crumbs = crumbNav
    ? [...crumbNav[1].matchAll(/<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, name]) => ({ path: href, name: textOf(name) }))
    : null;

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
    // Body links: <main> without the breadcrumb.
    anchors,
    linksMain: new Set(anchors.map((anchor) => anchor.href)),
    images: images.map(imageFacts),
    faq,
    crumbs,
    hasTodo: html.includes("TODO(owner)"),
  };
}

/**
 * Structured-data checks that need the whole page: references resolve, the
 * organisation is defined once, Service nodes are complete, FAQPage matches
 * the visible FAQ and BreadcrumbList matches the visible breadcrumb.
 */
export function structuredDataProblems(a, { origin, indexable }) {
  const problems = [];
  const add = (check, detail) => problems.push([check, detail]);
  const { nodes, defined, referenced } = a.jsonLd;
  const ofType = (type) => nodes.filter((node) => [node["@type"]].flat().includes(type));
  const pathOf = (url) => (typeof url === "string" ? new URL(url, origin).pathname : "");

  for (const problem of a.jsonLd.problems) add("json-ld shape", problem);

  for (const id of new Set(referenced))
    if (!defined.includes(id)) add("json-ld @id", `${id} is referenced but not defined on this page`);
  const orgs = defined.filter((id) => id === ORG_ID).length;
  if (orgs !== 1) add("json-ld organisation", `${ORG_ID} is defined ${orgs} times (want exactly 1)`);

  for (const service of ofType("Service")) {
    if (![service.serviceType].flat().filter(Boolean).length) add("json-ld service", `"${service.name}" has no serviceType`);
    if (service.provider?.["@id"] !== ORG_ID) add("json-ld service", `"${service.name}" provider is not ${ORG_ID}`);
    if (!Array.isArray(service.areaServed) || !service.areaServed.length) add("json-ld service", `"${service.name}" has no areaServed`);
  }

  // FAQPage questions and answers, in order, exactly as the visitor reads them.
  const faqPages = ofType("FAQPage");
  if (faqPages.length > 1) add("json-ld faq", `${faqPages.length} FAQPage blocks (want at most 1)`);
  if (faqPages.length) {
    const marked = faqPages[0].mainEntity ?? [];
    if (marked.length !== a.faq.length)
      add("json-ld faq", `FAQPage has ${marked.length} questions, the page shows ${a.faq.length}`);
    marked.forEach((question, index) => {
      const shown = a.faq[index];
      if (!shown) return;
      if (question.name !== shown.q) add("json-ld faq", `question ${index + 1}: "${question.name}" ≠ visible "${shown.q}"`);
      if (question.acceptedAnswer?.text !== shown.a) add("json-ld faq", `answer ${index + 1} ("${shown.q}") does not match the visible answer`);
    });
  } else if (a.faq.length) add("json-ld faq", `the page shows ${a.faq.length} FAQs but has no FAQPage markup`);

  // Every indexable page below the homepage has one BreadcrumbList, from Home
  // to itself, drawn as the visible breadcrumb.
  const lists = ofType("BreadcrumbList");
  if (indexable && a.path !== "/") {
    if (lists.length !== 1) add("breadcrumb", `${lists.length} BreadcrumbList blocks (want exactly 1)`);
    const items = lists[0]?.itemListElement ?? [];
    const trail = items.map((item) => ({ path: pathOf(item.item), name: item.name }));
    if (items.some((item, index) => item.position !== index + 1)) add("breadcrumb", "positions are not 1, 2, 3…");
    if (trail.length && trail[0].path !== "/") add("breadcrumb", `starts at ${trail[0].path}, not /`);
    if (trail.length && trail.at(-1).path !== a.path) add("breadcrumb", `ends at ${trail.at(-1).path}, not this page`);
    if (!a.crumbs) add("breadcrumb", "no visible breadcrumb");
    else if (JSON.stringify(a.crumbs) !== JSON.stringify(trail))
      add("breadcrumb", `visible ${a.crumbs.map((c) => c.name).join(" > ")} ≠ JSON-LD ${trail.map((c) => c.name).join(" > ")}`);
  }
  return problems;
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
  // Body links only count from indexable pages: the 404 and checkout pages
  // pass nothing on to search engines.
  const indexable = new Set(site.pages.map((page) => page.path));
  for (const a of analyses.values()) {
    for (const [set, bucket] of [[a.linksAll, inAll], [a.linksMain, inMain]]) {
      if (bucket === inMain && !indexable.has(a.path)) continue;
      for (const target of set) {
        const to = resolved(site, target);
        if (to === a.path) continue;
        if (!bucket.has(to)) bucket.set(to, new Set());
        bucket.get(to).add(a.path);
      }
    }
  }
  return { inAll, inMain };
}

/**
 * Clicks from the homepage to every indexable page, following every link a
 * visitor or crawler could follow (header and footer included). Unreachable
 * pages get Infinity.
 */
export function clickDepth(site, analyses) {
  const indexable = new Set(site.pages.map((page) => page.path));
  const depth = new Map([["/", 0]]);
  const queue = ["/"];
  while (queue.length) {
    const from = queue.shift();
    for (const target of analyses.get(from)?.linksAll ?? []) {
      const to = resolved(site, target);
      if (!indexable.has(to) || depth.has(to)) continue;
      depth.set(to, depth.get(from) + 1);
      queue.push(to);
    }
  }
  for (const path of indexable) if (!depth.has(path)) depth.set(path, Infinity);
  return depth;
}

/**
 * Pages that may have fewer than 3 body links in: the homepage is the root
 * every page reaches through the logo, and the legal pages are not ranking
 * targets (docs/seo/keyword-map.md); all four are linked from every footer.
 */
export const BODY_INBOUND_EXEMPT = new Set(["/", "/privacy", "/cookie-policy", "/terms"]);

const SERVICE_PAGES = [
  "/web-design-middlesbrough",
  "/local-seo-middlesbrough",
  "/google-business-profile",
  "/landing-page-design",
  "/ai-receptionist-middlesbrough",
  "/crm-booking-automation",
  "/website-care",
];
// The four services in the Growth Launch Package.
const MAIN_SERVICES = [
  "/web-design-middlesbrough",
  "/local-seo-middlesbrough",
  "/ai-receptionist-middlesbrough",
  "/crm-booking-automation",
];
// Middlesbrough's area page is its web design page.
const AREA_PAGES = [
  "/web-design-middlesbrough",
  "/web-design-teesside",
  "/web-design-stockton-on-tees",
  "/web-design-redcar",
  "/web-design-hartlepool",
];
const TOPIC_PAGES = [...SERVICE_PAGES, "/ai-agents-teesside", "/web-design-for-trades-teesside", "/pricing"];
const isArticle = (path) => path.startsWith("/resources/");

/**
 * Where body links must go (the internal-linking brief of 13 Oct 2026):
 * `all` lists required targets; `some` is [label, candidates, min, max].
 */
export const LINK_RULES = [
  { pages: ["/"], all: ["/services", "/areas", "/resources", ...MAIN_SERVICES] },
  { pages: ["/services"], all: [...SERVICE_PAGES, "/ai-agents-teesside", "/web-design-for-trades-teesside", "/areas"] },
  {
    pages: SERVICE_PAGES,
    all: ["/areas", "/pricing", "/free-website-audit"],
    some: [
      ["a related service", SERVICE_PAGES, 1],
      ["the most relevant articles", isArticle, 1, 3],
    ],
  },
  { pages: AREA_PAGES.filter((path) => path !== "/web-design-middlesbrough"), all: [...AREA_PAGES, ...MAIN_SERVICES, "/areas"] },
  {
    pages: isArticle,
    some: [
      ["a matching service page", TOPIC_PAGES, 1],
      ["a matching area page", [...AREA_PAGES, "/areas"], 1],
    ],
  },
];

export function linkRuleProblems(site, analyses) {
  const problems = [];
  const matches = (test, path) => (typeof test === "function" ? test(path) : test.includes(path));
  for (const page of site.pages)
    for (const rule of LINK_RULES) {
      if (!matches(rule.pages, page.path)) continue;
      const links = new Set([...analyses.get(page.path).linksMain].map((t) => resolved(site, t)));
      links.delete(page.path);
      for (const target of rule.all ?? [])
        if (target !== page.path && !links.has(target)) problems.push([page.path, `no body link to ${target}`]);
      for (const [label, test, min, max = Infinity] of rule.some ?? []) {
        const n = [...links].filter((path) => matches(test, path)).length;
        if (n < min || n > max)
          problems.push([page.path, `${n} body links to ${label} (want ${max === Infinity ? `${min}+` : `${min}-${max}`})`]);
      }
    }
  return problems;
}

/**
 * Anchor text that tells neither a reader nor Google where a link goes. An
 * anchor fails if its whole visible text (or aria-label) is one of these.
 */
export const VAGUE_ANCHORS = new Set([
  "click here",
  "here",
  "read more",
  "more",
  "learn more",
  "find out more",
  "see more",
  "this",
  "this page",
  "link",
  "go",
  "continue",
]);

/**
 * Every internal link in the page's own content: <main> without the
 * breadcrumb (header, footer and breadcrumb are navigation, not copy).
 * `kind` is one of:
 * - "inline": a link inside a sentence of copy (no class), the "body copy"
 *   the repeated-anchor rule applies to;
 * - "card": a block of text, as in the related links;
 * - "button": class btn;
 * - "styled": any other class, such as a standalone text-link or price link;
 * - "form": inside a form, such as the consent line's privacy link.
 */
export function bodyAnchors(html) {
  const main = mainOf(html).replace(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/, "");
  const forms = [...main.matchAll(/<form\b[\s\S]*?<\/form>/g)].map((m) => [m.index, m.index + m[0].length]);
  const anchors = [];
  for (const match of main.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const [whole, attrs, inner] = match;
    const [href] = internalLinks(` ${attrs}`);
    if (!href) continue;
    const cls = attr(` ${attrs}`, "class");
    const kind = forms.some(([start, end]) => match.index > start && match.index < end)
      ? "form"
      : /\bbtn\b/.test(cls ?? "")
        ? "button"
        : /<(b|p|h\d|span class="card-body")\b/.test(inner)
          ? "card"
          : cls !== undefined
            ? "styled"
            : "inline";
    const text = textOf(inner) || decode(attr(` ${attrs}`, "aria-label") ?? "");
    anchors.push({ href, text, kind, html: whole });
  }
  return anchors;
}

// ───────────────────────── Redirects ─────────────────────────

/** vercel.json redirect rules, minus the apex-to-www host rule, in file order. */
function vercelRedirects(vercel) {
  const exact = new Map();
  const prefixes = new Map();
  const rules = [];
  for (const rule of vercel.redirects ?? []) {
    if (rule.has) continue;
    const prefix = rule.source.endsWith("/:path*")
      ? rule.source.slice(0, -"/:path*".length) + "/"
      : null;
    rules.push({ ...rule, prefix });
    if (prefix) prefixes.set(prefix, rule.destination);
    else exact.set(rule.source, rule.destination);
  }
  return { exact, prefixes, rules };
}

/**
 * The two tables must hold the same rules, every rule must be able to fire on
 * Vercel, and every destination must be a live page, so there are no chains.
 */
export function redirectProblems(site) {
  const problems = [];
  const add = (source, detail) => problems.push([source, detail]);
  const v = vercelRedirects(site.vercel);
  const registered = new Set([...site.pages, ...site.utilityPages].map((p) => p.path));

  // platformRedirect() in src/pages.js models exactly these two settings.
  if (site.vercel.cleanUrls !== true) add("vercel.json", "cleanUrls must be true");
  if (site.vercel.trailingSlash !== false) add("vercel.json", "trailingSlash must be false");

  // The same rules in both places.
  const compare = (mine, theirs, label, name) => {
    for (const [source, destination] of Object.entries(mine)) {
      const actual = theirs.get(source);
      if (actual === undefined) add(label(source), `in ${name} (→ ${destination}) but not in vercel.json`);
      else if (actual !== destination) add(label(source), `${name} → ${destination}, vercel.json → ${actual}`);
    }
    for (const [source, destination] of theirs)
      if (!(source in mine)) add(label(source), `in vercel.json (→ ${destination}) but not in ${name}`);
  };
  compare(site.redirects, v.exact, (source) => source, "src/pages.js redirects");
  compare(site.redirectPrefixes, v.prefixes, (prefix) => `${prefix}*`, "redirectPrefixes");

  v.rules.forEach((rule, index) => {
    if (rule.permanent !== true) add(rule.source, "vercel.json redirect is not permanent");
    if (!rule.prefix && /[:(*]/.test(rule.source))
      add(rule.source, "pattern sources other than /prefix/:path* are not modelled in src/pages.js");
    // Vercel applies the first matching rule, so a prefix rule hides later rules under it.
    const shadow = v.rules
      .slice(0, index)
      .find((earlier) => earlier.prefix && (rule.source + "/").startsWith(earlier.prefix));
    if (shadow) add(rule.source, `listed after ${shadow.source} in vercel.json, so it never fires`);
  });

  const rules = [
    ...Object.entries(site.redirects),
    ...Object.entries(site.redirectPrefixes).map(([prefix, to]) => [`${prefix}*`, to]),
    ...v.exact,
  ];
  for (const [source, destination] of rules) {
    // cleanUrls and trailingSlash redirect these before vercel.json is read.
    const first = source.endsWith("*") ? null : platformRedirect(source);
    if (first) add(source, `Vercel redirects this to ${first} first, so the rule never fires; use the clean path`);
    if (registered.has(source)) add(source, "redirect source is a live page");
    const next = site.resolveRedirect(destination);
    if (next !== null) add(source, `destination ${destination} redirects again to ${next} (redirect chain)`);
    else if (!registered.has(destination)) add(source, `destination ${destination} is not a registered page`);
  }
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
    for (const [check, detail] of structuredDataProblems(a, { origin: site.origin, indexable: isIndexable }))
      fail(check, a.path, detail);
  }

  // Sitemap, robots.txt and llms.txt: build.mjs must write the shared output.
  for (const [file, fn] of [["robots.txt", "robotsTxt"], ["sitemap.xml", "sitemapXml"], ["llms.txt", "llmsTxt"]])
    if (!site.buildSource.includes(`writeFile(resolve(output, "${file}"), ${fn}(origin))`))
      fail("build output", "scripts/build.mjs", `${file} is not written from ${fn}() in scripts/seo-files.mjs`);

  const indexablePaths = new Set(site.pages.map((page) => page.path));
  const sitemaps = [["sitemap.xml", site.sitemap]];
  if (dist) sitemaps.push(["dist/sitemap.xml", dist.sitemap]);
  for (const [label, xml] of sitemaps) {
    const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
      path: new URL(/<loc>([^<]*)<\/loc>/.exec(entry)?.[1] ?? "/", site.origin).pathname,
      lastmod: /<lastmod>([^<]*)<\/lastmod>/.exec(entry)?.[1],
      priority: entry.includes("<priority>"),
    }));
    const listed = new Set(urls.map((url) => url.path));
    for (const url of urls) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(url.lastmod ?? ""))
        fail("sitemap lastmod", url.path, `${label}: <lastmod> is ${url.lastmod ? `"${url.lastmod}"` : "missing"} (want YYYY-MM-DD)`);
      if (url.priority) fail("sitemap priority", url.path, `${label}: remove <priority>; search engines ignore it`);
      if (analyses.get(url.path)?.noindex) fail("sitemap noindex", url.path, `${label}: noindex page is in the sitemap`);
      if (!registered.has(url.path)) fail("sitemap unknown", url.path, `${label}: URL is not a registered page`);
      else if (!indexablePaths.has(url.path)) fail("sitemap utility", url.path, `${label}: utility page is in the sitemap`);
    }
    for (const page of site.pages)
      if (!listed.has(page.path)) fail("sitemap missing", page.path, `page is not in ${label}`);
  }

  // /admin must stay crawlable, or crawlers never see its noindex.
  for (const [, rule] of site.robots.matchAll(/^Disallow:[ \t]*(\S+)/gim))
    if ("/admin".startsWith(rule)) fail("robots", "/admin", `robots.txt "Disallow: ${rule}" hides the noindex on /admin`);
  if (!site.robots.includes(`Sitemap: ${site.origin}/sitemap.xml`)) fail("robots", "robots.txt", "no Sitemap line");
  const adminHeaders = site.vercel.headers?.find((rule) => rule.source === "/admin")?.headers ?? [];
  if (!adminHeaders.some((h) => h.key === "X-Robots-Tag" && /noindex/.test(h.value)))
    fail("admin noindex", "/admin", "vercel.json sends no X-Robots-Tag: noindex for /admin");
  if (!/<meta name="robots" content="[^"]*noindex/.test(site.adminHtml))
    fail("admin noindex", "/admin", "the admin page has no robots noindex meta tag");

  // 404: Vercel serves dist/404.html with a real 404 status unless a catch-all
  // rewrite answers first. It must be noindex and lead to every service page.
  const notFound = analyses.get(site.notFoundPage.path);
  if (!notFound.noindex) fail("404", site.notFoundPage.path, "404 page is not noindex");
  for (const service of SERVICES)
    if (!notFound.linksAll.has(service.href)) fail("404", site.notFoundPage.path, `no link to ${service.href}`);
  if (site.vercel.routes) fail("404", "vercel.json", "legacy `routes` bypass cleanUrls and the 404 page");
  for (const rule of site.vercel.rewrites ?? [])
    if (/^\/(\(|:)/.test(rule.source))
      fail("404", "vercel.json", `catch-all rewrite ${rule.source} would answer unknown URLs with 200`);

  // llms.txt may only point at live, indexable pages.
  for (const [, url] of site.llms.matchAll(/(https?:\/\/[^\s)]+)/g)) {
    const path = new URL(url).pathname;
    if (!url.startsWith(site.origin) || !indexablePaths.has(path))
      fail("llms.txt", path, `${url} is not an indexable page on ${site.origin}`);
  }
  if (site.llms.includes("TODO")) fail("llms.txt", "llms.txt", "contains TODO text");

  // Links.
  for (const a of analyses.values())
    for (const target of a.linksAll) {
      const known = registered.has(target) || site.resolveRedirect(target) !== null || target === "/404";
      if (!known) fail("broken link", a.path, `${target} is neither a page nor a redirect`);
      else if (site.resolveRedirect(target) !== null && !registered.has(target))
        warn("link to redirect", a.path, `${target} → ${site.resolveRedirect(target)}; link to the final URL`);
    }

  // Orphans: no other page links here at all, nav and footer included.
  // Body links: at least 3 other indexable pages link here from their content.
  const depth = clickDepth(site, analyses);
  for (const page of site.pages) {
    if (!inAll.get(page.path)?.size) fail("orphan page", page.path, "no inbound internal links from any other page");
    const out = [...analyses.get(page.path).linksMain].filter((t) => resolved(site, t) !== page.path).length;
    const into = inMain.get(page.path)?.size ?? 0;
    if (out < LIMITS.contextualLinks) warn("contextual links out", page.path, `${out} distinct internal links in the body (want ${LIMITS.contextualLinks}+)`);
    if (into < LIMITS.contextualLinks && !BODY_INBOUND_EXEMPT.has(page.path))
      fail("body links in", page.path, `${into} other pages link here from their body (need ${LIMITS.contextualLinks}+)`);
    if (depth.get(page.path) > LIMITS.maxClickDepth)
      fail("click depth", page.path, `${depth.get(page.path)} clicks from the homepage (max ${LIMITS.maxClickDepth})`);
  }

  // Anchor text: never vague, and no in-sentence anchor repeated across the site.
  const inlineUses = new Map();
  for (const page of site.pages)
    for (const anchor of analyses.get(page.path).anchors) {
      const text = anchor.text.toLowerCase().replace(/[.!?:]+$/, "").trim();
      if (!text) fail("anchor text", page.path, `link to ${anchor.href} has no text or aria-label`);
      else if (VAGUE_ANCHORS.has(text)) fail("anchor text", page.path, `"${anchor.text}" → ${anchor.href} does not say where it goes`);
      if (anchor.kind === "inline" && text) inlineUses.set(text, [...(inlineUses.get(text) ?? []), page.path]);
    }
  for (const [text, where] of inlineUses)
    if (where.length > LIMITS.maxAnchorRepeats)
      fail("anchor repeated", where[0], `"${text}" is used ${where.length} times in body copy (max ${LIMITS.maxAnchorRepeats}): ${where.join(", ")}`);

  // The linking patterns in LINK_RULES.
  for (const [path, problem] of linkRuleProblems(site, analyses)) fail("required links", path, problem);

  // Images: complete attributes, at most one high-priority (LCP) image, and
  // the homepage hero loads first. Heavy files are reported, not failed.
  const weighed = new Set();
  for (const a of analyses.values()) {
    for (const image of a.images) {
      for (const problem of image.problems) fail("image", a.path, `${image.src}: ${problem}`);
      const file = image.src.startsWith("/assets/") ? root + image.src.slice(1).split("?")[0] : null;
      if (file && !weighed.has(file) && existsSync(file)) {
        weighed.add(file);
        const bytes = statSync(file).size;
        if (bytes > LIMITS.imageBytes)
          warn("image weight", image.src, `${Math.round(bytes / 1024)} KB (aim under ${LIMITS.imageBytes / 1024} KB)`);
      }
    }
    const high = a.images.filter((image) => image.priority).length;
    if (high > 1) fail("image", a.path, `${high} images have fetchpriority="high" (want at most 1)`);
  }
  if (!analyses.get("/")?.images[0]?.priority)
    fail("image", "/", 'the homepage hero (first image) must load eagerly with fetchpriority="high"');

  // Redirect tables.
  for (const [source, detail] of redirectProblems(site)) fail("redirect", source, detail);

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
    dist = { sitemap: readFileSync(new URL("../dist/sitemap.xml", import.meta.url), "utf8") };
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
