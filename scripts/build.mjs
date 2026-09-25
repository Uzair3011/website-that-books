import { cp, mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { renderPage } from "../src/layout.js";
import { notFoundPage, pages } from "../src/pages.js";
import { publicConfig, renderConfigScript } from "../lib/public-config.js";
import { bookingSettings } from "../lib/schedule.js";

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
for (const page of pages) {
  const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}.html`;
  await emit(file, renderPage(page, { origin }));
}
await emit("404.html", renderPage(notFoundPage, { origin }));

await cp("assets", resolve(output, "assets"), { recursive: true });
// Fail the deploy on malformed public contact or booking settings instead of
// shipping a broken page.
await writeFile(resolve(output, "assets/config.js"), renderConfigScript());
bookingSettings();
const missing = Object.entries(publicConfig())
  .filter(([key, value]) => !value && key !== "bookingUrl")
  .map(([key]) => key);
if (missing.length)
  console.warn(`Public contact options not configured: ${missing.join(", ")}.`);

await cp("favicon.ico", resolve(output, "favicon.ico"));
await writeFile(
  resolve(output, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  resolve(output, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages
    .map(
      (page) =>
        `<url><loc>${origin}${page.path}</loc><priority>${page.path === "/" ? "1.0" : "0.8"}</priority></url>`,
    )
    .join("")}</urlset>`,
);
console.log(
  `Built ${pages.length} pages into dist/. Canonical URLs and sitemap generated for ${origin}.`,
);
