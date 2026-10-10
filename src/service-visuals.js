// Illustrations for the five service sales pages, drawn as inline SVG with the
// same pieces as the homepage visuals (src/visuals.js) so they share the site
// font and palette. The businesses, names and figures inside them are
// illustrative mock-ups, not client data; the copy beside each one carries the
// claim. Replace a proof visual with a real client screenshot when one exists.
//
// Gradient and clip ids are prefixed per visual because several share a page.

import { C, text, bold, rect, bar, pill, outlinePill, tick, stars, dots, browser } from "./visuals.js";

const art = (w, h, label, content) =>
  `<svg class="sp-art" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" font-family="inherit">${content}</svg>`;
const shadow = (inner, s = "0 22px 34px rgba(7,19,19,.18)") =>
  `<g filter="drop-shadow(${s})">${inner}</g>`;
const note = (x, y, value, attrs = "") =>
  text(x, y, 24, C.ink, value, `font-style="italic" font-weight="600" ${attrs}`);
const curve = (d, stroke = C.ink) =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/>`;
const sun = (id, cx, cy, r) =>
  `<defs><radialGradient id="${id}-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.lime}" stop-opacity="0.7"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-sun)"/>`;

// A phone whose screen starts 12px in from its frame.
const phone = (x, y, w, h, screen = C.paper) =>
  shadow(rect(x, y, w, h, 46, C.ink), "0 26px 40px rgba(7,19,19,.28)") +
  rect(x + 12, y + 12, w - 24, h - 24, 36, screen) +
  rect(x + w / 2 - 44, y + 24, 88, 22, 11, C.ink);

// ───────────────────────── Website design ─────────────────────────
const siteElectrician = art(
  800,
  400,
  "Mock-up of an electrician's website: a dark homepage with one headline, a Get a Free Quote button and a photo panel.",
  `<defs><linearGradient id="se-img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.mint}"/><stop offset="1" stop-color="${C.ink2}"/></linearGradient></defs>
  ${rect(0, 0, 800, 400, 0, C.ink)}
  ${bold(36, 46, 17, C.paper, 'Teesside <tspan fill="' + C.lime + '">Electrical</tspan>')}
  ${["Services", "Areas", "Reviews"].map((t, i) => text(400 + i * 86, 46, 14, C.muted, t)).join("")}
  ${pill(660, 24, 110, 32, C.lime, "Get a quote", C.ink, 13)}
  ${bold(36, 108, 12, C.lime, "NICEIC APPROVED · 24/7 CALLOUTS", 'letter-spacing="2"')}
  ${bold(36, 150, 32, C.paper, "Reliable electricians", 'letter-spacing="-1.2"')}
  ${bold(36, 190, 32, C.paper, "for homes &amp; businesses", 'letter-spacing="-1.2"')}
  ${bold(36, 230, 32, C.paper, "across Teesside.", 'letter-spacing="-1.2"')}
  ${bar(36, 252, 280, C.line)}${bar(36, 270, 210, C.line)}
  ${pill(36, 300, 165, 44, C.lime, "Get a Free Quote", C.ink, 14)}
  ${outlinePill(213, 300, 125, 44, C.paper, "Our services", C.paper, 14)}
  ${rect(480, 84, 284, 266, 18, "url(#se-img)")}
  <path d="M620 137 580 227h34l-12 70 52-96h-36l18-64Z" fill="${C.lime}"/>`,
);

const siteJoinery = art(
  800,
  400,
  "Mock-up of a joinery firm's website: a light homepage with one headline, a Get a Free Quote button and a timber photo panel.",
  `<defs><linearGradient id="sj-img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8b48a"/><stop offset="1" stop-color="#7c5235"/></linearGradient></defs>
  ${rect(0, 0, 800, 400, 0, C.paper)}
  ${bold(36, 44, 17, C.ink, "OAK &amp; GRAIN", 'letter-spacing="2"')}
  ${text(36, 63, 10, C.body, "JOINERY", 'letter-spacing="4"')}
  ${["Kitchens", "Staircases", "Our work"].map((t, i) => text(390 + i * 90, 46, 14, C.body, t)).join("")}
  ${pill(660, 24, 110, 32, C.ink, "Get a quote", C.paper, 13)}
  <path d="M0 84H800" stroke="${C.rule}" stroke-width="1.5"/>
  ${bold(36, 146, 32, C.ink, "Bespoke joinery", 'letter-spacing="-1.2"')}
  ${bold(36, 186, 32, C.ink, "for modern living", 'letter-spacing="-1.2"')}
  ${bold(36, 226, 32, C.ink, "in Teesside.", 'letter-spacing="-1.2"')}
  ${bar(36, 250, 270)}${bar(36, 268, 200)}
  ${pill(36, 300, 160, 44, C.lime, "Get a Free Quote", C.ink, 14)}
  ${outlinePill(208, 300, 116, 44, C.ink, "Our work", C.ink, 14)}
  ${rect(450, 104, 314, 254, 18, "url(#sj-img)")}
  ${[0, 1, 2, 3].map((i) => `<path d="M450 ${150 + i * 50}H764" stroke="#5e3d27" stroke-width="2" opacity=".35"/>`).join("")}
  ${shadow(rect(476, 316, 190, 66, 14, C.paper))}
  ${stars(494, 330, 14)}${text(494, 370, 12, C.body, "Fitted in Stockton")}`,
);

