// ============================================================ timeline (one paused GSAP timeline, seek-safe)
buildScenes();
const $ = (s) => document.querySelector(s);
const tl = gsap.timeline({ paused: true });
const svgOf = (id) => `#${id} svg.art`;

// ---------- the per-frame driver: boil on twos, lip sync, blinks, small loops (pure functions of time)
const LN = window.LINES || [];
const RIG = { mbarga1: "s02mb", mbarga2: "s04mb", maman1: "s15mm", maman2: "s16mm" };
const BLINK = { s02mb: [2.3, 3.7], s04mb: [6.8], s09se: [16.35], s13nd: [25.5], s13co: [24.9], s14mm: [26.7], s15mm: [30.8], s16mm: [31.4], s05nd: [8.4] };
const LAUGH = { s16mm: [33.35, 33.95] };
const boilT = document.getElementById("boilT");
const byId = {}; const el = (id) => byId[id] || (byId[id] = document.getElementById(id));
const step12 = (t) => Math.floor(t * 12) / 12;
function setMouth(p, v) {
  const o = el(p + "-mOpen"), c = el(p + "-mClosed"); if (!o) return;
  const open = v > 0.06;
  o.setAttribute("opacity", open ? 1 : 0); c.setAttribute("opacity", open ? 0 : 1);
  o.setAttribute("transform", `scale(1 ${(0.3 + 0.7 * v).toFixed(3)})`);
}
function setEyes(p, s) {
  ["L", "R"].forEach((k) => { const e = el(p + "-eye" + k); if (e) e.setAttribute("transform", `scale(1 ${s})`); });
  const e = el(p + "-eye"); if (e) e.setAttribute("transform", `translate(66 -14) scale(1 ${s}) translate(-66 14)`);
}
function drive(t) {
  boilT.setAttribute("seed", String(1 + (Math.floor(t * 12) % 5)));
  // mouths
  const mv = {};
  for (const L of LN) {
    const p = RIG[L.id]; if (!p) continue;
    let v = 0;
    if (t >= L.start && t < L.end) v = L.env[Math.min(L.env.length - 1, Math.floor((t - L.start) * 30))] || 0;
    mv[p] = Math.max(mv[p] || 0, v);
  }
  for (const p in LAUGH) { const [a, b] = LAUGH[p]; if (t >= a && t < b) mv[p] = 0.55 + 0.25 * Math.abs(Math.sin((t - a) * 16)); }
  for (const p in mv) setMouth(p, mv[p]);
  // eyes
  for (const p in BLINK) {
    let s = 1;
    for (const b of BLINK[p]) if (t >= b && t < b + 0.1) s = 0.12;
    if (LAUGH[p] && t >= LAUGH[p][0] && t < LAUGH[p][1]) s = 0.35;
    setEyes(p, s);
  }
  // S05 fan: full speed, then winds down after the power cut at 7.5
  const fan = el("s05-blades");
  if (fan) { const a = t < 7.5 ? (t - 7) * 1500 : 750 + 1500 * 0.6 * (1 - Math.exp(-(t - 7.5) / 0.6)); fan.setAttribute("transform", `rotate(${(a % 360).toFixed(1)})`); }
  // S05 / S06 writing hands: small jitter on twos
  const q = step12(t);
  const a5 = el("s05-arm"); if (a5) a5.setAttribute("transform", `translate(${(5 * Math.sin(q * 23)).toFixed(1)} ${(2 * Math.sin(q * 31)).toFixed(1)})`);
  const h6 = el("s06-hand"); if (h6) { const k = Math.max(0, Math.min(1, (t - 9) / 1.9)); h6.setAttribute("transform", `translate(${(-260 + 200 * Math.abs(Math.sin(q * 5.3)) + 10 * Math.sin(q * 41)).toFixed(1)} ${(-560 + 760 * k).toFixed(1)})`); }
  // S08 photo counter
  const cnt = el("s08-count"); if (cnt) { const n = t < 13.5 ? "1" : t < 13.75 ? "6" : t < 14.0 ? "12" : "18"; if (cnt.textContent !== n + " / 18") cnt.textContent = n + " / 18"; }
  // S14 hot oil: beignets bob, bubbles pop (seeded per 1/12 s)
  for (let i = 0; i < 6; i++) { const b = el("s14-b" + i); if (b) b.setAttribute("transform", `translate(0 ${(3 * Math.sin(q * 7 + i * 1.7)).toFixed(1)})`); }
  const r = PRNG(1 + Math.floor(t * 12));
  document.querySelectorAll(".s14-bub").forEach((b) => b.setAttribute("opacity", r() < 0.35 ? 0.8 : 0));
}
const proxy = { t: 0 };
tl.to(proxy, { t: 37, duration: 37, ease: "none", onUpdate: () => drive(proxy.t) }, 0);

