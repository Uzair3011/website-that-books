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
    a: "<p>No. Every service on this page can be bought on its own. The packages exist because a website is the most common starting point and people want to know what it costs before they get in touch — not because we think everyone should buy all of it.</p>",
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

export const packages = [
  {
    name: "Simple Landing Page",
    price: "£99",
    unit: "one-off",
    summary:
      "A sharp one-page website for a new business or a simple offer that needs to look established quickly.",
    features: [
      "One scrolling page with up to six sections",
      "Custom mobile-first layout",
      "Message and copy refinement",
      "Contact form and click-to-call actions",
      "Basic on-page SEO setup",
      "Analytics and Search Console setup",
      "One revision round",
      "Typically live in seven working days after content approval",
    ],
    cta: "Choose Landing Page",
  },
  {
    name: "Multi-Page Website",
    price: "£179",
    unit: "one-off",
    flag: "Most popular",
    featured: true,
    summary:
      "A complete small-business website built to explain your services, strengthen trust and generate enquiries.",
    features: [
      "Up to five core pages",
      "Conversion-focused page structure and copy",
      "Mobile-first custom design",
      "Local keyword and page mapping",
      "Local business and service schema",
      "Google Business Profile alignment",
      "Analytics and enquiry tracking",
      "Two revision rounds",
      "Typically live in ten to fifteen working days after content approval",
    ],
    cta: "Choose Multi-Page",
  },
  {
    name: "Growth",
    price: "£1,495",
    unit: "one-off",
    summary:
      "For an established business that needs more service depth, stronger local coverage and a better enquiry system.",
    features: [
      "Up to ten pages",
      "Everything in Multi-Page Website",
      "Service and location page structure",
      "Advanced enquiry or quote form",
      "Booking or CRM integration",
      "Review request flow setup",
      "Conversion event tracking",
      "Thirty days of post-launch support",
      "Typically live in fifteen to twenty working days after content approval",
    ],
    cta: "Choose Growth",
  },
];

const individual = [
  [
    "Simple landing page",
    "A single focused page for one offer, including copy, design, build and conversion tracking.",
    "£99 one-off",
    "/landing-page-design",
  ],
  [
    "Multi-page website",
    "Up to five core pages, built to explain your services and generate enquiries. Larger sites on the Growth package or a written quote.",
    "£179 one-off",
    "/web-design-middlesbrough",
  ],
  [
    "Local SEO + Google Business Profile",
    "Profile setup and optimisation, service and area page structure, local schema, technical and indexation setup.",
    "£99 one-off",
    "/local-seo-middlesbrough",
  ],
  [
    "AI receptionist + website chat",
    "Approved answer set, handover rules, enquiry capture and after-hours coverage, on the phone and on your site. Provider usage billed at cost.",
    "£199 setup",
    "/ai-automation-middlesbrough",
  ],
  [
    "CRM + booking follow-up automation",
    "Enquiry capture, live calendar booking, confirmations, reminders and consent-based follow-up.",
    "£199 setup",
    "/crm-booking-automation",
  ],
  [
    "Website care",
    "Hosting, updates, backups, monitoring and practical support. Always optional.",
    "from £49 / month",
    "/website-care",
  ],
];

const cards = packages
  .map(
    (pkg) => `<article class="price-card${pkg.featured ? " featured" : ""}">
  <div class="price-head">
    <p class="price-name">${pkg.name}</p>
    ${pkg.flag ? `<p class="price-flag">${pkg.flag}</p>` : ""}
  </div>
  <p class="price-amount"><strong>${pkg.price}</strong><span>${pkg.unit}</span></p>
  <p>${pkg.summary}</p>
  <ul class="tick-list">${pkg.features.map((f) => `<li>${icon("check")}<span>${f}</span></li>`).join("")}</ul>
  <a class="btn${pkg.featured ? "" : " secondary"}" href="${CTA.href}">${pkg.cta}</a>
</article>`,
  )
  .join("\n");

const rows = individual
  .map(
    ([name, text, price, href]) =>
      `<tr><th scope="row"><a href="${href}">${name}</a></th><td><p>${text}</p></td><td>${price}</td></tr>`,
  )
  .join("");

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 46rem">
            <p class="eyebrow">Pricing</p>
            <h1>Know what it costs before the work starts.</h1>
            <p class="lede">Every service below can be bought on its own. Start with the one that will make the biggest difference, and add the others only when they earn their place.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/contact">Talk to us</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section tight" id="packages">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">Website packages</p>
            <h2>Three ways to start a website.</h2>
            <p>Choose a package when the scope is straightforward. If your site needs ecommerce, member areas, unusual integrations or a larger content structure, you get a custom written quote instead.</p>
          </div>
          <div class="price-grid reveal">
${cards}
          </div>
          <p class="disclosure">All prices exclude VAT. Final scope and any third-party costs are confirmed in writing before work begins. This website does not take payments.</p>
        </div>
      </section>

      <section class="section band-light" id="individual">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">Individual services</p>
            <h2>Buy one service. Not a bundle you did not ask for.</h2>
          </div>
          <table class="price-table reveal">
            <caption>Prices exclude VAT. Website care is month to month with no long tie-in.</caption>
            <thead>
              <tr><th scope="col">Service</th><th scope="col">What it covers</th><th scope="col">Price</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>

      <section class="section band-dark" id="bundle">
        <div class="container">
          <div class="two-col">
            <div class="section-head" style="margin-bottom: 0">
              <p class="eyebrow">Optional package</p>
              <h2>One setup. Everything connected. Ready to grow.</h2>
              <p class="lede">Get everything you need to launch a stronger online presence and start capturing more leads, delivered as one project instead of four.</p>
            </div>
            <article class="price-card featured">
              <p class="price-name">Growth Launch Package</p>
              <p class="price-amount"><strong>£499</strong><span>one-off</span></p>
              <p>Everything below, scoped and delivered together.</p>
              <ul class="tick-list">
                <li>${icon("check")}<span>Multi-page professional website</span></li>
                <li>${icon("check")}<span>Local SEO setup</span></li>
                <li>${icon("check")}<span>Google Business Profile optimisation</span></li>
                <li>${icon("check")}<span>AI receptionist</span></li>
                <li>${icon("check")}<span>Website AI chat</span></li>
                <li>${icon("check")}<span>CRM setup</span></li>
                <li>${icon("check")}<span>Booking and follow-up automation</span></li>
              </ul>
              <a class="btn" href="${CTA.href}">Discuss the Growth Launch Package</a>
            </article>
          </div>
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
