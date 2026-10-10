import { SYSTEM } from "../../assets/business.js";
import { inquiryForm } from "../form.js";
import {
  CTA,
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  finalCta,
  icon,
  organizationJsonLd,
} from "../site.js";

const FAQS = [
  {
    q: "Do I have to buy a package?",
    a: "<p>No. Every service on this page can be bought on its own. The Growth Launch Package is there for businesses that want the whole setup at once, for less than buying each part separately.</p>",
  },
  {
    q: "Are these prices inclusive of VAT?",
    a: "<p>Prices are shown excluding VAT. Any VAT that applies is shown on your written proposal and invoice before you commit to anything.</p>",
  },
  {
    q: "What if my project does not fit a package?",
    a: "<p>Then it gets a written quote instead. Ecommerce, memberships, directories, unusual integrations and larger content structures are all scoped separately, with the work, timeline and price agreed in writing before you commit.</p>",
  },
  {
    q: "Is a care plan required?",
    a: "<p>No. Care is optional and starts at £49 a month for hosting, updates, backups, monitoring and support. If you would rather manage the site yourself, we will explain the handover and you can walk away with it.</p>",
  },
  {
    q: "Are there third-party costs on top?",
    a: "<p>Sometimes — domain registration, and the usage cost of the AI provider behind an AI receptionist, for example. We show those at cost and confirm them in writing before work begins. We do not mark them up quietly.</p>",
  },
  {
    q: "How do payments work?",
    a: "<p>Project work is split between a deposit to book the work in and a balance on completion, set out in your proposal. Monthly services are month-to-month with no long tie-in. This website does not take payments.</p>",
  },
];

// The Growth Launch Package leads, itemised against the services it includes;
// every service then follows as its own card. The "bought separately" figure
// is the sum of those services' own prices, so the saving shown is always one
// a customer would really make.
const gbp = (amount) => `£${amount.toLocaleString("en-GB")}`;

export const services = [
  {
    name: "Simple Landing Page",
    href: "/landing-page-design",
    price: 99,
    unit: "one-off",
    summary: "A sharp one-page site for a new business or a single offer.",
    features: [
      "One page, up to six sections",
      "Mobile-first custom design",
      "Contact form and click-to-call",
      "Basic SEO and analytics setup",
    ],
  },
  {
    name: "Multi-Page Website",
    href: "/web-design-middlesbrough",
    price: 179,
    unit: "one-off",
    flag: "Most popular",
    summary: "A complete small-business site that explains your services and wins enquiries.",
    features: [
      "Up to five core pages",
      "Conversion-focused structure and copy",
      "Local keyword and page mapping",
      "Analytics and enquiry tracking",
    ],
  },
  {
    name: "Local SEO + Google Business Profile",
    href: "/local-seo-middlesbrough",
    price: 99,
    unit: "one-off",
    summary: "Get found when people nearby search for what you do.",
    features: [
      "Google Business Profile setup and optimisation",
      "Service and area page structure",
      "Local schema and technical setup",
      "Consistent business details everywhere",
    ],
  },
  {
    name: "AI Receptionist + Website Chat",
    href: "/ai-automation-middlesbrough",
    price: 199,
    unit: "setup",
    summary: "Answer enquiries on the phone and on your site, even at 9pm on a Sunday.",
    features: [
      "Approved answers on calls and chat",
      "Captures enquiry details after hours",
      "Clear handover to your team",
      "AI provider usage billed at cost",
    ],
  },
  {
    name: "CRM + Booking Follow-Up Automation",
    href: "/crm-booking-automation",
    price: 199,
    unit: "setup",
    summary: "Turn enquiries into booked appointments without chasing.",
    features: [
      "Every enquiry captured in one place",
      "Live calendar booking",
      "Confirmations and reminders",
      "Consent-based email follow-up",
    ],
  },
  {
    name: "Website Care",
    href: "/website-care",
    price: 49,
    unit: "/ month",
    from: true,
    summary: "Optional. We look after the site so you do not have to.",
    features: [
      "Hosting and updates",
      "Backups and monitoring",
      "Practical support when you need it",
      "Month to month, no long tie-in",
    ],
  },
];

const bundle = {
  name: SYSTEM.package,
  price: SYSTEM.price,
  separately: SYSTEM.components.reduce((total, c) => total + c.price, 0),
};
bundle.saving = bundle.separately - bundle.price;
bundle.percent = Math.round((bundle.saving / bundle.separately) * 100);

const ticks = (features) =>
  `<ul class="tick-list">${features.map((f) => `<li>${icon("check")}<span>${f}</span></li>`).join("")}</ul>`;

const serviceCards = services
  .map(
    (service) => `<article class="price-card">
  <div class="price-head">
    <h3 class="price-name"><a href="${service.href}">${service.name}</a></h3>
    ${service.flag ? `<p class="price-flag">${service.flag}</p>` : ""}
  </div>
  <p class="price-amount">${service.from ? "<span>from</span>" : ""}<strong>${gbp(service.price)}</strong><span>${service.unit}</span></p>
  <p>${service.summary}</p>
  ${ticks(service.features)}
  <a class="btn small secondary" href="${CTA.href}">Choose this</a>
</article>`,
  )
  .join("\n");

