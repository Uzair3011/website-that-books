// Minimal Gemini API client (REST, no SDK), matching the raw-fetch style used for Google
// Calendar and Supabase. Server-only: the API key never reaches the browser.
export const DEFAULT_MODEL = "gemini-3.5-flash-lite";
// A different model family, so an outage or hang on the main model rarely hits both.
export const DEFAULT_FALLBACK_MODEL = "gemini-2.5-flash-lite";
// Per attempt. Two attempts stay well inside the browser's 30-second wait.
const ATTEMPT_MS = 9000;
// Which model wrote a reply. A symbol, so it never leaks into a request body when the
// content is echoed back to Gemini.
export const MODEL = Symbol("gemini model");

export function geminiConfigured(env = process.env) {
  return Boolean(env.GEMINI_API_KEY);
}

export function modelChain(env = process.env) {
  const primary = env.GEMINI_MODEL || DEFAULT_MODEL;
  const fallback = env.GEMINI_FALLBACK_MODEL ?? DEFAULT_FALLBACK_MODEL;
  return [...new Set([primary, fallback].filter(Boolean))];
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
    const error = new Error("Gemini request failed");
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
  for (const name of chain) {
    try {
      const content = await request(
        name,
        { system, contents, tools, maxOutputTokens },
        env,
      );
      content[MODEL] = name;
      return content;
    } catch (error) {
      lastError = error;
      // A malformed request fails the same way on every model.
      if (error.status === 400) break;
    }
  }
  throw lastError;
}
