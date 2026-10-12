// Shared site chrome, navigation, and structured-data helpers.
// Everything rendered here is authored content, never visitor input.

export const SITE = {
  name: "Veltra Media",
  origin: "https://www.veltramedia.com",
  email: "hello@veltramedia.com",
  phone: "+447466539736",
  phoneLabel: "+44 7466 539736",
  // The number takes WhatsApp messages, not calls, so every contact link opens WhatsApp.
  whatsapp: "https://wa.me/447466539736",
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
  // Official profiles of this business, for the organisation's `sameAs`. It
  // will hold the LinkedIn, Facebook and Google Business Profile URLs once
  // they exist. Only add a profile that is live and belongs to Veltra Media;
  // `sameAs` is left out of the JSON-LD while this is empty.
  sameAs: [],
};

// Every Service node points here, and layout.js puts the node itself on every page.
export const ORG_ID = `${SITE.origin}/#organization`;

// Tees Valley is a combined-authority area; every other entry in SITE.areas is a town.
const REGIONS = new Set(["Tees Valley"]);
const place = (name) => ({
  "@type": REGIONS.has(name) ? "AdministrativeArea" : "City",
  name,
});

// The few entities authored copy uses, decoded so JSON-LD carries plain text.
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", middot: "·", pound: "£", rsquo: "’", lsquo: "‘", hellip: "…" };

/** Visible text of authored HTML: tags become spaces, entities are decoded. */
export const plainText = (html) =>
  String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (whole, name) =>
      name[0] === "#"
        ? String.fromCodePoint(
            name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1)),
          )
        : (ENTITIES[name.toLowerCase()] ?? whole),
    )
    .replace(/\s+/g, " ")
    .trim();

export const CTA = {
  primary: "Get my free website plan",
  primaryShort: "Get a plan",
  secondary: "Explore our services",
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
  chevron: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  phone:
    '<path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/>',
  chat: '<path d="M20 11a8 8 0 0 1-8 8H4l-2 3V11a9 9 0 1 1 18 0Z"/><path d="M6 10h9m-9 4h5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.5 6 3.5-6 3.5Z"/>',
  doc: '<path d="M6 3h8l4 4v14H6Z"/><path d="M14 3v4h4M9 13h6m-6 4h4"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  flow: '<path d="M4 8h13l-3-3m3 3-3 3M20 16H7l3-3m-3 3 3 3"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3-2.4-.6-.6-2.4Z"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  whatsapp:
    '<path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2Z"/><path d="M9.2 8.4c-.2 3.4 3 6.6 6.4 6.4l.9-1.5-2-1.1-.9.8a4.6 4.6 0 0 1-2.2-2.2l.8-.9-1.1-2Z"/>',
  // Service pages: offer stacks, bonuses and the solution steps.
  "arrow-down": '<path d="M12 5v13m-6-6 6 6 6-6"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/>',
  chart: '<path d="M3 20h18M6 16v-5m5 5V7m5 9v-8m4 8V4"/>',
  gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5m4 0s1.5-5 4-5a2.5 2.5 0 0 1 0 5"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7m2 2.7a6.5 6.5 0 0 1 3.5 5.8"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8Z"/>',
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="m13 7 4 4"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8h-17S6 15 6 9Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5L3 9m0-5v5h5M4 13a8 8 0 0 0 14.6 4.5L21 15m0 5v-5h-5"/>',
};

export const icon = (name, extraClass = "") =>
  `<svg class="icon${extraClass ? ` ${extraClass}` : ""}" aria-hidden="true" viewBox="0 0 24 24">${ICONS[name]}</svg>`;

// ───────────────────────── Navigation ─────────────────────────
// Five primary links maximum, per the strategy brief. Each is its own page;
// the homepage is an overview that links out to them.
export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/work", label: "Work" },
  { href: "/how-it-works", label: "How it works" },
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
    href: "/ai-receptionist-middlesbrough",
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
      <a class="btn small dark header-cta" href="${planHref}">${CTA.primary}${icon("arrow-up")}</a>
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
        <div class="footer-links"><a href="/services">All services</a>${services}
          <a href="/google-business-profile">Google Business Profile</a>
          <a href="/website-care">Website care</a>
          <a href="/med-spa-growth-system">Med-spa growth system</a>
          <a href="/web-design-for-trades-teesside">Websites for trades</a>
        </div>
      </div>
      <div class="footer-col footer-company">
        <h2>Company</h2>
        <div class="footer-links">
          <a href="/work">Work</a><a href="/how-it-works">How it works</a><a href="/about">About</a><a href="/resources">Resources</a><a href="/ai-agents-teesside">AI agents explained</a><a href="/pricing">Pricing</a><a href="/contact">Contact</a>
        </div>
      </div>
      <div class="footer-col footer-areas">
        <h2>Areas we serve</h2>
        <div class="footer-links">
          <a href="/areas">All areas</a><a href="/web-design-middlesbrough">Middlesbrough</a><a href="/web-design-stockton-on-tees">Stockton-on-Tees &amp; Billingham</a><a href="/web-design-redcar">Redcar</a><a href="/web-design-hartlepool">Hartlepool</a><a href="/web-design-teesside">Tees Valley</a>
        </div>
      </div>
      <div class="footer-col footer-contact">
        <h2>Get in touch</h2>
        <div class="footer-links">
          <a href="mailto:${SITE.email}">${icon("mail")}${SITE.email}</a>
          <a href="${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp ${SITE.phoneLabel}</a>
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
        <a href="/terms">Terms of service</a>
        <button type="button" class="footer-link-button" data-cookie-preferences hidden>Cookie preferences</button>
      </nav>
    </div>
  </div>
