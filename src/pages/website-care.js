import { servicePage } from "../service-page.js";

export default servicePage({
  path: "/website-care",
  title: "Website Care Plans from £49 a Month | Veltra Media",
  description:
    "Optional website care for Middlesbrough and Teesside businesses: hosting, updates, backups, monitoring and practical support from £49 a month, month to month with no long tie-in.",
  breadcrumbName: "Website care",
  serviceName: "Website care",
  eyebrow: "Website care · Optional, month to month",
  h1: "Website care, for owners who would rather not manage the technical side.",
  lede: "Hosting, updates, backups, monitoring and practical support from £49 a month. It is always optional, and you own the website either way.",
  image: {
    src: "/assets/work/hero-devices.svg",
    width: 1200,
    height: 880,
    alt: "A local service website shown on a laptop and a phone.",
  },
  intro: {
    heading: "A website is not finished on launch day.",
    body: [
      "Software needs updating, hosting needs watching, and backups only matter on the day something breaks. Most owners have a business to run and would rather someone competent kept an eye on it.",
      "A care plan is that someone. We host the site, keep it updated, back it up, monitor it and answer questions when you have them. It is a monthly service with no long tie-in, so you stay because it is useful rather than because you are locked in.",
      "It is never a condition of the build. If you would rather manage the site yourself, we explain the handover and you walk away with a website you own.",
    ],
  },
  includedHeading: "What care covers",
  included: {
    heading: "Five things, looked after so you do not have to.",
    items: [
      {
        title: "Hosting",
        text: "The site is hosted and served securely, so there is no separate hosting account for you to buy, renew or forget about.",
      },
      {
        title: "Updates",
        text: "The parts the site depends on are kept up to date, so it does not fall behind and become a security or compatibility problem.",
      },
      {
        title: "Backups",
        text: "Copies of the site are kept so a mistake or a fault can be put right without starting again.",
      },
      {
        title: "Monitoring",
        text: "We keep an eye on whether the site is up and working, so a problem is more likely to be found by us than by a customer.",
      },
      {
        title: "Practical support",
        text: "Ask how something works or tell us about a problem, and a person replies. The exact scope is written into your proposal before you start.",
      },
    ],
  },
  fitHeading: "Works on its own",
  fit: {
    heading: "Add it to a Veltra website, or ask about one you already have.",
    body: "Care goes naturally with a new build, but it is a separate, optional service. These are the routes people usually take.",
    items: [
      {
        label: "New build",
        title: "Website design",
        text: "Choose care when the site launches, or decide later once you have seen how much of the upkeep you want to keep.",
      },
      {
        label: "Existing site",
        title: "Review first",
        text: "If your site is already live, we look at it and tell you honestly whether care makes sense before you commit.",
      },
      {
        label: "Growing",
        title: "Local SEO",
        text: "Ongoing local SEO is a separate monthly service. It sits alongside care, and each can be bought without the other.",
      },
      {
        label: "Leaving",
        title: "Handover",
        text: "Month to month means you can stop. We explain the handover so the site and its content stay yours.",
      },
    ],
  },
  price: {
    heading: "From £49 a month.",
    body: "Website care starts at £49 a month, excluding VAT, with no long tie-in. Any third-party costs, such as a domain name, are shown at cost and confirmed in writing before work begins.",
  },
  faqs: [
    {
      q: "Do I have to take a care plan?",
      a: "<p>No. Care is optional. If you would rather manage the website yourself, we will explain the handover and you can walk away with it.</p>",
    },
    {
      q: "Is there a contract?",
      a: "<p>Care is month to month with no long tie-in. The scope and price are written down in your proposal before you agree to anything.</p>",
    },
    {
      q: "Can you look after a website you did not build?",
      a: "<p>Often, yes. We will review the site first and tell you plainly whether we can look after it well, what it would involve, and whether a care plan is the right answer.</p>",
    },
    {
      q: "Do I still own the website?",
      a: "<p>Yes. Once the agreed project fees are paid, the website and the original content created for it are yours, subject only to any third-party software licences explained in your proposal. A care plan does not change that.</p>",
    },
  ],
  relatedItems: [
    {
      href: "/web-design-middlesbrough",
      label: "Website design",
      text: "Clear packages from £495, with a written scope and price up front.",
    },
    {
      href: "/pricing",
      label: "Pricing",
      text: "Every service, priced separately, in one place.",
    },
    {
      href: "/free-website-audit",
      label: "Free website plan",
      text: "A practical starting point and the gaps worth fixing first.",
    },
  ],
});
