// The reading layout (assets/styles.css, "Reading layout v2") for the long
// reading sections of the town pages, /web-design-teesside, the Middlesbrough
// local copy and the AI receptionist cost guide. Markup and classes only: every
// word, link and the order of the copy stay exactly as the page passes them.

// White sections (band-light) set the cards and link boxes on the canvas tint.
export const readingSectionClass = (band) =>
  `rl-section${band ? ` ${band}` : ""}${band === "band-light" ? " rl-on-white" : ""}`;

// Searches quoted in the copy (“near me”) in bold, quotation marks included.
const quotes = (html) => html.replace(/“[^”]*”/g, (phrase) => `<span class="rl-quote">${phrase}</span>`);

const linkCount = (html) => (html.match(/<a\s/g) ?? []).length;

/** A section body: runs of paragraphs in one single-column block, a list of
 * three as cards and any other list as ticks, and a paragraph with three or
 * more links as a link box. Body items are paragraph text (HTML allowed
 * inside) or an HTML list, in the order given. */
export function readingBody(items) {
  const out = [];
  let prose = [];
  const flush = () => {
    if (prose.length) out.push(`<div class="rl-prose">${prose.join("")}</div>`);
    prose = [];
  };
  for (const item of items) {
    if (item.startsWith("<ul>")) {
      flush();
      const kind = (item.match(/<li>/g) ?? []).length === 3 ? "rl-cards" : "rl-ticks";
      out.push(item.replace("<ul>", `<ul class="${kind}">`));
    } else if (item.startsWith("<")) {
      flush();
      out.push(item);
    } else if (linkCount(item) >= 3) {
      flush();
      out.push(`<p class="rl-related">${quotes(item)}</p>`);
    } else {
      prose.push(`<p>${quotes(item)}</p>`);
    }
  }
  flush();
  return out.join("");
}
