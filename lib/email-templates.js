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

// The lead's own details, shared by the booking and enquiry notifications.
function leadDetails(payload) {
  return `
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    ${payload.email ? `<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>` : ""}
    <p><strong>Phone:</strong> <a href="tel:${escapeHtml(payload.phone)}">${escapeHtml(payload.phone)}</a></p>
    ${payload.business ? `<p><strong>Business:</strong> ${escapeHtml(payload.business)}</p>` : ""}
    ${payload.service ? `<p><strong>Service needed:</strong> ${escapeHtml(payload.service)}</p>` : ""}`;
}

export function bookingAdminEmail(payload) {
  const dateLabel = formatDateLabel(payload.bookedStart, payload.timezone);
  const timeLabel = formatTimeLabel(payload.bookedStart, payload.timezone);
  return `
    <h2>New strategy call booked</h2>
    ${leadDetails(payload)}
    <p><strong>Date:</strong> ${escapeHtml(dateLabel)}</p>
    <p><strong>Time:</strong> ${escapeHtml(timeLabel)} (${escapeHtml(payload.timezone)})</p>
    ${payload.htmlLink ? `<p><strong>Calendar event:</strong> <a href="${escapeHtml(payload.htmlLink)}">Open in Google Calendar</a></p>` : ""}
    ${payload.meetLink ? `<p><strong>Meet link:</strong> <a href="${escapeHtml(payload.meetLink)}">${escapeHtml(payload.meetLink)}</a></p>` : ""}
    <p><strong>Reference:</strong> ${escapeHtml(payload.requestId)}</p>
  `;
}

export function inquiryAdminEmail(payload, heading = "New website enquiry") {
  return `
    <h2>${escapeHtml(heading)}</h2>
    ${leadDetails(payload)}
    ${payload.summary ? `<p><strong>What they need:</strong> ${escapeHtml(payload.summary)}</p>` : ""}
    ${payload.page ? `<p><strong>Sent from:</strong> ${escapeHtml(payload.page)}</p>` : ""}
    <p><strong>Reference:</strong> ${escapeHtml(payload.requestId)}</p>
  `;
}

// Online payments. Sent once, when the verified Stripe webhook first marks a payment paid.
const money = (minor, currency = "gbp") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: currency.toUpperCase() }).format(
    minor / 100,
  );
export const paymentReference = (payment) => payment.id.slice(0, 8).toUpperCase();
const charged = (payment) => money(payment.amount_total ?? payment.amount, payment.currency);

export function paymentConfirmationEmail(payment) {
  return `
    <h2>Thank you, your payment is confirmed</h2>
    <p>Hi ${escapeHtml(payment.customer_name || "there")},</p>
    <p>We've received your payment for <strong>${escapeHtml(payment.service_name)}</strong>.</p>
    <p><strong>Amount paid:</strong> ${escapeHtml(charged(payment))}<br />
    <strong>Reference:</strong> ${escapeHtml(paymentReference(payment))}</p>
    ${payment.livemode ? "" : "<p><strong>This was a test payment. No real money was taken.</strong></p>"}
    <h3>What happens next</h3>
    <p>We'll be in touch to confirm the written scope and a start date. Then you send what we need,
    such as logins, photos and wording, and we build a private preview for you to review before
    anything goes live.</p>
    <p>Any questions? Just reply to this email.</p>
    <p>Thanks for choosing us,<br />Veltra Media</p>
  `;
}

export function paymentAdminEmail(payment) {
  const dashboard = `https://dashboard.stripe.com${payment.livemode ? "" : "/test"}/payments/${payment.stripe_payment_intent_id || ""}`;
  return `
    <h2>New order: ${escapeHtml(payment.service_name)} (${escapeHtml(charged(payment))})</h2>
    ${payment.livemode ? "" : "<p><strong>TEST payment (Stripe test mode), no real money.</strong></p>"}
    <p><strong>Name:</strong> ${escapeHtml(payment.customer_name || "")}</p>
    <p><strong>Email:</strong> ${escapeHtml(payment.customer_email || "")}</p>
    ${payment.customer_phone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(payment.customer_phone)}">${escapeHtml(payment.customer_phone)}</a></p>` : ""}
    ${payment.business_name ? `<p><strong>Business:</strong> ${escapeHtml(payment.business_name)}</p>` : ""}
    <p><strong>Paid:</strong> ${escapeHtml(charged(payment))}</p>
    <p><strong>Reference:</strong> ${escapeHtml(paymentReference(payment))}</p>
    ${payment.stripe_payment_intent_id ? `<p><a href="${escapeHtml(dashboard)}">Open in Stripe</a></p>` : ""}
    <p>Reply to this email to contact the customer.</p>
  `;
}
