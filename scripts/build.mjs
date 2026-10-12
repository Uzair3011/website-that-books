import { cp, mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { renderAdminPage } from "../src/admin.js";
import { versionImports } from "../src/asset-version.js";
import { renderPage } from "../src/layout.js";
import { notFoundPage, pages, utilityPages } from "../src/pages.js";
import { publicConfig, renderConfigScript } from "../lib/public-config.js";
import { bookingSettings } from "../lib/schedule.js";
import { llmsTxt, robotsTxt, sitemapXml } from "./seo-files.mjs";
import { vendorFiles } from "./vendor.mjs";

const output = resolve("dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

// Falls back to the canonical production domain so canonical tags, robots.txt's
// Sitemap line and sitemap.xml always ship, even with SITE_URL unset.
const site = new URL(process.env.SITE_URL || "https://www.veltramedia.com");
if (
  site.protocol !== "https:" ||
  site.pathname !== "/" ||
  site.username ||
  site.password
)
  throw new Error("SITE_URL must be a public HTTPS origin.");
const origin = site.origin;

async function emit(file, html) {
  const target = resolve(output, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

// Clean URLs: "/" is index.html, every other route is <route>.html, which
// Vercel's cleanUrls serves at the extensionless path.
for (const page of [...pages, ...utilityPages]) {
  const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
  await emit(file, renderPage(page, { origin }));
}
await emit("404.html", renderPage(notFoundPage, { origin }));
// Private lead dashboard: noindex, never in the sitemap, and holds no lead data itself.
await emit("admin.html", renderAdminPage());

await cp("assets", resolve(output, "assets"), { recursive: true });
// Pages load assets as ?v=<version>; imported modules need the same stamp to escape stale caches.
for (const name of await readdir(resolve(output, "assets"))) {
  if (!name.endsWith(".js")) continue;
  const file = resolve(output, "assets", name);
  await writeFile(file, versionImports(await readFile(file, "utf8")));
}
// Fail the deploy on malformed public contact or booking settings instead of
// shipping a broken page.
await writeFile(resolve(output, "assets/config.js"), renderConfigScript());
// Served from our own origin, so the Content-Security-Policy's script-src 'self' still holds.
for (const [published, source] of Object.entries(vendorFiles)) {
  await mkdir(dirname(resolve(output, published.slice(1))), {
    recursive: true,
  });
  await cp(source, resolve(output, published.slice(1)));
}
bookingSettings();
const missing = Object.entries(publicConfig())
  .filter(([key, value]) => !value && key !== "bookingUrl")
  .map(([key]) => key);
if (missing.length)
  console.warn(`Public contact options not configured: ${missing.join(", ")}.`);

await cp("favicon.ico", resolve(output, "favicon.ico"));
await writeFile(resolve(output, "robots.txt"), robotsTxt(origin));
await writeFile(resolve(output, "sitemap.xml"), sitemapXml(origin));
await writeFile(resolve(output, "llms.txt"), llmsTxt(origin));
// IndexNow proves ownership by fetching /<key>.txt, so the key file ships only
// when a key is configured (see scripts/indexnow.mjs and docs/seo/README.md).
const indexNowKey = process.env.INDEXNOW_KEY;
if (indexNowKey) {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(indexNowKey))
    throw new Error("INDEXNOW_KEY must be 8-128 letters, digits or hyphens.");
  await writeFile(resolve(output, `${indexNowKey}.txt`), indexNowKey);
}
console.log(
  `Built ${pages.length} pages into dist/. Canonical URLs and sitemap generated for ${origin}.`,
);
