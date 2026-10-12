// Every public route in one place. The dev server, the production build and
// the sitemap all read from this list, so a new page cannot be half-wired.
import about from "./pages/about.js";
import areas from "./pages/areas.js";
import checkout from "./pages/checkout.js";
import checkoutCancelled from "./pages/checkout-cancelled.js";
import checkoutSuccess from "./pages/checkout-success.js";
import aiAgents from "./pages/ai-agents-teesside.js";
import aiReceptionist from "./pages/ai-receptionist-middlesbrough.js";
import contact from "./pages/contact.js";
import cookiePolicy from "./pages/cookie-policy.js";
import crmBooking from "./pages/crm-booking-automation.js";
import freeAudit from "./pages/free-website-audit.js";
import googleBusinessProfile from "./pages/google-business-profile.js";
import home from "./pages/home.js";
import howItWorks from "./pages/how-it-works.js";
import landingPages from "./pages/landing-page-design.js";
import localSeo from "./pages/local-seo-middlesbrough.js";
import medSpa from "./pages/med-spa-growth-system.js";
import notFound from "./pages/not-found.js";
import pricing from "./pages/pricing.js";
import privacy from "./pages/privacy.js";
import resources from "./pages/resources.js";
import services from "./pages/services.js";
import terms from "./pages/terms.js";
import webDesignTrades from "./pages/web-design-for-trades-teesside.js";
import webDesign from "./pages/web-design-middlesbrough.js";
import webDesignHartlepool from "./pages/web-design-hartlepool.js";
import webDesignRedcar from "./pages/web-design-redcar.js";
import webDesignStockton from "./pages/web-design-stockton-on-tees.js";
import webDesignTeesside from "./pages/web-design-teesside.js";
import websiteCare from "./pages/website-care.js";
import work from "./pages/work.js";

export const pages = [
  home,
  services,
  webDesign,
  webDesignTeesside,
  webDesignStockton,
  webDesignRedcar,
  webDesignHartlepool,
  areas,
  localSeo,
  googleBusinessProfile,
  landingPages,
  aiReceptionist,
  crmBooking,
  aiAgents,
  webDesignTrades,
  websiteCare,
  work,
  howItWorks,
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

/** Built and served like any page, but noindex and never in the sitemap. */
export const utilityPages = [checkout, checkoutSuccess, checkoutCancelled];

/**
 * Routes that must 308 to a current page. vercel.json `redirects` holds
 * exactly the same rules (scripts/seo-check.mjs fails if they drift), and every
 * destination is a live page, never another redirect.
 *
 * No source ends in `.html`, `/index` or "/": Vercel's cleanUrls and
 * trailingSlash run before vercel.json redirects, so such a rule could never
 * fire there. `platformRedirect` models those hops instead.
 */
export const redirects = {
  "/website-that-books-fixed": "/",
  "/privacy-policy": "/privacy",
  // The three former med-spa landing pages consolidate into one specialist page.
  "/ai-receptionist-for-med-spas": "/med-spa-growth-system",
  "/med-spa-website-design": "/med-spa-growth-system",
  "/med-spa-online-booking": "/med-spa-growth-system",
  // Routes named in the strategy brief that are served by an existing page.
  "/landing-pages": "/landing-page-design",
  "/ai-receptionist": "/ai-receptionist-middlesbrough",
  // Renamed so the URL matches what the page sells (docs/seo/keyword-map.md section 2).
  "/ai-automation-middlesbrough": "/ai-receptionist-middlesbrough",
  "/booking-follow-up-automation": "/crm-booking-automation",
  // Pages from the previous Veltra site that are still indexed in Google.
  "/contact-us": "/contact",
  "/about-us": "/about",
  "/marketing-services": "/services",
  "/marketing-services/web-design": "/web-design-middlesbrough",
  "/marketing-services/seo": "/local-seo-middlesbrough",
};

/** Any other old /marketing-services/* page lands on the services overview. */
export const redirectPrefixes = { "/marketing-services/": "/services" };

/**
 * The 308s Vercel sends itself, before vercel.json redirects run (in this
 * order): cleanUrls turns `/x/index(.html)` into `/x` and `/x.html` into `/x`,
 * then trailingSlash: false turns `/x/` into `/x`.
 */
export function platformRedirect(pathname) {
  const index = /^\/(?:(.+)\/)?index(?:\.html)?\/?$/.exec(pathname);
  if (index) return `/${index[1] ?? ""}`;
  const html = /^\/(.*)\.html\/?$/.exec(pathname);
  if (html) return `/${html[1]}`;
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return null;
}

/** The next hop for `pathname`, exactly as Vercel would answer it, or null. */
export function resolveRedirect(pathname) {
  const platform = platformRedirect(pathname);
  if (platform) return platform;
  if (redirects[pathname]) return redirects[pathname];
  for (const [prefix, to] of Object.entries(redirectPrefixes))
    if (pathname.startsWith(prefix)) return to;
  return null;
}

export const pageByPath = new Map(
  [...pages, ...utilityPages].map((page) => [page.path, page]),
);
