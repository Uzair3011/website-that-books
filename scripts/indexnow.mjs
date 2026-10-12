// Optional: tells Bing (and the other IndexNow engines) that the site's URLs
// changed, so they recrawl sooner. Never runs as part of the build or deploy.
//
//   SITE_URL=https://www.veltramedia.com INDEXNOW_KEY=<key> node scripts/indexnow.mjs [--dry-run]
//
// The key file /<key>.txt must already be live: scripts/build.mjs writes it
// into dist/ when INDEXNOW_KEY is set at build time. See docs/seo/README.md.

const ENDPOINT = "https://www.bing.com/indexnow";
const dryRun = process.argv.includes("--dry-run");

const site = new URL(process.env.SITE_URL || "https://www.veltramedia.com");
const key = process.env.INDEXNOW_KEY;
if (site.protocol !== "https:" || site.pathname !== "/")
  throw new Error("SITE_URL must be a public HTTPS origin.");
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key))
  throw new Error("Set INDEXNOW_KEY to 8-128 letters, digits or hyphens.");
const keyLocation = `${site.origin}/${key}.txt`;

// IndexNow rejects the whole batch if the key file is missing or wrong.
const published = await fetch(keyLocation);
if (!published.ok || (await published.text()).trim() !== key)
  throw new Error(`${keyLocation} does not serve the key. Deploy a build made with INDEXNOW_KEY set first.`);

// The live sitemap is the list of indexable URLs, exactly as deployed.
const sitemap = await fetch(`${site.origin}/sitemap.xml`);
if (!sitemap.ok) throw new Error(`Could not fetch the sitemap: HTTP ${sitemap.status}.`);
const urlList = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => new URL(url).host === site.host);
if (!urlList.length) throw new Error("The sitemap lists no URLs on this host.");

const payload = { host: site.host, key, keyLocation, urlList };
if (dryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});
// 200 and 202 both mean accepted; 202 means the key is still being verified.
if (response.status !== 200 && response.status !== 202)
  throw new Error(`IndexNow answered HTTP ${response.status}: ${await response.text()}`);
console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${response.status}).`);
