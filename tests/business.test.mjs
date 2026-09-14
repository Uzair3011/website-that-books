import test from "node:test";
import assert from "node:assert/strict";
import { getOffer, calculateOpportunity } from "../assets/business.js";
import { validateInquiry } from "../assets/validation.js";

test("launch offer ends at the fixed Los Angeles midnight and never resets", () => {
  assert.equal(getOffer(new Date("2026-11-01T06:59:59Z")).setup, 2490);
  assert.equal(getOffer(new Date("2026-11-01T07:00:00Z")).setup, 3490);
  assert.equal(getOffer(new Date("2028-01-01T00:00:00Z")).isLaunch, false);
});
test("ROI deducts treatment costs and monthly management; setup payback uses contribution", () => {
  const result = calculateOpportunity({
    visits: 8,
    value: 350,
    margin: 50,
    setup: 2490,
  });
  assert.equal(result.gross, 2800);
  assert.equal(result.contribution, 1001);
  assert.equal(result.breakeven, 3);
  assert.equal(result.payback, 2490 / 1001);
});
test("zero visits and unprofitable scenarios do not imply setup payback", () => {
  assert.deepEqual(
    calculateOpportunity({ visits: 0, value: 350, margin: 50, setup: 2490 }),
    { gross: 0, contribution: -399, breakeven: 3, payback: null },
  );
  assert.equal(
    calculateOpportunity({ visits: 1, value: 50, margin: 10 }).payback,
    null,
  );
});
const valid = {
  name: " Test Owner ",
  email: "owner@example.com",
  business: "Aesthetic Studio",
  businessType: "Med spa / aesthetic clinic",
  consent: true,
};
test("validates, trims, normalizes URLs, and drops unknown fields", () => {
  const result = validateInquiry({
    ...valid,
    website: "example.com",
    secret: "not forwarded",
  });
  assert.equal(result.valid, true);
  assert.equal(result.data.name, "Test Owner");
  assert.equal(result.data.website, "https://example.com/");
  assert.equal(result.data.secret, undefined);
});
test("rejects whitespace, invalid types, malformed emails, wrong categories, and absent consent", () => {
  const { errors, valid } = validateInquiry({
    name: " ",
    email: "bad",
    business: [],
    businessType: "unknown",
    consent: "false",
  });
  assert.equal(valid, false);
  assert.deepEqual(Object.keys(errors), [
    "name",
    "email",
    "business",
    "businessType",
    "consent",
  ]);
});
test("rejects dangerous URLs, overlong content, and invalid phones", () => {
  assert.equal(
    validateInquiry({ ...valid, website: "javascript:alert(1)" }).valid,
    false,
  );
  assert.equal(
    validateInquiry({ ...valid, challenge: "x".repeat(2001) }).valid,
    false,
  );
  assert.equal(validateInquiry({ ...valid, phone: "123" }).valid, false);
});
