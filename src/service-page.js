// One layout for all five service pages: hero, what it is, what's included,
// how it fits with the rest, price signpost, FAQ, related links, final CTA.
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

export function servicePage({
  path,
  title,
  description,
  eyebrow,
  h1,
  lede,
  serviceName,
  image,
  intro,
  included,
  includedHeading = "What is included",
  fit,
  fitHeading,
  price,
  faqs,
  relatedItems,
  breadcrumbName,
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
              <img src="${image.src}" width="${image.width}" height="${image.height}" alt="${image.alt}" />
            </figure>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="two-col">
            <div class="section-head" style="margin-bottom: 0">
              <h2>${intro.heading}</h2>
            </div>
            <div class="prose">${intro.body.map((p) => `<p>${p}</p>`).join("")}</div>
          </div>
        </div>
      </section>

      <section class="section band-light">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">${includedHeading}</p>
            <h2>${included.heading}</h2>
          </div>
          <ol class="steps reveal">
            ${included.items
              .map(
                (item) => `<li><h3>${item.title}</h3><p>${item.text}</p></li>`,
              )
              .join("")}
          </ol>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">${fitHeading || "Works on its own"}</p>
            <h2>${fit.heading}</h2>
            <p class="lede">${fit.body}</p>
          </div>
          <ul class="chain reveal">
            ${fit.items
              .map(
                (item) =>
                  `<li><b>${item.label}</b><h3>${item.title}</h3><p>${item.text}</p></li>`,
              )
              .join("")}
          </ul>
        </div>
      </section>

      <section class="section tight">
        <div class="container">
          <div class="split-head">
            <div>
              <p class="eyebrow">Price</p>
              <h2>${price.heading}</h2>
              <p>${price.body}</p>
            </div>
            <a class="btn" href="/pricing">See the full price list${icon("arrow-up")}</a>
          </div>
        </div>
      </section>

${faqSection(faqs, { heading: "Common questions", eyebrow: "Before you ask" })}

${related(relatedItems)}

${finalCta()}`;

  return {
    path,
    title,
    description,
    jsonLd: [
      serviceJsonLd({ name: serviceName, description, path }),
      faqJsonLd(faqs),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: breadcrumbName, path },
      ]),
    ],
    body,
  };
}
