import {
  CTA,
  breadcrumbJsonLd,
  finalCta,
  icon,
  related,
} from "../site.js";
import { articles } from "./resources/index.js";

// Written out in full on the page. Nothing is gated, nothing asks for an
// email, and nothing links to a download that does not exist.
const GUIDES = [
  {
    kind: "Checklist",
    title: "Nine things to fix on a local business website this week",
    intro:
      "None of these need a developer or a budget. Most take under an hour.",
    points: [
      "Put your phone number in the header as a tappable link, not as plain text in an image or a footer.",
      "Say which areas you cover, in words, on the homepage. “Middlesbrough, Stockton and Redcar” beats “the North East”.",
      "Make the first line of your homepage say what you do and for whom. Not your company values.",
      "Open your own site on a phone, on mobile data, and count the seconds. If it is over three, that is your priority.",
      "Check every form actually delivers. Submit one yourself and confirm the email arrives — silent form failures are common and invisible.",
      "Add your prices, or a price range, or at least a “from”. Refusing to indicate cost loses more enquiries than a high number does.",
      "Replace stock photography of strangers with photographs of your actual work, premises or team.",
      "Give every page a unique page title that includes the service and, where relevant, the place.",
      "Check the copyright year in your footer. A stale year quietly signals an abandoned business.",
    ],
    more: [{ href: "/resources/local-seo-checklist", label: "Work through the full local SEO checklist" }],
  },
  {
    kind: "Guide",
    title: "Getting a Google Business Profile right",
    intro:
      "The profile is usually worth more to a local business than the website, and it is free.",
    // Now a full article; a short summary here keeps this page from competing with it.
    summary:
      "Choose the most specific category, list every service, keep hours and details identical to your website, and if customers do not visit you, hide the address and set service areas instead.",
    more: [
      {
        href: "/resources/google-business-profile-service-area-business",
        label: "Read the full guide to Google Business Profile for service area businesses",
      },
    ],
  },
  {
    kind: "Guide",
    title: "Why local enquiries go quiet, and what to do about it",
    intro:
      "Most lost local work is not lost at the search stage. It is lost in the two days afterwards.",
    points: [
      "Respond faster than you think is necessary. For a lot of local services the first business to reply wins, almost regardless of price.",
      "Send an immediate acknowledgement, even an automated one, that says when a person will be in touch. Silence gets read as “they are not interested”.",
      "Confirm appointments in writing and send one reminder before the day. This is the cheapest reduction in no-shows available.",
      "Follow up once with people who went quiet. Once. A short, useful message that stops the moment they reply or opt out.",
      "Answer the boring questions publicly — hours, areas, rough costs, what happens on the first visit — so fewer people need to ask before they commit.",
      "Track where enquiries actually come from. Most businesses are wrong about this, and it changes where the next pound is spent.",
    ],
  },
  {
    kind: "Explainer",
    title: "What AI can and cannot sensibly do for a local business",
    intro:
      "A short, unexcited assessment, written by people who sell this and still think most of it is oversold.",
    summary:
      "AI is good at answering the same factual question many times, at being there at eleven on a Sunday night and at turning an anonymous visitor into a real enquiry. It should not give professional advice, pretend to be human, or be bought because it sounds modern.",
    more: [
      { href: "/ai-agents-teesside", label: "AI agents for local businesses, explained" },
      { href: "/resources/what-is-an-ai-receptionist", label: "What an AI receptionist is, and what it can actually do" },
    ],
  },
];

const moreLinks = (more = []) =>
  more.length
    ? `<p class="guide-more">${more.map((link) => `<a class="text-link" href="${link.href}">${link.label}${icon("arrow-up")}</a>`).join("")}</p>`
    : "";

const list = GUIDES.map(
  (guide, index) => `<article class="section tight" id="guide-${index + 1}">
  <div class="container">
    <div class="guide-grid">
      <div class="guide-head">
        <p class="eyebrow">${guide.kind}</p>
        <h2>${guide.title}</h2>
        <p class="lede">${guide.intro}</p>
      </div>
      <div>
        ${
          guide.points
            ? `<ul class="tick-list">${guide.points.map((point) => `<li>${icon("check")}<span>${point}</span></li>`).join("")}</ul>`
            : `<p>${guide.summary}</p>`
        }
        ${moreLinks(guide.more)}
      </div>
    </div>
  </div>
</article>`,
).join("\n");

const index = GUIDES.map(
  (guide, i) =>
    `<li><a href="#guide-${i + 1}"><span class="r-kind">${guide.kind}</span><div><h3>${guide.title}</h3><p>${guide.intro}</p></div>${icon("arrow-up")}</a></li>`,
).join("");

// The full articles, each with its own page under /resources/<slug>.
const articleIndex = articles
  .map(
    (article) =>
      `<li><a href="${article.path}"><span class="r-kind">${article.kind}</span><div><h3>${article.shortName}</h3><p>${article.summary}</p></div>${icon("arrow-up")}</a></li>`,
  )
  .join("");

const body = `      <section class="hero compact">
        <div class="container">
          <div class="hero-copy">
            <p class="eyebrow">Resources</p>
            <h1>Free guides for small business websites and local search</h1>
            <p class="lede"><strong>Practical things you can do without hiring anyone.</strong> Short, specific guides for local business owners. Nothing gated, no email required, and no download that turns out to be a sales brochure.</p>
            <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
          </div>
        </div>
      </section>

      <section class="section tight" id="articles">
        <div class="container">
          <div class="section-head sp-stacked-head">
            <p class="eyebrow">Articles</p>
            <h2>Guides to read in full</h2>
          </div>
          <ul class="resource-list reveal">${articleIndex}</ul>
        </div>
      </section>

      <section class="section tight">
        <div class="container">
          <div class="section-head sp-stacked-head">
            <p class="eyebrow">Quick guides</p>
            <h2>Short guides you can read on this page</h2>
          </div>
          <ul class="resource-list reveal">${index}</ul>
        </div>
      </section>

      <div class="band-light">
${list}
      </div>

${related([
  {
    href: "/free-website-audit",
    label: "Free website & Google audit",
    text: "The same thinking, applied to your business specifically.",
  },
  {
    href: "/local-seo-middlesbrough",
    label: "Local SEO + Google Business Profile",
    text: "When you would rather someone else did the profile work.",
  },
  {
    href: "/pricing",
    label: "Pricing",
    text: "What each service costs, before you get in touch.",
  },
])}

${finalCta({
  heading: "Worked through the list and still not getting enquiries?",
  body: "That usually means the problem is somewhere the checklist cannot see. The free audit will find it.",
})}`;

export default {
  path: "/resources",
  title: "Website & Local SEO Guides for Small Business | Veltra Media",
  description:
    "Free guides for small business websites and local search: website fixes, Google Business Profile basics, why enquiries go quiet and what AI can sensibly do.",
  jsonLd: [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" },
    ]),
  ],
  body,
};
