// ============================================================ scene art (every scene: one 1080×1920 SVG)
const SC = {};
const put = (id, svg) => { document.getElementById(id).querySelector("svg.art").innerHTML = svg; };
const MB = CH.mbarga, ND = CH.nadege, SE = CH.serge, MM = CH.maman;
const COURIER = { skin: "#8A5636", skinD: "#71452A", brow: "#2A1A10", lip: "#3A1A14",
  front: `<path d="M-112 -12 C-114 -100 -60 -140 0 -140 C60 -140 114 -100 112 -12 C104 -52 84 -72 56 -80 C26 -88 -26 -88 -56 -80 C-84 -72 -104 -52 -112 -12Z" fill="#1A120E"/>
  <path d="M-118 -54 C-112 -150 112 -150 118 -54Z" fill="#3E6B5A"/><path d="M40 -66 C110 -76 170 -60 196 -40 L118 -40Z" fill="#335A4B"/>` };

// rough wooden planks, horizontal
function planks(y0, y1, cols, seed, grain = "#7E5232") {
  const r = PRNG(seed); let g = ""; const n = cols.length; const h = (y1 - y0) / n;
  for (let i = 0; i < n; i++) {
    const y = y0 + i * h;
    g += `<rect x="0" y="${f1(y)}" width="1080" height="${f1(h + 1)}" fill="${cols[i]}"/>`;
    for (let k = 0; k < 4; k++) { const yy = y + h * (0.2 + r() * 0.6); g += `<path d="M-20 ${f1(yy)} C300 ${f1(yy - 10 + r() * 20)} 700 ${f1(yy - 12 + r() * 24)} 1100 ${f1(yy + r() * 10)}" stroke="${grain}" stroke-width="${f1(2 + r() * 2)}" fill="none" opacity=".35"/>`; }
    g += `<rect x="0" y="${f1(y + h - 3)}" width="1080" height="4" fill="${grain}" opacity=".6"/>`;
  }
  return g;
}

// ------------------------------------------------------------ S01 · the messy stack slams down (top-down desk)
SC.s01 = () => {
  let g = planks(0, 1920, ["#A8744B", "#9F6B43", "#A8744B", "#9C6942", "#A57149"], 3);
  g += `<path d="M820 1540 L1010 1380" stroke="#2D2A33" stroke-width="22" stroke-linecap="round" filter="url(#shS)"/><path d="M1000 1388 L1018 1374" stroke="#C9C2B4" stroke-width="22" stroke-linecap="round"/>`;
  g += `<rect id="s01-shadow" x="190" y="470" width="720" height="1000" rx="20" fill="#2A170B" opacity=".45" filter="url(#soft24)"/>`;
  g += `<g id="s01-stack"><g filter="url(#boil)">`;
  const offs = [[30, 40, 4], [-24, 22, -3], [14, -8, 2], [-10, 12, -1.5]];
  offs.forEach(([dx, dy, rot], i) => { g += `<g transform="translate(${180 + dx} ${470 + dy}) rotate(${rot} 360 490)">${messyPage(720, 980, 40 + i, { lines: 12 })}</g>`; });
  g += `<g id="s01-top" transform="translate(180 470) rotate(-2.5 360 490)">${messyPage(720, 980, 7, { title: "Business plan", arrows: true, figures: true, coffee: true, staple: true, lines: 12 })}</g>`;
  g += `</g></g>`;
  put("s01", `<g id="s01-cam">${g}</g>`);
};

// ------------------------------------------------------------ chalkboard (shared by S02–S04)
function board(x, y, w, h, seed, writing = true) {
  let g = `<path d="${rrect(x - 26, y - 26, w + 52, h + 52, seed, 3)}" fill="#7A5233" filter="url(#sh)"/>`;
  g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#2F5747"/>`;
  const r = PRNG(seed + 1);
  for (let i = 0; i < 6; i++) g += `<ellipse cx="${f1(x + r() * w)}" cy="${f1(y + r() * h)}" rx="${f1(120 + r() * 160)}" ry="${f1(40 + r() * 60)}" fill="#E8EBDF" opacity=".06" filter="url(#soft24)"/>`;
  if (writing) {
    g += `<g filter="url(#chalk)" opacity=".5">${hw(x + 70, y + 150, "Revenue − Costs = Profit", 70, "#E3E8DC", -1, 700)}${hw(x + 90, y + 290, "Market → Customers → Sales", 60, "#E3E8DC", 1, 500)}${hw(x + 520, y + 470, "x 12 months", 58, "#E3E8DC", -2, 500)}</g>`;
  }
  return g;
}

// ------------------------------------------------------------ S02 · Dr. Mbarga holds a page like evidence
SC.s02 = () => {
  let g = `<rect width="1080" height="1920" fill="#D6C8AE"/>`;
  g += board(60, 170, 960, 1000, 21);
  g += `<path d="M1080 0 L1080 900 L560 1920 L380 1920 Z" fill="#FFF3D6" opacity=".10"/>`;
  g += `<rect x="0" y="1196" width="1080" height="20" fill="#B9A887"/>`;
  // Mbarga
  g += `<g transform="translate(610 830) scale(1.32)"><g id="s02-mb">`;
  g += torso({ shirt: "#7C8B74", detail: `<path d="M-112 162 L-30 260 L0 186 L30 260 L112 162Z" fill="#ECE6D8"/><path d="M-14 196 L14 196 L24 420 L0 450 L-24 420Z" fill="#4A3328"/><rect x="120" y="330" width="90" height="12" rx="6" fill="#5F6D58"/><rect x="150" y="290" width="12" height="52" rx="5" fill="#2D2A33"/>` });
  g += headFront("s02mb", MB);
  g += `</g></g>`;
  // raised arm (his right, screen left): upper arm down to the elbow, forearm up to the hand
  g += `<g id="s02-arm" filter="url(#sh)">${limb("s02-up", 300, 1130, 200, 1460, 116, "#647259")}${limb("s02-fore", 200, 1460, 318, 760, 106, "#6E7C67")}<rect x="262" y="778" width="112" height="40" rx="14" fill="#ECE6D8" transform="rotate(10 318 798)"/></g>`;
  g += `<g id="s02-page" ><g transform="translate(332 708)"><g id="s02-pageSwing"><g transform="rotate(-9)"><g filter="url(#boil)"><g transform="translate(-340 -14) scale(0.47)">${messyPage(720, 980, 7, { title: "Business plan", arrows: true, figures: true, coffee: true, staple: true, lines: 12 })}</g></g></g></g></g></g>`;
  g += `<g transform="translate(330 716) rotate(-12) scale(1.15)" filter="url(#shS)">${hand({ skin: MB.skin, skinD: MB.skinD, pose: "fist" })}</g>`;
  put("s02", `<g id="s02-cam">${g}</g>`);
};

