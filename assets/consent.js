// Cookie and analytics consent. Vercel Web Analytics is the only optional tool
// on the site, and it loads only after the visitor allows analytics. The choice
// is kept in local storage for six months; refusal is remembered just as long.
(() => {
  const KEY = "veltra-cookie-consent";
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const ANALYTICS_SRC = "/_vercel/insights/script.js";
  let memory = null;
  let banner = null;

  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      const at = Date.parse(saved?.updatedAt || "");
      if (
        saved?.version === 1 &&
        typeof saved.analytics === "boolean" &&
        Number.isFinite(at) &&
        Date.now() - at <= MAX_AGE
      )
        return { analytics: saved.analytics };
      localStorage.removeItem(KEY);
      return null;
    } catch {
      return memory;
    }
  }

  function save(preferences) {
    const before = read();
    memory = { analytics: preferences.analytics };
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          version: 1,
          analytics: preferences.analytics,
          updatedAt: new Date().toISOString(),
        }),
      );
    } catch {
      /* The choice still applies to this page if storage is blocked. */
    }
    close();
    // A loaded analytics script cannot be unloaded, so withdrawing consent reloads.
    if (before?.analytics && !preferences.analytics) location.reload();
    else apply(memory);
  }

  function apply(preferences) {
    if (!preferences?.analytics) return;
    if (document.querySelector(`script[src="${ANALYTICS_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = ANALYTICS_SRC;
    script.defer = true;
    document.head.append(script);
  }

  function close() {
    banner?.remove();
    banner = null;
    document.removeEventListener("keydown", onKey);
  }

  function onKey(event) {
    if (event.key === "Escape" && read()) close();
  }

  const policyLinks =
    '<a href="/privacy">Privacy policy</a> <span aria-hidden="true">&middot;</span> <a href="/cookie-policy">Cookie policy</a>';

  function summaryView() {
    return `<p id="consent-desc">Essential storage keeps the website working and remembers your choice. Optional analytics counts page visits so we can improve the site, and only runs with your permission. ${policyLinks}</p>
      <div class="cookie-actions">
        <button type="button" class="btn small" data-consent="accept">Accept all</button>
        <button type="button" class="btn small secondary" data-consent="reject">Decline optional</button>
        <button type="button" class="cookie-text-button" data-consent="manage">Manage preferences</button>
      </div>`;
  }

  function preferencesView(analytics) {
    return `<p id="consent-desc">Essential storage is always active. Analytics stays off unless you switch it on.</p>
      <div class="cookie-options">
        <div class="cookie-option">
          <div>
            <p class="cookie-option-label">Essential</p>
            <p class="cookie-option-text">Remembers your privacy choice.</p>
          </div>
          <span class="cookie-always">Always active</span>
        </div>
        <div class="cookie-option">
          <div>
            <p class="cookie-option-label" id="consent-analytics-label">Analytics</p>
            <p class="cookie-option-text" id="consent-analytics-text">Vercel Web Analytics counts visits and pages viewed. It sets no cookies and does not identify you.</p>
          </div>
          <button type="button" class="cookie-switch" role="switch" aria-checked="${analytics}" aria-labelledby="consent-analytics-label" aria-describedby="consent-analytics-text" data-consent="toggle"><span aria-hidden="true"></span></button>
        </div>
      </div>
      <div class="cookie-actions">
        <button type="button" class="cookie-text-button" data-consent="back">Back</button>
        <button type="button" class="btn small" data-consent="save">Save preferences</button>
      </div>`;
  }

  function open(view = "summary") {
    const saved = read();
    let analytics = saved?.analytics ?? false;
    if (!banner) {
      banner = document.createElement("section");
      banner.className = "cookie";
      banner.setAttribute("role", "dialog");
      banner.setAttribute("aria-modal", "false");
      banner.setAttribute("aria-labelledby", "consent-title");
      banner.setAttribute("aria-describedby", "consent-desc");
      document.body.append(banner);
      document.addEventListener("keydown", onKey);
    }
    const render = (current) => {
      banner.innerHTML = `<div class="cookie-inner">
        <div class="cookie-head">
          <div>
            <p class="eyebrow">Privacy controls</p>
            <h2 id="consent-title" tabindex="-1">Your privacy choices</h2>
          </div>
          ${saved ? '<button type="button" class="cookie-close" data-consent="close" aria-label="Close cookie preferences">&times;</button>' : ""}
        </div>
        ${current === "preferences" ? preferencesView(analytics) : summaryView()}
      </div>`;
    };
    render(view);
    banner.onclick = (event) => {
      const action = event.target.closest("[data-consent]")?.dataset.consent;
      if (action === "accept") save({ analytics: true });
      else if (action === "reject") save({ analytics: false });
      else if (action === "save") save({ analytics });
      else if (action === "close") close();
      else if (action === "toggle") {
        analytics = !analytics;
        event.target
          .closest("[role=switch]")
          .setAttribute("aria-checked", String(analytics));
      } else if (action === "manage" || action === "back") {
        render(action === "manage" ? "preferences" : "summary");
        banner.querySelector("#consent-title").focus();
      }
    };
    if (view === "preferences") banner.querySelector("#consent-title").focus();
  }

  function start() {
    const saved = read();
    apply(saved);
    if (!saved) open();
    document.querySelectorAll("[data-cookie-preferences]").forEach((button) => {
      button.hidden = false;
      button.addEventListener("click", () => open("preferences"));
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();
})();
