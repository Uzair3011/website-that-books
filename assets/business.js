// The med-spa growth system is the Growth Launch Package from /pricing, at the
// same package price. The components are the standard services it includes,
// each at its own published price. Do not introduce a number here that does
// not already appear on /pricing.
export const SYSTEM = Object.freeze({
  currency: "GBP",
  package: "Growth Launch Package",
  price: 499,
  components: Object.freeze([
    Object.freeze({ name: "Multi-page website, up to five pages", price: 179 }),
    Object.freeze({ name: "Local SEO and Google Business Profile setup", price: 99 }),
    Object.freeze({ name: "AI receptionist and website chat", price: 199 }),
    Object.freeze({ name: "CRM, booking and follow-up automation", price: 199 }),
  ]),
  // Optional website care. The only recurring cost Veltra charges for this
  // system; AI provider usage is passed through at cost.
  care: 49,
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