// ------------------------------------------------------------ S03 · the board: FRIDAY 10:00 · TYPED. PRINTED.
SC.s03 = () => {
  let g = `<rect width="1080" height="1920" fill="#2F5747"/>`;
  const r = PRNG(31);
  for (let i = 0; i < 10; i++) g += `<ellipse cx="${f1(r() * 1080)}" cy="${f1(r() * 1920)}" rx="${f1(160 + r() * 200)}" ry="${f1(50 + r() * 80)}" fill="#E8EBDF" opacity=".06" filter="url(#soft24)"/>`;
  g += `<g filter="url(#chalk)" opacity=".28">${hw(80, 260, "x 12 months", 80, "#E3E8DC", -2, 500)}${hw(560, 1560, "= Profit", 90, "#E3E8DC", 2, 500)}</g>`;
  g += `<rect x="0" y="0" width="1080" height="70" fill="#7A5233"/><rect x="0" y="1780" width="1080" height="140" fill="#7A5233"/><rect x="0" y="1770" width="1080" height="18" fill="#634127"/>`;
  g += `<rect x="640" y="1736" width="90" height="26" rx="10" fill="#EDEBDF"/><rect x="760" y="1740" width="60" height="22" rx="9" fill="#E3DCCB"/>`;
  const L = [["FRIDAY 10:00", 96, 690, 160, -2], ["TYPED.", 116, 960, 196, 1], ["PRINTED.", 116, 1230, 196, -1]];
  g += `<defs>${L.map((l, i) => `<clipPath id="s03c${i}"><rect id="s03r${i}" x="60" y="${l[2] - 200}" width="0" height="260"/></clipPath>`).join("")}</defs>`;
  g += `<g filter="url(#chalk)">`;
  L.forEach((l, i) => { g += `<g clip-path="url(#s03c${i})">${hw(l[1], l[2], l[0], l[3], "#EEF0E6", l[4], 700)}${i ? `<path d="M${l[1] - 6} ${l[2] + 34} C${l[1] + 200} ${l[2] + 22} ${l[1] + 480} ${l[2] + 40} ${l[1] + 700} ${l[2] + 26}" stroke="#EEF0E6" stroke-width="10" fill="none" stroke-linecap="round"/>` : ""}</g>`; });
  g += `</g>`;
  // chalk hand: the chalk tip sits at (0,0) of #s03-hand
  g += `<g id="s03-hand"><g transform="rotate(-28)"><rect x="-8" y="-8" width="58" height="22" rx="8" fill="#EEF0E6"/></g>
    ${limb("s03-forearm", 150, 170, 720, 1250, 150, "#6E7C67", 'filter="url(#sh)"')}<rect x="92" y="150" width="150" height="52" rx="18" fill="#ECE6D8" transform="rotate(62 167 176)"/>
    <g transform="translate(80 80) rotate(-30) scale(1.65)" filter="url(#shS)">${hand({ skin: MB.skin, skinD: MB.skinD, pose: "fist" })}</g></g>`;
  put("s03", `<g id="s03-cam">${g}</g>`);
};

// ------------------------------------------------------------ S04 · Mbarga to the lens, finger raised
SC.s04 = () => {
  let g = `<rect width="1080" height="1920" fill="#D6C8AE"/>`;
  g += `<g filter="url(#soft10)">${board(-60, 120, 1200, 1240, 41)}</g>`;
  g += `<g transform="translate(560 900) scale(1.95)"><g id="s04-mb">${torso({ shirt: "#7C8B74", detail: `<path d="M-112 162 L-30 260 L0 186 L30 260 L112 162Z" fill="#ECE6D8"/><path d="M-14 196 L14 196 L24 420 L0 450 L-24 420Z" fill="#4A3328"/>` })}${headFront("s04mb", MB)}</g></g>`;
  g += `<g id="s04-finger">${limb("s04-fa", 150, 2000, 230, 1330, 128, "#7C8B74")}<g transform="translate(232 1260) rotate(4) scale(1.5)">${hand({ skin: MB.skin, skinD: MB.skinD, pose: "point" })}</g></g>`;
  put("s04", `<g id="s04-cam">${g}</g>`);
};

// ------------------------------------------------------------ S05 · night: the power cuts, the phone torch carries on
function profileHead(p) {
  return `<g id="${p}-head">
    <circle cx="-70" cy="-108" r="84" fill="#1A110C"/>
    <path d="M-92 -36 C-98 -112 -30 -134 22 -126 C72 -118 100 -82 100 -40 C104 -18 114 -2 120 10 C124 18 118 24 108 26 C110 36 106 44 98 48 C102 58 96 70 84 72 C68 102 38 118 0 116 C-42 114 -82 90 -94 40Z" fill="${ND.skin}"/>
    <path d="M-96 -20 C-104 -110 -30 -142 30 -128 C70 -120 90 -100 96 -76 C60 -96 0 -96 -40 -70 C-60 -50 -70 -20 -60 20 C-80 20 -94 4 -96 -20Z" fill="#1A110C"/>
    <path d="M-88 -78 C-40 -124 50 -126 92 -86 L86 -66 C46 -100 -36 -100 -80 -58Z" fill="#C4643F"/>
    <ellipse cx="-30" cy="10" rx="16" ry="24" fill="${ND.skinD}"/>
    <g id="${p}-eye"><ellipse cx="66" cy="-14" rx="7" ry="10" fill="#1A120E"/></g>
    <rect x="48" y="-44" width="38" height="9" rx="4.5" fill="#1A110C" transform="rotate(-6 67 -40)"/>
  </g>`;
}
SC.s05 = () => {
  let g = `<rect width="1080" height="1920" fill="#1C3160"/><rect y="1500" width="1080" height="420" fill="#13244A"/>`;
  g += `<path d="${rrect(600, 250, 360, 470, 51, 2)}" fill="#13254C" filter="url(#shN)"/><rect x="624" y="274" width="312" height="422" fill="#0A1730"/>`;
  g += `<path d="M860 340 a46 46 0 1 0 30 86 a36 36 0 1 1 -30 -86Z" fill="#EDE6CF"/><circle cx="700" cy="360" r="4" fill="#EDE6CF"/><circle cx="760" cy="520" r="3" fill="#EDE6CF"/><circle cx="690" cy="610" r="3.5" fill="#EDE6CF"/>`;
  g += `<rect x="576" y="236" width="44" height="520" fill="#2A3F6E"/><rect x="940" y="236" width="44" height="520" fill="#2A3F6E"/>`;
  // fan on a stand, left
  g += `<rect x="142" y="1180" width="16" height="330" fill="#3A4560"/><ellipse cx="150" cy="1510" rx="70" ry="16" fill="#3A4560"/><circle cx="150" cy="1170" r="92" fill="none" stroke="#56627F" stroke-width="8"/>`;
  g += `<g transform="translate(150 1170)"><g id="s05-blades">${[0, 120, 240].map((a) => `<ellipse cx="0" cy="-46" rx="22" ry="44" fill="#8D97AE" transform="rotate(${a})"/>`).join("")}<circle r="14" fill="#56627F"/></g></g>`;
  // desk + pages
  g += `<rect x="420" y="1180" width="660" height="40" fill="#6B4A33"/><rect x="440" y="1220" width="620" height="290" fill="#5A3D2A"/>`;
  g += `<g filter="url(#boil)"><rect x="560" y="1166" width="300" height="14" fill="#F3EAD9"/><rect x="574" y="1158" width="280" height="10" fill="#E9DDC8"/></g>`;
  // chair + Nadège (profile, facing right)
  g += `<rect x="236" y="980" width="34" height="330" rx="12" fill="#2B1E16"/><rect x="236" y="1290" width="230" height="34" rx="12" fill="#2B1E16"/><rect x="250" y="1320" width="20" height="190" fill="#2B1E16"/><rect x="430" y="1320" width="20" height="190" fill="#2B1E16"/>`;
  g += `<path d="M300 1300 C300 1180 330 1040 410 980 L470 1000 C480 1080 470 1200 460 1300Z" fill="#C4643F"/>`;
  g += `<path d="M330 1300 L560 1300 L560 1480 L520 1480 L520 1350 L330 1350Z" fill="#3B3A52"/>`;
  g += `<g transform="translate(468 868) scale(0.92)">${profileHead("s05nd")}</g>`;
  g += `<g id="s05-arm">${limb("s05-ua", 430, 1010, 520, 1140, 74, "#C4643F")}${limb("s05-fa", 520, 1140, 660, 1166, 64, ND.skin)}<g id="s05-pen" transform="translate(668 1160)"><circle r="26" fill="${ND.skin}"/><path d="M0 0 L30 -50" stroke="#2D2A33" stroke-width="9" stroke-linecap="round"/></g></g>`;
  // lamp
  g += `<g id="s05-lampLight"><path d="M800 940 L560 1180 L1000 1180 Z" fill="url(#lampG)"/><ellipse cx="780" cy="1176" rx="240" ry="20" fill="#FFE3A8" opacity=".3"/></g>`;
  g += `<ellipse cx="960" cy="1180" rx="60" ry="14" fill="#2B2B35"/><path d="M960 1176 L900 960 L830 930" stroke="#2B2B35" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M770 900 L860 900 L880 960 L750 960Z" fill="#2B2B35"/>`;
  g += `<ellipse id="s05-bulb" cx="815" cy="962" rx="40" ry="10" fill="#FFE9B8"/>`;
  // darkness, then the torch (above the darkness)
  g += `<rect id="s05-dark" width="1080" height="1920" fill="#030915" opacity="0"/>`;
  g += `<g id="s05-torch" opacity="0"><path d="M700 1110 L560 1176 L880 1176 Z" fill="#EEF0F6" opacity=".38"/><ellipse cx="720" cy="1172" rx="170" ry="16" fill="#EEF0F6" opacity=".35"/>
    <g transform="translate(704 1100) rotate(28)"><rect x="-22" y="-44" width="44" height="88" rx="10" fill="#1C1F26"/><circle cx="0" cy="-30" r="7" fill="#FFFDF5"/></g><circle cx="704" cy="1080" r="22" fill="#FFFDF5" opacity=".5" filter="url(#soft10)"/></g>`;
  put("s05", `<g id="s05-cam">${g}</g>`);
};

