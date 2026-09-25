import { inquiryForm } from "../form.js";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  faqSection,
  finalCta,
  icon,
  organizationJsonLd,
  related,
} from "../site.js";

const FAQS = [
  {
    q: "Is it really free?",
    a: "<p>Yes. There is no charge and no obligation. We do it because it is the most honest way to show how we think, and because a good share of the businesses we audit go on to work with us. If the answer is that you do not need us yet, we will say that instead.</p>",
  },
  {
    q: "How long does it take to get it?",
    a: "<p>Usually two to three working days. If we are unusually busy we will tell you when to expect it rather than leaving you waiting.</p>",
  },
  {
    q: "What if I do not have a website yet?",
    a: "<p>Then we review your Google Business Profile, your visibility for the searches that matter, and what your competitors are doing locally. That is often more useful than a site review anyway.</p>",
  },
  {
    q: "Will I get added to a sales sequence?",
    a: "<p>No. You get the audit, and one follow-up to ask whether it was useful. If you would rather we did not follow up at all, say so in the form and we will not.</p>",
  },
  {
    q: "Who actually does the review?",
    a: "<p>A person, not a tool. Automated site scanners produce a list of technical warnings nobody acts on. The value is in the judgement about which two or three things are worth your attention.</p>",
  },
];

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">Free website plan</p>
              <h1>Know what your website needs before you spend money on it.</h1>
              <p class="lede">We review your website and Google presence the way a local customer would, then reply with a practical starting point, the package that fits and a short video and one-page summary of the three changes worth making first.</p>
              <p class="hero-support"><span>No charge.</span><span>No obligation.</span><span>No sales sequence.</span></p>
              <a class="btn" href="#audit-form">Get my free website plan${icon("arrow-up")}</a>
            </div>
            <figure class="hero-media reveal">
              <img src="/assets/work/audit-deliverable.svg" width="1000" height="760" alt="What the audit delivers: a short screen-recorded video review beside a one-page written summary listing three prioritised improvements." />
            </figure>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">What you get</p>
            <h2>Two things, both of them useful on their own.</h2>
          </div>
          <ol class="steps reveal">
            <li>
              <h3>A short video review</h3>
              <p>A screen recording — usually around five minutes — of us going through your website and your Google presence, pointing at the specific things getting in the way. Not a template. Your actual site.</p>
            </li>
            <li>
              <h3>A one-page written summary</h3>
              <p>The same findings in writing, so you can forward it to a business partner or an existing developer without asking them to watch a video.</p>
            </li>
            <li>
              <h3>Where you are losing enquiries</h3>
              <p>Mapped across the four stages that matter: whether people find you, whether they trust what they see, whether they make contact, and whether that contact turns into booked work.</p>
            </li>
            <li>
              <h3>The three changes to prioritise</h3>
              <p>Ranked by likely impact — including the ones you can do yourself for nothing, and the ones that are not worth doing at all.</p>
            </li>
          </ol>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">What we look at</p>
            <h2>Four stages. One of them is usually the problem.</h2>
          </div>
          <ul class="chain reveal">
            <li><b>Get found</b><h3>Search presence</h3><p>Your Google Business Profile, the searches you appear for locally, and how you compare with the businesses appearing above you.</p></li>
            <li><b>Build trust</b><h3>The website itself</h3><p>Mobile speed, clarity of the offer, whether the areas you cover are obvious, and whether a cautious buyer finds a reason to believe you.</p></li>
            <li><b>Respond fast</b><h3>The enquiry path</h3><p>How many ways there are to get in touch, whether they work, and how much friction sits between interest and contact.</p></li>
            <li><b>Follow up</b><h3>After the enquiry</h3><p>What happens once someone gets in touch — confirmation, reminders, and whether anything catches the people who go quiet.</p></li>
          </ul>
        </div>
      </section>

      <section class="section tight" id="request">
        <div class="container">
${inquiryForm({
  heading: "Get my free website plan",
  intro:
    "Tell us about the business and what you want more of. If live times are available you can book a call here as well — otherwise we will send the audit across and follow up once.",
  submitLabel: "Get my free website plan",
})}
        </div>
      </section>

${faqSection(FAQS, { heading: "Fair questions about a free thing.", eyebrow: "Audit FAQ" })}

${related(
  [
    {
      href: "/web-design-middlesbrough",
      label: "Web design Middlesbrough",
      text: "Websites from £495 with a written scope before work starts.",
    },
    {
      href: "/local-seo-middlesbrough",
      label: "Local SEO + Google Business Profile",
      text: "Be one of the businesses people find in the first place.",
    },
    {
      href: "/pricing",
      label: "Pricing",
      text: "Every service, priced separately, in one place.",
    },
  ],
  "If you already know what you need",
)}

${finalCta({
  heading: "Prefer to just talk it through?",
  body: "Call or email and we will give you a straight answer about whether the audit is worth your time. No script.",
  primary: "Go to contact",
  href: "/contact",
})}`;

export default {
  path: "/free-website-audit",
  title: "Free Website & Google Audit | Middlesbrough | Veltra Media",
  description:
    "A free website and Google audit for Middlesbrough and Teesside businesses: a short video review, a one-page summary, where you are losing enquiries and the three changes to prioritise.",
  jsonLd: [
    organizationJsonLd(),
    faqJsonLd(FAQS),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Free website & Google audit", path: "/free-website-audit" },
    ]),
  ],
  body,
};
