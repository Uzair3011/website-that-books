// Serves the production build in dist/ the way Vercel does, for performance
// measurement (Lighthouse): cleanUrls, the headers from vercel.json and
// brotli/gzip compression. Static files only: no API routes or redirects.
// Usage: npm run build && npm run preview  →  http://localhost:4175
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const root = resolve("dist");
const port = Number(process.env.PORT || 4175);
const config = JSON.parse(await readFile("vercel.json", "utf8"));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};
const compressible = /^(text\/|application\/xml|image\/svg)/;

// vercel.json sources use path-to-regexp; the ones in this project only need "(.*)".
const matches = (source, pathname) =>
  new RegExp(`^${source.replace(/\(\.\*\)/g, ".*")}$`).test(pathname);

async function find(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/";
  const candidates =
    clean === "/" ? ["index.html"] : [clean.slice(1), `${clean.slice(1)}.html`];
  for (const file of candidates) {
    if (file.includes("..")) continue;
    try {
      return { file, data: await readFile(resolve(root, file)) };
    } catch {
      /* Try the next candidate. */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  for (const rule of config.headers)
    if (
      matches(rule.source, pathname) &&
      (rule.has || []).every(
        (has) => has.type === "query" && url.searchParams.has(has.key),
      )
    )
      for (const { key, value } of rule.headers) res.setHeader(key, value);

  const found = (await find(pathname)) || {
    ...(await find("/404.html")),
    missing: true,
  };
  const type = mime[extname(found.file)] || "application/octet-stream";
  res.statusCode = found.missing ? 404 : 200;
  res.setHeader("Content-Type", type);
  let body = found.data;
  const accept = req.headers["accept-encoding"] || "";
  if (compressible.test(type)) {
    res.setHeader("Vary", "Accept-Encoding");
    if (accept.includes("br")) {
      body = brotliCompressSync(body);
      res.setHeader("Content-Encoding", "br");
    } else if (accept.includes("gzip")) {
      body = gzipSync(body);
      res.setHeader("Content-Encoding", "gzip");
    }
  }
  res.end(req.method === "HEAD" ? undefined : body);
}).listen(port, "127.0.0.1", () =>
  console.log(`Preview of dist/ → http://localhost:${port}`),
);
