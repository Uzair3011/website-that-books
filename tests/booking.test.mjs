import test from "node:test";
import assert from "node:assert/strict";
import { createAvailabilityHandler } from "../api/availability.js";
import { createBookingHandler } from "../api/book.js";
import { publicConfig } from "../lib/public-config.js";
import {
  availableSlots,
  bookingSettings,
  parseHours,
  zonedTimeToUtc,
} from "../lib/schedule.js";

// Monday 14 September 2026, 08:00 London (07:00 UTC, BST).
const NOW = Date.parse("2026-09-14T07:00:00Z");
const settings = bookingSettings({
  BOOKING_TIMEZONE: "Europe/London",
  BOOKING_HOURS: "mon-fri 09:00-11:00",
  BOOKING_DURATION_MINUTES: "20",
  BOOKING_SLOT_INTERVAL_MINUTES: "30",
  BOOKING_BUFFER_MINUTES: "10",
  BOOKING_MIN_NOTICE_HOURS: "2",
  BOOKING_HORIZON_DAYS: "7",
});
const valid = {
  name: "Test Owner",
  email: "test@example.com",
  business: "Test Clinic",
  businessType: "Med spa / aesthetic clinic",
  consent: true,
  start: "2026-09-15T08:00:00.000Z",
  bookingKey: "0123456789abcdef0123",
};
const request = (patch = {}) => ({
  method: "POST",
  headers: {
    host: "localhost:4174",
    origin: "http://localhost:4174",
    "content-type": "application/json",
    "x-forwarded-for": "test",
  },
  body: valid,
  ...patch,
});
function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}
function fakeCalendar(patch = {}) {
  const calendar = {
    events: [],
    removed: [],
    busy: async () => [],
    async create(event) {
      const created = {
        ...event,
        created: "2026-09-14T07:00:00.000Z",
        status: "confirmed",
      };
      calendar.events.push(created);
      return created;
    },
    async get(id) {
      const found = calendar.events.find((e) => e.id === id);
      if (!found) throw Object.assign(new Error(), { status: 404 });
      return found;
    },
    listBookings: async () => calendar.events,
    async remove(id) {
      calendar.removed.push(id);
    },
    ...patch,
  };
  return calendar;
}
async function book(req, options = {}) {
  const res = response();
  await createBookingHandler({
    configured: () => true,
    settings: () => settings,
    notify: async () => {},
    now: () => NOW,
    rateLimit: false,
    ...options,
  })(req, res);
  return res;
}

test("business hours parse day ranges, lists, and wrap-around", () => {
  const hours = parseHours(
    "mon-wed 09:00-12:00; fri,sat 10:00-14:00; sun-mon 13:00-15:00",
  );
  assert.deepEqual(hours.get(1), [
    { start: 540, end: 720 },
    { start: 780, end: 900 },
  ]);
  assert.equal(hours.get(4), undefined);
  assert.deepEqual(hours.get(6), [{ start: 600, end: 840 }]);
  assert.throws(() => parseHours("weekdays 9-5"));
  assert.throws(() => parseHours("mon 12:00-09:00"));
  assert.throws(() => bookingSettings({ BOOKING_TIMEZONE: "Mars/Olympus" }));
  assert.throws(() => bookingSettings({ BOOKING_DURATION_MINUTES: "0" }));
});

test("zoned times convert across daylight saving and skip nonexistent times", () => {
  assert.equal(
    new Date(zonedTimeToUtc(2026, 7, 1, 540, "Europe/London")).toISOString(),
    "2026-07-01T08:00:00.000Z",
  );
  assert.equal(
    new Date(zonedTimeToUtc(2026, 12, 1, 540, "Europe/London")).toISOString(),
    "2026-12-01T09:00:00.000Z",
  );
  assert.equal(
    new Date(
      zonedTimeToUtc(2026, 9, 14, 540, "America/New_York"),
    ).toISOString(),
    "2026-09-14T13:00:00.000Z",
  );
  assert.equal(zonedTimeToUtc(2026, 3, 29, 90, "Europe/London"), null);
});

test("slots respect hours, notice, weekends, horizon, and buffered busy time", () => {
  const slots = availableSlots(settings, NOW, []);
  // Monday: 09:00 and 09:30 are inside the 2-hour notice; 10:00 and 10:30 remain.
  assert.equal(slots[0], "2026-09-14T09:00:00.000Z");
  assert.equal(slots.length, 2 + 4 * 4);
  assert.ok(
    !slots.some(
      (s) => s.startsWith("2026-09-19") || s.startsWith("2026-09-20"),
    ),
  );
  // A meeting ending at 09:25 London blocks 09:30 because of the 10-minute buffer.
  const busy = [
    {
      start: Date.parse("2026-09-15T08:00:00Z"),
      end: Date.parse("2026-09-15T08:25:00Z"),
    },
  ];
  const withBusy = availableSlots(settings, NOW, busy);
  assert.ok(!withBusy.includes("2026-09-15T08:00:00.000Z"));
  assert.ok(!withBusy.includes("2026-09-15T08:30:00.000Z"));
  assert.ok(withBusy.includes("2026-09-15T09:00:00.000Z"));
});

test("availability is unavailable without credentials and never leaks provider errors", async () => {
  const run = async (options) => {
    const res = response();
    await createAvailabilityHandler({
      settings: () => settings,
      now: () => NOW,
      rateLimit: false,
      ...options,
    })({ method: "GET", headers: {} }, res);
    return res;
  };
  assert.equal((await run({ configured: () => false })).statusCode, 503);
  const failed = await run({
    configured: () => true,
    calendar: {
      busy: async () => {
        throw new Error("token secret");
      },
    },
  });
  assert.equal(failed.statusCode, 502);
  assert.ok(!JSON.stringify(failed.body).includes("secret"));
  const ok = await run({ configured: () => true, calendar: fakeCalendar() });
  assert.equal(ok.statusCode, 200);
  assert.equal(ok.body.timezone, "Europe/London");
  assert.equal(ok.body.slots.length, 18);
});

