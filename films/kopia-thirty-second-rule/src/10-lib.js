// ============================================================ helpers (deterministic, no Math.random)
const PRNG = (seed) => { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; };
const f1 = (v) => (Math.round(v * 10) / 10).toString();

// closed polygon with hand-cut edges: every edge split every `step` px and pushed out/in by up to `amp`
function roughPoly(pts, seed, amp = 3, step = 34) {
  const r = PRNG(seed); let d = "";
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, n = Math.max(1, Math.round(L / step));
    const nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
    for (let k = 0; k < n; k++) {
      const t = k / n, j = (r() - 0.5) * 2 * amp * (k === 0 ? 0.3 : 1);
      d += (d ? "L" : "M") + f1(x1 + (x2 - x1) * t + nx * j) + " " + f1(y1 + (y2 - y1) * t + ny * j);
    }
  }
  return d + "Z";
}
const rrect = (x, y, w, h, seed, amp = 3, step = 34) => roughPoly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], seed, amp, step);

// a wobbly handwritten line (no letters), like scribbled notes
function scribble(x, y, w, seed, amp = 7) {
  const r = PRNG(seed); let d = `M${f1(x)} ${f1(y)}`; let cx = x;
  while (cx < x + w) {
    const s = 16 + r() * 18, up = (r() - 0.5) * 2 * amp, dn = (r() - 0.5) * 2 * amp;
    d += ` q${f1(s / 2)} ${f1(up - 6)} ${f1(s)} ${f1(dn * 0.4)}`; cx += s;
    if (r() < 0.12) { d += ` m${f1(10 + r() * 14)} 0`; cx += 18; }
  }
  return d;
}
const scribPath = (x, y, w, seed, sw = 4, col = "#2A2320", amp = 7, extra = "") =>
  `<path d="${scribble(x, y, w, seed, amp)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

// hand-drawn arrow
const arrow = (x1, y1, x2, y2, bend, col = "#2A2320", sw = 4.5, extra = "") => {
  const mx = (x1 + x2) / 2 + bend, my = (y1 + y2) / 2 - bend * 0.4;
  const a = Math.atan2(y2 - my, x2 - mx), h = 22;
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)], p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
  return `<path d="M${x1} ${y1} Q${f1(mx)} ${f1(my)} ${x2} ${y2} M${f1(p1[0])} ${f1(p1[1])} L${x2} ${y2} L${f1(p2[0])} ${f1(p2[1])}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
};
const hw = (x, y, txt, size = 48, col = "#2A2320", rot = 0, w = 500, extra = "") =>
  `<text x="${x}" y="${y}" font-family="Caveat" font-weight="${w}" font-size="${size}" fill="${col}" transform="rotate(${rot} ${x} ${y})" ${extra}>${txt}</text>`;
const cross = (x, y, w, h, col = "#2A2320", sw = 4) =>
  `<path d="M${x} ${y} L${x + w} ${y + h} M${x + w} ${y} L${x} ${y + h}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
const coffee = (cx, cy, r, seed, o = 0.5) => {
  const R = PRNG(seed);
  return `<g opacity="${o}"><path d="${roughPoly(Array.from({ length: 18 }, (_, i) => [cx + Math.cos(i / 18 * 6.283) * r, cy + Math.sin(i / 18 * 6.283) * r]), seed, 3, 20)}" fill="none" stroke="#8A5A33" stroke-width="${9 + R() * 4}"/>` +
    `<path d="${roughPoly(Array.from({ length: 14 }, (_, i) => [cx + 14 + Math.cos(i / 14 * 6.283) * r * 0.55, cy + 10 + Math.sin(i / 14 * 6.283) * r * 0.45]), seed + 3, 6, 18)}" fill="#9A6A40" opacity=".55"/></g>`;
};

// ------------------------------------------------------------ a messy handwritten page (local coords 0..w, 0..h)
function messyPage(w, h, seed, o = {}) {
  const r = PRNG(seed); let g = `<path d="${rrect(0, 0, w, h, seed, 4, 40)}" fill="${o.fill || "#F3EAD9"}" filter="url(#sh)"/>`;
  g += `<path d="M${w * 0.06} 0 V${h}" stroke="#E2B4A6" stroke-width="2.5" opacity=".7"/>`;
  for (let y = 70; y < h - 20; y += 44) g += `<path d="M10 ${y} H${w - 10}" stroke="#C7D3DF" stroke-width="2" opacity=".6"/>`;
  if (o.title) g += hw(w * 0.1, 64, o.title, o.titleSize || 52, "#2A2320", -2, 700);
  let y = o.title ? 130 : 80;
  const lines = o.lines || 9;
  for (let i = 0; i < lines && y < h - 40; i++, y += 44) {
    const x0 = w * 0.1 + (r() < 0.25 ? 30 : 0), ww = w * (0.45 + r() * 0.4);
    g += scribPath(x0, y, ww, seed * 7 + i, 3.6);
    if (r() < 0.22) g += `<path d="M${f1(x0 - 6)} ${y - 4} L${f1(x0 + ww * 0.6)} ${y - 2}" stroke="#2A2320" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (o.arrows) g += arrow(w * 0.7, 150, w * 0.86, 330, 60) + arrow(w * 0.2, h * 0.6, w * 0.08, h * 0.45, -50);
  if (o.figures) { g += hw(w * 0.55, h * 0.72, "12 000", 46, "#2A2320", 3, 700) + cross(w * 0.54, h * 0.72 - 36, 150, 44) + hw(w * 0.6, h * 0.8, "15 500 ?", 44, "#2A2320", -4, 700); }
  if (o.coffee) g += coffee(w * 0.68, h * 0.3, 74, seed + 11, 0.55);
  if (o.staple) g += `<path d="M18 46 L40 22 L64 34" fill="none" stroke="#8F9298" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
  return g;
}