// ------------------------------------------------------------ S06 · torchlight, pages piling up (top-down)
SC.s06 = () => {
  let g = `<rect width="1080" height="1920" fill="#0C1A3A"/>`;
  for (let i = 0; i < 9; i++) g += `<path d="M-20 ${120 + i * 210} C300 ${100 + i * 210} 700 ${140 + i * 210} 1100 ${118 + i * 210}" stroke="#13254C" stroke-width="5" fill="none"/>`;
  g += `<ellipse cx="560" cy="930" rx="560" ry="760" fill="url(#torchG)" opacity=".9"/>`;
  // pile (top-left), grows on beats
  g += `<g filter="url(#boil)">`;
  for (let i = 0; i < 4; i++) g += `<g id="s06-pile${i}" opacity="${i ? 0 : 1}" transform="translate(${-330 + i * 8} ${150 + i * 10}) rotate(${-8 + i * 3} 300 400)">${messyPage(600, 800, 60 + i, { lines: 10 })}</g>`;
  g += `<g id="s06-fly"><g transform="translate(210 470) rotate(2 330 450)">${messyPage(660, 900, 70, { lines: 13 })}</g></g>`;
  g += `<g id="s06-page"><g transform="translate(210 470) rotate(2 330 450)">`;
  g += `<path d="${rrect(0, 0, 660, 900, 71, 4, 40)}" fill="#F3EAD9" filter="url(#sh)"/>`;
  for (let y = 70; y < 880; y += 44) g += `<path d="M10 ${y} H650" stroke="#C7D3DF" stroke-width="2" opacity=".6"/>`;
  g += `<defs><clipPath id="s06clip"><rect id="s06-reveal" x="0" y="0" width="660" height="60"/></clipPath></defs><g clip-path="url(#s06clip)">`;
  g += hw(60, 70, "Cash flow??", 54, "#2A2320", -2, 700);
  for (let i = 0; i < 15; i++) g += scribPath(60 + (i % 4 === 2 ? 30 : 0), 140 + i * 48, 300 + ((i * 97) % 240), 300 + i, 3.6);
  g += arrow(520, 180, 600, 360, 50) + arrow(140, 640, 60, 520, -40) + hw(380, 560, "15 000", 46, "#2A2320", 4, 700) + cross(376, 522, 150, 46) + hw(420, 640, "18 500", 46, "#2A2320", -3, 700);
  g += `</g>`;
  ["6", "9", "13", "18"].forEach((n, i) => { g += `<g id="s06-pn${i}" opacity="${i ? 0 : 1}">${hw(540, 62, "p. " + n, 44, "#2A2320", 0, 700)}</g>`; });
  g += `</g></g></g>`;
  // writing hand from the bottom right
  g += `<g id="s06-hand">${limb("s06-fa", 1180, 1900, 760, 1290, 130, "#C4643F")}<g transform="translate(720 1240) rotate(-35)">${hand({ skin: ND.skin, skinD: ND.skinD, pose: "fist" })}</g><path d="M700 1220 L640 1150" stroke="#2D2A33" stroke-width="10" stroke-linecap="round"/></g>`;
  put("s06", `<g id="s06-cam">${g}</g>`);
};

