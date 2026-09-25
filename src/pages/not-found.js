import { CTA, SERVICES, icon, related } from "../site.js";

const body = `      <section class="hero">
        <div class="container narrow">
          <p class="eyebrow">404</p>
          <h1>That page has moved or never existed.</h1>
          <p class="lede">Nothing dramatic has happened. Here are the places people usually want.</p>
          <div class="button-row" style="margin-top: 28px">
            <a class="btn" href="/">Go to the homepage${icon("arrow-up")}</a>
            <a class="btn secondary" href="${CTA.href}">Free audit</a>
          </div>
        </div>
      </section>

${related(
  [
    ...SERVICES.slice(0, 2).map((service) => ({
      href: service.href,
      label: service.name,
      text: service.short,
    })),
    {
      href: "/pricing",
      label: "Pricing",
      text: "Every service priced separately, in one place.",
    },
  ],
  "Popular pages",
)}`;

export default {
  path: "/404",
  title: "Page not found | Veltra Media",
  description: "The page you were looking for could not be found.",
  noindex: true,
  body,
};
