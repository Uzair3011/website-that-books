import { cp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
const output = resolve("dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const pages = [
  "index.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "404.html",
];
const paths = {
  "index.html": "/",
  "contact.html": "/contact",
  "privacy.html": "/privacy",
  "terms.html": "/terms",
};
let origin;
if (process.env.SITE_URL) {
  const site = new URL(process.env.SITE_URL);
  if (
    site.protocol !== "https:" ||
    site.pathname !== "/" ||
    site.username ||
    site.password
  )
    throw new Error("SITE_URL must be a public HTTPS origin.");
  origin = site.origin;
}
for (const file of pages) {
  let html = await readFile(file, "utf8");
  if (origin && paths[file]) {
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
await cp("favicon.ico", resolve(output, "favicon.ico"));
await writeFile(
  resolve(output, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /api/\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`,
);
if (origin)
  await writeFile(
    resolve(output, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(
      paths,
    )
      .map((path) => `<url><loc>${origin}${path}</loc></url>`)
      .join("")}</urlset>`,
  );
console.log(
  `Built Veltra Media into dist/. ${origin ? "Canonical URLs and sitemap included." : "Set SITE_URL to include production canonical URLs and sitemap."}`,
);
