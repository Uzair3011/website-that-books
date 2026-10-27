// Keyword map: owns "AI receptionist cost UK". No Middlesbrough in the title or
// H1 (the service page owns that). Written to docs/seo/article-template.md:
// answer the price question, then what missed calls already cost, then our
// setup, price and one call to action. Third-party prices are as published on
// each provider's site on 27 Oct 2026 and are listed under Sources; recheck
// them when the article is updated. The worked missed-calls figures are an
// example, not a client's results. The FAQ is purchase objections only, and
// every claim about our setup must match /ai-receptionist-middlesbrough. Our
// own price is read from assets/catalog.js.
import { articlePage, calculation, checklist, features, panel, price, steps, table } from "../../article-page.js";

const answerCoUk = "https://www.answer.co.uk/ai-virtual-receptionist-service/";
const fasthosts = "https://www.fasthosts.co.uk/spark/ai-receptionist";
const whoza = "https://whoza.ai/pricing";
const moneypenny = "https://www.moneypenny.com/uk/ai-receptionist/";
const livingWage = "https://www.gov.uk/government/news/national-living-wage-increases-to-1271-per-hour";

const setup = price("ai-receptionist-website-chat");

export default articlePage({
  slug: "ai-receptionist-cost-uk",
  title: "AI Receptionist Cost UK: When It Pays Off | Veltra Media",
  description:
    "What an AI receptionist costs in the UK, what missed calls may already be costing you, and exactly what Veltra Media’s setup includes.",
  shortName: "How much does an AI receptionist cost?",
  kind: "Guide",
  summary: "What an AI receptionist costs in the UK, and how to tell whether it would pay for itself.",
  eyebrow: "Guide · AI for local businesses",
  h1: "AI Receptionist Cost UK: What It Costs, and When It Actually Pays for Itself",
  published: "2026-10-27",
  updated: "2026-10-28",
  intro: [
    "For a plumber, a clinic or any local service business, a missed call is rarely just a missed call. The caller usually rings the next business on Google, and the job goes with them. Depending on what you do, that could be a £100 callout or a £1,000 job.",
    `<aside class="article-summary" aria-labelledby="short-answer-title">
          <p class="eyebrow" id="short-answer-title">The short answer</p>
          <p>Most UK AI receptionist plans cost about £30 to £100 a month for a small business, excluding VAT, with more for booking, call transfers and higher call volumes. Done-for-you setups add a one-off setup fee. Ours is ${setup} setup, with the AI provider’s usage passed on at cost.</p>
        </aside>`,
  ],
  sections: [
    {
      id: "published-prices",
      toc: "What UK providers charge",
      eyebrow: "Published prices",
      heading: "What UK providers charge",
      body: [
        "These are the entry prices UK providers publish on their own websites, checked on 27 October 2026. Prices exclude VAT unless stated.",
        table({
          head: ["Provider", "Monthly price", "What is included", "Trial or contract"],
          rows: [
            [`<a href="${answerCoUk}">Answer.co.uk AI</a>`, "£10, £30, £120 or £300", "Pay per call (85p) on £10; 50, 200 or 500 calls on the others", "Monthly, cancel any time"],
            [`<a href="${fasthosts}">Fasthosts AI Receptionist</a>`, "£39, £69 or £99", "30 calls, 100 calls, or unlimited", "1 month free, cancel any time"],
            [`<a href="${whoza}">Whoza, for trades</a>`, "from £59", "10 booked jobs and 100 minutes on Starter", "7-day trial, no contract"],
            [`<a href="${moneypenny}">Moneypenny AI Receptionist</a>`, "from £49", "Quoted to your needs", "Quote on request"],
          ],
        }),
        `For comparison, a pay-per-call human answering service works out at roughly £150 to £220 for 100 calls a month, and a full-time receptionist on the <a href="${livingWage}">National Living Wage</a> costs about £24,800 a year in wages alone.`,
      ],
    },
    {
      id: "missed-calls",
      toc: "What missed calls are already costing you",
      eyebrow: "The real cost",
      heading: "The better question: what are missed calls already costing you?",
      band: "band-light",
      body: [
        "Comparing £39 with £99 a month misses the bigger number. The real cost is the work that goes to someone else while your phone rings out.",
        "Here is a simple example for a local trade:",
        calculation({
          tag: "Example",
          items: [
            { figure: "10", label: "missed enquiries a month" },
            { figure: "3", label: "of them would have become jobs" },
            { figure: "£300", label: "average job" },
            { figure: "£900", label: "of work a month going to someone else" },
          ],
        }),
        `<p class="article-note">These are example figures, not a client’s results. To work out your own, count the calls you miss over two weeks, estimate how many were real jobs, and multiply by your average job value.</p>`,
        `<p class="article-takeaway">If an AI receptionist wins back even one of those jobs, it has already covered its ${setup} setup.</p>`,
      ],
    },
    {
      id: "what-it-does",
      toc: "What an AI receptionist does",
      eyebrow: "How it works",
      heading: "What an AI receptionist does",
      body: [
        "In plain terms, it does what a good receptionist would do when you cannot get to the phone:",
        steps([
          "Answers every call and chat straight away, including evenings and weekends.",
          "Qualifies the enquiry: what the job is, where it is and how urgent.",
          "Captures the details you need: name, number and what they need doing.",
          "Books the job into your calendar, where it is connected.",
          "Hands over to you by rules you set, for urgent jobs, complaints or anything it cannot answer.",
          "Keeps working after hours, so the 9pm enquiry is waiting for you in the morning instead of going to a competitor.",
        ]),
        `For a fuller explanation, see <a href="/resources/what-is-an-ai-receptionist">What is an AI receptionist?</a>`,
      ],
    },
    {
      id: "our-setup",
      toc: "What makes our setup different",
      eyebrow: "Why Veltra Media",
      heading: "What makes our setup different",
      band: "band-light",
      body: [
        "The software is the easy part. What decides whether it wins you work is how it is set up:",
        features([
          { lead: "Answers you approve.", text: "It is trained on your services, prices, areas and hours, and only says what you have signed off. It never makes up a price or a promise." },
          { lead: "One set of answers for calls and website chat.", text: "A visitor on your website hears what a caller hears." },
          { lead: "Connected to your calendar.", text: "It books into your real availability instead of just taking a message." },
          { lead: "Clear handover rules.", text: "You decide when a person takes over, and you get the customer’s details straight away." },
          { lead: "Missed-call text.", text: "If someone calls your own phone and you miss it, it texts them to start the booking." },
          { lead: "Built and tested before launch.", text: "Your customers never hear a first draft." },
          { lead: "30 days of fine-tuning.", text: "We read its conversations in the first month and adjust its answers." },
          { lead: "Your enquiries are yours.", text: "Everything it captures belongs to your business, with an export available." },
        ]),
      ],
    },
    {
      id: "price",
      toc: "Price and what you get",
      eyebrow: "Our price",
      heading: "Price and what you get",
      body: [
        panel({
          figure: setup,
          body: [
            `Our <a href="/ai-receptionist-middlesbrough">AI receptionist and website chat</a> is ${setup} setup, excluding VAT. The AI provider’s usage is passed on at cost, not marked up, and the expected monthly figure is confirmed in writing before work starts. It is on our <a href="/pricing">price list</a>.`,
            "For that you get:",
            checklist([
              "An AI receptionist trained on your business",
              "Website chat using the same approved answers",
              "Live calendar booking",
              "An enquiry qualification flow",
              "Handover rules agreed with you",
              "Missed-call-to-text",
              "30 days of conversation fine-tuning",
              "A timeline agreed in writing",
            ]),
            // Not in the supplied copy: scripts/seo-check.mjs requires every article
            // to link to an area page or /areas, and this is the old article's line.
            `We set these up for businesses across <a href="/areas">Middlesbrough and the Tees Valley</a>.`,
          ],
        }),
      ],
    },
    {
      id: "faq",
      toc: "Questions before you buy",
      eyebrow: "Questions",
      heading: "Questions before you buy",
      band: "band-light",
      body: [],
      faq: [
        {
          q: "Will customers know it is an AI?",
          a: "<p>Yes. It says it is an AI assistant at the start of every call and chat. That is honest, it sets expectations, and being open about it is good practice under UK GDPR.</p>",
        },
        {
          q: "Can it transfer calls to me?",
          a: "<p>It hands over to you by rules you set, for example for urgent jobs, complaints or anything outside its approved answers. Whether that is a live call transfer or an instant message with the caller’s details depends on your phone setup, and we confirm what yours supports in writing before work begins.</p>",
        },
        {
          q: "Can it book appointments?",
          a: "<p>Yes, where it is connected to your calendar. It checks your free slots and books the job in, so it appears on your schedule. The calendar connections supported for your setup are confirmed in writing.</p>",
        },
        {
          q: "What if it does not know an answer?",
          a: "<p>It does not guess. It tells the customer someone will get back to them, takes their details and passes the enquiry straight to you.</p>",
        },
        {
          q: "How much will usage cost?",
          a: "<p>It depends on how many calls and chats it handles and how long they last; the AI provider charges for that usage. We pass it on at cost with no mark-up, and before work starts we estimate it from your call volume and confirm it in writing.</p>",
        },
      ],
    },
  ],
  sources: {
    heading: "Sources (prices checked 27 October 2026)",
    items: [
      { href: answerCoUk, label: "Answer.co.uk: AI Virtual Receptionist" },
      { href: fasthosts, label: "Fasthosts: AI Receptionist" },
      { href: whoza, label: "Whoza: Pricing" },
      { href: moneypenny, label: "Moneypenny: AI Receptionist" },
      { href: livingWage, label: "GOV.UK: National Living Wage increases to £12.71 per hour" },
    ],
  },
  // The audit form has no way to preselect a service from the link, so this is the plain link.
  closing: {
    heading: "See what an AI receptionist could handle for your business",
    body: "Tell us how enquiries reach you now and roughly how many calls you miss. We will show you what it would answer, what it would pass to you, and whether it is worth it for your business.",
    button: "See what it could handle",
  },
});
