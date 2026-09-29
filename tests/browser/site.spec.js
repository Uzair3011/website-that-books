import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  "/",
  "/services",
  "/how-it-works",
  "/web-design-middlesbrough",
  "/local-seo-middlesbrough",
  "/landing-page-design",
  "/ai-automation-middlesbrough",
  "/crm-booking-automation",
  "/work",
  "/about",
  "/free-website-audit",
  "/contact",
  "/resources",
  "/pricing",
  "/med-spa-growth-system",
  "/privacy",
  "/cookie-policy",
  "/terms",
  "/web-design-teesside",
  "/google-business-profile",
  "/website-care",
];

/** Waits for entrance animations to finish so audits see the settled page. */
async function settle(page) {
  await page.evaluate(async () => {
    const cap = new Promise((resolve) => setTimeout(resolve, 3000));
    await Promise.race([cap, Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.playState !== "paused")
        // An infinite marquee never finishes, so it is skipped.
        .filter((animation) => {
          const timing = animation.effect?.getTiming?.();
          return timing && timing.iterations !== Infinity;
        })
        .map((animation) => animation.finished.catch(() => {})),
    )]);
  });
}

async function fillForm(page) {
  await page.getByLabel("Your name", { exact: true }).fill("Test Owner");
  await page.getByLabel("Email", { exact: true }).fill("owner@example.com");
  await expect(page.getByLabel("Country code")).toHaveValue("+44");
  await page.locator("#phone").fill("07123 456789");
  await page.locator("#business").fill("Test Clinic");
  await page.locator("#service").selectOption("Website Design");
  await page.getByLabel("I agree to be contacted").check();
}

// Every test starts with a saved choice so the privacy banner stays out of the
// way; the banner test below clears it.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("consent-test")) return;
    localStorage.setItem(
      "veltra-cookie-consent",
      JSON.stringify({
        version: 1,
        analytics: false,
        updatedAt: new Date().toISOString(),
      }),
    );
  });
});

test("the privacy banner asks first, loads analytics only on consent, and can be reopened", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("consent-test")) return;
    sessionStorage.setItem("consent-test", "1");
    localStorage.removeItem("veltra-cookie-consent");
  });
  const insights = page.locator('script[src="/_vercel/insights/script.js"]');
  await page.goto("/pricing");
  const banner = page.getByRole("dialog", { name: "Your privacy choices" });
  await expect(banner).toBeVisible();
  await expect(page.locator(".assist-dock")).toBeHidden();
  await expect(insights).toHaveCount(0);
  const axe = await new AxeBuilder({ page }).include(".cookie").analyze();
  expect(axe.violations).toEqual([]);

  await banner.getByRole("button", { name: "Decline optional" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(banner).toBeHidden();
  await expect(insights).toHaveCount(0);

  await page.getByRole("button", { name: "Cookie preferences" }).click();
  await expect(banner).toBeVisible();
  const toggle = banner.getByRole("switch", { name: "Analytics" });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await banner.getByRole("button", { name: "Save preferences" }).click();
  await expect(banner).toBeHidden();
  await expect(insights).toHaveCount(1);
});

