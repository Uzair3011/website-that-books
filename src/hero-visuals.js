// Hero panels for the inner pages that have no product shot of their own, so
// each opens with a picture of what that page is about instead of an empty
// half. Built from HTML and CSS (styles.css, "Page hero panels") so they use
// the site's font and tokens. They only restate the page's own copy and are
// decorative: aria-hidden, since the heading and lede beside them say it all.
import { icon } from "./site.js";

const panel = (name, content) =>
  `<div class="hero-media pv pv-${name}" aria-hidden="true">${content}</div>`;

const checks = (items) =>
  `<ul class="pv-checks">${items.map((item) => `<li>${icon("check")}${item}</li>`).join("")}</ul>`;

// /services: the four stages from "How they fit together", each with the
// service that fixes it, in the showcase's colours.
const STAGES = [
  ["Get found", "Local SEO + Google Business Profile", "mint"],
  ["Build trust", "Website design + landing pages", "lime"],
  ["Respond fast", "AI receptionist + website chat", "coral"],
  ["Follow up", "CRM, booking + follow-up", "violet"],
];

export const servicesVisual = panel(
  "journey",
  `<div class="pv-card pv-dark">
    <p class="pv-label">Where enquiries leak</p>
    <ol class="pv-stages">${STAGES.map(
      ([stage, service, tone], i) =>
        `<li data-tone="${tone}"><span class="pv-num">0${i + 1}</span><span><b>${stage}</b><small>${service}</small></span></li>`,
    ).join("")}</ol>
    <p class="pv-foot" data-tone="amber"><span class="pv-dot"></span>Website care keeps it all running</p>
  </div>
  <span class="pv-tag pv-tag-a">Buy one at a time</span>`,
);

// /work: the two live builds, with a concept behind them, each flagged the
// same way as its card below.
export const workVisual = panel(
  "work",
  `<figure class="pv-shot pv-shot-back"><img src="/assets/work/concept-boiler.webp" width="1280" height="900" alt="" aria-hidden="true" loading="lazy" decoding="async" /><span class="project-flag pv-flag">Concept</span></figure>
  <figure class="pv-shot pv-shot-mid"><img src="/assets/work/project-estate-resolve.webp" width="1280" height="900" alt="" aria-hidden="true" loading="lazy" decoding="async" /><span class="project-flag live pv-flag">Veltra build</span></figure>
  <figure class="pv-shot pv-shot-front"><img src="/assets/work/project-med-spa.webp" width="1280" height="900" alt="" aria-hidden="true" loading="eager" fetchpriority="high" /><span class="project-flag live pv-flag">Veltra build</span></figure>
  <span class="pv-tag pv-tag-b">Live sites you can click through</span>`,
);

// /about: the studio and the five standards from "How we work". The owner
// chose not to be named or pictured, so the card carries the logo mark.
export const aboutVisual = panel(
  "studio",
  `<div class="pv-card">
    <div class="pv-studio-head"><span class="logo-mark">V</span><span><b>Veltra Media</b><small>Local web studio, Middlesbrough</small></span></div>
    <p class="pv-label">Five standards we hold ourselves to</p>
    ${checks([
      "A recommendation, not a menu",
      "Scope and price in writing first",
      "No invented numbers",
      "You own what you pay for",
      "Honest about limits",
    ])}
    <div class="pv-pills"><span>Teesside first</span><span>Remote across the UK</span></div>
  </div>
  <span class="pv-tag pv-tag-a">One service at a time</span>`,
);

// /how-it-works: the four steps as a project tracker, part-way through.
const STEPS = ["Starting point", "Scope and structure", "Working site", "Launch"];

export const processVisual = panel(
  "process",
  `<div class="pv-card">
    <div class="pv-row"><b>Your project</b><span class="pv-status">Step 3 of 4</span></div>
    <ol class="pv-track">${STEPS.map(
      (step, i) =>
        `<li class="${i < 2 ? "is-done" : i === 2 ? "is-now" : ""}"><span class="pv-step">${i < 2 ? icon("check") : i + 1}</span>${step}</li>`,
    ).join("")}</ol>
    <div class="pv-docs">
      <div class="pv-doc">${icon("doc")}<span><b>Written scope</b><small>Pages, timeline and fixed price, approved</small></span></div>
      <div class="pv-doc">${icon("smartphone")}<span><b>Private preview</b><small>Desktop and mobile, ready for feedback</small></span></div>
    </div>
  </div>
  <span class="pv-tag pv-tag-b">Nothing starts until you approve</span>`,
);
