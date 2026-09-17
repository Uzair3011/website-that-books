import test from "node:test";
import assert from "node:assert/strict";
import { createInquiryHandler, hasIntake } from "../api/inquiry.js";
const valid = {
  name: "Test Owner",
  email: "test@example.com",
  business: "Test Clinic",
  businessType: "Med spa / aesthetic clinic",
  consent: true,
};
const request = (patch = {}) => ({
  method: "POST",
  headers: {
    host: "localhost:4174",
    origin: "http://localhost:4174",
    "content-type": "application/json",
    "x-forwarded-for": "test",
  },
  body: valid,
  ...patch,
});
function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}
async function run(req, options = {}) {
  const res = response();
  await createInquiryHandler({
    configured: () => true,
    deliver: async () => {},
    rateLimit: false,
    ...options,
  })(req, res);
  return res;
}
test("requires POST, JSON, same origin, and valid input", async () => {
  assert.equal((await run(request({ method: "GET" }))).statusCode, 405);
  assert.equal(
    (
      await run(
        request({
          headers: { host: "localhost:4174", "content-type": "text/plain" },
        }),
      )
    ).statusCode,
    415,
  );
  assert.equal(
    (
      await run(
        request({
          headers: {
            host: "localhost:4174",
            origin: "https://evil.example",
            "content-type": "application/json",
          },
        }),
      )
    ).statusCode,
    403,
  );
  assert.equal((await run(request({ body: "{" }))).statusCode, 400);
  assert.equal((await run(request({ body: {} }))).statusCode, 422);
  assert.equal(
    (await run(request({ body: { ...valid, challenge: "x".repeat(9000) } })))
      .statusCode,
    413,
  );
  assert.equal(
    (await run(request({ body: { ...valid, fax: "bot" } }))).statusCode,
    400,
  );
});
test("unconfigured intake and upstream failure never report a successful delivery", async () => {
  assert.equal(
    (await run(request(), { configured: () => false })).statusCode,
    503,
  );
  const result = await run(request(), {
    deliver: async () => {
      throw new Error("private upstream details");
    },
  });
  assert.equal(result.statusCode, 502);
  assert.equal(result.body.ok, false);
  assert.ok(!JSON.stringify(result).includes("private upstream details"));
});
test("forwards a valid lead once with consent provenance and returns success after delivery", async () => {
  const sent = [];
  const result = await run(request(), {
    deliver: async (data) => sent.push(data),
  });
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.ok, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].email, valid.email);
  assert.equal(sent[0].consent, true);
  assert.equal(sent[0].privacyVersion, "2026-09-16");
  assert.match(sent[0].requestId, /^[0-9a-f-]{36}$/);
});
test("repeated submissions are limited and recover after the window", async () => {
  let stamp = 1000000;
  const options = { rateLimit: true, now: () => stamp };
  for (let i = 0; i < 6; i++)
    assert.equal((await run(request(), options)).statusCode, 200);
  const limited = await run(request(), options);
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.headers["Retry-After"], "600");
  stamp += 600001;
  assert.equal((await run(request(), options)).statusCode, 200);
});
test("webhook readiness requires an HTTPS destination", () => {
  const original = process.env.LEAD_WEBHOOK_URL;
  process.env.LEAD_WEBHOOK_URL = "http://example.com";
  assert.equal(hasIntake(), false);
  process.env.LEAD_WEBHOOK_URL = "https://example.com";
  assert.equal(hasIntake(), true);
  if (original === undefined) delete process.env.LEAD_WEBHOOK_URL;
  else process.env.LEAD_WEBHOOK_URL = original;
});
