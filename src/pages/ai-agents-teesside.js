// An overview, not a product: the offers and prices live on
// /ai-receptionist-middlesbrough and /crm-booking-automation. What this page
// says the products do is taken from api/chat.js, api/voice.js and those two
// pages. Keyword map: no "AI receptionist", "booking automation", "CRM" or
// "tradesmen" in the title or H1.
import { SERVICE_VISUALS as V } from "../service-visuals.js";
import { stackedPage } from "../stacked-page.js";

// "Choosing one": the .x-dec, .x-spec and .x-path blocks in assets/styles.css.
// Each problem: { problem, job, text }.
const decisions = [
  { problem: "You miss calls or website enquiries while you are busy or closed", job: "Answering calls and chats", text: "Answers, takes details and hands over to you." },
  { problem: "People want to book a time, or no-shows cost you money", job: "Booking and reminders", text: "Offers free slots and reminds people the day before." },
  { problem: "Quotes go out and then go quiet", job: "Quote follow-up", text: "A polite, agreed reminder after a set number of days." },
  { problem: "Writing and admin eat into your evenings", job: "A general assistant, such as ChatGPT", text: "Helps you write and organise. It does not answer your customers." },
];
const decisionList = `<ul class="x-dec">${decisions
  .map((item) => `<li><div class="x-if"><b>If</b>${item.problem}</div><div class="x-arrow" aria-hidden="true"></div><div class="x-then"><strong>${item.job}</strong><span>${item.text}</span></div></li>`)
  .join("")}</ul>`;

// From the simplest option to the most tailored: { name, text, bestFor, watch }.
const options = [
  { name: "Off-the-shelf tool", text: "A monthly subscription you set up yourself.", bestFor: "Simple needs, and owners with time to set it up", watch: "You write the answers and test it yourself" },
  { name: "Done-for-you setup", text: "A provider builds, connects and tests it, then you pay for usage.", bestFor: "Owners who want it right without learning the tool", watch: "Check what happens when it does not know an answer" },
  { name: "Custom-built agent", text: "Built around your own systems and process.", bestFor: "Unusual workflows, or several systems to connect", watch: "Higher cost and a longer build; only worth it when simpler options fall short" },
];
const optionScale = `<div class="x-spec">
          <div class="x-ends" aria-hidden="true"><span>Simpler and cheaper</span><span>More tailored, more cost</span></div>
          <div class="x-stops">${options
            .map((item) => `<div class="x-stop"><strong>${item.name}</strong><p>${item.text}</p><dl><dt>Best for</dt><dd>${item.bestFor}</dd><dt>Watch out for</dt><dd>${item.watch}</dd></dl></div>`)
            .join("")}</div>
        </div>`;