// ------------------------------------------------------------ S07 · morning bench: great ideas, messy pages
SC.s07 = () => {
  let g = `<rect width="1080" height="1000" fill="#EFDDBE"/><circle cx="820" cy="250" r="88" fill="#F7CF94"/>`;
  g += `<path d="${rrect(60, 380, 640, 620, 81, 2)}" fill="#CDB48F" filter="url(#sh)"/><path d="M40 380 L720 380 L680 330 L80 330Z" fill="#B99E78"/>`;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) g += `<rect x="${110 + c * 150}" y="${430 + r * 130}" width="90" height="80" fill="#B59A73"/>`;
  g += `<rect x="900" y="560" width="40" height="440" fill="#6B4A33"/>`;
  [[920, 520, 190, "#6A874C"], [820, 600, 140, "#7C9A5A"], [1010, 640, 150, "#7C9A5A"], [930, 420, 140, "#7C9A5A"]].forEach(([x, y, r, c], i) => { g += `<path d="${roughPoly(Array.from({ length: 16 }, (_, k) => [x + Math.cos(k / 16 * 6.283) * r, y + Math.sin(k / 16 * 6.283) * r * 0.9]), 90 + i, 10, 30)}" fill="${c}"/>`; });
  g += `<rect y="1000" width="1080" height="920" fill="#D3BB94"/>`;
  // bench
  g += `<rect x="80" y="1010" width="1000" height="56" rx="6" fill="#8E5F3C"/><rect x="80" y="1084" width="1000" height="56" rx="6" fill="#9C6B44"/>`;
  [1180, 1268, 1356, 1444].forEach((y, i) => { g += `<rect x="40" y="${y}" width="1040" height="78" rx="6" fill="${i % 2 ? "#9C6B44" : "#A5734A"}"/>`; });
  g += `<rect x="120" y="1520" width="40" height="300" fill="#6E4A2E"/><rect x="980" y="1520" width="40" height="300" fill="#6E4A2E"/>`;
  // fanned pages + the table page
  g += `<g id="s07-pages" filter="url(#boil)">`;
  [[360, 1130, -14, 81], [520, 1110, 6, 82], [690, 1150, -4, 83], [840, 1120, 12, 84]].forEach(([x, y, r, s]) => { g += `<g transform="translate(${x} ${y}) rotate(${r}) scale(0.34)">${messyPage(720, 980, s, { lines: 12 })}</g>`; });
  g += `<g transform="translate(420 1230) rotate(-5) scale(0.46)">${messyPage(720, 980, 85, { title: "Cash flow", figures: true, coffee: true, lines: 6 })}
     <g transform="translate(70 560)"><path d="M0 0 H560 M0 80 H560 M0 160 H560 M190 -10 V170 M380 -10 V170" stroke="#2A2320" stroke-width="5" fill="none"/></g>${coffee(470, 640, 120, 86, 0.65)}</g>`;
  g += `</g>`;
  g += `<g transform="translate(990 1110)"><path d="M-40 -110 L40 -110 L30 0 L-30 0Z" fill="#EDE4D3" filter="url(#shS)"/><rect x="-37" y="-80" width="74" height="40" fill="#8A5A33"/><rect x="-44" y="-122" width="88" height="16" rx="6" fill="#F7F1E4"/></g>`;
  // Nadège over the shoulder
  g += `<g id="s07-nd"><path d="M-40 1920 C-30 1760 60 1690 200 1680 C360 1676 520 1740 560 1920Z" fill="#C4643F"/>
    <circle cx="210" cy="1500" r="190" fill="#1A110C"/><circle cx="130" cy="1380" r="90" fill="#22170F"/>
    <path d="M40 1520 C80 1410 340 1400 390 1520 L372 1552 C330 1450 100 1450 60 1550Z" fill="#C4643F"/><circle cx="392" cy="1600" r="12" fill="#D9A441"/></g>`;
  put("s07", `<g id="s07-cam">${g}</g>`);
};