// ---------- helpers
const strip = (sel, at, rot = -1.2) => tl.fromTo(sel, { y: 34, opacity: 0, rotation: rot - 2.5 }, { y: 0, opacity: 1, rotation: rot, duration: 0.32, ease: "power3.out" }, at);
const stripOut = (sel, at) => tl.to(sel, { opacity: 0, y: -10, duration: 0.14, ease: "power1.in" }, at);

// ================= S01 · 0.0–1.0 the stack slams down
tl.fromTo("#s01-stack", { scale: 1.34, y: -90, rotation: 5, svgOrigin: "540 960" }, { scale: 1, y: 0, rotation: 0, duration: 0.32, ease: "power4.in" }, 0);
tl.fromTo("#s01-shadow", { opacity: 0.12, scale: 1.5, x: 90, y: 120, svgOrigin: "550 970" }, { opacity: 0.5, scale: 1, x: 0, y: 0, duration: 0.32, ease: "power4.in" }, 0);
tl.to("#s01-stack", { rotation: -1.2, svgOrigin: "540 960", duration: 0.6, ease: "power2.out" }, 0.33);
tl.fromTo("#s01-cam", { y: 0 }, { keyframes: [{ y: 10, duration: 0.05 }, { y: -5, duration: 0.07 }, { y: 2, duration: 0.07 }, { y: 0, duration: 0.08 }], ease: "power1.out" }, 0.32);

// ================= S02 · 1.0–4.1 Mbarga: "Good ideas. And I could barely read them."
tl.fromTo("#s02-cam", { scale: 1, svgOrigin: "520 900" }, { scale: 1.07, duration: 3.1, ease: "sine.inOut" }, 1.0);
tl.fromTo("#s02-pageSwing", { rotation: 5, svgOrigin: "0 0" }, { keyframes: [{ rotation: -3, duration: 1.1, ease: "sine.inOut" }, { rotation: 2, duration: 1.1, ease: "sine.inOut" }, { rotation: -1, duration: 0.9, ease: "sine.inOut" }] }, 1.0);
tl.fromTo("#s02mb-head", { rotation: -2, transformOrigin: "50% 90%" }, { rotation: 2, duration: 2.9, ease: "sine.inOut" }, 1.05);
tl.to(["#s02mb-browL", "#s02mb-browR"], { y: -8, duration: 0.25, ease: "power2.out" }, 1.25);
tl.to("#s02mb-browL", { y: 2, rotation: 13, transformOrigin: "50% 50%", duration: 0.3, ease: "power2.inOut" }, 2.55);
tl.to("#s02mb-browR", { y: 2, rotation: -13, transformOrigin: "50% 50%", duration: 0.3, ease: "power2.inOut" }, 2.55);
tl.fromTo(svgOf("s02"), { x: 0, filter: "blur(0px)" }, { x: -900, filter: "blur(14px)", duration: 0.22, ease: "power2.in" }, 3.86);

