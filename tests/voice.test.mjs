import test from "node:test";
import assert from "node:assert/strict";
import {
  createVoiceHandler,
  signedUrl,
  voiceConfigured,
} from "../api/voice.js";

const request = (patch = {}) => ({
  method: "POST",
  headers: {
    host: "localhost:4174",
    origin: "http://localhost:4174",
    "content-type": "application/json",
    "x-forwarded-for": "voice-test",
  },
  body: {},
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
  await createVoiceHandler({
    configured: () => true,
    sign: async () =>
      "wss://api.elevenlabs.io/v1/convai/conversation?agent_id=a&conversation_signature=s",
    rateLimit: false,
    ...options,
  })(req, res);
  return res;
}

test("a same-origin POST gets a signed call URL; other origins and methods do not", async () => {
  const ok = await run(request());
  assert.equal(ok.statusCode, 200);
  assert.match(ok.body.signedUrl, /^wss:\/\/api\.elevenlabs\.io\//);
  assert.equal(ok.headers["Cache-Control"], "no-store");
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
  assert.equal((await run(request({ method: "GET" }))).statusCode, 405);
});

test("unconfigured or failing voice never leaks details", async () => {
  assert.equal(
    (await run(request(), { configured: () => false })).statusCode,
    503,
  );
  const failed = await run(request(), {
    sign: async () => {
      throw new Error("xi-api-key secret");
    },
  });
  assert.equal(failed.statusCode, 502);
  assert.ok(!JSON.stringify(failed.body).includes("secret"));
});

test("each visitor can start only a few calls per window", async () => {
  let stamp = 5_000_000;
  const options = { rateLimit: true, now: () => stamp };
  for (let i = 0; i < 4; i++)
    assert.equal((await run(request(), options)).statusCode, 200);
  assert.equal((await run(request(), options)).statusCode, 429);
  stamp += 600_001;
  assert.equal((await run(request(), options)).statusCode, 200);
});

test("signed URLs come from ElevenLabs with the server key, and anything else is refused", async () => {
  const env = {
    ELEVENLABS_API_KEY: "xi-secret",
    ELEVENLABS_AGENT_ID: "agent 1",
  };
  assert.equal(voiceConfigured(env), true);
  assert.equal(voiceConfigured({ ELEVENLABS_API_KEY: "x" }), false);
  const original = globalThis.fetch;
  const calls = [];
  try {
    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });
      return Response.json({
        signed_url: "wss://api.elevenlabs.io/v1/convai/conversation?x=1",
      });
    };
    assert.equal(
      await signedUrl(env),
      "wss://api.elevenlabs.io/v1/convai/conversation?x=1",
    );
    assert.match(calls[0].url, /agent_id=agent%201$/);
    assert.equal(calls[0].init.headers["xi-api-key"], "xi-secret");
    globalThis.fetch = async () =>
      Response.json({ signed_url: "wss://evil.example/steal" });
    await assert.rejects(signedUrl(env));
  } finally {
    globalThis.fetch = original;
  }
});
