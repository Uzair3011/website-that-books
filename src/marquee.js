// ───────────────────────── Marquee tape ─────────────────────────
// A horizontal strip whose items scroll continuously and loop without a seam.
// The item list is rendered twice: the track translates by exactly one list
// width, so the second copy is already in position when the first leaves. The
// copy is hidden from assistive technology and from the accessibility tree, so
// the content is announced once. Motion is CSS-only (see .marquee in
// styles.css — namespaced .tape-* so it does not collide with the unused
// legacy .marquee block at styles.css:2134), pauses on hover, and under
// prefers-reduced-motion becomes a static, wrapping row so nothing is clipped.

/**
 * @param {string[]} items  Labels taken from existing site data. Markup is
 *   allowed, so an item can lead with an icon.
 * @param {{label: string, duration?: string, tone?: "dark" | "light" | "cards",
 *   direction?: "left" | "right", minItems?: number}} options
 *   label     - names the strip for screen readers.
 *   duration  - one full loop; longer lists need longer to read.
 *   tone      - "dark" (default) is a full-bleed dark band with a lime dot
 *               before each item. "light" sits on the page canvas in ink text
 *               and drops the dot, for items that carry their own icon.
 *               "cards" sits on the canvas too and lets each item be a block
 *               of wrapping text (the homepage reviews).
 *   direction - which way the items travel; "left" (default) or "right".
 *   minItems  - a loop only closes without a gap if one list is wider than the
 *               screen. A shorter list is repeated up to this many items; the
 *               repeats are hidden from assistive technology.
 */
export function marquee(items, { label, duration = "42s", tone = "dark", direction = "left", minItems = 0 }) {
  const count = items.length ? Math.max(items.length, minItems) : 0;
  const list = (hidden) =>
    `<ul class="tape-list"${hidden ? ' aria-hidden="true"' : ""}>${Array.from({ length: count }, (_, i) =>
      i < items.length ? `<li>${items[i]}</li>` : `<li aria-hidden="true">${items[i % items.length]}</li>`,
    ).join("")}</ul>`;
  const classes = `tape-band${tone === "dark" ? "" : ` tone-${tone}`}${direction === "right" ? " dir-right" : ""}`;
  return `      <section class="${classes}" aria-label="${label}">
        <div class="tape">
          <div class="tape-track" style="--tape-duration: ${duration}">${list(false)}${list(true)}</div>
        </div>
      </section>`;
}
