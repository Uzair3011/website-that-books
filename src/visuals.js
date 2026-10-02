// Card visuals for the homepage: small on-brand illustrations of each outcome,
// service and page, drawn as inline SVG so they use the site's own font, stay
// sharp at any size and add almost nothing to the page weight. They are
// decorative (aria-hidden): the card heading beside each one says what it is.
// The businesses shown are illustrative, not clients.
//
// Every visual is drawn on an 800×400 canvas. Gradient and clip ids are
// prefixed with the visual's name because all of them share one page.

const C = {
  ink: "#071313",
  ink2: "#112624",
  line: "#263a38",
  lime: "#c9ff4a",
  mint: "#83e7da",
  canvas: "#f4f5ef",
  paper: "#ffffff",
  rule: "#d5d7d2",
  body: "#66706d",
  muted: "#a7b6b3",
  star: "#e8a400",
};

const svg = (name, content) =>
  `<svg class="card-visual" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" font-family="inherit">${content}</svg>`;

const text = (x, y, size, fill, value, attrs = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${attrs}>${value}</text>`;
const bold = (x, y, size, fill, value, attrs = "") =>
  text(x, y, size, fill, value, `font-weight="700" ${attrs}`);
const rect = (x, y, w, h, r, fill, attrs = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${attrs}/>`;
const bar = (x, y, w, fill = C.rule, h = 10) => rect(x, y, w, h, h / 2, fill);
const pill = (x, y, w, h, fill, label, color, size = 18) =>
  rect(x, y, w, h, h / 2, fill) +
  bold(x + w / 2, y + h / 2 + size * 0.36, size, color, label, 'text-anchor="middle"');
const outlinePill = (x, y, w, h, stroke, label, color, size = 18) =>
  rect(x, y, w, h, h / 2, "none", `stroke="${stroke}" stroke-width="2"`) +
  bold(x + w / 2, y + h / 2 + size * 0.36, size, color, label, 'text-anchor="middle"');
const tick = (x, y, fill = C.lime, stroke = C.ink) =>
  `<circle cx="${x}" cy="${y}" r="13" fill="${fill}"/><path d="m${x - 6} ${y}l4 4 8-8" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
const stars = (x, y, size = 18, count = 5) =>
  Array.from(
    { length: count },
    (_, i) =>
      `<path transform="translate(${x + i * (size + 4)} ${y}) scale(${size / 24})" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9Z" fill="${C.star}"/>`,
  ).join("");
const dots = (x, y, fill = C.rule) =>
  [0, 18, 36].map((d) => `<circle cx="${x + d}" cy="${y}" r="5" fill="${fill}"/>`).join("");

// Backgrounds: a light canvas with a lime sun, or the hero's dark panel with
// a soft mint glow.
const light = (id) => `
  <defs><radialGradient id="${id}-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.lime}" stop-opacity="0.75"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/></radialGradient></defs>
  ${rect(0, 0, 800, 400, 0, "#eef0e8")}
  <circle cx="690" cy="330" r="260" fill="url(#${id}-sun)"/>`;
const dark = (id) => `
  <defs><radialGradient id="${id}-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.mint}" stop-opacity="0.32"/><stop offset="1" stop-color="${C.mint}" stop-opacity="0"/></radialGradient></defs>
  ${rect(0, 0, 800, 400, 0, C.ink)}
  <circle cx="620" cy="60" r="300" fill="url(#${id}-glow)"/>`;

// A browser window whose bottom runs off the canvas.
const browser = (x, y, w, h, url, fill = C.paper) =>
  rect(x, y, w, h, 16, fill, `stroke="${C.rule}" stroke-width="1.5"`) +
  dots(x + 26, y + 24) +
  rect(x + 90, y + 13, Math.min(260, w - 120), 22, 11, C.canvas) +
  text(x + 106, y + 29, 13, C.muted, url) +
  `<path d="M${x} ${y + 48}H${x + w}" stroke="${C.rule}" stroke-width="1.5"/>`;

