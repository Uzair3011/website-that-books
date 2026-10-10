import { serviceSalesPage } from "../service-sales-page.js";
import { SERVICE_VISUALS as V } from "../service-visuals.js";

export default serviceSalesPage({
  path: "/web-design-middlesbrough",
  title: "Web Design Middlesbrough | Clear Packages from £99 | Veltra Media",
  description:
    "Conversion-focused web design for Middlesbrough and Teesside businesses. Clear packages from £99, mobile-first builds, local SEO foundations and a website you own.",
  breadcrumbName: "Web design Middlesbrough",
  serviceName: "Web design",
  eyebrow: "High-converting website design",
  h1: "How Teesside Service Businesses Are Getting 3x More Local Leads Without Spending a Single Penny More on Ads.",
  h1Highlight: "3x More Local Leads",
  lede: "Most websites are digital paperweights. We build a 24/7 automated sales machine that turns local Teesside browsers into booked jobs. Live in 14 days, or you don’t pay.",
  heroVisual: {
    src: "/assets/work/hero-devices.svg",
    width: 1200,
    height: 880,
    alt: "A local electrician's website on a laptop and a phone, with the services and areas covered, a prominent phone number and a tap-to-call button.",
    eager: true,
  },
  points: [
    { label: "Live in 14 days", text: "or you don’t pay" },
    { label: "Fixed price", text: "Zero hidden fees" },
    { label: "You own the site 100%", text: "No hostage situations" },
  ],
  cta: {
    label: "Book Your Free Teesside Growth Strategy Call",
    note: "We’ll map out exactly what your new site needs to look like to dominate your local area. No high-pressure sales, just straight answers.",
  },
  proof: {
    heading: "Don’t take our word for it. Look at the numbers.",
    cases: [
      {
        title: "Local Electrician",
        visual: V.siteElectrician,
        stats: [
          { label: "The Old Way", value: "2", text: "leads a month from a clunky 10-year-old site." },
          { label: "The Veltra Way", value: "18", text: "high-value leads last month." },
          { label: "What we did", text: "Replaced the confusing homepage with a single “Get a Free Quote” offer and added instant booking." },
        ],
      },
      {
        title: "Local Joinery",
        visual: V.siteJoinery,
        stats: [
          { label: "The Result", value: "312%", text: "increase in inbound calls within 30 days of launch." },
        ],
      },
    ],
  },
  problem: {
    heading: "You’re losing thousands of pounds a month to competitors who are worse at the job than you are, simply because their website makes them look like the safer choice.",
    body: "When a local customer goes to your site right now, what do they see? A wall of text? A contact form that looks like a tax return? If they can’t figure out exactly what you do and how to hire you in 3 seconds, they click “back” and call the next guy. You are bleeding leads.",
    visual: V.oldVsNew,
  },
  solution: {
    eyebrow: "The new way",
    heading: "We don’t sell “web design.” We sell a system designed to make your phone ring.",
    highlight: "make your phone ring.",
    items: [
      {
        icon: "calendar",
        title: "Zero-Friction Booking",
        text: "We strip out the useless “About Us” fluff and put exactly what the customer wants front and center: a big, easy button to book you.",
      },
      {
        icon: "smartphone",
        title: "Built for Thumbs, Not Desktops",
        text: "70% of your traffic is on a phone. We build mobile-first so your customers can call you in one tap.",
      },
      {
        icon: "chat",
        title: "Objection-Crushing Copy",
        text: "We answer the 5 questions every customer has (Do you cover my area? Are you legit? How much? When can you start? How do I book?) before they even ask.",
      },
    ],
  },
  offer: {
    heading: "When you partner with Veltra Media, you aren’t just getting a website. You are getting the complete Teesside Lead-Gen Website System:",
    highlight: "Teesside Lead-Gen Website System:",
    items: [
      { icon: "smartphone", title: "Mobile-First Conversion Architecture", text: "Engineered for one-tap booking on smartphones.", value: "£1,500" },
      { icon: "pen", title: "Psychology-Driven Direct Response Copywriting", text: "Words that sell your services for you.", value: "£800" },
      { icon: "doc", title: "Frictionless Enquiry & Lead Capture System", text: "Multi-step forms that double conversion rates.", value: "£500" },
      { icon: "bolt", title: "High-Speed, SEO-Ready Infrastructure", text: "No bloated WordPress themes; lightning-fast load times.", value: "£400" },
    ],
  },
  bonuses: {
    heading: "Plus, when you book your build this week, you get these bonuses entirely for free:",
    highlight: "entirely for free:",
    items: [
      { icon: "pin", title: "Google Business Profile Optimization Setup", text: "We set up your map pack foundation so you rank faster.", value: "£350" },
      { icon: "tool", title: "30 Days of VIP “Tweaks & Fixes” Support", text: "If you want a picture changed or text updated in the first month, we do it free.", value: "£250" },
    ],
    total: "£3,800",
    investment: "A fraction of that.",
    investmentNote: "Fixed price. Zero hidden fees.",
  },
  guarantee: {
    heading: "The 14-Day “Booked Solid” Guarantee",
    body: "We build your lead-generating website in 14 days. If it doesn’t actively increase your inbound enquiry rate, we will work for free until it does. You own the site 100%. No hostage situations.",
  },
  closing: {
    heading: "Stop losing jobs to worse competitors.",
    highlight: "Let’s build your machine.",
  },
});
