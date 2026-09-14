export const OFFER = Object.freeze({
  standardSetup: 3490,
  launchSetup: 2490,
  monthly: 399,
  standaloneTotal: 5000,
  // November 1, 00:00 in Los Angeles: the fixed offer has expired.
  expiresAt: "2026-11-01T07:00:00.000Z",
});
export function getOffer(now = new Date()) {
  const isLaunch = now.getTime() < Date.parse(OFFER.expiresAt);
  const setup = isLaunch ? OFFER.launchSetup : OFFER.standardSetup;
  return { ...OFFER, isLaunch, setup, savings: OFFER.standaloneTotal - setup };
}
export function calculateOpportunity({
  visits,
  value,
  margin,
  setup = getOffer().setup,
}) {
  const gross = visits * value;
  const perVisit = (value * margin) / 100;
  const contribution = (gross * margin) / 100 - OFFER.monthly;
  return {
    gross,
    contribution,
    breakeven: Math.ceil(OFFER.monthly / perVisit),
    payback: contribution > 0 ? setup / contribution : null,
  };
}