test("all pages render, have no overflow or runtime errors, and local links resolve", async ({
  page,
  request,
}) => {
  const errors = [];
  page.on("pageerror", (e) => {
    // WebKit reports a fetch that was cut short by navigating away as a page
    // error. The site's own handlers already treat that as "unknown", so this
    // is harness noise from walking 15 routes in a row, not a site defect.
    if (/access control checks|Load failed|cancelled|aborted/i.test(e.message))
      return;
    errors.push(e.message);
  });
  const links = new Set();
  const images = new Set();
  const dollarPages = [];
  for (const path of ROUTES) {
    expect((await page.goto(path)).status()).toBe(200);
    // The site sells in GBP; a dollar amount anywhere is a regression.
    if (
      await page.evaluate(() =>
        /\$\s?\d|\bUSD\b/.test(document.body.innerText),
      )
    )
      dollarPages.push(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Veltra Media/);
    // A malformed SVG renders as alt text with naturalWidth 0, which looks
    // like a broken page but throws no error. A lazy image that has not been
    // requested yet reports complete === false, so it is not a failure.
    const broken = await page.locator("img").evaluateAll((images) =>
      images
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.getAttribute("src")),
    );
    expect(broken, `broken images on ${path}`).toEqual([]);
    (
      await page
        .locator("img[src]")
        .evaluateAll((els) => els.map((e) => e.getAttribute("src")))
    ).forEach((src) => images.add(src));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    (
      await page
        .locator("a[href]")
        .evaluateAll((els) =>
          els
            .map((e) => e.getAttribute("href"))
            .filter((h) => h && h.startsWith("/")),
        )
    ).forEach((h) => links.add(h));
  }
  for (const link of links)
    expect(
      (await request.get(link.split("#")[0] || "/")).status(),
      link,
    ).toBe(200);
  for (const src of images) {
    const response = await request.get(src);
    expect(response.status(), src).toBe(200);
    if (src.endsWith(".svg")) {
      const body = await response.text();
      // An HTML-only entity makes the whole SVG fail to parse in the browser.
      expect(body.match(/&(?!amp;|lt;|gt;|quot;|apos;|#)[a-zA-Z]+;/g), src).toBe(
        null,
      );
    }
  }
  expect((await request.get("/not-a-page")).status()).toBe(404);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(errors).toEqual([]);
  expect(dollarPages).toEqual([]);
});

test("every page has a unique canonical, title and meta description", async ({
  page,
  baseURL,
}) => {
  const seen = { canonical: new Set(), title: new Set(), description: new Set() };
  for (const path of ROUTES) {
    await page.goto(path);
    const meta = await page.evaluate(() => ({
      canonical: document.querySelector("link[rel=canonical]")?.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content,
      og: document.querySelector('meta[property="og:url"]')?.content,
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map((s) => s.textContent)
        .join(""),
    }));
    // Canonicals are absolute and built from the serving origin, which the
    // production build sets to the real domain (asserted in the build test).
    expect(meta.canonical, path).toBe(new URL(path, baseURL).href);
    expect(meta.og, path).toBe(meta.canonical);
    expect(meta.description?.length, path).toBeGreaterThan(70);
    expect(seen.canonical.has(meta.canonical), path).toBe(false);
    expect(seen.title.has(meta.title), path).toBe(false);
    expect(seen.description.has(meta.description), path).toBe(false);
    seen.canonical.add(meta.canonical);
    seen.title.add(meta.title);
    seen.description.add(meta.description);
    // Structured data must parse.
    for (const script of await page
      .locator('script[type="application/ld+json"]')
      .allTextContents())
      expect(() => JSON.parse(script), path).not.toThrow();
  }
});

test("retired med-spa URLs and legacy paths redirect to their replacements", async ({
  request,
}) => {
  const moved = {
    "/ai-receptionist-for-med-spas": "/med-spa-growth-system",
    "/med-spa-website-design": "/med-spa-growth-system",
    "/med-spa-online-booking": "/med-spa-growth-system",
    "/landing-pages": "/landing-page-design",
    "/website-that-books-fixed.html": "/",
  };
  for (const [from, to] of Object.entries(moved)) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
});

test("FAQ, theme persistence, and mobile navigation work", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const faq = page.locator("details").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark-mode/);
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.locator("#nav-links")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#menu-toggle")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .locator("#nav-links")
      .getByText("About", { exact: true })
      .click();
    await expect(page.locator("#nav-links")).not.toBeVisible();
    await expect(page).toHaveURL(/\/about$/);
  }
});

test("the med-spa calculator is in GBP and handles a zero-visit scenario", async ({
  page,
}) => {
  await page.goto("/med-spa-growth-system");
  // Defaults: 8 visits x £350 x 50% margin, less the £49 care plan.
  await expect(page.locator("#roi-net")).toHaveText("£1,351");
  await expect(page.locator("#roi-breakeven")).toHaveText("1 visit");
  await page.locator("#bookings").fill("0");
  await expect(page.locator("#roi-net")).toHaveText("-£49");
  await expect(page.locator("#roi-payback")).toHaveText("Not covered");
  await page.locator("#bookings").fill("10");
  await page.locator("#visit-value").fill("500");
  await page.locator("#margin").fill("60");
  await expect(page.locator("#roi-net")).toHaveText("£2,951");
  await expect(page.locator("#visit-value-output")).toHaveText("£500");
});

