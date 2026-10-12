// Versioned asset URLs. Every page references scripts and stylesheets as /assets/x.js?v=<hash of
// their contents>, and the build stamps the same version on relative module imports, so a changed
// file always gets a new URL. vercel.json therefore caches any /assets/ request carrying ?v= for a
// year (immutable); everything else under /assets/ (images, vendor files) keeps a one-hour cache.
// Only put ?v= on a URL whose content this hash covers.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { renderConfigScript } from "../lib/public-config.js";

const dir = new URL("../assets/", import.meta.url);
const hash = createHash("sha256");
// config.js is generated from environment variables, so its content is hashed instead of a file.
for (const name of readdirSync(dir)
  .filter((n) => /\.(js|css)$/.test(n) && n !== "config.js")
  .sort())
  hash.update(name).update(readFileSync(new URL(name, dir)));
hash.update(renderConfigScript());
// The build rewrites stylesheets with this minifier, so a change to it must change the version too.
hash.update(readFileSync(new URL("../scripts/minify-css.mjs", import.meta.url)));

export const ASSET_VERSION = hash.digest("hex").slice(0, 10);

/** "/assets/app.js" → "/assets/app.js?v=…" */
export const asset = (path) => `${path}?v=${ASSET_VERSION}`;

/** Stamps relative module imports (`from "./x.js"`) so imported modules are versioned too. */
export const versionImports = (source) =>
  source.replace(
    /(\bfrom\s*["']\.\/[\w-]+\.js)(["'])/g,
    `$1?v=${ASSET_VERSION}$2`,
  );
