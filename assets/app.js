import { SYSTEM, calculateOpportunity } from "./business.js";
import { validateInquiry } from "./validation.js";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: SYSTEM.currency,
    maximumFractionDigits: 0,
  }).format(number);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

// Accessible navigation and a persistent, optional appearance preference.
const menu = $("#menu-toggle");
const nav = $("#nav-links");
function closeMenu() {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
}
menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
nav
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header") && nav.classList.contains("open"))
    closeMenu();
});
matchMedia("(min-width: 1121px)").addEventListener("change", closeMenu);
const themeButton = $("#theme-toggle");
function updateThemeButton() {
  const dark = document.documentElement.classList.contains("dark-mode");
  themeButton?.setAttribute("aria-pressed", String(dark));
  themeButton?.setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} mode`,
  );
  $('meta[name="theme-color"]')?.setAttribute(
    "content",
    dark ? "#071313" : "#f4f5ef",
  );
}
updateThemeButton();
themeButton?.addEventListener("click", () => {
  const dark = document.documentElement.classList.toggle("dark-mode");
  try {
    localStorage.setItem("veltra-theme", dark ? "dark" : "light");
  } catch {
    /* Optional preference. */
  }
  updateThemeButton();
});
// A package button carries the choice into the plan form's goal field.
$$("[data-package]").forEach((link) =>
  link.addEventListener("click", () => {
    const goal = $("#challenge");
    if (goal && !goal.value.trim())
      goal.value = `I’m interested in the ${link.dataset.package} package.`;
  }),
);

$$("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Only publish real, explicitly configured contact channels.
const config = window.VELTRA_CONFIG || {};
function secureUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
const contacts = {
  booking: secureUrl(config.bookingUrl),
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || "")
    ? `mailto:${config.email}`
    : null,
  phone: /^\+[\d\s().-]{7,25}$/.test(config.phone || "")
    ? `tel:${config.phone.replace(/[^+\d]/g, "")}`
    : null,
  whatsapp: /^\d{7,15}$/.test(config.whatsapp || "")
    ? `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Hi Veltra Media, I’d like a free website and Google audit for my business.")}`
    : null,
};
$$("[data-contact]").forEach((link) => {
  const url = contacts[link.dataset.contact];
  if (url) {
    link.href = url;
    link.hidden = false;
  }
});
if (contacts.booking && $("[data-booking-option]"))
  $("[data-booking-option]").hidden = false;

// The system price is static content in the page; only the visitor-driven
// opportunity calculator needs JavaScript.
function updateCalculator() {
  if (!$("#bookings")) return;
  const visits = Number($("#bookings").value);
  const value = Number($("#visit-value").value);
  const margin = Number($("#margin").value);
  const result = calculateOpportunity({ visits, value, margin });
  $("#bookings-output").textContent = visits;
  $("#visit-value-output").textContent = money(value);
  $("#margin-output").textContent = `${margin}%`;
  $("#roi-net").textContent = money(result.contribution);
  $("#roi-gross").textContent = money(result.gross);
  $("#roi-margin").textContent = `${margin}%`;
  $("#roi-breakeven").textContent =
    `${result.breakeven} ${result.breakeven === 1 ? "visit" : "visits"}`;
  $("#roi-payback").textContent =
    result.payback === null
      ? "Not covered"
      : `${result.payback.toFixed(1)} months`;
}
$$(".range-field input").forEach((range) =>
  range.addEventListener("input", updateCalculator),
);
updateCalculator();

// Content remains visible if JavaScript fails or motion is disabled.
if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-ready");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  $$(".reveal").forEach((element) => observer.observe(element));
}