const bundleCard = `<article class="price-card featured bundle" id="bundle">
  <div class="bundle-main">
    <div class="price-head">
      <h3 class="price-name">${bundle.name}</h3>
      <p class="price-flag">Best value &middot; Save ${bundle.percent}%</p>
    </div>
    <p>One setup. Everything connected. Ready to grow.</p>
    <p class="price-amount">
      <s class="price-was"><span class="visually-hidden">Bought separately: </span>${gbp(bundle.separately)}</s>
      <strong>${gbp(bundle.price)}</strong><span>one-off</span>
    </p>
    <p class="price-saving">You save ${gbp(bundle.saving)} compared with buying these services separately.</p>
    <a class="btn" href="${CTA.href}">Get the ${bundle.name}${icon("arrow-up")}</a>
  </div>
  <div class="bundle-receipt">
    <p class="bundle-label">What is included</p>
    <ul>${SYSTEM.components.map((c) => `<li>${icon("check")}<span>${c.name}</span><b>${gbp(c.price)}</b></li>`).join("")}</ul>
    <p class="bundle-sum"><span>Bought separately</span><b>${gbp(bundle.separately)}</b></p>
    <p class="bundle-sum is-package"><span>${bundle.name}</span><b>${gbp(bundle.price)}</b></p>
  </div>
</article>`;

// The hero's summary panel, read from the same figures as the cards below.
const fromPrice = Math.min(...services.filter((s) => s.unit === "one-off").map((s) => s.price));
const care = services.find((s) => s.href === "/website-care");
const glance = [
  { label: "Websites and one-off services", note: "Landing page, website or local SEO", from: true, price: gbp(fromPrice), unit: "one-off" },
  { label: bundle.name, note: `Everything connected · Save ${bundle.percent}%`, price: gbp(bundle.price), unit: "one-off", lead: true },
  { label: care.name, note: "Optional, month to month", from: true, price: gbp(care.price), unit: "/ month" },
];

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Pricing</p>
            <h1>Know what it costs before the work starts.</h1>
            <p class="lede">Every service below can be bought on its own. Start with the one that will make the biggest difference, and add the others only when they earn their place.</p>
            <p class="hero-support"><span>Price agreed in writing first</span><span>No hidden mark-ups</span><span>No long tie-ins</span></p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/contact">Talk to us</a>
            </div>
          </div>
          <aside class="price-glance reveal" aria-label="Prices at a glance">
            <p class="bundle-label">Prices at a glance</p>
            <ul>${glance
              .map(
                (row) =>
                  `<li${row.lead ? ' class="is-lead"' : ""}><span>${row.label}<small>${row.note}</small></span><b>${row.from ? "<small>from</small>" : ""}${row.price}<small>${row.unit}</small></b></li>`,
              )
              .join("")}</ul>
            <a class="text-link" href="#packages">See every price${icon("arrow-up")}</a>
          </aside>
          </div>
        </div>
      </section>

      <section class="section tight" id="packages">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">Services and prices</p>
            <h2>Buy one service, or get everything together and save.</h2>
            <p>Every service can be bought on its own. If you want the whole setup, the ${bundle.name} brings it together for ${gbp(bundle.price)}.</p>
          </div>
          <div class="services">
            <div class="reveal">
${bundleCard}
            </div>
            <p class="price-divider"><span>Or buy any service on its own</span></p>
            <div class="price-grid services-grid reveal">
${serviceCards}
            </div>
          </div>
          <p class="disclosure">All prices exclude VAT. Final scope and any third-party costs are confirmed in writing before work begins. Larger sites, ecommerce and unusual integrations get a written quote. This website does not take payments.</p>
        </div>
      </section>

      <section class="section tight">
        <div class="container">
          <div class="split-head">
            <div>
              <p class="eyebrow">Something different</p>
              <h2>Need a custom quote?</h2>
              <p>Ecommerce, memberships, directories, complex integrations and larger sites are scoped separately. You receive a written proposal with the work, the timeline and the price before you commit to anything.</p>
            </div>
            <a class="btn" href="/contact">Request a custom quote${icon("arrow-up")}</a>
          </div>
        </div>
      </section>

      <section class="plan-band" id="plan">
        <div class="container">
          <div class="plan-split">
${inquiryForm({
  heading: "Get my free website plan",
  intro: "It takes about a minute. We reply with the package that fits and any gaps worth fixing first.",
  submitLabel: CTA.primary,
  booking: false,
})}
            <div class="plan-copy">
              <p class="eyebrow">Free website plan</p>
              <h2>Know what your website needs before you spend money on it</h2>
              <p class="lede">Tell us about your business and what you want the website to achieve. We will reply with a practical starting point, the package that fits and any gaps worth fixing first.</p>
              <div class="cta-contacts">
                <a href="tel:${SITE.phone}">${icon("phone")}Call Veltra on ${SITE.phoneLabel}</a>
                <a href="mailto:${SITE.email}">${icon("mail")}${SITE.email}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

${faqSection(FAQS, { heading: "Pricing questions, answered plainly.", eyebrow: "Pricing FAQ" })}

${finalCta({
  heading: "Not sure which service you actually need?",
  body: "That is what the free audit is for. We look at your website and Google presence, then tell you which of these would make the biggest difference — including when the answer is none of them yet.",
})}`;

export default {
  path: "/pricing",
  title: "Pricing | Websites from £99, Services Sold Separately | Veltra Media",
  description:
    "Clear prices for web design, local SEO, landing pages, AI reception and booking automation in Middlesbrough and Teesside. Websites from £99. Every service can be bought on its own.",
  jsonLd: [
    organizationJsonLd(),
    faqJsonLd(FAQS),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
  ],
  body,
};
