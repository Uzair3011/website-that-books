// Minimal SMTP client over TLS (Zoho Mail and any standard SMTP provider). No mail SDK, matching
// the raw-fetch approach already used for the Google Calendar API. Credentials come only from server env.
import { connect as connectPlain } from "node:net";
import { connect as connectTls } from "node:tls";

const CRLF = "\r\n";
const TIMEOUT_MS = 15000;

export function emailConfigured(env = process.env) {
  return Boolean(
    env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM_EMAIL,
  );
}

// Where the internal booking notification goes; falls back to the sending mailbox.
export function adminAddress(env = process.env) {
  return env.ADMIN_EMAIL || env.SMTP_FROM_EMAIL;
}

function smtpPort(env) {
  const port = Number(env.SMTP_PORT || 465);
  return Number.isInteger(port) && port > 0 ? port : 465;
}

// Port 465 expects TLS from the first byte; 587 starts plaintext and upgrades via STARTTLS.
function smtpSecure(env, port) {
  const configured = env.SMTP_SECURE?.trim().toLowerCase();
  if (configured === "true") return true;
  if (configured === "false") return false;
  return port === 465;
}

function ehloName(env) {
  try {
    return new URL(env.SITE_URL).hostname;
  } catch {
    return "localhost";
  }
}

// Buffers incoming lines and resolves one call to next() per complete (possibly multi-line) SMTP reply.
function createResponseReader(socket) {
  let buffer = "";
  let block = [];
  const completed = [];
  const waiters = [];
  function push(response) {
    if (waiters.length) waiters.shift().resolve(response);
    else completed.push(response);
  }
  function fail(error) {
    while (waiters.length) waiters.shift().reject(error);
  }
  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");
    let index;
    while ((index = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, index).replace(/\r$/, "");
      buffer = buffer.slice(index + 1);
      const match = /^(\d{3})([ -])/.exec(line);
      if (!match) continue;
      block.push(line);
      if (match[2] === " ") {
        push({ code: Number(match[1]), text: block.join("\n") });
        block = [];
      }
    }
  });
  socket.on("error", fail);
  socket.on("close", () => fail(new Error("SMTP connection closed unexpectedly.")));
  return {
    next() {
      if (completed.length) return Promise.resolve(completed.shift());
      return new Promise((resolve, reject) => waiters.push({ resolve, reject }));
    },
  };
}

async function command(socket, reader, line, expected) {
  socket.write(line + CRLF);
  const response = await reader.next();
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (!allowed.includes(response.code))
    throw new Error(`SMTP command failed (${response.code}).`);
  return response;
}

function encodeHeaderValue(value) {
  if (/^[\x20-\x7e]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function base64Body(html) {
  return Buffer.from(html, "utf8").toString("base64").match(/.{1,76}/g)?.join(CRLF) || "";
}

function buildMessage({ fromName, from, to, subject, html, replyTo }) {
  const headers = [
    `From: ${encodeHeaderValue(fromName)} <${from}>`,
    `To: <${to}>`,
    replyTo && `Reply-To: <${replyTo}>`,
    `Subject: ${encodeHeaderValue(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}@${from.split("@")[1] || "localhost"}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ].filter(Boolean);
  return headers.join(CRLF) + CRLF + CRLF + base64Body(html);
}

export async function sendEmail({ to, subject, html, replyTo }) {
  const env = process.env;
  if (!emailConfigured(env)) throw new Error("Email is not configured.");
  const host = env.SMTP_HOST;
  const port = smtpPort(env);
  const secure = smtpSecure(env, port);
  let socket = secure
    ? connectTls({ host, port, servername: host })
    : connectPlain({ host, port });
  socket.setTimeout(TIMEOUT_MS, () => socket.destroy(new Error("SMTP connection timed out.")));
  let reader = createResponseReader(socket);
  try {
    await reader.next(); // 220 greeting
    await command(socket, reader, `EHLO ${ehloName(env)}`, 250);
    if (!secure) {
      await command(socket, reader, "STARTTLS", 220);
      socket = connectTls({ socket, host, servername: host });
      socket.setTimeout(TIMEOUT_MS, () => socket.destroy(new Error("SMTP connection timed out.")));
      reader = createResponseReader(socket);
      await command(socket, reader, `EHLO ${ehloName(env)}`, 250);
    }
    await command(socket, reader, "AUTH LOGIN", 334);
    await command(socket, reader, Buffer.from(env.SMTP_USER).toString("base64"), 334);
    await command(socket, reader, Buffer.from(env.SMTP_PASS).toString("base64"), 235);
    const from = env.SMTP_FROM_EMAIL;
    await command(socket, reader, `MAIL FROM:<${from}>`, 250);
    await command(socket, reader, `RCPT TO:<${to}>`, [250, 251]);
    await command(socket, reader, "DATA", 354);
    const message = buildMessage({
      from,
      fromName: env.SMTP_FROM_NAME || "Veltra Media",
      html,
      replyTo,
      subject,
      to,
    });
    socket.write(message + CRLF + "." + CRLF);
    const sent = await reader.next();
    if (sent.code !== 250) throw new Error(`SMTP send failed (${sent.code}).`);
    socket.write(`QUIT${CRLF}`);
  } finally {
    socket.end();
  }
}
