import { serviceSalesPage } from "../service-sales-page.js";
import { SERVICE_VISUALS as V } from "../service-visuals.js";

export default serviceSalesPage({
  path: "/landing-page-design",
  title: "Landing Page Design & CRO | Teesside | Veltra Media",
  description:
    "Focused landing pages for one service, location or campaign — written and designed around a single conversion goal, with tracking so you can see what the page actually did.",
  breadcrumbName: "Landing page design",
  serviceName: "Landing page design and conversion rate optimisation",
  eyebrow: "High-converting landing pages (paid ads)",
  h1: "Getting Clicks but No Calls? Here is the 1-Page System We Use to Turn Expensive Ad Traffic into Booked Jobs.",
  h1Highlight: "1-Page System",
  lede: "Stop setting your ad budget on fire by sending paid traffic to a confusing homepage.",
  heroVisual: {
    src: "/assets/work/example-landing.svg",
    width: 1280,
    height: 900,
    alt: "A single-offer landing page for a free gutter survey: no navigation, a short form above the fold and what happens next.",
    eager: true,
  },
  points: [
    { label: "Deployed in 14 days", text: "Mapped to your specific ad offer" },
    { label: "Zero distractions", text: "No menus. No external links." },
    { label: "The “Profitable Click” Guarantee", text: "Beat your homepage, or we work for free" },
  ],
  cta: { label: "Book Your Landing Page ROI Call" },
  proof: {
    heading: "We Buy Clients For Pennies On The Pound.",
    visual: V.landingSplit,
    cases: [
      {
        title: "Google Ads Client",
        stats: [
          { label: "The Problem", text: "They were spending £500/mo on Google Ads sending traffic to their homepage. Cost per lead: £85." },
          { label: "The Veltra Fix", text: "We built a dedicated, single-offer landing page." },
          { label: "The Result", value: "4x", text: "Cost per lead dropped to £12. They got 4x the leads for the exact same ad spend." },
        ],
      },
    ],
  },
  problem: {
    heading: "If you are paying Mark Zuckerberg or Google £10 every time someone clicks your ad, you cannot afford to confuse them.",
    body: "When you send an ad click to your main website, they see your “About Us,” your “Mission Statement,” and a list of 12 different services. They get overwhelmed, they don’t see the specific thing they clicked on, and they bounce. You just paid £10 for a stranger to look at your logo for 2 seconds.",
    visual: V.adBounce,
  },
  solution: {
    eyebrow: "The Single-Offer Squeeze",
    heading: "We build ruthless, high-speed landing pages with one job: Get the contact info.",
    highlight: "Get the contact info.",
    items: [
      {
        icon: "target",
        title: "Zero Distractions",
        text: "No menus. No external links. The only thing the user can do is claim your offer or leave.",
      },
      {
        icon: "flow",
        title: "Message Match",
        text: "The headline of the page exactly matches the ad they just clicked, creating instant trust.",
      },
      {
        icon: "doc",
        title: "Frictionless Forms",
        text: "We use psychology-driven form fields that make it feel effortless for the customer to give you their phone number.",
      },
    ],
  },
  offer: {
    heading: "Stop burning ad spend. Here is what is included in the Single-Offer Squeeze System:",
    highlight: "Single-Offer Squeeze System:",
    items: [
      { icon: "layout", title: "Distraction-Free Landing Page Architecture", text: "Built specifically to convert paid traffic into phone calls.", value: "£1,000" },
      { icon: "flow", title: "Ad-to-Page “Message Match” Copywriting", text: "Seamless transition from the ad they clicked to the offer they read.", value: "£600" },
      { icon: "doc", title: "Psychology-Driven Lead Capture Forms", text: "Multi-step flows that eliminate abandonment.", value: "£500" },
      { icon: "star", title: "High-Fidelity Trust & Proof Integration", text: "Strategic placement of your best reviews to kill skepticism.", value: "£400" },
    ],
  },
  bonuses: {
    items: [
      { icon: "chart", title: "Existing Ad Campaign Audit", text: "We will look at your current Google/Meta ads and tell you exactly where you are wasting money.", value: "£350" },
      { icon: "bell", title: "Automated Instant SMS Lead Alerts", text: "The second someone fills out the landing page, your phone gets a text so you can call them in 60 seconds.", value: "£250" },
    ],
    total: "£3,100",
  },
  guarantee: {
    heading: "The “Profitable Click” Guarantee",
    body: "We deploy your high-converting landing page in 14 days, completely mapped to your specific ad offer. If it doesn’t beat the conversion rate of your current homepage, we work for free.",
  },
  closing: {
    heading: "Ready to halve your cost-per-lead and",
    highlight: "double your booked jobs?",
  },
});
