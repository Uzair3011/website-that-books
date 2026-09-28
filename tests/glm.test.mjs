import test from "node:test";
import assert from "node:assert/strict";
import { MODEL, generate, modelChain } from "../lib/gemini.js";
import { toContent, toMessages, toTools } from "../lib/glm.js";

const env = { GEMINI_API_KEY: "g", GLM_API_KEY: "z" };
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

test("GLM joins the chain last, only when its key is set", () => {
  assert.deepEqual(modelChain(env), [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "glm-4.7-flash",
  ]);
  assert.equal(
    modelChain({ GEMINI_API_KEY: "g" }).includes("glm-4.7-flash"),
    false,
  );
  assert.equal(
    modelChain({ ...env, GLM_MODEL: "glm-4.5-flash" }).at(-1),
    "glm-4.5-flash",
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

test("GLM replies come back in the shape the chat endpoint expects", () => {
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

test("when both Gemini models are busy, GLM answers; its reply is tagged so follow-ups stay on it", async () => {
  const original = globalThis.fetch;
  const called = [];
  globalThis.fetch = async (url, init) => {
    if (url.includes("api.z.ai")) {
      called.push("glm");
      const body = JSON.parse(init.body);
      assert.equal(init.headers.Authorization, "Bearer z");
      assert.equal(body.model, "glm-4.7-flash");
      assert.equal(body.messages[0].role, "system");
      assert.equal(body.tools[0].function.name, "save_lead");
      return Response.json({
        choices: [{ message: { content: "Hi from GLM" } }],
      });
    }
    called.push("gemini");
    return new Response('{"error":{"code":503}}', { status: 503 });
  };
  try {
    const content = await generate(input, env);
    assert.deepEqual(called, ["gemini", "gemini", "glm"]);
    assert.equal(content.parts[0].text, "Hi from GLM");
    assert.equal(content[MODEL], "glm-4.7-flash");
    called.length = 0;
    await generate({ ...input, model: "glm-4.7-flash" }, env);
    assert.deepEqual(called, ["glm"], "a pinned GLM follow-up skips Gemini");
    called.length = 0;
    globalThis.fetch = async (url) => {
      called.push(url.includes("api.z.ai") ? "glm" : "gemini");
      return url.includes("api.z.ai")
        ? Response.json({ choices: [{ message: { content: "ok" } }] })
        : new Response("{}", { status: 400 });
    };
    await generate(input, env);
    assert.deepEqual(
      called,
      ["gemini", "glm"],
      "a Gemini 400 skips the other Gemini model but not GLM",
    );
  } finally {
    globalThis.fetch = original;
  }
});
