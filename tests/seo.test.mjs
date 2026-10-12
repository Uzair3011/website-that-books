// Runs the same checks as `npm run seo:check` so `npm test` enforces them.
import test from "node:test";
import assert from "node:assert/strict";
import { formatTable, loadSite, runChecks } from "../scripts/seo-check.mjs";

test("every page passes the SEO guardrails", () => {
  const { failures } = runChecks(loadSite());
  assert.equal(
    failures.length,
    0,
    `\n${failures.length} SEO problem(s):\n\n${formatTable(failures)}\n`,
  );
});

// The checker is only useful if it notices breakage, so feed it broken sites.
const failedChecks = (overrides) =>
  new Set(runChecks(loadSite(overrides)).failures.map((f) => f.check));

test("the checker catches a vercel.json that disagrees with src/pages.js", () => {
  const site = loadSite();
  const vercel = structuredClone(site.vercel);
  vercel.redirects = vercel.redirects.filter((r) => r.source !== "/contact-us");
  vercel.redirects.push({ source: "/about-us", destination: "/contact", permanent: true });
  assert.ok(failedChecks({ vercel }).has("redirect"));
});

test("the checker catches duplicate titles, extra h1s, bad JSON-LD, TODOs and orphans", () => {
  const site = loadSite();
  const [home, services] = site.pages;
  const html = new Map(site.html);
  html.set(
    services.path,
    html
      .get(services.path)
      .replace(/<title>.*?<\/title>/, `<title>${home.title}</title>`)
      .replace("<main id=\"main\">", '<main id="main"><h1>Second</h1><p>TODO(owner): x</p>')
      .replace("</head>", '<script type="application/ld+json">{nope</script><script type="application/ld+json">{"streetAddress":"1 High St"}</script></head>'),
  );
  const checks = failedChecks({ html });
  for (const expected of ["title duplicate", "h1 count", "json-ld parse", "json-ld claims", "todo in html"])
    assert.ok(checks.has(expected), `expected ${expected} to fail`);

  const orphan = { ...services, path: "/orphan", title: "Orphan", description: "x" };
  assert.ok(failedChecks({ pages: [...site.pages, orphan] }).has("orphan page"));
});

test("the checker catches a noindex page that is listed in pages (and so in the sitemap)", () => {
  const site = loadSite();
  const html = new Map(site.html);
  html.set("/pricing", html.get("/pricing").replace("<meta name=\"theme-color\"", '<meta name="robots" content="noindex" /><meta name="theme-color"'));
  assert.ok(failedChecks({ html }).has("sitemap noindex"));
});

const failureDetails = (overrides, check) =>
  runChecks(loadSite(overrides))
    .failures.filter((f) => f.check === check)
    .map((f) => `${f.page}: ${f.detail}`);

test("the checker catches redirect chains, rules Vercel never reaches, and missing trailingSlash", () => {
  const site = loadSite();
  const add = (vercel, source, destination) =>
    vercel.redirects.push({ source, destination, permanent: true });

  // A to B to C: /old-contact → /contact-us → /contact.
  let vercel = structuredClone(site.vercel);
  add(vercel, "/old-contact", "/contact-us");
  let details = failureDetails({ vercel, redirects: { ...site.redirects, "/old-contact": "/contact-us" } }, "redirect");
  assert.ok(details.some((d) => d.includes("redirect chain")), details.join("\n"));

  // cleanUrls answers /x.html before vercel.json redirects, so this rule is dead.
  vercel = structuredClone(site.vercel);
  add(vercel, "/old.html", "/");
  details = failureDetails({ vercel, redirects: { ...site.redirects, "/old.html": "/" } }, "redirect");
  assert.ok(details.some((d) => d.includes("never fires")), details.join("\n"));

  vercel = structuredClone(site.vercel);
  delete vercel.trailingSlash;
  assert.ok(failureDetails({ vercel }, "redirect").some((d) => d.includes("trailingSlash")));
});

test("the checker catches a sitemap without lastmod or with priority, and a robots.txt that hides /admin", () => {
  const site = loadSite();
  const sitemap = site.sitemap.replace(/<lastmod>[^<]*<\/lastmod>/, "<priority>0.8</priority>");
  const checks = failedChecks({ sitemap, robots: site.robots.replace("Disallow: /api/", "Disallow: /admin") });
  for (const expected of ["sitemap lastmod", "sitemap priority", "robots"])
    assert.ok(checks.has(expected), `expected ${expected} to fail`);
});

test("the checker catches incomplete images and a homepage hero that is not the priority image", () => {
  const site = loadSite();
  const html = new Map(site.html);
  html.set("/", html.get("/").replace('fetchpriority="high"', "").replace(/(<img\b[^>]*?)\salt="[^"]*"/, "$1"));
  const details = failureDetails({ html }, "image");
  assert.ok(details.some((d) => d.includes("no alt attribute")), details.join("\n"));
  assert.ok(details.some((d) => d.includes("homepage hero")), details.join("\n"));
});

test("the checker catches a 404 page missing service links, and llms.txt links to non-pages", () => {
  const site = loadSite();
  const html = new Map(site.html);
  html.set("/404", html.get("/404").replaceAll('href="/landing-page-design"', 'href="/"'));
  assert.ok(failedChecks({ html }).has("404"));
  assert.ok(failedChecks({ llms: `${site.llms}\n- [Old](${site.origin}/contact-us)\n` }).has("llms.txt"));
});
