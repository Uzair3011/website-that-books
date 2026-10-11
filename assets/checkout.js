// The checkout, payment-status and cancelled pages. Service details come from the same catalogue
// as /pricing, so what the summary shows is what the server charges. The browser sends only which
// service and who is buying; /api/checkout looks the price up itself. Text from the server is only
// ever rendered with textContent.
import { amountMinor, catalogItem } from "./catalog.js";
import { validateCheckout } from "./validation.js";

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const gbp = (pence, currency = "gbp") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: pence % 100 ? 2 : 0,
  }).format(pence / 100);
const unitLabel = (item) =>
  ({ "one-off": "one-off", setup: "one-off setup", test: "in test mode", check: "one-off" })[item.unit] || item.unit;
const config = window.VELTRA_CONFIG || {};
const whatsapp = /^\d{7,15}$/.test(config.whatsapp || "")
  ? `https://wa.me/${config.whatsapp}`
  : null;

// ── /checkout ───────────────────────────────────────────────────────────────
const form = $("#checkout-form");
if (form) {
  const select = $("#checkout-service");
  const submit = $("#checkout-submit");
  const submitLabel = $("#checkout-submit-label");
  const message = $("#checkout-message");
  // A hidden item (the £1 payment check) is offered only to someone who opened its direct link.
  const hidden = catalogItem(params.get("service"));
  if (hidden?.hidden && hidden.purchasable)
    select.append(new Option(`${hidden.name} · ${gbp(amountMinor(hidden))}`, hidden.slug));
  // Only what this build sells: the options the server rendered, plus a linked hidden item.
  const allowed = new Set([...select.options].map((option) => option.value).filter(Boolean));
  const fields = {
    service: select,
    name: $("#checkout-name"),
    email: $("#checkout-email"),
    business: $("#checkout-business"),
    terms: $("#checkout-terms"),
  };
  const errorFor = (input) => document.getElementById(`${input.id}-error`);

  function setMessage(text, kind = "") {
    message.textContent = text;
    message.className = `form-message${kind ? ` ${kind}` : ""}`;
  }
  function clearErrors() {
    for (const input of Object.values(fields)) {
      input.removeAttribute("aria-invalid");
      errorFor(input).textContent = "";
    }
  }
  function showErrors(errors) {
    let first;
    for (const [name, text] of Object.entries(errors)) {
      const input = fields[name];
      if (!input) continue;
      input.setAttribute("aria-invalid", "true");
      errorFor(input).textContent = text;
      first ||= input;
    }
    first?.focus();
  }

  function render() {
    const item = allowed.has(select.value) ? catalogItem(select.value) : null;
    $("#summary-name").textContent = item ? item.name : "Choose a service";
    $("#summary-description").textContent = item
      ? item.description
      : "Pick a service above to see exactly what is included and what you pay.";
    const list = $("#summary-features");
    list.replaceChildren(
      ...(item?.package
        ? item.includes.map((slug) => catalogItem(slug).name)
        : item?.features || []
      ).map((text) => {
        const li = document.createElement("li");
        li.innerHTML =
          '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>';
        li.append(Object.assign(document.createElement("span"), { textContent: text }));
        return li;
      }),
    );
    const price = item ? gbp(amountMinor(item)) : "–";
    $("#summary-price").textContent = item ? `${price} ${unitLabel(item)}` : "–";
    $("#summary-total").textContent = price;
    $("#summary-test").hidden = !item?.testOnly;
    $("#summary-test-note").hidden = !item?.testOnly;
    submitLabel.textContent = item
      ? `Continue to secure payment · ${price}`
      : "Continue to secure payment";
  }

  // Preselect from ?service=, keeping the address in step when the choice changes.
  const requested = params.get("service");
  if (allowed.has(requested)) select.value = requested;
  else if (requested) setMessage("That service can’t be bought online. Please choose one from the list.", "error");
  select.addEventListener("change", () => {
    const url = new URL(location.href);
    if (select.value) url.searchParams.set("service", select.value);
    else url.searchParams.delete("service");
    history.replaceState(null, "", url);
    errorFor(select).textContent = "";
    select.removeAttribute("aria-invalid");
    render();
  });
  render();

  let busy = false;
  function setBusy(state) {
    busy = state;
    submit.disabled = state;
    submit.setAttribute("aria-busy", String(state));
    if (state) submitLabel.textContent = "Opening secure checkout…";
    else render();
  }
  // Coming back from Stripe with the back button restores this page from cache; make it usable.
  addEventListener("pageshow", (event) => {
    if (event.persisted) setBusy(false);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    clearErrors();
    setMessage("");
    const raw = {
      service: select.value,
      name: fields.name.value,
      email: fields.email.value,
      business: fields.business.value,
      terms: fields.terms.checked,
      fax: $("#checkout-fax").value,
    };
    const { errors, valid } = validateCheckout(raw);
    if (!valid) {
      showErrors(errors);
      setMessage("Please check the highlighted fields.", "error");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.ok && /^https:\/\//.test(result.url)) {
        location.assign(result.url);
        return;
      }
      if (result.errors) showErrors(result.errors);
      setMessage(
        result.message || "We couldn’t start the checkout. You have not been charged. Please try again.",
        "error",
      );
    } catch {
      setMessage("We couldn’t reach the checkout. Check your connection and try again. You have not been charged.", "error");
    }
    setBusy(false);
    message.focus();
  });
}

