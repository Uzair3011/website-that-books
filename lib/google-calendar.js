// Minimal Google Calendar REST client using an OAuth refresh token. Credentials come only from server env.
const API = "https://www.googleapis.com/calendar/v3";
export const BOOKING_SOURCE = "veltra-media-booking";
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
];

export function googleConfigured(env = process.env) {
  return Boolean(
    env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET &&
    env.GOOGLE_REFRESH_TOKEN,
  );
}

class GoogleError extends Error {
  constructor(status) {
    super(`Google Calendar request failed (${status})`);
    this.status = status;
  }
}

let token = null;
async function accessToken() {
  if (token && token.expires > Date.now() + 60000) return token.value;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(8000),
    redirect: "error",
  });
  if (!response.ok) throw new GoogleError(response.status);
  const body = await response.json();
  token = {
    value: body.access_token,
    expires: Date.now() + body.expires_in * 1000,
  };
  return token.value;
}

async function request(path, { method = "GET", query, body } = {}) {
  const url = new URL(API + path);
  for (const [key, value] of Object.entries(query || {}))
    url.searchParams.set(key, value);
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      ...(body && { "Content-Type": "application/json" }),
    },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    redirect: "error",
  });
  if (!response.ok) throw new GoogleError(response.status);
  return response.status === 204 ? null : response.json();
}

const calendarId = () => process.env.GOOGLE_CALENDAR_ID || "primary";
const eventsPath = () =>
  `/calendars/${encodeURIComponent(calendarId())}/events`;

export const googleCalendar = {
  async busy(timeMin, timeMax) {
    const id = calendarId();
    const result = await request("/freeBusy", {
      method: "POST",
      body: {
        timeMin: new Date(timeMin).toISOString(),
        timeMax: new Date(timeMax).toISOString(),
        items: [{ id }],
      },
    });
    const calendar = result.calendars?.[id];
    if (!calendar || calendar.errors?.length) throw new GoogleError("freebusy");
    return calendar.busy.map((b) => ({
      start: Date.parse(b.start),
      end: Date.parse(b.end),
    }));
  },
  create(event) {
    // sendUpdates stays "none": Google's own guest-invite email always comes from the
    // connected calendar account, not the business address. Booking emails go through
    // lib/email.js instead, so the client sees a proper sender and Veltra Media hears about it.
    return request(eventsPath(), {
      method: "POST",
      query: { sendUpdates: "none", conferenceDataVersion: "1" },
      body: event,
    });
  },
  get(id) {
    return request(`${eventsPath()}/${encodeURIComponent(id)}`);
  },
  async listBookings(timeMin, timeMax) {
    const result = await request(eventsPath(), {
      query: {
        timeMin: new Date(timeMin).toISOString(),
        timeMax: new Date(timeMax).toISOString(),
        singleEvents: "true",
        privateExtendedProperty: `source=${BOOKING_SOURCE}`,
        maxResults: "50",
      },
    });
    return result.items || [];
  },
  remove(id) {
    // Only used to evict the losing side of a simultaneous double-booking, which was
    // never told it succeeded, so no cancellation email is warranted either.
    return request(`${eventsPath()}/${encodeURIComponent(id)}`, {
      method: "DELETE",
      query: { sendUpdates: "none" },
    });
  },
};
