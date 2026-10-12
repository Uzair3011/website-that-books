// The one price list. /pricing, the service pages, the med-spa package, the checkout page and
// the payment API all read from here, and `npm run db:setup` copies it into Supabase's
// `services` table, which the checkout API charges from. Change a price here, re-run
// `npm run db:setup`, then deploy: checkout refuses to charge while the two disagree.
//
// Prices are whole pounds, excluding VAT, as published. `amountMinor` gives Stripe's pence.
// Imported by the browser too, so nothing here may be secret.
export const CURRENCY = "GBP";

const item = (fields) =>
  Object.freeze({
    purchasable: false,
    testOnly: false,
    features: Object.freeze([]),
    ...fields,
  });

export const CATALOG = Object.freeze([
  item({
    slug: "landing-page",
    name: "Simple Landing Page",
    href: "/landing-page-design",
    price: 99,
    unit: "one-off",
    purchasable: true,
    description: "A sharp one-page site for a new business or a single offer.",
    features: Object.freeze([
      "One page, up to six sections",
      "Mobile-first custom design",
      "Contact form and click-to-call",
      "Basic SEO and analytics setup",
    ]),
  }),
  item({
    slug: "multi-page-website",
    name: "Multi-Page Website",
    href: "/web-design-middlesbrough",
    price: 179,
    unit: "one-off",
    flag: "Most popular",
    purchasable: true,
    description:
      "A complete small-business site that explains your services and wins enquiries.",
    features: Object.freeze([
      "Up to five core pages",
      "Conversion-focused structure and copy",
      "Local keyword and page mapping",
      "Analytics and enquiry tracking",
    ]),
  }),
  item({
    slug: "local-seo-google-business-profile",
    name: "Local SEO + Google Business Profile",
    href: "/local-seo-middlesbrough",
    price: 99,
    unit: "one-off",
    purchasable: true,
    description: "Get found when people nearby search for what you do.",
    features: Object.freeze([
      "Google Business Profile setup and optimisation",
      "Service and area page structure",
      "Local schema and technical setup",
      "Consistent business details everywhere",
    ]),
  }),
  item({
    slug: "ai-receptionist-website-chat",
    name: "AI Receptionist + Website Chat",
    href: "/ai-receptionist-middlesbrough",
    price: 199,
    unit: "setup",
    purchasable: true,
    description:
      "Answer enquiries on the phone and on your site, even at 9pm on a Sunday.",
    features: Object.freeze([
      "Approved answers on calls and chat",
      "Captures enquiry details after hours",
      "Clear handover to your team",
      "AI provider usage billed at cost",
    ]),
  }),
  item({
    slug: "crm-booking-automation",
    name: "CRM + Booking Follow-Up Automation",
    href: "/crm-booking-automation",
    price: 199,
    unit: "setup",
    purchasable: true,
    description: "Turn enquiries into booked appointments without chasing.",
    features: Object.freeze([
      "Every enquiry captured in one place",
      "Live calendar booking",
      "Confirmations and reminders",
      "Consent-based email follow-up",
    ]),
  }),
  // A "from" monthly price is not a fixed amount, so care is agreed in writing, not bought here.
  item({
    slug: "website-care",
    name: "Website Care",
    href: "/website-care",
    price: 49,
    unit: "/ month",
    from: true,
    description: "Optional. We look after the site so you do not have to.",
    features: Object.freeze([
      "Hosting and updates",
      "Backups and monitoring",
      "Practical support when you need it",
      "Month to month, no long tie-in",
    ]),
  }),
  item({
    slug: "growth-launch-package",
    name: "Growth Launch Package",
    href: "/pricing#bundle",
    price: 499,
    unit: "one-off",
    purchasable: true,
    package: true,
    description:
      "Website, local SEO, AI receptionist and booking automation, set up together and connected.",
    includes: Object.freeze([
      "multi-page-website",
      "local-seo-google-business-profile",
      "ai-receptionist-website-chat",
      "crm-booking-automation",
    ]),
  }),
  // Checks the whole payment flow for £1. The API only sells it with a Stripe test key and the
  // database refuses to record it as a live payment, so it can never charge a real card.
  item({
    slug: "test-payment",
    name: "£1 test payment",
    href: "/checkout?service=test-payment",
    price: 1,
    unit: "test",
    purchasable: true,
    testOnly: true,
    description:
      "Runs the full checkout in Stripe test mode. No real money moves.",
    features: Object.freeze([
      "Stripe test mode only",
      "Use test card 4242 4242 4242 4242",
      "Records a test payment in Supabase",
    ]),
  }),
]);

export const amountMinor = (entry) => Math.round(entry.price * 100);

const bySlug = new Map(CATALOG.map((entry) => [entry.slug, entry]));
export const catalogItem = (slug) =>
  (typeof slug === "string" && bySlug.get(slug)) || null;

/** The catalogue entry for a page, e.g. a service page's own price. */
export const catalogItemByHref = (href) =>
  CATALOG.find((entry) => entry.href === href) || null;

/**
 * What the checkout lists in a given Stripe mode: the test item only exists in test mode, and a
 * hidden item (none today) is sold only to someone who has its direct link.
 */
export const purchasableItems = ({ testMode = false } = {}) =>
  CATALOG.filter(
    (entry) =>
      entry.purchasable && !entry.hidden && (testMode || !entry.testOnly),
  );
