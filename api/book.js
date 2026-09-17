import { createHash, randomUUID } from "node:crypto";
import { validateInquiry } from "../assets/validation.js";
import {
  BOOKING_SOURCE,
  googleCalendar,
  googleConfigured,
} from "../lib/google-calendar.js";
import {
  createRateLimiter,
  readJsonPost,
  sendRateLimited,
} from "../lib/http.js";
import { availableSlots, bookingSettings } from "../lib/schedule.js";
import {
  CONSENT_TEXT,
  PRIVACY_VERSION,
  deliverToWebhook,
  hasIntake,
} from "./inquiry.js";

const MINUTE = 60 * 1000;
const limiter = createRateLimiter({ limit: 6, windowMs: 10 * 60 * 1000 });
const unavailable = {
  ok: false,
  code: "slot_unavailable",
  message:
    "Sorry, that time is no longer available. Please choose another time.",
};

function describe(data, requestId) {
  return [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    `Business: ${data.business}`,
    `Business type: ${data.businessType}`,
    data.website && `Website: ${data.website}`,
    data.challenge && `\nWhere they could use a hand:\n${data.challenge}`,
    `\nBooked on the Veltra Media website. Reference: ${requestId}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function createBookingHandler({
  calendar = googleCalendar,
  configured = googleConfigured,
  settings = () => bookingSettings(),
  notify = async (payload) => {
    if (hasIntake()) await deliverToWebhook(payload);
  },
  now = Date.now,
  rateLimit = true,
} = {}) {
  return async function book(req, res) {
    const raw = readJsonPost(req, res);
    if (!raw) return;
    const { data, errors, valid } = validateInquiry(raw);
    const start = Date.parse(raw.start);
    if (typeof raw.start !== "string" || Number.isNaN(start))
      errors.start = "Please choose a time for your call.";
    const key =
      typeof raw.bookingKey === "string" &&
      /^[\w-]{16,64}$/.test(raw.bookingKey)
        ? raw.bookingKey
        : randomUUID();
    if (!valid || errors.start)
      return res.status(422).json({
        ok: false,
        errors,
        message: "Please check the highlighted fields.",
      });
    if (!configured())
      return res.status(503).json({
        ok: false,
        message:
          "Online booking is temporarily unavailable. No time has been reserved. Please send a request instead, or use a direct contact option.",
      });
    if (rateLimit) {
      const { limited, retryAfter } = limiter(req, now());
      if (limited) return sendRateLimited(res, retryAfter);
    }

    let rules;
    let event;
    let duplicate = false;
    const startIso = new Date(start).toISOString();
    const requestId = randomUUID();
    // Deterministic id (base32hex-safe) makes retries of the same submission idempotent.
    const id = createHash("sha256")
      .update(`${key}|${startIso}`)
      .digest("hex")
      .slice(0, 40);
    const existingBooking = () =>
      calendar.get(id).then(
        (found) => (found && found.status !== "cancelled" ? found : null),
        () => null,
      );
    try {
      rules = settings();
      const end = start + rules.duration * MINUTE;
      const padding = rules.buffer * MINUTE;
      // Re-check the chosen slot against live rules and busy time; never trust the client.
      const busy = await calendar.busy(start - padding, end + padding);
      if (!availableSlots(rules, now(), busy).includes(startIso)) {
        // A retry whose first attempt succeeded sees its own event as busy.
        if (!(event = await existingBooking()))
          return res.status(409).json(unavailable);
        duplicate = true;
      } else {
        event = await calendar
          .create({
            id,
            summary: `Veltra Media strategy call · ${data.business}`,
            description: describe(data, requestId),
            start: { dateTime: startIso, timeZone: rules.timezone },
            end: {
              dateTime: new Date(end).toISOString(),
              timeZone: rules.timezone,
            },
            attendees: [{ email: data.email, displayName: data.name }],
            guestsCanInviteOthers: false,
            guestsCanSeeOtherGuests: false,
            transparency: "opaque",
            reminders: { useDefault: true },
            extendedProperties: {
              private: { source: BOOKING_SOURCE, requestId },
            },
            ...(process.env.BOOKING_GOOGLE_MEET !== "false" && {
              conferenceData: {
                createRequest: {
                  requestId,
                  conferenceSolutionKey: { type: "hangoutsMeet" },
                },
              },
            }),
          })
          .catch(async (error) => {
            // 409: this id already exists. Only a live event counts as a booking.
            if (error.status !== 409 || !(event = await existingBooking()))
              throw error;
            duplicate = true;
            return event;
          });
      }
    } catch {
      return res.status(502).json({
        ok: false,
        message:
          "We couldn’t confirm your booking, so no time has been reserved. Your details are still in the form. Please try again.",
      });
    }

    const end = start + rules.duration * MINUTE;
    if (!duplicate) {
      // Resolve simultaneous bookings for the same slot: the earliest created event wins.
      try {
        const padding = rules.buffer * MINUTE;
        const rivals = (
          await calendar.listBookings(start - padding, end + padding)
        ).filter(
          (other) =>
            other.id !== event.id &&
            other.status !== "cancelled" &&
            Date.parse(other.start?.dateTime) < end + padding &&
            Date.parse(other.end?.dateTime) > start - padding &&
            (Date.parse(other.created) < Date.parse(event.created) ||
              (other.created === event.created && other.id < event.id)),
        );
        if (rivals.length) {
          await calendar.remove(event.id);
          return res.status(409).json(unavailable);
        }
      } catch {
        // The event exists and the invite was sent; a failed race check must not hide a real booking.
      }
      await notify({
        ...data,
        source: BOOKING_SOURCE,
        bookedStart: startIso,
        bookedEnd: new Date(end).toISOString(),
        timezone: rules.timezone,
        submittedAt: new Date(now()).toISOString(),
        requestId,
        consentText: CONSENT_TEXT,
        privacyVersion: PRIVACY_VERSION,
      }).catch(() => {
        /* The calendar is the system of record; CRM forwarding is best effort. */
      });
    }
    return res.status(200).json({
      ok: true,
      booking: { start: startIso, end: new Date(end).toISOString() },
    });
  };
}
export default createBookingHandler();
