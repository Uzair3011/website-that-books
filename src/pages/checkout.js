// /checkout?service=<slug>: the order summary and customer details, before Stripe's own secure
// payment page. The service picker lists what can be bought in this build (the £1 test item only
// with a Stripe test key); assets/checkout.js fills the summary from the same catalogue, and the
// server re-checks the service and its price before anything is charged.
import { purchasableItems } from "../../assets/catalog.js";
import { checkoutEnabled } from "../../lib/payments.js";
import { paymentSettings } from "../../lib/stripe.js";
import { CTA, SITE, icon } from "../site.js";

const gbp = (amount) => `£${amount.toLocaleString("en-GB")}`;
const enabled = checkoutEnabled();
const { testMode, taxRate } = paymentSettings();
const items = purchasableItems({ testMode });

const options = items
  .map((item) => `<option value="${item.slug}">${item.name} · ${gbp(item.price)}</option>`)
  .join("");

const form = `<div class="checkout-grid">
            <aside class="price-card featured checkout-summary" aria-labelledby="summary-name">
              <div class="checkout-summary-top">
                <p class="bundle-label">Your order</p>
                <p class="checkout-test-badge" id="summary-test" hidden>Test mode</p>
              </div>
              <div class="field">
                <label for="checkout-service">Service</label>
                <div class="select-wrap">
                  <select id="checkout-service" name="service" form="checkout-form" aria-describedby="checkout-service-error">
                    <option value="">Choose a service</option>
                    ${options}
                  </select>${icon("chevron")}
                </div>
                <p class="field-error" id="checkout-service-error"></p>
              </div>
              <div class="checkout-summary-body" id="summary-body" aria-live="polite">
                <h2 class="checkout-service-name" id="summary-name">Choose a service</h2>
                <p id="summary-description">Pick a service above to see exactly what is included and what you pay.</p>
                <ul class="tick-list" id="summary-features"></ul>
              </div>
              <dl class="checkout-lines">
                <div><dt>Price</dt><dd id="summary-price">–</dd></div>
                ${taxRate ? '<div><dt>VAT</dt><dd>Added at checkout</dd></div>' : ""}
                <div class="is-total"><dt>Due today</dt><dd id="summary-total">–</dd></div>
              </dl>
              <p class="checkout-test-note" id="summary-test-note" hidden>${icon("tool")}<span>Stripe test mode: no real money moves. Pay with card <b>4242 4242 4242 4242</b>, any future expiry date and any CVC.</span></p>
            </aside>

            <div class="form-shell checkout-form-shell">
              <form class="inquiry-form" id="checkout-form" method="post" action="/api/checkout" novalidate>
                <div class="honeypot" aria-hidden="true">
                  <label for="checkout-fax">Leave this blank</label>
                  <input id="checkout-fax" name="fax" tabindex="-1" autocomplete="off" />
                </div>
                <div class="form-head">
                  <h2>Your details</h2>
                  <p>We use these to confirm your order and agree a start date. You enter your card on the next step, on Stripe’s secure page.</p>
                </div>
                <div class="form-grid">
                  <div class="field">
                    <label for="checkout-name">Your name</label>
                    <input id="checkout-name" name="name" autocomplete="name" required maxlength="100" placeholder="First and last name" />
                    <p class="field-error" id="checkout-name-error"></p>
                  </div>
                  <div class="field">
                    <label for="checkout-email">Email</label>
                    <input id="checkout-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@yourbusiness.co.uk" />
                    <p class="field-error" id="checkout-email-error"></p>
                  </div>
                  <div class="field full">
                    <label for="checkout-business">Business name <span>(optional)</span></label>
                    <input id="checkout-business" name="business" autocomplete="organization" maxlength="150" placeholder="Your business" />
                    <p class="field-error" id="checkout-business-error"></p>
                  </div>
                </div>
                <label class="consent" for="checkout-terms">
                  <input id="checkout-terms" name="terms" type="checkbox" required />
                  <span>I agree to the <a href="/terms">terms</a> and have read the <a href="/privacy">privacy policy</a>. After payment we confirm the scope and start date with you in writing.</span>
                </label>
                <p class="field-error" id="checkout-terms-error"></p>
                <button class="btn dark form-submit block" type="submit" id="checkout-submit">
                  ${icon("lock")}<span id="checkout-submit-label">Continue to secure payment</span>
                </button>
                <p class="form-message" id="checkout-message" role="status" aria-live="polite" tabindex="-1"></p>
                <ul class="form-reassurance">
                  <li>${icon("lock")}Secure payment by Stripe</li>
                  <li>${icon("shield")}Your card details never reach us</li>
                  <li>${icon("check")}Email receipt</li>
                </ul>
                <p class="fine-print">Prices exclude VAT. Need an invoice, a deposit split or a custom quote instead? Message us on <a href="${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a> or email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
                <noscript><p class="form-message error">Please enable JavaScript to check out, or message us and we will send a secure payment link.</p></noscript>
              </form>
            </div>
          </div>`;

// Built without Stripe configured: an honest page instead of a checkout that cannot work.
const closed = `<div class="result-card">
            <span class="result-icon" data-tone="neutral">${icon("lock")}</span>
            <h2>Online payment isn’t available yet.</h2>
            <p>You can still buy any service: message us and we will confirm the scope and send a secure payment link or an invoice.</p>
            <div class="button-row">
              <a class="btn" href="${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}Message us on WhatsApp</a>
              <a class="btn secondary" href="${CTA.href}">${CTA.primary}</a>
            </div>
          </div>`;

const body = `      <section class="checkout">
        <div class="container">
          <a class="checkout-back" href="/pricing">${icon("arrow")}Back to pricing</a>
          <div class="checkout-head">
            <p class="eyebrow">Secure checkout</p>
            <h1>Complete your order</h1>
            <p class="lede">Check the service and the price, add your details, then pay on Stripe’s secure page.</p>
          </div>
          ${enabled ? form : closed}
        </div>
      </section>`;

export default {
  path: "/checkout",
  title: "Checkout | Veltra Media",
  description: "Pay for a Veltra Media service securely online with Stripe.",
  noindex: true,
  bodyClass: "page-checkout",
  scripts: enabled ? ["/assets/checkout.js"] : [],
  body,
};