// ================= S03 · 3.85–5.95 the board
tl.fromTo(svgOf("s03"), { x: 900, filter: "blur(14px)" }, { x: 0, filter: "blur(0px)", duration: 0.24, ease: "power2.out" }, 3.86);
tl.fromTo("#s03r0", { attr: { width: 0 } }, { attr: { width: 980 }, duration: 0.72, ease: "power1.inOut" }, 4.06);
tl.fromTo("#s03r1", { attr: { width: 0 } }, { attr: { width: 760 }, duration: 0.4, ease: "power1.inOut" }, 4.86);
tl.fromTo("#s03r2", { attr: { width: 0 } }, { attr: { width: 900 }, duration: 0.42, ease: "power1.inOut" }, 5.3);
tl.fromTo("#s03-hand", { x: 1100, y: 1400 }, { x: 110, y: 650, duration: 0.2, ease: "power2.out" }, 3.86);
tl.to("#s03-hand", { x: 1010, y: 640, duration: 0.72, ease: "power1.inOut" }, 4.06);
tl.to("#s03-hand", { x: 130, y: 922, duration: 0.08, ease: "power2.inOut" }, 4.78);
tl.to("#s03-hand", { x: 830, y: 930, duration: 0.4, ease: "power1.inOut" }, 4.86);
tl.to("#s03-hand", { x: 130, y: 1192, duration: 0.04, ease: "power2.inOut" }, 5.26);
tl.to("#s03-hand", { x: 960, y: 1200, duration: 0.42, ease: "power1.inOut" }, 5.3);
tl.to(svgOf("s03"), { x: -360, filter: "blur(16px)", duration: 0.24, ease: "power2.in" }, 5.62);

// ================= S04 · 5.6–7.0 to the lens: "An investor gives you thirty seconds."
tl.fromTo(svgOf("s04"), { x: 760, filter: "blur(16px)" }, { x: 0, filter: "blur(0px)", duration: 0.34, ease: "expo.out" }, 5.62);
tl.fromTo("#s04-finger", { y: 420 }, { y: 0, duration: 0.32, ease: "power3.out" }, 5.78);
tl.fromTo("#s04-cam", { scale: 1, svgOrigin: "540 900" }, { scale: 1.05, duration: 1.4, ease: "sine.out" }, 5.6);
tl.set(["#s04mb-browL"], { rotation: 10, y: 3, transformOrigin: "50% 50%" }, 5.6);
tl.set(["#s04mb-browR"], { rotation: -10, y: 3, transformOrigin: "50% 50%" }, 5.6);
tl.fromTo("#s04mb-head", { rotation: 0, transformOrigin: "50% 90%" }, { keyframes: [{ rotation: -3, duration: 0.25 }, { rotation: 1.5, duration: 0.3 }, { rotation: 0, duration: 0.3 }], ease: "sine.inOut" }, 6.05);
tl.to("#s04-finger", { rotation: -6, svgOrigin: "230 1500", duration: 0.18, yoyo: true, repeat: 1, ease: "sine.inOut" }, 6.15);

// ================= S05 · 7.0–9.0 night: lights out, torch on
tl.fromTo("#s05-cam", { scale: 1, svgOrigin: "600 1100" }, { scale: 1.035, duration: 2, ease: "sine.inOut" }, 7.0);
tl.set("#s05-lampLight", { opacity: 1 }, 7.0);
tl.set("#s05-lampLight", { opacity: 0 }, 7.5);
tl.set("#s05-bulb", { attr: { fill: "#3A3A44" } }, 7.5);
tl.set("#s05-dark", { opacity: 0.66 }, 7.5);
tl.set("#s05-torch", { opacity: 1 }, 8.0);

// ================= S06 · 9.0–11.3 torchlight, pages pile up
tl.fromTo("#s06-reveal", { attr: { height: 60 } }, { attr: { height: 900 }, duration: 1.9, ease: "steps(14)" }, 9.0);
[1, 2, 3].forEach((i) => {
  const at = 9 + i * 0.5;
  tl.set(`#s06-pn${i - 1}`, { opacity: 0 }, at); tl.set(`#s06-pn${i}`, { opacity: 1 }, at);
  tl.fromTo("#s06-fly", { x: 0, y: 0, rotation: 0, opacity: 1, svgOrigin: "540 920" }, { x: -640, y: -330, rotation: -12, duration: 0.24, ease: "power2.in", immediateRender: false }, at - 0.24);
  tl.set("#s06-fly", { x: 0, y: 0, rotation: 0 }, at);
  tl.set(`#s06-pile${i}`, { opacity: 1 }, at);
});
tl.set("#s06-fly", { opacity: 0 }, 9.0);
tl.set("#s06-fly", { opacity: 1 }, 9.26);
tl.fromTo("#s06-cam", { scale: 1.02, svgOrigin: "540 960" }, { scale: 1, duration: 2.3, ease: "sine.out" }, 9.0);
// light leak (dawn)
tl.fromTo("#leakRect", { x: 0 }, { x: 2600, duration: 0.5, ease: "power1.inOut" }, 10.8);

