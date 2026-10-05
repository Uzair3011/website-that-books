// A live "Website health" panel: an example of the checks a care plan runs,
// drawn in HTML rather than as a picture so its ring fills, its score counts
// up and its checks land one by one (styled under "Website health card" in
// styles.css). The figures are illustrative, not a client's. It is shown on
// the homepage services showcase and on /website-care.
import { icon } from "./site.js";

const CHECKS = [
  ["Online", "Checked every minute"],
  ["Backed up", "Tonight at 02:00"],
  ["Up to date", "Updates installed"],
];

export const healthCard = () => `<div class="health" role="img" aria-label="An example website health panel: all systems go, online, backed up, up to date, speed score 98.">
  <div class="health-head"><b>Website health</b><span class="health-pill"><i></i>All systems go</span></div>
  <div class="health-body">
    <div class="health-ring">
      <svg viewBox="0 0 120 120" focusable="false"><circle cx="60" cy="60" r="50" pathLength="100"/><circle class="health-arc" cx="60" cy="60" r="50" pathLength="100"/></svg>
      <span class="health-score"><b></b>Speed score</span>
    </div>
    <ul class="health-checks">${CHECKS.map(
      ([title, detail]) =>
        `<li><span class="health-tick">${icon("check")}</span><span><b>${title}</b><small>${detail}</small></span></li>`,
    ).join("")}</ul>
  </div>
</div>`;