test("booking validates input, origin, and configuration before touching the calendar", async () => {
  const calendar = fakeCalendar();
  assert.equal(
    (await book(request({ body: { ...valid, start: "soon" } }), { calendar }))
      .statusCode,
    422,
  );
  assert.equal(
    (await book(request({ body: { ...valid, consent: false } }), { calendar }))
      .statusCode,
    422,
  );
  assert.equal(
    (await book(request({ body: { ...valid, fax: "bot" } }), { calendar }))
      .statusCode,
    400,
  );
  assert.equal(
    (
      await book(
        request({
          headers: { ...request().headers, origin: "https://evil.example" },
        }),
        { calendar },
      )
    ).statusCode,
    403,
  );
  assert.equal(
    (await book(request(), { calendar, configured: () => false })).statusCode,
    503,
  );
  assert.equal(calendar.events.length, 0);
});

test("booking rejects times outside the live rules or already busy", async () => {
  const calendar = fakeCalendar();
  // Saturday, and a time inside the notice period.
  for (const start of [
    "2026-09-19T08:00:00.000Z",
    "2026-09-14T08:00:00.000Z",
    "2026-09-15T08:05:00.000Z",
  ])
    assert.equal(
      (await book(request({ body: { ...valid, start } }), { calendar }))
        .statusCode,
      409,
    );
  const busy = fakeCalendar({
    busy: async () => [
      { start: Date.parse(valid.start), end: Date.parse(valid.start) + 1 },
    ],
  });
  const taken = await book(request(), { calendar: busy });
  assert.equal(taken.statusCode, 409);
  assert.equal(taken.body.code, "slot_unavailable");
  assert.equal(calendar.events.length + busy.events.length, 0);
});

test("a valid booking creates one invited event and forwards it to the CRM", async () => {
  const calendar = fakeCalendar();
  const notified = [];
  const result = await book(
    request({ body: { ...valid, challenge: "Missed calls" } }),
    {
      calendar,
      notify: async (payload) => notified.push(payload),
    },
  );
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.body.booking, {
    start: valid.start,
    end: "2026-09-15T08:20:00.000Z",
  });
  const [event] = calendar.events;
  assert.match(event.id, /^[0-9a-f]{40}$/);
  assert.deepEqual(event.attendees, [
    { email: valid.email, displayName: valid.name },
  ]);
  assert.equal(event.start.timeZone, "Europe/London");
  assert.match(event.description, /Missed calls/);
  assert.equal(event.extendedProperties.private.source, "veltra-media-booking");
  assert.equal(notified.length, 1);
  assert.equal(notified[0].bookedStart, valid.start);
});

test("retrying the same submission is idempotent, even after it made the slot busy", async () => {
  const calendar = fakeCalendar();
  assert.equal((await book(request(), { calendar })).statusCode, 200);
  const event = calendar.events[0];
  calendar.busy = async () => [
    {
      start: Date.parse(event.start.dateTime),
      end: Date.parse(event.end.dateTime),
    },
  ];
  const retry = await book(request(), { calendar });
  assert.equal(retry.statusCode, 200);
  assert.equal(calendar.events.length, 1);
  // Another visitor with a different key cannot take the same slot.
  const other = await book(
    request({ body: { ...valid, bookingKey: "ffffffffffffffffffff" } }),
    { calendar },
  );
  assert.equal(other.statusCode, 409);
  // A cancelled event is not reported as a booking.
  event.status = "cancelled";
  assert.equal((await book(request(), { calendar })).statusCode, 409);
});

test("simultaneous bookings for one slot keep only the earliest", async () => {
  const rival = {
    id: "0000rival",
    status: "confirmed",
    created: "2026-09-14T06:59:59.000Z",
    start: { dateTime: valid.start },
    end: { dateTime: "2026-09-15T08:20:00.000Z" },
  };
  const calendar = fakeCalendar();
  calendar.events.push(rival);
  const result = await book(request(), { calendar });
  assert.equal(result.statusCode, 409);
  assert.equal(calendar.removed.length, 1);
  assert.notEqual(calendar.removed[0], rival.id);
});

test("calendar failures never report a booking", async () => {
  const calendar = fakeCalendar({
    create: async () => {
      throw Object.assign(new Error("private"), { status: 500 });
    },
  });
  const result = await book(request(), { calendar });
  assert.equal(result.statusCode, 502);
  assert.ok(!JSON.stringify(result.body).includes("private"));
});

test("public config accepts valid contact details and rejects malformed ones", () => {
  assert.deepEqual(
    publicConfig({
      PUBLIC_CONTACT_EMAIL: "hello@veltramedia.com",
      PUBLIC_CONTACT_PHONE: "+447466539736",
      PUBLIC_WHATSAPP_NUMBER: "+447466539736",
    }),
    {
      bookingUrl: "",
      email: "hello@veltramedia.com",
      phone: "+447466539736",
      whatsapp: "447466539736",
    },
  );
  assert.throws(() => publicConfig({ PUBLIC_CONTACT_PHONE: "07466539736" }));
  assert.throws(() =>
    publicConfig({ PUBLIC_BOOKING_URL: "http://calendly.com/x" }),
  );
});
