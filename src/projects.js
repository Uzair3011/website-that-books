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
      "A clinic website that fills its own diary. Visitors book a real slot from live Google Calendar availability, reminders send themselves, and an AI receptionist answers questions instantly, handing over to a person when judgement is needed. Our own build, with every Veltra service working as one.",
    status: "Live: you can try the booking flow on this site",
    image: "/assets/work/project-med-spa.webp",
    imageAlt: "The Lumière Aesthetics clinic homepage: a headline reading Advanced skin and aesthetic treatments beside a live appointment picker with dates, times and a confirm button",
    url: "/med-spa-growth-system",
    linkLabel: "See the med-spa system",
    concept: false,
    featured: true,
  },
  {
    name: "Estate Resolve",
    category: "Multi-page website + CRM dashboard + email automation",
    summary:
      "A website that earns trust at a difficult time. Calm, clear pages guide executors, families and solicitors towards starting a case, while a custom CRM dashboard and automated emails keep every enquiry moving behind the scenes.",
    status: "Live: estateresolve.co.uk",
    image: "/assets/work/project-estate-resolve.webp",
    imageAlt: "The Estate Resolve homepage: a navy and gold design headed Locating Hidden Assets After a Loved One Has Passed, with a four-step process panel",
    url: "https://www.estateresolve.co.uk/",
    linkLabel: "Visit Estate Resolve",
    concept: false,
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
