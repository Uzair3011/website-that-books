// Projects shown on the homepage. Until real client work is added, these are
// concept designs (the businesses are fictional), and every one with
// `concept: true` is labelled "Concept" on the card so nobody mistakes it for
// a client. To add a real project: put a 1280×900 screenshot in assets/work/,
// add an entry with `concept: false` and the live site's `url`, and remove a
// concept entry.
export const PROJECTS = [
  {
    name: "Teesside Boiler Care",
    category: "Website design + local SEO",
    summary:
      "A phone-first site for a heating engineer: the number stays in reach, the areas covered are stated plainly and quotes take one form.",
    image: "/assets/work/example-trades.svg",
    url: "/work",
    concept: true,
  },
  {
    name: "Lumière Aesthetics",
    category: "Website + online booking",
    summary:
      "A clinic site where visitors see live availability and book a consultation without a phone call.",
    image: "/assets/work/example-clinic.svg",
    url: "/med-spa-growth-system",
    concept: true,
  },
  {
    name: "Northside Roofline",
    category: "Landing page + CRO",
    summary:
      "One offer, one audience, one action: a free-survey landing page with the form above the fold.",
    image: "/assets/work/example-landing.svg",
    url: "/work",
    concept: true,
  },
  {
    name: "Ashfield Joinery",
    category: "Local SEO + Google Business Profile",
    summary:
      "A joinery firm's profile and service pages saying the same thing, so Google and customers see one clear business.",
    image: "/assets/work/example-local-search.svg",
    url: "/work",
    concept: true,
  },
];