const oldVsNew = art(
  900,
  780,
  "An outdated website with a wall of text and a long contact form, next to a clear mobile site with a big Call Now button.",
  `${sun("ov", 620, 430, 270)}
  <g transform="rotate(-3 300 330)">
    ${shadow(rect(30, 110, 560, 440, 10, "#ecece6", `stroke="${C.rule}" stroke-width="2"`), "0 16px 26px rgba(7,19,19,.12)")}
    ${rect(30, 110, 560, 48, 0, "#c9cbc4")}
    ${text(52, 141, 15, "#5d625f", "Welcome to Smith &amp; Sons Plumbing Ltd — Est. 1998", 'font-family="Times New Roman, serif"')}
    ${["Home", "About Us", "Our Mission", "Services", "Gallery", "News", "Links"].map((t, i) => text(52 + i * 72, 184, 12, "#5a6fb0", t, 'text-decoration="underline"')).join("")}
    ${Array.from({ length: 11 }, (_, i) => bar(52, 210 + i * 22, i % 3 === 2 ? 200 : 300, "#cfd1ca", 9)).join("")}
    ${rect(380, 206, 186, 318, 4, "#f7f7f3", `stroke="#bfc1ba" stroke-width="1.5"`)}
    ${text(394, 230, 13, "#5d625f", "Contact Form", 'font-weight="700"')}
    ${Array.from({ length: 9 }, (_, i) => rect(394, 244 + i * 28, 158, 18, 2, C.paper, `stroke="#c9cbc4"`)).join("")}
    ${rect(394, 500, 70, 18, 2, "#d9dad3", `stroke="#b4b6ae"`)}${text(404, 513, 10, "#5d625f", "Submit")}
    ${Array.from({ length: 6 }, (_, i) => bar(52, 464 + i * 14, 290, "#dcded7", 7)).join("")}
  </g>
  ${note(40, 72, "Confusing. Outdated.")}
  ${curve("M150 82c10 22 6 34-6 46m6-46c-8 4-12 10-12 16")}
  ${phone(560, 150, 300, 556)}
  ${bold(596, 214, 13, C.ink, "Teesside Plumbing")}
  ${rect(800, 198, 26, 20, 5, C.canvas)}
  <defs><linearGradient id="ov-img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.mint}"/><stop offset="1" stop-color="#3fae9f"/></linearGradient></defs>
  ${bold(596, 266, 25, C.ink, "Plumbing services", 'letter-spacing="-1"')}
  ${bold(596, 296, 25, C.ink, "you can rely on.", 'letter-spacing="-1"')}
  ${["Boiler repairs", "Leaks fixed fast", "Same-day callouts"].map((t, i) => tick(608, 330 + i * 32, C.lime) + text(630, 336 + i * 32, 14, C.ink, t)).join("")}
  ${rect(596, 424, 228, 110, 16, "url(#ov-img)")}
  ${pill(596, 552, 228, 52, C.lime, "Call Now", C.ink, 17)}
  ${outlinePill(596, 616, 228, 46, C.ink, "Get a Free Quote", C.ink, 14)}
  ${note(630, 110, "Clear. Gets you calls.")}
  ${curve("M760 120c18 14 22 26 14 44m0 0c-2-8-8-12-14-14")}`,
);

