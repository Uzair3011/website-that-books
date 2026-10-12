import { serviceSalesPage } from "../service-sales-page.js";
import { SERVICE_VISUALS as V } from "../service-visuals.js";

export default serviceSalesPage({
  path: "/landing-page-design",
  title: "Landing Page Design Middlesbrough | From £99 | Veltra Media",
  description:
    "Landing page design for Middlesbrough businesses running ads: one offer, one page, a short form and tracking to show what each click becomes. From £99.",
  breadcrumbName: "Landing page design",
  serviceName: "Landing page design and conversion rate optimisation",
  serviceType: "Landing page design",
  eyebrow: "High-converting landing pages (paid ads)",
  h1: "Landing page design for Middlesbrough businesses running ads",
  h1Highlight: "Landing page design",
  hook: "Getting clicks but no calls? Here is the 1-page system we use to turn expensive ad traffic into booked jobs.",
  lede: "Stop setting your ad budget on fire by sending paid traffic to a confusing homepage.",
  heroVisual: {
    src: "/assets/work/example-landing.svg",
    width: 1280,
    height: 900,
    alt: "A single-offer landing page for a free gutter survey: no navigation, a short form above the fold and what happens next.",
    eager: true,
  },
  points: [
    { label: "Typically live in around 7 working days", text: "after content approval, mapped to your ad offer" },
    { label: "Zero distractions", text: "No menus. No external links." },
    { label: "Tracking included", text: "See what each click turns into" },
  ],
  cta: { label: "Book Your Landing Page ROI Call" },
  proof: {
    heading: "Example scenario",
    visual: V.landingSplit,
    cases: [
      {
        title: "Example scenario: a business running Google Ads",
        stats: [
          { label: "The Problem", text: "They were spending £500/mo on Google Ads sending traffic to their homepage. Cost per lead: £85." },
          { label: "The fix", text: "We built a dedicated, single-offer landing page." },
          { label: "The Result", value: "4x", text: "Cost per lead dropped to £12. They got 4x the leads for the exact same ad spend." },
        ],
      },
    ],
  },
  problem: {
    heading: "If you are paying Mark Zuckerberg or Google every time someone clicks your ad, you cannot afford to confuse them.",
    body: "When you send an ad click to your main website, they see your “About Us,” your “Mission Statement,” and a long list of different services. They get overwhelmed, they don’t see the specific thing they clicked on, and they bounce. You just paid for a stranger to glance at your logo and leave.",
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
      { icon: "layout", title: "Distraction-Free Landing Page Architecture", text: "Built specifically to convert paid traffic into phone calls." },
      { icon: "flow", title: "Ad-to-Page “Message Match” Copywriting", text: "Seamless transition from the ad they clicked to the offer they read." },
      { icon: "doc", title: "Psychology-Driven Lead Capture Forms", text: "Multi-step flows that eliminate abandonment." },
      { icon: "star", title: "High-Fidelity Trust & Proof Integration", text: "Strategic placement of your best reviews to kill skepticism." },
    ],
  },
  bonuses: {
    items: [
      { icon: "chart", title: "Existing Ad Campaign Audit", text: "We will look at your current Google/Meta ads and tell you exactly where you are wasting money." },
      { icon: "bell", title: "Automated Instant SMS Lead Alerts", text: "The second someone fills out the landing page, your phone gets a text so you can call them in 60 seconds." },
    ],
  },
  commitment: {
    heading: "A clear timeline and a fixed price",
    body: "Your landing page is typically live in around seven working days after content approval, completely mapped to your specific ad offer. The price and scope are agreed in writing before work starts, and tracking shows you what each click turns into.",
  },
  closing: {
    heading: "Ready to get more from",
    highlight: "every ad click?",
  },
  relatedItems: [
    {
      href: "/web-design-middlesbrough",
      label: "Web design in Middlesbrough",
      text: "A full website when one page is not enough, from £99.",
    },
    {
      href: "/crm-booking-automation",
      label: "Booking and CRM automation",
      text: "Every landing page enquiry followed up and booked, £199 setup.",
    },
    {
      href: "/local-seo-middlesbrough",
      label: "Local SEO in Middlesbrough",
      text: "Enquiries from Google Search and Maps without paying per click, £99.",
    },
    {
      href: "/free-website-audit",
      label: "Free website audit",
      text: "Find out whether a landing page is the right fix before you spend.",
    },
    {
      href: "/resources/how-much-does-a-website-cost",
      label: "What a website really costs",
      text: "Build, running costs and extras, with worked examples from our own prices.",
    },
    {
      href: "/areas",
      label: "Areas we cover",
      text: "Landing pages for businesses across Middlesbrough and the Tees Valley.",
    },
  ],
});
