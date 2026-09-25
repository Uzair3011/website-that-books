import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { SETUP_TOTAL, SYSTEM } from "../assets/business.js";
import { pages, redirects } from "../src/pages.js";
import { renderPage } from "../src/layout.js";

const ORIGIN = "https://www.veltramedia.com";

test("the production build emits every route with a correct canonical, and a matching sitemap and robots file", async () => {
  execFileSync(process.execPath, ["scripts/build.mjs"], {
    env: { ...process.env, SITE_URL: `${ORIGIN}/` },
    stdio: "pipe",
  });
  const files = await readdir(resolve("dist"));
  assert.ok(files.includes("index.html"));
  assert.ok(files.includes("404.html"));

  for (const page of pages) {
    const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
    assert.ok(files.includes(file), `missing ${file}`);
    const html = await readFile(resolve("dist", file), "utf8");
    assert.ok(
      html.includes(`<link rel="canonical" href="${ORIGIN}${page.path}" />`),
      `${page.path} canonical`,
    );
    assert.ok(
      html.includes(`<meta property="og:image" content="${ORIGIN}/assets/`),
      `${page.path} absolute og:image`,
    );
    assert.equal(
      html.match(/<h1[\s>]/g)?.length,
      1,
      `${page.path} must have exactly one h1`,
    );
  }

  const notFound = await readFile(resolve("dist", "404.html"), "utf8");
  assert.match(notFound, /<meta name="robots" content="noindex" \/>/);

  const sitemap = await readFile(resolve("dist", "sitemap.xml"), "utf8");
  for (const page of pages)
    assert.ok(sitemap.includes(`<loc>${ORIGIN}${page.path}</loc>`), page.path);
  // Redirect sources and the 404 must never be advertised as canonical URLs.
  for (const from of Object.keys(redirects))
    assert.ok(!sitemap.includes(`<loc>${ORIGIN}${from}</loc>`), from);
  assert.ok(!sitemap.includes("/404"));

  const robots = await readFile(resolve("dist", "robots.txt"), "utf8");
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, new RegExp(`Sitemap: ${ORIGIN}/sitemap.xml`));
});

test("the build refuses a non-HTTPS or path-bearing SITE_URL", () => {
  for (const bad of ["http://example.com/", "https://example.com/sub/"])
    assert.throws(() =>
      execFileSync(process.execPath, ["scripts/build.mjs"], {
        env: { ...process.env, SITE_URL: bad },
        stdio: "pipe",
      }),
    );
});

test("every internal link resolves to a real route or a declared redirect", () => {
  const known = new Set([
    ...pages.map((page) => page.path),
    ...Object.keys(redirects),
  ]);
  const problems = [];
  for (const page of pages) {
    const html = renderPage(page, { origin: ORIGIN });
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
    );
    for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
      const [path, fragment] = href.split("#");
      if (
        path &&
        !known.has(path) &&
        !path.startsWith("/assets/") &&
        path !== "/favicon.ico"
      )
        problems.push(`${page.path} → ${href}`);
      // A same-page fragment must exist on the page that links to it.
      if (!path && fragment && !ids.has(fragment))
        problems.push(`${page.path} → #${fragment} (no such id)`);
    }
  }
  assert.deepEqual(problems, []);
});

test("structured data on every page is valid JSON and claims nothing unverifiable", () => {
  const banned = /aggregateRating|reviewCount|ratingValue|streetAddress/;
  for (const page of pages) {
    const html = renderPage(page, { origin: ORIGIN });
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ].map((match) => match[1]);
    assert.ok(blocks.length > 0, `${page.path} has no structured data`);
    for (const block of blocks) {
      const data = JSON.parse(block.replace(/\\u003c/g, "<"));
      assert.ok(data["@context"], `${page.path} missing @context`);
      assert.ok(!banned.test(block), `${page.path} claims unverifiable data`);
    }
  }
});

test("prices are GBP everywhere, and the med-spa figures match the service list", () => {
  const rendered = pages.map((page) => ({
    path: page.path,
    html: renderPage(page, { origin: ORIGIN }),
  }));

  // No page may quote a dollar amount or name USD. The site sells in GBP.
  for (const { path, html } of rendered) {
    const text = html.replace(/<[^>]+>/g, " ");
    assert.equal(
      /\$\s?\d/.test(text),
      false,
      `${path} shows a dollar amount`,
    );
    assert.equal(/\bUSD\b/.test(text), false, `${path} mentions USD`);
  }

  const money = (amount) => `£${amount.toLocaleString("en-GB")}`;
  const medSpa = rendered.find((page) => page.path === "/med-spa-growth-system");
  const terms = rendered.find((page) => page.path === "/terms");
  const pricing = rendered.find((page) => page.path === "/pricing");

  // The composed total and every component price must appear on the med-spa
  // page and in the terms, and each component price must exist on /pricing.
  for (const target of [medSpa, terms]) {
    assert.ok(
      target.html.includes(money(SETUP_TOTAL)),
      `${target.path} is missing the ${money(SETUP_TOTAL)} total`,
    );
    for (const component of SYSTEM.components)
      assert.ok(
        target.html.includes(money(component.price)),
        `${target.path} is missing ${component.name} at ${money(component.price)}`,
      );
    assert.ok(
      target.html.includes(`£${SYSTEM.care}`),
      `${target.path} is missing the £${SYSTEM.care} care plan`,
    );
  }
  for (const component of SYSTEM.components)
    assert.ok(
      pricing.html.includes(money(component.price)),
      `/pricing does not publish ${money(component.price)} for ${component.name}`,
    );

  // The retired launch offer must not resurface in copy anywhere.
  for (const { path, html } of rendered)
    assert.equal(
      /launch (offer|price|setup)|voice minutes|SMS segments/i.test(html),
      false,
      `${path} still references the retired bundle offer`,
    );
});

test("every SVG asset is well-formed XML with no HTML-only entities", async () => {
  // XML defines only these five. A stray &middot; or &ndash; makes the whole
  // file fail to parse, and the browser silently shows alt text instead.
  const allowed = new Set(["amp", "lt", "gt", "quot", "apos"]);
  const dir = resolve("assets/work");
  const files = [
    ...(await readdir(dir)).map((name) => resolve(dir, name)),
    resolve("assets/social-card.svg"),
    resolve("assets/favicon.svg"),
  ].filter((file) => file.endsWith(".svg"));
  assert.ok(files.length > 0, "no SVG assets found");
  for (const file of files) {
    const svg = await readFile(file, "utf8");
    for (const [, name] of svg.matchAll(/&([a-zA-Z][a-zA-Z0-9]*);/g))
      assert.ok(
        allowed.has(name),
        `${file} uses &${name}; which is undefined in XML`,
      );
    assert.match(svg.trimStart(), /^<svg[\s>]/, `${file} is not an svg root`);
    assert.match(svg.trimEnd(), /<\/svg>$/, `${file} is truncated`);
  }
});