// ───────────────────────── Local SEO ─────────────────────────
const mapPack = art(
  900,
  780,
  "A phone showing a Google Maps search for an emergency plumber: three businesses on the map, and yours not among them.",
  `${sun("mp", 450, 380, 340)}
  ${phone(285, 10, 330, 700)}
  ${rect(313, 62, 274, 42, 21, C.canvas)}
  <circle cx="338" cy="82" r="8" fill="none" stroke="${C.ink}" stroke-width="2.5"/><path d="m344 88 6 6" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
  ${text(360, 88, 15, C.ink, "emergency plumber")}
  ${rect(297, 118, 306, 226, 0, "#e5eae2")}
  <g stroke="${C.paper}" stroke-width="10" fill="none" stroke-linecap="round"><path d="M297 200C380 180 450 240 603 210"/><path d="M400 118C420 200 380 280 410 344"/><path d="M520 118C500 220 560 280 540 344"/></g>
  <path d="M297 300C380 290 470 320 603 296" stroke="${C.mint}" stroke-width="16" fill="none"/>
  ${[[360, 180, "A"], [470, 250, "B"], [550, 166, "C"]].map(([x, y, l]) => `<path d="M${x} ${y + 24}s-18-16-18-30a18 18 0 1 1 36 0c0 14-18 30-18 30Z" fill="${C.ink}"/>` + bold(x, y, 14, C.lime, l, 'text-anchor="middle"')).join("")}
  ${[["A", "Fast Fix Plumbing"], ["B", "Tees Valley Heating"], ["C", "1st Call Plumbers"]].map(([l, n], i) => {
    const y = 362 + i * 72;
    return rect(313, y, 274, 60, 14, C.paper, `stroke="${C.rule}" stroke-width="1.5"`) +
      `<circle cx="340" cy="${y + 30}" r="14" fill="${C.ink}"/>` + bold(340, y + 35, 13, C.lime, l, 'text-anchor="middle"') +
      bold(366, y + 26, 15, C.ink, n) + stars(366, y + 34, 13);
  }).join("")}
  ${rect(313, 584, 274, 64, 14, "none", `stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 6"`)}
  ${bold(340, 612, 15, C.muted, "Your business")}
  ${text(340, 634, 13, C.muted, "Not in the top 3")}
  ${note(30, 230, "Only three")}
  ${note(30, 262, "businesses show.")}
  ${curve("M200 276c40 20 70 10 90-30m0 0c-10 2-16 8-18 14")}
  ${shadow(rect(650, 560, 230, 96, 20, C.ink))}
  ${bold(674, 598, 16, C.paper, "20 years' experience")}
  ${text(674, 626, 14, C.muted, "and still not shown.")}`,
);

const gbpInsights = art(
  1280,
  780,
  "Mock-up of Google Business Profile results: calls from Google Maps, zero ad spend, and a climb from page 3 of Google to number 1 in the Map Pack.",
  `${shadow(rect(20, 20, 780, 740, 24, C.paper, `stroke="${C.rule}" stroke-width="1.5"`), "0 18px 30px rgba(7,19,19,.1)")}
  ${bold(60, 86, 24, C.ink, "Business Profile performance", 'letter-spacing="-.6"')}
  ${text(60, 116, 16, C.body, "Last month")}
  ${rect(60, 146, 340, 190, 18, C.canvas)}
  ${text(88, 188, 16, C.body, "Calls from Google Maps")}
  ${bold(88, 290, 84, C.ink, "45", 'letter-spacing="-3"')}
  ${pill(214, 248, 120, 36, C.lime, "↑ Map Pack", C.ink, 14)}
  ${rect(420, 146, 340, 190, 18, C.canvas)}
  ${text(448, 188, 16, C.body, "Ad spend")}
  ${bold(448, 290, 84, C.ink, "£0", 'letter-spacing="-3"')}
  ${bold(60, 392, 17, C.ink, "Calls and direction requests")}
  <circle cx="68" cy="424" r="6" fill="${C.ink}"/>${text(82, 430, 14, C.body, "Calls")}
  <circle cx="148" cy="424" r="6" fill="#3fae9f"/>${text(162, 430, 14, C.body, "Direction requests")}
  ${[0, 1, 2, 3].map((i) => `<path d="M60 ${470 + i * 70}H760" stroke="${C.rule}" stroke-width="1.5"/>`).join("")}
  <path d="M60 690C160 684 220 676 300 650S440 560 520 540 660 470 760 456" fill="none" stroke="#3fae9f" stroke-width="4"/>
  <path d="M60 700C150 698 230 690 300 672S430 600 520 560 660 480 760 440L760 700Z" fill="${C.lime}" opacity=".35"/>
  <path d="M60 700C150 698 230 690 300 672S430 600 520 560 660 480 760 440" fill="none" stroke="${C.ink}" stroke-width="4"/>
  ${shadow(rect(840, 20, 420, 740, 24, C.ink), "0 18px 30px rgba(7,19,19,.18)")}
  ${text(876, 82, 16, C.muted, "Google Maps search")}
  ${bold(876, 126, 26, C.paper, "“emergency plumber", 'letter-spacing="-.6"')}
  ${bold(876, 160, 26, C.paper, "middlesbrough”", 'letter-spacing="-.6"')}
  <circle cx="1050" cy="318" r="104" fill="${C.lime}" opacity=".16"/>
  <circle cx="1050" cy="318" r="80" fill="${C.lime}"/>
  ${bold(1050, 344, 72, C.ink, "#1", 'text-anchor="middle" letter-spacing="-3"')}
  ${text(1050, 446, 18, C.muted, "Map Pack spot", 'text-anchor="middle"')}
  ${rect(876, 500, 348, 96, 18, C.ink2)}
  ${text(904, 536, 14, C.muted, "Before")}
  ${bold(904, 572, 22, C.paper, "Page 3 of Google")}
  ${rect(876, 616, 348, 96, 18, C.lime)}
  ${text(904, 652, 14, C.ink, "After")}
  ${bold(904, 688, 22, C.ink, "#1 in the Map Pack")}`,
);

// ───────────────────────── Landing pages ─────────────────────────
const homepageClutter = (x, y, w, url) =>
  browser(x, y, w, 470, url) +
  bold(x + 24, y + 86, 15, C.ink, "Smith Building Services") +
  ["Home", "About Us", "Mission", "Services", "Blog", "News", "Careers", "Contact"].map((t, i) => text(x + 24 + i * ((w - 48) / 8), y + 116, 11, C.body, t)).join("") +
  `<path d="M${x} ${y + 130}H${x + w}" stroke="${C.rule}" stroke-width="1.5"/>` +
  bold(x + 24, y + 164, 16, C.ink, "About Us — Our Mission Statement") +
  [0, 1, 2].map((i) => bar(x + 24, y + 180 + i * 18, w - 60 - i * 70, C.rule, 8)).join("") +
  Array.from({ length: 12 }, (_, i) => {
    const cw = (w - 48 - 30) / 4;
    const cx = x + 24 + (i % 4) * (cw + 10);
    const cy = y + 250 + Math.floor(i / 4) * 66;
    return rect(cx, cy, cw, 56, 8, C.canvas) + bar(cx + 10, cy + 16, cw * 0.6, C.rule, 8) + bar(cx + 10, cy + 32, cw * 0.4, C.rule, 8);
  }).join("");

const adBounce = art(
  900,
  720,
  "A paid ad that costs £10 a click, leading to a cluttered homepage with an About Us section and twelve services, where the visitor leaves after two seconds.",
  `${sun("ab", 600, 400, 290)}
  ${shadow(rect(20, 40, 380, 230, 22, C.paper))}
  ${pill(48, 66, 100, 28, C.canvas, "Sponsored", C.body, 12)}
  ${bold(48, 132, 24, C.ink, "Emergency roof repair", 'letter-spacing="-.6"')}
  ${text(48, 162, 15, C.body, "Free quote today · Teesside")}
  ${bar(48, 186, 280, C.rule, 9)}${bar(48, 204, 200, C.rule, 9)}
  ${pill(48, 222, 130, 32, C.lime, "£10 per click", C.ink, 13)}
  <path d="M300 270C330 320 360 330 400 330" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="4 8" stroke-linecap="round"/>
  <path d="m390 322 12 8-12 8" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
  ${shadow(homepageClutter(370, 230, 510, "yourbusiness.co.uk"))}
  ${shadow(rect(30, 470, 300, 110, 20, C.ink))}
  <circle cx="76" cy="525" r="22" fill="${C.lime}"/>
  <path d="M84 525H68m6-7-7 7 7 7" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  ${bold(112, 518, 18, C.paper, "Back button")}
  ${text(112, 544, 15, C.muted, "after 2 seconds")}
  ${note(40, 640, "Overwhelmed. Gone.")}`,
);

const landingSplit = art(
  1280,
  800,
  "Side by side: a generic homepage with a £85 cost per lead, and a single-offer Veltra landing page with a £12 cost per lead.",
  `${shadow(homepageClutter(20, 20, 600, "yourbusiness.co.uk"), "0 18px 30px rgba(7,19,19,.1)")}
  ${shadow(browser(660, 20, 600, 470, "yourbusiness.co.uk/free-quote"), "0 18px 30px rgba(7,19,19,.1)")}
  ${bold(684, 106, 15, C.ink, "Smith Building Services")}
  ${pill(684, 136, 170, 30, C.lime, "FREE QUOTE THIS WEEK", C.ink, 12)}
  ${bold(684, 212, 34, C.ink, "Leaking roof?", 'letter-spacing="-1.3"')}
  ${bold(684, 254, 34, C.ink, "Fixed this week.", 'letter-spacing="-1.3"')}
  ${["Free survey", "Fixed written price", "Fully insured"].map((t, i) => tick(696, 292 + i * 34, C.mint) + text(718, 298 + i * 34, 15, C.ink, t)).join("")}
  ${shadow(rect(990, 120, 246, 330, 20, C.ink))}
  ${bold(1012, 160, 17, C.paper, "Get your free quote")}
  ${rect(1012, 182, 202, 44, 10, C.ink2)}${text(1028, 210, 14, C.muted, "Your name")}
  ${rect(1012, 238, 202, 44, 10, C.ink2)}${text(1028, 266, 14, C.muted, "Phone number")}
  ${rect(1012, 294, 202, 44, 10, C.ink2)}${text(1028, 322, 14, C.muted, "Postcode")}
  ${pill(1012, 356, 202, 48, C.lime, "Get my free quote", C.ink, 15)}
  ${stars(684, 410, 18)}${text(800, 424, 14, C.body, "Local reviews")}
  ${rect(20, 520, 600, 260, 22, C.paper, `stroke="${C.rule}" stroke-width="1.5"`)}
  ${text(52, 566, 16, C.body, "Homepage · cost per lead")}
  ${bold(52, 660, 84, C.ink, "£85", 'letter-spacing="-3"')}
  ${rect(320, 600, 260, 140, 14, C.canvas)}
  ${[70, 64, 74, 68, 72].map((h, i) => rect(344 + i * 46, 720 - h, 26, h, 6, C.muted)).join("")}
  ${text(52, 730, 15, C.body, "Paid traffic sent to the homepage")}
  ${rect(660, 520, 600, 260, 22, C.ink)}
  ${text(692, 566, 16, C.muted, "Landing page · cost per lead")}
  ${bold(692, 660, 84, C.lime, "£12", 'letter-spacing="-3"')}
  ${rect(960, 600, 260, 140, 14, C.ink2)}
  ${[10, 9, 12, 10, 11].map((h, i) => rect(984 + i * 46, 720 - h, 26, h, 6, C.lime)).join("")}
  ${text(692, 730, 15, C.muted, "Same ad spend · 4x the leads")}`,
);

// ───────────────────────── AI receptionist ─────────────────────────
const chatThread = (x, y) => {
  // A 376px-wide conversation, the one quoted in the proof copy.
  const r = x + 376;
  return text(x + 188, y, 13, C.muted, "Tonight · 2:14 AM", 'text-anchor="middle"') +
    rect(r - 244, y + 16, 244, 76, 20, C.ink) +
    text(r - 226, y + 48, 15, C.paper, "Hey, do you do emergency") +
    text(r - 226, y + 72, 15, C.paper, "callouts in Billingham?") +
    rect(x, y + 108, 290, 124, 20, C.canvas) +
    text(x + 18, y + 140, 15, C.ink, "Yes, we cover Billingham.") +
    text(x + 18, y + 164, 15, C.ink, "An emergency callout is") +
    text(x + 18, y + 188, 15, C.ink, "£250, all in. Next free slot") +
    text(x + 18, y + 212, 15, C.ink, "is 8:00 AM. Shall I book it?") +
    rect(r - 120, y + 248, 120, 48, 20, C.ink) +
    text(r - 102, y + 278, 15, C.paper, "Yes please") +
    text(x + 188, y + 326, 13, C.muted, "2:15 AM", 'text-anchor="middle"') +
    rect(x, y + 342, 376, 88, 18, C.lime) +
    tick(x + 34, y + 386, C.ink, C.lime) +
    bold(x + 62, y + 380, 18, C.ink, "Job booked") +
    text(x + 62, y + 404, 14, C.ink, "Tomorrow · 8:00 AM · £250");
};

const aiHero = art(
  1280,
  960,
  "A plumber's website with the AI receptionist chat open, booking an emergency callout in Billingham at 2:15 AM.",
  `${sun("ah", 900, 560, 330)}
  <defs><linearGradient id="ah-img" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.mint}"/><stop offset="1" stop-color="${C.ink2}"/></linearGradient></defs>
  ${shadow(browser(30, 60, 860, 660, "teessideplumbing.co.uk"))}
  ${rect(30, 108, 860, 70, 0, C.ink)}
  ${bold(62, 150, 20, C.paper, 'Teesside <tspan fill="' + C.lime + '">Plumbing</tspan>')}
  ${pill(700, 124, 160, 38, C.lime, "Book a callout", C.ink, 14)}
  ${bold(62, 236, 13, C.body, "24/7 EMERGENCY PLUMBERS", 'letter-spacing="2"')}
  ${bold(62, 296, 46, C.ink, "Burst pipe?", 'letter-spacing="-1.8"')}
  ${bold(62, 350, 46, C.ink, "We answer, day", 'letter-spacing="-1.8"')}
  ${bold(62, 404, 46, C.ink, "or night.", 'letter-spacing="-1.8"')}
  ${bar(62, 440, 300)}${bar(62, 462, 230)}
  ${pill(62, 500, 210, 52, C.ink, "Call 01642 000 000", C.paper, 15)}
  ${rect(470, 214, 380, 330, 18, "url(#ah-img)")}
  ${shadow(rect(760, 300, 460, 580, 28, C.paper, `stroke="${C.rule}" stroke-width="1.5"`), "0 30px 50px rgba(7,19,19,.28)")}
  ${rect(760, 300, 460, 92, 28, C.ink)}${rect(760, 350, 460, 42, 0, C.ink)}
  <circle cx="808" cy="346" r="24" fill="${C.lime}"/>${bold(808, 352, 15, C.ink, "AI", 'text-anchor="middle"')}
  ${bold(846, 340, 18, C.paper, "Teesside Plumbing")}
  ${text(846, 364, 14, C.mint, "● AI receptionist · online 24/7")}
  ${chatThread(802, 428)}`,
);

const aiChat = art(
  900,
  840,
  "A phone showing the AI receptionist's chat at 2:15 AM: a customer asks about emergency callouts in Billingham and the AI confirms, gives the price and books the job.",
  `${sun("ac", 450, 420, 360)}
  ${phone(240, 10, 420, 760)}
  <circle cx="300" cy="104" r="22" fill="${C.ink}"/>${bold(300, 110, 14, C.lime, "AI", 'text-anchor="middle"')}
  ${bold(334, 100, 17, C.ink, "Teesside Plumbing")}
  ${text(334, 122, 13, "#1d8a5a", "● AI receptionist · online")}
  <path d="M252 146H648" stroke="${C.rule}" stroke-width="1.5"/>
  ${chatThread(262, 186)}
  ${rect(262, 650, 376, 46, 23, C.canvas)}${text(286, 679, 14, C.muted, "Message…")}
  ${shadow(rect(10, 230, 210, 92, 20, C.paper))}
  ${bold(34, 268, 16, C.ink, "You: asleep")}
  ${text(34, 294, 14, C.body, "Phone on silent")}
  ${shadow(rect(680, 520, 210, 92, 20, C.ink))}
  ${bold(704, 558, 16, C.lime, "£250 job saved")}
  ${text(704, 584, 14, C.muted, "not lost to voicemail")}`,
);

const missedCall = art(
  900,
  780,
  "A phone lock screen at dinner time with missed calls and a voicemail: a £1,500 job gone to a competitor.",
  `${sun("mc", 460, 360, 340)}
  ${phone(290, 10, 320, 700, C.ink2)}
  ${text(450, 120, 15, C.muted, "Tuesday 14 October", 'text-anchor="middle"')}
  ${bold(450, 200, 76, C.paper, "18:42", 'text-anchor="middle" letter-spacing="-3"')}
  ${[["Missed call", "07700 900123", "3 min ago"], ["Voicemail (1)", "0:04 · caller hung up", "3 min ago"], ["Missed call", "07700 900123", "4 min ago"]].map(([t, s, w], i) => {
    const y = 250 + i * 96;
    return rect(314, y, 272, 82, 18, C.paper, 'opacity=".95"') +
      `<circle cx="344" cy="${y + 41}" r="16" fill="${i === 1 ? C.mint : "#ffd6d0"}"/>` +
      bold(372, y + 36, 15, C.ink, t) + text(372, y + 58, 13, C.body, s) + text(570, y + 36, 12, C.muted, w, 'text-anchor="end"');
  }).join("")}
  ${rect(400, 668, 100, 6, 3, C.muted)}
  ${note(30, 200, "Under a sink.")}
  ${note(30, 234, "Can't answer.")}
  ${curve("M196 246c30 26 60 30 90 20m0 0c-8-6-16-6-22-4")}
  ${shadow(rect(650, 520, 230, 104, 20, C.ink))}
  ${bold(674, 562, 20, C.lime, "£1,500 job")}
  ${text(674, 592, 14, C.muted, "called your competitor")}`,
);

// ───────────────────────── CRM & booking ─────────────────────────
const kanbanCard = (x, y, name, job, value, { tag, fill = C.paper, ink = C.ink } = {}) =>
  rect(x, y, 253, 104, 14, fill, fill === C.paper ? `stroke="${C.rule}" stroke-width="1.5"` : "") +
  bold(x + 18, y + 34, 16, ink, name) +
  text(x + 18, y + 58, 14, ink === C.ink ? C.body : ink, job) +
  bold(x + 18, y + 86, 16, ink, value) +
  (tag ? pill(x + 253 - 18 - tag.length * 7.4 - 20, y + 66, tag.length * 7.4 + 20, 26, fill === C.lime ? C.ink : C.canvas, tag, fill === C.lime ? C.lime : C.ink, 12) : "");

const pipeline = art(
  1280,
  780,
  "Mock-up of a CRM board with columns for new leads, quotes sent, following up and jobs won; a quote moves to Job won after an automatic follow-up text.",
  `${rect(0, 0, 1280, 780, 24, C.paper, `stroke="${C.rule}" stroke-width="1.5"`)}
  ${bold(40, 66, 26, C.ink, "Pipeline", 'letter-spacing="-.6"')}
  ${text(170, 66, 16, C.body, "All leads · this month")}
  ${pill(1010, 38, 230, 40, C.mint, "Auto follow-up: on", C.ink, 14)}
  ${["New lead", "Quote sent", "Following up", "Job won"].map((name, i) => {
    const x = 40 + i * 305;
    return rect(x, 110, 285, 640, 18, C.canvas) +
      `<circle cx="${x + 26}" cy="${146}" r="7" fill="${i === 3 ? C.lime : i === 2 ? C.mint : C.muted}"/>` +
      bold(x + 42, 152, 17, C.ink, name);
  }).join("")}
  ${kanbanCard(56, 180, "Sarah K.", "Boiler service", "£180")}
  ${kanbanCard(56, 300, "Dan M.", "Bathroom refit", "£4,200")}
  ${kanbanCard(56, 420, "Priya S.", "Leak repair", "£150")}
  ${kanbanCard(361, 180, "James T.", "Rewire, 3-bed", "£3,600", { tag: "Day 2 sent" })}
  ${kanbanCard(361, 300, "Lucy W.", "EV charger", "£950", { tag: "Day 2 sent" })}
  ${rect(666, 180, 253, 104, 14, "none", `stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 6"`)}
  ${kanbanCard(666, 300, "Emma L.", "Radiators", "£1,100", { tag: "Day 5 SMS" })}
  ${kanbanCard(666, 420, "Ben A.", "Patio doors", "£2,300", { tag: "Day 7 email" })}
  ${shadow(kanbanCard(971, 180, "Mark R.", "Kitchen fit", "£6,800", { fill: C.lime, tag: "Won" }), "0 18px 30px rgba(7,19,19,.18)")}
  ${kanbanCard(971, 300, "Tom H.", "Boiler install", "£2,400", { tag: "Won" })}
  ${kanbanCard(971, 420, "Chris B.", "Roof repair", "£780", { tag: "Won" })}
  <path d="M919 232C940 232 950 232 966 232" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="4 7" stroke-linecap="round"/>
  <path d="m956 224 10 8-10 8" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
  ${shadow(rect(666, 560, 558, 150, 20, C.ink))}
  ${text(694, 600, 14, C.muted, "Automatic · Day 5 follow-up")}
  ${rect(694, 616, 400, 70, 16, C.ink2)}
  ${text(714, 646, 15, C.paper, "Hi Mark, just checking you got our quote")}
  ${text(714, 670, 15, C.paper, "for the kitchen. Happy to answer anything.")}
  ${tick(1150, 650)}`,
);

const crmHero = art(
  1280,
  940,
  "Mock-up of a lead dashboard showing new leads, quotes out and jobs won, a day 2, 5 and 7 follow-up sequence, and a phone where a customer accepts a quote by text.",
  `${sun("ch", 920, 560, 330)}
  ${shadow(browser(20, 60, 940, 700, "Lead command dashboard"))}
  ${rect(20, 108, 190, 652, 0, C.ink)}
  ${bold(44, 152, 16, C.paper, "Veltra CRM")}
  ${["Pipeline", "Leads", "Quotes", "Bookings", "Reminders"].map((t, i) => (i === 0 ? rect(36, 182 + i * 50, 158, 38, 10, C.ink2) : "") + text(56, 207 + i * 50, 15, i === 0 ? C.lime : C.muted, t)).join("")}
  ${[["New leads", "24"], ["Quotes out", "£18.4k"], ["Won this month", "11"]].map(([l, v], i) => {
    const x = 240 + i * 236;
    return rect(x, 140, 216, 130, 18, i === 2 ? C.lime : C.canvas) + text(x + 22, 178, 15, i === 2 ? C.ink : C.body, l) + bold(x + 22, 238, 40, C.ink, v, 'letter-spacing="-1.5"');
  }).join("")}
  ${bold(240, 326, 18, C.ink, "Follow-up sequence · quote #1042")}
  <path d="M276 400H756" stroke="${C.rule}" stroke-width="4"/>
  <path d="M276 400H516" stroke="${C.ink}" stroke-width="4"/>
  ${[["Day 2", "SMS sent", true], ["Day 5", "Email sent", true], ["Day 7", "SMS queued", false]].map(([d, s, done], i) => {
    const x = 276 + i * 240;
    return `<circle cx="${x}" cy="400" r="20" fill="${done ? C.ink : C.paper}" stroke="${C.ink}" stroke-width="3"/>` +
      (done ? `<path d="m${x - 8} 400 5 5 11-11" fill="none" stroke="${C.lime}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>` : "") +
      bold(x, 452, 16, C.ink, d, 'text-anchor="middle"') + text(x, 476, 14, C.body, s, 'text-anchor="middle"');
  }).join("")}
  ${[["Sarah K.", "Boiler service", "Quote sent", C.canvas], ["James T.", "Rewire, 3-bed", "Following up", C.mint], ["Mark R.", "Kitchen fit", "Job won", C.lime]].map(([n, j, s, f], i) => {
    const y = 520 + i * 70;
    return `<path d="M240 ${y - 10}H930" stroke="${C.rule}" stroke-width="1.5"/>` + bold(240, y + 26, 16, C.ink, n) + text(380, y + 26, 15, C.body, j) + pill(560, y + 4, 140, 34, f, s, C.ink, 13);
  }).join("")}
  ${phone(880, 230, 360, 640)}
  ${bold(1060, 296, 16, C.ink, "Messages", 'text-anchor="middle"')}
  <path d="M892 316H1228" stroke="${C.rule}" stroke-width="1.5"/>
  ${text(1060, 350, 12, C.muted, "Thursday · sent automatically", 'text-anchor="middle"')}
  ${rect(906, 366, 270, 100, 18, C.canvas)}
  ${text(924, 396, 14, C.ink, "Hi Sarah, just checking you")}
  ${text(924, 418, 14, C.ink, "got our quote for the boiler")}
  ${text(924, 440, 14, C.ink, "service. Any questions?")}
  ${rect(1004, 486, 210, 50, 18, C.ink)}
  ${text(1022, 517, 14, C.paper, "Yes, go ahead please!")}
  ${rect(906, 560, 308, 82, 18, C.lime)}
  ${tick(938, 601, C.ink, C.lime)}
  ${bold(964, 596, 16, C.ink, "Quote accepted")}
  ${text(964, 620, 13, C.ink, "Moved to Job won")}
  ${rect(906, 664, 270, 76, 18, C.canvas)}
  ${text(924, 694, 14, C.ink, "Reminder: we're with you")}
  ${text(924, 716, 14, C.ink, "tomorrow at 9:00 AM.")}`,
);

const messyAdmin = art(
  900,
  720,
  "A messy spreadsheet of quotes and sticky notes saying to chase customers, next to a text reading: Sorry mate, we already went with someone else.",
  `${sun("ma", 600, 420, 290)}
  ${shadow(rect(20, 40, 600, 430, 14, C.paper, `stroke="${C.rule}" stroke-width="1.5"`))}
  ${rect(20, 40, 600, 46, 14, "#dfe6dc")}${rect(20, 70, 600, 16, 0, "#dfe6dc")}
  ${text(44, 70, 14, C.ink, "Quotes_FINAL_v3 (2).xlsx", 'font-weight="600"')}
  ${["Name", "Job", "Quote", "Chased?"].map((t, i) => rect(20 + i * 150, 86, 150, 34, 0, C.canvas, `stroke="${C.rule}"`) + bold(34 + i * 150, 108, 13, C.ink, t)).join("")}
  ${Array.from({ length: 9 }, (_, r) => [0, 1, 2, 3].map((c) => {
    const x = 20 + c * 150;
    const y = 120 + r * 38;
    const odd = c === 3 && r % 3 === 1;
    return rect(x, y, 150, 38, 0, odd ? "#ffe3dd" : C.paper, `stroke="${C.rule}"`) + (c === 3 ? bold(x + 16, y + 25, 13, odd ? "#b3261e" : C.body, odd ? "??" : r % 2 ? "no" : "") : bar(x + 14, y + 15, 60 + ((r * 7 + c * 13) % 50), C.rule, 9));
  }).join("")).join("")}
  ${[[460, 20, 8, "Chase Sarah", "re quote??"], [60, 400, -6, "Call back", "Tues!!"], [300, 380, 4, "Quote £3.6k", "sent? check"]].map(([x, y, r, a, b]) =>
    `<g transform="rotate(${r} ${x + 80} ${y + 80})">${shadow(rect(x, y, 170, 150, 4, "#fff1a1"), "0 10px 16px rgba(7,19,19,.18)")}${text(x + 18, y + 64, 20, C.ink, a, 'font-style="italic"')}${text(x + 18, y + 96, 20, C.ink, b, 'font-style="italic"')}</g>`).join("")}
  ${shadow(rect(480, 520, 400, 180, 24, C.ink), "0 22px 34px rgba(7,19,19,.28)")}
  ${text(508, 560, 13, C.muted, "Monday · 09:12")}
  ${rect(508, 576, 344, 96, 18, C.paper)}
  ${text(528, 614, 17, C.ink, "Sorry mate, we already")}
  ${text(528, 642, 17, C.ink, "went with someone else.")}`,
);

export const SERVICE_VISUALS = {
  siteElectrician,
  siteJoinery,
  oldVsNew,
  mapPack,
  gbpInsights,
  adBounce,
  landingSplit,
  aiHero,
  aiChat,
  missedCall,
  pipeline,
  crmHero,
  messyAdmin,
};
