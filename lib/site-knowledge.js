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

// ── A slimmer version for backup models with small free limits ─────────────
// The site split into ~800-character passages, so a question can be answered from the few
// passages that match it instead of the whole site. Keyword scoring, no extra service.
const STOP = new Set(
  "a an and are as at be but by can do does for from how i if in is it me my of on or our so that the this to we what when where which who why will with you your".split(
    " ",
  ),
);
const terms = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9£]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2 && !STOP.has(word))
    .map((word) => word.replace(/(ies|es|s)$/, ""));

let passages;
export function sitePassages() {
  if (passages) return passages;
  passages = [];
  for (const section of siteKnowledge().split(/\n(?=## )/)) {
    const [heading, ...lines] = section.split("\n");
    let chunk = [];
    const flush = () => {
      if (!chunk.length) return;
      const text = chunk.join("\n");
      passages.push({
        heading,
        text,
        terms: new Set(terms(`${heading} ${text}`)),
      });
      chunk = [];
    };
    for (const line of lines) {
      chunk.push(line);
      if (chunk.join("\n").length > 800) flush();
    }
    flush();
  }
  return passages;
}

// The best-matching passages for the conversation, grouped under their page headings, plus
// a list of every page so the model can still point visitors elsewhere.
export function relevantKnowledge(query, { page, budget = 9000 } = {}) {
  const all = sitePassages();
  const wanted = terms(query);
  const rarity = (term) =>
    Math.log(
      1 + all.length / (1 + all.filter((p) => p.terms.has(term)).length),
    );
  const scored = all.map((passage, index) => ({
    passage,
    index,
    score:
      wanted.reduce(
        (sum, term) => sum + (passage.terms.has(term) ? rarity(term) : 0),
        0,
      ) +
      // Small nudges: the page they're reading, and the overview at the top of the home page.
      (page && passage.heading.endsWith(`(${page})`) ? 1 : 0) +
      (index === 0 ? 0.5 : 0),
  }));
  const chosen = [];
  let used = 0;
  for (const item of scored.sort((a, b) => b.score - a.score)) {
    if (used + item.passage.text.length > budget) continue;
    chosen.push(item);
    used += item.passage.text.length;
  }
  // Back in site order, one heading per page.
  const byPage = new Map();
  for (const { passage } of chosen.sort((a, b) => a.index - b.index)) {
    byPage.set(passage.heading, [
      ...(byPage.get(passage.heading) || []),
      passage.text,
    ]);
  }
  const pagesList = [
    ...new Set(all.map((p) => p.heading.replace(/^## /, ""))),
  ].join("\n");
  return `${[...byPage].map(([heading, texts]) => `${heading}\n${texts.join("\n")}`).join("\n\n")}\n\nALL PAGES ON THE SITE\n${pagesList}`;
}