// ------------------------------------------------------------ the order screen (simplified kopia.online)
function miniLogo(x, y, s) { // the on-white version: blue tile, white K, red copy tile
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="26" y="26" width="331" height="331" rx="74" fill="#EF2F3C"/><rect x="0" y="0" width="331" height="331" rx="74" fill="#0D5EF4"/><text x="160" y="238.5" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="206" fill="#FFFFFF">K</text></g>`;
}
function orderUI(w, h, p) { // local coords 0..w (designed at 470 wide)
  const row = (y, t, i) => `<g transform="translate(26 ${y})"><rect width="418" height="64" rx="16" fill="#FFFFFF" stroke="#E2E6EE" stroke-width="2"/><circle cx="36" cy="32" r="15" fill="#0D5EF4"/><path d="M28 32 l6 6 l11 -12" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><text x="64" y="41" font-family="Inter" font-weight="600" font-size="22" fill="#0B1B3A">${t}</text></g>`;
  let g = `<rect width="${w}" height="${h}" fill="#F5F6F9"/>`;
  g += miniLogo(26, 74, 0.13) + `<text x="84" y="108" font-family="Poppins" font-weight="600" font-size="26" fill="#0B1B3A">kopia.online</text>`;
  g += `<text x="26" y="180" font-family="Poppins" font-weight="700" font-size="30" fill="#0B1B3A">Your order</text>`;
  g += `<g transform="translate(26 206)"><rect width="418" height="120" rx="18" fill="#FFFFFF" stroke="#E2E6EE" stroke-width="2"/>${[0, 1, 2, 3].map((i) => `<rect x="${18 + i * 30}" y="${22 + (i % 2) * 6}" width="56" height="76" rx="4" fill="#F3EAD9" stroke="#D9CDB5" stroke-width="2" transform="rotate(${-6 + i * 4} ${46 + i * 30} 60)"/>`).join("")}<text x="190" y="56" font-family="Inter" font-weight="700" font-size="24" fill="#0B1B3A">18 pages</text><text x="190" y="88" font-family="Inter" font-weight="500" font-size="20" fill="#55607A">handwritten, photographed</text></g>`;
  g += row(350, "Typing + printing", 0) + row(426, "2 copies", 1) + row(502, "Delivery to the classroom", 2) + row(578, "Pay with MTN MoMo", 3);
  g += `<g id="${p}-btn" transform="translate(26 676)"><rect width="418" height="84" rx="22" fill="#0D5EF4"/><text id="${p}-btnT" x="209" y="54" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="32" fill="#F7F9FF">Order</text><text id="${p}-btnT2" x="209" y="54" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="32" fill="#F7F9FF" opacity="0">Ordered ✓</text></g>`;
  g += `<text x="${w / 2}" y="800" text-anchor="middle" font-family="Inter" font-weight="500" font-size="16" fill="#7A8399">Simplified illustration</text>`;
  return g;
}

// ------------------------------------------------------------ S08 · photograph every page, order on kopia.online
SC.s08 = () => {
  let g = `<rect width="1080" height="1920" fill="#A5734A"/>`;
  g += `<g filter="url(#boil)"><g id="s08-under" transform="translate(70 240) rotate(-4 470 650)">${messyPage(940, 1300, 85, { title: "Cash flow", figures: true, coffee: true, lines: 20, arrows: true })}</g></g>`;
  g += `<g id="s08-phone"><g transform="translate(290 430)">`;
  g += `<rect width="500" height="1010" rx="74" fill="#1C1F26" filter="url(#shL)"/><rect x="14" y="14" width="472" height="982" rx="62" fill="#0E1015"/>`;
  g += `<defs><clipPath id="s08scr"><rect x="15" y="15" width="470" height="980" rx="60"/></clipPath></defs><g clip-path="url(#s08scr)"><g transform="translate(15 15)">`;
  g += `<g id="s08-cam"><rect width="470" height="980" fill="#1A1C22"/><g filter="url(#boil)"><g id="s08-shot" transform="translate(40 150) rotate(-4 195 270) scale(0.54)">${messyPage(720, 980, 85, { title: "Cash flow", figures: true, coffee: true, lines: 14, arrows: true })}</g></g>
     <rect y="0" width="470" height="110" fill="#0E1015" opacity=".85"/><rect y="820" width="470" height="160" fill="#0E1015" opacity=".85"/><circle cx="235" cy="900" r="44" fill="none" stroke="#F3F1EC" stroke-width="7"/><circle id="s08-shutter" cx="235" cy="900" r="33" fill="#F3F1EC"/>
     <text id="s08-count" x="235" y="80" text-anchor="middle" font-family="Inter" font-weight="600" font-size="26" fill="#F3F1EC">1 / 18</text>
     <rect id="s08-flash" width="470" height="980" fill="#FBFAF6" opacity="0"/></g>`;
  g += `<g id="s08-ui" opacity="0">${orderUI(470, 980, "s08")}</g>`;
  g += `</g></g><rect x="185" y="30" width="130" height="34" rx="17" fill="#05070B"/></g></g>`;
  // hands
  g += `<g id="s08-lh">${limb("s08-lfa", -60, 1920, 210, 1300, 150, "#C4643F")}<g transform="translate(290 1180) rotate(10)"><rect x="-60" y="-120" width="110" height="250" rx="50" fill="${ND.skin}"/><rect x="-20" y="-150" width="44" height="120" rx="22" fill="${ND.skinD}"/></g></g>`;
  g += `<g id="s08-rh"><g transform="translate(0 0)">${limb("s08-rfa", 1160, 1920, 900, 1360, 150, "#C4643F")}<g id="s08-thumb" transform="translate(800 1270) rotate(-35)"><rect x="-30" y="-150" width="60" height="190" rx="30" fill="${ND.skin}"/><rect x="-60" y="10" width="140" height="150" rx="60" fill="${ND.skin}"/></g></g></g>`;
  put("s08", `<g id="s08-camera">${g}</g>`);
};

// ------------------------------------------------------------ S09 · the print shop: Serge receives the order
function printer(x, y, s, p) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="0" y="0" width="430" height="660" rx="22" fill="#D9DDE3" filter="url(#sh)"/><rect x="-10" y="-40" width="450" height="70" rx="14" fill="#C3C8D1"/>
    <rect x="30" y="80" width="370" height="40" rx="8" fill="#1E2430"/><rect x="30" y="120" width="370" height="140" fill="#C9CED6"/>
    <rect x="250" y="300" width="150" height="90" rx="12" fill="#0B1B3A"/><rect id="${p}-led" x="270" y="318" width="110" height="10" rx="5" fill="#0D5EF4"/><circle cx="290" cy="360" r="14" fill="#0D5EF4"/><circle cx="330" cy="360" r="10" fill="#56627F"/><circle cx="362" cy="360" r="10" fill="#56627F"/>
    <rect x="30" y="430" width="370" height="90" rx="10" fill="#C9CED6"/><rect x="30" y="540" width="370" height="90" rx="10" fill="#C9CED6"/><rect x="190" y="470" width="50" height="10" rx="5" fill="#9AA1AE"/><rect x="190" y="580" width="50" height="10" rx="5" fill="#9AA1AE"/>
  </g>`;
}
SC.s09 = () => {
  let g = `<rect width="1080" height="1920" fill="#E6DDCB"/>`;
  [340, 640].forEach((y) => { g += `<rect x="560" y="${y}" width="500" height="22" fill="#A97B52" filter="url(#shS)"/>`; });
  const reams = (x, y, cols) => cols.map((c, i) => `<g transform="translate(${x + i * 92} ${y})"><rect width="84" height="120" rx="4" fill="#F4EEE2" filter="url(#shS)"/><rect y="44" width="84" height="30" fill="${c}"/></g>`).join("");
  g += reams(580, 220, ["#0B1B3A", "#C9CED8", "#0D5EF4", "#C9CED8", "#0B1B3A"]) + reams(600, 520, ["#C9CED8", "#0B1B3A", "#C9CED8", "#0D5EF4"]);
  g += printer(30, 640, 1, "s09");
  g += `<g transform="translate(560 900) scale(1.18)"><g id="s09-se">${torso({ shirt: "#5B6573", detail: `<path d="M-90 162 L-20 240 L0 190 L20 240 L90 162Z" fill="#E8E2D4"/>` })}${headFront("s09se", SE)}</g></g>`;
  g += `<g id="s09-hand" opacity="0">${limb("s09-fa", 400, 1560, 500, 1070, 100, "#4E5765")}<g transform="translate(522 1012) rotate(18) scale(1.1)">${hand({ skin: SE.skin, skinD: SE.skinD, pose: "point" })}</g></g>`;
  g += `<rect x="0" y="1290" width="1080" height="30" fill="#EFE6D4"/><rect x="0" y="1318" width="1080" height="602" fill="#0B1B3A"/>`;
  g += `<rect x="830" y="1250" width="60" height="44" fill="#22262E"/><rect x="760" y="1286" width="200" height="14" rx="6" fill="#22262E"/>`;
  g += `<g transform="translate(660 940)"><rect width="380" height="320" rx="16" fill="#22262E" filter="url(#sh)"/><rect x="14" y="14" width="352" height="292" rx="8" fill="#F5F6F9"/><defs><clipPath id="s09mon"><rect x="14" y="14" width="352" height="292" rx="8"/></clipPath></defs><g clip-path="url(#s09mon)"><g id="s09-card" opacity="0"><g transform="translate(36 30) scale(0.65)">${orderUI(470, 440, "s09").replace(/Simplified illustration/, "")}</g></g></g></g>`;
  put("s09", `<g id="s09-cam">${g}</g>`);
};

