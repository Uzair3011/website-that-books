// Keyword map: owns "AI receptionist for dentists", with the dental practice,
// clinics, beauty salons and aesthetics clinics variants. It must not take
// "AI receptionist Middlesbrough" or "AI receptionist UK small business" (the
// service page), "AI receptionist Teesside" (the trades guide) or "med spa"
// (/med-spa-growth-system, which keeps "AI receptionist for med spas") in its
// title or H1. Written to docs/seo/article-template.md on the trades guide's
// layout. The worked missed-enquiry figures are an example, not a client's
// results, and every claim about our setup must match
// /ai-receptionist-middlesbrough, /resources/what-is-an-ai-receptionist or
// /ai-agents-teesside. Our own price is read from assets/catalog.js. No
// prescription-only medicines or injectable products are named. The cards,
// note boxes and spacing are styled under body.page-guide-cards in
// assets/styles.css, shared with the trades guide.
import {
  GUIDE_ICONS,
  articlePage,
  calculation,
  iconCards,
  lineIcon,
  noteBox,
  panel,
  price,
  steps,
  ticks,
} from "../../article-page.js";

const setup = price("ai-receptionist-website-chat");

const ICONS = {
  tooth: lineIcon('<path d="M7 3C4.8 3 3 4.8 3 7.2c0 2 .8 3.4 1.5 5 .7 1.6 1 3.3 1.3 5.3.3 2 .9 3.5 2 3.5 1.3 0 1.6-1.6 2-3.4.3-1.4.8-2.6 2.2-2.6s1.9 1.2 2.2 2.6c.4 1.8.7 3.4 2 3.4 1.1 0 1.7-1.5 2-3.5.3-2 .6-3.7 1.3-5.3.7-1.6 1.5-3 1.5-5C21 4.8 19.2 3 17 3c-1.9 0-3 1-5 1S8.9 3 7 3z"/>'),
  sparkle: lineIcon('<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0l1.58 6.13a2 2 0 0 0 1.44 1.44l6.13 1.58a.5.5 0 0 1 0 .96l-6.13 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/><path d="M20 3v4M22 5h-4"/>'),
  flower: lineIcon('<circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/><path d="M12 7.5V9M7.5 12H9M16.5 12H15M12 16.5V15"/>'),
  ...GUIDE_ICONS,
};

const cards = (kind, items) => iconCards(kind, items.map((item) => ({ ...item, icon: ICONS[item.icon] })));

