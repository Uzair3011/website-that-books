// Minimal Gemini API client (REST, no SDK), matching the raw-fetch style used for Google
// Calendar and Supabase. Server-only: the API key never reaches the browser.
export const DEFAULT_MODEL = "gemini-3.5-flash-lite";

export function geminiConfigured(env = process.env) {
  return Boolean(env.GEMINI_API_KEY);
}

export async function generate(
  { system, contents, tools, maxOutputTokens = 350 },
  env = process.env,
) {
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
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
      signal: AbortSignal.timeout(20000),
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
