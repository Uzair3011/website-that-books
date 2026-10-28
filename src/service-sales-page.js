// The long-form sales layout for the five core service pages, in the order of
// the approved template: hook, example scenarios, the old way, the new way, the
// offer stack, the bonuses and price, what we commit to in writing, then the
// call to action.
// Each page passes its own copy; nothing here is page-specific. Optional
// sections: local search copy, an FAQ (with matching FAQPage JSON-LD) and
// related services, all rendered before the call to action.
import {
  CTA,
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  icon,
  related,
  serviceJsonLd,
} from "./site.js";
import { catalogItemByHref } from "../assets/catalog.js";
import { readingBody } from "./reading.js";
import { checkoutEnabled } from "../lib/payments.js";

// The same photo as the homepage map section (credited in docs/image-credits.md).
const BRIDGE = "/assets/work/tees-transporter-bridge.webp";
const BRIDGE_SRCSET =
  "/assets/work/tees-transporter-bridge-800.webp 800w, /assets/work/tees-transporter-bridge.webp 1600w";
const gbp = (amount) => `£${amount.toLocaleString("en-GB")}`;

/** Wraps the first occurrence of `phrase` in `text` with a highlight span. */
const highlight = (text, phrase) =>
  phrase && text.includes(phrase)
    ? text.replace(phrase, `<span class="sp-hl">${phrase}</span>`)
    : text;

// Long headings (a full sentence of agitation copy) step down a size.
const headingClass = (text) => (text.length > 90 ? ' class="sp-long"' : "");

const media = (visual) =>
  typeof visual === "string"
    ? visual
    : `<img src="${visual.src}" width="${visual.width}" height="${visual.height}" alt="${visual.alt}" decoding="async"${visual.eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"'} />`;

const stat = (item) =>
  `<div class="sp-stat${item.value ? "" : " wide"}"><dt>${item.label}</dt><dd>${
    item.value ? `<b>${item.value}</b>` : ""
  }<span>${item.text}</span></dd></div>`;

// No case on these pages is a real client result (see docs/seo/claims-review.md),
// so every card carries a visible label. A real, evidenced result needs its
// own card without it.
const caseCard = (item) => `<article class="sp-case reveal">
            ${item.visual ? `<figure class="sp-case-media">${media(item.visual)}</figure>` : ""}
            <div class="sp-case-body">
              <p class="sp-case-label">Illustrative example, not a real client result</p>
              <h3>${item.title}</h3>
              ${item.intro ? `<p class="sp-case-intro">${item.intro}</p>` : ""}
              <dl class="sp-stats">${item.stats.map(stat).join("")}</dl>
            </div>
          </article>`;

