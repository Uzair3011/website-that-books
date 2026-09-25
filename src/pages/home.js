import { inquiryForm } from "../form.js";
import { marquee } from "../marquee.js";
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
import { packages } from "./pricing.js";

const FAQS = [
  {
    q: "How much does a Veltra website cost?",
    a: "<p>Website packages start at £495 for a focused one-page site. Our five-page Business package is £895 and our larger Growth package is £1,495. Larger or more complex projects receive a fixed custom quote. <a href=\"/pricing\">See the full price list.</a></p>",
  },
  {
    q: "How long will the website take?",
    a: "<p>A Launch site typically takes around seven working days after the content is approved. Business and Growth sites usually take ten to twenty working days, depending on the scope and how quickly feedback is supplied.</p>",
  },
  {
    q: "Do I have to pay for a monthly plan?",
    a: "<p>No. Ongoing care is optional. If you prefer to manage the website yourself, we will explain the handover. If you want us to handle hosting, updates and maintenance, care plans start at £49 a month.</p>",
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
    a: "<p>No honest company can guarantee a ranking. We build the technical and on-page foundations correctly, connect the relevant Google tools and can provide ongoing local SEO if you want to improve visibility over time.</p>",
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
    text: "A polished, modern website that reflects the quality of the business behind it.",
  },
  {
    icon: "pin",
    title: "Get found locally",
    text: "A search-friendly structure that helps Google understand what you offer and where you offer it.",
  },
  {
    icon: "phone",
    title: "Make it easy to enquire",
    text: "Clear calls to action, useful forms and booking paths that remove unnecessary friction.",
  },
];

const SERVICES = [
  {
    icon: "layout",
    title: "Website design",
    text: "Fast, mobile-first websites built around your offer, your customers and the action you want them to take.",
    href: "/web-design-middlesbrough",
    cta: "Explore website design",
  },
  {
    icon: "search",
    title: "Local SEO and Google Business",
    text: "Improve the signals that help nearby customers find and trust you in Google Search and Maps.",
    href: "/local-seo-middlesbrough",
    cta: "Explore local SEO",
  },
  {
    icon: "target",
    title: "Landing pages",
    text: "Focused pages for one service, location or campaign, written and designed to turn attention into action.",
    href: "/landing-page-design",
    cta: "Explore landing pages",
  },
  {
    icon: "chat",
    title: "AI receptionist and website chat",
    text: "Answer common questions, capture enquiry details and respond after hours without making the customer learn new technology.",
    href: "/ai-automation-middlesbrough",
    cta: "Explore AI reception",
  },
  {
    icon: "flow",
    title: "Booking and follow-up automation",
    text: "Connect forms, calendars and reminders so fewer good enquiries disappear between first contact and booked work.",
    href: "/crm-booking-automation",
    cta: "Explore automation",
  },
  {
    icon: "tool",
    title: "Website care",
    text: "Hosting, updates, backups and practical support for businesses that would rather not manage the technical side.",
    href: "/website-care",
    cta: "Explore website care",
  },
];

