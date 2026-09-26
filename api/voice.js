// POST /api/voice: starts an in-browser call with the ElevenLabs AI agent. The agent only
// accepts signed URLs (auth is enabled on it), so the API key stays on the server and every
// call passes this endpoint's same-origin check and rate limit; that caps how many paid voice
// minutes a single visitor can start.
import {
  createRateLimiter,
  readJsonPost,
  sendRateLimited,
} from "../lib/http.js";

const limiter = createRateLimiter({ limit: 4, windowMs: 10 * 60 * 1000 });

export function voiceConfigured(env = process.env) {
  return Boolean(env.ELEVENLABS_API_KEY && env.ELEVENLABS_AGENT_ID);
}

export async function signedUrl(env = process.env) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(env.ELEVENLABS_AGENT_ID)}`,
    {
      headers: { "xi-api-key": env.ELEVENLABS_API_KEY },
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    },
  );
  if (!response.ok) throw new Error("Voice session refused");
  const { signed_url: url } = await response.json();
  if (!/^wss:\/\/api\.elevenlabs\.io\//.test(url || ""))
    throw new Error("Unexpected voice session URL");
  return url;
}

export function createVoiceHandler({
  configured = voiceConfigured,
  sign = signedUrl,
  now = Date.now,
  rateLimit = true,
} = {}) {
  return async function voice(req, res) {
    const raw = readJsonPost(req, res);
    if (!raw) return;
    if (!configured())
      return res.status(503).json({
        ok: false,
        message:
          "Voice calls are unavailable right now. Please use the chat or call us.",
      });
    if (rateLimit) {
      const { limited, retryAfter } = limiter(req, now());
      if (limited) return sendRateLimited(res, retryAfter);
    }
    try {
      return res.status(200).json({ ok: true, signedUrl: await sign() });
    } catch {
      return res.status(502).json({
        ok: false,
        message:
          "We couldn’t start the call. Please try again, use the chat, or call us.",
      });
    }
  };
}
export default createVoiceHandler();
