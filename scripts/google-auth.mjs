// One-time helper: authorize the booking calendar and print a refresh token for GOOGLE_REFRESH_TOKEN.
// Uses the OAuth loopback flow with PKCE. Run: npm run google:auth
import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { GOOGLE_SCOPES } from "../lib/google-calendar.js";

const { GOOGLE_CLIENT_ID: clientId, GOOGLE_CLIENT_SECRET: clientSecret } =
  process.env;
if (!clientId || !clientSecret) {
  console.error(
    "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first (OAuth client type: Desktop app).",
  );
  process.exit(1);
}
const verifier = randomBytes(32).toString("base64url");
const state = randomBytes(16).toString("hex");

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname !== "/") return res.writeHead(404).end();
  const finish = (message, code = 0) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`${message}\nYou can close this tab.`);
    server.close();
    process.exitCode = code;
  };
  if (url.searchParams.get("state") !== state || !url.searchParams.get("code"))
    return finish("Authorization was cancelled or invalid.", 1);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: url.searchParams.get("code"),
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  const body = await response.json();
  if (!response.ok || !body.refresh_token)
    return finish(
      "Google did not return a refresh token. Remove the app's access at myaccount.google.com/permissions and try again.",
      1,
    );
  console.log(
    "\nAdd this to Vercel as a Sensitive environment variable (and to .env for local testing):\n",
  );
  console.log(`GOOGLE_REFRESH_TOKEN=${body.refresh_token}\n`);
  finish("Authorized. Return to your terminal.");
});

let redirectUri;
server.listen(0, "127.0.0.1", () => {
  redirectUri = `http://127.0.0.1:${server.address().port}`;
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
    code_challenge: createHash("sha256").update(verifier).digest("base64url"),
    code_challenge_method: "S256",
  });
  console.log(
    `Sign in with the Google account that owns the booking calendar:\n\n${auth}\n`,
  );
});
