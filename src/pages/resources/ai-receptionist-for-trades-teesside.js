// Keyword map: owns "AI receptionist for trades", with the plumbers,
// electricians, builders and Teesside variants. It must not take "AI
// receptionist Middlesbrough" or "AI receptionist UK small business" (the
// service page) or "tradesmen" and "AI booking assistant for trades" (the
// trades page). Written to docs/seo/article-template.md on the cost guide's
// template. The worked missed-calls figures are an example, not a client's
// results, and every claim about our setup must match
// /ai-receptionist-middlesbrough. Our own price is read from assets/catalog.js.
// The trade and limit cards, the note box and the spacing are styled under
// body.page-ai-trades in assets/styles.css, so no other page changes.
import { articlePage, calculation, panel, price, steps, ticks } from "../../article-page.js";

const setup = price("ai-receptionist-website-chat");

// Line icons for the card markers, drawn in currentColor.
const svg = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const ICONS = {
  wrench: svg('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  bolt: svg('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'),
  hardHat: svg('<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/>'),
  key: svg('<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M16 7l3 3M19 4l2 2"/>'),
  cross: svg('<path d="M7 7l10 10M17 7 7 17"/>'),
  info: svg('<path d="M12 11v6M12 7.5v.01"/>'),
};

/** Cards in a 2 × 2 grid, each led by an icon marker. */
const cards = (kind, items) => `<ul class="ta-cards ta-${kind}">${items
  .map((item) => `<li><span class="ta-mark">${ICONS[item.icon]}</span><h3>${item.title}</h3><p>${item.text}</p></li>`)
  .join("")}</ul>`;

export default articlePage({
  slug: "ai-receptionist-for-trades-teesside",
  title: "AI Receptionist for Trades in Teesside | Veltra Media",
  description:
    "How an AI receptionist answers calls for plumbers, electricians and builders in Teesside while you are on a job, what it costs, and what it will not do.",
  shortName: "AI receptionist for trades in Teesside",
  kind: "Guide",
  summary: "How an AI receptionist helps plumbers, electricians and builders in Teesside answer every call while on the job.",
  eyebrow: "Guide · AI for trades",
  h1: "AI Receptionist for Trades in Teesside: Answer Every Call While You Are on the Job",
  published: "2026-10-29",
  // The /areas link in the short answer is not in the supplied copy's links:
  // scripts/seo-check.mjs requires every article to link to an area page or
  // /areas, so it is set on words already there.
  intro: [
    "When you are under a sink in Linthorpe or on a roof in Redcar, you cannot answer the phone. The customer does not leave a message. They ring the next plumber, electrician or builder on Google, and the job goes with them.",
    `<aside class="article-summary" aria-labelledby="short-answer-title">
          <p class="eyebrow" id="short-answer-title">The short answer</p>
          <p>An AI receptionist answers your calls and website chats when you cannot, takes the job details, books the visit where it is connected to your calendar, and passes anything urgent straight to you. It suits plumbers, electricians, builders, roofers and most trades that miss calls while working. Ours is ${setup} setup, with the AI provider’s usage passed on at cost, for trades across Middlesbrough, Stockton, Redcar, Hartlepool and <a href="/areas">the rest of Teesside</a>.</p>
        </aside>`,
  ],
  sections: [
    {
      id: "the-real-cost",
      toc: "The real problem is the job you lose",
      eyebrow: "The real cost",
      heading: "The real problem is not the phone, it is the job you lose",
      body: [
        "For most trades, the expensive part of a missed call is not the call. It is the work that goes to someone else while you are busy doing the work you already have.",
        calculation({
          tag: "Example",
          items: [
            { figure: "12", label: "missed calls a month" },
            { figure: "4", label: "were real jobs" },
            { figure: "£180", label: "average job" },
            { figure: "£720", label: "of work a month going to someone else" },
          ],
        }),
        `<p class="article-note">These are example figures, not a client’s results. To work out your own, count the calls you miss over two weeks, estimate how many were real jobs, and multiply by your average job value.</p>`,
        `<p class="article-takeaway">If it wins back even one job a month, it has more than covered its ${setup} setup.</p>`,
      ],
    },
    {
      id: "how-it-works",
      toc: "What it does for a trade business",
      eyebrow: "How it works",
      heading: "What an AI receptionist does for a trade business",
      band: "band-light",
      body: [
        steps([
          "<span><strong>Answers straight away</strong><br>Evenings, weekends and bank holidays, so the caller gets a reply, not voicemail.</span>",
          "<span><strong>Asks the right questions</strong><br>What the job is, the address or postcode, and how urgent it is.</span>",
          "<span><strong>Answers common questions</strong><br>Areas you cover, your callout fee and when you are next free, from answers you approved.</span>",
          "<span><strong>Books the visit</strong><br>Straight into your calendar where it is connected, or takes details for a call back.</span>",
          "<span><strong>Flags urgent jobs</strong><br>Passes them to you by rules you set, so a burst pipe does not wait until evening.</span>",
          "<span><strong>Sends you every enquiry</strong><br>With the details, so you can quote or call back between jobs.</span>",
        ]),
      ],
    },
    {
      id: "who-it-suits",
      toc: "Is it right for your trade?",
      eyebrow: "Who it suits",
      heading: "Is it right for plumbers, electricians and builders?",
      body: [
        "It works best for trades whose phone rings while their hands are full.",
        cards("trades", [
          { icon: "wrench", title: "Plumbers and heating engineers", text: "Emergency calls and boiler breakdowns come in at all hours, often while you are on another job." },
          { icon: "bolt", title: "Electricians", text: "Customers want to know if you cover their area and when you can come out." },
          { icon: "hardHat", title: "Builders, roofers and joiners", text: "Most enquiries are for quotes, so the job details need taking properly." },
          { icon: "key", title: "Locksmiths, drainage and callout trades", text: "The first business to answer usually gets the job." },
        ]),
        `<div class="ta-note"><span class="ta-note-mark">${ICONS.info}</span><p>It is less useful if you already answer almost every call, or if most of your work comes from a few regular customers who text you directly.</p></div>`,
      ],
    },
    {
      id: "clear-limits",
      toc: "What it will not do",
      eyebrow: "Clear limits",
      heading: "What it will not do",
      band: "band-light",
      body: [
        "Trades work involves safety, money and judgement, so a good setup is clear about its limits.",
        cards("limits", [
          { icon: "cross", title: "No safety advice or diagnosis", text: "If a caller describes something dangerous, it follows the rule you set, such as passing the call to you or giving the emergency number you approved." },
          { icon: "cross", title: "No made-up prices", text: "It only gives prices you approved, such as a callout fee, and says when a job needs a visit to quote." },
          { icon: "cross", title: "No payments or card details", text: "Deposits and payments belong on a proper payment page, not in a call." },
          { icon: "cross", title: "No pretending to be human", text: "It says it is an AI assistant at the start of every call and chat." },
        ]),
      ],
    },
    {
      id: "price",
      toc: "Price and what you get",
      eyebrow: "Our price",
      heading: "Price and what you get",
      body: [
        // "AI receptionist and website chat" is already the in-sentence anchor
        // to the service page on three pages (the limit), so only "AI
        // receptionist" is linked here.
        panel({
          figure: setup,
          body: [
            `Our <a href="/ai-receptionist-middlesbrough">AI receptionist</a> and website chat is ${setup} setup, excluding VAT. The AI provider’s usage is passed on at cost, not marked up, and the expected monthly figure is confirmed in writing before work starts.`,
            ticks([
              "Trained on your trade, services, areas and prices",
              "Website chat using the same approved answers",
              "Live calendar booking, where your calendar supports it",
              "Questions that qualify the job: what, where and how urgent",
              "Handover rules for urgent and unusual jobs",
              "Missed-call-to-text",
              "30 days of conversation fine-tuning",
              "A timeline agreed in writing",
            ]),
            `To compare it with other UK options, see <a href="/resources/ai-receptionist-cost-uk">how much an AI receptionist costs in the UK</a>.`,
          ],
        }),
      ],
    },
    {
      id: "faq",
      toc: "Questions trades ask before they buy",
      eyebrow: "Before you buy",
      heading: "Questions trades ask before they buy",
      band: "band-light",
      body: [],
      faq: [
        {
          q: "Is there an AI receptionist near me in Teesside?",
          a: '<p>Yes. We are based in Middlesbrough and set up AI receptionists for trades across Stockton, Redcar, Hartlepool, Billingham and the rest of the Tees Valley, mostly online, with meetings in person around Teesside if you prefer.</p>',
        },
        {
          q: "Can it work with my mobile number?",
          a: "<p>Usually, yes. Calls are forwarded to it when you do not answer or outside your hours, so you keep the number customers already have. The phone setup supported for you is confirmed in writing before work begins.</p>",
        },
        {
          q: "Will customers hang up when they hear an AI?",
          a: "<p>Some may, but the alternative is often voicemail, which many callers will not use. It says it is an AI assistant, answers their question and takes their details, so the job is not lost.</p>",
        },
        {
          q: "Can it handle emergency callouts?",
          a: "<p>It can recognise an urgent job and pass it to you straight away by the rules you set. It does not give safety advice, and anything dangerous is handled the way you have approved.</p>",
        },
        {
          q: "Can it give quotes?",
          a: "<p>Only prices you have approved, such as a callout fee or a starting price. For anything that needs a visit, it takes the details and tells the customer you will be in touch.</p>",
        },
      ],
    },
  ],
  relatedLinks: `If you need the website as well, see <a href="/web-design-for-trades-teesside">websites for trades in Teesside</a>. To keep quotes from going quiet, add <a href="/crm-booking-automation">booking and quote follow-up automation</a>. For the basics, read <a href="/resources/what-is-an-ai-receptionist">what an AI receptionist is</a>.`,
  // The audit form has no way to preselect a service from the link, so this is the plain link.
  closing: {
    heading: "See what an AI receptionist could handle for your trade",
    body: "Tell us your trade, the areas you cover and roughly how many calls you miss. We will show you what it would answer, what it would pass to you, and whether it is worth it for your business.",
    button: "See what it could handle",
  },
  readingLayout: true,
  bodyClass: "page-ai-trades",
});
