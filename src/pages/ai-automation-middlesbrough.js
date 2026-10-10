import { serviceSalesPage } from "../service-sales-page.js";
import { SERVICE_VISUALS as V } from "../service-visuals.js";

export default serviceSalesPage({
  path: "/ai-automation-middlesbrough",
  title: "AI Receptionist & Website Chat | Middlesbrough | Veltra Media",
  description:
    "An AI receptionist and website chat that answer common questions, capture enquiry details and book jobs into your calendar, 24/7, for businesses in Middlesbrough and Teesside.",
  breadcrumbName: "AI receptionist",
  serviceName: "AI receptionist and website chat",
  eyebrow: "AI receptionist & website chat",
  h1: "Missed Calls = Missed Money. Hire a 24/7 AI Receptionist for Less Than the Cost of Your Monthly Coffee Bill.",
  h1Highlight: "24/7 AI Receptionist",
  lede: "Every time a local lead goes to voicemail, they call your competitor. Our AI answers instantly, answers their questions, and books them onto your calendar while you sleep.",
  heroVisual: V.aiHero,
  priceNote: "AI provider usage is billed at cost.",
  points: [
    { label: "Deployed in 14 days", text: "Built, trained and live" },
    { label: "24/7/365", text: "Every chat and text answered instantly" },
    { label: "Never miss a lead", text: "Or we work for free" },
  ],
  cta: { label: "Book Your AI Automation Demo & Strategy Call" },
  proof: {
    heading: "The Employee That Never Sleeps.",
    visual: V.aiChat,
    cases: [
      {
        title: "Real Lead Captured",
        intro: "“Hey, do you do emergency callouts in Billingham?” → AI confirms, gives pricing, and books the appointment at 2:15 AM.",
        stats: [
          { label: "The Result", value: "£250", text: "That is £250 in revenue that would have been lost to a voicemail box." },
        ],
      },
    ],
  },
  problem: {
    heading: "You’re under a sink, on a roof, or having dinner with your family. Your phone rings. You can’t answer it. The customer hears your voicemail, hangs up, and immediately searches for the next business on Google.",
    body: "You just lost a £1,500 job because you were 3 minutes late to the phone. Hiring a human receptionist costs £25,000+ a year. Letting it go to voicemail is costing you even more.",
    visual: V.missedCall,
  },
  solution: {
    eyebrow: "Instant Lead Capture",
    heading: "Our AI is custom-trained on your specific business. It isn’t a dumb bot; it talks like a local.",
    highlight: "it talks like a local.",
    items: [
      {
        icon: "chat",
        title: "Instant Answering",
        text: "It answers every chat and text instantly, 24/7/365.",
      },
      {
        icon: "filter",
        title: "Smart Qualification",
        text: "It asks the customer what their problem is, where they live, and if they need it fixed today.",
      },
      {
        icon: "calendar",
        title: "Direct Booking",
        text: "It checks your actual calendar and books the job in a free slot automatically. You just wake up and see a new job on your schedule.",
      },
    ],
  },
  offer: {
    heading: "Here is everything included when you hire your 24/7 AI Employee:",
    highlight: "24/7 AI Employee:",
    items: [
      { icon: "users", title: "Custom-Trained AI Teesside Receptionist", text: "Trained on your specific business, pricing, and FAQs.", value: "£1,500/yr" },
      { icon: "chat", title: "Omnichannel Website Chat Integration", text: "Answers questions instantly on your site so visitors never bounce.", value: "£600" },
      { icon: "calendar", title: "Live Calendar Booking Sync", text: "The AI checks your availability and books jobs directly into your schedule.", value: "£800" },
      { icon: "filter", title: "Intelligent Lead Qualification Flow", text: "Filters out time-wasters and only books high-value local jobs.", value: "£500" },
    ],
  },
  bonuses: {
    items: [
      { icon: "phone", title: "Missed-Call-to-Text Automation", text: "If someone calls your actual phone and you miss it, the AI instantly texts them to start the booking process.", value: "£400" },
      { icon: "tool", title: "30 Days of Conversation Fine-Tuning", text: "We monitor the AI’s chats for the first month and tweak its brain to make it a lethal closer.", value: "£300" },
    ],
    total: "£4,100",
  },
  guarantee: {
    heading: "The “Never Miss a Lead” Guarantee",
    body: "We will build, train, and deploy your custom AI Receptionist in 14 days. If it doesn’t capture a lead you would have otherwise missed in your first 30 days, we’ll work for free.",
  },
  closing: {
    heading: "Stop losing £1,000 jobs because you were",
    highlight: "3 minutes late to the phone.",
  },
});