// ------------------------------------------------------------ a crisp printed page (Kopia output): straight edges, set type
function cleanPage(w, h, o = {}) {
  const s = w / 800; // designed at 800 px wide
  let g = `<rect x="0" y="0" width="${w}" height="${h}" rx="${2 * s}" fill="#FBF8F1" ${o.noShadow ? "" : 'filter="url(#sh)"'}/>`;
  g += `<g transform="scale(${s})">`;
  g += `<text x="70" y="128" font-family="Poppins" font-weight="700" font-size="58" fill="#0B1B3A" letter-spacing="-1">Beignets Ekobena</text>`;
  g += `<text x="72" y="182" font-family="Poppins" font-weight="600" font-size="36" fill="#0D5EF4">Business Plan</text>`;
  g += `<rect x="72" y="214" width="656" height="4" fill="#0B1B3A" opacity=".85"/>`;
  if (!o.cover) {
    const sec = (y, t) => `<text x="72" y="${y}" font-family="Poppins" font-weight="600" font-size="31" fill="#0B1B3A">${t}</text>`;
    const bars = (y, n, wid) => Array.from({ length: n }, (_, i) => `<rect x="72" y="${y + i * 30}" width="${wid[i % wid.length]}" height="12" rx="6" fill="#C9CED8"/>`).join("");
    g += sec(290, "1. The idea") + bars(316, 3, [640, 600, 420]);
    g += sec(460, "2. Customers") + bars(486, 3, [620, 652, 380]);
    g += sec(630, "3. Cash flow");
    // clean table
    const tx = 72, ty = 662, cw = [230, 213, 213], rh = 58;
    g += `<rect x="${tx}" y="${ty}" width="656" height="${rh}" fill="#E8EEFC"/>`;
    ["Month", "Sales", "Costs"].forEach((t, i) => { g += `<text x="${tx + cw.slice(0, i).reduce((a, b) => a + b, 0) + (i ? cw[i] - 24 : 22)}" y="${ty + 39}" font-family="Inter" font-weight="700" font-size="25" fill="#0B1B3A" text-anchor="${i ? "end" : "start"}">${t}</text>`; });
    const rows = [["January", "152 000", "96 000"], ["February", "168 000", "101 000"], ["March", "181 000", "104 000"]];
    rows.forEach((row, ri) => row.forEach((t, i) => {
      g += `<text x="${tx + cw.slice(0, i).reduce((a, b) => a + b, 0) + (i ? cw[i] - 24 : 22)}" y="${ty + rh * (ri + 1) + 39}" font-family="Inter" font-weight="500" font-size="25" fill="#26324A" text-anchor="${i ? "end" : "start"}">${t}</text>`;
    }));
    for (let i = 0; i <= 4; i++) g += `<rect x="${tx}" y="${ty + i * rh}" width="656" height="2" fill="#C9CED8"/>`;
    g += sec(960, "4. Next steps") + bars(986, 2, [600, 500]);
  } else {
    g += `<text x="72" y="300" font-family="Inter" font-weight="500" font-size="26" fill="#55607A">Prepared by Nadège Ekobena</text>`;
    g += `<rect x="72" y="${h / s - 150}" width="656" height="2" fill="#C9CED8"/>`;
    g += `<text x="72" y="${h / s - 100}" font-family="Inter" font-weight="500" font-size="24" fill="#55607A">18 pages</text>`;
  }
  return g + "</g>";
}

