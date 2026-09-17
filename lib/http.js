// Shared guards for the JSON form endpoints. Responses never echo provider details or personal data.
export const MAX_BODY_BYTES = 8192;

export function clientAddress(req) {
  return String(
    req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown",
  )
    .split(",")[0]
    .trim();
}

// Per serverless instance, not a global durable anti-abuse system.
export function createRateLimiter({ limit, windowMs }) {
  const buckets = new Map();
  return function hit(req, stamp) {
    for (const [key, value] of buckets)
      if (value.expires <= stamp) buckets.delete(key);
    const address = clientAddress(req);
    const bucket = buckets.get(address) || {
      count: 0,
      expires: stamp + windowMs,
    };
    if (bucket.count >= limit)
      return {
        limited: true,
        retryAfter: Math.ceil((bucket.expires - stamp) / 1000),
      };
    bucket.count++;
    buckets.set(address, bucket);
    return { limited: false };
  };
}

export function sendRateLimited(res, retryAfter) {
  res.setHeader("Retry-After", String(retryAfter));
  return res.status(429).json({
    ok: false,
    message:
      "Too many requests. Please wait a few minutes before trying again.",
  });
}

// Validates a same-origin JSON POST. Returns the parsed body, or null after responding.
export function readJsonPost(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      ok: false,
      message: "Please submit this form using POST.",
    });
    return null;
  }
  const origin = req.headers.origin;
  const expected = process.env.SITE_URL || `https://${req.headers.host}`;
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(expected).host) {
        res.status(403).json({
          ok: false,
          message: "Please submit your request from the Veltra Media website.",
        });
        return null;
      }
    } catch {
      res.status(403).json({ ok: false, message: "Invalid request origin." });
      return null;
    }
  }
  if (
    !(req.headers["content-type"] || "")
      .toLowerCase()
      .startsWith("application/json")
  ) {
    res
      .status(415)
      .json({ ok: false, message: "Please use the website form." });
    return null;
  }
  let raw = req.body;
  try {
    if (typeof raw === "string") raw = JSON.parse(raw);
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw new Error();
    if (Buffer.byteLength(JSON.stringify(raw)) > MAX_BODY_BYTES) {
      res.status(413).json({
        ok: false,
        message: "Your request is too long. Please shorten your message.",
      });
      return null;
    }
  } catch {
    res.status(400).json({
      ok: false,
      message: "We couldn’t read your request. Please try again.",
    });
    return null;
  }
  if (raw.fax) {
    res
      .status(400)
      .json({ ok: false, message: "Unable to process this request." });
    return null;
  }
  return raw;
}
