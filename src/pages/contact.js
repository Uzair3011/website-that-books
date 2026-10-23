import { inquiryForm } from "../form.js";
import {
  CTA,
  SITE,
  breadcrumbJsonLd,
  finalCta,
  icon,
} from "../site.js";

const body = `      <section class="hero compact">
        <div class="container">
          <div class="hero-copy">
            <p class="eyebrow">Contact</p>
            <h1>Contact Veltra Media</h1>
            <p class="lede"><strong>Let's work out what you actually need.</strong> Tell us about the business and what you want more of. We will reply with a practical starting point, the service that fits, and anything worth fixing first &mdash; including when that is nothing we sell.</p>
          </div>
        </div>
      </section>

      <section class="section tight">
        <div class="container">
          <div class="contact-split">
            <div class="contact-intro">
              <p class="eyebrow">Reach a person</p>
              <h2>WhatsApp, email or send a message.</h2>
              <div class="prose">
                <p><strong>Not sure where to start?</strong> The <a href="${CTA.href}">free website plan</a> is usually the most useful first step. You get a practical starting point and a short video review, and you are under no obligation afterwards.</p>
                <p>We work with businesses across Middlesbrough, Stockton-on-Tees, Redcar, Billingham, Hartlepool and the wider Tees Valley, and remotely elsewhere in the UK. You can read <a href="/about">who is behind Veltra Media</a> before you get in touch.</p>
              </div>
              <ul class="contact-methods">
                <li><a data-contact="whatsapp" href="${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}<span>${SITE.phoneLabel}<small>WhatsApp &mdash; Monday to Friday</small></span></a></li>
                <li><a href="mailto:${SITE.email}">${icon("mail")}<span>${SITE.email}<small>We reply to every genuine enquiry</small></span></a></li>
                <li><a data-contact="booking" data-booking-option hidden>${icon("search")}<span>Book a time<small>Pick a slot in our calendar</small></span></a></li>
              </ul>
            </div>
${inquiryForm({
  heading: "Send us a message",
  intro:
    "If live call times are available you can pick one here. Otherwise send the details and we will come back to you with a time.",
  submitLabel: "Send my message",
})}
          </div>
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
    "Contact Veltra Media in Middlesbrough by WhatsApp, email or the enquiry form about web design, local SEO, landing pages, AI reception or booking automation.",
  jsonLd: [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ],
  body,
};
