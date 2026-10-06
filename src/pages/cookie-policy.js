import { SITE, breadcrumbJsonLd, organizationJsonLd } from "../site.js";

// Written from what the site actually does: it sets no cookies of its own, keeps
// the consent choice and one appearance preference in local storage, and loads
// Vercel Web Analytics (cookieless, served from our own domain) only after the
// visitor allows it in the banner (assets/consent.js). If any other analytics or
// tracker is ever added, update this page and the banner first.
const body = `      <section class="hero">
        <div class="container narrow">
          <p class="eyebrow">Cookies</p>
          <h1>Cookie policy.</h1>
          <p class="lede">Last updated 29 September 2026. This page explains what this website stores in your browser and why. In short: no cookies are set by this site, analytics runs only if you allow it, and nothing is used to track you for advertising.</p>
        </div>
      </section>

      <section class="section">
        <div class="container narrow">
          <div class="prose">
            <h2>Cookies</h2>
            <p>The Veltra Media website does not set cookies of its own, and it does not load advertising or social media tracking scripts.</p>

            <h2>Your privacy choices</h2>
            <p>On your first visit, a banner asks whether you allow optional analytics. You can accept all, decline optional analytics, or manage your preferences. Essential storage is always active; analytics stays off unless you switch it on. Your choice is remembered for six months, after which we ask again. You can change it at any time with the <strong>Cookie preferences</strong> link at the bottom of every page.</p>

            <h2>Local storage</h2>
            <p>Your privacy choice is kept in your browser's local storage under the name <strong>veltra-cookie-consent</strong>, with the date you made it. It is essential, because without it we could not respect your choice on the next page.</p>
            <p>Form entries are not saved to browser storage. If you do not submit a form, nothing you typed is kept.</p>
            <p>If you use the chat assistant, the conversation is kept in your browser's session storage under the name <strong>veltra-chat</strong>, so it stays open as you move between pages. It is deleted when you close the tab.</p>
            <p>Veltra Media staff who sign in to our private lead dashboard keep their sign-in session in their own browser's local storage. This applies only to that staff page, not to visitors of the public site.</p>

            <h2>What your host may record</h2>
            <p>Like any website, this one is served by a hosting provider, which may keep ordinary security and access logs, such as IP addresses and the pages requested. These are operational records, not tracking profiles.</p>

            <h2>Links to other services</h2>
            <p>Call, email and WhatsApp links open your phone, mail app or the relevant external service. Those services have their own privacy terms and may use their own cookies once you leave this site.</p>

            <h2>Analytics</h2>
            <p>If you allow analytics, this site loads Vercel Web Analytics to count page visits and see which pages are viewed. It does not set cookies or store anything in your browser, and it does not identify you or follow you across other websites. Visits are counted in aggregate only. If you decline, or have not chosen yet, it is not loaded at all. If we ever add another tool, we will say so here first and ask before it runs.</p>

            <h2>More about your information</h2>
            <p>How we handle information you send through our forms is explained in the <a href="/privacy">privacy policy</a>. Questions about this page can be sent to <a href="mailto:${SITE.email}">${SITE.email}</a> or raised on <a href="tel:${SITE.phone}">${SITE.phoneLabel}</a>.</p>
          </div>
        </div>
      </section>`;

export default {
  path: "/cookie-policy",
  title: "Cookie Policy | Veltra Media",
  description:
    "What the Veltra Media website stores in your browser: no cookies of its own, your privacy choice, and analytics only with your permission.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cookie policy", path: "/cookie-policy" },
    ]),
  ],
  body,
};