// ───────────────────────── Outcomes ─────────────────────────
const credible = svg(
  "credible",
  `${light("cr")}
  ${browser(70, 46, 560, 380, "teessideelectrical.co.uk")}
  ${rect(70, 94, 560, 306, 0, C.ink)}
  ${bold(104, 136, 18, C.paper, 'Teesside <tspan fill="' + C.lime + '">Electrical</tspan>')}
  ${pill(470, 116, 130, 34, C.lime, "Get a quote", C.ink, 15)}
  ${bold(104, 186, 13, C.lime, "NICEIC APPROVED · 24/7 CALLOUTS", 'letter-spacing="2"')}
  ${bold(104, 232, 38, C.paper, "Electricians you", 'letter-spacing="-1.5"')}
  ${bold(104, 276, 38, C.paper, "can trust.", 'letter-spacing="-1.5"')}
  ${pill(104, 306, 180, 46, C.lime, "Call 01642 000 000", C.ink, 15)}
  ${outlinePill(298, 306, 130, 46, C.paper, "Our work", C.paper, 15)}
  <g filter="drop-shadow(0 18px 30px rgba(7,19,19,.18))">${rect(520, 214, 230, 128, 20, C.paper)}</g>
  ${stars(544, 236, 22)}
  ${bold(544, 298, 40, C.ink, "4.9", 'letter-spacing="-1.5"')}
  ${text(612, 290, 15, C.body, "Google")}
  ${text(612, 310, 15, C.body, "reviews")}`,
);