// ================= S07 · 11.0–13.05 morning bench
tl.fromTo("#s07-cam", { scale: 1, svgOrigin: "560 1260" }, { scale: 1.05, duration: 1.75, ease: "sine.inOut" }, 11.0);
tl.to("#s07-cam", { scale: 1.32, svgOrigin: "560 1260", duration: 0.3, ease: "power2.in" }, 12.75);
tl.fromTo("#s07-nd", { y: 0 }, { y: 14, duration: 0.5, ease: "sine.inOut" }, 12.3);
strip("#sup1s", 11.25, -1.2); stripOut("#sup1s", 12.86);

// ================= S08 · 13.0–15.1 photograph every page, order
tl.fromTo("#s08-phone", { y: 560 }, { y: 0, duration: 0.34, ease: "power3.out" }, 13.0);
tl.fromTo(["#s08-lh", "#s08-rh"], { y: 560 }, { y: 0, duration: 0.34, ease: "power3.out" }, 13.0);
tl.fromTo("#s08-camera", { scale: 1, svgOrigin: "540 1000" }, { scale: 1.08, duration: 2.1, ease: "sine.inOut" }, 13.0);
[13.5, 13.75, 14.0].forEach((at, i) => {
  tl.fromTo("#s08-flash", { opacity: 0.95 }, { opacity: 0, duration: 0.12, ease: "power1.out", immediateRender: false }, at);
  tl.fromTo("#s08-shutter", { scale: 0.8, svgOrigin: "235 900" }, { scale: 1, duration: 0.12, ease: "power2.out", immediateRender: false }, at);
  tl.set("#s08-shot", { x: [8, -6, 4][i], y: [-6, 4, 0][i] }, at);
  tl.set("#s08-under", { x: [10, -8, 6][i] }, at);
});
tl.to("#s08-cam", { opacity: 0, duration: 0.12, ease: "none" }, 14.12);
tl.to("#s08-ui", { opacity: 1, duration: 0.12, ease: "none" }, 14.12);
strip("#sup2s", 13.5, 1.0); stripOut("#sup2s", 14.82);
tl.to("#s08-rh", { x: -322, y: 26, duration: 0.18, ease: "power2.out" }, 14.32);
tl.to("#s08-btn", { scale: 0.96, svgOrigin: "540 1163", duration: 0.06, ease: "power1.in" }, 14.5);
tl.to("#s08-btn", { scale: 1, svgOrigin: "540 1163", duration: 0.12, ease: "power2.out" }, 14.56);
tl.set("#s08-btnT", { opacity: 0 }, 14.53); tl.set("#s08-btnT2", { opacity: 1 }, 14.53);
tl.to("#s08-rh", { x: 0, y: 260, duration: 0.3, ease: "power2.in" }, 14.62);
// screen hand-off: the order card leaves the phone and lands on the shop's monitor
$("#flyCard").innerHTML = `<defs><clipPath id="flyClip"><rect width="470" height="440" rx="24"/></clipPath></defs><g filter="url(#shL)"><rect width="470" height="440" rx="24" fill="#F5F6F9"/><g clip-path="url(#flyClip)">${orderUI(470, 440, "fly").replace(/Simplified illustration/, "")}</g></g>`;
tl.fromTo("#flyCard", { x: 318, y: 455, scale: 1.04, opacity: 0 }, { opacity: 1, duration: 0.06, ease: "none" }, 14.72);
tl.to("#flyCard", { x: 696, y: 970, scale: 0.65, duration: 0.46, ease: "power3.inOut" }, 14.78);
tl.set("#s09-card", { opacity: 1 }, 15.24);
tl.set("#flyCard", { opacity: 0 }, 15.24);

