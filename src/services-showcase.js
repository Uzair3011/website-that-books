// The services showcase: a numbered list on the left, one service open at a
// time, and a stage on the right that shows the open service's visual. Each
// service carries its own accent (see the .svc tones in styles.css). Used by
// the homepage and /services; behaviour lives in assets/app.js.
//
// The stage is decorative: everything it says is already in the list beside
// it. Without JavaScript every service stays open and the stage shows the
// first one.
//
// A page can pass `details`, keyed by a service's href, to swap in its own
// wording or add more to a service's open panel: `name`, `text`, `included`
// (a tick list), `fit` ("Best for") and `extra` ({ href, label }, a second
// link). /services does; the homepage shows the short version.
import { healthCard } from "./health-card.js";
import { icon } from "./site.js";
import { cardMedia } from "./visuals.js";

export const SHOWCASE_SERVICES = [
  {
    title: "Website design",
    image: "service-web-design",
    text: "Fast, mobile-first websites built around your offer, your customers and the action you want them to take.",
    href: "/web-design-middlesbrough",
    cta: "Explore website design",
    tone: "lime",
    note: "Mobile-first and built to convert",
    aside: "Built around the action you want people to take",
  },
  {
    title: "Local SEO and Google Business",
    image: "service-local-seo",
    text: "Improve the signals that help nearby customers find and trust you in Google Search and Maps.",
    href: "/local-seo-middlesbrough",
    cta: "Explore local SEO",
    tone: "mint",
    note: "Show up in Search and Maps",
    aside: "Easier for nearby customers to find and trust",
  },
  {
    title: "Landing pages",
    image: "service-landing-pages",
    text: "Focused pages for one service, location or campaign, written and designed to turn attention into action.",
    href: "/landing-page-design",
    cta: "Explore landing pages",
    tone: "blue",
    note: "One page. One offer. One action.",
    aside: "For a single service, location or campaign",
  },
  {
    title: "AI receptionist and website chat",
    image: "service-ai-reception",
    text: "Answer common questions, capture enquiry details and respond after hours without making the customer learn new technology.",
    href: "/ai-automation-middlesbrough",
    cta: "Explore AI reception",
    tone: "coral",
    note: "Replies, even after hours",
    aside: "Captures the enquiry details for you",
  },
  {
    title: "Booking and follow-up automation",
    image: "service-booking",
    text: "Connect forms, calendars and reminders so fewer good enquiries disappear between first contact and booked work.",
    href: "/crm-booking-automation",
    cta: "Explore automation",
    tone: "violet",
    note: "Forms, calendars and reminders, connected",
    aside: "Fewer good enquiries slip away",
  },
  {
    title: "Website care",
    // Shown as the live health panel rather than a picture.
    health: true,
    text: "Hosting, updates, backups and practical support for businesses that would rather not manage the technical side.",
    href: "/website-care",
    cta: "Explore website care",
    tone: "amber",
    note: "Hosting, updates and backups, handled",
    aside: "Practical support when you need it",
  },
];

const pad = (n) => String(n).padStart(2, "0");
const curve = (d) =>
  `<svg class="svc-arrow" viewBox="0 0 80 60" aria-hidden="true" focusable="false"><path pathLength="1" d="${d}"/></svg>`;
const burst = `<svg class="svc-burst" viewBox="0 0 60 60" aria-hidden="true" focusable="false"><path d="M8 34 22 40M18 12l12 16M44 6l-2 18"/></svg>`;

const link = (href, label) => `<a class="text-link" href="${href}">${label}${icon("arrow-up")}</a>`;

const item = (base, index, detail = {}) => {
  const service = { ...base, ...detail };
  const title = service.name || service.title;
  return `            <li class="svc-item${index === 0 ? " is-active" : ""}" data-tone="${service.tone}">
              <h3>
                <button class="svc-trigger" type="button" id="svc-tab-${index + 1}" aria-expanded="${index === 0}" aria-controls="svc-panel-${index + 1}">
                  <span class="svc-num">${pad(index + 1)}</span>
                  <span class="svc-dot" aria-hidden="true"></span>
                  <span class="svc-name">${title.replace(/\S+-\S+/g, (word) => `<span class="svc-nb">${word}</span>`)}</span>
                  <span class="svc-sign" aria-hidden="true">${icon("arrow")}</span>
                </button>
              </h3>
              <div class="svc-panel" id="svc-panel-${index + 1}" role="region" aria-labelledby="svc-tab-${index + 1}">
                <div class="svc-panel-inner">
                  <div class="svc-copy">
                    <p>${service.text}</p>${
                      service.included
                        ? `
                    <ul class="tick-list">${service.included.map((point) => `<li>${icon("check")}<span>${point}</span></li>`).join("")}</ul>`
                        : ""
                    }${
                      service.fit
                        ? `
                    <p class="service-row-fit"><b>Best for</b>${service.fit}</p>`
                        : ""
                    }
                    <div class="link-row">${link(service.href, service.cta)}${service.extra ? link(service.extra.href, service.extra.label) : ""}</div>
                  </div>
                </div>
              </div>
            </li>`;
};

const slide = (service, index) => `              <div class="svc-slide${index === 0 ? " is-active" : ""}" data-tone="${service.tone}">
                <span class="svc-blob"></span>
                <span class="svc-shape"></span>
                ${burst}
                ${service.health ? `<div class="svc-card">${healthCard()}</div>` : `<div class="svc-device">${cardMedia(service.image)}</div>`}
                <p class="svc-note">${service.note}${curve("M70 6C52 4 34 14 26 40M26 40l-3-12M26 40l10-7")}</p>
                <p class="svc-aside">${service.aside}${curve("M64 50C70 30 58 12 30 8M30 8l9-6M30 8l8 7")}</p>
              </div>`;

export const servicesShowcase = (details = {}) => {
  const services = SHOWCASE_SERVICES;
  const titleOf = (service) => details[service.href]?.name || service.title;
  return `          <div class="svc-layout reveal" data-services data-tone="${services[0].tone}">
            <div class="svc-list-col">
              <p class="svc-hint" aria-hidden="true">${icon("arrow-up")}<span class="on-hover">Hover to explore</span><span class="on-tap">Tap a service to explore</span></p>
              <ol class="svc-list">
${services.map((service, index) => item(service, index, details[service.href])).join("\n")}
              </ol>
            </div>
            <div class="svc-stage-slot">
              <div class="svc-stage" aria-hidden="true">
${services.map(slide).join("\n")}
                <span class="svc-rail">${services.map((service, index) => `<span data-svc-go="${index}" data-tone="${service.tone}"${index === 0 ? ' class="is-active"' : ""}></span>`).join("")}</span>
              </div>
              <p class="svc-now" aria-hidden="true"><span>Currently viewing</span><i></i><b data-svc-now>${titleOf(services[0])}</b></p>
            </div>
          </div>`;
};
