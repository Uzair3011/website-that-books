import { icon } from "./site.js";

// Project cards shared by /work and the homepage. Concepts are labelled and are
// not links; real builds link to the live site or page.
const flag = (project) =>
  `<span class="project-flag${project.concept ? "" : " live"}">${project.concept ? "Concept" : "Veltra build"}</span>`;

const media = (project) => `<figure class="project-media">
      <img src="${project.image}" width="1280" height="900" loading="lazy" decoding="async" alt="${project.imageAlt}" />
      ${flag(project)}
    </figure>`;

const link = (project) => {
  if (!project.url) return "";
  const external = /^https?:/.test(project.url);
  return `<a class="text-link" href="${project.url}"${external ? ' target="_blank" rel="noopener"' : ""}>${project.linkLabel || (external ? "Visit the site" : "See the project")}${icon("arrow-up")}</a>`;
};

export const projectCard = (project, { wide = false } = {}) => `<article class="project-card${wide ? " featured" : ""}">
    ${media(project)}
    <div class="project-body">
      <p class="project-kind">${project.category}</p>
      <h3>${project.name}</h3>
      <p class="project-summary">${project.summary}</p>
      ${project.status ? `<p class="project-status"><span aria-hidden="true"></span>${project.status}</p>` : ""}
      ${link(project)}
    </div>
  </article>`;
