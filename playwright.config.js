import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  timeout: 60000,
  use: { baseURL: "http://localhost:4174", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4174",
    reuseExistingServer: !process.env.CI,
    // The form endpoints enforce a same-origin POST against SITE_URL. Without
    // this the local server rejects its own forms, so the suite would only ever
    // exercise the 403 path. Shell variables take precedence over .env.
    env: { ...process.env, SITE_URL: "http://localhost:4174" },
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],
});
