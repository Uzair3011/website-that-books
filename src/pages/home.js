import { inquiryForm } from "../form.js";
import { marquee } from "../marquee.js";
import { REVIEWS } from "../reviews.js";
import { VISUALS } from "../visuals.js";
import {
  CTA,
  SERVICES as SERVICE_PAGES,
  SITE,
  faqJsonLd,
  faqSection,
  icon,
  organizationJsonLd,
  serviceJsonLd,
} from "../site.js";

const FAQS = [
  {
    q: "How long will the website take?",
    a: "<p>A simple landing page typically takes around seven working days after the content is approved. A multi-page site usually takes ten to fifteen working days, depending on the scope and how quickly feedback is supplied.</p>",
  },
  {
    q: "Do I have to pay for a monthly plan?",
    a: "<p>No. Ongoing care is optional. If you prefer to manage the website yourself, we will explain the handover. If you want us to handle hosting, updates and maintenance, we offer an optional <a href=\"/website-care\">website care plan</a>.</p>",
  },
  {
    q: "Will I own the website?",
    a: "<p>Yes. Once the agreed project fees are paid, the website and the original content created for it are yours, subject only to any third-party software licences explained in your proposal.</p>",
  },
  {
    q: "Can you improve my existing website?",
    a: "<p>Yes. We can review the current site and recommend whether a focused redesign, new landing pages or a full rebuild will give you the better return.</p>",
  },
  {
    q: "Will the website rank on Google?",
    a: "<p>No honest company can guarantee a ranking. We build the technical and on-page foundations correctly, connect the relevant Google tools and can set up local SEO and your Google Business Profile if you want to improve visibility.</p>",
  },
  {
    q: "Can we add AI or automation later?",
    a: "<p>Yes. AI reception, website chat, booking and follow-up can be added later. We will recommend them only when they solve a clear customer or operational problem.</p>",
  },
];

const OUTCOMES = [
  {
    icon: "shield",
    title: "Look credible",
    image: "outcome-credible",
    text: "A polished, modern website that reflects the quality of the business behind it.",
  },
  {
    icon: "pin",
    title: "Get found locally",
    image: "outcome-local",
    text: "A search-friendly structure that helps Google understand what you offer and where you offer it.",
  },
  {
    icon: "phone",
    title: "Make it easy to enquire",
    image: "outcome-enquire",
    text: "Clear calls to action, useful forms and booking paths that remove unnecessary friction.",
  },
];

const SERVICES = [
  {
    icon: "layout",
    title: "Website design",
    image: "service-web-design",
    text: "Fast, mobile-first websites built around your offer, your customers and the action you want them to take.",
    href: "/web-design-middlesbrough",
    cta: "Explore website design",
  },
  {
    icon: "search",
    title: "Local SEO and Google Business",
    image: "service-local-seo",
    text: "Improve the signals that help nearby customers find and trust you in Google Search and Maps.",
    href: "/local-seo-middlesbrough",
    cta: "Explore local SEO",
  },
  {
    icon: "target",
    title: "Landing pages",
    image: "service-landing-pages",
    text: "Focused pages for one service, location or campaign, written and designed to turn attention into action.",
    href: "/landing-page-design",
    cta: "Explore landing pages",
  },
  {
    icon: "chat",
    title: "AI receptionist and website chat",
    image: "service-ai-reception",
    text: "Answer common questions, capture enquiry details and respond after hours without making the customer learn new technology.",
    href: "/ai-automation-middlesbrough",
    cta: "Explore AI reception",
  },
  {
    icon: "flow",
    title: "Booking and follow-up automation",
    image: "service-booking",
    text: "Connect forms, calendars and reminders so fewer good enquiries disappear between first contact and booked work.",
    href: "/crm-booking-automation",
    cta: "Explore automation",
  },
  {
    icon: "tool",
    title: "Website care",
    image: "service-website-care",
    text: "Hosting, updates, backups and practical support for businesses that would rather not manage the technical side.",
    href: "/website-care",
    cta: "Explore website care",
  },
];

const STANDARDS = [
  "A clear recommendation instead of a menu of things you do not need",
  "A written scope and price before work begins",
  "Copy, design and local search considered together",
  "Direct feedback and visible progress during the build",
  "A website you own, with support available rather than forced",
];

const HIGHLIGHTS = [
  "Fixed price agreed upfront",
  "Custom quotes available",
  "No forced bundle",
  "Clear written scope",
  "Mobile-first build",
  "You own your website",
  "Optional ongoing support",
];