// ── /checkout/success ───────────────────────────────────────────────────────
const result = $("#result");
if (result) {
  const icons = $("#result-icons").content;
  const iconFor = (name) => icons.querySelector(`[data-icon="${name}"] svg`).cloneNode(true);
  const retryHref = (slug) =>
    catalogItem(slug) ? `/checkout?service=${encodeURIComponent(slug)}` : "/pricing";
  const STATES = {
    paid: {
      tone: "success", icon: "paid", eyebrow: "Payment received",
      title: "Thank you. Your order is confirmed.",
      text: (d) => `We’ve received your payment for ${d.service.name}.${d.email ? " Stripe is emailing your receipt." : ""}`,
      next: true, pill: "Paid",
    },
    processing: {
      tone: "waiting", icon: "waiting", eyebrow: "Payment processing",
      title: "Your payment is on its way.",
      text: () => "Your bank is still confirming the payment, which can take a few days for some payment methods. We’ll email you as soon as it clears. There’s no need to pay again.",
      pill: "Processing",
    },
    pending: {
      tone: "waiting", icon: "waiting", eyebrow: "Waiting for confirmation",
      title: "We’re still waiting for Stripe to confirm.",
      text: () => "If you’ve just paid, this usually takes a few seconds. This page checks again automatically. Please don’t pay twice.",
      pill: "Pending", refresh: true,
    },
    failed: {
      tone: "error", icon: "failed", eyebrow: "Payment unsuccessful",
      title: "Your payment didn’t go through.",
      text: () => "You have not been charged. You can try again with another card, or message us and we’ll help.",
      retry: "Try again", pill: "Failed",
    },
    expired: {
      tone: "neutral", icon: "info", eyebrow: "Checkout expired",
      title: "This checkout expired before payment.",
      text: () => "No payment was taken. Start a new checkout whenever you’re ready.",
      retry: "Start a new checkout", pill: "Expired",
    },
    refunded: {
      tone: "neutral", icon: "info", eyebrow: "Refunded",
      title: "This payment has been refunded.",
      text: () => "The refund has gone back to the card you paid with. Banks usually show it within 5 to 10 working days.",
      pill: "Refunded",
    },
    partially_refunded: {
      tone: "neutral", icon: "info", eyebrow: "Partly refunded",
      title: "Part of this payment has been refunded.",
      text: () => "The refunded amount has gone back to the card you paid with. Banks usually show it within 5 to 10 working days.",
      pill: "Partly refunded",
    },
    missing: {
      tone: "error", icon: "info", eyebrow: "Payment",
      title: "We couldn’t find this payment.",
      text: () => "If money has left your account, message us with the time you paid and we’ll confirm it straight away.",
    },
    error: {
      tone: "error", icon: "info", eyebrow: "Payment",
      title: "We couldn’t check your payment just now.",
      text: () => "If you completed the payment, it is safe. Please refresh in a minute, or message us and we’ll confirm it.",
      refresh: true,
    },
  };

  const button = (label, href, kind = "") => {
    const link = Object.assign(document.createElement("a"), {
      className: `btn${kind ? ` ${kind}` : ""}`,
      href,
      textContent: label,
    });
    link.append(iconFor("arrow"));
    return link;
  };

  function show(name, data) {
    const state = STATES[name];
    result.dataset.state = name;
    const badge = $("#result-icon");
    badge.dataset.tone = state.tone;
    badge.replaceChildren(iconFor(state.icon));
    $("#result-eyebrow").textContent = state.eyebrow;
    $("#result-title").textContent = state.title;
    $("#result-text").textContent = state.text(data);
    const internal = catalogItem(data?.service.slug);
    $("#result-next").hidden = !state.next || Boolean(internal?.hidden || internal?.testOnly);
    const order = $("#result-order");
    order.hidden = !data;
    if (data) {
      $("#order-service").textContent = data.service.name;
      $("#order-amount").textContent = gbp(data.amount, data.currency) + (data.testMode ? " (test)" : "");
      $("#order-reference").textContent = data.reference;
      $("#order-email").textContent = data.email || "";
      $("#order-email-row").hidden = !data.email;
      const pill = $("#order-status");
      pill.textContent = state.pill;
      pill.dataset.state = name;
    }
    const actions = [];
    if (state.retry && data) actions.push(button(state.retry, retryHref(data.service.slug)));
    if (state.refresh) {
      const again = Object.assign(document.createElement("button"), {
        type: "button",
        className: "btn",
        textContent: "Check again",
      });
      again.addEventListener("click", () => check(0));
      actions.push(again);
    }
    if (name === "paid") actions.push(button("Back to the homepage", "/"));
    if (whatsapp) {
      const chat = button("Message us on WhatsApp", whatsapp, "secondary");
      chat.target = "_blank";
      chat.rel = "noopener";
      actions.push(chat);
    }
    $("#result-actions").replaceChildren(...actions);
    document.title = `${state.eyebrow} | Veltra Media`;
  }

  const sessionId = params.get("session_id") || "";
  let attempts = 0;
  async function check(delay) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
    attempts++;
    try {
      const response = await fetch(`/api/checkout-status?session_id=${encodeURIComponent(sessionId)}`, {
        headers: { Accept: "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 404 || response.status === 400) return show("missing");
      if (!response.ok || !data.ok || !STATES[data.status]) return show("error");
      show(data.status, data);
      // Stripe usually confirms within seconds of the redirect; keep looking for a while.
      if (data.status === "pending" && attempts < 8) check(Math.min(1500 * attempts, 6000));
    } catch {
      show("error");
    }
  }
  if (/^cs_(test|live)_[A-Za-z0-9]{10,200}$/.test(sessionId)) check(0);
  else show("missing");
}

// ── /checkout/cancelled ─────────────────────────────────────────────────────
const retry = $("#cancelled-retry");
if (retry) {
  const item = catalogItem(params.get("service"));
  if (item?.purchasable) {
    retry.href = `/checkout?service=${encodeURIComponent(item.slug)}`;
    $("#cancelled-service").textContent = ` for ${item.name}`;
  }
}