const local = svg(
  "local",
  `${light("lo")}
  <g stroke="#dcdfd6" stroke-width="10" stroke-linecap="round" fill="none">
    <path d="M-20 300C120 280 220 330 330 250S560 200 820 240"/><path d="M180 -20C210 120 260 200 250 420"/><path d="M520 -20C500 120 560 260 540 420"/>
  </g>
  <path d="M-20 360C140 330 260 380 400 330S640 300 820 330" stroke="${C.mint}" stroke-width="22" fill="none" stroke-linecap="round" opacity="0.8"/>
  ${[[250, 120], [600, 300], [690, 150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${C.paper}" stroke="${C.muted}" stroke-width="4"/>`).join("")}
  <g filter="drop-shadow(0 14px 24px rgba(7,19,19,.16))">${rect(60, 34, 680, 64, 32, C.paper)}</g>
  <circle cx="104" cy="66" r="12" fill="none" stroke="${C.ink}" stroke-width="3.5"/><path d="m113 75 10 10" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>
  ${text(140, 74, 22, C.ink, "electrician near me")}
  <circle cx="470" cy="210" r="70" fill="${C.lime}" opacity="0.35"/>
  <path d="M470 236s34-30 34-56a34 34 0 1 0-68 0c0 26 34 56 34 56Z" fill="${C.ink}"/><circle cx="470" cy="180" r="12" fill="${C.lime}"/>
  <g filter="drop-shadow(0 18px 30px rgba(7,19,19,.18))">${rect(60, 150, 330, 190, 22, C.paper)}</g>
  ${pill(84, 172, 46, 30, C.lime, "1st", C.ink, 14)}
  ${bold(84, 236, 26, C.ink, "Teesside Electrical", 'letter-spacing="-.8"')}
  ${stars(84, 252, 18)}
  ${text(206, 268, 16, C.body, "4.9 · 1.2 mi")}
  ${bold(84, 300, 16, "#1d8a5a", "Open now")}
  ${pill(240, 280, 126, 38, C.ink, "Call", C.paper, 15)}`,
);

const enquire = svg(
  "enquire",
  `${light("en")}
  <g filter="drop-shadow(0 22px 34px rgba(7,19,19,.22))">${rect(110, 40, 250, 400, 40, C.ink)}</g>
  ${rect(124, 54, 222, 380, 30, C.paper)}
  ${rect(196, 66, 78, 18, 9, C.ink)}
  ${bold(148, 126, 14, C.body, "TEESSIDE ELECTRICAL", 'letter-spacing="1.5"')}
  ${bold(148, 170, 26, C.ink, "Need an", 'letter-spacing="-1"')}
  ${bold(148, 202, 26, C.ink, "electrician", 'letter-spacing="-1"')}
  ${bold(148, 234, 26, C.ink, "today?", 'letter-spacing="-1"')}
  ${pill(148, 262, 174, 50, C.lime, "Call now", C.ink, 17)}
  ${outlinePill(148, 324, 174, 50, C.ink, "Request a quote", C.ink, 15)}
  <g filter="drop-shadow(0 18px 30px rgba(7,19,19,.18))">${rect(400, 120, 330, 150, 22, C.paper)}</g>
  <circle cx="440" cy="166" r="22" fill="${C.lime}"/>
  <path d="M431 166h18m-7-7 7 7-7 7" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${bold(478, 160, 20, C.ink, "New enquiry")}
  ${text(478, 184, 15, C.body, "just now")}
  ${bar(424, 214, 260, C.canvas, 14)}
  ${bar(424, 238, 180, C.canvas, 14)}
  ${bold(430, 226, 13, C.ink, "Sarah · Rewire quote · Stockton")}`,
);

// ───────────────────────── Services ─────────────────────────
const webDesign = svg(
  "web",
  `${dark("wd")}
  ${browser(60, 48, 520, 380, "northsideroofline.co.uk")}
  ${bold(92, 138, 15, C.ink, "Northside Roofline")}
  ${pill(440, 118, 110, 30, C.lime, "Get a quote", C.ink, 13)}
  ${bold(92, 196, 34, C.ink, "Roofs repaired,", 'letter-spacing="-1.4"')}
  ${bold(92, 236, 34, C.ink, "properly.", 'letter-spacing="-1.4"')}
  ${bar(92, 260, 230)}${bar(92, 280, 180)}
  ${pill(92, 306, 150, 44, C.ink, "Book a survey", C.paper, 14)}
  <defs><linearGradient id="wd-img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.mint}"/><stop offset="1" stop-color="#3fae9f"/></linearGradient></defs>
  ${rect(360, 170, 190, 190, 16, "url(#wd-img)")}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.4))">${rect(540, 90, 190, 340, 34, C.ink2)}</g>
  ${rect(552, 102, 166, 318, 26, C.paper)}
  ${bold(572, 146, 13, C.ink, "Northside Roofline")}
  ${bold(572, 190, 22, C.ink, "Roofs repaired,", 'letter-spacing="-.8"')}
  ${bold(572, 216, 22, C.ink, "properly.", 'letter-spacing="-.8"')}
  ${rect(572, 236, 126, 70, 12, "url(#wd-img)")}
  ${pill(572, 320, 126, 40, C.lime, "Call now", C.ink, 14)}`,
);

const localSeo = svg(
  "seo",
  `${dark("ls")}
  <g opacity="0.55" stroke="${C.line}" stroke-width="8" fill="none" stroke-linecap="round">
    <path d="M420 -20C460 120 430 260 480 420"/><path d="M380 180C500 160 620 200 820 170"/><path d="M560 -20C600 140 700 240 690 420"/>
  </g>
  <circle cx="600" cy="200" r="110" fill="${C.mint}" opacity="0.14"/>
  <circle cx="600" cy="200" r="60" fill="${C.mint}" opacity="0.18"/>
  <path d="M600 226s32-28 32-52a32 32 0 1 0-64 0c0 24 32 52 32 52Z" fill="${C.lime}"/><circle cx="600" cy="174" r="11" fill="${C.ink}"/>
  ${text(560, 300, 15, C.muted, "Service area · 20 miles")}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.35))">${rect(56, 50, 380, 310, 24, C.paper)}</g>
  ${bold(84, 104, 28, C.ink, "Ashfield Joinery", 'letter-spacing="-1"')}
  ${stars(84, 122, 20)}
  ${text(208, 140, 16, C.body, "4.9 (86 reviews)")}
  ${text(84, 180, 16, C.body, "Joiner · Middlesbrough")}
  ${bold(84, 212, 16, "#1d8a5a", "Open")}
  ${text(130, 212, 16, C.body, "· Closes 5pm")}
  <path d="M84 240H408" stroke="${C.rule}" stroke-width="1.5"/>
  ${pill(84, 262, 96, 40, C.mint, "Call", C.ink, 15)}
  ${pill(192, 262, 110, 40, C.canvas, "Website", C.ink, 15)}
  ${pill(314, 262, 96, 40, C.canvas, "Route", C.ink, 15)}
  ${bar(84, 326, 200, C.canvas, 12)}`,
);

const landing = svg(
  "landing",
  `${dark("lp")}
  ${browser(60, 48, 470, 380, "/free-roof-survey")}
  ${pill(92, 84 + 34, 150, 28, C.lime, "FREE THIS MONTH", C.ink, 12)}
  ${bold(92, 196, 32, C.ink, "Book a free", 'letter-spacing="-1.3"')}
  ${bold(92, 234, 32, C.ink, "roof survey.", 'letter-spacing="-1.3"')}
  ${rect(92, 258, 200, 36, 10, C.canvas)}${text(106, 282, 14, C.muted, "Your name")}
  ${rect(92, 302, 200, 36, 10, C.canvas)}${text(106, 326, 14, C.muted, "Phone number")}
  ${pill(92, 348, 200, 42, C.ink, "Book my survey", C.paper, 14)}
  ${[0, 1, 2].map((i) => tick(330, 280 + i * 40, C.mint) + bar(354, 274 + i * 40, 120 - i * 20, C.rule, 12)).join("")}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.4))">${rect(480, 92, 260, 220, 22, C.ink2, `stroke="${C.line}" stroke-width="1.5"`)}</g>
  ${text(506, 134, 15, C.muted, "Enquiries this month")}
  ${bold(506, 186, 48, C.paper, "42", 'letter-spacing="-2"')}
  ${pill(590, 156, 82, 30, C.lime, "↑ 38%", C.ink, 14)}
  ${[40, 58, 50, 76, 70, 98, 120].map((h, i) => rect(506 + i * 30, 290 - h, 20, h, 6, i === 6 ? C.lime : C.line)).join("")}`,
);

const aiReception = svg(
  "ai",
  `${dark("ai")}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.4))">${rect(60, 40, 420, 380, 24, C.paper)}</g>
  <circle cx="98" cy="82" r="20" fill="${C.ink}"/>${bold(98, 89, 18, C.lime, "V", 'text-anchor="middle"')}
  ${bold(130, 78, 17, C.ink, "Website chat")}
  ${text(130, 98, 13, "#1d8a5a", "● Online now")}
  <path d="M60 120H480" stroke="${C.rule}" stroke-width="1.5"/>
  ${rect(232, 140, 224, 50, 20, C.ink)}${text(252, 171, 16, C.paper, "Do you cover Stockton?")}
  ${rect(84, 206, 300, 74, 20, C.mint)}
  ${text(104, 236, 16, C.ink, "Yes, we cover Stockton and")}
  ${text(104, 260, 16, C.ink, "all of Teesside. Book a visit?")}
  ${pill(84, 296, 136, 38, C.canvas, "Book a visit", C.ink, 14)}
  ${pill(230, 296, 120, 38, C.canvas, "Get a quote", C.ink, 14)}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.4))">${rect(470, 150, 270, 150, 22, C.ink2, `stroke="${C.line}" stroke-width="1.5"`)}</g>
  <circle cx="512" cy="196" r="22" fill="${C.lime}"/>
  <path d="M504 188h3l2 5-2 2a10 10 0 0 0 5 5l2-2 5 2v3a1 1 0 0 1-1 1 14 14 0 0 1-14-14 1 1 0 0 1 1-1Z" fill="${C.ink}"/>
  ${bold(546, 190, 17, C.paper, "Incoming call")}
  ${text(546, 212, 14, C.muted, "AI receptionist answering")}
  ${[14, 30, 22, 40, 26, 34, 18, 28, 12, 24, 36, 20].map((h, i) => rect(494 + i * 18, 262 - h / 2, 8, h, 4, i < 7 ? C.lime : C.line)).join("")}`,
);

const booking = svg(
  "booking",
  `${dark("bk")}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.4))">${rect(60, 40, 420, 380, 24, C.paper)}</g>
  ${bold(90, 92, 22, C.ink, "Choose a time", 'letter-spacing="-.6"')}
  ${text(90, 116, 14, C.body, "Live availability · 30 minutes")}
  ${["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => {
    const x = 90 + i * 74;
    const on = i === 3;
    return rect(x, 138, 62, 66, 14, on ? C.ink : C.canvas) + text(x + 31, 162, 13, on ? C.muted : C.body, d, 'text-anchor="middle"') + bold(x + 31, 190, 20, on ? C.paper : C.ink, String(20 + i), 'text-anchor="middle"');
  }).join("")}
  ${["09:30", "11:00", "14:30", "16:00"].map((t, i) => {
    const x = 90 + (i % 2) * 178;
    const y = 224 + Math.floor(i / 2) * 58;
    return i === 2 ? pill(x, y, 162, 46, C.lime, t, C.ink, 16) : outlinePill(x, y, 162, 46, C.rule, t, C.ink, 16);
  }).join("")}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.4))">${rect(470, 110, 270, 110, 22, C.ink2, `stroke="${C.line}" stroke-width="1.5"`)}</g>
  ${tick(512, 152)}
  ${bold(540, 158, 18, C.paper, "Booked")}
  ${text(496, 196, 15, C.muted, "Thursday 23rd · 14:30")}
  ${rect(500, 250, 240, 76, 20, C.mint)}
  ${bold(522, 280, 14, C.ink, "Reminder sent")}
  ${text(522, 306, 14, C.ink, "See you tomorrow at 14:30")}`,
);

const care = svg(
  "care",
  `${dark("ca")}
  <g filter="drop-shadow(0 22px 34px rgba(0,0,0,.4))">${rect(60, 40, 680, 380, 24, C.ink2, `stroke="${C.line}" stroke-width="1.5"`)}</g>
  ${bold(92, 92, 22, C.paper, "Website health", 'letter-spacing="-.6"')}
  ${pill(560, 66, 150, 36, C.lime, "All systems go", C.ink, 14)}
  ${[["Online", "Checked every minute"], ["Backed up", "Tonight at 02:00"], ["Up to date", "Updates installed"]]
    .map(([a, b], i) => {
      const y = 140 + i * 74;
      return rect(92, y, 330, 60, 16, C.ink) + tick(124, y + 30) + bold(150, y + 27, 17, C.paper, a) + text(150, y + 47, 13, C.muted, b);
    })
    .join("")}
  <circle cx="580" cy="250" r="86" fill="none" stroke="${C.line}" stroke-width="20"/>
  <circle cx="580" cy="250" r="86" fill="none" stroke="${C.lime}" stroke-width="20" stroke-linecap="round" stroke-dasharray="530 600" transform="rotate(-90 580 250)"/>
  ${bold(580, 262, 46, C.paper, "98", 'text-anchor="middle" letter-spacing="-2"')}
  ${text(580, 290, 14, C.muted, "Speed score", 'text-anchor="middle"')}`,
);

// ───────────────────────── Explore ─────────────────────────
const miniSite = (x, y, w, h, hero, accent, rot) => `
  <g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})" filter="drop-shadow(0 18px 28px rgba(7,19,19,.2))">
    ${rect(x, y, w, h, 16, C.paper, `stroke="${C.rule}" stroke-width="1.5"`)}
    ${dots(x + 22, y + 20)}
    ${rect(x, y + 40, w, h * 0.5, 0, hero)}
    ${bar(x + 22, y + 72, w * 0.55, hero === C.ink ? C.paper : C.ink, 14)}
    ${bar(x + 22, y + 96, w * 0.4, hero === C.ink ? C.paper : C.ink, 14)}
    ${pill(x + 22, y + 124, 96, 30, accent, "", C.ink)}
    ${bar(x + 22, y + h * 0.5 + 66, w * 0.7)}${bar(x + 22, y + h * 0.5 + 86, w * 0.5)}
  </g>`;
const work = svg(
  "work",
  `${light("wk")}
  ${miniSite(70, 90, 290, 300, C.mint, C.ink, -6)}
  ${miniSite(440, 90, 290, 300, C.lime, C.ink, 6)}
  ${miniSite(255, 50, 290, 330, C.ink, C.lime, 0)}`,
);

const process = svg(
  "process",
  `${light("pr")}
  <path d="M130 170H670" stroke="${C.ink}" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round"/>
  ${["Plan", "Design", "Build", "Launch"]
    .map((step, i) => {
      const x = 130 + i * 180;
      const done = i < 3;
      return `<circle cx="${x}" cy="170" r="34" fill="${done ? C.ink : C.lime}"/>${
        done
          ? `<path d="m${x - 11} 170 7 7 15-15" fill="none" stroke="${C.lime}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
          : `<path d="M${x - 12} 170h22m-8-8 8 8-8 8" fill="none" stroke="${C.ink}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`
      }${bold(x, 108, 14, C.body, `STEP ${i + 1}`, 'text-anchor="middle" letter-spacing="2"')}
      <g filter="drop-shadow(0 14px 22px rgba(7,19,19,.12))">${rect(x - 76, 232, 152, 110, 18, C.paper)}</g>
      ${bold(x, 270, 20, C.ink, step, 'text-anchor="middle"')}${bar(x - 50, 292, 100)}${bar(x - 36, 312, 72)}`;
    })
    .join("")}`,
);

const about = svg(
  "about",
  `${light("ab")}
  <path d="M-20 330C120 300 200 210 300 170C380 140 430 200 500 170C570 140 620 150 700 120S800 60 820 40" stroke="${C.mint}" stroke-width="26" fill="none" stroke-linecap="round"/>
  ${[
    [150, 120, "Stockton"],
    [300, 280, "Middlesbrough", true],
    [520, 110, "Billingham"],
    [610, 250, "Redcar"],
    [660, 60, "Hartlepool"],
  ]
    .map(([x, y, name, home]) =>
      home
        ? `<g filter="drop-shadow(0 16px 24px rgba(7,19,19,.22))">${rect(x - 112, y - 48, 224, 64, 32, C.ink)}</g><circle cx="${x - 78}" cy="${y - 16}" r="16" fill="${C.lime}"/>${bold(x - 52, y - 9, 20, C.paper, name)}`
        : `<circle cx="${x}" cy="${y}" r="10" fill="${C.ink}"/><circle cx="${x}" cy="${y}" r="20" fill="${C.ink}" opacity="0.12"/>${bold(x + 18, y + 6, 17, C.ink, name)}`,
    )
    .join("")}`,
);

export const VISUALS = {
  "outcome-credible": credible,
  "outcome-local": local,
  "outcome-enquire": enquire,
  "service-web-design": webDesign,
  "service-local-seo": localSeo,
  "service-landing-pages": landing,
  "service-ai-reception": aiReception,
  "service-booking": booking,
  "service-website-care": care,
  "explore-work": work,
  "explore-process": process,
  "explore-about": about,
};
