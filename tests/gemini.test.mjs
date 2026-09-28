import test from "node:test";
import assert from "node:assert/strict";
import { MODEL, generate, modelChain } from "../lib/gemini.js";

const env = { GEMINI_API_KEY: "key" };
const reply = (text) =>
  Response.json({
    candidates: [{ content: { role: "model", parts: [{ text }] } }],
  });
async function withFetch(handler, run) {
  const original = globalThis.fetch;
  const called = [];
  globalThis.fetch = async (url, init) => {
    const model = decodeURIComponent(url.match(/models\/([^:]+):/)[1]);
    called.push(model);
    return handler(model, init);
  };
  try {
    return { result: await run(), called };
  } finally {
    globalThis.fetch = original;
  }
}
const input = {
  system: "s",
  contents: [{ role: "user", parts: [{ text: "hi" }] }],
};

test("the chain is the main model then a different fallback, both overridable", () => {
  assert.deepEqual(modelChain({}), [
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
  ]);
  assert.deepEqual(
    modelChain({ GEMINI_MODEL: "a", GEMINI_FALLBACK_MODEL: "b" }),
    ["a", "b"],
  );
  assert.deepEqual(modelChain({ GEMINI_FALLBACK_MODEL: "" }), [
    "gemini-3.5-flash-lite",
  ]);
  assert.deepEqual(
    modelChain({ GEMINI_MODEL: "x", GEMINI_FALLBACK_MODEL: "x" }),
    ["x"],
  );
});

test("a timeout, quota error or outage on the main model falls through to the fallback", async () => {
  for (const failure of [
    () =>
      Promise.reject(
        Object.assign(new Error("slow"), { name: "TimeoutError" }),
      ),
    () => new Response(null, { status: 429 }),
    () => new Response(null, { status: 503 }),
  ]) {
    const { result, called } = await withFetch(
      (model) =>
        model === "gemini-3.5-flash-lite" ? failure() : reply("from fallback"),
      () => generate(input, env),
    );
    assert.deepEqual(called, [
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
    ]);
    assert.equal(result.parts[0].text, "from fallback");
    assert.equal(result[MODEL], "gemini-3.1-flash-lite");
    assert.equal(
      JSON.stringify(result).includes("gemini"),
      false,
      "model tag never serialises",
    );
  }
});

test("a healthy main model is used alone, and a bad request is not retried", async () => {
  const ok = await withFetch(
    () => reply("hi"),
    () => generate(input, env),
  );
  assert.deepEqual(ok.called, ["gemini-3.5-flash-lite"]);
  assert.equal(ok.result[MODEL], "gemini-3.5-flash-lite");
  const bad = await withFetch(
    () => new Response(null, { status: 400 }),
    () => generate(input, env).catch((error) => error),
  );
  assert.deepEqual(bad.called, ["gemini-3.5-flash-lite"]);
  assert.equal(bad.result.status, 400);
});

test("both failing throws the last error; a pinned model is the only one tried", async () => {
  const both = await withFetch(
    () => new Response(null, { status: 503 }),
    () => generate(input, env).catch((error) => error),
  );
  assert.equal(both.called.length, 2);
  assert.equal(both.result.status, 503);
  const pinned = await withFetch(
    () => new Response(null, { status: 503 }),
    () =>
      generate({ ...input, model: "gemini-3.1-flash-lite" }, env).catch(
        (e) => e,
      ),
  );
  assert.deepEqual(pinned.called, ["gemini-3.1-flash-lite"]);
});
