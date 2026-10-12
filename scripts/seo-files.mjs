// The plain-text and XML files crawlers read: sitemap.xml, robots.txt and
// llms.txt. scripts/build.mjs writes them into dist/, scripts/dev.mjs serves
// them, and scripts/seo-check.mjs checks the same output, so all three agree.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pages } from "../src/pages.js";
import { SERVICES, SITE } from "../src/site.js";

const root = fileURLToPath(new URL("../", import.meta.url));

// Route → the src/pages/*.js file that defines it, read from each module's
// own `path` so a renamed file or route cannot fall out of step.
const sourceByPath = new Map();
// Recursive, so the articles in src/pages/resources/ are found too.
for (const entry of readdirSync(new URL("../src/pages/", import.meta.url), { recursive: true })) {
  const name = entry.replaceAll("\\", "/");
  if (!name.endsWith(".js")) continue;
  const page = (await import(pathToFileURL(`${root}src/pages/${name}`).href)).default;
  if (page?.path) sourceByPath.set(page.path, `src/pages/${name}`);
}

export const pageSource = (path) => sourceByPath.get(path) ?? null;

const buildDate = new Date().toISOString().slice(0, 10);
const lastmodCache = new Map();

/**
 * The date of the last commit that touched a page's source file (YYYY-MM-DD).
 * Falls back to the build date when git is missing, the file is uncommitted,
 * or a shallow clone does not reach the commit.
 */
export function lastmod(path) {
  const file = pageSource(path);
  if (!file) return buildDate;
  if (!lastmodCache.has(file)) {
    let date = "";
    try {
      date = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    } catch {
      /* No git here: use the build date. */
    }
    lastmodCache.set(file, /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : buildDate);
  }
  return lastmodCache.get(file);
}

/** Indexable pages only: noindex routes, utility pages and redirects never appear. */
export const sitemapXml = (origin, list = pages) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${list
    .filter((page) => !page.noindex)
    .map((page) => `<url><loc>${origin}${page.path}</loc><lastmod>${lastmod(page.path)}</lastmod></url>`)
    .join("")}</urlset>`;

// /admin is deliberately not disallowed: crawlers must be able to fetch it to
// see its noindex meta tag and X-Robots-Tag header.
export const robotsTxt = (origin) =>
  `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`;

// Legal pages add nothing for an AI answer, so llms.txt leaves them out.
const LEGAL = new Set(["/privacy", "/cookie-policy", "/terms"]);
const SERVICE_PATHS = new Set([
  ...SERVICES.map((service) => service.href),
  "/google-business-profile",
  "/website-care",
]);

/**
 * A short summary for AI search tools (https://llmstxt.org). Every line comes
 * from SITE, SERVICES or a page's own title and meta description, so it can
 * only repeat what the site already says.
 */
export function llmsTxt(origin, list = pages) {
  const indexable = list.filter((page) => !page.noindex && !LEGAL.has(page.path));
  const entry = (page) =>
    `- [${page.title.replace(/\s*\|\s*Veltra Media$/, "")}](${origin}${page.path}): ${page.description}`;
  // Only the first sentence of the about description: what the business is.
  const about = list.find((page) => page.path === "/about")?.description.split(/(?<=\.)\s/)[0];
  return `# ${SITE.name}

> ${about ?? SITE.tagline}

${SITE.name} is based in Middlesbrough and works with businesses across ${SITE.areas.slice(0, -1).join(", ")} and the wider ${SITE.areas.at(-1)}. Every service can be bought on its own.

## Services

${SERVICES.map((service) => `- [${service.name}](${origin}${service.href}): ${service.short}`).join("\n")}
${indexable
  .filter((page) => SERVICE_PATHS.has(page.path) && !SERVICES.some((s) => s.href === page.path))
  .map(entry)
  .join("\n")}

## Areas served

${SITE.areas.map((area) => `- ${area}`).join("\n")}

## Key pages

${indexable.filter((page) => !SERVICE_PATHS.has(page.path)).map(entry).join("\n")}

## Contact

- Email: ${SITE.email}
- WhatsApp: ${SITE.phoneLabel}
- Contact page: ${origin}/contact
`;
}
