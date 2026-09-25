// The enquiry / booking form. Markup contract is shared with assets/app.js,
// api/inquiry.js and api/book.js — element ids here must not change casually.
import { businessTypes } from "../assets/validation.js";
import { SITE, icon } from "./site.js";

export function inquiryForm({
  heading = "Get my free website plan",
  intro = "Tell us about the business and what you want the website to achieve. We will reply with a practical starting point, the package that fits and any gaps worth fixing first.",
  submitLabel = "Get my free website plan",
  // The homepage form is a short plan request; it skips the calendar picker.
  booking = true,
  goalLabel = "What do you want the website to achieve?",
  goalPlaceholder = "More enquiries, more bookings, better quality leads, ranking for a specific service…",
} = {}) {
  const options = businessTypes
    .map((type) => `<option>${type}</option>`)
    .join("");

  return `<div class="form-shell" id="audit-form">
  <div class="form-head">
    <h2 id="form-heading">${heading}</h2>
    <p id="form-intro">${intro}</p>
  </div>
  <div class="booking-confirmed" id="booking-confirmed" tabindex="-1" hidden>
    <h2>Your call is booked.</h2>
    <p>We have you down for <strong id="booking-confirmed-time"></strong>. A calendar invitation is on its way to <strong id="booking-confirmed-email"></strong>, including the joining link.</p>
    <p>If that time stops working, reply to the invitation and we will move it.</p>
  </div>
  <form class="inquiry-form" id="inquiry-form" method="post" action="/api/inquiry"${booking ? "" : ' data-booking="off"'} novalidate>
    <div class="honeypot" aria-hidden="true">
      <label for="fax">Leave this blank</label>
      <input id="fax" name="fax" tabindex="-1" autocomplete="off" />
    </div>
    <fieldset class="slot-picker" id="slot-picker" aria-describedby="slot-timezone slot-error" hidden>
      <legend id="slot-legend">Choose a time for your call</legend>
      <p class="slot-timezone" id="slot-timezone"></p>
      <fieldset class="slot-group">
        <legend>Date</legend>
        <div class="slot-options slot-days" id="slot-days"></div>
      </fieldset>
      <fieldset class="slot-group" id="slot-time-group" hidden>
        <legend id="slot-time-legend">Time</legend>
        <div class="slot-options slot-times" id="slot-times"></div>
      </fieldset>
      <p class="field-error" id="slot-error"></p>
    </fieldset>
    <div class="form-main">
    <div class="form-grid">
      <div class="field">
        <label for="full-name">Your name</label>
        <input id="full-name" name="name" autocomplete="name" required maxlength="100" placeholder="First and last name" />
        <p class="field-error" id="full-name-error"></p>
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@yourbusiness.co.uk" />
        <p class="field-error" id="email-error"></p>
      </div>
      <div class="field">
        <label for="business">Business name</label>
        <input id="business" name="business" autocomplete="organization" required maxlength="150" placeholder="Your business" />
        <p class="field-error" id="business-error"></p>
      </div>
      <div class="field">
        <label for="business-type">Business type</label>
        <select id="business-type" name="businessType" required>
          <option value="">Choose your business type</option>
          ${options}
        </select>
        <p class="field-error" id="business-type-error"></p>
      </div>
      <div class="field">
        <label for="website">Website <span>(optional)</span></label>
        <input id="website" name="website" inputmode="url" autocomplete="url" maxlength="300" placeholder="yourbusiness.co.uk" />
        <p class="field-error" id="website-error"></p>
      </div>
      <div class="field">
        <label for="phone">Phone <span>(optional)</span></label>
        <input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="Including country code" />
        <p class="field-error" id="phone-error"></p>
      </div>
      <div class="field full">
        <label for="challenge">${goalLabel} <span>(optional)</span></label>
        <textarea id="challenge" name="challenge" maxlength="2000" placeholder="${goalPlaceholder}"></textarea>
        <p class="field-error" id="challenge-error"></p>
      </div>
    </div>
    <label class="consent" for="consent">
      <input id="consent" name="consent" type="checkbox" required />
      <span>I agree to be contacted about this request and have read the <a href="/privacy">privacy policy</a>. This does not sign me up for marketing messages.</span>
    </label>
    <p class="field-error" id="consent-error"></p>
    <button class="btn dark form-submit block" type="submit" id="submit-inquiry" disabled>
      <span id="submit-label">${submitLabel}</span>${icon("arrow-up")}
    </button>
    <p class="form-message" id="form-message" role="status" aria-live="polite" tabindex="-1"></p>
    <ul class="form-reassurance">
      <li>${icon("check")}No obligation</li>
      <li>${icon("check")}No generic sales sequence</li>
      <li>${icon("check")}A useful reply from a real person</li>
    </ul>
    <p class="fine-print">Business details only, please — no customer, patient or clinical information. Prefer to talk first? Call <a href="tel:${SITE.phone}">${SITE.phoneLabel}</a>.</p>
    <noscript><p class="form-message error">Please enable JavaScript to send this request.</p></noscript>
    </div>
  </form>
</div>`;
}
