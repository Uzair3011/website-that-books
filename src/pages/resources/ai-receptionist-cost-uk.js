// Keyword map: owns "AI receptionist cost UK". No Middlesbrough in the title or
// H1 (the service page owns that). Third-party prices are as published on each
// provider's site on 27 Oct 2026 and are listed under Sources; recheck them
// when the article is updated. No FAQ block: those questions belong on
// /ai-receptionist-middlesbrough. Our own price is read from assets/catalog.js.
import { articlePage, checklist, price, table } from "../../article-page.js";

const answerCoUk = "https://www.answer.co.uk/ai-virtual-receptionist-service/";
const fasthosts = "https://www.fasthosts.co.uk/spark/ai-receptionist";
const whoza = "https://whoza.ai/pricing";
const moneypenny = "https://www.moneypenny.com/uk/ai-receptionist/";
const allDayPa = "https://alldaypa.co.uk/?p=47817";
const mbe = "https://www.mbe.co.uk/business/telephone-answering";
const livingWage = "https://www.gov.uk/government/news/national-living-wage-increases-to-1271-per-hour";

export default articlePage({
  slug: "ai-receptionist-cost-uk",
  title: "AI Receptionist Cost UK: 2026 Prices Compared | Veltra Media",
  description:
    "UK AI receptionist prices in 2026: what published plans cost, how per-call pricing works, and how it compares with an answering service or a hire.",
  shortName: "How much does an AI receptionist cost?",
  kind: "Guide",
  summary: "Published UK prices, per-call costs and how it compares with an answering service.",
  eyebrow: "Guide · AI for local businesses",
  h1: "How much does an AI receptionist cost in the UK?",
  published: "2026-10-27",
  intro: [
    "Most UK AI receptionists cost between about £30 and £100 a month for a small business, excluding VAT. Plans with appointment booking, call transfers and higher call volumes cost more, and done-for-you setups usually add a one-off setup fee.",
    "That range hides a lot. Two plans with the same headline price can cost very different amounts once your real number of calls goes through them. This guide shows the prices UK providers publish, how they charge, what the same month of calls costs on each, and how that compares with an answering service or hiring someone.",
    "We sell an AI receptionist ourselves, so we have tried to be plain about where a cheaper option, or no AI at all, would serve you better. Prices were checked on each provider’s website on 27 October 2026.",
    `<aside class="article-summary" aria-labelledby="short-answer-title">
          <p class="eyebrow" id="short-answer-title">The short answer</p>
          <ul>
            <li><strong>Self-serve plans:</strong> about £10 to £100 a month, plus a charge per call or per minute over your allowance.</li>
            <li><strong>Done-for-you setups:</strong> a one-off setup fee, then a monthly fee or the AI provider’s usage.</li>
            <li><strong>Human answering service:</strong> the services we checked work out at roughly £150 to £220 for 100 calls a month.</li>
            <li><strong>Hiring a receptionist:</strong> at the National Living Wage, about £24,800 a year in wages for a full-time role, before National Insurance, pension and cover.</li>
          </ul>
        </aside>`,
  ],
  sections: [
    {
      id: "pricing-models",
      toc: "How it is priced",
      eyebrow: "Pricing models",
      heading: "How UK AI receptionists are priced",
      body: [
        "Before comparing figures, work out which of these four models you are being sold. The same month of calls costs very different amounts in each.",
        `<ol>
          <li><strong>Monthly fee with a call allowance.</strong> You pay a fixed amount for a set number of calls, then a fee for each extra call. Fasthosts and Answer.co.uk work this way.</li>
          <li><strong>Unlimited calls for a flat fee.</strong> One price however busy you are. Fasthosts’ top plan does this.</li>
          <li><strong>Per minute or per booked job.</strong> You pay for talk time or for enquiries you accept. Whoza, aimed at trades, includes 10 booked jobs and 100 minutes in its starter plan, then charges for extras.</li>
          <li><strong>Setup fee plus usage.</strong> A provider or agency builds and tests it for you, then you pay the AI company’s usage. This is how most done-for-you services work, including ours.</li>
        </ol>`,
        "The cheapest model for you depends almost entirely on how many calls it will actually answer. That is why the first job is to count your missed calls, not to compare headline prices.",
      ],
    },
    {
      id: "published-prices",
      toc: "What UK providers publish",
      eyebrow: "Published prices",
      heading: "What UK providers publish (October 2026)",
      band: "band-light",
      body: [
        "These are the entry prices UK providers show on their own websites. Prices exclude VAT unless stated.",
        table({
          head: ["Provider", "Monthly price", "What is included", "Over the allowance", "Trial or contract"],
          rows: [
            [`<a href="${answerCoUk}">Answer.co.uk AI</a>`, "£10, £30, £120 or £300", "Pay per call on £10; 50, 200 or 500 calls on the others", "£0.85 a call", "Monthly, cancel any time; £25 minimum deposit to start"],
            [`<a href="${fasthosts}">Fasthosts AI Receptionist</a>`, "£39, £69 or £99", "30 calls, 100 calls, or unlimited", "£0.49 a call (Lite), £0.39 (Plus)", "1 month free; cancel online any time"],
            [`<a href="${whoza}">Whoza, for trades</a>`, "from £59", "10 booked jobs and 100 minutes on Starter", "£4.50 a job, £0.40 a minute", "7-day trial on Starter; no contract; no VAT charged"],
            [`<a href="${moneypenny}">Moneypenny AI Receptionist</a>`, "from £49", "Quoted to your needs", "Not published", "Quote on request"],
          ],
        }),
        "Three things stand out. Calendar booking is not always on the cheapest plan: at Fasthosts it starts on Plus, and at Answer.co.uk on Plus and Advanced. Live transfer to you can cost extra. And providers count usage differently, by call, by minute or by accepted job, so compare a full month, not a headline.",
      ],
    },
    {
      id: "month-of-calls",
      toc: "What a month of calls costs",
      eyebrow: "Worked examples",
      heading: "What a month of calls actually costs",
      body: [
        "At 100 calls a month, the cheapest published AI plans we checked come to about £70, against about £220 for a pay-per-call human answering service. Here is the same month worked through at three call volumes, picking the cheapest plan from each provider for that volume. Prices exclude VAT.",
        table({
          head: ["Calls a month", "Fasthosts", "Answer.co.uk AI", "Human answering service (Answer.co.uk, £2.20 a call)"],
          rows: [
            ["30", "£39 (Lite)", "£30 (Growth)", "£66"],
            ["100", "£69 (Plus)", "£72.50 (Growth plus 50 extra calls)", "£220"],
            ["300", "£99 (Unlimited)", "£205 (Plus plus 100 extra calls)", "£660"],
          ],
        }),
        "Two cautions. A “call” includes wrong numbers, sales calls and hang-ups unless the provider filters them, so your billed count can be higher than your real enquiries. And the cheapest plan at each volume is not always the one with the features you need, such as booking straight into your calendar.",
        `If you do not know your call volume yet, count missed calls for two weeks first. Our guide <a href="/resources/what-is-an-ai-receptionist">What is an AI receptionist?</a> has a simple way to do it.`,
      ],
    },
    {
      id: "compared",
      toc: "Compared with the alternatives",
      eyebrow: "The alternatives",
      heading: "Compared with an answering service or hiring someone",
      band: "band-light",
      body: [
        "An AI receptionist is usually the cheapest of the three per call, but it is not always the right choice.",
        table({
          head: ["Option", "Typical cost", "Better for"],
          rows: [
            ["AI receptionist", "About £30 to £100 a month for most small businesses", "Repetitive questions, out-of-hours enquiries, taking details every time"],
            ["Human answering service", `Answer.co.uk charges £2.20 a call pay as you go; <a href="${allDayPa}">AllDayPA</a> lists 100 calls for £180 a month; <a href="${mbe}">Mail Boxes Etc</a> starts at £47.94 a month for 20 calls in set hours`, "Sensitive or emotional calls, callers who want a person, judgement calls"],
            ["Full-time receptionist", `At the <a href="${livingWage}">National Living Wage of £12.71 an hour</a>, about £24,800 a year in wages for 37.5 hours a week, before employer National Insurance, pension and holiday cover`, "Busy front desks, in-person visitors, work beyond the phone"],
          ],
        }),
        "Many small businesses do not need to choose just one. A common setup is AI for first-line and out-of-hours calls, with urgent or complex calls passed to you or to a human service.",
      ],
    },
    {
      id: "free",
      toc: "Is there a free one?",
      eyebrow: "Free options",
      heading: "Is there a free AI receptionist?",
      body: [
        "Not for ongoing use, among the UK providers we checked. What you can get free is a trial:",
        `<ul>
          <li><strong>Fasthosts:</strong> first month free on any plan.</li>
          <li><strong>Whoza:</strong> 7-day free trial on its Starter plan, with a 30-day money-back guarantee.</li>
          <li><strong>Answer.co.uk:</strong> no free trial, but its cheapest AI plan is £10 a month plus 85p a call, so a quiet month costs very little.</li>
        </ul>`,
        "A trial is worth using properly. Forward your real calls to it for a week, then read every call summary. That tells you more than any price table.",
        "You can also build your own using AI voice platforms. The software may have a free tier, but the phone line and AI usage are still paid, and the setup and testing take real time.",
      ],
    },
    {
      id: "worth-it",
      toc: "Is it worth it?",
      eyebrow: "Is it worth it?",
      heading: "Is an AI receptionist worth it for a small business?",
      band: "band-light",
      body: [
        "It is worth it if the work it saves is worth more than it costs, and only your own numbers can tell you that. A simple test:",
        `<ol>
          <li>Count the calls you miss in a normal fortnight.</li>
          <li>Estimate how many of those were real enquiries, not sales calls or wrong numbers.</li>
          <li>Multiply by how often an enquiry becomes a job, and by your typical job value.</li>
        </ol>`,
        "For example, if one extra £150 job a month comes from calls you would otherwise have missed, a plan around £70 a month pays for itself. If you rarely miss calls, or most callers leave a message and you ring back the same day, it may not.",
        "<h3>Costs to check before you sign up</h3>",
        checklist([
          "VAT. Most prices exclude it, so add 20% if you are not VAT-registered.",
          "Extra calls or minutes beyond your allowance.",
          "What counts as a call: spam, wrong numbers and very short calls may still be billed.",
          "Features on higher plans only, such as calendar booking, live transfer or more than one phone line.",
          "Add-on fees, such as SMS messages or transfers to a human service.",
          "Setup fees and minimum deposits.",
          "Your phone provider’s charges for forwarding calls to another number.",
          "Your time: writing approved answers and checking call summaries, especially in the first month.",
        ]),
      ],
    },
    {
      id: "what-we-charge",
      toc: "What we charge",
      eyebrow: "Our pricing",
      heading: "What we charge, and when a cheaper option is better",
      body: [
        `Our <a href="/ai-receptionist-middlesbrough">AI receptionist and website chat</a> is priced in two parts: a one-off setup fee, then the AI provider’s usage, passed on at cost and not marked up. The setup fee is on our <a href="/pricing">price list</a>, and the expected monthly usage is confirmed in writing before work starts.`,
        "The setup covers what a self-serve plan leaves to you: writing and agreeing the answers it may give, the handover rules, connecting your phone, website chat and calendar, and testing it before customers hear it. The same approved answers run on calls and on your website chat.",
        "If you are happy to write your own answers and set up call forwarding yourself, a self-serve plan like the ones above may be all you need, and it will cost less. A done-for-you setup makes more sense when you want calls and chat to give the same answers, need it connected to your booking system, or simply do not have the time.",
        `We set these up for businesses across <a href="/areas">Middlesbrough and the Tees Valley</a>. Not sure it would pay its way? Ask for a <a href="/free-website-audit">free audit</a> and we will tell you, including when the answer is no.`,
        "<h3>Sources (prices checked 27 October 2026)</h3>",
        `<ul>
          <li><a href="${answerCoUk}">Answer.co.uk: AI Virtual Receptionist</a></li>
          <li><a href="${fasthosts}">Fasthosts: AI Receptionist</a></li>
          <li><a href="${whoza}">Whoza: Pricing</a></li>
          <li><a href="${moneypenny}">Moneypenny: AI Receptionist</a></li>
          <li><a href="${allDayPa}">AllDayPA: call answering</a></li>
          <li><a href="${mbe}">Mail Boxes Etc: telephone answering</a></li>
          <li><a href="${livingWage}">GOV.UK: National Living Wage increases to £12.71 per hour</a></li>
        </ul>`,
      ],
    },
  ],
  relatedItems: [
    { href: "/ai-receptionist-middlesbrough", label: "Our AI receptionist and website chat", text: `Approved answers on calls and chat, with handover. ${price("ai-receptionist-website-chat")} setup.` },
    { href: "/resources/what-is-an-ai-receptionist", label: "What is an AI receptionist?", text: "How it works, what it should not do, and how it compares with an answering service." },
    { href: "/ai-agents-teesside", label: "AI agents explained", text: "Answering, booking and follow-up, and where AI should stop." },
  ],
  closing: {
    heading: "Not sure an AI receptionist would pay its way?",
    body: "Ask for a free audit. We look at how enquiries reach you now and tell you whether AI would help, or whether something simpler would do more.",
  },
});
