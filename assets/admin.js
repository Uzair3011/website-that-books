// Private lead dashboard. Reads leads with the admin's own Supabase session (row-level security
// only lets the lead_admin account see them) and listens for inserts, updates and deletes over
// Supabase Realtime, so new leads appear without a refresh. Lead text comes from visitors and AI
// transcripts, so it is only ever rendered with textContent, never as HTML.
(() => {
  const LIMIT = 1000;
  const SOURCES = { website: "Website", booking: "Booking", call: "Call", chat: "Chat" };
  const STATUSES = { new: "New", contacted: "Contacted", qualified: "Qualified", won: "Won", lost: "Lost" };
  const $ = (selector) => document.querySelector(selector);

  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat())
      if (child != null && child !== false) node.append(child);
    return node;
  }

  const safeUrl = (value) => {
    try {
      return new URL(value).protocol === "https:" ? value : null;
    } catch {
      return null;
    }
  };
  const telUrl = (phone) => (/^\+\d{8,15}$/.test(phone || "") ? `tel:${phone}` : null);
  const phoneLabel = (phone) =>
    /^\+44\d{10}$/.test(phone || "")
      ? `+44 ${phone.slice(3, 7)} ${phone.slice(7)}`
      : phone || "";

  const dateTime = new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const relative = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
  function ago(iso) {
    const seconds = (Date.parse(iso) - Date.now()) / 1000;
    const steps = [[60, "second"], [60, "minute"], [24, "hour"], [7, "day"], [4.35, "week"], [12, "month"], [Infinity, "year"]];
    let value = seconds;
    for (const [size, unit] of steps) {
      if (Math.abs(value) < size) return unit === "second" ? "just now" : relative.format(Math.round(value), unit);
      value /= size;
    }
  }

  const config = document.body.dataset;
  const login = $("#login");
  const app = $("#app");
  if (!config.supabaseUrl || !config.supabaseKey || !window.supabase) {
    login.hidden = false;
    $("#login-error").textContent = "The dashboard isn’t connected to the database yet.";
    $("#login-submit").disabled = true;
    return;
  }
  const db = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  });

  const state = {
    leads: new Map(),
    query: "",
    source: "all",
    status: "all",
    openId: null,
    unseen: 0,
    fresh: new Set(),
    channel: null,
    started: false,
    returnFocus: null,
  };
  const baseTitle = document.title;

  // ── Auth ────────────────────────────────────────────────────────────────
  const isAdmin = (session) => session?.user?.app_metadata?.role === "lead_admin";

  function showLogin(message = "") {
    stop();
    app.hidden = true;
    login.hidden = false;
    $("#login-error").textContent = message;
    $("#login-email").focus();
  }

  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = $("#login-submit");
    const email = $("#login-email").value.trim();
    const password = $("#login-password").value;
    if (!email || !password) {
      $("#login-error").textContent = "Enter your email and password.";
      return;
    }
    button.disabled = true;
    button.textContent = "Signing in…";
    $("#login-error").textContent = "";
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    button.disabled = false;
    button.textContent = "Sign in";
    if (error) {
      $("#login-error").textContent =
        error.status === 429
          ? "Too many attempts. Wait a few minutes and try again."
          : "Incorrect email or password.";
      return;
    }
    if (!isAdmin(data.session)) {
      await db.auth.signOut();
      $("#login-error").textContent = "This account doesn’t have dashboard access.";
      return;
    }
    $("#login-password").value = "";
    start();
  });

  $("#sign-out").addEventListener("click", async () => {
    await db.auth.signOut();
    showLogin();
  });

  db.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT" && state.started) showLogin("You’ve been signed out.");
  });

  // ── Data ────────────────────────────────────────────────────────────────
  async function load() {
    const { data, error } = await db
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(LIMIT);
    if (error) {
      if (error.code === "PGRST301" || /JWT/i.test(error.message)) return showLogin("Your session expired. Sign in again.");
      return banner("Couldn’t load leads. Check your connection; the page will retry when it reconnects.");
    }
    banner("");
    state.leads = new Map(data.map((lead) => [lead.id, lead]));
    render();
  }

  function subscribe() {
    state.channel = db
      .channel("leads-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (change) => {
        if (change.eventType === "DELETE") {
          state.leads.delete(change.old.id);
          if (state.openId === change.old.id) closeDrawer();
        } else {
          const isNew = change.eventType === "INSERT" && !state.leads.has(change.new.id);
          state.leads.set(change.new.id, change.new);
          if (isNew) announce(change.new);
          if (state.openId === change.new.id) renderDrawer();
        }
        render();
      })
      // The socket joins (SUBSCRIBED) a moment before the database listener is attached, and
      // only this message confirms changes will flow. Re-reading at that point also picks up
      // anything saved in the gap, whether on first load or after a reconnect.
      .on("system", {}, (message) => {
        if (message.extension !== "postgres_changes") return;
        if (message.status === "ok") {
          setLive("live");
          load();
        } else setLive("offline");
      })
      .subscribe((status) => {
        if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status)) setLive("offline");
      });
  }

  function start() {
    state.started = true;
    login.hidden = true;
    app.hidden = false;
    setLive("connecting");
    load();
    subscribe();
    $("#search").focus({ preventScroll: true });
  }

  function stop() {
    state.started = false;
    if (state.channel) db.removeChannel(state.channel);
    state.channel = null;
    state.leads = new Map();
    closeDrawer();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden || !state.started) return;
    state.unseen = 0;
    document.title = baseTitle;
    // Background tabs can drop the socket quietly; resync on return.
    load();
    if ($("#live").dataset.state !== "live") {
      if (state.channel) db.removeChannel(state.channel);
      subscribe();
    }
  });

  async function update(id, changes, failure) {
    const lead = state.leads.get(id);
    if (!lead) return false;
    const previous = { ...lead };
    Object.assign(lead, changes);
    render();
    if (state.openId === id) renderDrawer();
    const { error } = await db.from("leads").update(changes).eq("id", id);
    if (error) {
      state.leads.set(id, previous);
      render();
      if (state.openId === id) renderDrawer();
      toast(failure, "error");
      return false;
    }
    return true;
  }

  async function remove(id) {
    const lead = state.leads.get(id);
    if (!lead || !confirm(`Delete the lead from ${lead.name}? This can’t be undone.`)) return;
    const { error } = await db.from("leads").delete().eq("id", id);
    if (error) return toast("Couldn’t delete that lead.", "error");
    state.leads.delete(id);
    closeDrawer();
    render();
    toast("Lead deleted.");
  }

  // ── Live status, alerts and toasts ──────────────────────────────────────
  function setLive(mode) {
    const live = $("#live");
    live.dataset.state = mode;
    $("#live-label").textContent = { live: "Live", connecting: "Connecting…", offline: "Reconnecting…" }[mode];
  }

  function banner(text) {
    $("#banner").textContent = text;
    $("#banner").hidden = !text;
  }

  function toast(text, kind = "") {
    const node = el("div", { class: `toast ${kind}`, text });
    $("#toasts").append(node);
    setTimeout(() => node.remove(), 5000);
  }

  const alertsKey = "veltra-lead-alerts";
  const alertsOn = () => {
    try {
      return localStorage.getItem(alertsKey) === "on" && Notification.permission === "granted";
    } catch {
      return false;
    }
  };
  function renderAlerts() {
    const button = $("#alerts-toggle");
    const on = "Notification" in window && alertsOn();
    button.hidden = !("Notification" in window);
    button.textContent = on ? "Alerts on" : "Alerts off";
    button.setAttribute("aria-pressed", String(on));
  }
  $("#alerts-toggle").addEventListener("click", async () => {
    const enable = !alertsOn();
    if (enable && (await Notification.requestPermission()) !== "granted")
      toast("Allow notifications for this site in your browser settings.", "error");
    try {
      localStorage.setItem(alertsKey, enable ? "on" : "off");
    } catch {
      /* Alerts still work for this visit. */
    }
    renderAlerts();
  });
  renderAlerts();

  function announce(lead) {
    state.fresh.add(lead.id);
    setTimeout(() => {
      state.fresh.delete(lead.id);
      document.querySelector(`[data-id="${lead.id}"]`)?.classList.remove("fresh");
    }, 6000);
    toast(`New lead: ${lead.name} · ${SOURCES[lead.source] || lead.source}`, "new");
    if (document.hidden) {
      state.unseen += 1;
      document.title = `(${state.unseen}) ${baseTitle}`;
      if (alertsOn())
        new Notification("New lead", {
          body: `${lead.name} · ${phoneLabel(lead.phone)} · ${SOURCES[lead.source] || ""}`,
          tag: lead.id,
        });
    }
  }

  // ── Theme ───────────────────────────────────────────────────────────────
  $("#theme-toggle").addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark-mode");
    try {
      localStorage.setItem("veltra-theme", dark ? "dark" : "light");
    } catch {
      /* Theme still applies for this visit. */
    }
  });

  // ── Filters ─────────────────────────────────────────────────────────────
  const statusFilter = $("#status-filter");
  statusFilter.append(
    el("option", { value: "all", text: "All statuses" }),
    ...Object.entries(STATUSES).map(([value, text]) => el("option", { value, text })),
  );
  statusFilter.addEventListener("change", () => {
    state.status = statusFilter.value;
    render();
  });
  $("#search").addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });

  function visible() {
    const q = state.query;
    const digits = q.replace(/\D/g, "");
    return [...state.leads.values()]
      .filter((lead) => state.source === "all" || lead.source === state.source)
      .filter((lead) => state.status === "all" || lead.status === state.status)
      .filter((lead) => {
        if (!q) return true;
        const text = [lead.name, lead.email, lead.business_name, lead.service].join(" ").toLowerCase();
        const phone = (lead.phone || "").replace(/\D/g, "");
        // "07123…" should find "+447123…".
        return text.includes(q) || (digits.length >= 3 && (phone.includes(digits) || phone.includes(digits.replace(/^0/, ""))));
      })
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }

  // ── Rendering ───────────────────────────────────────────────────────────
  function statusSelect(lead, className = "status-select") {
    const select = el(
      "select",
      { class: className, "data-status": lead.status, "aria-label": `Status for ${lead.name}` },
      Object.entries(STATUSES).map(([value, text]) =>
        el("option", { value, text, selected: value === lead.status }),
      ),
    );
    select.addEventListener("click", (event) => event.stopPropagation());
    select.addEventListener("keydown", (event) => event.stopPropagation());
    select.addEventListener("change", () =>
      update(lead.id, { status: select.value }, "Couldn’t change the status."),
    );
    return select;
  }

  function sourceBadge(source) {
    return el("span", { class: `badge source-${source}`, text: SOURCES[source] || source });
  }

  function renderStats() {
    const leads = [...state.leads.values()];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const week = Date.now() - 7 * 864e5;
    $("#stat-today").textContent = leads.filter((l) => Date.parse(l.created_at) >= today.getTime()).length;
    $("#stat-week").textContent = leads.filter((l) => Date.parse(l.created_at) >= week).length;
    $("#stat-new").textContent = leads.filter((l) => l.status === "new").length;
    $("#stat-calls").textContent = leads.filter((l) => l.booked_start && Date.parse(l.booked_start) > Date.now()).length;
  }

  function renderSources() {
    const counts = { all: state.leads.size };
    for (const lead of state.leads.values()) counts[lead.source] = (counts[lead.source] || 0) + 1;
    $("#source-filter").replaceChildren(
      ...[["all", "All"], ...Object.entries(SOURCES)].map(([value, label]) =>
        el(
          "button",
          {
            type: "button",
            class: "segment",
            "aria-pressed": String(state.source === value),
            onclick: () => {
              state.source = value;
              render();
            },
          },
          label,
          el("span", { class: "count", text: String(counts[value] || 0) }),
        ),
      ),
    );
  }

  function render() {
    if (!state.started) return;
    renderStats();
    renderSources();
    const rows = visible();
    $("#rows").replaceChildren(
      ...rows.map((lead) => {
        const tel = telUrl(lead.phone);
        const row = el(
          "tr",
          {
            "data-id": lead.id,
            class: state.fresh.has(lead.id) ? "fresh" : null,
            tabindex: "0",
            "aria-label": `Open lead from ${lead.name}`,
            onclick: () => openDrawer(lead.id, row),
            onkeydown: (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDrawer(lead.id, row);
              }
            },
          },
          el("td", { class: "c-time", "data-label": "Received" },
            el("time", { datetime: lead.created_at, title: dateTime.format(new Date(lead.created_at)), text: ago(lead.created_at) })),
          el("td", { class: "c-name", "data-label": "Name" }, el("strong", { text: lead.name })),
          el("td", { class: "c-email", "data-label": "Email", text: lead.email || "—" }),
          el("td", { class: "c-phone", "data-label": "Phone" },
            tel ? el("a", { href: tel, text: phoneLabel(lead.phone), onclick: (e) => e.stopPropagation() }) : "—"),
          el("td", { class: `c-business${lead.business_name ? "" : " is-empty"}`, "data-label": "Business", text: lead.business_name || "—" }),
          el("td", { class: `c-service${lead.service ? "" : " is-empty"}`, "data-label": "Service", text: lead.service || "—" }),
          el("td", { class: "c-source", "data-label": "Source" }, sourceBadge(lead.source)),
          el("td", { class: "c-status", "data-label": "Status" }, statusSelect(lead)),
        );
        return row;
      }),
    );
    const empty = $("#empty");
    empty.hidden = rows.length > 0;
    empty.textContent = state.leads.size
      ? "No leads match these filters."
      : "No leads yet. Website enquiries, bookings, calls and chats will appear here the moment they arrive.";
    $("#footnote").textContent =
      state.leads.size >= LIMIT ? `Showing the latest ${LIMIT} leads.` : "";
  }

  // Keep "5 minutes ago" honest without re-rendering everything.
  setInterval(() => {
    document.querySelectorAll("#rows time").forEach((time) => {
      time.textContent = ago(time.getAttribute("datetime"));
    });
  }, 30000);

  // ── Lead drawer ─────────────────────────────────────────────────────────
  const drawer = $("#drawer");
  const backdrop = $("#drawer-backdrop");

  function field(label, value) {
    return el("div", { class: "field-row" }, el("dt", { text: label }), el("dd", {}, value || "—"));
  }

  function renderDrawer() {
    const lead = state.leads.get(state.openId);
    if (!lead) return closeDrawer();
    const details = lead.details || {};
    const tel = telUrl(lead.phone);
    $("#drawer-kicker").replaceChildren(
      sourceBadge(lead.source),
      el("span", { text: ` ${dateTime.format(new Date(lead.created_at))}` }),
    );
    $("#drawer-title").textContent = lead.name;

    const actions = el("div", { class: "actions" },
      tel && el("a", { class: "a-btn primary", href: tel, text: "Call" }),
      tel && el("a", { class: "a-btn", href: `https://wa.me/${lead.phone.slice(1)}`, target: "_blank", rel: "noopener noreferrer", text: "WhatsApp" }),
      lead.email && el("a", { class: "a-btn", href: `mailto:${lead.email}`, text: "Email" }),
    );

    const facts = el("dl", { class: "facts" },
      field("Email", lead.email),
      field("Phone", phoneLabel(lead.phone)),
      field("Business", lead.business_name),
      field("Service needed", lead.service),
      lead.booked_start && field("Booked call", dateTime.format(new Date(lead.booked_start))),
      details.page && field("Sent from", details.page),
    );

    const links = el("div", { class: "actions" },
      safeUrl(details.meetLink) && el("a", { class: "a-btn", href: details.meetLink, target: "_blank", rel: "noopener noreferrer", text: "Join Meet" }),
      safeUrl(details.calendarLink) && el("a", { class: "a-btn", href: details.calendarLink, target: "_blank", rel: "noopener noreferrer", text: "Calendar event" }),
      safeUrl(details.recordingUrl) && el("a", { class: "a-btn", href: details.recordingUrl, target: "_blank", rel: "noopener noreferrer", text: "Call recording" }),
    );

    const conversation = el("div", {},
      details.summary && el("section", { class: "block" }, el("h3", { text: "Summary" }), el("p", { class: "prewrap", text: details.summary })),
      details.transcript && el("details", { class: "block" }, el("summary", { text: "Transcript" }), el("p", { class: "prewrap transcript", text: details.transcript })),
      details.durationSeconds != null && el("p", { class: "muted small", text: `Call length: ${Math.floor(details.durationSeconds / 60)}m ${details.durationSeconds % 60}s` }),
    );

    const notes = el("textarea", { id: "lead-notes", maxlength: "5000", rows: "5", placeholder: "Private notes about this lead" });
    notes.value = lead.notes || "";
    const saved = el("span", { class: "muted small", role: "status" });
    const saveNotes = el("button", {
      class: "a-btn", type: "button", text: "Save notes",
      onclick: async () => {
        saved.textContent = "Saving…";
        const ok = await update(lead.id, { notes: notes.value }, "Couldn’t save your notes.");
        saved.textContent = ok ? "Saved" : "";
      },
    });

    $("#drawer-body").replaceChildren(
      actions,
      el("div", { class: "block status-block" }, el("label", { for: "drawer-status", text: "Status" }), (() => {
        const select = statusSelect(lead, "status-select large");
        select.id = "drawer-status";
        return select;
      })()),
      facts,
      links.childElementCount ? links : "",
      conversation,
      el("section", { class: "block" }, el("label", { for: "lead-notes", text: "Notes" }), notes, el("div", { class: "row" }, saveNotes, saved)),
      el("button", { class: "a-btn danger", type: "button", text: "Delete lead", onclick: () => remove(lead.id) }),
    );
  }

  function openDrawer(id, from) {
    state.openId = id;
    state.returnFocus = from || document.activeElement;
    renderDrawer();
    drawer.hidden = false;
    backdrop.hidden = false;
    document.body.classList.add("drawer-open");
    $("#drawer-close").focus();
  }

  function closeDrawer() {
    if (drawer.hidden) return;
    state.openId = null;
    drawer.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove("drawer-open");
    const target = state.returnFocus?.dataset?.id
      ? document.querySelector(`[data-id="${state.returnFocus.dataset.id}"]`)
      : state.returnFocus;
    target?.focus?.();
  }

  $("#drawer-close").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !drawer.hidden) closeDrawer();
    // Keep keyboard focus inside the open drawer.
    if (event.key === "Tab" && !drawer.hidden) {
      const focusable = [...drawer.querySelectorAll("a[href], button, select, textarea, input, summary")].filter((n) => !n.disabled);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // ── CSV export ──────────────────────────────────────────────────────────
  // Cells that a spreadsheet would run as a formula are prefixed with an apostrophe.
  const cell = (value) => {
    let text = value == null ? "" : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  $("#export").addEventListener("click", () => {
    const header = ["Received", "Name", "Email", "Phone", "Business", "Service", "Source", "Status", "Booked call", "Notes"];
    const lines = visible().map((lead) =>
      [lead.created_at, lead.name, lead.email, lead.phone, lead.business_name, lead.service,
        SOURCES[lead.source] || lead.source, STATUSES[lead.status] || lead.status, lead.booked_start, lead.notes]
        .map(cell)
        .join(","),
    );
    const blob = new Blob([`﻿${[header.map(cell).join(","), ...lines].join("\r\n")}`], { type: "text/csv;charset=utf-8" });
    const link = el("a", { href: URL.createObjectURL(blob), download: `veltra-leads-${new Date().toISOString().slice(0, 10)}.csv` });
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });

  // ── Boot ────────────────────────────────────────────────────────────────
  db.auth.getSession().then(({ data }) => {
    if (isAdmin(data.session)) start();
    else showLogin();
  });
})();
