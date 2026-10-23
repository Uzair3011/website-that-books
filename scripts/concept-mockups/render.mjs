// Renders the concept-project mock-ups on /work to assets/work/concept-*.webp
// (1280×900, the size every project card expects). The businesses are
// fictional and the cards say so. Needs Playwright's Chromium, cwebp on the
// PATH and a network connection for the Google Fonts each mock-up loads.
//
//   node scripts/concept-mockups/render.mjs
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = fileURLToPath(new URL("../../assets/work/", import.meta.url));
const temp = mkdtempSync(join(tmpdir(), "concepts-"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
for (const name of ["boiler", "roofline", "joinery"]) {
  await page.goto(`file://${join(here, `${name}.html`)}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = join(temp, `${name}.png`);
  await page.screenshot({ path: png });
  execFileSync("cwebp", ["-quiet", "-q", "82", png, "-o", join(out, `concept-${name}.webp`)]);
  console.log(`assets/work/concept-${name}.webp`);
}
await browser.close();
rmSync(temp, { recursive: true });
