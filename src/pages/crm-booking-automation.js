import { serviceSalesPage } from "../service-sales-page.js";
import { SERVICE_VISUALS as V } from "../service-visuals.js";

export default serviceSalesPage({
  path: "/crm-booking-automation",
  title: "CRM, Booking & Follow-up Automation | Teesside | Veltra Media",
  description:
    "Automated quote follow-up, self-serve booking, job reminders and one lead dashboard, so fewer good enquiries disappear between first contact and booked work.",
  breadcrumbName: "CRM & booking automation",
  serviceName: "CRM, booking and follow-up automation",
  eyebrow: "CRM & booking automation",
  h1: "Stop Losing Jobs Because You Forgot to Follow Up. Automate Your Lead Chasing and Get Your Evenings Back.",
  h1Highlight: "Get Your Evenings Back.",
  lede: "You did the hard work to get the lead. Don’t lose the money because it got lost in a spreadsheet or a sticky note. We automate your entire sales pipeline.",
  heroVisual: V.crmHero,
  points: [
    { label: "Launched in 14 days", text: "Your automated CRM pipeline" },
    { label: "10+ hours a week", text: "of admin work saved, or we work for free" },
    { label: "Zero manual admin", text: "Follow-ups and reminders run themselves" },
  ],
  cta: { label: "Book Your Pipeline Scaling Strategy Call" },
  proof: {
    heading: "From Chaos to Clockwork.",
    visual: V.pipeline,
    cases: [
      {
        title: "Automated Follow-Up",
        stats: [
          { label: "Before Veltra", value: "40%", text: "of quotes sent were never followed up on." },
          { label: "After Veltra", value: "65%", text: "Automated SMS follow-ups increased quote-acceptance rate by 65%. Zero manual admin required." },
        ],
      },
    ],
  },
  problem: {
    heading: "If you are running your local business out of your email inbox, an Excel sheet, and text messages on your personal phone, you are capping your income.",
    body: "You send out a quote on Tuesday. You get busy on Wednesday. By Friday, you forgot to follow up. On Monday, you finally text them, only to hear: “Sorry mate, we already went with someone else.” That is the sound of thousands of pounds slipping through the cracks because your admin is a mess.",
    visual: V.messyAdmin,
  },
  solution: {
    eyebrow: "The Automated Revenue Engine",
    heading: "We build a robust, invisible backend that runs your admin for you.",
    highlight: "runs your admin for you.",
    items: [
      {
        icon: "refresh",
        title: "The Relentless Follow-Up",
        text: "When you send a quote, our system automatically texts and emails the customer 2, 5, and 7 days later until they say yes.",
      },
      {
        icon: "layout",
        title: "One Central Hub",
        text: "Every call, text, and email from a client is logged in one simple dashboard. You know exactly where every penny is.",
      },
      {
        icon: "bell",
        title: "Automated Reminders",
        text: "It automatically texts your clients 24 hours before a job so you never show up to an empty house again.",
      },
    ],
  },
  offer: {
    heading: "Here is the exact architecture you get with the Automated Revenue Engine:",
    highlight: "Automated Revenue Engine:",
    items: [
      { icon: "chart", title: "Centralized Lead Command Dashboard", text: "Every lead, text, call, and quote organized in one single view.", value: "£2,000" },
      { icon: "refresh", title: "The “Relentless Follow-Up” Sequence", text: "Automated SMS and email follow-ups to close quotes you sent days ago.", value: "£1,200" },
      { icon: "calendar", title: "Self-Serve Client Booking System", text: "Let clients pick their own times without the back-and-forth messaging.", value: "£800" },
      { icon: "bell", title: "Automated Pre & Post-Job SMS Reminders", text: "Kills your no-show rate and asks for reviews automatically.", value: "£600" },
    ],
  },
  bonuses: {
    items: [
      { icon: "database", title: "Done-For-You Data Migration", text: "We will take your messy excel sheets and sticky notes and upload them into the new system for you.", value: "£500" },
      { icon: "users", title: "1-on-1 Team Onboarding Session", text: "We will personally train you and your team on how to use the dashboard so you hit the ground running.", value: "£400" },
    ],
    total: "£5,500",
  },
  guarantee: {
    heading: "The “Get Your Evenings Back” Guarantee",
    body: "We will architect and launch your automated CRM pipeline in 14 days. If it doesn’t save you at least 10 hours of admin work a week, we work for free until it does.",
  },
  closing: {
    heading: "Ready to scale your business",
    highlight: "without drowning in admin?",
  },
});
