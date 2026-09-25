// Renders a complete static HTML document. Both the dev server and the
// production build call this, so every route ships identical chrome.
import { SITE, esc, footer, header, mobileBar } from "./site.js";

const SOCIAL_CARD = "/assets/social-card.png";

export function renderPage(
  {
    path,
    title,
    description,
    body,
    jsonLd = [],
    noindex = false,
    bodyClass = "",
  },
  { origin = SITE.origin } = {},
) {
  const canonical = origin + path;
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
    ${noindex ? '<meta name="robots" content="noindex" />' : ""}
    <meta name="theme-color" content="#f4f5ef" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE.name}" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${origin}${SOCIAL_CARD}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${SITE.name} — ${esc(SITE.tagline)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${origin}${SOCIAL_CARD}" />
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
    <link rel="stylesheet" href="/assets/styles.css" />
    <script src="/assets/theme.js"></script>
    <script src="/assets/config.js" defer></script>
    <script src="/assets/app.js" type="module"></script>
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
