import test from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK,
  SAVED,
  createChatHandler,
  leadFromArgs,
  systemPrompt,
  toContents,
} from "../api/chat.js";
import { htmlToText, siteKnowledge } from "../lib/site-knowledge.js";

const SESSION = "0123456789abcdef-session";
const request = (body, patch = {}) => ({
  method: "POST",
  headers: {
    host: "localhost:4174",
    origin: "http://localhost:4174",
    "content-type": "application/json",
    "x-forwarded-for": "test",
  },
  body: { sessionId: SESSION, page: "/pricing", ...body },
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
const say = (text) => ({ role: "model", parts: [{ text }] });
const callSave = (args) => ({
  role: "model",
  parts: [
    {
      functionCall: { name: "save_lead", id: "call_1", args },
      thoughtSignature: "sig",
    },
  ],
});
async function run(body, options = {}) {
  const res = response();
  await createChatHandler({
    configured: () => true,
    stored: () => true,
    store: async () => ({ created: true }),
    notifyAdmin: async () => {},
    rateLimit: false,
    ...options,
  })(request(body), res);
  return res;
}
const ask = (text) => ({ messages: [{ role: "user", text }] });

test("answers from a single model turn, with markdown stripped", async () => {
  const seen = [];
  const result = await run(ask("How much is a website?"), {
    model: async (input) => {
      seen.push(input);
      return say("Websites start from **£495**. See /pricing.");
    },
  });
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.reply, "Websites start from £495. See /pricing.");
  assert.equal(result.body.leadSaved, false);
  assert.match(seen[0].system, /WEBSITE CONTENT/);
  assert.equal(seen[0].tools[0].functionDeclarations[0].name, "save_lead");
});

test("save_lead stores a normalised chat lead, emails once, and echoes the call back", async () => {
  const stored = [];
  const notified = [];
  const turns = [
    callSave({
      name: "Jane Smith",
      phone: "07700 900123",
      service: "Website Design",
      summary: "New site",
      consent: true,
    }),
    say("Thanks Jane, the team will be in touch soon."),
  ];
  const inputs = [];
  const result = await run(
    {
      messages: [
        { role: "user", text: "I'm Jane, 07700 900123, yes contact me" },
      ],
    },
    {
      model: async (input) => {
        inputs.push(input);
        return turns.shift();
      },
      store: async (lead) => {
        stored.push(lead);
        return { created: true };
      },
      notifyAdmin: async (payload) => notified.push(payload),
    },
  );
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.leadSaved, true);
  assert.equal(
    result.body.reply,
    "Thanks Jane, the team will be in touch soon.",
  );
  assert.equal(stored[0].phone, "+447700900123");
  assert.equal(stored[0].source, "chat");
  assert.equal(stored[0].reference, `chat:${SESSION}`);
  assert.equal(stored[0].details.page, "/pricing");
  assert.match(stored[0].details.transcript, /^Visitor: I'm Jane/);
  assert.equal(notified.length, 1);
  // The model's own function-call turn (with its signature) goes back unchanged.
  const followUp = inputs[1].contents;
  assert.equal(followUp.at(-2).parts[0].thoughtSignature, "sig");
  assert.deepEqual(followUp.at(-1).parts[0].functionResponse, {
    name: "save_lead",
    id: "call_1",
    response: { ok: true },
  });
});

test("if the reply after saving fails, the visitor is still told their details were saved", async () => {
  let calls = 0;
  const result = await run(ask("Call me: Jane, 07700 900123, yes"), {
    model: async () => {
      calls += 1;
      if (calls === 1)
        return callSave({ name: "Jane", phone: "07700 900123", consent: true });
      throw Object.assign(new Error("quota"), { status: 429 });
    },
  });
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.leadSaved, true);
  assert.equal(result.body.reply, SAVED);
});

