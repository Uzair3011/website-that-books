import test from "node:test";
import assert from "node:assert/strict";
import keepalive from "../api/keepalive.js";
import { createLeadIngestHandler, validateAgentLead } from "../api/leads.js";
import { leadRow, leadsConfigured, saveLead } from "../lib/leads.js";

const TOKEN = "test-token-0123456789";
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
const call = {
  source: "call",
  name: "Jane Caller",
  phone: "07123 456789",
  service: "AI Receptionist + Website Chat",
  externalId: "call_123",
  summary: "Wants a new website.",
  transcript: "AI: Hello…",
  recordingUrl: "https://storage.example.com/rec.mp3",
  durationSeconds: 93.4,
};
async function ingest(body, { auth = `Bearer ${TOKEN}`, ...options } = {}) {
  const res = response();
  await createLeadIngestHandler({
    token: () => TOKEN,
    stored: () => true,
    store: async () => {},
    ...options,
  })({ method: "POST", headers: { authorization: auth }, body }, res);
  return res;
}

test("agent leads need the shared token and a configured database", async () => {
  assert.equal((await ingest(call, { auth: "" })).statusCode, 401);
  assert.equal((await ingest(call, { auth: "Bearer wrong" })).statusCode, 401);
  assert.equal((await ingest(call, { auth: TOKEN })).statusCode, 401);
  assert.equal((await ingest(call, { token: () => "" })).statusCode, 503);
  assert.equal((await ingest(call, { stored: () => false })).statusCode, 503);
  const get = response();
  await createLeadIngestHandler({ token: () => TOKEN, stored: () => true })(
    { method: "GET", headers: {} },
    get,
  );
  assert.equal(get.statusCode, 405);
});

test("a call lead is normalised, deduplicated by its id, and stored once", async () => {
  const stored = [];
  const result = await ingest(call, {
    store: async (lead) => stored.push(lead),
  });
  assert.equal(result.statusCode, 200);
  assert.deepEqual(stored[0], {
    source: "call",
    name: "Jane Caller",
    email: null,
    phone: "+447123456789",
    business: null,
    service: "AI Receptionist + Website Chat",
    reference: "call:call_123",
    details: {
      summary: "Wants a new website.",
      transcript: "AI: Hello…",
      recordingUrl: "https://storage.example.com/rec.mp3",
      durationSeconds: 93,
      agent: null,
    },
  });
});

test("agent leads without a phone or with a bad source are rejected; unsafe links are dropped", async () => {
  const bad = await ingest({ ...call, phone: "", source: "sms" });
  assert.equal(bad.statusCode, 422);
  assert.deepEqual(Object.keys(bad.body.errors), ["source", "phone"]);
  const { lead } = validateAgentLead({
    source: "chat",
    phone: "+447123456789",
    recordingUrl: "javascript:alert(1)",
    email: "visitor@example.com",
  });
  assert.equal(lead.name, "Chat visitor");
  assert.equal(lead.details.recordingUrl, null);
  assert.equal(lead.reference, null);
  assert.equal((await ingest("{")).statusCode, 400);
  assert.equal(
    (await ingest({ ...call, transcript: "x".repeat(300 * 1024) })).statusCode,
    413,
  );
});

test("storage failures are reported without details", async () => {
  const result = await ingest(call, {
    store: async () => {
      throw new Error("secret upstream detail");
    },
  });
  assert.equal(result.statusCode, 502);
  assert.ok(!JSON.stringify(result.body).includes("secret"));
});

test("rows map to the table's columns, and storage is idempotent on reference", async () => {
  assert.deepEqual(
    leadRow({ name: "A", phone: "+447123456789", source: "website" }),
    {
      name: "A",
      email: null,
      phone: "+447123456789",
      business_name: null,
      service: null,
      source: "website",
      reference: null,
      booked_start: null,
      details: {},
    },
  );
  assert.equal(leadsConfigured({}), false);
  assert.equal(
    leadsConfigured({
      SUPABASE_URL: "http://x.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "k",
    }),
    false,
  );
  const env = {
    SUPABASE_URL: "https://x.supabase.co/",
    SUPABASE_SERVICE_ROLE_KEY: "service",
  };
  assert.equal(leadsConfigured(env), true);
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(null, { status: 201 });
  };
  try {
    await saveLead(
      { name: "A", phone: "+447123456789", source: "website", reference: "r1" },
      env,
    );
  } finally {
    globalThis.fetch = original;
  }
  assert.equal(
    calls[0].url,
    "https://x.supabase.co/rest/v1/leads?on_conflict=reference",
  );
  assert.equal(
    calls[0].init.headers.Prefer,
    "return=minimal,resolution=ignore-duplicates",
  );
  assert.equal(calls[0].init.headers.Authorization, "Bearer service");
  assert.equal(JSON.parse(calls[0].init.body).reference, "r1");
});

test("the keep-alive cron only runs with Vercel's cron secret", async () => {
  const original = process.env.CRON_SECRET;
  process.env.CRON_SECRET = "cron-secret";
  try {
    const denied = response();
    await keepalive({ headers: { authorization: "Bearer nope" } }, denied);
    assert.equal(denied.statusCode, 401);
    const unconfigured = response();
    await keepalive(
      { headers: { authorization: "Bearer cron-secret" } },
      unconfigured,
    );
    assert.equal(unconfigured.statusCode, 503);
  } finally {
    if (original === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = original;
  }
});
