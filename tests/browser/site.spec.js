import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function fillForm(page) {
  await page.getByLabel("Your name", { exact: true }).fill("Test Owner");
  await page
    .getByLabel("Work email", { exact: true })
    .fill("owner@example.com");
  await page.getByLabel("Business name", { exact: true }).fill("Test Clinic");
  await page
    .getByLabel("Business type", { exact: true })
    .selectOption("Med spa / aesthetic clinic");
  await page.getByLabel("I agree to be contacted").check();
}

test("all pages render, have no overflow or runtime errors, and local links resolve", async ({
  page,
  request,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const paths = ["/", "/contact", "/privacy", "/terms"];
  const links = new Set();
  for (const path of paths) {
    expect((await page.goto(path)).status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Veltra Media/);
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
            .filter((h) => h.startsWith("/")),
        )
    ).forEach((h) => links.add(h));
  }
  for (const link of links)
    expect((await request.get(link.split("#")[0] || "/")).status()).toBe(200);
  expect((await request.get("/not-a-page")).status()).toBe(404);
  expect(
    (
      await request.get("/website-that-books-fixed.html", { maxRedirects: 0 })
    ).status(),
  ).toBe(308);
  expect(errors).toEqual([]);
});

test("walkthrough keyboard navigation, FAQ, theme persistence, and mobile menu work", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page.locator("#stage-1").click();
  await expect(page.locator("#stage-1")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#demo-scene")).toContainText("AI assistant");
  await page.locator("#stage-1").press("ArrowRight");
  await expect(page.locator("#stage-2")).toBeFocused();
  await expect(page.locator("#demo-scene")).toContainText("booking link");
  await page.locator("#stage-2").press("End");
  await expect(page.locator("#stage-3")).toHaveAttribute(
    "aria-selected",
    "true",
  );
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
      .getByText("Pricing", { exact: true })
      .click();
    await expect(page.locator("#nav-links")).not.toBeVisible();
    await expect(page).toHaveURL(/#pricing$/);
  }
});

test("calculator handles changes and a zero-visit scenario", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#roi-net")).toHaveText("$1,001");
  await page.locator("#bookings").fill("0");
  await expect(page.locator("#roi-net")).toHaveText("-$399");
  await expect(page.locator("#roi-payback")).toHaveText("Not covered");
  await page.locator("#bookings").fill("10");
  await page.locator("#visit-value").fill("500");
  await page.locator("#margin").fill("60");
  await expect(page.locator("#roi-net")).toHaveText("$2,601");
  await expect(page.locator("#roi-breakeven")).toHaveText("2 visits");
});

test("form validates, preserves failed entries, and accepts confirmed delivery", async ({
  page,
}) => {
  await page.route("**/api/status", (route) =>
    route.fulfill({ json: { intakeAvailable: true } }),
  );
  await page.goto("/contact");
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
  expect(payload.businessType).toBe("Med spa / aesthetic clinic");
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
  await expect(page.locator("#form-heading")).toHaveText(
    "Book your free strategy call.",
  );
  await expect(page.locator("#slot-legend")).toContainText("20-minute");
  await fillForm(page);
  await page.locator("#submit-inquiry").click();
  await expect(page.locator("#slot-error")).toContainText("choose a time");
  await expect(page.locator("#slot-days label")).toHaveCount(2);
  await page.locator("#slot-days label").first().click();
  await expect(page.locator("#slot-times label")).toHaveCount(2);
  await page.locator("#slot-times label").nth(1).click();
  let payloads = [];
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
  await page.goto("/contact");
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
  await expect(page.locator('[data-contact="phone"]')).toHaveAttribute(
    "href",
    "tel:+12025550199",
  );
  await expect(page.locator('[data-contact="whatsapp"]')).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\/12025550199\?/,
  );
  await expect(page.locator("[data-booking-option]")).toBeVisible();
});

test("WCAG AA checks pass on main routes in both themes", async ({ page }) => {
  test.setTimeout(180000);
  for (const route of ["/", "/contact", "/privacy", "/terms"]) {
    await page.goto(route);
    for (const dark of [false, true]) {
      await page.evaluate(
        (dark) => document.documentElement.classList.toggle("dark-mode", dark),
        dark,
      );
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
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("content, honest standard pricing, and navigation survive without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:4174/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-setup-price]")).toHaveText("$3,490");
  await expect(page.locator(".feature-item")).toHaveCount(6);
  await page.goto("http://localhost:4174/contact");
  await expect(page.locator("noscript p")).toContainText("enable JavaScript");
  await expect(page.locator("#submit-inquiry")).toBeDisabled();
  await context.close();
});
