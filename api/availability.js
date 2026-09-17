import { googleCalendar, googleConfigured } from "../lib/google-calendar.js";
import { createRateLimiter, sendRateLimited } from "../lib/http.js";
import {
  availabilityWindow,
  availableSlots,
  bookingSettings,
} from "../lib/schedule.js";

const limiter = createRateLimiter({ limit: 60, windowMs: 10 * 60 * 1000 });

export function createAvailabilityHandler({
  calendar = googleCalendar,
  configured = googleConfigured,
  settings = () => bookingSettings(),
  now = Date.now,
  rateLimit = true,
} = {}) {
  return async function availability(req, res) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res
        .status(405)
        .json({ ok: false, message: "Method not allowed." });
    }
    if (!configured())
      return res.status(503).json({
        ok: false,
        message: "Online booking is not available right now.",
      });
    if (rateLimit) {
      const { limited, retryAfter } = limiter(req, now());
      if (limited) return sendRateLimited(res, retryAfter);
    }
    try {
      const rules = settings();
      const stamp = now();
      const { timeMin, timeMax } = availabilityWindow(rules, stamp);
      const busy = await calendar.busy(timeMin, timeMax);
      // Short shared cache smooths bursts; every booking is re-checked live before it is created.
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=30, stale-while-revalidate=30",
      );
      return res.status(200).json({
        ok: true,
        timezone: rules.timezone,
        duration: rules.duration,
        slots: availableSlots(rules, stamp, busy),
      });
    } catch {
      return res.status(502).json({
        ok: false,
        message: "We couldn’t load available times. Please try again shortly.",
      });
    }
  };
}
export default createAvailabilityHandler();