const WORK = [
  {
    src: "/assets/work/example-clinic.svg",
    alt: "A clinic website design with a treatment list and a live booking panel showing selectable dates and times.",
    tags: ["Website design", "Booking automation", "AI reception"],
    title: "Med-spa growth system",
    problem: "Clinic enquiries arrive out of hours, and booking means a phone call.",
    built:
      "A clinic website wired to live Google Calendar availability, with confirmation emails and an AI receptionist.",
    result: "Live: you can use the booking flow on this site.",
    href: "/med-spa-growth-system",
    cta: "View project",
  },
  {
    src: "/assets/work/example-trades.svg",
    alt: "Design example: a home-services website with a dark hero, prominent phone number, covered-areas list and a quote request form.",
    tags: ["Website design", "Local SEO"],
    title: "Home services website",
    problem: "Trades win work by phone, but many sites bury the number and the areas covered.",
    built:
      "A phone-first layout, service areas stated plainly and a quote form where the decision is made.",
    result: "Design example, not a client project. No results claimed.",
    href: "/work",
    cta: "View work",
  },
  {
    src: "/assets/work/example-landing.svg",
    alt: "Design example: a single-offer landing page with one headline, three proof points and a short form above the fold.",
    tags: ["Landing pages", "CRO"],
    title: "Single-offer landing page",
    problem: "Campaign traffic leaves when it has to hunt for the form.",
    built:
      "One offer, one audience and one action, with no site navigation and the form above the fold.",
    result: "Design example, not a client project. No results claimed.",
    href: "/work",
    cta: "View work",
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
  "Website packages from £495",
  "Custom quotes available",
  "No forced bundle",
  "Clear written scope",
  "Mobile-first build",
  "You own your website",
  "Optional ongoing support",
];

const PROCESS = [
  [
    "Choose the right starting point",
    "Tell us what the business does, what is not working and what you want the website to achieve. We will recommend a package or custom scope.",
  ],
  [
    "Agree the message and structure",
    "We map the pages, offers, calls to action and local search priorities before design begins.",
  ],
  [
    "Review the working site",
    "You receive a private preview, give focused feedback and see the site take shape on desktop and mobile.",
  ],
  [
    "Launch with the essentials connected",
    "We complete final checks, connect analytics and search tools, then hand over a site that is ready to use.",
  ],
];

const tick = (text) => `<li>${icon("check")}<span>${text}</span></li>`;

const outcomes = OUTCOMES.map(
  (item) => `<article class="card">
  <span class="card-icon" aria-hidden="true">${icon(item.icon)}</span>
  <h3>${item.title}</h3>
  <p>${item.text}</p>
</article>`,
).join("\n");

const TONES = ["tone-teal", "tone-lime"];
const services = SERVICES.map(
  (service, index) => `<article class="service-card ${TONES[index] || ""}">
  <span class="service-badge" aria-hidden="true">${icon(service.icon)}</span>
  <h3>${service.title}</h3>
  <p>${service.text}</p>
  <a class="text-link" href="${service.href}">${service.cta}${icon("arrow-up")}</a>
</article>`,
).join("\n");

const packageCards = packages
  .map(
    (pkg) => `<article class="price-card${pkg.featured ? " featured" : ""}">
  <div class="price-head">
    <p class="price-name">${pkg.name}</p>
    ${pkg.flag ? `<p class="price-flag">${pkg.flag}</p>` : ""}
  </div>
  <p class="price-amount"><strong>${pkg.price}</strong><span>${pkg.unit}</span></p>
  <p>${pkg.summary}</p>
  <ul class="tick-list">${pkg.features.map(tick).join("")}</ul>
  <a class="btn${pkg.featured ? "" : " secondary"}" href="#plan">${pkg.cta}</a>
</article>`,
  )
  .join("\n");

const workCards = WORK.map(
  (item) => `<article class="work-item">
  <figure class="work-figure"><img src="${item.src}" width="1280" height="900" loading="lazy" alt="${item.alt}" /></figure>
  <ul class="work-tags">${item.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
  <h3>${item.title}</h3>
  <ul class="work-facts">
    <li><b>The problem</b><span>${item.problem}</span></li>
    <li><b>What Veltra built</b><span>${item.built}</span></li>
    <li><b>Result</b><span>${item.result}</span></li>
  </ul>
  <a class="text-link" href="${item.href}">${item.cta}${icon("arrow-up")}</a>
</article>`,
).join("\n");

const processSteps = PROCESS.map(
  ([title, text]) => `<li>
  <h3>${title}</h3>
  <p>${text}</p>
</li>`,
).join("\n");

const body = `      <section class="hero hero-feature">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">Web design in Middlesbrough and Teesside</p>
              <h1>Premium websites. Clear prices. Built to win more enquiries.</h1>
              <p class="lede">Veltra creates conversion-focused websites for businesses in Middlesbrough and across Teesside. Start with the website you need today, then add local SEO, landing pages, booking and AI automation when they make sense for your business.</p>
              <div class="button-row">
                <a class="btn" href="#plan">${CTA.primary}${icon("arrow-up")}</a>
                <a class="btn secondary" href="#packages">${CTA.secondary}</a>
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
        </div>
      </section>

${marquee(
  SERVICE_PAGES.map((service) => service.name),
  { label: "Veltra services", duration: "48s" },
)}

      <section class="section" id="packages">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Website packages</p>
              <h2>Know what your website will cost before the work starts</h2>
            </div>
            <p>Choose a package when the scope is straightforward. If your site needs ecommerce, member areas, unusual integrations or a larger content structure, we will provide a custom written quote.</p>
          </div>
          <div class="price-grid reveal">
${packageCards}
          </div>
          <div class="custom-row">
            <div>
              <h3>Need something different?</h3>
              <p>Ecommerce, memberships, directories, complex integrations and larger sites are scoped separately. You will receive a written proposal with the work, timeline and price before you commit.</p>
            </div>
            <a class="btn secondary" href="/contact">Request a custom quote</a>
          </div>
          <p class="price-note">Optional website care from £49 a month. No care plan is required. Final scope and any third-party costs are confirmed in writing before work begins. All prices exclude VAT.</p>
        </div>
      </section>

      <section class="section band-light" id="why-veltra">
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

      <section class="section" id="work">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Selected work</p>
              <h2>Work that is easy to judge</h2>
            </div>
            <p>Good work should not need vague claims. Every project shows what the client needed, what we built and what happened next.</p>
          </div>
          <div class="work-grid three reveal">
${workCards}
          </div>
          <p class="disclosure">Items marked “design example” show how we build, not a client project. Client case studies are published only with permission and only with results we can evidence.</p>
        </div>
      </section>

      <section class="section band-light" id="process">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">How it works</p>
            <h2>From first conversation to live website</h2>
          </div>
          <ol class="steps reveal">
${processSteps}
          </ol>
          <div class="section-action">
            <a class="btn" href="#plan">${CTA.primary}${icon("arrow-up")}</a>
          </div>
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
  goalLabel: "Main goal",
  goalPlaceholder: "More enquiries, a fresh design, better local visibility, a new offer page…",
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
  title: "Web Design Middlesbrough | Clear Website Packages | Veltra Media",
  description:
    "Premium conversion-focused websites for Middlesbrough and Teesside businesses. Clear packages from £495, local SEO foundations and custom options.",
  jsonLd: [
    organizationJsonLd(),
    serviceJsonLd({
      name: "Website design",
      description:
        "Conversion-focused websites with local search foundations for Middlesbrough and Teesside businesses, sold as clear packages or a custom written quote.",
      path: "/",
    }),
    faqJsonLd(FAQS),
  ],
  body,
};
