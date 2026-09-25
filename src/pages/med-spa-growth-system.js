import { SETUP_TOTAL, SYSTEM } from "../../assets/business.js";
import {
  CTA,
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  finalCta,
  icon,
  organizationJsonLd,
  related,
  serviceJsonLd,
} from "../site.js";

// Specialist landing page for med spas and aesthetic clinics, carrying the
// clinic positioning and the opportunity calculator that no longer belong on
// the agency homepage.
//
// Pricing is composed from the standard GBP service list on /pricing — there is
// no separate clinic bundle and no discount. Every figure comes from
// assets/business.js so the page, the calculator and /terms cannot drift.
const money = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: SYSTEM.currency,
    maximumFractionDigits: 0,
  }).format(amount);

const components = SYSTEM.components
  .map(
    (component) =>
      `                <li>${icon("check")}<span>${component.name} &mdash; ${money(component.price)}</span></li>`,
  )
  .join("\n");
const FAQS = [
  {
    q: "Is this right for my clinic?",
    a: "<p>The best fit is an independent med spa or aesthetic clinic with an established offer, regular enquiries, and room for more consultations. The strategy call determines whether the investment makes sense for your volume and workflow. If it does not, we will say so.</p>",
  },
  {
    q: "Can you work with my current website and booking tools?",
    a: "<p>Often, yes. We first assess what is already useful. Google Calendar appointment schedules, Calendly, or your existing booking provider may be suitable. Direct integration depends on its available connections and permissions; we confirm compatibility and any extra costs before you sign.</p>",
  },
  {
    q: "What can the AI say — and when does a person take over?",
    a: "<p>We configure approved business information, consultation questions and booking rules. Treatment advice, suitability decisions, emergencies, and questions outside that scope are directed to your team. Your clinic approves the scripts and handoff rules before launch. The system is not a clinical decision-maker.</p>",
  },
  {
    q: "Is there a monthly cost?",
    a: "<p>Only if you want one. Website care is optional and starts at £49 a month for hosting, updates, backups, monitoring and support. Separately, the AI receptionist consumes usage from its underlying provider; we pass that through at cost and show you the figure before you commit. Advertising, premium integrations and major new features are quoted and approved before any work starts.</p>",
  },
  {
    q: "Will this bring me new leads?",
    a: "<p>The system is designed to convert and follow up with the interest your clinic already receives. The website supports organic discovery, but traffic, ad campaigns and a specific number of leads or bookings are not guaranteed. Campaign planning is included; media buying and ad spend are separate.</p>",
  },
  {
    q: "What does the system cost, and how does the guarantee work?",
    a: '<p>There is no separate clinic bundle price. The system is four standard services at their standard prices: the Business website £895, AI receptionist £495, website chat £295, and CRM, booking and follow-up automation £395 — £2,080 in total, excluding VAT. You can buy any one of them on its own. The delivery guarantee applies to the agreed launch checklist, with a 14-day opportunity to fix failures. <a href="/pricing">See the full price list</a> or <a href="/terms">read all scope and guarantee terms.</a></p>',
  },
  {
    q: "Do I have to sign a long contract?",
    a: "<p>No. The setup is a one-off project fee, and the optional care plan is month-to-month — you can cancel it with 30 days' notice. You own your domain, supplied content and paid-for custom website work; third-party software remains subject to its own licensing.</p>",
  },
  {
    q: "How do you handle client information?",
    a: "<p>We keep the intake flow focused on booking and business information. Clinical records stay in your appropriate clinical system. We agree access permissions, data handling and any vendor requirements before connecting a clinic's tools. Follow-up uses the appropriate consent, opt-out and human-handover settings. No blanket compliance or certification claim is made.</p>",
  },
];

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">Specialist system &middot; Med spas &amp; aesthetic clinics</p>
              <h1>Your next client is calling. Be there.</h1>
              <p class="lede">A complete growth system for med spas and aesthetic clinics: a conversion-focused website, an AI receptionist, website chat, online booking and follow-up &mdash; built and connected as one.</p>
              <div class="button-row">
                <a class="btn" href="/contact">Book a free strategy call${icon("arrow-up")}</a>
                <a class="btn secondary" href="#system-pricing">See what it costs</a>
              </div>
              <p class="hero-note">Four standard services, £2,080 in total, and you can buy any one of them on its own. <a href="/pricing" style="color: inherit; text-decoration: underline">See the full price list.</a></p>
            </div>
            <figure class="hero-media reveal">
              <img src="/assets/work/example-clinic.svg" width="1280" height="900" alt="A clinic website design with a treatment list and a live booking panel showing selectable dates and times." />
            </figure>
          </div>
        </div>
      </section>

      <section class="proof-strip">
        <div class="container">
          <ul class="proof-list">
            <li>${icon("check")}Built and connected for you</li>
            <li>${icon("check")}Approved answers, clear human handover</li>
            <li>${icon("check")}Consultations booked into your real calendar</li>
            <li>${icon("check")}Month-to-month after launch</li>
          </ul>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">The problem</p>
            <h2>Most clinics lose consultations before anyone picks up.</h2>
            <p class="lede">Aesthetics is a considered purchase. People research late at night, compare two or three clinics, ask one specific question, and go with whoever answers it first and sounds most reassuring.</p>
          </div>
          <ol class="steps reveal">
            <li>
              <h3>The enquiry arrives out of hours</h3>
              <p>Evenings and weekends are when people browse treatments. A form that gets read on Monday has already lost to a clinic that replied on Saturday.</p>
            </li>
            <li>
              <h3>The question is always the same</h3>
              <p>Do you do this treatment, what does it roughly cost, how long does it take, is there downtime, when could I come in. Factual, repetitive, and answerable without a clinician.</p>
            </li>
            <li>
              <h3>Booking takes four messages</h3>
              <p>Each exchange is another chance to go cold. Live availability turns that into one step.</p>
            </li>
            <li>
              <h3>Nobody follows up</h3>
              <p>“I'll check my diary” is where most consultations quietly die. One consent-based follow-up recovers a meaningful share of them.</p>
            </li>
          </ol>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">What is included</p>
            <h2>Four services, connected as one system.</h2>
          </div>
          <ul class="chain reveal">
            <li><b>Website</b><h3>Conversion-focused clinic site</h3><p>Treatments, trust signals and a clear consultation path, built mobile-first.</p></li>
            <li><b>Reception</b><h3>AI phone &amp; website chat</h3><p>Approved answers, enquiry capture, and immediate handover to your team where it matters.</p></li>
            <li><b>Booking</b><h3>Live online booking</h3><p>Real availability from your calendar, with the appointment, confirmation and reminder handled automatically.</p></li>
            <li><b>Follow-up</b><h3>Consent-based sequences</h3><p>A short, useful follow-up for the people who did not book, that stops on reply or opt-out.</p></li>
          </ul>
          <p class="disclosure" style="margin-top: 32px; color: inherit">The system handles intake and administration. It does not give treatment advice, make suitability decisions, or act as a clinical decision-maker &mdash; those always go to your team.</p>
        </div>
      </section>

      <section class="section" id="results">
        <div class="container">
          <div class="two-col">
            <div class="section-head" style="margin-bottom: 0">
              <p class="eyebrow">Your opportunity</p>
              <h2>Work out what extra consultations would be worth.</h2>
              <p>Adjust the inputs to your own clinic. These are example figures you supply, not a forecast and not a claim about likely results.</p>
            </div>
            <div>
              <div class="range-field">
                <label for="bookings">Extra completed visits each month <output id="bookings-output" for="bookings">8</output></label>
                <input id="bookings" type="range" min="0" max="30" value="8" />
              </div>
              <div class="range-field">
                <label for="visit-value">Average revenue per visit <output id="visit-value-output" for="visit-value">£350</output></label>
                <input id="visit-value" type="range" min="50" max="1500" step="10" value="350" />
              </div>
              <div class="range-field">
                <label for="margin">Contribution margin after treatment costs <output id="margin-output" for="margin">50%</output></label>
                <input id="margin" type="range" min="10" max="90" step="5" value="50" />
              </div>
              <div class="roi-result">
                <span>Illustrative monthly contribution</span>
                <strong id="roi-net">£1,351</strong>
                <small><span id="roi-gross">£2,800</span> revenue &times; <span id="roi-margin">50%</span> margin &minus; £49 monthly care plan</small>
                <div class="roi-split">
                  <span>Visits to cover the care plan: <b id="roi-breakeven">1 visit</b></span>
                  <span>Setup payback: <b id="roi-payback">1.5 months</b></span>
                </div>
              </div>
              <p class="roi-note" style="margin-top: 14px">Excludes VAT, fixed overheads, advertising and AI provider usage. Margin means revenue after variable treatment costs, not net business profit.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section band-light" id="system-pricing">
        <div class="container">
          <div class="two-col">
            <div class="section-head" style="margin-bottom: 0">
              <p class="eyebrow">Investment</p>
              <h2>Four services. Standard prices.</h2>
              <p>There is no separate clinic bundle price. The system is the four services below, at the same prices any business pays on <a href="/pricing" class="text-link">our pricing page</a> &mdash; and you can still buy any one of them on its own.</p>
              <p><a class="text-link" href="/terms#guarantee">How the launch guarantee works${icon("arrow-up")}</a></p>
            </div>
            <article class="price-card featured">
              <p class="price-name">Med-spa growth system</p>
              <p class="offer-price">
                <strong data-setup-price>${money(SETUP_TOTAL)}</strong>
                <span>one-off setup</span>
              </p>
              <p class="monthly-price">Then optional website care from <b>${money(SYSTEM.care)} / month</b></p>
              <ul class="tick-list">