export default articlePage({
  slug: "ai-receptionist-for-clinics",
  title: "AI Receptionist for Dental and Beauty Clinics | Veltra Media",
  description:
    "How an AI receptionist answers calls and chats for dental, beauty and aesthetics clinics in Teesside, what it handles, what it will not, and what it costs.",
  shortName: "AI receptionist for clinics",
  kind: "Guide",
  summary: "How an AI receptionist helps dental, beauty and aesthetics clinics answer every enquiry without handling health details.",
  eyebrow: "Guide · AI for clinics",
  h1: "AI Receptionist for Dental, Beauty and Aesthetics Clinics: Book More Consultations Without Missing Calls",
  published: "2026-10-29",
  intro: [
    "In a busy clinic, the phone rings when everyone is with a patient or client. Someone asking about whitening, a skin treatment or a new patient appointment gets voicemail, and books with the next clinic that answers. Evening enquiries on your website often wait until morning, when they may have already booked elsewhere.",
    `<aside class="article-summary" aria-labelledby="short-answer-title">
          <p class="eyebrow" id="short-answer-title">The short answer</p>
          <p>An AI receptionist answers your clinic’s calls and website chats when your team cannot, gives approved answers about treatments, prices and opening hours, offers consultation times where it is connected to your calendar, and passes anything clinical to your team. It never gives clinical advice or collects health details. Ours is ${setup} setup, with the AI provider’s usage passed on at cost, for clinics across Middlesbrough, Stockton, Redcar, Hartlepool and <a href="/areas">the rest of Teesside</a>.</p>
        </aside>`,
  ],
  sections: [
    {
      id: "the-real-cost",
      toc: "The consultation that never gets booked",
      eyebrow: "The real cost",
      heading: "The real cost is the consultation that never gets booked",
      body: [
        "For clinics, a missed call is often a new patient or client who was ready to book. If they book somewhere else, that first appointment is gone.",
        calculation({
          tag: "Example",
          items: [
            { figure: "15", label: "missed enquiries a month" },
            { figure: "3", label: "would have booked a consultation" },
            { figure: "£250", label: "average first treatment" },
            { figure: "£750", label: "of treatment a month going elsewhere" },
          ],
        }),
        `<p class="article-note">These are example figures, not a client’s results. To work out your own, count missed calls and unanswered website enquiries over two weeks, estimate how many would have booked, and multiply by your average first treatment value.</p>`,
        `<p class="article-takeaway">If it books even one extra consultation a month, it has more than covered its ${setup} setup.</p>`,
      ],
    },
    {
      id: "how-it-works",
      toc: "What it does for a clinic",
      eyebrow: "How it works",
      heading: "What an AI receptionist does for a clinic",
      band: "band-light",
      body: [
        steps([
          "<span><strong>Answers straight away</strong><br>During appointments, at lunch and after hours, so nobody hears voicemail.</span>",
          "<span><strong>Answers common questions</strong><br>Opening hours, location, parking and prices, from answers your clinic approved.</span>",
          "<span><strong>Explains treatments in general terms</strong><br>Only the approved description of what you offer, never advice for the caller.</span>",
          "<span><strong>Offers consultation times</strong><br>Straight into your calendar where it is connected, or takes details for your team.</span>",
          "<span><strong>Takes only what is needed</strong><br>Name, contact details and the treatment they are interested in, nothing medical.</span>",
          "<span><strong>Passes on clinical questions</strong><br>Anything about symptoms, suitability or aftercare goes straight to your team.</span>",
        ]),
      ],
    },
    {
      id: "who-it-suits",
      toc: "Is it right for your clinic?",
      eyebrow: "Who it suits",
      heading: "Is it right for dental, beauty and aesthetics clinics?",
      body: [
        "It works best for clinics where the team is with patients or clients when the phone rings.",
        cards("clinics", [
          { icon: "tooth", title: "Dental practices", text: "New patient enquiries, private treatments such as whitening and implant consultations, and questions about availability." },
          { icon: "sparkle", title: "Aesthetics clinics", text: "Consultation enquiries, treatment prices from your approved list, and booking first appointments." },
          { icon: "flower", title: "Beauty salons and skin clinics", text: "Booking requests, opening hours and questions about patch tests or how long a treatment takes." },
        ]),
        noteBox("It is less useful for NHS-only practices that must book through a fixed system, or where every call needs to be triaged by a clinician."),
      ],
    },
    {
      id: "limits",
      toc: "What it will not do",
      eyebrow: "Patient data and limits",
      heading: "What it will not do",
      band: "band-light",
      body: [
        "Clinics handle sensitive information, so a good setup is clear about what stays with your team.",
        cards("limits", [
          { icon: "cross", title: "No clinical advice", text: "It does not diagnose, recommend treatments or answer suitability and aftercare questions. Those go to your team." },
          { icon: "cross", title: "No health details collected", text: "It takes only a name, contact details and the treatment someone is interested in. No medical history." },
          { icon: "cross", title: "No payments or card details", text: "Deposits belong on a proper payment page, not in a call or chat." },
          { icon: "cross", title: "No pretending to be human", text: "It says it is an AI assistant at the start of every call and chat." },
        ]),
        noteBox(
          'Under UK GDPR, health information needs extra care. Update your privacy notice to explain what is collected and why, and know which company processes the conversations. This is general guidance, not legal advice; <a href="https://ico.org.uk/for-organisations/advice-for-small-organisations/">the ICO publishes guidance for small organisations</a>.',
        ),
      ],
    },
    {
      id: "price",
      toc: "Price and what you get",
      eyebrow: "Our price",
      heading: "Price and what you get",
      body: [
        // "AI receptionist" is already the in-sentence anchor to the service
        // page three times across the site (the limit), so only
        // "receptionist" is linked here.
        panel({
          figure: setup,
          body: [
            `Our AI <a href="/ai-receptionist-middlesbrough">receptionist</a> and website chat is ${setup} setup, excluding VAT. The AI provider’s usage is passed on at cost, not marked up, and the expected monthly figure is confirmed in writing before work starts.`,
            ticks([
              "Trained on your treatments, prices, hours and location",
              "Website chat using the same approved answers",
              "Consultation booking, where your calendar supports it",
              "Handover rules for anything clinical",
              "Only the details an enquiry needs",
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
      toc: "Questions clinics ask before they buy",
      eyebrow: "Before you buy",
      heading: "Questions clinics ask before they buy",
      band: "band-light",
      body: [],
      faq: [
        {
          q: "Can it book into my practice software?",
          a: "<p>It books into calendars we can connect to, and which ones are supported for your clinic is confirmed in writing before work begins. If your software is not supported, it takes the details so your team can book the appointment.</p>",
        },
        {
          q: "Is it GDPR compliant?",
          a: "<p>It is set up to collect only what an enquiry needs, with no health details, and to say it is an AI assistant. You stay responsible for your privacy notice, and we tell you which company processes the conversations. This is not legal advice.</p>",
        },
        {
          q: "Can it answer questions about treatments?",
          a: "<p>It gives the general descriptions and prices your clinic has approved. Anything about whether a treatment suits someone, side effects or aftercare goes to your team.</p>",
        },
        {
          q: "Will it replace my receptionist?",
          a: "<p>No. It covers the calls and chats your team cannot get to, such as during appointments, at lunch and after hours, and passes everything else to them.</p>",
        },
        {
          q: "Is there an AI receptionist near me in Teesside?",
          a: "<p>Yes. We are based in Middlesbrough and set up AI receptionists for clinics across Stockton, Redcar, Hartlepool, Billingham and the rest of the Tees Valley, mostly online, with meetings in person around Teesside if you prefer.</p>",
        },
      ],
    },
  ],
  relatedLinks: `For aesthetics clinics, see our <a href="/med-spa-growth-system">med-spa growth system</a>. To cut no-shows, add <a href="/crm-booking-automation">booking reminders and follow-up</a>. For the basics, read <a href="/resources/what-is-an-ai-receptionist">what an AI receptionist is</a>.`,
  // The audit form has no way to preselect a service from the link, so this is the plain link.
  closing: {
    heading: "See what an AI receptionist could handle for your clinic",
    body: "Tell us your treatments, your opening hours and roughly how many calls and enquiries you miss. We will show you what it would answer, what it would pass to your team, and whether it is worth it for your clinic.",
    button: "See what it could handle",
  },
  readingLayout: true,
  bodyClass: "page-guide-cards",
});
