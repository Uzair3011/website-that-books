import test from "node:test";
import assert from "node:assert/strict";
import {
  SETUP_TOTAL,
  SYSTEM,
  calculateOpportunity,
} from "../assets/business.js";
import { normalizePhone, validateInquiry } from "../assets/validation.js";

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
  phone: "07123 456789",
  consent: true,
};
test("validates, trims, defaults the phone to +44 and drops unknown fields", () => {
  const result = validateInquiry({ ...valid, secret: "not forwarded" });
  assert.equal(result.valid, true);
  assert.equal(result.data.name, "Test Owner");
  assert.equal(result.data.phone, "+447123456789");
  assert.equal(result.data.business, "");
  assert.equal(result.data.service, "");
  assert.equal(result.data.secret, undefined);
});
test("business name and service are optional, but the service must be a listed one", () => {
  assert.equal(
    validateInquiry({ ...valid, business: "Studio", service: "Website Design" })
      .valid,
    true,
  );
  assert.deepEqual(
    Object.keys(validateInquiry({ ...valid, service: "Hacking" }).errors),
    ["service"],
  );
});
test("rejects whitespace, invalid types, malformed emails, missing phone, and absent consent", () => {
  const { errors, valid: ok } = validateInquiry({
    name: " ",
    email: "bad",
    business: [],
    phone: "",
    consent: "false",
  });
  assert.equal(ok, false);
  assert.deepEqual(Object.keys(errors), ["name", "email", "phone", "consent"]);
});
test("phone numbers are stored in international form whatever way they are typed", () => {
  assert.equal(normalizePhone("07123 456789"), "+447123456789");
  assert.equal(normalizePhone("+44 (0)7123-456789"), "+447123456789");
  assert.equal(normalizePhone("+44 07123 456789"), "+447123456789");
  assert.equal(normalizePhone("0044 7123 456789"), "+447123456789");
  assert.equal(normalizePhone("(202) 555-0199", "+1"), "+12025550199");
  assert.equal(normalizePhone("+353 87 123 4567", "+44"), "+353871234567");
  // An unknown dial code falls back to the UK default rather than trusting the client.
  assert.equal(normalizePhone("07123 456789", "+999"), "+447123456789");
  for (const bad of ["123", "abc", "+44 7123 456789 ext 9", "0", "+0 1234567890"])
    assert.equal(normalizePhone(bad), "", bad);
});
test("rejects overlong content and invalid phones", () => {
  assert.equal(
    validateInquiry({ ...valid, business: "x".repeat(151) }).valid,
    false,
  );
  assert.equal(validateInquiry({ ...valid, phone: "123" }).valid, false);
});