export default stackedPage({
  path: "/ai-agents-teesside",
  title: "AI Agents & AI Automation in Teesside | Veltra Media",
  description:
    "AI agents for Teesside small businesses, explained plainly: answering enquiries, qualifying leads, booking and follow-up, with human handover and UK GDPR.",
  breadcrumbs: [
    { name: "Services", path: "/services" },
    { name: "AI agents Teesside", path: "/ai-agents-teesside" },
  ],
  serviceName: "AI agents and AI automation for small businesses",
  serviceType: "AI automation",
  eyebrow: "AI agents · Middlesbrough & Teesside",
  h1: "AI agents for Teesside businesses: answering, booking and follow-up",
  lede: "An AI agent is software that does one job in your business, such as replying to an enquiry at 10pm or reminding a customer about tomorrow’s appointment. Here is what that can sensibly do for a local business, and where it should stop.",
  hero: {
    image: V.aiChat,
    caption:
      "Illustration: a fictional plumbing business, not a real customer conversation.",
  },
  sections: [
    {
      eyebrow: "What an AI agent is",
      heading: "Not a robot employee. A few defined jobs, with rules attached.",
      body: [
        "For a small business, a useful definition of an AI agent is narrow: a program that reads or hears what a customer says, answers from information you have approved, and takes one agreed next step. Most AI automation that helps a local business comes down to four jobs:",
        `<ul>
          <li><strong>Answering enquiries.</strong> Replying straight away, in chat or on a call, with your real services, areas, hours and prices.</li>
          <li><strong>Qualifying leads.</strong> Asking what you would ask: what the job is, where, and how urgent, so you get a usable enquiry instead of “call me”.</li>
          <li><strong>Booking.</strong> Offering times or booking into your calendar, where your setup supports it.</li>
          <li><strong>Follow-up.</strong> A reminder before an appointment, a nudge on a quote, a review request afterwards.</li>
        </ul>`,
        `The first three are what our <a href="/ai-receptionist-middlesbrough">AI receptionist</a> and website chat is built to do. Follow-up, reminders and keeping every enquiry in one place sit in <a href="/crm-booking-automation">booking and CRM automation for small businesses</a>. Both have a fixed scope and a published price.`,
      ],
    },
    {
      eyebrow: "Use cases by trade",
      heading: "What it looks like in four kinds of local business.",
      band: "band-light",
      body: [
        "These show how the jobs fit together. They are illustrations, not client stories.",
        "<h3>Electrician</h3><p>A homeowner messages at 9pm: half the sockets have stopped working. The agent asks the postcode and whether they need someone today, then passes that to you with their number. It does not try to diagnose the fault.</p>",
        "<h3>Clinic</h3><p>Someone asks whether a treatment would suit them. The agent gives your approved general information and offers a consultation; anything clinical is left to a qualified person.</p>",
        "<h3>Salon</h3><p>A client wants a cut and colour on Saturday. The agent says how long it takes, offers the times you have opened up, and a reminder goes out the day before to help cut no-shows.</p>",
        `<h3>Joiner</h3><p>Someone wants a new staircase. The agent takes rough sizes, the area and the timescale, and says you will arrange a visit. If your quote goes unanswered, a follow-up goes out. More on this in <a href="/web-design-for-trades-teesside">website design for trades</a>.</p>`,
      ],
    },
    {
      eyebrow: "Where to draw the line",
      heading: "What AI should do, and what it should leave to you.",
      body: [
        `<p><strong>It should:</strong></p>
        <ul>
          <li>answer common questions from answers you have signed off;</li>
          <li>collect the details you need to quote or call back;</li>
          <li>say plainly when it does not know, and hand over;</li>
          <li>send the reminders and follow-ups people have agreed to.</li>
        </ul>`,
        `<p><strong>It should not:</strong></p>
        <ul>
          <li>invent prices, availability or promises;</li>
          <li>give professional, clinical, legal, financial or safety advice;</li>
          <li>ask for card details, passwords or health information;</li>
          <li>pretend to be a person.</li>
        </ul>`,
      ],
    },
    {
      eyebrow: "Human handover",
      heading: "Every agent needs a rule for when a person takes over.",
      band: "band-light",
      body: [
        "Before launch you decide when the agent stops: a question outside its approved answers, an unhappy customer, a large job, anything to do with safety. Then it says so, takes the customer’s details and passes the enquiry to you.",
        "Our own website chat works like this. It answers only from the site’s content, says when it is not sure, and saves someone’s details only after they have agreed to be contacted. Saved enquiries land on a dashboard and the team gets an email.",
      ],
    },
    {
      eyebrow: "Data protection",
      heading: "UK GDPR basics before you switch anything on.",
      body: [
        "An AI agent handles personal data, so UK GDPR applies just as it does to your enquiry form. The basics:",
        `<ul>
          <li><strong>Tell people they are talking to an AI.</strong> On our own site, the chat and the voice button are both labelled as an AI assistant.</li>
          <li><strong>Explain it in your privacy notice:</strong> what is collected, why, how long it is kept, and that conversations may be stored or transcribed.</li>
          <li><strong>Collect only what the enquiry needs.</strong> No card details or health information in a chat.</li>
          <li><strong>Keep “contact me about this” separate from marketing.</strong> Agreeing to a call back is not agreeing to a newsletter.</li>
          <li><strong>Know who processes the data.</strong> The AI provider processes conversations on your behalf.</li>
        </ul>`,
        "This is a starting point, not legal advice. The Information Commissioner’s Office publishes guidance for small businesses.",
      ],
    },
    {
      eyebrow: "Choosing one",
      heading: "Which AI agents are best for a small business?",
      className: "x-sec",
      body: [
        "The best AI agent is the one that fixes the job you lose most work on. Find your problem on the left.",
        decisionList,
        "<h3>Off-the-shelf, done-for-you or custom?</h3>",
        optionScale,
        '<ol class="x-path"><li><i aria-hidden="true">1</i>Start with one job</li><li><i aria-hidden="true">2</i>Check it wins back work</li><li><i aria-hidden="true">3</i>Add the next</li></ol>',
      ],
    },
  ],
  faqs: [
    {
      q: "What is the difference between an AI agent and a chatbot?",
      a: "<p>Mostly the word. Older chatbots followed fixed menus; an AI agent understands free text or speech and can take a step, such as saving an enquiry. What it may say, and when it hands over, matters more.</p>",
    },
    {
      q: "I’m a sole trader. Do I need an AI agent?",
      a: "<p>Not necessarily. If you answer most calls the same day, a clear website and Google Business Profile may matter more. AI helps most when enquiries arrive while you are busy or after hours.</p>",
    },
    {
      q: "Will customers know they are talking to an AI?",
      a: "<p>They should. We recommend saying so at the start of every chat or call. It is honest, it sets expectations, and transparency is a core principle of UK GDPR.</p>",
    },
    {
      q: "Can an AI agent take payments?",
      a: "<p>Ours does not take payments or card details. If you take deposits, that belongs on a proper payment page, not in a conversation.</p>",
    },
    {
      q: "How much does it cost?",
      a: '<p>The AI receptionist and website chat is £199 setup, with the AI provider’s usage passed on at cost. Booking and CRM automation is £199 setup. Both exclude VAT; see the <a href="/pricing">price list</a>.</p>',
    },
    {
      q: "Do you work with businesses outside Middlesbrough?",
      a: '<p>Yes. We are based in Middlesbrough and work across the Tees Valley, mostly online; see the <a href="/areas">areas we serve</a>. We also work with businesses elsewhere in the UK.</p>',
    },
    {
      q: "What can an AI agent do for my business?",
      a: '<p>For most local businesses, a few defined jobs: answering common questions from approved answers, taking the details you need to quote or call back, offering times where it is connected to your calendar, and sending agreed reminders and follow-ups. It hands anything outside those jobs to a person. See our <a href="/ai-receptionist-middlesbrough">AI receptionist and website chat</a> and <a href="/crm-booking-automation">booking and CRM automation</a>.</p>',
    },
    {
      q: "How do I start using AI agents?",
      a: "<p>Start with one job, not a whole system. Pick where you lose the most work, such as missed calls or quotes nobody follows up, and write down the questions customers ask and the answers you would give. Then decide when a person should take over. Those answers are most of the setup work, whichever tool you use.</p>",
    },
    {
      q: "Is ChatGPT an AI agent?",
      a: "<p>Not on its own. ChatGPT is a general assistant you talk to yourself. A business AI agent uses the same kind of technology but is set up for one job: it answers your customers from approved information, takes an agreed step such as saving an enquiry, and hands over to you by set rules.</p>",
    },
    {
      q: "Are there free AI agents for business?",
      a: "<p>General assistants such as ChatGPT have free plans, and you can use them yourself for writing and admin. An agent that answers your customers is different: it needs a phone line or website connection, your approved answers and testing, and the AI behind it charges for usage. Free trials exist, but running one for customers costs something.</p>",
    },
    {
      q: "What is an AI voice agent?",
      a: '<p>An AI agent that answers phone calls and talks to the caller, instead of replying in a chat box. It should say it is an AI at the start, answer from approved information, take the caller’s details and hand over when needed. Our <a href="/ai-receptionist-middlesbrough">AI receptionist</a> can answer calls as well as website chat; the phone connections supported for your setup are confirmed in writing before work begins.</p>',
    },
    {
      q: "When is a custom AI agent worth it?",
      a: "<p>When your process is unusual, or the agent needs to work across several systems that off-the-shelf tools cannot connect to. For most local businesses, an off-the-shelf tool or a done-for-you setup does the job for far less, so start there.</p>",
    },
  ],
  relatedSections: [
    {
      heading: "Where the actual offers are",
      items: [
        {
          href: "/ai-receptionist-middlesbrough",
          label: "AI receptionist and website chat",
          text: "Approved answers, enquiry capture after hours and handover. £199 setup.",
        },
        {
          href: "/crm-booking-automation",
          label: "Booking and CRM automation",
          text: "Every enquiry in one place, reminders and quote follow-up. £199 setup.",
        },
        {
          href: "/web-design-for-trades-teesside",
          label: "Websites for trades",
          text: "What the website around the chat needs.",
        },
        {
          href: "/resources/what-is-an-ai-receptionist",
          label: "What is an AI receptionist?",
          text: "How one handles a call, and how it compares with voicemail or an answering service.",
        },
      ],
    },
  ],
  closing: {
    heading: "Not sure AI would help your business at all?",
    body: "Ask for a free audit. We will look at how enquiries reach you now and tell you whether AI would help, or something simpler would do more.",
  },
});
