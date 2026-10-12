// /checkout/cancelled?service=<slug>: where Stripe sends a customer who backs out. Nothing is
// charged and nothing is changed here; the unused session simply expires and Stripe tells the
// webhook, which marks the record expired.
import { SITE, icon } from "../site.js";

const body = `      <section class="checkout checkout-result">
        <div class="container narrow">
          <div class="result-card" data-state="cancelled">
            <span class="result-icon" data-tone="neutral" aria-hidden="true">${icon("arrow")}</span>
            <p class="eyebrow center">Checkout cancelled</p>
            <h1>No payment was taken.</h1>
            <p class="lede">You left the secure checkout before paying<span id="cancelled-service"></span>. Nothing has been charged, and you can pick up where you left off whenever you are ready.</p>
            <div class="button-row">
              <a class="btn" href="/pricing" id="cancelled-retry">Return to checkout${icon("arrow-up")}</a>
              <a class="btn secondary" href="${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}Ask us a question</a>
            </div>
            <p class="fine-print">Prefer to pay by invoice, or want to talk the scope through first? Email <a href="mailto:${SITE.email}">${SITE.email}</a> and we will sort it out.</p>
          </div>
        </div>
      </section>`;

export default {
  path: "/checkout/cancelled",
  title: "Checkout cancelled | Veltra Media",
  description: "Your Veltra Media checkout was cancelled. No payment was taken.",
  noindex: true,
  bodyClass: "page-checkout",
  scripts: ["/assets/checkout.js"],
  body,
};
