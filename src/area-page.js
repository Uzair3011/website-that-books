// The layout for the town pages under /areas. Every section uses the stacked
// layout of the sales pages: eyebrow and a full-width H2 on top, the copy
// underneath. Each page passes all of its own copy, including the related
// links and the closing call to action, so no two town pages share a template
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

// The map names every town these pages cover.
const MAP = {
  src: "/assets/work/teesside-map.svg",
  width: 1000,
  height: 720,
};

// A body item that is already HTML (a list, say) is used as is; plain text is a paragraph.
const block = (item) => (item.startsWith("<") ? item : `<p>${item}</p>`);

export function areaPage({
  path,
  title,
  description,
  // Places for the Service JSON-LD areaServed, e.g. ["Redcar"].
  areaServed,
  breadcrumbName,
  serviceName,
  eyebrow,
  h1,
  lede,
  mapAlt,
  // [{ id, eyebrow, heading, body: [paragraph text or HTML], band }]
  sections,
  faqs,
  // { heading, items: [{ href, label, text }] } for the other area pages.
  areas,
  // { heading, items } for the service pages.
  services,
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
            <figure class="hero-media reveal">
              <img src="${MAP.src}" width="${MAP.width}" height="${MAP.height}" loading="eager" fetchpriority="high" alt="${mapAlt}" />
            </figure>
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

${faqSection(faqs, { heading: "Questions we get asked", eyebrow: "Before you ask" })}

${related(services.items, services.heading)}

${related(areas.items, areas.heading)}

${finalCta({ heading: closing.heading, body: closing.body })}`;

  return {
    path,
    title,
    description,
    jsonLd: [
      serviceJsonLd({ name: serviceName, description, path, areaServed }),
      faqJsonLd(faqs),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Areas", path: "/areas" },
        { name: breadcrumbName, path },
      ]),
    ],
    body,
  };
}
