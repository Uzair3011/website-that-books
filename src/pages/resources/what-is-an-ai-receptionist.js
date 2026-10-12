// Keyword map: owns "what is an AI receptionist". No Middlesbrough or "UK
// small business" in the title or H1 (the service page owns those), and no
// "AI agents" as a target. What our own service does is taken from
// assets/catalog.js and /ai-receptionist-middlesbrough. No legal advice: the
// UK GDPR points are the same general ones /ai-agents-teesside already makes.
import { catalogItem } from "../../../assets/catalog.js";
import { articlePage, checklist, price, table } from "../../article-page.js";

const growth = catalogItem("growth-launch-package");

export default articlePage({
  slug: "what-is-an-ai-receptionist",
  title: "What Is an AI Receptionist? A Plain Guide | Veltra Media",
  description:
    "What an AI receptionist is, how it answers calls and chats, what it can and cannot do, how it compares with an answering service, and what to check first.",
  shortName: "What is an AI receptionist?",
  kind: "Explainer",
  summary: "How it answers calls and chats, what it should and should not do, and how it compares with an answering service.",
  eyebrow: "Explainer · AI for local businesses",
  h1: "What is an AI receptionist, and what can it actually do?",
  published: "2026-10-13",
  intro: [
    "What is an AI receptionist? It is software that answers your phone calls or website chat when you cannot, using information you have approved. It greets the customer, answers common questions, takes the details you need and passes the enquiry to you. This guide explains how it works, where it helps, where it should stop, and what to sort out before you switch one on. It is written by people who sell one, so we have tried to be plain about the limits too.",
  ],
  sections: [
    {
      id: "definition",
      toc: "The plain definition",
      eyebrow: "The plain definition",
      heading: "What is an AI receptionist, in plain terms?",
      body: [
        "An AI receptionist listens to or reads what a customer says, works out what they want, and replies in natural language. Unlike an old phone menu, the customer does not press buttons; they just talk or type. Unlike a voicemail, it can answer questions and ask its own.",
        "It is useful to be clear about what it is not:",
        `<ul>
          <li><strong>It is not a person.</strong> It should say it is an AI assistant at the start, and never pretend otherwise.</li>
          <li><strong>It is not an expert.</strong> It knows what you tell it. It should not give professional, legal, financial, clinical or safety advice.</li>
          <li><strong>It is not a replacement for you.</strong> Its job is to make sure an enquiry is not lost, then hand it to a person.</li>
        </ul>`,
        `For the wider picture of what AI can do in a small business, from answering to booking and follow-up, see our overview of <a href="/ai-agents-teesside">AI agents for local businesses</a>.`,
      ],
    },
    {
      id: "how-it-works",
      toc: "How it works",
      eyebrow: "How it works",
      heading: "How an AI receptionist handles a call, step by step.",
      band: "band-light",
      body: [
        "Every setup differs in detail, but a typical call goes like this:",
        `<ol>
          <li><strong>The call reaches it.</strong> Usually your calls are forwarded to it when you do not answer, or outside your hours. On a website, the same thing happens in a chat box.</li>
          <li><strong>It introduces itself</strong> as your business’s AI assistant.</li>
          <li><strong>It listens and answers</strong> from the facts you have approved: services, areas, hours, prices or starting prices, what happens next.</li>
          <li><strong>It asks what you would ask:</strong> what the job is, where, how urgent, and the best way to call back.</li>
          <li><strong>It takes the next agreed step,</strong> such as saving the enquiry, or offering a time if it is connected to your calendar.</li>
          <li><strong>It hands over.</strong> You get the details, and anything it could not answer is flagged for you.</li>
        </ol>`,
        "The part that takes the most care is not the technology. It is agreeing exactly what it may say. You give it:",
        table({
          head: ["You provide", "Why it matters"],
          rows: [
            ["Your services and what is not included", "So it does not agree to work you do not do"],
            ["The areas you cover", "So it can answer “do you come out to…?” correctly"],
            ["Prices, or how you price", "So it gives a straight answer or says when a visit is needed"],
            ["Your hours and response times", "So it sets honest expectations"],
            ["Handover rules", "So it knows when to stop and pass the enquiry to you"],
          ],
        }),
      ],
    },
    {
      id: "can-and-cannot",
      toc: "What it can and cannot do",
      eyebrow: "Strengths and limits",
      heading: "What an AI receptionist is good at, and what it should leave alone.",
      body: [
        table({
          head: ["Good at", "Should leave to a person"],
          rows: [
            ["Answering the same factual question many times a week", "Diagnosing a fault or giving professional advice"],
            ["Being available in the evening and at weekends", "Agreeing a price for an unusual or large job"],
            ["Taking a name, number, job and location every time", "Handling a complaint or an upset customer"],
            ["Giving every caller the same, approved answer", "Anything involving safety or an emergency"],
            ["Offering times, where connected to a calendar", "Taking card details or payments"],
          ],
        }),
        "It also cannot fix a business problem that is not about answering. If enquiries are lost because quotes go unanswered or nobody follows up, the receptionist is only half the fix.",
      ],
    },
    {
      id: "compared",
      toc: "Compared with the alternatives",
      eyebrow: "The alternatives",
      heading: "AI receptionist, answering service or voicemail?",
      band: "band-light",
      body: [
        "Most small businesses choose between three options when they cannot answer the phone. Each has a place:",
        table({
          head: ["", "Voicemail", "Human answering service", "AI receptionist"],
          rows: [
            ["Answers questions", "No", "Yes, from a script", "Yes, from approved answers"],
            ["Available out of hours", "Yes, but only records", "Depends on the plan", "Yes, if set up to"],
            ["Unusual or emotional calls", "No", "Usually better", "Should hand over"],
            ["Same answer every time", "Not applicable", "Depends on the person", "Yes, if the answers are right"],
            ["Website chat too", "No", "Sometimes, separately", "Can use the same answers"],
            ["How it is usually priced", "Often included with your phone", "Monthly fee or per call", "Setup, plus usage"],
          ],
        }),
        "Some callers will not leave a voicemail and will simply try the next business instead. If that is where you lose work, either a human service or an AI receptionist is an improvement. A human service is often the better choice for sensitive calls. An AI receptionist suits businesses with lots of repetitive questions and enquiries outside working hours.",
      ],
    },
    {
      id: "is-it-for-you",
      toc: "Is it right for you?",
      eyebrow: "Honest fit",
      heading: "Signs it would help, and signs it would not.",
      body: [
        "<h3>It is likely to help if</h3>",
        checklist([
          "You regularly miss calls because you are on a job, driving or with a client.",
          "Enquiries arrive in the evening and at weekends.",
          "You answer the same five or ten questions over and over.",
          "Customers often ask whether you cover their area or what a job roughly costs.",
        ]),
        "<h3>It probably will not help if</h3>",
        `<ul>
          <li>You, or someone on your team, answer almost every call already.</li>
          <li>You get only a few calls a week.</li>
          <li>Every enquiry needs a long, expert conversation before anything else can happen.</li>
        </ul>`,
        "If you are not sure, count your missed calls for two weeks before deciding anything.",
      ],
    },
    {
      id: "before-you-start",
      toc: "Before you switch one on",
      eyebrow: "Before you switch one on",
      heading: "A checklist before you switch an AI receptionist on.",
      band: "band-light",
      body: [
        checklist([
          "Write and approve the answers it may give, including what it should say when it does not know.",
          "Agree the handover rules: complaints, emergencies, large jobs, anything outside its answers.",
          "Make sure it says it is an AI assistant at the start of every call and chat.",
          "Update your privacy notice to explain what is collected, why, how long it is kept, and whether calls are recorded or transcribed.",
          "Collect only what the enquiry needs. No card details or health information.",
          "Know which company provides the AI and processes the conversations on your behalf.",
          "Test it with a few friends before customers hear it.",
          "Read the conversations every week for the first month and correct its answers.",
        ]),
        "The privacy points are general good practice under UK GDPR, not legal advice. The Information Commissioner’s Office publishes guidance for small businesses if you need more.",
      ],
    },
    {
      id: "cost",
      toc: "What it costs",
      eyebrow: "Cost",
      heading: "How AI receptionists are usually priced.",
      body: [
        "Most are priced in two parts: a setup cost for writing the answers, connecting your phone, website or calendar and testing; then an ongoing usage cost from the AI provider, which rises and falls with the number of conversations.",
        `Our <a href="/ai-receptionist-middlesbrough">AI receptionist and website chat</a> is ${price("ai-receptionist-website-chat")} setup, excluding VAT, with the AI provider’s usage passed on at cost and confirmed in writing before work starts. It is also part of the ${growth.name} at ${price("growth-launch-package")}, alongside a website, local SEO and <a href="/crm-booking-automation">booking and follow-up automation</a>. Every price is on our <a href="/pricing">published price list</a>, and we set it up for businesses across <a href="/areas">Middlesbrough and the Tees Valley</a>.`,
      ],
    },
    {
      id: "this-week",
      toc: "What to do this week",
      eyebrow: "What to do this week",
      heading: "Three things to do this week, before you buy anything.",
      band: "band-light",
      body: [
        `<ol>
          <li><strong>Count your missed calls</strong> for the next fortnight, and note the time of day of each one.</li>
          <li><strong>Write down the ten questions</strong> customers ask most, with your best short answer to each.</li>
          <li><strong>Decide your handover rule:</strong> the situations where you always want a person to call back.</li>
        </ol>`,
        "Those three lists are most of the work of setting one up. Even if you decide against it, the answers make a good FAQ for your website.",
      ],
    },
  ],
  relatedItems: [
    { href: "/ai-receptionist-middlesbrough", label: "Our AI receptionist and website chat", text: `Approved answers on calls and chat, with handover. ${price("ai-receptionist-website-chat")} setup.` },
    { href: "/ai-agents-teesside", label: "AI agents explained", text: "Answering, booking and follow-up, and where AI should stop." },
    { href: "/crm-booking-automation", label: "Booking and follow-up automation", text: "Reminders, quote follow-up and every enquiry in one place." },
  ],
  closing: {
    heading: "Not sure an AI receptionist would pay its way?",
    body: "Ask for a free audit. We look at how enquiries reach you now and tell you whether AI would help, or whether something simpler would do more.",
  },
});