const EXPLORE = [
  {
    href: "/work",
    icon: "layout",
    label: "Our work",
    image: "explore-work",
    text: "What we build, clearly labelled, including a live booking system you can try for yourself.",
    cta: "See the work",
  },
  {
    href: "/how-it-works",
    icon: "flow",
    label: "How it works",
    image: "explore-process",
    text: "Four steps from the first conversation to a live website, with a written scope before anything starts.",
    cta: "See the process",
  },
  {
    href: "/about",
    icon: "shield",
    label: "About Veltra",
    image: "explore-about",
    text: "A local studio that sells one service at a time, writes the scope down and never invents results.",
    cta: "Meet Veltra",
  },
];

const tick = (text) => `<li>${icon("check")}<span>${text}</span></li>`;

// Each card opens with an on-brand illustration from src/visuals.js.
const cardMedia = (name) => `<figure class="card-media">${VISUALS[name]}</figure>`;

const outcomes = OUTCOMES.map(
  (item) => `<article class="card has-media">
  ${cardMedia(item.image)}
  <div class="card-body">
    <span class="card-icon" aria-hidden="true">${icon(item.icon)}</span>
    <h3>${item.title}</h3>
    <p>${item.text}</p>
  </div>
</article>`,
).join("\n");

const TONES = ["tone-teal", "tone-lime"];
const services = SERVICES.map(
  (service, index) => `<article class="service-card has-media ${TONES[index] || ""}">
  ${cardMedia(service.image)}
  <div class="card-body">
    <span class="service-badge" aria-hidden="true">${icon(service.icon)}</span>
    <h3>${service.title}</h3>
    <p>${service.text}</p>
    <a class="text-link" href="${service.href}">${service.cta}${icon("arrow-up")}</a>
  </div>
</article>`,
).join("\n");

const initials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Hidden until src/reviews.js holds at least one real review.
export const reviewsSection = (reviews) =>
  reviews.length
    ? `
      <section class="section" id="reviews">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Reviews</p>
              <h2>What our clients say</h2>
            </div>
            <p>Real reviews from real clients, in their own words.</p>
          </div>
          <div class="review-grid reveal">
${reviews
  .map(
    (review) => `            <figure class="review-card">
              <p class="review-stars" role="img" aria-label="Rated ${review.rating} out of 5">${[1, 2, 3, 4, 5].map((n) => `<svg viewBox="0 0 24 24" aria-hidden="true"${n > review.rating ? ' class="off"' : ""}><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9Z"/></svg>`).join("")}</p>
              <blockquote><p>${review.text}</p></blockquote>
              <figcaption>
                <span class="review-avatar" aria-hidden="true">${initials(review.name)}</span>
                <span><b>${review.name}</b><span>${review.business}${review.service ? ` &middot; ${review.service}` : ""}</span></span>
              </figcaption>
            </figure>`,
  )
  .join("\n")}
          </div>
        </div>
      </section>
`
    : "";

