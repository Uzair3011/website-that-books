// /checkout/success?session_id=cs_…: where Stripe returns a customer after paying. The page asks
// /api/checkout-status for the real outcome, so it shows "paid" only when Stripe says so, and
// otherwise the true state: processing, still waiting, failed, expired or refunded.
import { SITE, icon, organizationJsonLd } from "../site.js";

const body = `      <section class="checkout checkout-result">
        <div class="container narrow">
          <div class="result-card" id="result" data-state="loading">
            <span class="result-icon" id="result-icon" data-tone="neutral" aria-hidden="true">
              <span class="result-spinner"></span>
            </span>
            <p class="eyebrow center" id="result-eyebrow">Payment</p>
            <h1 id="result-title" tabindex="-1">Confirming your payment…</h1>
            <p class="lede" id="result-text" role="status" aria-live="polite">This only takes a moment.</p>
            <dl class="checkout-lines result-order" id="result-order" hidden>
              <div><dt>Service</dt><dd id="order-service"></dd></div>
              <div><dt>Amount</dt><dd id="order-amount"></dd></div>
              <div><dt>Reference</dt><dd id="order-reference"></dd></div>
              <div id="order-email-row"><dt>Receipt to</dt><dd id="order-email"></dd></div>
              <div><dt>Status</dt><dd><span class="status-pill" id="order-status"></span></dd></div>
            </dl>
            <div class="result-next" id="result-next" hidden>
              <h2>What happens next</h2>
              <ol>
                <li><span><b>We get in touch</b> to confirm the written scope and a start date.</span></li>
                <li><span><b>You send what we need</b>, such as logins, photos and wording.</span></li>
                <li><span><b>We build, you review</b> a private preview before anything goes live.</span></li>
              </ol>
            </div>
            <div class="button-row" id="result-actions">
              <a class="btn secondary" href="${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}Message us on WhatsApp</a>
            </div>
            <noscript><p class="form-message error">Please enable JavaScript to see your payment status, or message us and we will confirm it.</p></noscript>
          </div>
        </div>
      </section>
      <template id="result-icons">
        <span data-icon="paid">${icon("check")}</span>
        <span data-icon="failed">${icon("x")}</span>
        <span data-icon="waiting">${icon("refresh")}</span>
        <span data-icon="info">${icon("doc")}</span>
        <span data-icon="arrow">${icon("arrow-up")}</span>
      </template>`;

export default {
  path: "/checkout/success",
  title: "Payment status | Veltra Media",
  description: "The status of your Veltra Media payment.",
  noindex: true,
  bodyClass: "page-checkout",
  scripts: ["/assets/checkout.js"],
  jsonLd: [organizationJsonLd()],
  body,
};
