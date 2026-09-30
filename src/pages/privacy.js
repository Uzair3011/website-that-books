import { SITE, breadcrumbJsonLd, organizationJsonLd } from "../site.js";

// Written from what the site actually does: forms, booking, the chat assistant,
// the in-browser AI voice call and consent-gated analytics. If a provider or a
// data flow changes, update this page in the same change.
const body = `      <section class="hero">
        <div class="container narrow">
          <p class="eyebrow">Privacy</p>
          <h1>Your information, handled with care.</h1>
          <p class="lede">Last updated 30 September 2026. This page explains the information used by the Veltra Media marketing website: its audit and enquiry forms, strategy-call booking, the chat assistant and the AI voice assistant.</p>
        </div>
      </section>

      <section class="section">
        <div class="container narrow">
          <div class="prose">
            <h2>Who is responsible for your information</h2>
            <p>Veltra Media is responsible for the personal information described on this page, which makes us its &ldquo;controller&rdquo; under UK data protection law. You can reach us about anything on this page at <a href="mailto:${SITE.email}">${SITE.email}</a> or on <a href="tel:${SITE.phone}">${SITE.phoneLabel}</a>.</p>

            <h2>What you share with us</h2>
            <p>The form asks for your name, email, phone number, and consent to a response. Your business name and the service you need are optional. Please do not include customer records, patient information, medical records or sensitive personal details.</p>

            <h2>How we use it</h2>
            <p>We use an enquiry to assess your needs, reply, and arrange a call or produce your free audit. Submitting it does not subscribe you to marketing, or consent to automated marketing calls or texts. If online delivery is unavailable, we show an error and do not claim your enquiry has been received.</p>

            <h2>Service providers and booking</h2>
            <p>Website hosting providers may process normal security and access logs. When you book a call, the time you choose and the details you enter are added to our Google Calendar, and a calendar invitation is sent to you (with a video link, where enabled). Google's privacy terms apply to that invitation. Confirmation and notification emails are sent over our own configured mail provider.</p>
            <p>Enquiries and bookings are stored in our private lead database, hosted by Supabase in the United States, so we can follow them up. Only Veltra Media staff can sign in to view them. Successfully submitted enquiries and bookings are also forwarded to our configured business intake provider for follow-up, where one is configured. Call, email and WhatsApp links open the relevant external service, whose own privacy terms apply. The website does not embed a booking tracker or load these services automatically.</p>

            <h2>Website chat assistant</h2>
            <p>The chat assistant on this website is an AI that answers from the content of our website. What you type is sent to Google's Gemini API to generate replies; under Google's terms for its free service tier, Google may use those messages to improve its products, and they may be reviewed by people. When Google's service is busy, messages are instead sent to Groq, Inc. in the United States to generate the reply. Please do not share sensitive personal information in the chat. If you give your contact details in the chat and agree to be contacted, they are saved to our lead database, with the conversation, in the same way as a form enquiry.</p>

            <h2>AI voice assistant</h2>
            <p>The <strong>Talk to AI</strong> button starts a voice call in your browser with an AI assistant provided by ElevenLabs. Your browser asks for permission to use your microphone, and the microphone is used only while a call is in progress. The assistant tells you it is an AI when the call starts, and calls end automatically after five minutes.</p>
            <p>What you say is sent to ElevenLabs, which may process it in the United States, so the assistant can understand and answer you. ElevenLabs keeps a record of each call, which can include the audio and a transcript, in our ElevenLabs account under that account's retention settings. Please do not share sensitive personal information on the call.</p>
            <p>If you give your details and agree to a call back, the assistant saves your name, phone number, email address if you give one, business name, the service you need and a short summary to our lead database, in the same way as a form enquiry. The main phone number on this site is separate and always reaches a person, not the AI.</p>

            <h2>Browser storage and analytics</h2>
            <p>This site stores your privacy choice and your selected light or dark appearance in your browser. Form entries are not saved to browser storage. See the <a href="/cookie-policy">cookie policy</a> for detail.</p>
            <p>If you allow analytics in the privacy banner, we use Vercel Web Analytics to understand aggregate traffic, such as which pages are visited. It does not use cookies and does not identify individual visitors, and it is not loaded unless you allow it. You can change your choice at any time with the Cookie preferences link at the bottom of every page. Where Google Search Console is connected, it is used to understand search performance. Neither is used to build advertising profiles. No advertising pixels or third-party advertising trackers are installed. Your host may retain operational access logs.</p>

            <h2>Our legal reasons for using your information</h2>
            <p>UK data protection law requires a lawful basis for each use of personal information. Ours are:</p>
            <ul>
              <li><strong>Replying to an enquiry, a chat, an AI call or a booking</strong> &mdash; taking steps you have asked for before a possible contract, and our legitimate interest in responding to people who contact us.</li>
              <li><strong>Delivering work for clients</strong> &mdash; performing our contract with you.</li>
              <li><strong>Analytics</strong> &mdash; your consent, given in the privacy banner. You can withdraw it at any time with the Cookie preferences link, and it does not affect anything before you withdrew it.</li>
              <li><strong>Security and access logs</strong> &mdash; our legitimate interest in keeping the website safe and working.</li>
              <li><strong>Invoices and business records</strong> &mdash; our legal obligations, such as tax record-keeping.</li>
            </ul>
            <p>We do not make decisions about you by automated means alone that have legal or similarly significant effects. The chat and voice assistants answer questions and pass details to our team; people make every decision.</p>

            <h2>Transfers outside the UK</h2>
            <p>Some of our providers are based in, or process data in, the United States: Supabase (our lead database), Google (calendar and the Gemini chat model), Groq (the backup chat model), ElevenLabs (the voice assistant) and Vercel (website hosting and analytics). Where information leaves the UK, the transfer relies on the UK&ndash;US data bridge for providers certified under it, or on the standard contractual clauses and UK International Data Transfer Addendum in that provider's data processing terms.</p>

            <h2>How long we keep it</h2>
            <p>We keep enquiry, chat and call details for as long as we need them to handle your request and any follow-up, and we delete leads we are no longer in touch with. Client records are kept for as long as the law requires, which for tax records is usually six years. Information held by the providers above follows their configured retention settings.</p>

            <h2>Your rights</h2>
            <p>You have the right to ask for a copy of your information, and to ask us to correct it, delete it, restrict how we use it or move it to another provider. You can also object to how we use it, and withdraw any consent you have given. To make a request, use our <a href="/contact">contact page</a>, email <a href="mailto:${SITE.email}">${SITE.email}</a> or reply to an existing conversation. We respond within one month.</p>
            <p>If you are unhappy with how we have handled your information, please tell us first so we can put it right. You also have the right to complain to the Information Commissioner's Office (ICO), the UK data protection regulator, at <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk/make-a-complaint</a> or on 0303 123 1113.</p>

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
    "How Veltra Media handles the information you share through the website: enquiry forms, booking, the chat assistant and the AI voice assistant, with your rights and how to complain.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Privacy policy", path: "/privacy" },
    ]),
  ],
  body,
};