// ------------------------------------------------------------ people (cut-paper rigs, head centred on 0,0, head rx 110)
// face: eyes, brows and mouth have ids so the timeline can blink, frown and lip-sync them
function face(p, o) {
  const eye = (side) => `<g id="${p}-eye${side}"><ellipse rx="10.5" ry="13" fill="#1A120E"/><circle cx="3" cy="-4" r="3.2" fill="#F3EAD9"/></g>`;
  return `
    <g transform="translate(-40 -6)">${eye("L")}</g><g transform="translate(40 -6)">${eye("R")}</g>
    <g transform="translate(-41 -44)"><rect id="${p}-browL" x="-26" y="-5.5" width="52" height="11" rx="5.5" fill="${o.brow || "#1A120E"}"/></g>
    <g transform="translate(41 -44)"><rect id="${p}-browR" x="-26" y="-5.5" width="52" height="11" rx="5.5" fill="${o.brow || "#1A120E"}"/></g>
    <path d="M-13 6 C-17 34 -24 48 -9 53 L9 53 C24 48 17 34 13 6Z" fill="${o.skinD}" opacity=".9"/>
    <g transform="translate(0 ${o.mouthY || 82})">
      <rect id="${p}-mClosed" x="-25" y="-4" width="50" height="8" rx="4" fill="${o.lip || "#2A1410"}"/>
      <g id="${p}-mOpen" opacity="0"><ellipse rx="26" ry="20" fill="#3A1712"/><ellipse cy="9" rx="15" ry="7" fill="#B5574A"/><rect x="-18" y="-19" width="36" height="7" rx="3.5" fill="#F3EAD9"/></g>
    </g>`;
}
function headFront(p, o) {
  return `<g id="${p}-head">
    ${o.back || ""}
    <rect x="-46" y="70" width="92" height="120" rx="30" fill="${o.skinD}"/>
    <ellipse cx="-108" cy="10" rx="21" ry="30" fill="${o.skinD}"/><ellipse cx="108" cy="10" rx="21" ry="30" fill="${o.skinD}"/>
    <ellipse cx="0" cy="0" rx="${o.rx || 110}" ry="${o.ry || 132}" fill="${o.skin}"/>
    ${o.cheeks ? `<ellipse cx="-62" cy="40" rx="26" ry="16" fill="${o.skinD}" opacity=".35"/><ellipse cx="62" cy="40" rx="26" ry="16" fill="${o.skinD}" opacity=".35"/>` : ""}
    ${o.under || ""}
    ${face(p, o)}
    ${o.front || ""}
  </g>`;
}
// torso below a head at (0,0): shoulders at y≈160
function torso(o) {
  return `<path d="M-310 330 C-302 226 -222 178 -112 162 L112 162 C222 178 302 226 310 330 L322 1100 L-322 1100Z" fill="${o.shirt}"/>` + (o.detail || "");
}

