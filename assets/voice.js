// "Talk to AI" button: an in-browser voice call with the ElevenLabs agent (see api/voice.js).
// The 1 MB voice SDK and its audio worklets are self-hosted and only loaded when a call starts,
// so the Content-Security-Policy stays script-src 'self' and normal page loads stay light.
// The site's main phone number is separate and always rings the team directly.
(() => {
  const VENDOR = "/assets/vendor/elevenlabs";
  const phone = window.VELTRA_CONFIG?.phone || "+447466539736";
  const phoneLabel = phone.replace(/^\+44(\d{4})(\d{6})$/, "+44 $1 $2");
  let conversation = null;
  let state = "idle";

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
  const PHONE_ICON =
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z";

  const launcher = el(
    "button",
    {
      class: "voice-launcher",
      type: "button",
      "aria-controls": "voice-panel",
      "aria-expanded": "false",
      "aria-label": "Talk to our AI assistant (voice call in your browser)",
    },
    svg(PHONE_ICON),
    el("span", { class: "dock-label", text: "Talk to AI" }),
  );
  const status = el("p", { class: "voice-status", role: "status", text: "" });
  const orb = el(
    "div",
    { class: "voice-orb", "aria-hidden": "true" },
    el("span"),
  );
  const action = el("button", { class: "voice-action", type: "button" });
  const panel = el(
    "section",
    {
      class: "chat-panel voice-panel",
      id: "voice-panel",
      role: "dialog",
      "aria-labelledby": "voice-title",
      hidden: true,
    },
    el(
      "header",
      { class: "chat-head" },
      el("span", { class: "chat-mark", "aria-hidden": "true", text: "V" }),
      el(
        "div",
        {},
        el("h2", { id: "voice-title", text: "AI voice assistant" }),
        el("p", { text: "Talk in your browser · uses your microphone" }),
      ),
      el(
        "button",
        {
          class: "chat-close",
          type: "button",
          "aria-label": "Close",
          onclick: () => toggle(false),
        },
        svg("M6 6l12 12M18 6L6 18"),
      ),
    ),
    el("div", { class: "voice-body" }, orb, status, action),
    el(
      "p",
      { class: "voice-human" },
      "Prefer a person? Call ",
      el("a", { href: `tel:${phone}`, text: phoneLabel }),
    ),
    el(
      "p",
      { class: "chat-note" },
      "AI assistant: the call is transcribed so we can follow up. Stay on this page while you talk. ",
      el("a", { href: "/privacy", text: "Privacy" }),
    ),
  );

  const COPY = {
    idle: [
      "Ask about websites, SEO or pricing, or arrange a call back.",
      "Start call",
    ],
    starting: ["Connecting…", "Cancel"],
    listening: ["Listening. Go ahead and talk.", "End call"],
    speaking: ["Speaking…", "End call"],
    ended: ["Call ended. Thanks for talking to us.", "Start another call"],
  };
  function set(next, message) {
    state = next;
    panel.dataset.state = next;
    status.textContent = message || COPY[next][0];
    action.textContent = COPY[next][1];
    action.classList.toggle(
      "end",
      ["starting", "listening", "speaking"].includes(next),
    );
  }

  function loadSdk() {
    if (window.ElevenLabsClient)
      return Promise.resolve(window.ElevenLabsClient);
    return new Promise((resolve, reject) => {
      const script = el("script", { src: `${VENDOR}/client.js` });
      script.onload = () => resolve(window.ElevenLabsClient);
      script.onerror = reject;
      document.head.append(script);
    });
  }

  async function start() {
    set("starting");
    try {
      // Ask for the microphone first so a refusal gets a clear message.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      return set(
        "ended",
        "Microphone access is needed for a voice call. Allow it in your browser, or use the chat instead.",
      );
    }
    try {
      const [response, sdk] = await Promise.all([
        fetch("/api/voice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: "{}",
          signal: AbortSignal.timeout(15000),
        }),
        loadSdk(),
      ]);
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.signedUrl)
        return set(
          "ended",
          result.message ||
            "We couldn’t start the call. Please try again or use the chat.",
        );
      if (state !== "starting") return; // cancelled while connecting
      conversation = await sdk.Conversation.startSession({
        signedUrl: result.signedUrl,
        connectionType: "websocket",
        workletPaths: {
          rawAudioProcessor: `${VENDOR}/rawAudioProcessor.js`,
          audioConcatProcessor: `${VENDOR}/audioConcatProcessor.js`,
        },
        libsampleratePath: `${VENDOR}/libsamplerate.worklet.js`,
        onConnect: () => set("listening"),
        onModeChange: ({ mode }) =>
          conversation && set(mode === "speaking" ? "speaking" : "listening"),
        onDisconnect: () => {
          conversation = null;
          if (state !== "ended") set("ended");
        },
        onError: () =>
          set("ended", "The call dropped. Please try again, or use the chat."),
      });
      if (state !== "starting" && state !== "listening" && state !== "speaking")
        await conversation.endSession();
    } catch {
      conversation = null;
      set(
        "ended",
        "We couldn’t start the call. Check your connection and try again, or use the chat.",
      );
    }
  }

  async function stop() {
    const active = conversation;
    conversation = null;
    set("ended");
    await active?.endSession().catch(() => {});
  }

  action.addEventListener("click", () =>
    ["idle", "ended"].includes(state) ? start() : stop(),
  );

  function toggle(open) {
    if (!open && conversation) stop();
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));
    document.documentElement.classList.toggle("voice-open", open);
    if (open) {
      if (state !== "listening" && state !== "speaking") set("idle");
      action.focus({ preventScroll: true });
    } else launcher.focus({ preventScroll: true });
  }
  launcher.addEventListener("click", () => toggle(true));
  // Document-wide: Safari does not focus a button on click, so the panel may not hold focus.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) toggle(false);
  });
  window.addEventListener("pagehide", () => conversation?.endSession());

  const dock =
    document.querySelector(".assist-dock") ||
    document.body.appendChild(el("div", { class: "assist-dock" }));
  dock.append(launcher);
  document.body.append(panel);
  set("idle");
})();
