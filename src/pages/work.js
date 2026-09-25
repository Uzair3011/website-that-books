import {
  CTA,
  breadcrumbJsonLd,
  finalCta,
  icon,
  organizationJsonLd,
} from "../site.js";

const items = [
  {
    wide: true,
    image: {
      src: "/assets/work/example-clinic.svg",
      width: 1280,
      height: 900,
      alt: "A clinic website design with a treatment list and a live booking panel showing selectable dates and times.",
    },
    tags: ["Website design", "Booking automation", "AI reception"],
    title: "Med-spa growth system",
    kind: "Veltra build",
    body: "Our own build, and the most complete example of the five services working as one. A conversion-focused clinic website connected to live Google Calendar availability, with confirmation and reminder emails, an AI receptionist working from an approved answer set, and a clear handover to a person whenever a question needs judgement.",
    facts: [
      ["Built for", "Med spas and aesthetic clinics"],
      [
        "Services used",
        "Website design, AI reception, CRM and booking automation",
      ],
      [
        "What it does",
        "Shows real availability, creates the appointment, sends the confirmation and reminder, and captures enquiries outside opening hours",
      ],
      ["Status", "Live — you can use the booking flow on this site"],
    ],
    link: { href: "/med-spa-growth-system", label: "See the med-spa system" },
  },
  {
    image: {
      src: "/assets/work/example-trades.svg",
      width: 1280,
      height: 900,
      alt: "Design example: a home-services website with a dark hero, a prominent phone number, a covered-areas list and a quote request form.",
    },
    tags: ["Website design", "Local SEO"],
    title: "Home and trade services",
    kind: "Design example",
    body: "How we structure a site for a business that wins work by phone. The number stays visible at every scroll position, the areas covered are stated plainly rather than buried in a footer, and the quote form sits at the point where someone has decided.",
    facts: [
      ["Approach", "Phone-first, with a quote form as the secondary action"],
      ["Structure", "One page per service, area coverage stated explicitly"],
      ["Built for", "Trades, home services and emergency callouts"],
    ],
  },
  {
    image: {
      src: "/assets/work/example-landing.svg",
      width: 1280,
      height: 900,
      alt: "Design example: a single-offer landing page with one headline, three proof points and a short form above the fold.",
    },
    tags: ["Landing pages", "CRO"],
    title: "Single-offer landing page",
    kind: "Design example",
    body: "One offer, one audience, one action. No site navigation to wander off into, the three real objections answered in order, and the form visible before anyone has to scroll — because campaign traffic does not scroll to find it.",
    facts: [
      ["Approach", "No navigation, one conversion goal, form above the fold"],
      ["Measurement", "Form starts, submissions and phone clicks tracked"],
      ["Built for", "Paid campaigns and single high-value services"],
    ],
  },
  {
    image: {
      src: "/assets/work/example-local-search.svg",
      width: 1280,
      height: 900,
      alt: "Design example: a business profile and service-area page structure, showing opening hours, services and reviews presented consistently across a website and a search listing.",
    },
    tags: ["Local SEO", "Google Business Profile"],
    title: "Local search presence",
    kind: "Design example",
    body: "What consistency actually looks like. The same business name, contact details, services and service-area wording on the website and the business profile, with service pages that match the searches people really use — and no mass-produced town pages.",
    facts: [
      ["Approach", "One genuine page per service, area pages only where real"],
      ["Consistency", "Identical business details across site and profile"],
      ["Reporting", "Search Console impressions, clicks and queries"],
    ],
  },
];

const grid = items
  .map(
    (item) => `<article class="work-item${item.wide ? " wide" : ""}">
  <figure class="work-figure"><img src="${item.image.src}" width="${item.image.width}" height="${item.image.height}" loading="lazy" alt="${item.image.alt}" /></figure>
  <div class="work-copy">
    <ul class="work-tags">${item.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
    <h3>${item.title} <span class="dim">&mdash; ${item.kind.toLowerCase()}</span></h3>
    <div class="work-body">
      <p>${item.body}</p>
      <ul class="work-facts">${item.facts.map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join("")}</ul>
      ${item.link ? `<a class="text-link" href="${item.link.href}">${item.link.label}${icon("arrow-up")}</a>` : ""}
    </div>
  </div>
</article>`,
  )
  .join("\n");

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 44rem">
            <p class="eyebrow">Work</p>
            <h1>Work that is easy to judge.</h1>
            <p class="lede">Good work should not need vague claims. Below is what we build and how we build it — clearly labelled, with nothing dressed up as a client result it is not.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/pricing">See prices</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="disclosure" style="margin-bottom: 40px">Veltra Media is a young studio and we would rather show you our thinking than pad this page. Items marked <strong>Veltra build</strong> are real systems we have built and run. Items marked <strong>design example</strong> show how we structure a given kind of site &mdash; they are not client projects. We publish client case studies only with permission, and only with results we can evidence.</p>
          <div class="work-grid reveal">
${grid}
          </div>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="two-col">
            <div>
              <p class="eyebrow">How we present results</p>
              <blockquote class="pullquote">If a number cannot be evidenced, we describe what we built instead.</blockquote>
            </div>
            <div class="prose">
              <p>Plenty of agencies publish percentage uplifts with no baseline, no timeframe and no way to check them. We are not going to do that.</p>
              <p>When a client project produces a result we can evidence &mdash; enquiry volume, booking rate, page speed, search visibility &mdash; and the client is happy for it to be published, we will publish it with the context attached.</p>
              <p>Until then, this page shows the work itself. You can judge the craft, the structure and the clarity directly, which is harder to fake than a statistic.</p>
            </div>
          </div>
        </div>
      </section>

${finalCta({
  heading: "Want to see what we would do with yours?",
  body: "The free audit is the fastest way to find out. A short video, a one-page summary, and the three things we would fix first.",
  secondary: { href: "/contact", label: "Talk to us" },
})}`;

export default {
  path: "/work",
  title: "Our Work | Web Design & Local SEO Examples | Veltra Media",
  description:
    "Selected Veltra Media work and design examples: a live med-spa booking system, home-services site structure, single-offer landing pages and local search presence.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
    ]),
  ],
  body,
};
