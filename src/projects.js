// Projects on the /work page. The first one marked `featured` gets the wide card
// at the top. Entries with `concept: true` are designs for fictional businesses
// and are labelled "Concept" so nobody mistakes them for clients; entries with
// `concept: false` are real builds.
//
// Photos are 1280×900 WebP in assets/work/; docs/image-credits.md lists where
// each came from. To add a real client project, save its 1280×900 image there
// and add an entry with `concept: false` and the live site's `url` (it opens in
// a new tab). Remove a concept entry when a real one replaces it.
export const PROJECTS = [
  {
    name: "Med-spa growth system",
    category: "Website + booking + AI reception",
    summary:
      "Our own build, and all of our services working as one: a clinic website on live Google Calendar availability, with confirmation and reminder emails and an AI receptionist that hands over to a person when a question needs judgement.",
    status: "Live: you can try the booking flow on this site",
    image: "/assets/work/project-med-spa.webp",
    imageAlt: "A client relaxing during a facial treatment at a spa",
    url: "/med-spa-growth-system",
    linkLabel: "See the med-spa system",
    concept: false,
    featured: true,
  },
  {
    name: "Teesside Boiler Care",
    category: "Website design + local SEO",
    summary:
      "A phone-first site for a heating engineer: the number stays in reach, the areas covered are stated plainly and quotes take one form.",
    image: "/assets/work/project-boiler.webp",
    imageAlt: "A heating engineer's pipe wrench, spirit level and tools on a workbench",
    concept: true,
  },
  {
    name: "Northside Roofline",
    category: "Landing page + CRO",
    summary:
      "One offer, one audience, one action: a free-survey landing page with no navigation and the form above the fold.",
    image: "/assets/work/project-roofline.webp",
    imageAlt: "A roofer in a hard hat fixing roof boards with a hammer",
    concept: true,
  },
  {
    name: "Ashfield Joinery",
    category: "Local SEO + Google Business Profile",
    summary:
      "A joinery firm's profile and service pages saying the same thing, so Google and customers see one clear business.",
    image: "/assets/work/project-joinery.webp",
    imageAlt: "A joiner planing a piece of wood in a workshop",
    concept: true,
  },
];
