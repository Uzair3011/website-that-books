// The template for the articles under /resources/<slug>. It uses the stacked
// layout of the long-form pages (eyebrow and a full-width H2 on top, the copy
// underneath) and adds what an article needs: a byline, published and updated
// dates, a short table of contents, BlogPosting JSON-LD, related reading and a
// call to action to the free audit. Each article passes all of its own copy.
import { catalogItem } from "../assets/catalog.js";
import {
  CTA,
  articleJsonLd,
  breadcrumbJsonLd,
  finalCta,
  icon,
  related,
} from "./site.js";

/** A published price from assets/catalog.js, e.g. "£179", so articles never drift from /pricing. */
export const price = (slug) => `£${catalogItem(slug).price.toLocaleString("en-GB")}`;

// A body item that is already HTML (a list, a table, an h3) is used as is; plain text is a paragraph.
const block = (item) => (item.startsWith("<") ? item : `<p>${item}</p>`);

/** A table that scrolls sideways on a phone instead of widening the page. */
export const table = ({ caption, head, rows }) => `<div class="table-wrap"><table>
  ${caption ? `<caption>${caption}</caption>` : ""}
  <thead><tr>${head.map((cell) => `<th scope="col">${cell}</th>`).join("")}</tr></thead>
  <tbody>${rows.map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`)).join("")}</tr>`).join("")}</tbody>
</table></div>`;

/** A checklist rendered as ticked items. */
export const checklist = (items) =>
  `<ul class="tick-list article-checklist">${items.map((item) => `<li>${icon("check")}<span>${item}</span></li>`).join("")}</ul>`;

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
  // [{ id, toc, eyebrow, heading, body: [paragraph text or HTML], band }]
  sections,
  // [{ href, label, text }]
  relatedItems,
  // { heading, body }; the button always goes to the free audit.
  closing,
}) {
  const path = `/resources/${slug}`;
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
    (section) => `
      <section class="section${section.band ? ` ${section.band}` : ""}" id="${section.id}">
        <div class="container">
          <div class="section-head sp-stacked-head">
            <p class="eyebrow">${section.eyebrow}</p>
            <h2>${section.heading}</h2>
          </div>
          <div class="prose sp-local-copy">${section.body.map(block).join("")}</div>
        </div>
      </section>`,
  )
  .join("\n")}

${related(relatedItems, "Read next")}

${finalCta({ heading: closing.heading, body: closing.body, primary: "Get a free website audit", href: CTA.href })}`;

  return {
    path,
    title,
    description,
    ogType: "article",
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
    ],
    body,
  };
}
