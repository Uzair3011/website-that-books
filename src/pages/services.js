import {
  CTA,
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  finalCta,
  icon,
  organizationJsonLd,
} from "../site.js";

// Each service in more depth than the homepage cards: what it covers, who it
// suits, and where its own page is. Included items mirror those service pages.
const SERVICES = [
  {
    icon: "layout",
    name: "Website design",
    href: "/web-design-middlesbrough",
    cta: "Explore website design",
    text: "Fast, mobile-first websites built around your offer, your customers and the action you want them to take. Copy, design and local search are planned together, so the site looks right and gets enquiries.",
    included: [
      "Message and page mapping",
      "Custom mobile-first design",
      "Conversion-focused copy",
      "Local search foundations",
      "Analytics and enquiry tracking",
    ],
    fit: "New businesses, and sites that look dated or rarely produce an enquiry.",
  },
  {
    icon: "search",
    name: "Local SEO + Google Business Profile",
    href: "/local-seo-middlesbrough",
    cta: "Explore local SEO",
    text: "Improve the signals that help nearby customers find and trust you in Google Search and Maps, starting with an accurate, complete business profile and service pages that match what people search for.",
    included: [
      "Google Business Profile setup and optimisation",
      "Consistent business details everywhere",
      "Service and area page structure",
      "Technical and on-page foundations",
      "Review flow and reporting",
    ],
    fit: "Businesses that are hard to find when people search nearby.",
    extra: { href: "/google-business-profile", label: "Google Business Profile setup on its own" },
  },
  {
    icon: "target",
    name: "Landing pages + CRO",
    href: "/landing-page-design",
    cta: "Explore landing pages",
    text: "Focused pages for one service, location or campaign. One offer, one audience and one action, with the real objections answered in order and the form where people decide.",
    included: [
      "Offer and audience definition",
      "Message and objection mapping",
      "Focused page design and copy",
      "Tracking and conversion events",
    ],
    fit: "Paid campaigns and single high-value services.",
  },
  {
    icon: "chat",
    name: "AI receptionist + website chat",
    href: "/ai-automation-middlesbrough",
    cta: "Explore AI reception",
    text: "Answer common questions, capture enquiry details and respond after hours, working only from answers you have approved and handing over to a person whenever a question needs judgement.",
    included: [
      "Approved answer set",
      "Clear handover rules",
      "Enquiry capture",
      "Website chat widget",
      "After-hours coverage",
    ],
    fit: "Businesses that miss calls or answer the same questions every day.",
  },
  {
    icon: "flow",
    name: "CRM, booking + follow-up automation",
    href: "/crm-booking-automation",
    cta: "Explore automation",
    text: "Connect forms, calendars and reminders so fewer good enquiries disappear between first contact and booked work, and every enquiry lands in one place.",
    included: [
      "Enquiry capture into one place",
      "Live calendar booking",
      "Confirmation and reminders",
      "Consent-based follow-up",
      "Review requests",
    ],
    fit: "Businesses that lose enquiries between first contact and booked work.",
  },
  {
    icon: "tool",
    name: "Website care",
    href: "/website-care",
    cta: "Explore website care",
    text: "Hosting, updates, backups, monitoring and practical support, month to month, for owners who would rather not manage the technical side. Always optional.",
    included: ["Hosting", "Updates", "Backups", "Monitoring", "Practical support"],
    fit: "Owners who want a competent person keeping an eye on the site.",
  },
];

