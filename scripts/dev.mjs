import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname } from "node:path";
import availability from "../api/availability.js";
import book from "../api/book.js";
import inquiry from "../api/inquiry.js";
import status from "../api/status.js";
import { renderConfigScript } from "../lib/public-config.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 4174);
const routes = {
  "/": "index.html",
  "/contact": "contact.html",
  "/privacy": "privacy.html",
  "/terms": "terms.html",
  "/ai-receptionist-for-med-spas": "ai-receptionist-for-med-spas.html",
  "/med-spa-website-design": "med-spa-website-design.html",
  "/med-spa-online-booking": "med-spa-online-booking.html",
  "/pricing": "pricing.html",
  "/about": "about.html",
};
const redirects = {
  "/index.html": "/",
  "/website-that-books-fixed.html": "/",
  "/contact.html": "/contact",
  "/privacy.html": "/privacy",
  "/terms.html": "/terms",
  "/ai-receptionist-for-med-spas.html": "/ai-receptionist-for-med-spas",
  "/med-spa-website-design.html": "/med-spa-website-design",
  "/med-spa-online-booking.html": "/med-spa-online-booking",
  "/pricing.html": "/pricing",
  "/about.html": "/about",
};
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};
const server = createServer(async (req, res) => {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(url.pathname).replace(/\/$/, "") || "/";
    if (pathname === "/api/status") return status(req, res);
    if (pathname === "/api/availability") return await availability(req, res);
    if (pathname === "/assets/config.js") {
      res.setHeader("Content-Type", mime[".js"]);
      res.setHeader("Cache-Control", "no-store");
      return res.end(renderConfigScript());
    }
    const handler = { "/api/inquiry": inquiry, "/api/book": book }[pathname];
    if (handler) {
      let bytes = 0;
      const chunks = [];
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 8192)
          return res.status(413).json({
            ok: false,
            message: "Your request is too long. Please shorten your message.",
          });
        chunks.push(chunk);
      }
      req.body = Buffer.concat(chunks).toString();
      return await handler(req, res);
    }
    if (redirects[pathname]) {
      res.writeHead(308, { Location: redirects[pathname] + url.search });
      return res.end();
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.setHeader("Allow", "GET, HEAD");
      return res.status(405).json({ message: "Method not allowed." });
    }
    const allowed =
      routes[pathname] ||
      (/^\/assets\/[a-zA-Z0-9_./-]+$/.test(pathname) && !pathname.includes("..")
        ? pathname.slice(1)
        : ["/favicon.ico", "/robots.txt", "/sitemap.xml"].includes(pathname)
          ? pathname.slice(1)
          : null);
    let data;
    let file = allowed;
    try {
      if (!file) throw new Error();
      data = await readFile(resolve(root, file));
    } catch {
      file = "404.html";
      data = await readFile(resolve(root, file));
      res.statusCode = 404;
    }
    res.setHeader(
      "Content-Type",
      mime[extname(file)] || "application/octet-stream",
    );
    res.setHeader("Cache-Control", "no-store");
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.status(400).json({ message: "Invalid request." });
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Veltra Media → http://localhost:${port}`),
);
