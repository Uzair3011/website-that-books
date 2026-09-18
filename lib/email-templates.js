// Booking notification emails, sent from the business mailbox instead of relying on
// Google Calendar's own guest-invite email (which always comes from the connected personal account).
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatDateLabel(iso, timezone) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: timezone,
    weekday: "long",
  }).format(new Date(iso));
}

export function formatTimeLabel(iso, timezone) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(iso));
}

export function bookingConfirmationEmail(payload) {
  const dateLabel = formatDateLabel(payload.bookedStart, payload.timezone);
  const timeLabel = formatTimeLabel(payload.bookedStart, payload.timezone);
  return `
    <h2>Your strategy call is booked</h2>
    <p>Hi ${escapeHtml(payload.name)},</p>
    <p>Your call with Veltra Media is confirmed.</p>
    <p><strong>Date:</strong> ${escapeHtml(dateLabel)}</p>
    <p><strong>Time:</strong> ${escapeHtml(timeLabel)} (${escapeHtml(payload.timezone)})</p>
    ${
      payload.meetLink
        ? `<p><strong>Join link:</strong> <a href="${escapeHtml(payload.meetLink)}">${escapeHtml(payload.meetLink)}</a></p>`
        : `<p>We will be in touch with the meeting details beforehand.</p>`
    }
    <p>Need to reschedule? Just reply to this email.</p>
    <p>Talk soon,<br />Veltra Media</p>
  `;
}

export function bookingAdminEmail(payload) {
  const dateLabel = formatDateLabel(payload.bookedStart, payload.timezone);
  const timeLabel = formatTimeLabel(payload.bookedStart, payload.timezone);
  return `
    <h2>New strategy call booked</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    ${payload.phone ? `<p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
    <p><strong>Business:</strong> ${escapeHtml(payload.business)}</p>
    <p><strong>Business type:</strong> ${escapeHtml(payload.businessType)}</p>
    ${payload.website ? `<p><strong>Website:</strong> <a href="${escapeHtml(payload.website)}">${escapeHtml(payload.website)}</a></p>` : ""}
    ${
      payload.challenge
        ? `<p><strong>Where they could use a hand:</strong><br />${escapeHtml(payload.challenge).replaceAll("\n", "<br />")}</p>`
        : ""
    }
    <p><strong>Date:</strong> ${escapeHtml(dateLabel)}</p>
    <p><strong>Time:</strong> ${escapeHtml(timeLabel)} (${escapeHtml(payload.timezone)})</p>
    ${payload.htmlLink ? `<p><strong>Calendar event:</strong> <a href="${escapeHtml(payload.htmlLink)}">Open in Google Calendar</a></p>` : ""}
    ${payload.meetLink ? `<p><strong>Meet link:</strong> <a href="${escapeHtml(payload.meetLink)}">${escapeHtml(payload.meetLink)}</a></p>` : ""}
    <p><strong>Reference:</strong> ${escapeHtml(payload.requestId)}</p>
  `;
}
