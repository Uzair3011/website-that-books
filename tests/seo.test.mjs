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
  assert.ok(failedChecks({ vercel }).has("redirect mismatch"));
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
