import { cp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { publicConfig, renderConfigScript } from "../lib/public-config.js";
import { bookingSettings } from "../lib/schedule.js";
const output = resolve("dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const pages = [
  "index.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "ai-receptionist-for-med-spas.html",
  "med-spa-website-design.html",
  "med-spa-online-booking.html",
  "pricing.html",
  "about.html",
  "404.html",
];
const paths = {
  "index.html": "/",
  "contact.html": "/contact",
  "privacy.html": "/privacy",
  "terms.html": "/terms",
  "ai-receptionist-for-med-spas.html": "/ai-receptionist-for-med-spas",
  "med-spa-website-design.html": "/med-spa-website-design",
  "med-spa-online-booking.html": "/med-spa-online-booking",
  "pricing.html": "/pricing",
  "about.html": "/about",
};
// Falls back to the canonical production domain so canonical tags, robots.txt's Sitemap
// line, and sitemap.xml always ship — an unset SITE_URL previously shipped none of them.
const site = new URL(process.env.SITE_URL || "https://www.veltramedia.com");
if (
  site.protocol !== "https:" ||
  site.pathname !== "/" ||
  site.username ||
  site.password
)
  throw new Error("SITE_URL must be a public HTTPS origin.");
const origin = site.origin;
for (const file of pages) {
  let html = await readFile(file, "utf8");
  if (paths[file]) {
    const canonical = origin + paths[file];
    html = html
      .replace(
        "</head>",
        `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"></head>`,
      )
      .replace(
        'content="/assets/social-card.png"',
        `content="${origin}/assets/social-card.png"`,
      );
  }
  if (file === "404.html")
    html = html.replace(
      "</head>",
      '<meta name="robots" content="noindex"></head>',
    );
  await writeFile(resolve(output, file), html);
}
await cp("assets", resolve(output, "assets"), { recursive: true });
// Fail the deploy on malformed public contact or booking settings instead of shipping a broken page.
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
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(
    paths,
  )
    .map((path) => `<url><loc>${origin}${path}</loc></url>`)
    .join("")}</urlset>`,
);
console.log(
  `Built Veltra Media into dist/. Canonical URLs and sitemap included for ${origin}.`,
);