test("form validates, preserves failed entries, and accepts confirmed delivery", async ({
  page,
}) => {
  // Live booking is exercised separately; pin it off so this test does not
  // depend on whether a real calendar is connected.
  await page.route("**/api/availability", (route) =>
    route.fulfill({ status: 503, json: { ok: false } }),
  );
  await page.route("**/api/status", (route) =>
    route.fulfill({ json: { intakeAvailable: true } }),
  );
  await page.goto("/free-website-audit");
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#full-name")).toBeFocused();
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
  await fillForm(page);
  await page.route("**/api/inquiry", (route) =>
    route.fulfill({
      status: 502,
      json: { ok: false, message: "Delivery failed. Please try again." },
    }),
  );
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#form-message")).toContainText("Delivery failed");
  await expect(page.locator("#email")).toHaveValue("owner@example.com");
  await expect(page.locator("#submit-inquiry")).toBeEnabled();
  await page.unroute("**/api/inquiry");
  let payload;
  await page.route("**/api/inquiry", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#form-message")).toContainText(
    "Your request has been delivered",
  );
  await expect(page.locator("#email")).toHaveValue("");
  expect(payload.phone).toBe("+447123456789");
  expect(payload.service).toBe("Website Design");
  expect(payload.page).toBe("/free-website-audit");
  expect(payload.consent).toBe(true);
  expect(
    await page.evaluate(() =>
      Object.keys(localStorage).filter((k) =>
        /email|inquiry|lead|waitlist/.test(k),
      ),
    ),
  ).toEqual([]);
});

test("live booking picks a slot, retries a taken slot, and confirms", async ({
  page,
}) => {
  const base = Date.UTC(2030, 0, 7, 10);
  const slots = [0, 30, 24 * 60].map((m) =>
    new Date(base + m * 60000).toISOString(),
  );
  let available = slots;
  await page.route("**/api/availability", (route) =>
    route.fulfill({
      json: {
        ok: true,
        timezone: "Europe/London",
        duration: 20,
        slots: available,
      },
    }),
  );
  await page.goto("/contact");
  await expect(page.locator("#form-heading")).toHaveText("Book a call instead.");
  await expect(page.locator("#slot-legend")).toContainText("20-minute");
  await fillForm(page);
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#slot-error")).toContainText("choose a time");
  await expect(page.locator("#slot-days label")).toHaveCount(2);
  await page.locator("#slot-days label").first().click();
  await expect(page.locator("#slot-times label")).toHaveCount(2);
  await page.locator("#slot-times label").nth(1).click();
  const payloads = [];
  await page.route("**/api/book", async (route) => {
    const body = route.request().postDataJSON();
    payloads.push(body);
    if (payloads.length === 1) {
      available = [slots[2]];
      return route.fulfill({
        status: 409,
        json: {
          ok: false,
          code: "slot_unavailable",
          message: "Sorry, that time is no longer available.",
        },
      });
    }
    await route.fulfill({
      json: { ok: true, booking: { start: body.start, end: body.start } },
    });
  });
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#form-message")).toContainText(
    "no longer available",
  );
  await expect(page.locator("#slot-days label")).toHaveCount(1);
  expect(payloads[0].start).toBe(slots[1]);
  await page.locator("#slot-days label").first().click();
  await page.locator("#slot-times label").first().click();
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#booking-confirmed")).toBeVisible();
  await expect(page.locator("#booking-confirmed-email")).toHaveText(
    "owner@example.com",
  );
  await expect(page.locator("#inquiry-form")).toBeHidden();
  expect(payloads[1].start).toBe(slots[2]);
  expect(payloads[1].bookingKey).toBe(payloads[0].bookingKey);
  expect(payloads[1].consent).toBe(true);
});

