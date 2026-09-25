// Shared site chrome, navigation, and structured-data helpers.
// Everything rendered here is authored content, never visitor input.

export const SITE = {
  name: "Veltra Media",
  origin: "https://www.veltramedia.com",
  email: "hello@veltramedia.com",
  phone: "+447466539736",
  phoneLabel: "+44 7466 539736",
  tagline: "Turn more local searches into real enquiries.",
  // Areas Veltra actually works in. No address is published: there is no
  // verified, staffed location a client can visit.
  areas: [
    "Middlesbrough",
    "Stockton-on-Tees",
    "Redcar",
    "Billingham",
    "Hartlepool",
    "Tees Valley",
  ],
};

export const CTA = {
  primary: "Get my free website plan",
  primaryShort: "Get a plan",
  secondary: "See website packages",
  href: "/free-website-audit",
};

/** Escapes text for safe interpolation into HTML. */
export const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Only the icons the new design actually uses. Line icons, one weight.
const ICONS = {
  arrow: '<path d="M5 12h13m-5-6 6 6-6 6"/>',
  "arrow-up": '<path d="M6 18 18 6M6 6h12v12"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  phone:
    '<path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/>',
  chat: '<path d="M20 11a8 8 0 0 1-8 8H4l-2 3V11a9 9 0 1 1 18 0Z"/><path d="M6 10h9m-9 4h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  moon: '<path d="M20 14A9 9 0 0 1 10 3 9 9 0 1 0 20 14Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 6 3.5-6 3.5Z"/>',
  doc: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 13h6m-6 4h4"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  flow: '<path d="M4 8h13l-3-3m3 3-3 3M20 16H7l3-3m-3 3 3 3"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3-2.4-.6-.6-2.4Z"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
};

export const icon = (name, extraClass = "") =>
  `<svg class="icon${extraClass ? ` ${extraClass}` : ""}" aria-hidden="true" viewBox="0 0 24 24">${ICONS[name]}</svg>`;

// ───────────────────────── Navigation ─────────────────────────
// Five primary links maximum, per the strategy brief.
export const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/#packages", label: "Website packages" },
  { href: "/work", label: "Work" },
  { href: "/#process", label: "How it works" },
  { href: "/about", label: "About" },
];

export const SERVICES = [
  {
    href: "/web-design-middlesbrough",
    name: "Website Design",
    nav: "Web design",
    icon: "layout",
    cta: "Explore web design",
    short:
      "Professional websites designed to turn local visitors into enquiries.",
    tags: ["Mobile-first build", "Copy and structure", "Enquiry tracking"],
  },
  {
    href: "/local-seo-middlesbrough",
    name: "Local SEO + Google Business Profile",
    nav: "Local SEO",
    icon: "search",
    cta: "Explore local SEO",
    short:
      "Help local businesses become more visible when people search for their services.",
    tags: ["Google Business Profile", "Service and area pages", "Local schema"],
  },
  {
    href: "/landing-page-design",
    name: "Landing Pages + CRO",
    nav: "Landing pages",
    icon: "target",
    cta: "Explore landing pages",
    short:
      "Pages designed around a specific offer, audience and conversion goal.",
    tags: ["One offer per page", "Conversion copy", "Measurement"],
  },
  {
    href: "/ai-automation-middlesbrough",
    name: "AI Receptionist + Website Chat",
    nav: "AI receptionist",
    icon: "chat",
    cta: "Explore AI reception",
    short:
      "Respond to enquiries quickly and help visitors take the next step.",
    tags: ["Approved answers", "Human handover", "After-hours capture"],
  },
  {
    href: "/crm-booking-automation",
    name: "CRM, Booking + Follow-up Automation",
    nav: "CRM & booking",
    icon: "flow",
    cta: "Explore automation",
    short:
      "Capture leads, manage enquiries, automate booking and follow-up.",
    tags: ["Calendar booking", "Reminders", "Consent-based follow-up"],
  },
];

// ───────────────────────── Chrome ─────────────────────────
function navLinks(path) {
  return NAV.map(
    (item) =>
      `<a href="${item.href}"${item.href === path ? ' aria-current="page"' : ""}>${item.label}</a>`,
  ).join("");
}

export function header(path) {
  // The plan form lives on the homepage and the pricing page, so there the button scrolls to it.
  const planHref = ["/", "/pricing"].includes(path) ? "#plan" : CTA.href;
  return `<header class="site-header">
  <div class="container nav">
    <a class="wordmark" href="/" aria-label="${SITE.name} home"><span class="logo-mark" aria-hidden="true">V</span>Veltra Media</a>
    <nav class="nav-links" id="nav-links" aria-label="Main">${navLinks(path)}</nav>
    <div class="nav-actions">
      <a class="phone-pill" href="tel:${SITE.phone}">
        <span>${SITE.phoneLabel}</span>
        <span class="phone-pill-icon">${icon("phone")}</span>
      </a>
      <a class="btn small dark header-cta" href="${planHref}">${CTA.primary}${icon("arrow-up")}</a>
      <button class="icon-btn" id="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false">${icon("moon")}</button>
      <button class="icon-btn menu-toggle" id="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-links">${icon("menu")}</button>
    </div>
  </div>
</header>`;
}

