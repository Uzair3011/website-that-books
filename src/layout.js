// Renders a complete static HTML document. Both the dev server and the
// production build call this, so every route ships identical chrome.
import { voiceConfigured } from "../api/voice.js";
import { asset } from "./asset-version.js";
import { SITE, esc, footer, header, mobileBar } from "./site.js";

const SOCIAL_CARD = {
  src: "/assets/social-card.png",
  width: 1200,
  height: 630,
  alt: `${SITE.name} — ${SITE.tagline}`,
};
const ROBOTS_INDEX =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

export function renderPage(
  {
    path,
    title,
    description,
    body,
    jsonLd = [],
    noindex = false,
    bodyClass = "",
    // Extra same-origin module scripts for this page only, e.g. the checkout.
    scripts = [],
    // Optional per-page share image: { src, width, height, alt }. `src` is a
    // site path or an absolute URL; the social card is the default.
    ogImage = SOCIAL_CARD,
    // "website" for pages, "article" for blog posts.
    ogType = "website",
  },
  // The chat and AI-call buttons only ship when their services are configured to answer.
  {
    origin = SITE.origin,
    chat = Boolean(process.env.GEMINI_API_KEY),
    voice = voiceConfigured(),
  } = {},
) {
  const canonical = origin + path;
  const image = /^https?:\/\//.test(ogImage.src) ? ogImage.src : origin + ogImage.src;
  const ld = jsonLd
    .filter(Boolean)
    .map(
      (data) =>
        // Authored objects only; escaping "<" keeps a stray sequence from
        // closing the script element early.
        `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`,
    )
    .join("\n    ");

  return `<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="${noindex ? "noindex" : ROBOTS_INDEX}" />
    <meta name="theme-color" content="#f4f5ef" />
    <meta property="og:type" content="${esc(ogType)}" />
    <meta property="og:site_name" content="${SITE.name}" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${esc(image)}" />
    ${ogImage.width ? `<meta property="og:image:width" content="${ogImage.width}" />` : ""}
    ${ogImage.height ? `<meta property="og:image:height" content="${ogImage.height}" />` : ""}
    ${ogImage.alt ? `<meta property="og:image:alt" content="${esc(ogImage.alt)}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
    <link
      rel="preload"
      href="/assets/fonts/manrope-latin.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link rel="stylesheet" href="${asset("/assets/styles.css")}" />
    <script src="${asset("/assets/init.js")}"></script>
    <script src="${asset("/assets/config.js")}" defer></script>
    <script src="${asset("/assets/app.js")}" type="module"></script>
    <script src="${asset("/assets/consent.js")}" defer></script>
    ${voice ? `<script src="${asset("/assets/voice.js")}" defer></script>` : ""}
    ${chat ? `<script src="${asset("/assets/chat.js")}" defer></script>` : ""}
    ${scripts.map((src) => `<script src="${asset(src)}" type="module"></script>`).join("\n    ")}
    ${ld}
  </head>
  <body${bodyClass ? ` class="${bodyClass}"` : ""}>
    <a class="skip-link" href="#main">Skip to content</a>
    ${header(path)}
    <main id="main">
${body}
    </main>
    ${footer()}
    ${mobileBar()}
  </body>
</html>
`;
}