const body = `      <section class="hero hero-feature">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">Web design in Middlesbrough and Teesside</p>
              <h1>Premium websites. Clear prices. Built to win more enquiries.</h1>
              <p class="lede">Veltra creates conversion-focused websites for businesses in Middlesbrough and across Teesside. Start with the website you need today, then add local SEO, landing pages, booking and AI automation when they make sense for your business.</p>
              <div class="button-row">
                <a class="btn" href="#plan">${CTA.primary}${icon("arrow-up")}</a>
                <a class="btn secondary" href="/services">${CTA.secondary}</a>
              </div>
            </div>
            <div class="hero-media">
              <img
                src="/assets/work/hero-poster.png"
                width="1200"
                height="880"
                alt="A local electrical contractor's website built by Veltra, shown on a laptop and a phone."
              />
              <span class="hero-tag t1">Clear calls to action</span>
              <span class="hero-tag t2">Local SEO foundations</span>
              <span class="hero-tag t3">Fast on mobile</span>
            </div>
          </div>
        </div>
      </section>

${marquee(
  HIGHLIGHTS.map((text) => `${icon("check")}${text}`),
  { label: "Veltra at a glance", duration: "54s", tone: "light" },
)}

      <section class="section" id="outcomes">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Problem and promise</p>
              <h2>Your website should make choosing your business easier</h2>
            </div>
            <p>Too many local websites leave people with the same questions. What exactly do you do? Can I trust you? Do you work in my area? What should I do next? When those answers are hard to find, the visitor does not keep searching your site. They go back to Google and choose someone clearer.</p>
          </div>
          <p class="section-lead">We organise the message, design and enquiry path around three practical outcomes.</p>
          <div class="card-grid cols-3 reveal">
${outcomes}
          </div>
        </div>
      </section>

      <section class="section band-light" id="services">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Services</p>
              <h2>Start with what will make the biggest difference</h2>
            </div>
            <p>You do not need every service on day one. Each Veltra service works on its own and can connect with the others as your business grows.</p>
          </div>
          <div class="service-grid reveal">
${services}
          </div>
          <div class="section-action">
            <a class="btn secondary" href="/services">See all services and how they fit together${icon("arrow-up")}</a>
          </div>
        </div>
      </section>

${marquee(
  SERVICE_PAGES.map((service) => service.name),
  { label: "Veltra services", duration: "48s" },
)}

      <section class="section" id="why-veltra">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Why Veltra</p>
              <h2>More considered than a bargain build. Less bloated than a traditional agency project.</h2>
            </div>
            <p>A low price is not useful if the site looks generic, says very little and needs rebuilding six months later. A large agency process is not useful if a straightforward local business site becomes slow, expensive and hard to understand. Veltra keeps the work that matters and removes the unnecessary overhead.</p>
          </div>
          <div class="compare reveal">
            <div class="compare-col">
              <p class="kicker">A bargain build</p>
              <ul>
                <li>${icon("x")}Looks generic</li>
                <li>${icon("x")}Says very little</li>
                <li>${icon("x")}Needs rebuilding six months later</li>
              </ul>
            </div>
            <div class="compare-col us">
              <p class="kicker">Veltra</p>
              <h3>Five standards on every project</h3>
              <ul>${STANDARDS.map(tick).join("")}</ul>
            </div>
            <div class="compare-col">
              <p class="kicker">A traditional agency project</p>
              <ul>
                <li>${icon("x")}Slow</li>
                <li>${icon("x")}Expensive</li>
                <li>${icon("x")}Hard to understand</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

${reviewsSection(REVIEWS)}
      <section class="section band-light" id="explore">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Take a closer look</p>
              <h2>See the work, the process and the people behind it</h2>
            </div>
          </div>
          <ul class="related explore reveal">
${EXPLORE.map(
  (item) => `            <li><a href="${item.href}">${cardMedia(item.image)}<span class="card-body"><span class="card-icon" aria-hidden="true">${icon(item.icon)}</span><b>${item.label}</b><p>${item.text}</p><span class="text-link">${item.cta}${icon("arrow-up")}</span></span></a></li>`,
).join("\n")}
          </ul>
        </div>
      </section>

      <section class="section" id="local">
        <div class="container">
          <div class="local-grid">
            <div class="local-copy">
              <p class="eyebrow">Local relevance</p>
              <h2>Built for businesses in Middlesbrough and across Teesside</h2>
              <p>Local customers make quick comparisons. They look at your website, Google profile, reviews and response time before they decide who to contact. Veltra helps those parts work together, so your business looks consistent and makes the next step obvious.</p>
              <p>We work with service businesses across Middlesbrough, Stockton-on-Tees, Redcar, Billingham, Hartlepool and the wider Tees Valley. Meetings can be handled locally or online.</p>
              <div class="local-group">
                <p class="local-label">Areas we cover</p>
                <ul class="area-list">${SITE.areas.map((area) => `<li>${area}</li>`).join("")}</ul>
              </div>
            </div>
            <div class="local-side">
              <figure class="local-map reveal">
                <img src="/assets/work/teesside-map.svg" width="1000" height="720" loading="lazy" alt="A simplified map of the Tees Valley showing Middlesbrough, Stockton-on-Tees, Billingham, Redcar and Hartlepool." />
              </figure>
              <div class="local-group">
                <p class="local-label">Popular pages</p>
                <div class="link-row">
                  <a class="text-link" href="/web-design-middlesbrough">Web design Middlesbrough${icon("arrow-up")}</a>
                  <a class="text-link" href="/local-seo-middlesbrough">Local SEO Middlesbrough${icon("arrow-up")}</a>
                  <a class="text-link" href="/web-design-teesside">Web design Teesside${icon("arrow-up")}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

${marquee(SITE.areas, { label: "Areas we cover", duration: "30s" })}

${faqSection(FAQS, { heading: "Straight answers before you start", eyebrow: "Frequently asked questions" })}

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
      </section>`;

export default {
  path: "/",
  title: "Web Design Middlesbrough & Teesside | Websites That Win Enquiries | Veltra Media",
  description:
    "Premium conversion-focused websites for Middlesbrough and Teesside businesses, with local SEO foundations, a written scope before work starts, and booking and AI automation when you need them.",
  jsonLd: [
    organizationJsonLd(),
    serviceJsonLd({
      name: "Website design",
      description:
        "Conversion-focused websites with local search foundations for Middlesbrough and Teesside businesses, each with a fixed written scope before work begins.",
      path: "/",
    }),
    faqJsonLd(FAQS),
  ],
  body,
};
