// Pure availability rules: business hours in the booking time zone minus calendar busy time.
const DAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MINUTE = 60 * 1000;

function integer(value, fallback, min, max, name) {
  if (value === undefined || value === "") return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max)
    throw new Error(`${name} must be a whole number from ${min} to ${max}.`);
  return number;
}

function clock(value) {
  const match = /^([01]\d|2[0-4]):([0-5]\d)$/.exec(value);
  const minutes = match && Number(match[1]) * 60 + Number(match[2]);
  if (!match || minutes > 1440) throw new Error(`Invalid time "${value}".`);
  return minutes;
}

// "mon-fri 09:00-17:00; sat 10:00-13:00" → Map(dayIndex → [{ start, end }])
export function parseHours(spec) {
  const hours = new Map();
  for (const rule of spec
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)) {
    const match = /^([a-z,-]+)\s+(\d\d:\d\d)-(\d\d:\d\d)$/i.exec(rule);
    if (!match) throw new Error(`Invalid BOOKING_HOURS rule "${rule}".`);
    const start = clock(match[2]);
    const end = clock(match[3]);
    if (end <= start)
      throw new Error(`BOOKING_HOURS rule "${rule}" ends before it starts.`);
    for (const group of match[1].toLowerCase().split(",")) {
      const [from, to = from] = group
        .split("-")
        .map((day) => DAY_NAMES.indexOf(day));
      if (from < 0 || to < 0)
        throw new Error(`Invalid day in BOOKING_HOURS rule "${rule}".`);
      for (let day = from; ; day = (day + 1) % 7) {
        hours.set(day, [...(hours.get(day) || []), { start, end }]);
        if (day === to) break;
      }
    }
  }
  if (!hours.size)
    throw new Error("BOOKING_HOURS must include at least one rule.");
  return hours;
}

export function bookingSettings(env = process.env) {
  const timezone = env.BOOKING_TIMEZONE || "Europe/London";
  new Intl.DateTimeFormat("en-GB", { timeZone: timezone }); // Throws RangeError for unknown zones.
  return {
    timezone,
    hours: parseHours(env.BOOKING_HOURS || "mon-fri 09:00-17:00"),
    duration: integer(
      env.BOOKING_DURATION_MINUTES,
      20,
      10,
      240,
      "BOOKING_DURATION_MINUTES",
    ),
    interval: integer(
      env.BOOKING_SLOT_INTERVAL_MINUTES,
      30,
      5,
      240,
      "BOOKING_SLOT_INTERVAL_MINUTES",
    ),
    buffer: integer(
      env.BOOKING_BUFFER_MINUTES,
      10,
      0,
      240,
      "BOOKING_BUFFER_MINUTES",
    ),
    noticeHours: integer(
      env.BOOKING_MIN_NOTICE_HOURS,
      12,
      0,
      720,
      "BOOKING_MIN_NOTICE_HOURS",
    ),
    horizonDays: integer(
      env.BOOKING_HORIZON_DAYS,
      21,
      1,
      90,
      "BOOKING_HORIZON_DAYS",
    ),
  };
}

const formatters = new Map();
function wallClock(timezone, instant) {
  if (!formatters.has(timezone))
    formatters.set(
      timezone,
      new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hourCycle: "h23",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }),
    );
  const parts = Object.fromEntries(
    formatters
      .get(timezone)
      .formatToParts(instant)
      .map((p) => [p.type, Number(p.value)]),
  );
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
}

// Converts a wall-clock time in a zone to a UTC timestamp; null for times skipped by a DST change.
export function zonedTimeToUtc(year, month, day, minutes, timezone) {
  const wall = Date.UTC(year, month - 1, day, 0, minutes);
  let utc = wall - (wallClock(timezone, wall) - wall);
  utc = wall - (wallClock(timezone, utc) - utc);
  return wallClock(timezone, utc) === wall ? utc : null;
}

// The window whose busy time can affect slots (padded by the buffer).
export function availabilityWindow(settings, now) {
  return {
    timeMin: now - settings.buffer * MINUTE,
    timeMax: now + (settings.horizonDays + 1) * 24 * 60 * MINUTE,
  };
}

export function availableSlots(settings, now, busy = []) {
  const {
    timezone,
    hours,
    duration,
    interval,
    buffer,
    noticeHours,
    horizonDays,
  } = settings;
  const earliest = now + noticeHours * 60 * MINUTE;
  const today = new Date(wallClock(timezone, now));
  const slots = [];
  for (let offset = 0; offset < horizonDays; offset++) {
    const date = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() + offset,
      ),
    );
    for (const window of hours.get(date.getUTCDay()) || []) {
      for (
        let minute = window.start;
        minute + duration <= window.end;
        minute += interval
      ) {
        const start = zonedTimeToUtc(
          date.getUTCFullYear(),
          date.getUTCMonth() + 1,
          date.getUTCDate(),
          minute,
          timezone,
        );
        if (start === null || start < earliest) continue;
        const end = start + duration * MINUTE;
        const blocked = busy.some(
          (b) =>
            b.start < end + buffer * MINUTE && b.end > start - buffer * MINUTE,
        );
        if (!blocked) slots.push(new Date(start).toISOString());
      }
    }
  }
  return slots;
}