</footer>`;
}

export function mobileBar() {
  return `<div class="mobile-bar">
  <a class="btn small secondary" href="${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp ${SITE.name} on ${SITE.phoneLabel}">${icon("whatsapp")}WhatsApp</a>
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
        <a href="${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}WhatsApp ${SITE.phoneLabel}</a>
        <a href="mailto:${SITE.email}">${icon("mail")}${SITE.email}</a>
      </div>
    </div>
  </div>
</section>`;
}

// Columns that divide the list evenly, so no row ends in an empty cell: 4 items
// sit 2x2 (4 across on wide screens). Any remainder stretches across its row.
const relatedCols = (n) =>
  n === 4
    ? "cols-2 cols-4-wide"
    : `cols-${n <= 3 ? n : n % 3 === 0 ? 3 : n % 2 === 0 ? 2 : 3}`;

/** Related pages. Used for internal linking on every service page. */
export function related(items, heading = "Related services") {
  return `<section class="section tight">
  <div class="container">
    <h2 class="section-head">${heading}</h2>
    <ul class="related ${relatedCols(items.length)} reveal">
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

/**
 * FAQPage JSON-LD. Only ever emitted alongside the same visible questions
 * (faqSection), as the same plain text; scripts/seo-check.mjs compares them.
 * Google shows FAQ rich results for very few kinds of site, so this is kept
 * for clarity to machines, not for a search snippet.
 */
export function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: plainText(item.q),
      acceptedAnswer: {
        "@type": "Answer",
        text: plainText(item.a),
      },
    })),
  };
}

/**
 * Organization + WebSite graph, emitted on every page by src/layout.js.
 * Claims only what the business can evidence: a name, a URL, an email, the
 * WhatsApp number, the tagline on the social card and a service area. No
 * address, opening hours, price range, ratings, review counts, employee or
 * client numbers. (/pricing quotes larger sites separately, so no upper
 * price can be stated.)
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: SITE.name,
        url: `${SITE.origin}/`,
        logo: `${SITE.origin}/assets/apple-touch-icon.png`,
        image: `${SITE.origin}/assets/social-card.png`,
        slogan: SITE.tagline,
        email: SITE.email,
        telephone: SITE.phone,
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: SITE.email,
            availableLanguage: "en-GB",
          },
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            name: "WhatsApp",
            url: SITE.whatsapp,
            availableLanguage: "en-GB",
          },
        ],
        ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
        description:
          "Veltra Media builds websites, local SEO, landing pages and enquiry automation for businesses in Middlesbrough and across Teesside.",
        areaServed: SITE.areas.map(place),
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
        publisher: { "@id": ORG_ID },
        inLanguage: "en-GB",
      },
    ],
  };
}

/**
 * Service JSON-LD. `areaServed` narrows an area page to its own town(s);
 * every other page serves all of SITE.areas. The provider resolves because
 * layout.js puts the organisation node on every page.
 */
export function serviceJsonLd({ name, serviceType, description, path, areaServed = null }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: SITE.origin + path,
    provider: { "@id": ORG_ID },
    areaServed: (areaServed ?? SITE.areas).map(place),
  };
}

/**
 * BlogPosting JSON-LD for the articles under /resources. Dates are
 * YYYY-MM-DD; `image` is a site path or absolute URL. `author` defaults to
 * the organisation until a named author is confirmed (docs/seo/owner-todo.md).
 */
export function articleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified = datePublished,
  image = "/assets/social-card.png",
  author = { "@id": ORG_ID },
}) {
  const url = SITE.origin + path;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified,
    image: /^https?:\/\//.test(image) ? image : SITE.origin + image,
    author,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-GB",
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

/**
 * The visible breadcrumb, drawn by layout.js from the page's own
 * BreadcrumbList so the two always match. The last item is the current page.
 */
export function breadcrumbNav(list) {
  const items = list.itemListElement;
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
      <div class="container">
        <ol>${items
          .map((item, index) => {
            const path = item.item.slice(SITE.origin.length) || "/";
            return index === items.length - 1
              ? `<li><a href="${path}" aria-current="page">${esc(item.name)}</a></li>`
              : `<li><a href="${path}">${esc(item.name)}</a></li>`;
          })
          .join("")}</ol>
      </div>
    </nav>`;
}