test("unconfigured intake never pretends to accept a lead", async ({
  page,
}) => {
  await page.route("**/api/availability", (route) =>
    route.fulfill({ status: 503, json: { ok: false } }),
  );
  await page.route("**/api/status", (route) =>
    route.fulfill({ json: { intakeAvailable: false } }),
  );
  await page.goto("/free-website-audit");
  await expect(page.locator("#form-message")).toContainText(
    "temporarily unavailable",
  );
  await fillForm(page);
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#form-message")).toContainText(
    "has not been sent",
  );
  await expect(page.locator("#email")).toHaveValue("owner@example.com");
});

test("configured calendar, call, email, and WhatsApp links are correct", async ({
  page,
}) => {
  await page.route("**/assets/config.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.VELTRA_CONFIG={bookingUrl:'https://calendly.com/test-veltra/strategy',email:'owner@example.com',phone:'+1 202 555 0199',whatsapp:'12025550199'};`,
    }),
  );
  await page.goto("/contact");
  await expect(page.locator('[data-contact="booking"]')).toHaveAttribute(
    "href",
    "https://calendly.com/test-veltra/strategy",
  );
  await expect(page.locator('[data-contact="whatsapp"]')).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\/12025550199\?/,
  );
  await expect(page.locator("[data-booking-option]")).toBeVisible();
});

test("WCAG AA checks pass on main routes in both themes", async ({ page }) => {
  test.setTimeout(240000);
  for (const route of [
    "/",
    "/pricing",
    "/work",
    "/free-website-audit",
    "/contact",
    "/med-spa-growth-system",
    "/web-design-teesside",
    "/google-business-profile",
    "/website-care",
    "/cookie-policy",
  ]) {
    await page.goto(route);
    await settle(page);
    for (const dark of [false, true]) {
      await page.evaluate(
        (dark) => document.documentElement.classList.toggle("dark-mode", dark),
        dark,
      );
      // The header and cards ease between themes; audit the settled colours.
      await settle(page);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        `${route}, dark=${dark}`,
      ).toEqual([]);
    }
  }
});

test("small phone, tablet, and reduced motion remain readable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/pricing", "/work"]) {
      await page.goto(route);
      await settle(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
      await expect(page.locator("h1")).toBeVisible();
    }
  }
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("content, honest standard pricing, and navigation survive without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const at = (path) => new URL(path, baseURL).href;
  await page.goto(at("/"));
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".service-card")).toHaveCount(6);
  await expect(page.locator(".hero-media img")).toBeVisible();
  await page.goto(at("/pricing"));
  await expect(page.locator(".price-card")).toHaveCount(3);
  await page.goto(at("/med-spa-growth-system"));
  // The system price is static content, so it survives without JavaScript.
  await expect(page.locator("[data-setup-price]")).toHaveText("£499");
  await page.goto(at("/contact"));
  await expect(page.locator("noscript p")).toContainText("enable JavaScript");
  await expect(page.locator("#submit-inquiry")).toBeDisabled();
  await context.close();
});

test("the lead dashboard is private, unindexed, and fails safe without a database", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await page.goto("/admin");
  expect(response.status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await expect(page.locator("#login")).toBeVisible();
  await expect(page.locator("#app")).toBeHidden();
  await expect(page.locator("#login-error")).toContainText("isn’t connected");
  await expect(page.locator("#login-submit")).toBeDisabled();
  expect(errors).toEqual([]);
});

test("the main number rings the team directly, separate from the AI call and chat buttons", async ({
  page,
}) => {
  await page.goto("/");
  const numbers = await page.$$eval('a[href^="tel:"]', (links) => [
    ...new Set(links.map((link) => link.getAttribute("href"))),
  ]);
  expect(numbers).toEqual(["tel:+447466539736"]);
  await expect(page.locator(".voice-launcher")).toBeVisible();
  await expect(page.locator(".chat-launcher")).toBeVisible();
  const voiceBox = await page.locator(".voice-launcher").boundingBox();
  const chatBox = await page.locator(".chat-launcher").boundingBox();
  expect(voiceBox.y + voiceBox.height).toBeLessThanOrEqual(chatBox.y);
  const bar = page.locator(".mobile-bar");
  if (await bar.isVisible()) {
    const barBox = await bar.boundingBox();
    expect(chatBox.y + chatBox.height).toBeLessThanOrEqual(barBox.y);
  }
});

