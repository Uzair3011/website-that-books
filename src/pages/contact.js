import { inquiryForm } from "../form.js";
import {
  CTA,
  SITE,
  breadcrumbJsonLd,
  finalCta,
  icon,
  organizationJsonLd,
} from "../site.js";

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 44rem">
            <p class="eyebrow">Contact</p>
            <h1>Let's work out what you actually need.</h1>
            <p class="lede">Tell us about the business and what you want more of. We will reply with a practical starting point, the service that fits, and anything worth fixing first &mdash; including when that is nothing we sell.</p>
          </div>
        </div>
      </section>

      <section class="section tight">
        <div class="container">
          <div class="head-split start">
            <div>
              <p class="eyebrow">Reach a person</p>
              <h2>Call, email or send a message.</h2>
            </div>
            <div class="prose">
              <p><strong>Not sure where to start?</strong> The <a href="${CTA.href}">free website plan</a> is usually the most useful first step. You get a practical starting point and a short video review, and you are under no obligation afterwards.</p>
              <p>We work with businesses across Middlesbrough, Stockton-on-Tees, Redcar, Billingham, Hartlepool and the wider Tees Valley, and remotely elsewhere in the UK.</p>
            </div>
          </div>
          <ul class="contact-methods row">
            <li><a href="tel:${SITE.phone}">${icon("phone")}<span>${SITE.phoneLabel}<small>Call or text &mdash; Monday to Friday</small></span></a></li>
            <li><a href="mailto:${SITE.email}">${icon("mail")}<span>${SITE.email}<small>We reply to every genuine enquiry</small></span></a></li>
            <li><a data-contact="whatsapp" hidden>${icon("chat")}<span>WhatsApp<small>Message us directly</small></span></a></li>
            <li><a data-contact="booking" data-booking-option hidden>${icon("search")}<span>Book a time<small>Pick a slot in our calendar</small></span></a></li>
          </ul>
        </div>
      </section>

      <section class="section tight flush-top">
        <div class="container">
${inquiryForm({
  heading: "Send us a message",
  intro:
    "If live call times are available you can pick one here. Otherwise send the details and we will come back to you with a time.",
  submitLabel: "Send my message",
  goalLabel: "What do you want to achieve?",
  goalPlaceholder:
    "More enquiries, more bookings, better quality leads, showing up for a particular service…",
})}
        </div>
      </section>

${finalCta({
  heading: "Prefer to see the problem first?",
  body: "Request the free website and Google audit instead. You will get a straight assessment of where enquiries are being lost before any conversation about money.",
})}`;

export default {
  path: "/contact",
  title: "Contact Veltra Media | Middlesbrough & Teesside",
  description:
    "Contact Veltra Media in Middlesbrough. Call, email or send a message about web design, local SEO, landing pages, AI reception or booking automation across Teesside.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ],
  body,
};
