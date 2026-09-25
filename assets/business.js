// The med-spa growth system is priced from the standard GBP service list on
// /pricing — it is not a separate bundle with its own discount. Every figure
// below is one of those approved prices, or their sum. Do not introduce a
// number here that does not already appear on /pricing.
export const SYSTEM = Object.freeze({
  currency: "GBP",
  components: Object.freeze([
    Object.freeze({ name: "Business website, up to five pages", price: 895 }),
    Object.freeze({ name: "AI receptionist", price: 495 }),
    Object.freeze({ name: "Website chat", price: 295 }),
    Object.freeze({ name: "CRM, booking and follow-up automation", price: 395 }),
  ]),
  // Optional website care. The only recurring cost Veltra charges for this
  // system; AI provider usage is passed through at cost.
  care: 49,
});

export const SETUP_TOTAL = SYSTEM.components.reduce(
  (total, component) => total + component.price,
  0,
);

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
