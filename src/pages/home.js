import { planSection } from "../form.js";
import { marquee } from "../marquee.js";
import { projectCard } from "../project-cards.js";
import { PROJECTS } from "../projects.js";
import { REVIEWS } from "../reviews.js";
import { servicesShowcase } from "../services-showcase.js";
import { cardMedia } from "../visuals.js";
import {
  CTA,
  SITE,
  faqJsonLd,
  faqSection,
  icon,
  serviceJsonLd,
} from "../site.js";

// Each area pill links to its location page; Billingham is covered on the Stockton page.
const AREA_PAGES = {
  Middlesbrough: "/web-design-middlesbrough",
  "Stockton-on-Tees": "/web-design-stockton-on-tees",
  Redcar: "/web-design-redcar",
  Billingham: "/web-design-stockton-on-tees",
  Hartlepool: "/web-design-hartlepool",
  "Tees Valley": "/web-design-teesside",
};

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

const initials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const reviewCard = (review) => {
  const stars = review.rating
    ? `<p class="review-stars" role="img" aria-label="Rated ${review.rating} out of 5">${[1, 2, 3, 4, 5].map((n) => `<svg viewBox="0 0 24 24" aria-hidden="true"${n > review.rating ? ' class="off"' : ""}><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9Z"/></svg>`).join("")}</p>`
    : "";
  const detail = [review.business, review.service].filter(Boolean).join(" &middot; ");
  return `<figure class="review-card">${stars}<blockquote><p>${review.text}</p></blockquote><figcaption><span class="review-avatar" aria-hidden="true">${initials(review.name)}</span><span><b>${review.name}</b>${detail ? `<span>${detail}</span>` : ""}</span></figcaption></figure>`;
};

// Hidden until src/reviews.js holds at least one real review. The cards drift
// left to right; a short list is repeated (hidden from screen readers) so the
// loop never shows a gap, so a single review still fills the strip.
export const reviewsSection = (reviews) =>
  reviews.length
    ? `
      <section class="section reviews" id="reviews">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Reviews</p>
              <h2>What our clients say</h2>
            </div>
            <p>Real reviews from real clients, in their own words.</p>
          </div>
        </div>
${marquee(reviews.map(reviewCard), { label: "Client reviews", duration: "80s", tone: "cards", direction: "right", minItems: 8 })}
      </section>
`
    : "";

// The free plan, worded for what the visitor gets rather than what it is called.
// Real projects only: concepts stay on /work. Shows up to three, side by side.
const showcase = PROJECTS.filter((project) => !project.concept).slice(0, 3);
export const workSection = (projects) =>
  projects.length === 0
    ? ""
    : `      <section class="section band-light" id="work">
        <div class="container">
          <div class="head-split">
            <div>
              <p class="eyebrow">Our work</p>
              <h2>Don't take our word for it. Open the work.</h2>
            </div>
            <p>Every project below is live. Click through, try the booking flow, read the pages the way a customer would &mdash; then decide whether this is the kind of site you want representing your business.</p>
          </div>
          <div class="project-grid count-${projects.length} reveal">
${projects.map((project) => projectCard(project)).join("\n")}
          </div>
          <div class="section-action">
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/work">See all our work</a>
            </div>
          </div>
        </div>
      </section>

`;

const PLAN_NOTE =
  "It takes about a minute and there is no obligation. A person replies with what is holding your site back and the three changes worth making first.";

const body = `      <section class="hero hero-feature">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">Web design in Middlesbrough and Teesside</p>
              <h1>Veltra Media builds websites that win more enquiries</h1>
              <p class="lede">Fast, mobile-first websites for Teesside businesses, with local SEO, AI chat and booking ready to add when they earn their place. You get a written scope and a fixed price before anything starts.</p>
              <div class="button-row">
                <a class="btn" href="#plan">${CTA.primary}${icon("arrow-up")}</a>
                <a class="btn secondary" href="/services">${CTA.secondary}</a>
              </div>
              <p class="hero-note">${PLAN_NOTE}</p>
            </div>
            <div class="hero-media">
              <img
                src="/assets/work/hero-poster.webp"
                srcset="/assets/work/hero-poster-800.webp 800w, /assets/work/hero-poster.webp 1200w"
                sizes="(min-width: 960px) 600px, calc(100vw - 40px)"
                width="1200"
                height="880"
                loading="eager"
                fetchpriority="high"
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

      <section class="section band-light svc" id="services">
        <div class="container">
          <div class="svc-head">
            <p class="eyebrow">Services</p>
            <h2>Start with what will make the biggest difference</h2>
            <p>You do not need every service on day one. Each Veltra service works on its own and can connect with the others as your business grows.</p>
          </div>
${servicesShowcase()}
          <div class="section-action">
            <a class="btn secondary" href="/services">See all services and how they fit together${icon("arrow-up")}</a>
          </div>
        </div>
      </section>

${workSection(showcase)}
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
                <ul class="area-list">${SITE.areas.map((area) => `<li><a href="${AREA_PAGES[area]}">${area}</a></li>`).join("")}</ul>
                <p class="area-more"><a href="/areas">See every area we cover across Teesside</a>.</p>
              </div>
            </div>
            <div class="local-side">
              <figure class="local-map reveal">
                <img src="/assets/work/tees-transporter-bridge.webp" srcset="/assets/work/tees-transporter-bridge-800.webp 800w, /assets/work/tees-transporter-bridge.webp 1600w" sizes="(min-width: 960px) 600px, calc(100vw - 40px)" width="1600" height="1047" loading="lazy" decoding="async" alt="The Tees Transporter Bridge in Middlesbrough, its blue steel towers and high girder against a cloudy sunset sky." />
              </figure>
              <div class="local-group">
                <p class="local-label">Popular pages</p>
                <div class="link-row">
                  <a class="text-link" href="/web-design-middlesbrough">Web design Middlesbrough${icon("arrow-up")}</a>
                  <a class="text-link" href="/local-seo-middlesbrough">Local SEO Middlesbrough${icon("arrow-up")}</a>
                  <a class="text-link" href="/web-design-teesside">Web design Teesside${icon("arrow-up")}</a>
                  <a class="text-link" href="/areas">Every Tees Valley town we cover${icon("arrow-up")}</a>
                  <a class="text-link" href="/resources">Free guides for local businesses${icon("arrow-up")}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

${faqSection(FAQS, { heading: "Straight answers before you start", eyebrow: "Frequently asked questions" })}

${planSection({ intro: PLAN_NOTE })}`;

export default {
  path: "/",
  title: "Veltra Media | Web Design, SEO & AI for Teesside Businesses",
  description:
    "Veltra Media builds websites, local SEO and AI reception for businesses in Middlesbrough and Teesside. Websites from £99, a written scope and a site you own.",
  jsonLd: [
    serviceJsonLd({
      name: "Website design",
      serviceType: "Web design",
      description:
        "Conversion-focused websites with local search foundations for Middlesbrough and Teesside businesses, each with a fixed written scope before work begins.",
      path: "/",
    }),
    faqJsonLd(FAQS),
  ],
  body,
};