// ------------------------------------------------------------ S10 · the print-seam (new component): handwriting above, set type below
SC.s10 = () => {
  let g = `<rect width="1080" height="1920" fill="#E7EBF2"/>`;
  g += `<defs><clipPath id="s10ct"><rect id="s10-typedClip" x="100" y="400" width="880" height="0"/></clipPath><clipPath id="s10ch"><rect id="s10-handClip" x="60" y="400" width="960" height="1220"/></clipPath></defs>`;
  g += `<g id="s10-doc">`;
  // handwritten version
  g += `<g clip-path="url(#s10ch)"><g filter="url(#boil)"><g transform="translate(140 400)">`;
  g += `<path d="${rrect(0, 0, 800, 1160, 101, 4, 40)}" fill="#F3EAD9" filter="url(#sh)"/>`;
  for (let y = 70; y < 1140; y += 44) g += `<path d="M10 ${y} H790" stroke="#C7D3DF" stroke-width="2" opacity=".6"/>`;
  g += hw(64, 110, "Beignets Ekobena", 66, "#2A2320", -3, 700) + hw(420, 172, "plan!!", 56, "#2A2320", 4, 700) + `<path d="M60 196 C220 186 400 206 560 192" stroke="#2A2320" stroke-width="5" fill="none"/>`;
  g += hw(64, 296, "1 - idea", 44, "#2A2320", 0, 700) + scribPath(70, 340, 560, 1001, 3.6) + scribPath(70, 384, 480, 1002, 3.6) + arrow(640, 300, 720, 420, 40);
  g += hw(64, 476, "2 - who buys?", 44, "#2A2320", -2, 700) + scribPath(70, 520, 600, 1003, 3.6) + scribPath(90, 564, 420, 1004, 3.6);
  g += hw(64, 650, "3 - cash flow", 44, "#2A2320", 1, 700);
  g += `<path d="M70 680 C300 676 520 686 730 678 M70 744 C300 750 520 738 730 746 M70 808 C300 802 520 812 730 806 M70 872 C300 876 520 866 730 874 M290 670 C292 760 286 820 292 884 M510 672 C506 760 512 820 508 882" stroke="#2A2320" stroke-width="4.5" fill="none"/>`;
  g += hw(90, 730, "Jan", 40, "#2A2320", 0, 700) + hw(320, 730, "152 000", 38, "#2A2320", -2, 700) + hw(540, 732, "96 000", 38, "#2A2320", 2, 700) + cross(316, 698, 140, 40);
  g += hw(90, 794, "Feb", 40, "#2A2320", 0, 700) + hw(330, 796, "168 000?", 38, "#2A2320", 3, 700) + hw(530, 792, "101 000", 38, "#2A2320", -3, 700);
  g += hw(90, 858, "Mar", 40, "#2A2320", 0, 700) + hw(320, 860, "181 000", 38, "#2A2320", 0, 700) + hw(536, 858, "104 000", 38, "#2A2320", 1, 700);
  g += coffee(560, 780, 110, 103, 0.6);
  g += hw(64, 980, "4 - next", 44, "#2A2320", -1, 700) + scribPath(70, 1024, 520, 1005, 3.6) + scribPath(70, 1068, 380, 1006, 3.6);
  g += `</g></g></g>`;
  // typed version (crisp, never moves)
  g += `<g clip-path="url(#s10ct)"><g transform="translate(140 400)">${cleanPage(800, 1160)}</g></g>`;
  // the seam: print head
  g += `<g id="s10-seam"><rect x="110" y="-16" width="860" height="30" rx="10" fill="#0B1B3A" filter="url(#shS)"/><rect x="110" y="12" width="860" height="7" rx="3" fill="#0D5EF4"/><rect id="s10-car" x="140" y="-30" width="120" height="44" rx="10" fill="#1C2C4F"/></g>`;
  g += `</g>`;
  put("s10", `<g id="s10-cam">${g}</g>`);
};

// ------------------------------------------------------------ S11 · the printer: two crisp copies, on the beat
SC.s11 = () => {
  let g = `<rect width="1080" height="1920" fill="#B8BEC9"/>`;
  g += `<path d="M120 800 L960 800 L1060 1920 L20 1920Z" fill="#C4CAD4"/><path d="M120 800 L960 800 L975 860 L105 860Z" fill="#AEB5C1"/>`;
  g += `<rect x="0" y="0" width="1080" height="800" fill="#D7DBE2"/><rect x="0" y="0" width="1080" height="120" fill="#C3C8D1"/><rect x="0" y="420" width="1080" height="4" fill="#BCC2CC"/>`;
  g += `<rect x="650" y="470" width="360" height="200" rx="20" fill="#0B1B3A" filter="url(#sh)"/><rect id="s11-led" x="680" y="500" width="300" height="12" rx="6" fill="#0D5EF4"/>`;
  g += `<g id="s11-btn" transform="translate(760 590)"><circle r="44" fill="#0D5EF4"/><rect x="-14" y="-20" width="28" height="36" rx="3" fill="#F7F9FF"/><rect x="-8" y="-10" width="16" height="3" fill="#0D5EF4"/><rect x="-8" y="-2" width="16" height="3" fill="#0D5EF4"/></g>`;
  g += `<circle cx="880" cy="590" r="22" fill="#56627F"/><circle cx="940" cy="590" r="22" fill="#56627F"/>`;
  g += `<rect x="80" y="742" width="920" height="66" rx="14" fill="#1E2430"/>`;
  for (let i = 0; i < 7; i++) g += `<g transform="translate(${170 + i * 120} 775)"><g class="s11-roll"><circle r="22" fill="#5A6170"/><rect x="-3" y="-20" width="6" height="40" fill="#3E4452"/><rect x="-20" y="-3" width="40" height="6" fill="#3E4452"/></g></g>`;
  g += `<defs><clipPath id="s11clip"><rect x="0" y="790" width="1080" height="1130"/></clipPath></defs><g clip-path="url(#s11clip)">`;
  for (let i = 0; i < 4; i++) g += `<g id="s11-sh${i}"><g transform="translate(160 0)">${cleanPage(760, 990, { cover: i === 0 || i === 3 })}</g></g>`;
  g += `</g>`;
  g += `<g id="s11-hand">${limb("s11-fa", 1300, 1000, 900, 700, 140, "#5B6573")}<g transform="translate(830 660) rotate(-60) scale(1.3)">${hand({ skin: SE.skin, skinD: SE.skinD, pose: "point" })}</g></g>`;
  put("s11", `<g id="s11-cam">${g}</g>`);
};

// ------------------------------------------------------------ S12 · two knocks, a sleeve, the courier
SC.s12 = () => {
  let g = `<rect width="1080" height="1920" fill="#E9DFCC"/>`;
  for (let i = 0; i < 6; i++) g += `<path d="M-20 ${200 + i * 300} C300 ${190 + i * 300} 700 ${215 + i * 300} 1100 ${198 + i * 300}" stroke="#D9CCB2" stroke-width="5" fill="none"/>`;
  g += `<rect x="0" y="0" width="1080" height="90" fill="#0B1B3A"/>`;
  g += `<g id="s12-all"><g id="s12-knock">`;
  for (let i = 0; i < 6; i++) g += `<g id="s12-p${i}"><g transform="translate(220 540)">${cleanPage(640, 832, { cover: i === 5 })}</g></g>`;
  g += `<g id="s12-sleeve" opacity="0"><rect x="196" y="520" width="690" height="880" rx="10" fill="#EAF1FB" opacity=".32" stroke="#C3D0E4" stroke-width="4"/><rect x="196" y="520" width="690" height="880" rx="10" fill="url(#sleeveG)" opacity=".5"/><path d="M220 560 L860 560" stroke="#FFFFFF" stroke-width="6" opacity=".6"/></g>`;
  g += `<g id="s12-hands"><g id="s12-lh">${limb("s12-lfa", -120, 1700, 150, 1060, 130, "#5B6573")}<g transform="translate(196 960) rotate(90) scale(1.7)">${hand({ skin: SE.skin, skinD: SE.skinD, pose: "flat" })}</g></g>
     <g id="s12-rh">${limb("s12-rfa", 1200, 1700, 930, 1060, 130, "#5B6573")}<g transform="translate(884 960) rotate(-90) scale(1.7)">${hand({ skin: SE.skin, skinD: SE.skinD, pose: "flat" })}</g></g></g>`;
  g += `</g>`;
  g += `<g id="s12-courier">${limb("s12-cfa", 1400, 700, 980, 860, 140, "#3E6B5A")}<g transform="translate(910 880) rotate(160)">${hand({ skin: COURIER.skin, skinD: COURIER.skinD, pose: "pinch" })}</g></g>`;
  g += `</g>`;
  put("s12", `<g id="s12-cam">${g}</g>`);
};

