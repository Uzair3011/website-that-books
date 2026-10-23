// Projects on the /work page. The first one marked `featured` gets the wide card
// at the top. Entries with `concept: true` are designs for fictional businesses
// and are labelled "Concept" so nobody mistakes them for clients; entries with
// `concept: false` are real builds.
//
// Images are 1280×900 WebP in assets/work/; docs/image-credits.md lists where
// each came from, and concept images are rendered by scripts/concept-mockups/.
// To add a real client project, save its 1280×900 image there and add an entry
// with `concept: false` and the live site's `url` (it opens in a new tab).
// Remove a concept entry when a real one replaces it.
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
    image: "/assets/work/concept-boiler.webp",
    imageAlt: "Concept homepage for Teesside Boiler Care: a navy header with a call button, the headline Boiler broken? We can be there today, the areas covered and a one-form quote request",
    concept: true,
  },
  {
    name: "Northside Roofline",
    category: "Landing page + CRO",
    summary:
      "One offer, one audience, one action: a free-survey landing page with no navigation and the form above the fold.",
    image: "/assets/work/concept-roofline.webp",
    imageAlt: "Concept landing page for Northside Roofline: no navigation, a free roof survey offer with three ticks, and the booking form beside it above the fold",
    concept: true,
  },
  {
    name: "Ashfield Joinery",
    category: "Local SEO + Google Business Profile",
    summary:
      "A joinery firm's profile and service pages saying the same thing, so Google and customers see one clear business.",
    image: "/assets/work/concept-joinery.webp",
    imageAlt: "Concept for Ashfield Joinery: the Stockton-on-Tees homepage listing four services beside a business profile that shows the same services, areas and phone number",
    concept: true,
  },
];
