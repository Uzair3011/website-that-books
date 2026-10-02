import {
  CTA,
  breadcrumbJsonLd,
  finalCta,
  icon,
  organizationJsonLd,
} from "../site.js";
import { PROJECTS } from "../projects.js";

// Cards come from src/projects.js: the featured build gets a wide card, the
// rest sit in a compact grid. Concepts are labelled and are not links.
const flag = (project) =>
  `<span class="project-flag${project.concept ? "" : " live"}">${project.concept ? "Concept" : "Veltra build"}</span>`;

const media = (project) => `<figure class="project-media">
      <img src="${project.image}" width="1280" height="900" loading="lazy" decoding="async" alt="${project.concept ? "Concept design" : "Website"} for ${project.name}" />
      ${flag(project)}
    </figure>`;

const link = (project) => {
  if (!project.url) return "";
  const external = /^https?:/.test(project.url);
  return `<a class="text-link" href="${project.url}"${external ? ' target="_blank" rel="noopener"' : ""}>${project.linkLabel || (external ? "Visit the site" : "See the project")}${icon("arrow-up")}</a>`;
};

const card = (project) => `<article class="project-card${project.featured ? " featured" : ""}">
    ${media(project)}
    <div class="project-body">
      <p class="project-kind">${project.category}</p>
      <h3>${project.name}</h3>
      <p class="project-summary">${project.summary}</p>
      ${project.status ? `<p class="project-status"><span aria-hidden="true"></span>${project.status}</p>` : ""}
      ${link(project)}
    </div>
  </article>`;

const featured = PROJECTS.filter((project) => project.featured);
const rest = PROJECTS.filter((project) => !project.featured);
const grid = `${featured.map(card).join("\n")}
          <div class="project-grid">
${rest.map(card).join("\n")}
          </div>`;

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-copy" style="max-width: 44rem">
            <p class="eyebrow">Work</p>
            <h1>Work that is easy to judge.</h1>
            <p class="lede">Good work should not need vague claims. Below is what we build and how we build it — clearly labelled, with nothing dressed up as a client result it is not.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/pricing">See prices</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="disclosure" style="margin-bottom: 40px">Veltra Media is a young studio and we would rather show you our thinking than pad this page. Projects marked <strong>Veltra build</strong> are real systems we have built and run. Projects marked <strong>Concept</strong> are designs for fictional businesses that show how we structure a given kind of site &mdash; they are not client projects. We publish client case studies only with permission, and only with results we can evidence.</p>
          <div class="work-list reveal">
${grid}
          </div>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="two-col">
            <div>
              <p class="eyebrow">How we present results</p>
              <blockquote class="pullquote">If a number cannot be evidenced, we describe what we built instead.</blockquote>
            </div>
            <div class="prose">
              <p>Plenty of agencies publish percentage uplifts with no baseline, no timeframe and no way to check them. We are not going to do that.</p>
              <p>When a client project produces a result we can evidence &mdash; enquiry volume, booking rate, page speed, search visibility &mdash; and the client is happy for it to be published, we will publish it with the context attached.</p>
              <p>Until then, this page shows the work itself. You can judge the craft, the structure and the clarity directly, which is harder to fake than a statistic.</p>
            </div>
          </div>
        </div>
      </section>

${finalCta({
  heading: "Want to see what we would do with yours?",
  body: "The free audit is the fastest way to find out. A short video, a one-page summary, and the three things we would fix first.",
  secondary: { href: "/contact", label: "Talk to us" },
})}`;

export default {
  path: "/work",
  title: "Our Work | Web Design & Local SEO Examples | Veltra Media",
  description:
    "Veltra Media projects: a live med-spa booking system, plus concept designs for a trades website, a single-offer landing page and a local search presence.",
  jsonLd: [
    organizationJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
    ]),
  ],
  body,
};