// ------------------------------------------------------------ S13 · the lecture hall: PIN check, handover
function phoneSmall(x, y, r, p) {
  return `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-46" y="-90" width="92" height="180" rx="16" fill="#1C1F26"/><rect x="-40" y="-82" width="80" height="164" rx="11" fill="#F5F6F9"/>
    <g id="${p}" opacity="0"><circle cx="0" cy="-6" r="26" fill="#0D5EF4"/><path d="M-12 -6 l8 9 l17 -19" stroke="#F7F9FF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g id="${p}-pin"><rect x="-28" y="-20" width="56" height="26" rx="8" fill="#E2E6EE"/><circle cx="-14" cy="-7" r="4" fill="#0B1B3A"/><circle cx="0" cy="-7" r="4" fill="#0B1B3A"/><circle cx="14" cy="-7" r="4" fill="#0B1B3A"/></g></g>`;
}
SC.s13 = () => {
  let g = `<rect width="1080" height="1920" fill="#D9CDB5"/><rect x="0" y="120" width="1080" height="260" fill="#EADFC8"/>`;
  for (let i = 0; i < 6; i++) g += `<rect x="${i * 190 + 30}" y="140" width="150" height="220" fill="#F3EBDB"/>`;
  const shirts = ["#8A6E5A", "#5F7A6E", "#7A6A8A", "#9A7A5E", "#5E6E8A", "#8A5E5E"];
  [[560, 0.5], [760, 0.68]].forEach(([y, s], row) => {
    for (let i = 0; i < 6; i++) { const x = 90 + i * 180 + row * 60; g += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-130 260 C-120 170 -60 150 0 150 C60 150 120 170 130 260Z" fill="${shirts[(i + row) % 6]}"/><circle r="80" fill="${["#5A3622", "#7B4A2D", "#4F2F1D", "#6A4128"][(i + row) % 4]}"/><path d="M-82 -6 C-86 -70 -40 -96 0 -96 C40 -96 86 -70 82 -6 C70 -40 40 -56 0 -56 C-40 -56 -70 -40 -82 -6Z" fill="#1A120E"/></g>`; }
    g += `<rect x="0" y="${y + 120 * s + 60}" width="1080" height="${40 * s + 20}" fill="#9C6B44"/>`;
  });
  // Nadège behind the front bench
  g += `<g transform="translate(720 1010) scale(0.98)"><g id="s13-nd">${torso({ shirt: "#C4643F", detail: `<path d="M-80 162 C-50 220 50 220 80 162Z" fill="${ND.skinD}"/>` })}${headFront("s13nd", ND)}</g></g>`;
  // courier standing left
  g += `<g transform="translate(250 800) scale(1.12)"><g id="s13-co">${torso({ shirt: "#3E6B5A" })}${headFront("s13co", COURIER)}</g></g>`;
  // front bench
  g += `<rect x="0" y="1380" width="1080" height="64" fill="#A5734A"/><rect x="0" y="1444" width="1080" height="476" fill="#86593A"/>`;
  g += phoneSmall(150, 1240, -8, "s13-ck1") + phoneSmall(930, 1300, 10, "s13-ck2");
  g += `<g id="s13-sleeve"><g transform="translate(330 1080) rotate(-6)"><rect x="-6" y="-6" width="352" height="452" rx="8" fill="#EAF1FB" opacity=".35" stroke="#C3D0E4" stroke-width="3"/>${cleanPage(340, 440, { cover: true })}</g></g>`;
  g += `<g id="s13-finger" opacity="0">${limb("s13-nfa", 860, 1180, 760, 1300, 84, "#C4643F")}<g transform="translate(730 1318) rotate(-118) scale(1.15)">${hand({ skin: ND.skin, skinD: ND.skinD, pose: "point" })}</g></g>`;
  put("s13", `<g id="s13-cam">${g}</g>`);
};

// ------------------------------------------------------------ golden hour background (S14–S16)
function golden(seed, blur) {
  let g = `<rect width="1080" height="560" fill="#F09A55"/><rect y="540" width="1080" height="340" fill="#F4B572"/><rect y="860" width="1080" height="300" fill="#F8CD94"/>`;
  g += `<circle cx="210" cy="1000" r="120" fill="#FCE2B0"/>`;
  let st = "";
  [[0, 820, 260, "#B9764A"], [240, 860, 220, "#A9653C"], [700, 830, 240, "#B9764A"], [900, 870, 220, "#A9653C"]].forEach(([x, y, w, c], i) => {
    st += `<rect x="${x}" y="${y}" width="${w}" height="${1160 - y}" fill="${c}"/><path d="M${x - 20} ${y} L${x + w + 20} ${y} L${x + w} ${y - 60} L${x} ${y - 60}Z" fill="${["#D06A22", "#2E8B57", "#7B3F8C", "#D06A22"][i]}" opacity=".85"/>`;
  });
  g += blur ? `<g filter="url(#soft10)">${st}</g>` : st;
  g += `<rect y="1150" width="1080" height="770" fill="#C98D58"/>`;
  return g;
}
// ------------------------------------------------------------ S14 · the beignet stall at golden hour
SC.s14 = () => {
  let g = golden(1, false);
  g += `<g transform="translate(600 900) scale(1.02)"><g id="s14-mm">${waxDress("s14")}${headFront("s14mm", MM)}</g></g>`;
  g += `<rect x="0" y="1240" width="1080" height="44" fill="#9A6640"/><rect x="0" y="1284" width="1080" height="636" fill="#7A4C2C"/>`;
  g += `<g transform="translate(560 1262)"><ellipse rx="250" ry="58" fill="#2B2522"/><ellipse rx="226" ry="44" fill="#8A5A20"/>`;
  [[-120, -6], [-40, 10], [40, -14], [120, 4], [-70, -22], [80, 18]].forEach(([x, y], i) => { g += `<g id="s14-b${i}"><ellipse cx="${x}" cy="${y}" rx="34" ry="20" fill="#D49A4A"/><ellipse cx="${x - 8}" cy="${y - 6}" rx="14" ry="6" fill="#E9B868"/></g>`; });
  for (let i = 0; i < 10; i++) g += `<circle class="s14-bub" cx="${-180 + i * 40}" cy="${(i % 3) * 12 - 10}" r="${5 + (i % 3) * 2}" fill="#F3D9A6" opacity="0"/>`;
  g += `</g>`;
  g += `<g id="s14-steam" opacity=".22">${[0, 1, 2].map((i) => `<path d="M${470 + i * 80} 1220 C${450 + i * 80} 1180 ${490 + i * 80} 1150 ${470 + i * 80} 1110" stroke="#FFF3E0" stroke-width="14" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
  g += `<g transform="translate(930 1220)"><path d="M-110 0 L110 0 L90 70 L-90 70Z" fill="#B88A4E"/>${[[-60, -20], [0, -24], [60, -18], [-30, -44], [30, -46]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="38" ry="22" fill="#D49A4A"/>`).join("")}</g>`;
  // Nadège enters from the left, back to camera, holding the second copy
  g += `<g id="s14-nd"><g transform="translate(250 1500)"><path d="M-300 420 C-290 260 -200 200 -60 190 C80 186 200 240 230 420Z" fill="#C4643F"/><circle cx="-30" cy="40" r="160" fill="#1A110C"/><circle cx="-110" cy="-70" r="80" fill="#22170F"/><path d="M-170 70 C-130 -30 90 -30 130 70 L116 96 C80 0 -120 0 -156 96Z" fill="#C4643F"/>
    <g transform="translate(180 -260) rotate(8)"><rect x="-6" y="-6" width="282" height="362" rx="8" fill="#EAF1FB" opacity=".35" stroke="#C3D0E4" stroke-width="3"/>${cleanPage(270, 350, { cover: true })}</g>
    <g transform="translate(200 120) rotate(-30)">${hand({ skin: ND.skin, skinD: ND.skinD, pose: "fist" })}</g></g></g>`;
  put("s14", `<g id="s14-cam">${g}</g>`);
};

// ------------------------------------------------------------ S15 · Maman: "This is my stall?"
SC.s15 = () => {
  let g = golden(2, true);
  g += `<defs><filter id="s15fF" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur id="s15bF" stdDeviation="6"/></filter><filter id="s15fP" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur id="s15bP" stdDeviation="0"/></filter></defs>`;
  g += `<g filter="url(#s15fF)"><g transform="translate(540 820) scale(1.9)"><g id="s15-mm">${waxDress("s15")}${headFront("s15mm", MM)}</g></g></g>`;
  g += `<g id="s15-wipe">${[0, 1].map((i) => `<g id="s15-wh${i}"><g transform="translate(${400 + i * 300} 1700) rotate(${i ? 20 : -20}) scale(1.4)">${hand({ skin: MM.skin, skinD: MM.skinD, pose: "open" })}<circle cx="-20" cy="-40" r="6" fill="#F3EAD9"/><circle cx="14" cy="-60" r="5" fill="#F3EAD9"/><circle cx="30" cy="-20" r="5" fill="#F3EAD9"/></g></g>`).join("")}</g>`;
  g += `<g id="s15-plan"><g filter="url(#s15fP)"><g transform="translate(110 1100) rotate(-7)">${cleanPage(560, 720, { cover: true })}
    <g transform="translate(30 690) rotate(-14) scale(1.35)" filter="url(#shS)">${hand({ skin: MM.skin, skinD: MM.skinD, pose: "fist" })}</g><g transform="translate(530 690) rotate(14) scale(1.35)" filter="url(#shS)">${hand({ skin: MM.skin, skinD: MM.skinD, pose: "fist" })}</g></g></g></g>`;
  put("s15", `<g id="s15-cam">${g}</g>`);
};

// ------------------------------------------------------------ S16 · the cash box: "Your first investor."
SC.s16 = () => {
  let g = golden(3, true);
  g += `<g transform="translate(330 800) scale(1.05)"><g id="s16-mm">${waxDress("s16")}${headFront("s16mm", MM)}</g></g>`;
  g += `<rect x="0" y="1220" width="1080" height="700" fill="#9A6640"/>`;
  for (let i = 0; i < 4; i++) g += `<rect x="0" y="${1300 + i * 160}" width="1080" height="5" fill="#7A4C2C"/>`;
  // cash box
  g += `<g transform="translate(330 1160)"><g id="s16-lid"><rect x="0" y="-150" width="320" height="150" rx="12" fill="#3E5755"/><rect x="20" y="-130" width="280" height="110" rx="8" fill="#344A48"/></g>
    <rect id="s16-inside" x="10" y="-10" width="300" height="50" fill="#22302F" opacity="0"/>
    <g id="s16-notesIn" opacity="0"><rect x="40" y="-24" width="110" height="40" rx="4" fill="#B9A27A"/><rect x="150" y="-28" width="110" height="40" rx="4" fill="#8FA37C"/></g>
    <rect x="0" y="0" width="320" height="170" rx="14" fill="#4F6D6A" filter="url(#sh)"/><rect x="140" y="40" width="40" height="30" rx="6" fill="#3E5755"/>
    <rect id="s16-lidShut" x="-6" y="-14" width="332" height="28" rx="10" fill="#5E7E7A"/></g>`;
  // Nadège, over her shoulder (right)
  g += `<g id="s16-nd"><g transform="translate(880 1060)"><g id="s16-ndHead"><circle cx="40" cy="-60" r="110" fill="#22170F"/><circle cx="0" cy="40" r="170" fill="#1A110C"/><path d="M-160 80 C-120 -30 120 -30 160 80 L146 104 C110 10 -110 10 -146 104Z" fill="#C4643F"/></g>
    <path d="M-260 900 C-250 520 -160 260 0 240 C160 240 260 400 300 900Z" fill="#C4643F"/></g></g>`;
  g += `<g id="s16-ndHand">${limb("s16-nfa", 920, 1420, 730, 1300, 120, "#C4643F")}<g transform="translate(690 1290) rotate(180)"><g id="s16-palm">${hand({ skin: ND.skin, skinD: ND.skinD, pose: "open" })}</g></g></g>`;
  g += `<g id="s16-notes" opacity="0"><g transform="rotate(-8)"><rect x="-70" y="-26" width="140" height="52" rx="5" fill="#B9A27A"/><rect x="-60" y="-16" width="120" height="6" fill="#9A855E"/><rect x="-74" y="-10" width="140" height="52" rx="5" fill="#8FA37C" transform="rotate(10)"/></g></g>`;
  g += `<g id="s16-mmHand">${limb("s16-mfa", 190, 1030, 420, 1150, 110, "#D06A22", 'filter="url(#shS)"')}<g id="s16-mmH" transform="translate(440 1160) rotate(20)">${hand({ skin: MM.skin, skinD: MM.skinD, pose: "pinch" })}</g></g>`;
  put("s16", `<g id="s16-cam">${g}</g>`);
};

// ------------------------------------------------------------ S17 · end card: the copy is the brand
SC.s17 = () => {
  let g = `<rect width="1080" height="1920" fill="#0D5EF4"/>`;
  g += `<g id="s17-lockup"><g transform="translate(-18.4 518.8) scale(0.7)">${lockup()}</g></g>`;
  g += `<defs><clipPath id="s17tc"><rect x="0" y="994" width="1080" height="84"/></clipPath><clipPath id="s17tc2"><rect x="0" y="1078" width="1080" height="88"/></clipPath></defs>`;
  g += `<g clip-path="url(#s17tc)"><text id="s17-t1" x="540" y="1058" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="66" fill="#F7F9FF" letter-spacing="-1">Your hard work,</text></g>`;
  g += `<g clip-path="url(#s17tc2)"><text id="s17-t2" x="540" y="1140" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="66" fill="#F7F9FF" letter-spacing="-1">perfectly presented.</text></g>`;
  g += `<g id="s17-url"><rect x="300" y="1236" width="480" height="104" rx="52" fill="#0B1B3A"/><text x="540" y="1304" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="48" fill="#F7F9FF">kopia.online</text></g>`;
  put("s17", g);
};

function buildScenes() { Object.keys(SC).forEach((k) => SC[k]()); }