const CH = {
  mbarga: {
    skin: "#5A3622", skinD: "#46291A", brow: "#2B231F", lip: "#2A1410",
    front: `<path d="M-113 -2 C-120 -98 -66 -148 0 -148 C66 -148 120 -98 113 -2 C106 -42 92 -66 68 -80 C38 -96 -38 -96 -68 -80 C-92 -66 -106 -42 -113 -2Z" fill="#1E1612"/>
      <path d="M-113 -2 C-114 -34 -108 -56 -96 -70 L-92 -26Z" fill="#8F8A84"/><path d="M113 -2 C114 -34 108 -56 96 -70 L92 -26Z" fill="#8F8A84"/>
      <path d="M-104 34 C-100 112 -52 152 0 152 C52 152 100 112 104 34 C92 70 74 102 42 106 L28 102 C14 114 -14 114 -28 102 L-42 106 C-74 102 -92 70 -104 34Z" fill="#332C27"/>
      <path d="M-58 120 L-50 130 M-20 136 L-16 146 M24 136 L20 146 M60 118 L52 128" stroke="#7D766F" stroke-width="4" stroke-linecap="round"/>
      <path d="M-40 66 C-22 54 22 54 40 66 C32 76 14 72 0 70 C-14 72 -32 76 -40 66Z" fill="#332C27"/>`,
  },
  nadege: {
    skin: "#7B4A2D", skinD: "#653B22", brow: "#1A110C", lip: "#5A2620", cheeks: true, rx: 104, ry: 126, mouthY: 76,
    back: `<circle cx="0" cy="-158" r="96" fill="#1A110C"/><circle cx="-40" cy="-190" r="40" fill="#22170F"/>`,
    front: `<path d="M-108 -6 C-114 -96 -60 -138 0 -138 C60 -138 114 -96 108 -6 C98 -56 62 -84 0 -86 C-62 -84 -98 -56 -108 -6Z" fill="#1A110C"/>
      <path d="M-104 -66 C-66 -110 66 -110 104 -66 L100 -44 C64 -84 -64 -84 -100 -44Z" fill="#C4643F"/>
      <circle cx="-112" cy="46" r="9" fill="#D9A441"/><circle cx="112" cy="46" r="9" fill="#D9A441"/>`,
  },
  serge: {
    skin: "#6A4128", skinD: "#55331F", brow: "#1A120E", lip: "#2A1410",
    front: `<path d="M-112 -10 C-116 -100 -62 -142 0 -142 C62 -142 116 -100 112 -10 C104 -50 86 -70 60 -80 C30 -90 -30 -90 -60 -80 C-86 -70 -104 -50 -112 -10Z" fill="#17110D"/>
      <g id="se-glasses"><circle cx="-40" cy="-6" r="31" fill="#EAF1FB" fill-opacity=".14" stroke="#1B2235" stroke-width="7"/><circle cx="40" cy="-6" r="31" fill="#EAF1FB" fill-opacity=".14" stroke="#1B2235" stroke-width="7"/>
      <rect x="-12" y="-11" width="24" height="7" rx="3" fill="#1B2235"/><path d="M-71 -12 L-108 -18 M71 -12 L108 -18" stroke="#1B2235" stroke-width="6" stroke-linecap="round"/></g>`,
  },
  maman: {
    skin: "#4F2F1D", skinD: "#3E2416", brow: "#1A110C", lip: "#3A1A14", cheeks: true, rx: 118, ry: 130, mouthY: 80,
    back: `<path d="M-150 -40 C-176 -150 -80 -236 10 -226 C112 -232 186 -150 152 -40Z" fill="#E07A2E"/>`,
    front: `<g><path d="M-136 -18 C-150 -126 -70 -192 6 -188 C92 -192 156 -124 136 -18 C122 -66 78 -98 4 -100 C-70 -98 -122 -66 -136 -18Z" fill="#E07A2E"/>
      <circle cx="-70" cy="-120" r="20" fill="#2E8B57"/><circle cx="-70" cy="-120" r="9" fill="#F3EAD9"/>
      <circle cx="0" cy="-150" r="22" fill="#7B3F8C"/><circle cx="0" cy="-150" r="10" fill="#F3EAD9"/>
      <circle cx="72" cy="-122" r="20" fill="#2E8B57"/><circle cx="72" cy="-122" r="9" fill="#F3EAD9"/>
      <path d="M-120 -40 C-100 -70 -60 -84 -30 -88" stroke="#B85A1C" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M40 -200 C80 -250 140 -236 128 -190 C112 -170 70 -180 40 -200Z" fill="#E07A2E"/><path d="M20 -200 C-10 -252 -70 -246 -62 -200 C-50 -178 -10 -186 20 -200Z" fill="#D06A22"/>
      <circle cx="-122" cy="50" r="17" fill="none" stroke="#D9A441" stroke-width="6"/><circle cx="122" cy="50" r="17" fill="none" stroke="#D9A441" stroke-width="6"/></g>`,
  },
};
const waxDress = (id) => `<g>
  <path d="M-310 330 C-302 226 -222 178 -112 162 L112 162 C222 178 302 226 310 330 L322 1100 L-322 1100Z" fill="#E07A2E"/>
  <clipPath id="${id}-wc"><path d="M-310 330 C-302 226 -222 178 -112 162 L112 162 C222 178 302 226 310 330 L322 1100 L-322 1100Z"/></clipPath>
  <g clip-path="url(#${id}-wc)">${Array.from({ length: 28 }, (_, i) => { const x = -300 + (i % 7) * 100 + (Math.floor(i / 7) % 2) * 50, y = 230 + Math.floor(i / 7) * 120; return `<circle cx="${x}" cy="${y}" r="30" fill="#2E8B57"/><circle cx="${x}" cy="${y}" r="14" fill="#F3EAD9"/><path d="M${x + 40} ${y + 40} q20 -26 40 0 q-20 26 -40 0Z" fill="#7B3F8C"/>`; }).join("")}</g>
  <path d="M-96 162 C-60 230 60 230 96 162Z" fill="#3E2416"/></g>`;