// ================= S09 · 15.0–17.0 the print shop
tl.fromTo("#s09-cam", { scale: 1, svgOrigin: "560 1000" }, { scale: 1.03, duration: 1.6, ease: "sine.inOut" }, 15.0);
tl.fromTo("#s09-hand", { y: 260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" }, 15.6);
tl.to("#se-glasses", { y: -7, duration: 0.14, ease: "power2.out" }, 15.86);
tl.to("#s09-hand", { y: 300, duration: 0.3, ease: "power2.in" }, 16.08);
tl.set("#s09-hand", { opacity: 0 }, 16.4);
tl.to("#s09-cam", { scale: 3.4, svgOrigin: "850 1100", duration: 0.42, ease: "power2.in" }, 16.6);
tl.fromTo(svgOf("s10"), { opacity: 0 }, { opacity: 1, duration: 0.14, ease: "none" }, 16.9);

// ================= S10 · 16.9–19.5 the print-seam
tl.set("#s10-seam", { y: 400 }, 16.9);
tl.to("#s10-seam", { y: 1560, duration: 2.0, ease: "steps(16)" }, 17.15);
tl.to("#s10-typedClip", { attr: { height: 1160 }, duration: 2.0, ease: "steps(16)" }, 17.15);
tl.to("#s10-handClip", { attr: { y: 1560, height: 60 }, duration: 2.0, ease: "steps(16)" }, 17.15);
tl.fromTo("#s10-car", { x: 0 }, { x: 680, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 7 }, 17.15);
tl.fromTo("#s10-cam", { scale: 1, svgOrigin: "540 980" }, { scale: 1.025, duration: 2.3, ease: "sine.inOut" }, 16.9);
tl.to("#s10-seam", { opacity: 0, duration: 0.1 }, 19.16);
tl.to("#s10-doc", { y: 420, duration: 0.3, ease: "power2.in" }, 19.2);
strip("#sup3s", 17.3, -1); stripOut("#sup3s", 19.3);

// ================= S11 · 19.5–22.0 the printer, on the beat
tl.fromTo("#s11-hand", { x: 420 }, { x: 0, duration: 0.12, ease: "power3.out" }, 19.5);
tl.to("#s11-btn", { scale: 0.88, svgOrigin: "760 590", duration: 0.06, ease: "power1.in" }, 19.62);
tl.to("#s11-btn", { scale: 1, svgOrigin: "760 590", duration: 0.14, ease: "power2.out" }, 19.7);
tl.to("#s11-hand", { x: 460, duration: 0.3, ease: "power2.in" }, 19.8);
tl.fromTo(".s11-roll", { rotation: 0, transformOrigin: "50% 50%" }, { rotation: 900, duration: 2.5, ease: "none" }, 19.5);
for (let i = 0; i < 4; i++) {
  const land = i === 3 ? { x: 30, y: 852 } : { x: i * 3, y: 820 + i * 6 };
  tl.fromTo(`#s11-sh${i}`, { x: land.x, y: -260 }, { x: land.x, y: land.y, duration: 0.42, ease: "expo.out" }, 20.0 + i * 0.5);
}
for (let i = 0; i < 5; i++) tl.fromTo("#s11-led", { opacity: 1 }, { opacity: 0.45, duration: 0.25, ease: "power1.out", immediateRender: false }, 20 + i * 0.5);
tl.fromTo("#s11-cam", { scale: 1.02, svgOrigin: "540 1100" }, { scale: 1.06, duration: 2.5, ease: "sine.inOut" }, 19.5);

// ================= S12 · 22.0–24.15 two knocks, the sleeve, the courier
const mis = [[-14, 6, -2.6], [10, -8, 2.2], [-6, 10, -1.4], [12, 4, 1.8], [-10, -6, -1.2], [6, -10, 1.1]];
mis.forEach(([x, y, r], i) => { tl.fromTo(`#s12-p${i}`, { x, y, rotation: r, svgOrigin: "540 956" }, { x: x * 0.4, y: y * 0.4, rotation: r * 0.4, duration: 0.1, ease: "power2.in" }, 22.12); tl.to(`#s12-p${i}`, { x: 0, y: 0, rotation: 0, svgOrigin: "540 956", duration: 0.1, ease: "power2.in" }, 22.62); });
[22.0, 22.5].forEach((at) => {
  tl.to(["#s12-knock", "#s12-hands"], { y: -34, duration: 0.12, ease: "power2.out" }, at);
  tl.to(["#s12-knock", "#s12-hands"], { y: 0, duration: 0.1, ease: "power2.in" }, at + 0.12);
});
tl.fromTo("#s12-sleeve", { x: -760, opacity: 1 }, { x: 0, duration: 0.3, ease: "power2.out" }, 23.0);
tl.to("#s12-lh", { x: -260, duration: 0.25, ease: "power2.in" }, 23.32);
tl.to("#s12-rh", { x: 260, duration: 0.25, ease: "power2.in" }, 23.32);
tl.fromTo("#s12-courier", { x: 520 }, { x: 0, duration: 0.25, ease: "power3.out" }, 23.42);
tl.to(["#s12-knock", "#s12-sleeve", "#s12-courier"], { x: 1250, duration: 0.32, ease: "power2.in" }, 23.74);
tl.fromTo("#s12-cam", { scale: 1, svgOrigin: "540 960" }, { scale: 1.03, duration: 2.1, ease: "sine.inOut" }, 22.0);
tl.fromTo("#wipeSleeve", { x: 1100 }, { x: -1700, duration: 0.42, ease: "power1.inOut" }, 23.82);
strip("#sup4a", 23.6, -1.0); strip("#sup4b", 24.32, 0.8); stripOut(["#sup4a", "#sup4b"], 25.82);

// ================= S13 · 24.0–26.05 the lecture hall
tl.fromTo("#s13-cam", { scale: 1, svgOrigin: "540 1100" }, { scale: 1.04, duration: 1.85, ease: "sine.inOut" }, 24.0);
tl.to(["#s13-ck1-pin", "#s13-ck2-pin"], { opacity: 0, duration: 0.08 }, 24.34);
tl.fromTo(["#s13-ck1", "#s13-ck2"], { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.2, ease: "power3.out" }, 24.36);
tl.fromTo("#s13co-head", { rotation: 0, transformOrigin: "50% 90%" }, { rotation: 5, duration: 0.2, yoyo: true, repeat: 1, ease: "sine.inOut" }, 24.45);
tl.to("#s13-sleeve", { x: 250, y: 150, rotation: 9, svgOrigin: "500 1300", duration: 0.42, ease: "power2.inOut" }, 24.55);
tl.fromTo("#s13-finger", { opacity: 0, x: 0, y: 0 }, { opacity: 1, duration: 0.08 }, 25.08);
tl.to("#s13-finger", { x: -150, y: 12, duration: 0.6, ease: "sine.inOut" }, 25.15);
tl.to("#s13nd-head", { rotation: -4, transformOrigin: "50% 90%", duration: 0.5, ease: "sine.inOut" }, 25.0);
tl.to("#s13-cam", { x: -1100, duration: 0.22, ease: "power2.in" }, 25.84);

// ================= S14 · 26.0–28.05 the stall at golden hour
tl.fromTo("#s14-nd", { x: -760, y: 30 }, { x: 0, y: 0, duration: 0.85, ease: "power2.out" }, 26.0);
tl.fromTo("#s14-steam", { y: 0, opacity: 0.22 }, { y: -60, opacity: 0.34, duration: 2, ease: "sine.inOut" }, 26.0);
tl.to(["#s14mm-browL", "#s14mm-browR"], { y: -8, duration: 0.2, ease: "power2.out" }, 27.25);
tl.fromTo("#s14-cam", { scale: 1, svgOrigin: "600 1000" }, { scale: 1.04, duration: 1.6, ease: "sine.inOut" }, 26.0);
tl.to("#s14-cam", { scale: 1.3, svgOrigin: "600 900", duration: 0.42, ease: "power2.in" }, 27.62);

// ================= S15 · 28.0–31.0 "This is my stall?"
tl.fromTo("#s15-cam", { scale: 1, svgOrigin: "540 1000" }, { scale: 1.06, duration: 3, ease: "sine.inOut" }, 28.0);
tl.fromTo(["#s15-wh0", "#s15-wh1"], { y: 0 }, { keyframes: [{ y: 70, duration: 0.18 }, { y: 0, duration: 0.16 }, { y: 70, duration: 0.18 }, { y: 520, duration: 0.24 }], ease: "sine.inOut" }, 28.0);
tl.fromTo("#s15-plan", { y: 900 }, { y: 0, duration: 0.32, ease: "power3.out" }, 28.72);
tl.fromTo("#s15bF", { attr: { stdDeviation: 6 } }, { attr: { stdDeviation: 0 }, duration: 0.32, ease: "sine.inOut" }, 29.15);
tl.fromTo("#s15bP", { attr: { stdDeviation: 0 } }, { attr: { stdDeviation: 3.5 }, duration: 0.32, ease: "sine.inOut" }, 29.15);
tl.to(["#s15mm-browL", "#s15mm-browR"], { y: -12, duration: 0.2, ease: "power2.out" }, 29.1);
tl.to("#s15mm-head", { rotation: -5, transformOrigin: "50% 85%", duration: 0.4, ease: "sine.inOut" }, 30.25);
tl.to("#s15-plan", { rotation: -8, x: -70, svgOrigin: "380 1500", duration: 0.4, ease: "sine.inOut" }, 30.25);

// ================= S16 · 31.0–34.0 the cash box: "Your first investor."
tl.fromTo("#s16-cam", { scale: 1, svgOrigin: "540 1100" }, { scale: 1.03, duration: 3, ease: "sine.inOut" }, 31.0);
tl.set("#s16-lid", { scaleY: 0.12, transformOrigin: "50% 100%" }, 31.0);
tl.set("#s16-lidShut", { opacity: 1 }, 31.0);
tl.set("#s16-lidShut", { opacity: 0 }, 31.2);
tl.to("#s16-lid", { scaleY: 1, transformOrigin: "50% 100%", duration: 0.3, ease: "power2.out" }, 31.2);
tl.set(["#s16-inside", "#s16-notesIn"], { opacity: 1 }, 31.25);
tl.to("#s16-mmHand", { x: 60, y: 30, duration: 0.25, ease: "power2.out" }, 31.5);
tl.set("#s16-notesIn", { opacity: 0 }, 31.78);
tl.set("#s16-notes", { opacity: 1, x: 500, y: 1160 }, 31.78);
tl.to("#s16-mmHand", { x: 250, y: 120, duration: 0.5, ease: "power2.inOut" }, 31.82);
tl.to("#s16-notes", { x: 690, y: 1270, duration: 0.5, ease: "power2.inOut" }, 31.82);
tl.to("#s16-palm", { scaleY: 0.62, transformOrigin: "50% 50%", duration: 0.25, ease: "power2.inOut" }, 32.4);
tl.to("#s16-mmHand", { y: 140, duration: 0.25, ease: "power2.inOut" }, 32.4);
tl.to("#s16mm-head", { rotation: -6, transformOrigin: "50% 90%", duration: 0.25, ease: "power2.out" }, 33.35);
tl.to("#s16-ndHead", { rotation: 5, transformOrigin: "50% 100%", duration: 0.25, ease: "power2.out" }, 33.38);

// ================= S17 · 34.0–37.0 the copy is the brand
tl.fromTo("#lkTile", { y: -900 }, { y: 0, duration: 0.32, ease: "power4.out" }, 34.0);
tl.fromTo("#lkRed", { x: -26, y: -926 }, { x: -26, y: -26, duration: 0.32, ease: "power4.out" }, 34.0);
tl.to("#lkRed", { x: 0, y: 0, duration: 0.3, ease: "power3.out" }, 34.32);
tl.fromTo("#lkText", { y: 260 }, { y: 0, duration: 0.42, ease: "expo.out" }, 34.46);
tl.fromTo("#s17-t1", { y: 140 }, { y: 0, duration: 0.36, ease: "power3.out" }, 34.86);
tl.fromTo("#s17-t2", { y: 140 }, { y: 0, duration: 0.36, ease: "power3.out" }, 35.0);
tl.fromTo("#s17-url", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 35.24);
tl.fromTo("#s17-lockup", { scale: 1, svgOrigin: "540 760" }, { scale: 1.016, duration: 1.5, ease: "sine.inOut" }, 35.5);

document.fonts.ready.then(() => {
  drive(0);
  window.__timelines["main"] = tl;
});
