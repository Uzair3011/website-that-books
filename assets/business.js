import { CURRENCY, catalogItem } from "./catalog.js";

// The med-spa growth system is the Growth Launch Package from /pricing, at the
// same package price. The components are the standard services it includes,
// each at its own published price, all read from assets/catalog.js so no
// number here can differ from /pricing.
const growth = catalogItem("growth-launch-package");
const labels = {
  "multi-page-website": "Multi-page website, up to five pages",
  "local-seo-google-business-profile": "Local SEO and Google Business Profile setup",
  "ai-receptionist-website-chat": "AI receptionist and website chat",
  "crm-booking-automation": "CRM, booking and follow-up automation",
};
export const SYSTEM = Object.freeze({
  currency: CURRENCY,
  package: growth.name,
  price: growth.price,
  components: Object.freeze(
    growth.includes.map((slug) =>
      Object.freeze({ name: labels[slug], price: catalogItem(slug).price }),
    ),
  ),
  // Optional website care. The only recurring cost Veltra charges for this
  // system; AI provider usage is passed through at cost.
  care: catalogItem("website-care").price,
});

export const SETUP_TOTAL = SYSTEM.price;

/**
 * Illustrative monthly contribution from extra completed visits, net of the
 * recurring care plan. Not a forecast: every input is supplied by the visitor.
 */
export function calculateOpportunity({
  visits,
  value,
  margin,
  setup = SETUP_TOTAL,
  monthly = SYSTEM.care,
}) {
  const gross = visits * value;
  const perVisit = (value * margin) / 100;
  const contribution = (gross * margin) / 100 - monthly;
  return {
    gross,
    contribution,
    breakeven: Math.ceil(monthly / perVisit),
    payback: contribution > 0 ? setup / contribution : null,
  };
}