export function footer() {
  const services = SERVICES.map(
    (service) => `<a href="${service.href}">${service.nav}</a>`,
  ).join("");
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="wordmark" href="/" aria-label="${SITE.name} home"><span class="logo-mark" aria-hidden="true">V</span>Veltra Media</a>
        <p>Web design, local SEO, conversion and automation for businesses in Middlesbrough, Teesside and the wider Tees Valley.</p>
        <a class="btn small" href="${CTA.href}">${CTA.primary}${icon("arrow-up")}</a>
      </div>
      <div class="footer-col footer-services">
        <h2>Services</h2>
        <div class="footer-links">${services}
          <a href="/google-business-profile">Google Business Profile</a>
          <a href="/website-care">Website care</a>
          <a href="/med-spa-growth-system">Med-spa growth system</a>
        </div>
      </div>
      <div class="footer-col footer-company">
        <h2>Company</h2>
        <div class="footer-links">
          <a href="/work">Work</a><a href="/about">About</a><a href="/resources">Resources</a><a href="/pricing">Pricing</a><a href="/contact">Contact</a>
        </div>
      </div>
      <div class="footer-col footer-contact">
        <h2>Get in touch</h2>
        <div class="footer-links">
          <a href="mailto:${SITE.email}">${icon("mail")}${SITE.email}</a>
          <a href="tel:${SITE.phone}">${icon("phone")}${SITE.phoneLabel}</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-meta">
        <span>&copy; <span data-year>2026</span> ${SITE.name}. All rights reserved.</span>
        <span>Middlesbrough &middot; Teesside &middot; Remote across the UK</span>
      </div>
      <nav class="footer-legal" aria-label="Legal">
        <a href="/privacy">Privacy policy</a>
        <a href="/cookie-policy">Cookie policy</a>
        <a href="/terms">Terms</a>
      </nav>
    </div>
  </div>
</footer>`;
}

export function mobileBar() {
  return `<div class="mobile-bar">
  <a class="btn small secondary" href="tel:${SITE.phone}" aria-label="Call ${SITE.name} on ${SITE.phoneLabel}">${icon("phone")}Call Veltra</a>
  <a class="btn small" href="${CTA.href}">${CTA.primaryShort}</a>
</div>`;
}

// ───────────────────────── Reusable sections ─────────────────────────
export function finalCta({
  heading = "Know what your website needs before you spend money on it.",
  body = "Tell us about your business and what you want the website to achieve. We will reply with a practical starting point, the package that fits and any gaps worth fixing first.",
  primary = CTA.primary,
  href = CTA.href,
  secondary = null,
} = {}) {
  return `<section class="cta-band">
  <div class="container">
    <div class="cta-inner reveal">
      <p class="eyebrow">Next step</p>
      <h2>${heading}</h2>
      <p class="lede">${body}</p>
      <div class="button-row">
        <a class="btn dark" href="${href}">${primary}${icon("arrow-up")}</a>
        ${secondary ? `<a class="btn secondary" href="${secondary.href}">${secondary.label}</a>` : ""}
      </div>
      <div class="cta-contacts">
        <a href="tel:${SITE.phone}">${icon("phone")}${SITE.phoneLabel}</a>
        <a href="mailto:${SITE.email}">${icon("mail")}${SITE.email}</a>
      </div>
    </div>
  </div>
</section>`;
}

/** Three related pages. Used for internal linking on every service page. */
export function related(items, heading = "Related services") {
  return `<section class="section tight">
  <div class="container">
    <h2 class="section-head">${heading}</h2>
    <ul class="related reveal">
      ${items
        .map(
          (item) =>
            `<li><a href="${item.href}"><b>${item.label}</b><p>${item.text}</p></a></li>`,
        )
        .join("")}
    </ul>
  </div>
</section>`;
}

export function faqSection(items, { heading, eyebrow = "Questions" } = {}) {
  return `<section class="section" id="faq">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">${eyebrow}</p>
      <h2>${heading}</h2>
    </div>
    <div class="faq reveal">
      ${items
        .map(
          (item) =>
            `<details><summary>${item.q}</summary><div>${item.a}</div></details>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

/** FAQPage JSON-LD. Only ever emitted alongside the same visible questions. */
export function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace(/<[^>]+>/g, ""),
      },
    })),
  };
}

/**
 * Organization + WebSite graph. Claims only what the business can evidence:
 * a name, a URL, an email, a phone number and a service area. No address,
 * no ratings, no review counts, no employee or client numbers.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE.origin}/#organization`,
        name: SITE.name,
        url: `${SITE.origin}/`,
        logo: `${SITE.origin}/assets/apple-touch-icon.png`,
        image: `${SITE.origin}/assets/social-card.png`,
        email: SITE.email,
        telephone: SITE.phone,
        description:
          "Veltra Media builds websites, local SEO, landing pages and enquiry automation for businesses in Middlesbrough and across Teesside.",
        areaServed: SITE.areas.map((name) => ({
          "@type": "AdministrativeArea",
          name,
        })),
        knowsAbout: [
          "Web design",
          "Local SEO",
          "Google Business Profile",
          "Conversion rate optimisation",
          "Marketing automation",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.origin}/#website`,
        name: SITE.name,
        url: `${SITE.origin}/`,
        publisher: { "@id": `${SITE.origin}/#organization` },
      },
    ],
  };
}

export function serviceJsonLd({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: SITE.origin + path,
    provider: { "@id": `${SITE.origin}/#organization` },
    areaServed: SITE.areas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
  };
}

export function breadcrumbJsonLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: SITE.origin + item.path,
    })),
  };
}
