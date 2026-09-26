import { SITE, breadcrumbJsonLd, organizationJsonLd } from "../site.js";

// Written from what the site actually does: it sets no cookies of its own, keeps
// one appearance preference in local storage, and loads only Vercel Web
// Analytics (cookieless, served from our own domain). If any other analytics or
// tracker is ever added, update this page first.
const body = `      <section class="hero">
        <div class="container narrow">
          <p class="eyebrow">Cookies</p>
          <h1>Cookie policy.</h1>
          <p class="lede">Last updated 26 September 2026. This page explains what this website stores in your browser and why. In short: no cookies are set by this site, and nothing is used to track you for advertising.</p>
        </div>
      </section>

      <section class="section">
        <div class="container narrow">
          <div class="prose">
            <h2>Cookies</h2>
            <p>The Veltra Media website does not set cookies of its own, and it does not load advertising or social media tracking scripts. Because no cookies are used, there is no cookie banner to accept or decline.</p>

            <h2>Local storage</h2>
            <p>If you switch between light and dark appearance, the site remembers your choice in your browser's local storage, under the name <strong>veltra-theme</strong>. It stays on your device, is never sent to us and is used only to show the site the way you chose. You can remove it at any time by clearing this site's data in your browser.</p>
            <p>Form entries are not saved to browser storage. If you do not submit a form, nothing you typed is kept.</p>

            <h2>What your host may record</h2>
            <p>Like any website, this one is served by a hosting provider, which may keep ordinary security and access logs, such as IP addresses and the pages requested. These are operational records, not tracking profiles.</p>

            <h2>Links to other services</h2>
            <p>Call, email and WhatsApp links open your phone, mail app or the relevant external service. Those services have their own privacy terms and may use their own cookies once you leave this site.</p>

            <h2>Analytics</h2>
            <p>This site uses Vercel Web Analytics to count page visits and see which pages are viewed. It does not set cookies or store anything in your browser, and it does not identify you or follow you across other websites. Visits are counted in aggregate only. If we ever add a tool that needs cookies requiring your consent, we will say so here first and ask before they are set.</p>

            <h2>More about your information</h2>
            <p>How we handle information you send through our forms is explained in the <a href="/privacy">privacy policy</a>. Questions about this page can be sent to <a href="mailto:${SITE.email}">${SITE.email}</a> or raised on <a href="tel:${SITE.phone}">${SITE.phoneLabel}</a>.</p>
          </div>
        </div>
      </section>`;

export default {
  path: "/cookie-policy",
  title: "Cookie Policy | Veltra Media",
  description:
    "What the Veltra Media website stores in your browser: no cookies of its own, one remembered light or dark appearance choice, and no advertising or tracking scripts.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Cookie policy", path: "/cookie-policy" },
    ]),
  ],
  body,
};
