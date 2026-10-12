// The long-form layout for pages that are mostly reading: the town pages, the
// trades page and the AI agents overview. Every section uses the stacked
// layout of the sales pages: eyebrow and a full-width H2 on top, the copy
// underneath. Each page passes all of its own copy, including the related
// links and the closing call to action, so no two pages share a template
// paragraph (hard rule 2 in .cursor/rules/seo.mdc).
import {
  CTA,
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  finalCta,
  icon,
  related,
  serviceJsonLd,
} from "./site.js";

// A body item that is already HTML (a list, say) is used as is; plain text is a paragraph.
const block = (item) => (item.startsWith("<") ? item : `<p>${item}</p>`);

// An <img> ({ src, width, height, alt }) or an inline SVG string from
// src/service-visuals.js. A caption says what the picture is, e.g. that a
// mock-up is not a real client's site.
function heroFigure({ image, caption }) {
  const media =
    typeof image === "string"
      ? image
      : `<img src="${image.src}" width="${image.width}" height="${image.height}" loading="eager" fetchpriority="high" alt="${image.alt}" />`;
  return `<figure class="hero-media reveal">
              ${media}${caption ? `<figcaption class="hero-caption">${caption}</figcaption>` : ""}
            </figure>`;
}

export function stackedPage({
  path,
  title,
  description,
  // [{ name, path }] after Home, ending with this page.
  breadcrumbs,
  serviceName,
  // schema.org serviceType: the kind of service, in plain words.
  serviceType,
  // Places for the Service JSON-LD areaServed; null serves every SITE.areas entry.
  areaServed = null,
  eyebrow,
  h1,
  lede,
  // { image, caption }: see heroFigure().
  hero,
  // [{ id, eyebrow, heading, body: [paragraph text or HTML], band }]
  sections,
  faqs,
  faqHeading = "Questions we get asked",
  // [{ heading, items: [{ href, label, text }] }]
  relatedSections = [],
  // { heading, body }; the button always goes to the free audit.
  closing,
}) {
  const body = `      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy service-hero">
              <p class="eyebrow">${eyebrow}</p>
              <h1>${h1}</h1>
              <p class="lede">${lede}</p>
              <div class="button-row">
                <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
                <a class="btn secondary" href="/pricing">See prices</a>
              </div>
            </div>
            ${heroFigure(hero)}
          </div>
        </div>
      </section>
${sections
  .map(
    (section) => `
      <section class="section${section.band ? ` ${section.band}` : ""}"${section.id ? ` id="${section.id}"` : ""}>
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

${faqSection(faqs, { heading: faqHeading, eyebrow: "Before you ask" })}
${relatedSections.map((group) => `\n${related(group.items, group.heading)}\n`).join("")}
${finalCta({ heading: closing.heading, body: closing.body })}`;

  return {
    path,
    title,
    description,
    jsonLd: [
      serviceJsonLd({ name: serviceName, serviceType, description, path, areaServed }),
      faqJsonLd(faqs),
      breadcrumbJsonLd([{ name: "Home", path: "/" }, ...breadcrumbs]),
    ],
    body,
  };
}
