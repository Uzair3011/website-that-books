// Plain-text copy of the public website for the chat assistant. Built from the same page
// modules the site renders, so every deploy updates what the assistant knows.
import { pages } from "../src/pages.js";

// Legal boilerplate is linked rather than quoted.
const SKIP = new Set(["/privacy", "/cookie-policy"]);
const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  pound: "£",
  middot: "·",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  hellip: "…",
};

export function htmlToText(html) {
  return String(html)
    .replace(/<(script|style|svg|form|noscript)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(
      /<\/(p|h[1-6]|li|div|section|tr|dt|dd|summary|details|blockquote)>/gi,
      "\n",
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#\d+|[a-z]+);/gi, (entity, code) =>
      code.startsWith("#")
        ? String.fromCodePoint(Number(code.slice(1)))
        : (ENTITIES[code.toLowerCase()] ?? " "),
    )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*/g, "\n")
    .replace(/\n+/g, "\n")
    .trim();
}

let cached;
export function siteKnowledge() {
  if (cached) return cached;
  // Sections repeated across pages (calls to action, related services) are kept once.
  const seen = new Set();
  cached = pages
    .filter((page) => !SKIP.has(page.path))
    .map((page) => {
      // Short lines (headings, badges) may recur across pages but not within one.
      const local = new Set();
      const lines = htmlToText(page.body)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 1)
        .filter((line) => {
          const pool = line.length < 30 ? local : seen;
          if (pool.has(line)) return false;
          pool.add(line);
          return true;
        });
      return `## ${page.title} (${page.path})\n${lines.join("\n")}`;
    })
    .join("\n\n");
  return cached;
}
