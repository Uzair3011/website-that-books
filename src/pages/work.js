import { workVisual } from "../hero-visuals.js";
import {
  CTA,
  breadcrumbJsonLd,
  finalCta,
  icon,
} from "../site.js";
import { projectCard } from "../project-cards.js";
import { PROJECTS } from "../projects.js";

// Cards come from src/projects.js: the featured build gets a wide card, the
// rest sit in a compact grid.
const featured = PROJECTS.filter((project) => project.featured);
const rest = PROJECTS.filter((project) => !project.featured);
const grid = `${featured.map((project) => projectCard(project, { wide: true })).join("\n")}
          <div class="project-grid">
${rest.map((project) => projectCard(project)).join("\n")}
          </div>`;

const body = `      <section class="hero">
        <div class="container">
          <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Work</p>
            <h1>A web design portfolio you can click through</h1>
            <p class="lede"><strong>Work that is easy to judge.</strong> Good work should not need vague claims. Below is what we build and how we build it — clearly labelled, with nothing dressed up as a client result it is not.</p>
            <div class="button-row">
              <a class="btn" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
              <a class="btn secondary" href="/pricing">See prices</a>
            </div>
          </div>
          ${workVisual}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="disclosure" style="margin-bottom: 40px"><a href="/about">Veltra Media is a young Middlesbrough studio</a>, and we would rather show you our thinking than pad this page. Projects marked <strong>Veltra build</strong> are real, live sites and systems we have built. Projects marked <strong>Concept</strong> are designs for fictional businesses that show how we structure a given kind of site &mdash; they are not client projects. We publish client case studies only with permission, and only with results we can evidence.</p>
          <div class="work-list reveal">
${grid}
          </div>
        </div>
      </section>

      <section class="section band-dark">
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">How we present results</p>
            <blockquote class="pullquote">If a number cannot be evidenced, we describe what we built instead.</blockquote>
          </div>
          <div class="prose">
            <p>Plenty of agencies publish percentage uplifts with no baseline, no timeframe and no way to check them. We are not going to do that.</p>
            <p>When a client project produces a result we can evidence &mdash; enquiry volume, booking rate, page speed, search visibility &mdash; and the client is happy for it to be published, we will publish it with the context attached.</p>
            <p>Until then, this page shows the work itself. You can judge the craft, the structure and the clarity directly, which is harder to fake than a statistic.</p>
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
  title: "Web Design Portfolio, Teesside: Example Sites | Veltra Media",
  description:
    "Veltra Media's work: a live med-spa booking system, the Estate Resolve site with CRM dashboard and email automation, plus clearly labelled concept designs.",
  jsonLd: [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/work" },
    ]),
  ],
  body,
};
