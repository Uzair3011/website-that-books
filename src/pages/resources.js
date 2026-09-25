import {
  CTA,
  breadcrumbJsonLd,
  finalCta,
  icon,
  organizationJsonLd,
  related,
} from "../site.js";

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
  },
  {
    kind: "Guide",
    title: "Getting a Google Business Profile right",
    intro:
      "The profile is usually worth more to a local business than the website, and it is free.",
    points: [
      "Choose the most specific primary category available, then add secondary categories for the rest. The primary category carries disproportionate weight.",
      "List your services individually with real descriptions, rather than leaving the category to imply them.",
      "If you visit customers rather than receiving them, set it up as a service-area business and hide the address. Publishing an address you do not staff risks the listing.",
      "Keep opening hours accurate, including bank holidays. Wrong hours generate bad reviews from people who turned up.",
      "Add photographs regularly — of work, premises and team. Profiles with recent photographs tend to get more interaction.",
      "Ask every satisfied customer for a review, using a direct link, at the moment they are happiest. Never offer an incentive; that breaches Google's policies.",
      "Reply to every review, including the bad ones, in a measured tone. Future customers read the replies more carefully than the reviews.",
      "Make sure the business name, phone number and service-area wording match your website exactly.",
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
    points: [
      "It is genuinely good at answering the same factual question a hundred times: hours, areas, services, what to expect, whether you cover a postcode.",
      "It is genuinely good at being available at eleven on a Sunday night, when the honest alternative is nothing at all.",
      "It is genuinely good at capturing a name, a contact detail and a need, so an anonymous visitor becomes a real enquiry.",
      "It should not give professional advice — clinical, legal, financial or safety — and it should hand those questions to a person immediately.",
      "It should not pretend to be human. People find out, and the trust cost is higher than the convenience gain.",
      "It should not be bought because it sounds modern. If you are not missing enquiries because questions go unanswered, it will not help you.",
    ],
  },
];

const list = GUIDES.map(
  (guide, index) => `<article class="section tight" id="guide-${index + 1}">
  <div class="container">
    <div class="guide-grid">
      <div class="guide-head">
        <p class="eyebrow">${guide.kind}</p>
        <h2>${guide.title}</h2>
        <p class="lede">${guide.intro}</p>
      </div>
      <ul class="tick-list">
        ${guide.points.map((point) => `<li>${icon("check")}<span>${point}</span></li>`).join("")}
      </ul>
    </div>
  </div>
</article>`,
).join("\n");

const index = GUIDES.map(
  (guide, i) =>
    `<li><a href="#guide-${i + 1}"><span class="r-kind">${guide.kind}</span><div><h3>${guide.title}</h3><p>${guide.intro}</p></div>${icon("arrow-up")}</a></li>`,
).join("");

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 46rem">
            <p class="eyebrow">Resources</p>
            <h1>Practical things you can do without hiring anyone.</h1>
            <p class="lede">Short, specific guides for local business owners. Nothing gated, no email required, and no download that turns out to be a sales brochure.</p>
            <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
          </div>
        </div>
      </section>

      <section class="section tight">
        <div class="container">
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
  title: "Resources for Local Businesses | Veltra Media",
  description:
    "Free, practical guides for Middlesbrough and Teesside business owners: website fixes, getting a Google Business Profile right, why enquiries go quiet, and what AI can sensibly do.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" },
    ]),
  ],
  body,
};
