// Free backup model for the chat assistant, used when Gemini is busy: Groq's free tier.
// Groq's API is OpenAI-style, so this translates the Gemini-shaped conversation and tools the
// chat endpoint uses into that format and back. Server-only: the key never reaches the browser.
// Groq's free limits are small (about 12,000 tokens a minute), which is why the backup gets
// only the passages relevant to the question (relevantKnowledge) rather than the whole site.
export const DEFAULT_BACKUP_MODEL = "llama-3.3-70b-versatile";
const BASE = "https://api.groq.com/openai/v1";
const ATTEMPT_MS = 12000;
// Chain entries for the backup carry this prefix, so replies can be routed back to it.
export const BACKUP_PREFIX = "groq/";

export function backupConfigured(env = process.env) {
  return Boolean(env.GROQ_API_KEY);
}

export function backupModel(env = process.env) {
  return BACKUP_PREFIX + (env.GROQ_MODEL || DEFAULT_BACKUP_MODEL);
}

const textOf = (parts = []) =>
  parts
    .filter((part) => typeof part.text === "string")
    .map((part) => part.text)
    .join("");

// Gemini contents → OpenAI-style messages.
export function toMessages(system, contents) {
  const messages = [{ role: "system", content: system }];
  for (const content of contents) {
    const call = content.parts?.find((part) => part.functionCall)?.functionCall;
    const result = content.parts?.find(
      (part) => part.functionResponse,
    )?.functionResponse;
    if (call)
      messages.push({
        role: "assistant",
        content: textOf(content.parts) || null,
        tool_calls: [
          {
            id: call.id || "call_1",
            type: "function",
            function: {
              name: call.name,
              arguments: JSON.stringify(call.args || {}),
            },
          },
        ],
      });
    else if (result)
      messages.push({
        role: "tool",
        tool_call_id: result.id || "call_1",
        content: JSON.stringify(result.response),
      });
    else
      messages.push({
        role: content.role === "model" ? "assistant" : "user",
        content: textOf(content.parts),
      });
  }
  return messages;
}

// Gemini functionDeclarations → OpenAI-style tools.
export const toTools = (tools) =>
  tools?.flatMap((tool) =>
    (tool.functionDeclarations || []).map((declaration) => ({
      type: "function",
      function: declaration,
    })),
  );

// OpenAI-style reply → Gemini-shaped content, so the chat endpoint handles both the same way.
export function toContent(message = {}) {
  const parts = [];
  if (message.content) parts.push({ text: message.content });
  const call = message.tool_calls?.[0];
  if (call) {
    let args = {};
    try {
      args = JSON.parse(call.function.arguments || "{}");
    } catch {
      /* Unreadable arguments are treated as none; the chat endpoint rejects them. */
    }
    parts.push({
      functionCall: { name: call.function.name, id: call.id, args },
    });
  }
  return { role: "model", parts };
}

export async function backupRequest(
  model,
  { system, contents, tools, maxOutputTokens, force },
  env = process.env,
) {
  const response = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model.slice(BACKUP_PREFIX.length),
      messages: toMessages(system, contents),
      ...(tools && {
        tools: toTools(tools),
        tool_choice: force
          ? { type: "function", function: { name: force } }
          : "auto",
      }),
      temperature: 0.3,
      max_tokens: maxOutputTokens,
    }),
    signal: AbortSignal.timeout(ATTEMPT_MS),
    redirect: "error",
  });
  if (!response.ok) {
    const detail = (await response.text().catch(() => ""))
      .replace(/\s+/g, " ")
      .slice(0, 300);
    const error = new Error(`${model} returned ${response.status}: ${detail}`);
    error.status = response.status;
    throw error;
  }
  const body = await response.json();
  return toContent(body.choices?.[0]?.message);
}
