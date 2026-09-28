// Minimal Gemini API client (REST, no SDK), matching the raw-fetch style used for Google
// Calendar and Supabase. Server-only: the API key never reaches the browser.
import { DEFAULT_GLM_MODEL, glmConfigured, glmRequest } from "./glm.js";

export const DEFAULT_MODEL = "gemini-3.5-flash-lite";
// An earlier release line, so an outage or hang on the main model rarely hits both.
// (gemini-2.5-flash-lite is closed to new API users, so it can't be the fallback.)
export const DEFAULT_FALLBACK_MODEL = "gemini-3.1-flash-lite";
// Per Gemini attempt. Two of these plus the GLM backup (12 s) fit the browser's 35-second wait.
const ATTEMPT_MS = 7000;
// Which model wrote a reply. A symbol, so it never leaks into a request body when the
// content is echoed back to Gemini.
export const MODEL = Symbol("gemini model");

export function geminiConfigured(env = process.env) {
  return Boolean(env.GEMINI_API_KEY);
}

export function modelChain(env = process.env) {
  const primary = env.GEMINI_MODEL || DEFAULT_MODEL;
  const fallback = env.GEMINI_FALLBACK_MODEL ?? DEFAULT_FALLBACK_MODEL;
  // Last resort: a different company's free model, so a busy Google rarely takes chat down.
  const backup = glmConfigured(env) ? env.GLM_MODEL || DEFAULT_GLM_MODEL : null;
  return [...new Set([primary, fallback, backup].filter(Boolean))];
}

async function request(
  model,
  { system, contents, tools, maxOutputTokens },
  env,
) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": env.GEMINI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        ...(tools && { tools }),
        generationConfig: { temperature: 0.3, maxOutputTokens },
      }),
      signal: AbortSignal.timeout(ATTEMPT_MS),
      redirect: "error",
    },
  );
  if (!response.ok) {
    // Google's own explanation (retired model, quota, outage); never includes visitor text.
    const detail = (await response.text().catch(() => ""))
      .replace(/\s+/g, " ")
      .slice(0, 300);
    const error = new Error(
      `Gemini ${model} returned ${response.status}: ${detail}`,
    );
    error.status = response.status;
    throw error;
  }
  const body = await response.json();
  // The model's own content is returned whole so a function-call turn can be echoed back
  // exactly (Gemini requires its signatures to come back unchanged).
  return body.candidates?.[0]?.content || { role: "model", parts: [] };
}

// Tries the main model, then the fallback on a timeout, quota error or outage. `model` pins
// one model: a reply to a function call must go to the model that made the call, since its
// signatures are only valid there.
export async function generate(
  { system, contents, tools, maxOutputTokens = 350, model },
  env = process.env,
) {
  const chain = model ? [model] : modelChain(env);
  let lastError;
  let geminiRejected = false;
  for (const name of chain) {
    const glm = name.startsWith("glm");
    // A malformed request fails the same way on every Gemini model; GLM is a separate API.
    if (geminiRejected && !glm) continue;
    try {
      const content = await (glm ? glmRequest : request)(
        name,
        { system, contents, tools, maxOutputTokens },
        env,
      );
      content[MODEL] = name;
      return content;
    } catch (error) {
      lastError = error;
      // Visible in Vercel's function logs, so a failing model is easy to diagnose.
      console.warn(
        error.name === "TimeoutError" ? `${name} timed out` : error.message,
      );
      if (error.status === 400 && !glm) geminiRejected = true;
    }
  }
  throw lastError;
}
