import test from "node:test";
import assert from "node:assert/strict";
import {
  SETUP_TOTAL,
  SYSTEM,
  calculateOpportunity,
} from "../assets/business.js";
import { validateInquiry } from "../assets/validation.js";

test("the med-spa system price is the sum of approved GBP service prices", () => {
  // Every component must match a price published on /pricing. If one changes
  // there and not here, this fails rather than shipping two different numbers.
  assert.deepEqual(
    SYSTEM.components.map((component) => component.price),
    [895, 495, 295, 395],
  );
  assert.equal(SETUP_TOTAL, 2080);
  assert.equal(SYSTEM.care, 49);
  assert.equal(SYSTEM.currency, "GBP");
});
test("the offer carries no bundle discount and no expiring launch price", () => {
  // A discount or a deadline would be a commercial term nobody approved.
  const sum = SYSTEM.components.reduce((total, c) => total + c.price, 0);
  assert.equal(SETUP_TOTAL, sum);
  assert.equal(Object.keys(SYSTEM).includes("expiresAt"), false);
});
test("opportunity deducts treatment costs and the care plan; payback uses contribution", () => {
  const result = calculateOpportunity({ visits: 8, value: 350, margin: 50 });
  assert.equal(result.gross, 2800);
  assert.equal(result.contribution, 1351);
  assert.equal(result.breakeven, 1);
  assert.equal(result.payback, 2080 / 1351);
});
test("zero visits and unprofitable scenarios do not imply setup payback", () => {
  assert.deepEqual(calculateOpportunity({ visits: 0, value: 350, margin: 50 }), {
    gross: 0,
    contribution: -49,
    breakeven: 1,
    payback: null,
  });
  assert.equal(
    calculateOpportunity({ visits: 1, value: 20, margin: 10 }).payback,
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
