// The template for the articles under /resources/<slug>. It uses the stacked
// layout of the long-form pages (eyebrow and a full-width H2 on top, the copy
// underneath) and adds what an article needs: a byline, published and updated
// dates, a short table of contents, BlogPosting JSON-LD, related reading and a
// call to action to the free audit. Each article passes all of its own copy.
// Optional: a section can end in an FAQ (with matching FAQPage JSON-LD), a
// small sources list and a box of related links can close the last section,
// an article can drop the related reading and name its own button, and it can
// set a body class for styles of its own.
import { catalogItem } from "../assets/catalog.js";
import {
  CTA,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  finalCta,
  icon,
  related,
} from "./site.js";
import { readingSectionClass } from "./reading.js";

/** A published price from assets/catalog.js, e.g. "£179", so articles never drift from /pricing. */
export const price = (slug) => `£${catalogItem(slug).price.toLocaleString("en-GB")}`;

// A body item that is already HTML (a list, a table, an h3) is used as is; plain text is a paragraph.
const block = (item) => (item.startsWith("<") ? item : `<p>${item}</p>`);

/** A table that scrolls sideways on a phone instead of widening the page. The
 * wrapper is focusable so keyboard users can scroll it too. */
export const table = ({ caption, head, rows }) => `<div class="table-wrap" tabindex="0" role="region" aria-label="${(caption || "Table").replace(/<[^>]+>/g, "")}"><table>
  ${caption ? `<caption>${caption}</caption>` : ""}
  <thead><tr>${head.map((cell) => `<th scope="col">${cell}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`)).join("")}</tr>`).join("")}</tbody>
</table></div>`;

/** A checklist rendered as ticked items. */
export const checklist = (items) =>
  `<ul class="tick-list article-checklist">${items.map((item) => `<li>${icon("check")}<span>${item}</span></li>`).join("")}</ul>`;

// Blocks for an article body, each held to the 1040px reading width like the text.

/** A worked example: figures joined by arrows, the last one the result, e.g.
 * [{ figure: "10", label: "missed enquiries a month" }]. Still a list, so it
 * reads as one line per figure. */
export const calculation = ({ tag, items }) => `<div class="article-calc">
          <p><span class="sp-price-label">${tag}</span></p>
          <ul>${items.map((item, i) => `<li><b>${item.figure}</b> <span>${item.label}</span>${i < items.length - 1 ? icon("arrow") : ""}</li>`).join("")}</ul>
        </div>`;

/** Numbered steps as a compact grid. */
export const steps = (items) => `<ol class="article-steps">${items.map((item) => `<li>${item}</li>`).join("")}</ol>`;

/** One column of ticked points in the reading layout (src/reading.js). */
export const ticks = (items) => `<ul class="rl-ticks">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

// Cards and a note box for the guides styled under body.page-guide-cards
// (assets/styles.css): the trades and clinics AI receptionist guides.

/** A line icon for a card or note marker, drawn in currentColor. */
export const lineIcon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

/** The ✕ marker on limit cards and the "i" marker on the note box. */
export const GUIDE_ICONS = {
  cross: lineIcon('<path d="M7 7l10 10M17 7 7 17"/>'),
  info: lineIcon('<path d="M12 11v6M12 7.5v.01"/>'),
};

/** Cards in a grid (2 × 2, or three across for "clinics"), each led by an
 * icon marker: items are { icon (svg), title, text }. */
export const iconCards = (kind, items) => `<ul class="ta-cards ta-${kind}">${items
  .map((item) => `<li><span class="ta-mark">${item.icon}</span><h3>${item.title}</h3><p>${item.text}</p></li>`)
  .join("")}</ul>`;

/** A short note in a box, led by an "i" marker. */
export const noteBox = (text) => `<div class="ta-note"><span class="ta-note-mark">${GUIDE_ICONS.info}</span><p>${text}</p></div>`;

/** A panel led by a large figure (e.g. a price that the copy below also states). */
export const panel = ({ figure, body }) => `<div class="article-panel">
          <p class="sp-aside-price" aria-hidden="true"><b>${figure}</b></p>
          ${body.map(block).join("")}
        </div>`;

const longDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export function articlePage({
  slug,
  title,
  description,
  // Short name for the breadcrumb and the /resources list.
  shortName,
  // Label on the /resources list, e.g. "Guide" or "Checklist".
  kind,
  // One line for the /resources list.
  summary,
  eyebrow,
  h1,
  // The opening paragraph(s): HTML or plain text.
  intro,
  // YYYY-MM-DD.
  published,
  updated = published,
  // [{ id, toc, eyebrow, heading, body: [paragraph text or HTML], band, className, faq: [{ q, a }] }];
  // className is an extra class on the <section>, for a section with styles of its own.
  sections,
  // { heading, items: [{ label, href }] }, a small list at the end of the last section.
  sources = null,
  // [{ href, label, text }]; empty for no "Read next".
  relatedItems = [],
  // A paragraph of related links in a box (.rl-related) at the end of the last section.
  relatedLinks = "",
  // { heading, body, button }; the button goes to the free audit.
  closing,
  // The reading layout's section spacing (src/reading.js).
  readingLayout = false,
  // A class on <body> for styles that belong to this article only.
  bodyClass = "",
}) {
  const path = `/resources/${slug}`;
  // At most one section carries the FAQ; its questions are also the FAQPage JSON-LD.
  const faqs = sections.flatMap((section) => section.faq ?? []);
  const dates = `<span>Published <time datetime="${published}">${longDate(published)}</time></span><span>Updated <time datetime="${updated}">${longDate(updated)}</time></span>`;

  const body = `      <section class="hero article-hero">
        <div class="container">
          <div class="hero-copy article-head">
            <p class="eyebrow">${eyebrow}</p>
            <h1>${h1}</h1>
            <p class="article-meta"><span>By Veltra Media</span>${dates}</p>
            <div class="prose sp-local-copy article-intro">${intro.map(block).join("")}</div>
            <nav class="article-toc" aria-labelledby="toc-title">
              <p class="eyebrow" id="toc-title">In this guide</p>
              <ol>${sections.map((section) => `<li><a href="#${section.id}">${section.toc}</a></li>`).join("")}</ol>
            </nav>
          </div>
        </div>
      </section>
${sections
  .map(
    (section, i) => `
      <section class="${readingLayout ? readingSectionClass(section.band) : `section${section.band ? ` ${section.band}` : ""}`}${section.className ? ` ${section.className}` : ""}" id="${section.id}">
        <div class="container">
          <div class="section-head sp-stacked-head">
            <p class="eyebrow">${section.eyebrow}</p>
            <h2>${section.heading}</h2>
          </div>
          <div class="prose sp-local-copy">${section.body.map(block).join("")}${
            section.faq
              ? `<div class="faq reveal">${section.faq.map((item) => `<details><summary>${item.q}</summary><div>${item.a}</div></details>`).join("")}</div>`
              : ""
          }${
            sources && i === sections.length - 1
              ? `<aside class="article-sources" aria-labelledby="sources-title">
              <p class="eyebrow" id="sources-title">${sources.heading}</p>
              <ul>${sources.items.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join("")}</ul>
            </aside>`
              : ""
          }${relatedLinks && i === sections.length - 1 ? `<p class="rl-related">${relatedLinks}</p>` : ""}</div>
        </div>
      </section>`,
  )
  .join("\n")}

${relatedItems.length ? related(relatedItems, "Read next") : ""}

${finalCta({ heading: closing.heading, body: closing.body, primary: closing.button, href: CTA.href })}`;

  return {
    path,
    title,
    description,
    ogType: "article",
    ...(bodyClass && { bodyClass }),
    // Read by /resources to list the article.
    shortName,
    kind,
    summary,
    jsonLd: [
      articleJsonLd({ headline: h1, description, path, datePublished: published, dateModified: updated }),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: shortName, path },
      ]),
      ...(faqs.length ? [faqJsonLd(faqs)] : []),
    ],
    body,
  };
}