${components}
                <li>${icon("check")}<span>One location and one calendar connection</span></li>
                <li>${icon("check")}<span>AI provider usage passed through at cost</span></li>
                <li>${icon("check")}<span>Month-to-month after launch. Care is never required</span></li>
              </ul>
              <a class="btn" href="/contact">Let's see if we're a fit${icon("arrow-up")}</a>
              <p class="fine-print">All prices exclude VAT. Final scope and any third-party costs are confirmed in writing before work begins. <a href="/terms">Read the scope, usage and offer terms.</a></p>
            </article>
          </div>
        </div>
      </section>

${faqSection(FAQS, { heading: "Questions clinics actually ask.", eyebrow: "Clinic FAQ" })}

${related(
  [
    {
      href: "/ai-automation-middlesbrough",
      label: "AI receptionist + website chat",
      text: "The reception layer, available on its own in GBP.",
    },
    {
      href: "/crm-booking-automation",
      label: "CRM, booking + follow-up",
      text: "Live calendar booking, confirmations and reminders.",
    },
    {
      href: "/pricing",
      label: "Standard pricing",
      text: "Every service priced separately for non-clinic businesses.",
    },
  ],
  "Buy the pieces separately instead",
)}

${finalCta({
  heading: "Let's make it easier for them to choose you.",
  body: "A no-pressure conversation about your clinic, your enquiry volume and whether this system would actually pay for itself.",
  primary: "Book a free strategy call",
  href: "/contact",
})}`;

export default {
  path: "/med-spa-growth-system",
  title: "Med Spa Growth System | Website, AI Reception & Booking | Veltra Media",
  description:
    "A growth system for med spas and aesthetic clinics in Middlesbrough and Teesside: website, AI receptionist, website chat and booking automation. Four standard services, £2,080 in total, each available on its own.",
  jsonLd: [
    organizationJsonLd(),
    serviceJsonLd({
      name: "Med spa growth system",
      description:
        "A managed website, AI receptionist, website chat, online booking and follow-up system for med spas and aesthetic clinics.",
      path: "/med-spa-growth-system",
    }),
    faqJsonLd(FAQS),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Med-spa growth system", path: "/med-spa-growth-system" },
    ]),
  ],
  body,
};