test("an updated save in the same conversation does not email again", async () => {
  const notified = [];
  const turns = [
    callSave({ name: "Jane", phone: "07700 900123", consent: true }),
    say("Updated."),
  ];
  await run(ask("Actually use this number"), {
    model: async () => turns.shift(),
    store: async () => ({ created: false }),
    notifyAdmin: async (payload) => notified.push(payload),
  });
  assert.equal(notified.length, 0);
});

test("without consent, or with a bad phone, nothing is stored and the model is told why", async () => {
  for (const args of [
    { name: "Jane", phone: "07700 900123", consent: false },
    { name: "Jane", phone: "12", consent: true },
    { name: "", phone: "07700 900123", consent: true },
  ]) {
    const stored = [];
    const inputs = [];
    const turns = [callSave(args), say("Could you check that?")];
    const result = await run(ask("hi"), {
      model: async (input) => {
        inputs.push(input);
        return turns.shift();
      },
      store: async (lead) => stored.push(lead),
    });
    assert.equal(stored.length, 0);
    assert.equal(result.body.leadSaved, false);
    assert.equal(
      inputs[1].contents.at(-1).parts[0].functionResponse.response.ok,
      false,
    );
  }
});

test("model outages and exhausted free quota return the contact fallback, never details", async () => {
  for (const status of [429, 500]) {
    const result = await run(ask("hi"), {
      model: async () => {
        throw Object.assign(new Error("secret upstream"), { status });
      },
    });
    assert.equal(result.statusCode, status === 429 ? 503 : 502);
    assert.equal(result.body.message, FALLBACK);
    assert.ok(!JSON.stringify(result.body).includes("secret"));
  }
  const unconfigured = await run(ask("hi"), { configured: () => false });
  assert.equal(unconfigured.statusCode, 503);
});

test("rejects malformed conversations, bad sessions and foreign origins", async () => {
  assert.equal((await run({ messages: [] })).statusCode, 422);
  assert.equal(
    (await run({ messages: [{ role: "system", text: "x" }] })).statusCode,
    422,
  );
  assert.equal(
    (await run({ messages: [{ role: "user", text: "x".repeat(1001) }] }))
      .statusCode,
    422,
  );
  assert.equal(
    (
      await run({
        messages: Array.from({ length: 25 }, () => ({
          role: "user",
          text: "x",
        })),
      })
    ).statusCode,
    422,
  );
  assert.equal(
    (await run({ ...ask("hi"), sessionId: "short" })).statusCode,
    422,
  );
  const res = response();
  await createChatHandler({ configured: () => true })(
    request(ask("hi"), {
      headers: {
        host: "localhost:4174",
        origin: "https://evil.example",
        "content-type": "application/json",
      },
    }),
    res,
  );
  assert.equal(res.statusCode, 403);
});

test("history is merged into alternating turns that end with the visitor", () => {
  assert.deepEqual(
    toContents([
      { role: "assistant", text: "Hello" },
      { role: "user", text: "a" },
      { role: "user", text: "b" },
    ]),
    [{ role: "user", parts: [{ text: "a\nb" }] }],
  );
  assert.equal(
    toContents([
      { role: "user", text: "a" },
      { role: "assistant", text: "b" },
    ]),
    null,
  );
  assert.equal(
    leadFromArgs({
      name: "A",
      phone: "07700 900123",
      consent: true,
      service: "Hacking",
    }).lead.service,
    "",
  );
});

test("the assistant's knowledge is the live site text, without form markup or legal pages", () => {
  const knowledge = siteKnowledge();
  assert.match(knowledge, /\(\/pricing\)/);
  assert.match(knowledge, /£495/);
  assert.doesNotMatch(knowledge, /<[a-z]/i);
  assert.doesNotMatch(knowledge, /\(\/privacy\)/);
  assert.doesNotMatch(knowledge, /Leave this blank/);
  assert.equal(
    htmlToText("<p>A &amp; B&nbsp;&pound;5</p><form><label>x</label></form>"),
    "A & B £5",
  );
  assert.match(systemPrompt("KNOWLEDGE"), /save_lead[\s\S]*KNOWLEDGE$/);
});