test("chat answers in the panel, links only safe targets, and remembers the conversation", async ({
  page,
}) => {
  let sent;
  await page.route("**/api/chat", async (route) => {
    sent = route.request().postDataJSON();
    await route.fulfill({
      json: {
        ok: true,
        reply: "Websites start at £495, see /pricing or call +44 7466 539736. <img src=x onerror=alert(1)>",
        leadSaved: false,
      },
    });
  });
  await page.goto("/pricing");
  await page.locator(".chat-launcher").click();
  await expect(page.locator("#chat-panel")).toBeVisible();
  await expect(page.locator(".assist-dock")).toBeHidden();
  await page.locator(".chat-suggestions button").first().click();
  const reply = page.locator(".chat-msg.assistant").last();
  await expect(reply).toContainText("Websites start at £495");
  await expect(reply.locator('a[href="/pricing"]')).toHaveCount(1);
  await expect(reply.locator('a[href="tel:+447466539736"]')).toHaveCount(1);
  await expect(reply.locator("img")).toHaveCount(0);
  expect(sent.messages).toEqual([{ role: "user", text: "How much does a website cost?" }]);
  expect(sent.page).toBe("/pricing");
  expect(sent.sessionId).toMatch(/^[\w-]{16,64}$/);
  // The visitor's own words are never turned into links.
  await page.locator("#chat-input").fill("Call me on 07700 900123 or me@example.com");
  await page.keyboard.press("Enter");
  await expect(page.locator(".chat-msg.assistant:not(.typing)")).toHaveCount(3);
  await expect(page.locator(".chat-msg.user a")).toHaveCount(0);
  await page.goto("/about");
  await expect(page.locator("#chat-panel")).toBeVisible();
  await expect(page.locator(".chat-msg.user").first()).toHaveText("How much does a website cost?");
  await page.keyboard.press("Escape");
  await expect(page.locator("#chat-panel")).toBeHidden();
  await expect(page.locator(".assist-dock")).toBeVisible();
});

test("the AI call button explains a missing microphone or an unavailable service", async ({
  page,
}) => {
  await page.route("**/api/voice", (route) =>
    route.fulfill({
      status: 503,
      json: { ok: false, message: "Voice calls are unavailable right now. Please use the chat or call us." },
    }),
  );
  // A scripted microphone. WebKit only honours an override on the prototype.
  await page.addInitScript(() => {
    window.__micAllowed = false;
    Object.defineProperty(MediaDevices.prototype, "getUserMedia", {
      configurable: true,
      value: async () => {
        if (!window.__micAllowed) throw new DOMException("denied", "NotAllowedError");
        return { getTracks: () => [] };
      },
    });
  });
  await page.goto("/");
  await page.locator(".voice-launcher").click();
  const panel = page.locator("#voice-panel");
  await expect(panel).toBeVisible();
  await expect(panel.locator(".voice-human a")).toHaveAttribute("href", "tel:+447466539736");
  await panel.locator(".voice-action").click();
  await expect(panel.locator(".voice-status")).toContainText("Microphone access is needed");
  await page.evaluate(() => {
    window.__micAllowed = true;
  });
  await panel.locator(".voice-action").click();
  await expect(panel.locator(".voice-status")).toContainText("Voice calls are unavailable");
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
});

test("the call and chat buttons and panels meet WCAG AA in both themes", async ({
  page,
}) => {
  test.setTimeout(120000);
  const audit = async (selector, label) => {
    for (const dark of [false, true]) {
      await page.evaluate(
        (dark) => document.documentElement.classList.toggle("dark-mode", dark),
        dark,
      );
      await settle(page);
      const result = await new AxeBuilder({ page })
        .include(selector)
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${label}, dark=${dark}`,
      ).toEqual([]);
    }
  };
  await page.goto("/");
  await audit(".assist-dock", "dock");
  await page.locator(".chat-launcher").click();
  await audit("#chat-panel", "chat panel");
  await page.keyboard.press("Escape");
  await page.locator(".voice-launcher").click();
  await audit("#voice-panel", "call panel");
});
