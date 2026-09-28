import test from "node:test";
import assert from "node:assert/strict";
import { MODEL, generate, modelChain } from "../lib/gemini.js";
import { toContent, toMessages, toTools } from "../lib/backup-llm.js";

const env = { GEMINI_API_KEY: "g", GROQ_API_KEY: "q" };
const input = {
  system: "rules",
  contents: [{ role: "user", parts: [{ text: "hi" }] }],
  tools: [
    {
      functionDeclarations: [
        { name: "save_lead", parameters: { type: "object" } },
      ],
    },
  ],
};

test("Groq joins the chain last, only when its key is set", () => {
  assert.deepEqual(modelChain(env), [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "groq/llama-3.3-70b-versatile",
  ]);
  assert.equal(
    modelChain({ GEMINI_API_KEY: "g" }).includes(
      "groq/llama-3.3-70b-versatile",
    ),
    false,
  );
  assert.equal(
    modelChain({ ...env, GROQ_MODEL: "openai/gpt-oss-120b" }).at(-1),
    "groq/openai/gpt-oss-120b",
  );
});

test("a Gemini conversation, including a save_lead round trip, becomes OpenAI-style messages", () => {
  const messages = toMessages("rules", [
    { role: "user", parts: [{ text: "Call me" }] },
    {
      role: "model",
      parts: [
        {
          functionCall: { name: "save_lead", id: "c1", args: { name: "Jane" } },
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          functionResponse: {
            name: "save_lead",
            id: "c1",
            response: { ok: true },
          },
        },
      ],
    },
  ]);
  assert.deepEqual(messages, [
    { role: "system", content: "rules" },
    { role: "user", content: "Call me" },
    {
      role: "assistant",
      content: null,
      tool_calls: [
        {
          id: "c1",
          type: "function",
          function: { name: "save_lead", arguments: '{"name":"Jane"}' },
        },
      ],
    },
    { role: "tool", tool_call_id: "c1", content: '{"ok":true}' },
  ]);
  assert.deepEqual(toTools(input.tools), [
    {
      type: "function",
      function: { name: "save_lead", parameters: { type: "object" } },
    },
  ]);
});

test("Groq replies come back in the shape the chat endpoint expects", () => {
  assert.deepEqual(toContent({ content: "Hello" }), {
    role: "model",
    parts: [{ text: "Hello" }],
  });
  assert.deepEqual(
    toContent({
      tool_calls: [
        {
          id: "c2",
          function: {
            name: "save_lead",
            arguments: '{"phone":"07700 900123"}',
          },
        },
      ],
    }),
    {
      role: "model",
      parts: [
        {
          functionCall: {
            name: "save_lead",
            id: "c2",
            args: { phone: "07700 900123" },
          },
        },
      ],
    },
  );
  assert.deepEqual(
    toContent({
      tool_calls: [
        { id: "c3", function: { name: "save_lead", arguments: "{oops" } },
      ],
    }).parts[0].functionCall.args,
    {},
  );
});

test("when both Gemini models are busy, Groq answers; its reply is tagged so follow-ups stay on it", async () => {
  const original = globalThis.fetch;
  const called = [];
  globalThis.fetch = async (url, init) => {
    if (url.includes("api.groq.com")) {
      called.push("groq");
      const body = JSON.parse(init.body);
      assert.equal(init.headers.Authorization, "Bearer q");
      assert.equal(body.model, "llama-3.3-70b-versatile");
      assert.equal(
        body.messages[0].content,
        "slim rules",
        "the backup gets the slim instructions",
      );
      assert.equal(body.messages[0].role, "system");
      assert.equal(body.tools[0].function.name, "save_lead");
      return Response.json({
        choices: [{ message: { content: "Hi from Groq" } }],
      });
    }
    called.push("gemini");
    return new Response('{"error":{"code":503}}', { status: 503 });
  };
  try {
    const content = await generate(
      { ...input, backupSystem: "slim rules" },
      env,
    );
    assert.deepEqual(called, ["gemini", "gemini", "groq"]);
    assert.equal(content.parts[0].text, "Hi from Groq");
    assert.equal(content[MODEL], "groq/llama-3.3-70b-versatile");
    called.length = 0;
    await generate(
      {
        ...input,
        backupSystem: "slim rules",
        model: "groq/llama-3.3-70b-versatile",
      },
      env,
    );
    assert.deepEqual(called, ["groq"], "a pinned Groq follow-up skips Gemini");
    called.length = 0;
    globalThis.fetch = async (url) => {
      called.push(url.includes("api.groq.com") ? "groq" : "gemini");
      return url.includes("api.groq.com")
        ? Response.json({ choices: [{ message: { content: "ok" } }] })
        : new Response("{}", { status: 400 });
    };
    await generate({ ...input, backupSystem: "slim rules" }, env);
    assert.deepEqual(
      called,
      ["gemini", "groq"],
      "a Gemini 400 skips the other Gemini model but not Groq",
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("the backup's knowledge is a small, relevant slice of the site", async () => {
  const { relevantKnowledge, siteKnowledge } =
    await import("../lib/site-knowledge.js");
  const slim = relevantKnowledge(
    "How much does Google Business Profile setup cost?",
  );
  assert.ok(
    slim.length < siteKnowledge().length / 4,
    "at least four times smaller",
  );
  assert.match(slim, /Google Business Profile/);
  assert.match(slim, /£195/);
  assert.match(slim, /ALL PAGES ON THE SITE[\s\S]*\(\/pricing\)/);
});
