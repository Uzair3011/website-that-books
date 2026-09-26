import { SITE, breadcrumbJsonLd, organizationJsonLd } from "../site.js";

// Content preserved from the previous privacy page, with the analytics
// section updated to describe what the site actually loads today.
const body = `      <section class="hero">
        <div class="container narrow">
          <p class="eyebrow">Privacy</p>
          <h1>Your information, handled with care.</h1>
          <p class="lede">Last updated 26 September 2026. This page explains the information used by the Veltra Media marketing website, its audit and enquiry forms, and its strategy-call booking.</p>
        </div>
      </section>

      <section class="section">
        <div class="container narrow">
          <div class="prose">
            <h2>What you share with us</h2>
            <p>The form asks for your name, email, business name, business type, and consent to a response. Your phone number, website and goal are optional. Please do not include customer records, patient information, medical records or sensitive personal details.</p>

            <h2>How we use it</h2>
            <p>We use an enquiry to assess your needs, reply, and arrange a call or produce your free audit. Submitting it does not subscribe you to marketing, or consent to automated marketing calls or texts. If online delivery is unavailable, we show an error and do not claim your enquiry has been received.</p>

            <h2>Service providers and booking</h2>
            <p>Website hosting providers may process normal security and access logs. When you book a call, the time you choose and the details you enter are added to our Google Calendar, and a calendar invitation is sent to you (with a video link, where enabled). Google's privacy terms apply to that invitation. Confirmation and notification emails are sent over our own configured mail provider.</p>
            <p>Successfully submitted enquiries and bookings are also forwarded to our configured business intake provider for follow-up, where one is configured. Call, email and WhatsApp links open the relevant external service, whose own privacy terms apply. The website does not embed a booking tracker or load these services automatically.</p>

            <h2>Browser storage and analytics</h2>
            <p>This site stores only your selected light or dark appearance in your browser. Form entries are not saved to browser storage. See the <a href="/cookie-policy">cookie policy</a> for detail.</p>
            <p>We use Vercel Web Analytics to understand aggregate traffic, such as which pages are visited. It does not use cookies and does not identify individual visitors. Where Google Search Console is connected, it is used to understand search performance. Neither is used to build advertising profiles. No advertising pixels or third-party advertising trackers are installed. Your host may retain operational access logs.</p>

            <h2>Access, corrections and deletion</h2>
            <p>You can request access to, correction of, or deletion of information by using our <a href="/contact">contact page</a> or replying to an existing conversation. We retain enquiry information only as needed to handle your request, maintain the business relationship, or satisfy applicable obligations. Actual retention in connected providers depends on their configured policies.</p>

            <h2>Client systems have a separate scope</h2>
            <p>This marketing website is not a customer or patient portal. Data handling for any system we build for your business is agreed separately, including vendor suitability, access, and any necessary contracts before customer or patient information is connected.</p>

            <h2>Contact</h2>
            <p>Questions about this policy can be sent to <a href="mailto:${SITE.email}">${SITE.email}</a> or raised on <a href="tel:${SITE.phone}">${SITE.phoneLabel}</a>.</p>
          </div>
        </div>
      </section>`;

export default {
  path: "/privacy",
  title: "Privacy Policy | Veltra Media",
  description:
    "How Veltra Media handles the information you share through the website, the free audit and enquiry forms, and strategy-call booking.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Privacy policy", path: "/privacy" },
    ]),
  ],
  body,
};
