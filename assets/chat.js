// Website chat assistant (answers come from api/chat.js). The conversation is kept in this
// tab's sessionStorage only. Replies are rendered as text; only site paths, the phone number
// and email addresses become links, so nothing the model writes is ever treated as HTML.
(() => {
  const KEY = "veltra-chat";
  const GREETING =
    "Hi! I can answer questions about our websites, local SEO and AI receptionists, or arrange a call back. What can I help with?";
  const SUGGESTIONS = [
    "How much does a website cost?",
    "Can someone call me back?",
    "How does the AI receptionist work?",
  ];
  const OFFLINE =
    "Sorry, I couldn’t connect. Please check your connection, or call us on +44 7466 539736.";

  function read() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY));
      return saved && Array.isArray(saved.messages) ? saved : null;
    } catch {
      return null;
    }
  }
  const state = read() || {
    id: crypto.randomUUID(),
    messages: [],
    open: false,
  };
  const save = () => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* The chat still works for this page without storage. */
    }
  };
  let busy = false;

  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value === true ? "" : value);
    }
    node.append(...children.filter(Boolean));
    return node;
  }
  const svg = (path) => {
    const ns = "http://www.w3.org/2000/svg";
    const icon = document.createElementNS(ns, "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    const shape = document.createElementNS(ns, "path");
    shape.setAttribute("d", path);
    icon.append(shape);
    return icon;
  };

  // Site paths (after a space or bracket), emails and phone numbers become links.
  const LINKS =
    /((?<=^|[\s(])\/[a-z0-9-]+(?:\/[a-z0-9-]+)*|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|\+?\d[\d ]{8,}\d)/gi;
  function rich(text) {
    const fragment = document.createDocumentFragment();
    let last = 0;
    for (const match of text.matchAll(LINKS)) {
      const [value] = match;
      fragment.append(text.slice(last, match.index));
      const href = value.startsWith("/")
        ? value
        : value.includes("@")
          ? `mailto:${value}`
          : `tel:${value.replace(/[^\d+]/g, "")}`;
      fragment.append(el("a", { href, text: value }));
      last = match.index + value.length;
    }
    fragment.append(text.slice(last));
    return fragment;
  }

  const launcher = el(
    "button",
    {
      class: "chat-launcher",
      type: "button",
      "aria-controls": "chat-panel",
      "aria-expanded": "false",
      "aria-label": "Chat with Veltra Media",
    },
    svg("M4 5h16v10H8l-4 4V5z"),
    el("span", { class: "dock-label", text: "Chat with us" }),
  );
  const log = el("div", {
    class: "chat-log",
    role: "log",
    "aria-live": "polite",
  });
  const input = el("textarea", {
    id: "chat-input",
    rows: "1",
    maxlength: "1000",
    placeholder: "Type your message…",
    "aria-label": "Your message",
    autocomplete: "off",
  });
  const sendButton = el(
    "button",
    { class: "chat-send", type: "submit", "aria-label": "Send" },
    svg("M4 12l16-8-6 16-2-7-8-1z"),
  );
  const form = el("form", { class: "chat-form" }, input, sendButton);
  const panel = el(
    "section",
    {
      class: "chat-panel",
      id: "chat-panel",
      role: "dialog",
      "aria-labelledby": "chat-title",
      hidden: true,
    },
    el(
      "header",
      { class: "chat-head" },
      el("span", { class: "chat-mark", "aria-hidden": "true", text: "V" }),
      el(
        "div",
        {},
        el("h2", { id: "chat-title", text: "Veltra assistant" }),
        el("p", { text: "AI · answers from our website" }),
      ),
      el(
        "button",
        {
          class: "chat-close",
          type: "button",
          "aria-label": "Close chat",
          onclick: () => toggle(false),
        },
        svg("M6 6l12 12M18 6L6 18"),
      ),
    ),
    log,
    form,
    el(
      "p",
      { class: "chat-note" },
      "AI assistant: please don’t share sensitive details. ",
      el("a", { href: "/privacy", text: "Privacy" }),
    ),
  );

  function bubble(message) {
    return el(
      "div",
      { class: `chat-msg ${message.role}${message.error ? " error" : ""}` },
      rich(message.text),
    );
  }

  function render() {
    const nodes = [bubble({ role: "assistant", text: GREETING })];
    if (!state.messages.some((m) => m.role === "user"))
      nodes.push(
        el(
          "div",
          { class: "chat-suggestions" },
          ...SUGGESTIONS.map((text) =>
            el("button", { type: "button", text, onclick: () => send(text) }),
          ),
        ),
      );
    nodes.push(...state.messages.map(bubble));
    if (busy)
      nodes.push(
        el(
          "div",
          {
            class: "chat-msg assistant typing",
            "aria-label": "Assistant is typing",
          },
          el("i"),
          el("i"),
          el("i"),
        ),
      );
    log.replaceChildren(...nodes);
    log.scrollTop = log.scrollHeight;
  }

  function toggle(open, focus = true) {
    state.open = open;
    save();
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    document.documentElement.classList.toggle("chat-open", open);
    if (open) {
      render();
      if (focus) input.focus({ preventScroll: true });
    } else if (focus) launcher.focus({ preventScroll: true });
  }

  async function send(value) {
    const text = value.trim().slice(0, 1000);
    if (!text || busy) return;
    state.messages.push({ role: "user", text });
    input.value = "";
    input.style.height = "";
    busy = true;
    sendButton.disabled = true;
    save();
    render();
    let reply;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sessionId: state.id,
          page: location.pathname,
          // Only real turns go back to the model; local errors stay on screen.
          messages: state.messages.filter((m) => !m.error).slice(-20),
        }),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json().catch(() => ({}));
      reply =
        response.status === 429
          ? {
              text: "You’re sending messages quickly. Please wait a minute and try again.",
              error: true,
            }
          : {
              text: result.reply || result.message || OFFLINE,
              error: result.ok !== true,
            };
    } catch {
      reply = { text: OFFLINE, error: true };
    }
    state.messages.push({ role: "assistant", ...reply });
    state.messages = state.messages.slice(-40);
    busy = false;
    sendButton.disabled = false;
    save();
    render();
    input.focus({ preventScroll: true });
  }

  launcher.addEventListener("click", () => toggle(true));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    send(input.value);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      send(input.value);
    }
  });
  input.addEventListener("input", () => {
    input.style.height = "";
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });
  // Document-wide: a panel restored after navigation, or clicked in Safari, may not hold focus.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) toggle(false);
  });

  // Shared corner dock: the AI call button (assets/voice.js) sits above this one.
  const dock =
    document.querySelector(".assist-dock") ||
    document.body.appendChild(el("div", { class: "assist-dock" }));
  dock.append(launcher);
  document.body.append(panel);
  // Reopen after navigating, without stealing focus (which would pop up a phone keyboard).
  if (state.open) toggle(true, false);
})();
