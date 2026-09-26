import {
  CTA,
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  finalCta,
  icon,
  organizationJsonLd,
  related,
} from "../site.js";

const STEPS = [
  [
    "Choose the right starting point",
    "Tell us what the business does, what is not working and what you want the website to achieve. We reply with a recommendation, either a package or a custom scope, and say plainly if something else would help more.",
  ],
  [
    "Agree the message and structure",
    "Before any design starts, we map the pages, offers, calls to action and local search priorities with you. You get a written scope, a timeline and a fixed price, and nothing starts until you approve them.",
  ],
  [
    "Review the working site",
    "You receive a private preview link and watch the site take shape on desktop and mobile. Feedback comes in focused revision rounds, so changes are clear and nothing gets lost in an email thread.",
  ],
  [
    "Launch with the essentials connected",
    "We complete final checks, connect analytics and Search Console, test every form and call button, then hand over a site that is ready to use and yours to keep.",
  ],
];

const NEEDS = [
  {
    icon: "doc",
    title: "The facts only you have",
    text: "Your services, the areas you cover, how customers usually get in touch and the questions they ask most. We turn that into structure and copy.",
  },
  {
    icon: "layout",
    title: "Photographs and branding",
    text: "Your logo and any real photographs of the work, the team or the premises. Real images do more for trust than stock photography ever will.",
  },
  {
    icon: "chat",
    title: "Timely, focused feedback",
    text: "Clear feedback on each preview within a few days. Timelines run from content approval, so this is usually what decides how fast a project moves.",
  },
];

const TIMELINES = [
  {
    size: "One-page website",
    time: "Around 7 working days",
    note: "A single scrolling page for a new business or a simple offer.",
  },
  {
    size: "Up to five pages",
    time: "10 to 15 working days",
    note: "A complete small-business site with service pages and local search set-up.",
  },
  {
    size: "Up to ten pages",
    time: "15 to 20 working days",
    note: "More service depth, location pages and a booking or CRM connection.",
  },
];

const FAQS = [
  {
    q: "What happens after I send the form?",
    a: "<p>A real person reads it and replies with a practical starting point and the package or scope that fits. There is no automated sales sequence and no obligation.</p>",
  },
  {
    q: "Do I need to write the content myself?",
    a: "<p>No. We write the structure and the conversion copy. You supply the facts only you have (services, areas, photographs and the questions customers ask) and approve the result.</p>",
  },
  {
    q: "How many rounds of changes are included?",
    a: "<p>Each package includes a set number of revision rounds during the build, listed on the <a href=\"/pricing\">pricing page</a>. Anything outside the agreed scope is quoted separately and never started without your approval.</p>",
  },
  {
    q: "How do payments work?",
    a: "<p>Project work is split between a deposit to book the work in and a balance on completion, as set out in your written proposal. Monthly services are month to month with no long tie-in.</p>",
  },
  {
    q: "What happens after launch?",
    a: "<p>The website is yours. You can manage it yourself, and we will show you how, or choose optional <a href=\"/website-care\">website care</a> for hosting, updates, backups and support. Local SEO, booking and AI reception can be added whenever they make sense.</p>",
  },
];

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 46rem">
            <p class="eyebrow">How it works</p>
            <h1>From first conversation to live website.</h1>
            <p class="lede">Four clear steps, with a written scope and a fixed price before any work begins, a private preview while it is built, and a website you own at the end.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/services">Explore our services</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section band-light" id="process">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">The process</p>
            <h2>Four steps, and you always know which one you are in.</h2>
          </div>
          <ol class="steps reveal">
${STEPS.map(([title, text]) => `            <li><h3>${title}</h3><p>${text}</p></li>`).join("\n")}
          </ol>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">What we need from you</p>
              <h2>Three things that keep a project moving</h2>
            </div>
            <p>We handle the design, the copy, the build and the technical set-up. These are the parts only you can provide.</p>
          </div>
          <div class="card-grid cols-3 reveal">
${NEEDS.map(
  (item) => `            <article class="card">
              <span class="card-icon" aria-hidden="true">${icon(item.icon)}</span>
              <h3>${item.title}</h3>
              <p>${item.text}</p>
            </article>`,
).join("\n")}
          </div>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">Typical timelines</p>
            <h2>Most websites go live within a few weeks.</h2>
            <p class="lede">Timelines run from content approval, not from the first enquiry. Larger or custom projects get their own timeline in the written proposal.</p>
          </div>
          <ul class="chain timeline reveal">
${TIMELINES.map((item) => `            <li><b>${item.size}</b><h3>${item.time}</h3><p>${item.note}</p></li>`).join("\n")}
          </ul>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="two-col">
            <div class="section-head" style="margin-bottom: 0">
              <p class="eyebrow">After launch</p>
              <blockquote class="pullquote">The website is yours. Support is there if you want it, never forced.</blockquote>
            </div>
            <div class="prose">
              <p>Once the project fees are paid, the website and the original content we wrote for it belong to you. You can manage it yourself, and we will walk you through how, or hand the technical side to us with an optional care plan.</p>
              <p>Many businesses start with the website and add more later: local SEO once the foundations are in place, or booking and follow-up automation once enquiries pick up. We only recommend those when they solve a clear problem.</p>
            </div>
          </div>
        </div>
      </section>

${faqSection(FAQS, { heading: "Questions about the process", eyebrow: "Process FAQ" })}

${related(
  [
    {
      href: "/services",
      label: "Services",
      text: "Six services, each fixing one part of the enquiry journey.",
    },
    {
      href: "/pricing",
      label: "Pricing",
      text: "Every package and service with a published price.",
    },
    {
      href: "/work",
      label: "Our work",
      text: "What we build, clearly labelled and easy to judge.",
    },
  ],
  "Keep exploring",
)}

${finalCta()}`;

export default {
  path: "/how-it-works",
  title: "How It Works | Our Website Design Process | Veltra Media",
  description:
    "How Veltra Media builds a website: a written scope and fixed price first, a private preview during the build, a launch with analytics connected, and a site you own. Typical timelines included.",
  jsonLd: [
    organizationJsonLd(),
    faqJsonLd(FAQS),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "How it works", path: "/how-it-works" },
    ]),
  ],
  body,
};
