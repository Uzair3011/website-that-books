// Every public route in one place. The dev server, the production build and
// the sitemap all read from this list, so a new page cannot be half-wired.
import about from "./pages/about.js";
import aiAutomation from "./pages/ai-automation-middlesbrough.js";
import contact from "./pages/contact.js";
import cookiePolicy from "./pages/cookie-policy.js";
import crmBooking from "./pages/crm-booking-automation.js";
import freeAudit from "./pages/free-website-audit.js";
import googleBusinessProfile from "./pages/google-business-profile.js";
import home from "./pages/home.js";
import landingPages from "./pages/landing-page-design.js";
import localSeo from "./pages/local-seo-middlesbrough.js";
import medSpa from "./pages/med-spa-growth-system.js";
import notFound from "./pages/not-found.js";
import pricing from "./pages/pricing.js";
import privacy from "./pages/privacy.js";
import resources from "./pages/resources.js";
import terms from "./pages/terms.js";
import webDesign from "./pages/web-design-middlesbrough.js";
import webDesignTeesside from "./pages/web-design-teesside.js";
import websiteCare from "./pages/website-care.js";
import work from "./pages/work.js";

export const pages = [
  home,
  webDesign,
  webDesignTeesside,
  localSeo,
  googleBusinessProfile,
  landingPages,
  aiAutomation,
  crmBooking,
  websiteCare,
  work,
  about,
  freeAudit,
  contact,
  resources,
  pricing,
  medSpa,
  privacy,
  cookiePolicy,
  terms,
];

export const notFoundPage = notFound;

/** Routes that must 308/301 to a current page. */
export const redirects = {
  "/index.html": "/",
  "/website-that-books-fixed.html": "/",
  "/contact.html": "/contact",
  "/privacy.html": "/privacy",
  "/privacy-policy": "/privacy",
  "/terms.html": "/terms",
  "/pricing.html": "/pricing",
  "/about.html": "/about",
  // The three former med-spa landing pages consolidate into one specialist page.
  "/ai-receptionist-for-med-spas": "/med-spa-growth-system",
  "/ai-receptionist-for-med-spas.html": "/med-spa-growth-system",
  "/med-spa-website-design": "/med-spa-growth-system",
  "/med-spa-website-design.html": "/med-spa-growth-system",
  "/med-spa-online-booking": "/med-spa-growth-system",
  "/med-spa-online-booking.html": "/med-spa-growth-system",
  // Routes named in the strategy brief that are served by an existing page.
  "/landing-pages": "/landing-page-design",
  "/ai-receptionist": "/ai-automation-middlesbrough",
  "/booking-follow-up-automation": "/crm-booking-automation",
};

export const pageByPath = new Map(pages.map((page) => [page.path, page]));
