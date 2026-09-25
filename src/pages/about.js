import {
  CTA,
  SITE,
  breadcrumbJsonLd,
  finalCta,
  icon,
  organizationJsonLd,
  related,
} from "../site.js";

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 46rem">
            <p class="eyebrow">About</p>
            <h1>A local studio for businesses that want more enquiries.</h1>
            <p class="lede">Veltra Media builds websites, local search foundations, landing pages and enquiry automation for businesses in Middlesbrough, Teesside and the wider Tees Valley.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/work">See our work</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="two-col">
            <div>
              <blockquote class="pullquote">Start with the thing you need now. Add the rest when it earns its place.</blockquote>
            </div>
            <div class="prose">
              <p>Most local businesses are offered one of two things. A cheap website that looks generic, says very little and needs replacing within a year. Or a full agency engagement, with a process and an overhead that a straightforward local business does not need and should not pay for.</p>
              <p>We sit deliberately between the two. A clear recommendation instead of a menu. A written scope and a price before anything starts. Copy, design and local search considered together, because separating them is how sites end up looking fine and converting badly.</p>
              <p>And five services you can buy one at a time. If the website is not your problem, we would rather tell you that than sell you one.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section band-light">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">How we work</p>
            <h2>Five standards we hold ourselves to.</h2>
          </div>
          <ol class="steps reveal">
            <li>
              <h3>A recommendation, not a menu</h3>
              <p>We tell you which single thing would make the biggest difference, even when it is the smallest piece of work available — or when it is something you can do yourself for nothing.</p>
            </li>
            <li>
              <h3>A written scope and price before work begins</h3>
              <p>You know what is being built, what it costs, what is not included and roughly when it lands, before any money moves.</p>
            </li>
            <li>
              <h3>No invented numbers</h3>
              <p>No fabricated case study results, no borrowed client logos, no statistics without a source. If we cannot evidence it, we describe what we actually built instead.</p>
            </li>
            <li>
              <h3>You own what you pay for</h3>
              <p>Once project fees are paid, the website and its original content are yours. Care plans are optional and never a condition of getting your own site.</p>
            </li>
            <li>
              <h3>Honest about limits</h3>
              <p>Nobody can guarantee a Google ranking. Automation cannot replace judgement. AI should not answer a question it was not given an answer for. We say so before you buy, not afterwards.</p>
            </li>
          </ol>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="local-grid">
            <div class="local-copy">
              <p class="eyebrow">Where we work</p>
              <h2>Teesside first, remote where it makes sense.</h2>
              <p class="lede">We work with service businesses across Middlesbrough, Stockton-on-Tees, Redcar, Billingham, Hartlepool and the wider Tees Valley. Meetings can be handled locally or online, whichever actually suits you.</p>
              <ul class="area-list">${SITE.areas.map((a) => `<li>${a}</li>`).join("")}</ul>
              <p>We do not publish a walk-in address, because we do not have a staffed office a client could usefully visit. Everything else &mdash; our name, our phone number, our email &mdash; is the same everywhere you find us, which matters more for local search than a pin on a map.</p>
            </div>
            <div class="form-shell reveal">
              <div class="form-head">
                <h2>Get in touch</h2>
                <p>Straightforward ways to reach a person.</p>
              </div>
              <ul class="contact-methods">
                <li><a href="tel:${SITE.phone}">${icon("phone")}<span>${SITE.phoneLabel}<small>Call or text</small></span></a></li>
                <li><a href="mailto:${SITE.email}">${icon("mail")}<span>${SITE.email}<small>We reply to every enquiry</small></span></a></li>
                <li><a href="${CTA.href}">${icon("search")}<span>Free website &amp; Google audit<small>Video review and a one-page summary</small></span></a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

${related([
  {
    href: "/work",
    label: "Our work",
    text: "What we build, clearly labelled and easy to judge.",
  },
  {
    href: "/pricing",
    label: "Pricing",
    text: "Every service priced separately, VAT and extras stated.",
  },
  {
    href: "/resources",
    label: "Resources",
    text: "Practical guides for local businesses, no email required.",
  },
])}

${finalCta()}`;

export default {
  path: "/about",
  title: "About Veltra Media | Web & Enquiry Growth, Middlesbrough",
  description:
    "Veltra Media is a Middlesbrough web, SEO and enquiry-growth studio for Teesside businesses. A written scope before work starts, services sold separately, and no invented results.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]),
  ],
  body,
};
