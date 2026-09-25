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
 * @param {{label: string, duration?: string, tone?: "dark" | "light"}} options
 *   label    - names the strip for screen readers.
 *   duration - one full loop; longer lists need longer to read.
 *   tone     - "dark" (default) is a full-bleed dark band with a lime dot
 *              before each item. "light" sits on the page canvas in ink text
 *              and drops the dot, for items that carry their own icon.
 */
export function marquee(items, { label, duration = "42s", tone = "dark" }) {
  const list = (hidden) =>
    `<ul class="tape-list"${hidden ? ' aria-hidden="true"' : ""}>${items
      .map((item) => `<li>${item}</li>`)
      .join("")}</ul>`;
  return `      <section class="tape-band${tone === "light" ? " tone-light" : ""}" aria-label="${label}">
        <div class="tape">
          <div class="tape-track" style="--tape-duration: ${duration}">${list(false)}${list(true)}</div>
        </div>
      </section>`;
}
