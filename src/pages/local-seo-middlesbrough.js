import { serviceSalesPage } from "../service-sales-page.js";
import { SERVICE_VISUALS as V } from "../service-visuals.js";

export default serviceSalesPage({
  path: "/local-seo-middlesbrough",
  title: "Local SEO Middlesbrough & Google Business Profile | Veltra Media",
  description:
    "Local SEO and Google Business Profile management for Middlesbrough and Teesside businesses. Service and area pages, local schema, consistent business details and honest reporting.",
  breadcrumbName: "Local SEO Middlesbrough",
  serviceName: "Local SEO and Google Business Profile",
  eyebrow: "Local SEO & Google Business Profile",
  h1: "If You Aren’t in the Top 3 on Google Maps, You Are Handing Your Best Local Jobs to Your Competitors.",
  h1Highlight: "Top 3 on Google Maps",
  lede: "We hijack the Google Map Pack so when Teesside customers search for your service, your phone rings first.",
  heroVisual: {
    src: "/assets/work/example-local-search.svg",
    width: 1280,
    height: 900,
    alt: "A joinery firm's Google Business Profile with call, website and directions buttons, its service area on a map, and matching service pages.",
    eager: true,
  },
  points: [
    { label: "Built in 14 days", text: "Your Local SEO foundation" },
    { label: "Zero ad spend", text: "Calls directly from Google Maps" },
    { label: "The “Top 3” Promise", text: "We work for free until calls increase" },
  ],
  cta: { label: "Book Your Local SEO Strategy Call" },
  proof: {
    heading: "The Proof is in the Pipeline.",
    visual: V.gbpInsights,
    cases: [
      {
        title: "Local Plumber",
        intro: "Went from Page 3 of Google to the #1 Map Pack spot in Middlesbrough for “Emergency Plumber.”",
        stats: [
          { label: "The Result", value: "45", text: "inbound calls generated directly from Google Maps last month. Zero ad spend." },
        ],
      },
    ],
  },
  problem: {
    heading: "Right now, someone in Teesside is standing in their kitchen with a broken boiler, a leaky roof, or a blown fuse. They pull out their phone and type your service into Google.",
    body: "Google shows them exactly three businesses on a map. If you aren’t one of those three, you do not exist. You could have 20 years of experience and the best pricing in town, but the guy who started his business 6 months ago is getting the job because he shows up first.",
    visual: V.mapPack,
  },
  solution: {
    eyebrow: "Total Map Domination",
    heading: "SEO agencies will sell you a £1,000/month retainer to write blog posts nobody reads. We don’t do that. We focus strictly on the actions that generate phone calls.",
    highlight: "the actions that generate phone calls.",
    items: [
      {
        icon: "pin",
        title: "Profile Weaponization",
        text: "We optimize your Google listing to make it the most attractive, authoritative option in your specific postcode.",
      },
      {
        icon: "star",
        title: "Review Automation",
        text: "We install a system that automatically extracts 5-star reviews from your happy customers, building massive trust and forcing Google to rank you higher.",
      },
      {
        icon: "shield",
        title: "Local Authority Building",
        text: "We lock in your business details across the internet so Google trusts your business more than the guy down the street.",
      },
    ],
  },
  offer: {
    heading: "Here is exactly what you get when we deploy the Map Pack Domination System:",
    highlight: "Map Pack Domination System:",
    items: [
      { icon: "pin", title: "Google Business Profile Weaponization", text: "Fully optimized for your exact Teesside service areas.", value: "£1,200" },
      { icon: "search", title: "Hyper-Local Keyword Targeting", text: "We rank you for the high-intent terms your best customers actually search for.", value: "£800" },
      { icon: "star", title: "Automated 5-Star Review Generation System", text: "Software that extracts glowing reviews from your past customers automatically.", value: "£600" },
      { icon: "shield", title: "Local Authority & Citation Build", text: "50+ directory syncs to build undeniable trust with Google’s algorithm.", value: "£500" },
    ],
  },
  bonuses: {
    items: [
      { icon: "target", title: "The Competitor Blindspot Audit", text: "We pull the exact data on why your #1 competitor is beating you and how to steal their traffic.", value: "£400" },
      { icon: "tool", title: "On-Site Conversion Tweaks", text: "We’ll tweak your existing website’s contact buttons to make sure the new SEO traffic actually converts.", value: "£300" },
    ],
    total: "£3,800",
  },
  guarantee: {
    heading: "The “Top 3” Promise",
    body: "We don’t charge you for useless vanity metrics. We build your Local SEO foundation in 14 days. If your local visibility and inbound calls don’t measurably increase, we work for free until they do.",
  },
  closing: {
    heading: "Only 3 businesses can fit in the Map Pack.",
    highlight: "Claim your spot before your competitor does.",
  },
});