// simple cut-paper hand: palm + fingers; pose: "pinch" | "point" | "open" | "fist" | "flat"
function hand(o) {
  const s = o.skin, d = o.skinD;
  if (o.pose === "point") return `<g><rect x="-40" y="-20" width="80" height="96" rx="34" fill="${s}"/><rect x="-14" y="-118" width="28" height="112" rx="14" fill="${s}"/><path d="M-40 6 C-62 0 -66 -30 -48 -40 C-36 -44 -26 -30 -22 -14Z" fill="${d}"/></g>`;
  if (o.pose === "pinch") return `<g><rect x="-44" y="-40" width="88" height="92" rx="36" fill="${s}"/><rect x="18" y="-92" width="26" height="70" rx="13" fill="${s}" transform="rotate(20 31 -57)"/><rect x="-8" y="-98" width="26" height="74" rx="13" fill="${s}"/><path d="M-44 -6 C-70 -20 -66 -62 -40 -66 C-24 -66 -20 -40 -18 -26Z" fill="${d}"/></g>`;
  if (o.pose === "open") return `<g><rect x="-50" y="-30" width="100" height="70" rx="32" fill="${s}"/>${[-36, -12, 12, 36].map((x, i) => `<rect x="${x - 11}" y="${-86 + (i === 0 || i === 3 ? 12 : 0)}" width="22" height="70" rx="11" fill="${s}"/>`).join("")}<rect x="40" y="-10" width="22" height="58" rx="11" fill="${d}" transform="rotate(-40 51 19)"/></g>`;
  if (o.pose === "flat") return `<g><rect x="-60" y="-34" width="150" height="68" rx="32" fill="${s}"/><rect x="-60" y="-34" width="60" height="68" rx="30" fill="${d}" opacity=".35"/></g>`;
  return `<g><rect x="-46" y="-40" width="92" height="84" rx="38" fill="${s}"/>${[-30, -10, 10, 30].map((x) => `<rect x="${x - 10}" y="-50" width="20" height="30" rx="10" fill="${d}"/>`).join("")}</g>`;
}
// an arm from (x1,y1) to (x2,y2) as a rounded capsule, sleeve colour, given width
const limb = (id, x1, y1, x2, y2, w, col, extra = "") => {
  const L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  return `<g id="${id}" transform="translate(${f1(x1)} ${f1(y1)}) rotate(${f1(a)})"><rect x="${-w / 2}" y="${-w / 2}" width="${f1(L + w)}" height="${w}" rx="${w / 2}" fill="${col}" ${extra}/></g>`;
};

// ------------------------------------------------------------ the KOPIA lockup, in the brand image's own pixel space (1600×692)
// geometry measured from brand/kopia-logo-on-blue.jpg: tile 331 px at (167,166), corner radius 74, red copy tile offset 26 px,
// K cap height 144 px, wordmark cap height 176 px (Poppins Bold). Swap for the official SVG when it arrives.
function lockup() {
  return `<g id="lk">
    <rect id="lkRed" x="193" y="193" width="331" height="331" rx="74" fill="#EF2F3C"/>
    <g id="lkTile"><rect x="167" y="166" width="331" height="331" rx="74" fill="#FFFFFF"/>
      <text id="lkK" x="327" y="404.5" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="206" fill="#0D5EF4">K</text></g>
    <g id="lkWord"><clipPath id="lkWordClip"><rect x="600" y="200" width="900" height="250"/></clipPath>
      <g clip-path="url(#lkWordClip)"><text id="lkText" x="625" y="421" font-family="Poppins" font-weight="700" font-size="251" letter-spacing="5.2" fill="#FFFFFF">${["K", "O", "P", "I", "A"].map((c, i) => `<tspan id="lkL${i}">${c}</tspan>`).join("")}</text></g></g>
  </g>`;
}