const FAQS = [
  {
    q: "Do I have to buy more than one service?",
    a: "<p>No. Every service works on its own and is priced on its own. Many clients start with one, usually the website or their Google Business Profile, and add another only when it would clearly help.</p>",
  },
  {
    q: "Which service should I start with?",
    a: "<p>The one closest to where enquiries are being lost. If people cannot find you, start with local search. If they find you but do not get in touch, start with the website or a landing page. If they get in touch but do not book, start with follow-up. The <a href=\"/free-website-audit\">free website plan</a> tells you which.</p>",
  },
  {
    q: "Can you work with the website I already have?",
    a: "<p>Often, yes. Local SEO, AI reception, booking automation and landing pages can all sit alongside an existing site. We will tell you honestly if the current site is the thing holding the rest back.</p>",
  },
  {
    q: "Do you only work with businesses in Teesside?",
    a: "<p>Teesside comes first: Middlesbrough, Stockton-on-Tees, Redcar, Billingham, Hartlepool and the wider Tees Valley. We also work remotely with businesses elsewhere in the UK.</p>",
  },
];

const detail = (service) => `<article class="service-row">
  <div class="service-row-head">
    <span class="service-badge" aria-hidden="true">${icon(service.icon)}</span>
    <h3>${service.name}</h3>
  </div>
  <div class="service-row-body">
    <p>${service.text}</p>
    <ul class="tick-list">${service.included.map((item) => `<li>${icon("check")}<span>${item}</span></li>`).join("")}</ul>
    <p class="service-row-fit"><b>Best for</b>${service.fit}</p>
    <div class="link-row">
      <a class="text-link" href="${service.href}">${service.cta}${icon("arrow-up")}</a>
      ${service.extra ? `<a class="text-link" href="${service.extra.href}">${service.extra.label}${icon("arrow-up")}</a>` : ""}
    </div>
  </div>
</article>`;

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 46rem">
            <p class="eyebrow">Services</p>
            <h1>Everything that turns a local search into a booked enquiry.</h1>
            <p class="lede">Six services that each fix one part of the journey, from being found to following up. Buy the one you need now and add the others only when they earn their place.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/pricing">See pricing</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section tight flush-top">
        <div class="container">
          <div class="service-rows reveal">
${SERVICES.map(detail).join("\n")}
          </div>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">How they fit together</p>
            <h2>Four stages. Each service fixes one of them.</h2>
            <p class="lede">Most lost enquiries leak out at a single stage. Find that stage and you know which service to start with.</p>
          </div>
          <ul class="chain reveal">
            <li><b>Get found</b><h3>Local SEO + Google Business Profile</h3><p>Show up when nearby customers search for what you do, with details they can trust.</p></li>
            <li><b>Build trust</b><h3>Website design + landing pages</h3><p>Make the offer, the areas covered and the next step obvious on any screen.</p></li>
            <li><b>Respond fast</b><h3>AI receptionist + website chat</h3><p>Answer the common questions and capture the enquiry, even after hours.</p></li>
            <li><b>Follow up</b><h3>CRM, booking + follow-up</h3><p>Turn the conversation into a booking, with confirmations and reminders that go out on their own.</p></li>
          </ul>
        </div>
      </section>

      <section class="section tight">
        <div class="container">
          <div class="split-head">
            <div>
              <p class="eyebrow">Specialist system</p>
              <h2>Run a med spa or aesthetic clinic?</h2>
              <p>The med-spa growth system puts the website, the AI receptionist and live booking together for clinics, and you can try the booking flow on this site.</p>
            </div>
            <a class="btn secondary" href="/med-spa-growth-system">See the med-spa system${icon("arrow-up")}</a>
          </div>
        </div>
      </section>

${faqSection(FAQS, { heading: "Choosing the right service", eyebrow: "Services FAQ" })}

${finalCta({
  heading: "Not sure which service you need?",
  body: "Tell us about the business and what is not working. We will reply with the one change that would make the biggest difference, even when that is not something we sell.",
  secondary: { href: "/how-it-works", label: "See how it works" },
})}`;

export default {
  path: "/services",
  title: "Services | Web Design, Local SEO & Automation | Veltra Media",
  description:
    "Website design, local SEO, landing pages, AI reception, booking automation and website care for Middlesbrough and Teesside businesses. Every service can be bought on its own.",
  jsonLd: [
    organizationJsonLd(),
    faqJsonLd(FAQS),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
  ],
  body,
};
