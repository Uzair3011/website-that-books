import { CTA, breadcrumbJsonLd, organizationJsonLd } from "../site.js";

// One currency, one price list. The med-spa system is priced from the same GBP
// services as everything else, so its clauses reference those prices rather
// than a separate bundle.
const body = `      <section class="hero">
        <div class="container narrow">
          <p class="eyebrow">Terms</p>
          <h1>The offer, in plain English.</h1>
          <p class="lede">Last updated 22 September 2026. These are the advertised terms. Your signed proposal or statement of work confirms the exact scope, acceptance checks, delivery schedule and any agreed variations before payment.</p>
        </div>
      </section>

      <section class="section">
        <div class="container narrow">
          <div class="prose">
            <h2>Standard service pricing</h2>
            <p>Prices shown on <a href="/pricing">the pricing page</a> are in GBP and exclude VAT. Any VAT that applies is shown on your written proposal and invoice. Website packages are Launch £495, Business £895 and Growth £1,495, each as a one-off project fee for the scope described. Individual services are priced separately and may be purchased on their own; no package or bundle is a condition of buying any single service.</p>
            <p>Monthly services, including ongoing local SEO from £250 a month and website care from £49 a month, are provided month to month and may be cancelled with 30 days' written notice. Services already delivered and usage already consumed remain payable.</p>

            <h2>Scope, timelines and revisions</h2>
            <p>Stated delivery times run from content approval, not from the date of enquiry or deposit. Each package includes the number of revision rounds listed on the pricing page. Work outside the agreed written scope &mdash; ecommerce, memberships, directories, additional pages, unusual integrations or major redesigns &mdash; is quoted separately and is not started without approval.</p>

            <h2>Third-party and usage costs</h2>
            <p>Domain registration, paid advertising and media buying, premium third-party subscriptions, and the usage cost of any AI provider behind an AI receptionist are excluded unless specifically quoted. Where they apply, they are shown at cost and confirmed in writing before work begins.</p>

            <h2>Ownership</h2>
            <p>Once the agreed project fees are paid, the website and the original content created for it are yours, subject only to any third-party software licences explained in your proposal. You retain your domain and any content you supply. A care plan is never a condition of retaining your own website. We provide an available lead-data export; additional migration work is quoted separately.</p>

            <h2>Search, AI and business outcomes</h2>
            <p>No search ranking is guaranteed, by us or by anyone else. We build the technical and on-page foundations correctly and connect the relevant Google tools; visibility depends on competition, proximity, reviews and factors outside anyone's control.</p>
            <p>AI features support approved administrative questions, intake and scheduling. They do not provide professional, clinical, legal or financial advice, determine suitability, or replace human judgement. Calculators and interface previews on this site are illustrations, not client results or promised returns. Your results depend on your traffic, demand, offer, team and follow-through.</p>

            <h2 id="med-spa-offer">Med-spa growth system</h2>
            <p>The system described on <a href="/med-spa-growth-system">the med-spa growth system page</a> is not a separately priced bundle and carries no bundle discount. It is four of the standard services listed above, at those same prices: the Business website £895, AI receptionist £495, website chat £295, and CRM, booking and follow-up automation £395. That is £2,080 in total, excluding VAT, as a one-off project fee. Each of the four can be bought on its own.</p>
            <p>The scope covers one business location, up to five website pages, one AI receptionist, one website chat widget, one calendar connection, and agreed lead-capture and follow-up sequences. Analytics configuration, lead-response templates, team training, an initial campaign planning session and a 30-day launch check-in are included. Supported connections and the final content scope are confirmed in writing.</p>

            <h3>Recurring costs</h3>
            <p>There is no mandatory monthly plan. Website care is optional at £49 a month for hosting, updates, backups, monitoring and support, cancellable with 30 days' written notice. The AI receptionist consumes usage from its underlying provider; that usage is passed through at cost and the expected figure is confirmed in writing before work begins. Usage limits and fallback handling are agreed before launch; service beyond agreed limits is not promised.</p>

            <h2 id="guarantee">The launch delivery guarantee</h2>
            <p>Before work begins on the med-spa growth system, we agree written acceptance checks for website enquiries, approved AI responses and handover, booking connection, lead visibility and follow-up triggers. You provide the required content, access, approvals and vendor permissions on the agreed schedule.</p>
            <p>If the delivered system fails a written launch acceptance check, tell us which check failed within 14 calendar days of the handover notice. We then have 14 calendar days from receipt of that notice to fix the failure and demonstrate that the check passes. If the same agreed check still fails, you may cancel by written notice within the following 14 calendar days and receive all setup fees paid to Veltra Media back within 14 calendar days of cancellation.</p>
            <p>The guarantee covers our delivery against the original checklist. It does not cover new requirements, client-made changes, missing access or approvals, a provider outage beyond our control, or lead volume, bookings, revenue or clinical outcomes. Approved third-party charges and consumed usage are excluded from the setup-fee refund. The written scope distinguishes these costs before payment.</p>

            <h2>Enquiries and payment</h2>
            <p>This website does not take payments. Submitting the enquiry or audit form does not constitute a purchase, and does not reserve an appointment unless the booking step explicitly confirms a time.</p>

            <p><a class="btn" href="${CTA.href}">${CTA.primary}</a></p>
          </div>
        </div>
      </section>`;

export default {
  path: "/terms",
  title: "Terms | Veltra Media",
  description:
    "Veltra Media's advertised terms: service pricing in GBP, scope and revisions, ownership, third-party costs, the med-spa growth system scope, and the launch delivery guarantee.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Terms", path: "/terms" },
    ]),
  ],
  body,
};