export function serviceSalesPage({
  path,
  title,
  description,
  breadcrumbName,
  serviceName,
  // schema.org serviceType: the kind of service, in plain words.
  serviceType,
  // Places for the Service JSON-LD areaServed; null serves every SITE.areas entry.
  areaServed = null,
  eyebrow,
  h1,
  h1Highlight,
  // The persuasive opening line, shown in bold at the start of the lede so the
  // H1 can carry the search phrase.
  hook = "",
  lede,
  heroVisual,
  // Three short facts from the page's own copy: the hero strip and the
  // closing checklist.
  points,
  // { note }: an optional line under the closing button. The button itself
  // always reads CTA.primary, so the offer has one name everywhere.
  cta = {},
  proof,
  problem,
  solution,
  offer,
  bonuses,
  // { heading, body }: delivery and ownership terms that match /how-it-works
  // and /terms. Not a guarantee: only /terms can set one.
  commitment,
  closing,
  // Shown with the price wherever it appears, e.g. a running cost billed at cost.
  priceNote = "",
  // { eyebrow, heading, body: [paragraph HTML], readingLayout }: readingLayout
  // sets the copy column in the reading layout (src/reading.js).
  local = null,
  faqs = [],
  relatedItems = [],
}) {
  // The price comes from the catalogue behind /pricing, so the two can never disagree.
  const price = catalogItemByHref(path);
  if (!price) throw new Error(`${path} has no entry in assets/catalog.js`);
  const amount = gbp(price.price);
  const terms = `${price.unit}, excl. VAT${priceNote ? `. ${priceNote}` : ""}`;

  const ctaButton = (extra = "") =>
    `<a class="btn${extra}" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>`;
  // Only rendered when online checkout is switched on for this build.
  const buyButton = (extra = "") =>
    price.purchasable && checkoutEnabled()
      ? `<a class="btn secondary${extra}" href="/checkout?service=${price.slug}">Buy now for ${amount}${icon("arrow-up")}</a>`
      : "";

  const body = `      <section class="sp-hero">
        <div class="container">
          <div class="sp-hero-grid">
            <div class="sp-hero-copy">
              <p class="eyebrow">${eyebrow}</p>
              <h1>${highlight(h1, h1Highlight)}</h1>
              <p class="lede">${hook ? `<strong>${hook}</strong> ` : ""}${lede}</p>
              <div class="sp-hero-actions">
                ${ctaButton()}
                <a class="sp-scroll" href="#offer">${icon("arrow-down")}See the full offer</a>
              </div>
              <p class="sp-price-tag"><span class="sp-price-label">Price</span><b>${amount}</b><span>${terms}</span></p>
            </div>
            <figure class="sp-hero-media">${media(heroVisual)}</figure>
          </div>
          <ol class="sp-points">
            ${points
              .map(
                (point, i) =>
                  `<li><span class="sp-num">0${i + 1}</span><div><b>${point.label}</b><span>${point.text}</span></div></li>`,
              )
              .join("")}
          </ol>
        </div>
      </section>

      <section class="sp-section sp-proof" aria-labelledby="proof-title">
        <div class="container">
          <div class="sp-head">
            <p class="eyebrow">Illustrative examples</p>
            <h2 id="proof-title">${proof.heading}</h2>
            ${proof.intro ? `<p>${proof.intro}</p>` : ""}
          </div>
          <div class="sp-cases${proof.visual ? " has-visual" : ""}">
          ${proof.visual ? `<figure class="sp-proof-visual reveal">${media(proof.visual)}</figure>` : ""}
          ${proof.cases.map(caseCard).join("")}
          </div>
        </div>
      </section>

      <section class="sp-section sp-problem">
        <div class="container sp-problem-grid">
          <div class="sp-problem-copy">
            <p class="eyebrow">The old way</p>
            <h2${headingClass(problem.heading)}>${problem.heading}</h2>
            <p>${problem.body}</p>
          </div>
          <figure class="sp-problem-visual reveal">${media(problem.visual)}</figure>
        </div>
      </section>

      <section class="sp-section sp-solution">
        <div class="container sp-stacked">
          <div class="sp-head">
            <p class="eyebrow">${solution.eyebrow}</p>
            <h2${headingClass(solution.heading)}>${highlight(solution.heading, solution.highlight)}</h2>
          </div>
          <ol class="sp-steps">
            ${solution.items
              .map(
                (item, i) =>
                  `<li class="reveal"><span class="sp-num">0${i + 1}</span><div><h3>${item.title}</h3><p>${item.text}</p></div><span class="sp-tile">${icon(item.icon)}</span></li>`,
              )
              .join("")}
          </ol>
        </div>
      </section>
${
  local
    ? `
      <section class="${local.readingLayout ? "rl-section" : "section"}" id="local">
        <div class="container">
          ${
            local.readingLayout
              ? `<p class="eyebrow rl-label">${local.eyebrow}</p>
          <h2 class="rl-h2">${local.heading}</h2>`
              : `<div class="section-head sp-stacked-head">
            <p class="eyebrow">${local.eyebrow}</p>
            <h2>${local.heading}</h2>
          </div>`
          }
          <div class="sp-local-grid">
            ${
              local.readingLayout
                ? `<div>${readingBody(local.body)}</div>`
                : `<div class="prose sp-local-copy">${local.body.map((p) => `<p>${p}</p>`).join("")}</div>`
            }
            <aside class="sp-local-aside" aria-label="${breadcrumbName} at a glance">
              <p class="sp-aside-price"><b>${amount}</b><span>${terms}</span></p>
              <ul class="sp-checks">
                ${points.map((point) => `<li>${icon("check")}${point.label}</li>`).join("")}
              </ul>
              ${ctaButton(" block")}
            </aside>
          </div>
        </div>
      </section>
`
    : ""
}
      <section class="sp-section sp-offer" id="offer">
        <div class="container sp-stacked">
          <div class="sp-head">
            <p class="eyebrow">The offer stack</p>
            <h2 class="sp-long">${highlight(offer.heading, offer.highlight)}</h2>
          </div>
          <ul class="sp-stack">
            ${offer.items
              .map(
                (item) =>
                  `<li class="reveal"><span class="sp-tile light">${icon(item.icon)}</span><div><h3>${item.title}</h3><p>${item.text}</p></div></li>`,
              )
              .join("")}
          </ul>
        </div>
      </section>

      <section class="section band-dark sp-bonuses">
        <div class="container">
          <div class="sp-bonus-head">
            ${
              bonuses.heading
                ? `<p class="eyebrow">Free bonuses</p><h2>${highlight(bonuses.heading, bonuses.highlight)}</h2>`
                : `<h2 class="eyebrow">Free bonuses</h2>`
            }
          </div>
          <div class="sp-bonus-grid">
            <ul class="sp-bonus-list">
              ${bonuses.items
                .map(
                  (item, i) =>
                    `<li class="reveal"><span class="sp-tile accent">${icon(item.icon)}</span><h3><span>Bonus ${i + 1}:</span> ${item.title}</h3><p>${item.text}</p></li>`,
                )
                .join("")}
            </ul>
            <div class="sp-total reveal">
              <div class="sp-compare now">
                <p>Your Investment:</p>
                <strong>${amount} <small>${price.unit}</small></strong>
              </div>
              <p class="sp-invest-note">${bonuses.investmentNote || "Fixed price."} Prices exclude VAT.${priceNote ? ` ${priceNote}` : ""}</p>
              <a class="sp-price-link" href="/pricing">See the full price list${icon("arrow-up")}</a>
            </div>
          </div>
          <div class="sp-bonus-cta">${ctaButton()}${buyButton()}</div>
        </div>
      </section>

      <section class="sp-guarantee" aria-labelledby="commitment-title">
        <figure class="sp-guarantee-art"><img src="${BRIDGE}" srcset="${BRIDGE_SRCSET}" sizes="(min-width: 900px) 50vw, 100vw" width="1600" height="1047" loading="lazy" decoding="async" alt="The Tees Transporter Bridge in Middlesbrough, its blue steel towers and high girder against a cloudy sunset sky." /></figure>
        <div class="sp-guarantee-copy">
          <span class="sp-badge">${icon("doc")}</span>
          <p class="eyebrow">In writing</p>
          <h2 id="commitment-title">${commitment.heading}</h2>
          <p>${commitment.body}</p>
        </div>
      </section>
${faqs.length ? `\n${faqSection(faqs, { heading: "Common questions", eyebrow: "Before you ask" })}\n` : ""}${relatedItems.length ? `\n${related(relatedItems)}\n` : ""}

      <section class="band-dark sp-close">
        <img class="sp-close-photo" src="${BRIDGE}" srcset="${BRIDGE_SRCSET}" sizes="100vw" width="1600" height="1047" loading="lazy" decoding="async" alt="" aria-hidden="true" />
        <div class="container sp-close-grid">
          <div>
            <p class="eyebrow">Next step</p>
            <h2>${closing.heading}${closing.highlight ? ` <span class="sp-accent">${closing.highlight}</span>` : ""}</h2>
          </div>
          <div class="sp-close-side">
            <p class="sp-close-price"><span>Your Investment:</span><b>${amount}</b><span>${terms}</span></p>
            <ul class="sp-checks">
              ${points.map((point) => `<li>${icon("check")}${point.label}</li>`).join("")}
            </ul>
            ${ctaButton(" block")}
            ${buyButton(" block")}
            ${cta.note ? `<p class="sp-note">${cta.note}</p>` : ""}
            <div class="cta-contacts">
              <a href="${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp ${SITE.phoneLabel}</a>
              <a href="mailto:${SITE.email}">${icon("mail")}${SITE.email}</a>
            </div>
          </div>
        </div>
      </section>`;

  return {
    path,
    title,
    description,
    jsonLd: [
      serviceJsonLd({ name: serviceName, serviceType, description, path, areaServed }),
      ...(faqs.length ? [faqJsonLd(faqs)] : []),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: breadcrumbName, path },
      ]),
    ],
    body,
  };
}
