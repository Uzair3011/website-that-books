import { getOffer, calculateOpportunity } from "./business.js";
import { validateInquiry } from "./validation.js";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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
matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);
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
    dark ? "#101b30" : "#faf9f6",
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
    ? `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Hi Veltra Media, I’d like to explore a growth system for my business.")}`
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

// A fixed offer expiry, with standard pricing as the no-JavaScript fallback.
function updateOffer() {
  const offer = getOffer();
  $$("[data-setup-price]").forEach((el) => {
    el.textContent = money(offer.setup);
  });
  $$("[data-offer-original]").forEach((el) => {
    el.textContent = money(offer.standardSetup);
    el.hidden = !offer.isLaunch;
  });
  $$("[data-offer-launch-note]").forEach((el) => {
    el.hidden = !offer.isLaunch;
  });
  $$("[data-offer-savings]").forEach((el) => {
    el.textContent = `${money(offer.savings)} less than the individual setup estimates`;
  });
  $$("[data-offer-banner]").forEach((el) => {
    el.textContent = offer.isLaunch
      ? "Launch offer · Through October 31, 2026"
      : "The complete system · One location";
  });
  updateCalculator();
}
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
updateOffer();
// Recheck when a visitor returns to a tab that was open across the deadline.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateOffer();
});
setInterval(updateOffer, 60000);

// A manually controlled walkthrough. No auto-advancing or distracting animation.
const scenes = [
  [
    "Your clinic. Your personality.",
    "I’ve been thinking about a skin consultation. Where do I start?",
    "You’re in the right place. Explore your options, meet the team, and find a consultation that works for you.",
    "web",
    "A thoughtful first impression.",
    "Branded website → Consultation inquiry",
    "01 / A clear path from discovery to inquiry.",
  ],
  [
    "A helpful hello. Any time.",
    "Hi! Are you open on Saturdays? I’d love to book a consultation.",
    "I’m the clinic’s AI assistant. Yes, Saturday consultations are available. I can help you find a time or ask the team to call you.",
    "phone",
    "Questions answered. Interest captured.",
    "Approved answers → Human handoff when needed",
    "02 / AI phone and chat, with your team in control.",
  ],
  [
    "A time that works for everyone.",
    "Saturday at 10:30 would be perfect.",
    "Here’s the booking link with the clinic’s available times. Once you confirm, we’ll send your appointment details and a reminder.",
    "calendar",
    "A clear next step.",
    "Live availability → Booking → Reminder",
    "03 / Fewer back-and-forth messages. Easier booking.",
  ],
  [
    "A conversation worth continuing.",
    "I’ll check my schedule and come back to you.",
    "Of course. With your permission, we can send a follow-up with the booking link. You can opt out at any time.",
    "flow",
    "Helpful follow-up. One shared history.",
    "Consent-based reminders → Stop on reply or opt-out",
    "04 / Your team sees the context, not just a name.",
  ],
];
const tabs = $$(".system-tab");
function selectStage(index, focus = false) {
  tabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  const [title, client, response, icon, event, detail, caption] = scenes[index];
  // These values are authored static content, never visitor input.
  $(".demo-browser-head").innerHTML = `${title}<span>EXAMPLE JOURNEY</span>`;
  $("#demo-scene").innerHTML =
    `<div class="message from-client">${client}</div><div class="message">${response}</div><div class="demo-event"><svg class="icon" aria-hidden="true"><use href="#i-${icon}"/></svg><div>${event}<small>${detail}</small></div></div>`;
  $("#stage-caption").textContent = caption;
  $("#journey-panel").setAttribute("aria-labelledby", `stage-${index}`);
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectStage(index));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (["ArrowDown", "ArrowRight"].includes(event.key))
      next = (index + 1) % tabs.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key))
      next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectStage(next, true);
    }
  });
});

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
          "Book your free strategy call.",
          "Pick a time that suits you and tell us a little about your business. You’ll get a calendar invitation straight away.",
          "Confirm my strategy call",
        ]
      : inquiryCopy;
    const external = $("[data-booking-option]");
    if (external) external.hidden = enabled || !contacts.booking;
  }
  async function loadAvailability() {
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
        "Your request has been delivered. We’ll follow up using the details you shared to arrange your strategy call. A calendar time is not reserved yet.",
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
          ? "Confirm my strategy call"
          : inquiryCopy[2];
    }
  });
}