const form = $("#inquiry-form");
if (form) {
  const message = $("#form-message");
  const submit = $("#submit-inquiry");
  const submitLabel = $("#submit-label");
  const picker = $("#slot-picker");
  const heading = $("#form-heading");
  const intro = $("#form-intro");
  const inquiryCopy = [
    heading.textContent,
    intro.textContent,
    submitLabel.textContent,
  ];
  // A booking key is reused across retries so a timed-out attempt can't create a second event.
  const booking = {
    enabled: false,
    slots: [],
    start: "",
    key: crypto.randomUUID(),
  };
  const dayKey = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dayLabel = new Intl.DateTimeFormat(undefined, { weekday: "short" });
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  });
  const longDayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const timeLabel = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const fullLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  submit.disabled = false;
  function setMessage(text, kind = "") {
    message.textContent = text;
    message.className = `form-message ${kind}`;
  }
  function clearErrors() {
    form.querySelectorAll("[aria-invalid]").forEach((input) => {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    });
    form.querySelectorAll(".field-error").forEach((el) => {
      el.textContent = "";
    });
  }
  function showErrors(errors) {
    let first;
    Object.entries(errors).forEach(([name, text]) => {
      if (name === "start") {
        $("#slot-error").textContent = text;
        first ||= form.querySelector('[name="slotDay"]:checked')
          ? form.querySelector('[name="start"]')
          : form.querySelector('[name="slotDay"]');
        return;
      }
      const input = form.elements.namedItem(name);
      if (!input) return;
      input.setAttribute("aria-invalid", "true");
      const error = document.getElementById(`${input.id}-error`);
      if (error) {
        error.textContent = text;
        input.setAttribute("aria-describedby", error.id);
      }
      first ||= input;
    });
    first?.focus();
  }
  form.addEventListener("input", (event) => {
    const input = event.target;
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    const error = document.getElementById(`${input.id}-error`);
    if (error) error.textContent = "";
  });

  function addOption(container, name, value, lines, checked) {
    const id = `${name}-${container.children.length}`;
    const wrap = document.createElement("div");
    wrap.className = "slot-option";
    const input = Object.assign(document.createElement("input"), {
      type: "radio",
      name,
      value,
      id,
      checked,
    });
    const label = Object.assign(document.createElement("label"), {
      htmlFor: id,
    });
    lines.forEach((line) =>
      label.append(
        Object.assign(document.createElement("span"), { textContent: line }),
      ),
    );
    wrap.append(input, label);
    container.append(wrap);
  }
  function renderTimes(day) {
    const times = $("#slot-times");
    times.replaceChildren();
    const slots = booking.slots.filter(
      (slot) => dayKey.format(new Date(slot)) === day,
    );
    if (!slots.includes(booking.start)) booking.start = "";
    slots.forEach((slot) =>
      addOption(
        times,
        "start",
        slot,
        [timeLabel.format(new Date(slot))],
        slot === booking.start,
      ),
    );
    $("#slot-time-group").hidden = !slots.length;
    $("#slot-time-legend").textContent = slots.length
      ? `Time on ${longDayLabel.format(new Date(slots[0]))}`
      : "Time";
  }
  function renderSlots() {
    const days = $("#slot-days");
    const selected = form.querySelector('[name="slotDay"]:checked')?.value;
    const keys = [
      ...new Set(booking.slots.map((slot) => dayKey.format(new Date(slot)))),
    ];
    days.replaceChildren();
    keys.forEach((key) => {
      const sample = new Date(
        booking.slots.find((slot) => dayKey.format(new Date(slot)) === key),
      );
      addOption(
        days,
        "slotDay",
        key,
        [dayLabel.format(sample), dateLabel.format(sample)],
        key === selected,
      );
    });
    renderTimes(keys.includes(selected) ? selected : "");
  }
  picker.addEventListener("change", (event) => {
    if (event.target.name === "slotDay") renderTimes(event.target.value);
    if (event.target.name === "start") booking.start = event.target.value;
    $("#slot-error").textContent = "";
  });
  function setBookingMode(enabled) {
    booking.enabled = enabled;
    picker.hidden = !enabled;
    [heading.textContent, intro.textContent, submitLabel.textContent] = enabled
      ? [
          "Book a call instead.",
          "Pick a time that suits you and tell us a little about your business. You’ll get a calendar invitation straight away, and we’ll bring the audit findings to the call.",
          "Confirm my call",
        ]
      : inquiryCopy;
    const external = $("[data-booking-option]");
    if (external) external.hidden = enabled || !contacts.booking;
  }
  async function loadAvailability() {
    // A form marked data-booking="off" is a plain request form: no calendar.
    if (form.dataset.booking === "off") {
      booking.slots = [];
      setBookingMode(false);
      return null;
    }
    try {
      const response = await fetch("/api/availability", {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || !Array.isArray(result.slots))
        throw new Error();
      booking.slots = result.slots;
      $("#slot-legend").textContent =
        `Choose a time for your ${result.duration}-minute call`;
      $("#slot-timezone").textContent =
        `Times are shown in your time zone (${Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, " ")}).`;
      renderSlots();
      setBookingMode(booking.slots.length > 0);
      return result;
    } catch {
      booking.slots = [];
      setBookingMode(false);
      return null;
    }
  }
  // Offer live booking when the calendar is connected; otherwise fall back to a call request.
  loadAvailability().then((availability) => {
    if (booking.enabled) return;
    fetch("/api/status", { headers: { Accept: "application/json" } })
      .then((response) => response.json())
      .then((status) => {
        if (!status.intakeAvailable)
          setMessage(
            `Online call requests are temporarily unavailable.${Object.values(contacts).some(Boolean) ? " Please use one of the direct contact options on this page." : " Please try again later."}`,
          );
        else if (availability)
          setMessage(
            "There are no open times online right now. Send a request and we’ll find a time with you.",
          );
      })
      .catch(() => {
        /* Submission handles connectivity issues explicitly. */
      });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    clearErrors();
    const raw = Object.fromEntries(new FormData(form));
    const checked = validateInquiry(raw);
    const bookingMode = booking.enabled;
    const errors = {
      ...(bookingMode &&
        !booking.start && { start: "Please choose a time for your call." }),
      ...checked.errors,
    };
    const { data } = checked;
    if (Object.keys(errors).length) {
      showErrors(errors);
      setMessage("Please check the highlighted fields.", "error");
      return;
    }
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    submitLabel.textContent = bookingMode
      ? "Booking your call…"
      : "Sending your request…";
    setMessage("");
    try {
      const response = await fetch(bookingMode ? "/api/book" : "/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          ...(bookingMode && { start: booking.start, bookingKey: booking.key }),
          fax: raw.fax || "",
        }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) {
        if (result.errors) showErrors(result.errors);
        if (result.code === "slot_unavailable") {
          booking.start = "";
          await loadAvailability();
          (
            form.querySelector('[name="slotDay"]:checked') ||
            form.querySelector('[name="slotDay"]')
          )?.focus();
        }
        throw new Error(
          result.message || "We couldn’t send your request. Please try again.",
        );
      }
      form.reset();
      if (bookingMode) {
        booking.key = crypto.randomUUID();
        $("#booking-confirmed-time").textContent = fullLabel.format(
          new Date(result.booking.start),
        );
        $("#booking-confirmed-email").textContent = data.email;
        form.hidden = true;
        intro.hidden = true;
        $("#booking-confirmed").hidden = false;
        $("#booking-confirmed").focus({ preventScroll: true });
        return;
      }
      setMessage(
        form.dataset.booking === "off"
          ? "Your request has been delivered. A real person will reply with your website plan using the details you shared."
          : "Your request has been delivered. We’ll follow up using the details you shared to arrange your strategy call. A calendar time is not reserved yet.",
        "success",
      );
      message.focus({ preventScroll: true });
    } catch (error) {
      setMessage(
        error.name === "TimeoutError" || error.name === "AbortError"
          ? bookingMode
            ? "The request timed out, so we couldn’t confirm your booking. Please try again — retrying won’t create a double booking."
            : "The request timed out. Delivery is unconfirmed. Please use a direct contact option or try again."
          : error instanceof TypeError
            ? "We couldn’t connect. Your details are still here — please check your connection and try again."
            : error.message,
        "error",
      );
    } finally {
      submit.disabled = false;
      form.removeAttribute("aria-busy");
      if (!form.hidden)
        submitLabel.textContent = booking.enabled
          ? "Confirm my call"
          : inquiryCopy[2];
    }
  });
}
