import { servicesVisual } from "../hero-visuals.js";
import {
  CTA,
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  finalCta,
  icon,
  related,
} from "../site.js";
import { servicesShowcase } from "../services-showcase.js";

// Each service in more depth than the homepage cards: what it covers, who it
// suits, and where its own page is. Included items mirror those service pages.
// They open inside the same showcase as the homepage, matched by href.
const SERVICES = [
  {
    name: "Website design",
    href: "/web-design-middlesbrough",
    cta: "Explore website design",
    text: "<strong>Turn visits into enquiries.</strong> A fast, mobile-first website built around your offer, your customers and the action you want them to take. Copy, design and local search are planned together, so the site looks right and gets enquiries.",
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
    name: "Local SEO + Google Business Profile",
    href: "/local-seo-middlesbrough",
    cta: "Explore local SEO",
    text: "<strong>Be found when locals search.</strong> We improve the signals that help nearby customers find and trust you in Google Search and Maps, starting with an accurate, complete business profile and service pages that match what people search for.",
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
    name: "Landing pages + CRO",
    href: "/landing-page-design",
    cta: "Explore landing pages",
    text: "<strong>Make each campaign click count.</strong> A focused page for one service, location or campaign. One offer, one audience and one action, with the real objections answered in order and the form where people decide.",
    included: [
      "Offer and audience definition",
      "Message and objection mapping",
      "Focused page design and copy",
      "Tracking and conversion events",
    ],
    fit: "Paid campaigns and single high-value services.",
  },
  {
    name: "AI receptionist + website chat",
    href: "/ai-receptionist-middlesbrough",
    cta: "Explore AI reception",
    text: "<strong>Answer enquiries at 11pm.</strong> Our AI receptionist answers questions and books appointments around the clock, using answers you have approved. When a customer lands on your site after hours, they get an answer straight away instead of waiting until morning.",
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
    name: "CRM, booking + follow-up automation",
    href: "/crm-booking-automation",
    cta: "Explore automation",
    text: "<strong>Stop chasing leads.</strong> Every enquiry lands in one place, booking and reminders run themselves, and follow-up goes out on time, so good leads do not slip away.",
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
    name: "Website care",
    href: "/website-care",
    cta: "Explore website care",
    text: "<strong>Your website, looked after.</strong> Hosting, updates, backups, monitoring and practical support, month to month, so you can get on with running the business. Always optional.",
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

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Services</p>
            <h1>Web design, SEO and AI services that win Teesside enquiries</h1>
            <p class="lede"><strong>Everything that turns a local search into a booked enquiry.</strong> Six services that each fix one part of the journey, from being found to following up. Buy the one you need now and add the others only when they earn their place.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/pricing">See pricing</a>
            </div>
          </div>
          ${servicesVisual}
          </div>
        </div>
      </section>

      <section class="section tight flush-top svc" aria-labelledby="services-list">
        <div class="container">
          <h2 class="visually-hidden" id="services-list">Our services</h2>
${servicesShowcase(Object.fromEntries(SERVICES.map((service) => [service.href, service])))}
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

${related(
  [
    {
      href: "/web-design-for-trades-teesside",
      label: "Websites for trades",
      text: "What an electrician’s, plumber’s or roofer’s website must show: areas, tap-to-call, real photos and a quote form.",
    },
    {
      href: "/ai-agents-teesside",
      label: "AI agents, explained",
      text: "What AI can do for a local business, where a person should take over, and the UK GDPR basics.",
    },
    {
      href: "/areas",
      label: "Areas we cover",
      text: "Middlesbrough, Stockton-on-Tees and Billingham, Redcar, Hartlepool and the wider Tees Valley.",
    },
  ],
  "Trades, AI and the areas we cover",
)}

${faqSection(FAQS, { heading: "Choosing the right service", eyebrow: "Services FAQ" })}

${finalCta({
  heading: "Not sure which service you need?",
  body: "Tell us about the business and what is not working. We will reply with the one change that would make the biggest difference, even when that is not something we sell.",
  secondary: { href: "/how-it-works", label: "See how it works" },
})}`;

export default {
  path: "/services",
  title: "Services: Web Design, Local SEO & AI | Veltra Media",
  description:
    "Web design, local SEO, landing pages, AI receptionist, booking automation and website care for Teesside businesses. Each is priced and sold on its own.",
  jsonLd: [
    faqJsonLd(FAQS),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]),
  ],
  body,
};
