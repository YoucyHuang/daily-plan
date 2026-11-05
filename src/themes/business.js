  /* ═════ 机芯：7 套配色各是一种表盘构图（BZ[p.v]）═════
     大日历 · 计时码表 · 潜水表 · 镂空机芯 · 雕花证书 · 万年历月相 · 极简白盘 */
  PALETTES.business = [
    { name:"午夜 · 大日历", v:"grand", bg:"#0b0d10", bg2:"#1a1e24", text:"#ebe8e1", muted:"#7d838c", metal:["#7a5c26","#e9d18f","#a88437","#fff1c4","#8a6a2c"], jewel:"#a3142f", win:"#f2eee5" },
    { name:"冰川 · 计时", v:"chrono", bg:"#0c1116", bg2:"#1b232c", text:"#e9eef2", muted:"#7c8792", metal:["#6b737c","#eef1f4","#9aa3ad","#ffffff","#717a84"], jewel:"#d8283c", win:"#eef1f4" },
    { name:"深海 · 潜水", v:"diver", bg:"#06111d", bg2:"#12304a", text:"#e6eef6", muted:"#6f88a0", metal:["#5f6e7d","#e3ebf2","#8d9cab","#ffffff","#66788a"], jewel:"#ff5a3c", win:"#e9f0f6", lume:"#c9f2dc" },
    { name:"石墨 · 镂空", v:"skel", bg:"#111111", bg2:"#242120", text:"#efe7e2", muted:"#857b76", metal:["#7a4b3a","#f2c9b0","#b47a62","#ffe3d3","#8a5644"], jewel:"#b0122c", win:"#f4ece6", engrave:"#3a2219" },
    { name:"墨绿 · 雕花", v:"guil", bg:"#08140f", bg2:"#15291f", text:"#e8ece6", muted:"#7f9387", metal:["#7a5c26","#e9d18f","#a88437","#fff1c4","#8a6a2c"], jewel:"#a3142f", win:"#f0ede2" },
    { name:"钛灰 · 万年历", v:"perp", bg:"#1e2226", bg2:"#30363c", text:"#eeebe4", muted:"#8f959c", metal:["#7c6a4e","#eadbc0","#a8916c","#fff6e5","#8a775a"], jewel:"#a3142f", win:"#f3eee4", sky:"#1b2a56" },
    { name:"珍珠白 · 极简", v:"mini", bg:"#eceeef", bg2:"#f8f9f9", text:"#17191c", muted:"#7b828a", metal:["#262b31","#8b939c","#3a4148","#b5bcc4","#2b3036"], jewel:"#c4182f", win:"#ffffff" },
  ];
  PAL_SW.business = (p) => [p.bg, p.metal[1], p.v === "diver" ? p.lume : p.jewel];

  const BZ_ = (() => {
    const RAD = Math.PI / 180, f = (n) => (+n).toFixed(1);
    const foil = (M, a = 105) => `linear-gradient(${a}deg,${M[0]} 0%,${M[1]} 22%,${M[2]} 45%,${M[3]} 62%,${M[4]} 100%)`;
    const ftext = (M, a) => `background:${foil(M, a)};-webkit-background-clip:text;background-clip:text;color:transparent`;
    const stops = (M) => M.map((m, i) => `<stop offset="${[0, .22, .45, .62, 1][i]}" stop-color="${m}"/>`).join("");
    /* id = 填充用（跟着元素自己的边界框）；id+"u" = 描边用（画布坐标，竖直/水平的细线也不会消失） */
    const grad = (id, M, x2 = 1, y2 = .35) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops(M)}</linearGradient><linearGradient id="${id}u" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="420" y2="150" spreadMethod="reflect">${stops(M)}</linearGradient>`;
    const pt = (cx, cy, r, d) => [cx + Math.sin(d * RAD) * r, cy - Math.cos(d * RAD) * r];
    const line = (cx, cy, r1, r2, d, w) => { const [a, b] = pt(cx, cy, r1, d), [x, y] = pt(cx, cy, r2, d); return `<line x1="${f(a)}" y1="${f(b)}" x2="${f(x)}" y2="${f(y)}" stroke-width="${w}"/>`; };
    /* n 等分刻度，每 major 个一根长的 */
    const ticks = (cx, cy, r, n, l1, w1, major, l2, w2, skip = () => false) => Array.from({ length: n }, (_, i) => skip(i) ? "" : i % major ? line(cx, cy, r, r - l1, i * 360 / n, w1) : line(cx, cy, r, r - l2, i * 360 / n, w2)).join("");
    const rings = (cx, cy, a, b, step) => Array.from({ length: Math.max(0, Math.floor((b - a) / step)) }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${a + i * step}"/>`).join("");
    /* 指针：叶形 / 棒形 */
    const leaf = (cx, cy, deg, len, w, fill, tail = 22) => `<path d="M${cx} ${cy + tail}L${cx - w} ${cy}L${cx} ${cy - len}L${cx + w} ${cy}Z" transform="rotate(${f(deg)} ${cx} ${cy})" fill="${fill}"/>`;
    const stick = (cx, cy, deg, len, w, stroke, tail = 30) => `<line x1="${cx}" y1="${cy + tail}" x2="${cx}" y2="${cy - len}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" transform="rotate(${f(deg)} ${cx} ${cy})"/>`;
    /* 字放在圆上；rot=true 时顺着圆转 */
    const ctext = (cx, cy, r, d, txt, attrs, rot = false) => { const [x, y] = pt(cx, cy, r, d); return `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central"${rot ? ` transform="rotate(${f(((d % 360) + 360) % 360 > 90 && ((d % 360) + 360) % 360 < 270 ? d + 180 : d)} ${f(x)} ${f(y)})"` : ""} ${attrs}>${txt}</text>`; };
    const svg = (defs, inner) => `<svg class="abs" style="left:0;top:0" width="1080" height="1440" viewBox="0 0 1080 1440"><defs>${defs}</defs>${inner}</svg>`;
    /* 永远停在 10:09 —— 表盘最好看的时刻 */
    const H = 304.5, MN = 54;
    /* 勾选框：金属环 + 完成时整颗填满 */
    const ck = (c, it, s, p, { size = 42, sq = false, ring, on, mark, off } = {}) => {
      ring = ring || foil(p.metal); on = on || ring; mark = mark || p.bg; off = off || p.bg;
      const rad = sq ? "5px" : "50%", k = Math.round(size * .6);
      return c.b(it, `<span style="width:${size}px;height:${size}px;border-radius:${rad};padding:2px;box-sizing:border-box;background:${s === "x" ? p.muted : ring};display:grid"><span style="border-radius:${rad};background:${s === "c" ? on : off};display:grid;place-items:center;color:${s === "c" ? mark : p.muted}"><svg viewBox="0 0 24 24" width="${k}" height="${k}">${s ? `<path d="${L.P[s]}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</svg></span></span>`);
    };
    const tx = (c, it, s, p, style = "") => c.t(it, `flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${style}${s === "x" ? `;color:${p.muted};text-decoration:line-through;text-decoration-thickness:1.5px` : ""}`);
    const rate = (c) => c.n ? c.done / c.n : 0;
    const val = (v) => frontMode ? "—" : v;
    const genev = (o = .03) => `repeating-linear-gradient(115deg,rgba(255,255,255,${o}) 0 26px,rgba(0,0,0,${o * 1.6}) 26px 52px)`;
    const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    const roman = (n) => [["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], ["XC", 90], ["L", 50], ["XL", 40], ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]].reduce((s, [r, v]) => { while (n >= v) { s += r; n -= v; } return s; }, "");
    return { RAD, f, foil, ftext, grad, pt, line, ticks, rings, leaf, stick, ctext, svg, H, MN, ck, tx, rate, val, genev, ROMAN, roman };
  })();

  const BZ = {
    /* 0 大日历：偏心大表盘压到右边，双窗大日历 + 动力储存（= 完成率） */
    grand(c, p) {
      const B = BZ_, M = p.metal, g = "url(#bz0m)", gu = "url(#bz0mu)", cx = 712, cy = 430, R = 318, rt = B.rate(c), r = c.fit(430, 74, 36);
      const sun = Array.from({ length: 120 }, (_, i) => B.line(cx, cy, 30, R - 6, i * 3, 1)).join("");
      const idx = Array.from({ length: 12 }, (_, i) => i === 3 || i === 6 || (i >= 8 && i <= 10) ? "" : `<g transform="rotate(${i * 30} ${cx} ${cy})">${i === 0
        ? `<rect x="${cx - 19}" y="${cy - R + 26}" width="13" height="66" rx="2" fill="${g}"/><rect x="${cx + 6}" y="${cy - R + 26}" width="13" height="66" rx="2" fill="${g}"/>`
        : `<rect x="${cx - 7}" y="${cy - R + 28}" width="14" height="56" rx="2" fill="${g}"/><rect x="${cx - 2}" y="${cy - R + 32}" width="4" height="48" fill="${p.bg}" opacity=".55"/>`}</g>`).join("");
      /* 动力储存：8 点到 10 点方向的扇形刻度，指针指着完成率 */
      const px = cx - 150, py = cy, pr = 118, a0 = -140, a1 = -40;
      const pres = `<g fill="none" stroke="${gu}">${Array.from({ length: 11 }, (_, i) => B.line(px, py, pr, pr - (i % 5 ? 10 : 20), a0 + (a1 - a0) * i / 10, i % 5 ? 1.5 : 3)).join("")}</g>
        <path d="M${B.pt(px, py, pr + 8, a0).map(B.f)}A${pr + 8} ${pr + 8} 0 0 1 ${B.pt(px, py, pr + 8, a1).map(B.f)}" fill="none" stroke="${p.muted}" stroke-opacity=".5" stroke-width="2"/>
        ${frontMode ? "" : `<path d="M${B.pt(px, py, pr + 8, a0).map(B.f)}A${pr + 8} ${pr + 8} 0 0 1 ${B.pt(px, py, pr + 8, a0 + (a1 - a0) * rt).map(B.f)}" fill="none" stroke="${gu}" stroke-width="4" stroke-linecap="round"/>`}
        ${B.ctext(px, py, pr - 38, a0, "0", `font-family="Jost" font-size="18" fill="${p.muted}"`)}${B.ctext(px, py, pr - 38, a1, "100", `font-family="Jost" font-size="18" fill="${p.muted}"`)}
        <text x="${px - 4}" y="${py + 48}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="17" letter-spacing="4" fill="${p.muted}">RÉSERVE</text>
        ${B.stick(px, py, a0 + (a1 - a0) * (frontMode ? 0 : rt), pr - 14, 3, gu, 12)}<circle cx="${px}" cy="${py}" r="7" fill="${g}"/>`;
      /* 双窗大日历（3 点钟位） */
      const d = c.day || "--", wx = cx + 126, wy = cy - 40;
      const win = (x, ch) => `<rect x="${x}" y="${wy}" width="58" height="80" rx="4" fill="${p.win}" stroke="${gu}" stroke-width="3"/><text x="${x + 29}" y="${wy + 62}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="64" font-weight="600" fill="#15171a">${ch}</text>`;
      return `<div class="lc" style="background:radial-gradient(1000px 900px at 72% 18%,${p.bg2},${p.bg} 72%);color:${p.text};font-family:var(--serif)">
      <div class="abs" style="inset:0;background:${B.genev()}"></div>
      ${c.photo}
      ${B.svg(`${B.grad("bz0m", M)}<radialGradient id="bz0d" cx=".42" cy=".3" r=".8"><stop offset="0" stop-color="${p.bg2}"/><stop offset="1" stop-color="${p.bg}"/></radialGradient>`, `
        <g fill="none" stroke="${M[2]}" stroke-width="1" opacity=".08">${B.rings(cx, cy, R + 40, 1000, 10)}</g>
        <circle cx="${cx}" cy="${cy}" r="${R + 26}" fill="none" stroke="${gu}" stroke-width="22"/>
        <circle cx="${cx}" cy="${cy}" r="${R + 37}" fill="none" stroke="${M[0]}" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="url(#bz0d)" stroke="${M[0]}" stroke-width="2"/>
        <g stroke="${M[1]}" opacity=".06">${sun}</g>
        <g stroke="${gu}">${B.ticks(cx, cy, R - 4, 60, 10, 1.4, 5, 10, 3)}</g>
        ${idx}${win(wx, d[0])}${win(wx + 64, d[1])}
        ${pres}
        <text x="${cx}" y="${cy - 120}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="22" letter-spacing="8" fill="${p.muted}">GRANDE DATE</text>
        <text x="${cx}" y="${cy + 150}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="20" letter-spacing="6" fill="${p.muted}">AUTOMATIC · ${c.n} TASKS</text>
        <text x="${cx}" y="${cy + 186}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-size="22" letter-spacing="2" fill="${g}">${({ SUN: "Sunday", MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday", SAT: "Saturday" })[c.wen] || ""}</text>
        ${B.leaf(cx, cy, B.H, R - 120, 12, g, 30)}${B.leaf(cx, cy, B.MN, R - 50, 8, g, 36)}
        ${B.stick(cx, cy, 200, R - 30, 2, p.jewel, 60)}
        <circle cx="${cx}" cy="${cy}" r="15" fill="${g}"/><circle cx="${cx}" cy="${cy}" r="6" fill="${p.jewel}"/>`)}
      <div class="abs" style="left:96px;top:118px">
        <div style="font-family:var(--corm);font-weight:600;font-size:22px;letter-spacing:.46em;color:${p.muted}">DAILY<br>CALIBRE</div>
        <div style="font-size:104px;font-weight:600;letter-spacing:.06em;line-height:1.12;margin-top:40px;${B.ftext(M, 100)}">每日<br>计划</div>
        <div style="margin-top:30px;width:150px;height:2px;background:${B.foil(M)}"></div>
        <div style="font-family:var(--corm);font-size:28px;letter-spacing:.2em;color:${p.muted};margin-top:22px;line-height:1.6">${esc(c.date)}<br>${c.wen}</div>
      </div>
      <div class="abs" style="left:96px;right:96px;top:822px;display:flex;align-items:center;gap:24px;font-family:var(--corm);font-size:22px;letter-spacing:.5em;color:${p.muted}"><span>AGENDA</span><i style="flex:1;height:1px;background:${B.foil(M)}"></i><span style="${B.ftext(M)};font-weight:600">${B.val(`${c.done} / ${c.n}`)}</span></div>
      <div class="abs" style="left:96px;right:96px;top:862px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:24px;height:${r.h}px;border-bottom:1px solid color-mix(in srgb, ${p.muted} 28%, transparent)">
        <span style="width:62px;font-family:var(--corm);font-size:32px;font-weight:600;${B.ftext(M)}">${p2(i + 1)}</span>
        ${B.tx(c, it, s, p, `font-size:${r.f}px;letter-spacing:.04em`)}
        ${B.ck(c, it, s, p, { size: Math.min(42, r.h - 6) })}</div>`)}</div>
      <div class="abs" style="left:96px;right:96px;top:1322px;display:flex;justify-content:space-between;font-family:var(--corm);font-size:22px;letter-spacing:.32em;color:${p.muted}"><span>PRECISION · DISCIPLINE · TIME</span><span style="${B.ftext(M)};font-weight:600">CAL. ${c.year || ""}</span></div>
      </div>`;
    },

    /* 1 计时码表：测速外圈 + 三个小表盘（件数 / 完成 / 完成率），清单是一圈圈的「计圈」 */
    chrono(c, p) {
      const B = BZ_, M = p.metal, g = "url(#bz1m)", gu = "url(#bz1mu)", cx = 540, cy = 440, RO = 372, RI = 312, rt = B.rate(c), r = c.fit(352, 64, 34);
      const TACHY = [500, 400, 300, 250, 200, 180, 160, 140, 120, 110, 100, 90, 80, 75, 70, 65, 60];
      const tach = TACHY.map((v) => { const d = 21600 / v % 360; return B.line(cx, cy, RO - 2, RO - 14, d, 2) + B.ctext(cx, cy, RO - 34, d, v, `font-family="Jost" font-size="22" font-weight="500" fill="${g}"`, true); }).join("");
      const sub = (x, y, label, v, frac, n) => { const rr = 82;
        return `<g fill="none" stroke="${M[1]}" stroke-width=".8" opacity=".22">${B.rings(x, y, 8, rr - 4, 4)}</g>
          <circle cx="${x}" cy="${y}" r="${rr}" fill="none" stroke="${gu}" stroke-width="2"/>
          <g stroke="${M[1]}" opacity=".8">${B.ticks(x, y, rr - 4, n, 6, 1, n / 4 | 0 || 1, 13, 2.4)}</g>
          <text x="${x}" y="${y - 26}" text-anchor="middle" font-family="Jost" font-size="15" letter-spacing="4" fill="${p.muted}">${label}</text>
          <text x="${x}" y="${y + 46}" text-anchor="middle" font-family="Jost" font-size="30" font-weight="500" fill="${p.text}">${v}</text>
          ${B.stick(x, y, frac * 360, rr - 12, 3, p.jewel, 14)}<circle cx="${x}" cy="${y}" r="6" fill="${g}"/>`; };
      const push = (d) => `<g transform="rotate(${d} ${cx} ${cy})"><rect x="${cx - 22}" y="${cy - RO - 58}" width="44" height="34" rx="6" fill="${g}"/><rect x="${cx - 28}" y="${cy - RO - 30}" width="56" height="16" rx="3" fill="${M[2]}"/></g>`;
      return `<div class="lc" style="background:radial-gradient(900px 800px at 50% 30%,${p.bg2},${p.bg} 75%);color:${p.text};font-family:var(--serif)">
      <div class="abs" style="inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.018) 0 2px,transparent 2px 5px)"></div>
      ${c.photo}
      ${B.svg(`${B.grad("bz1m", M)}<radialGradient id="bz1d" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="${p.bg2}"/><stop offset="1" stop-color="${p.bg}"/></radialGradient>`, `
        ${push(-45)}${push(45)}
        <g transform="rotate(90 ${cx} ${cy})"><rect x="${cx - 30}" y="${cy - RO - 64}" width="60" height="44" rx="8" fill="${g}"/>${Array.from({ length: 7 }, (_, i) => `<line x1="${cx - 24 + i * 8}" y1="${cy - RO - 60}" x2="${cx - 24 + i * 8}" y2="${cy - RO - 24}" stroke="${M[0]}" stroke-width="2"/>`).join("")}</g>
        <circle cx="${cx}" cy="${cy}" r="${RO + 16}" fill="${g}"/>
        <circle cx="${cx}" cy="${cy}" r="${RO}" fill="${p.bg}" stroke="${M[0]}" stroke-width="2"/>
        ${tach}
        ${B.ctext(cx, cy, RO - 34, 21.5, "TACHYMETER", `font-family="Jost" font-size="13" letter-spacing="2" fill="${p.muted}"`, true)}
        <circle cx="${cx}" cy="${cy}" r="${RI}" fill="url(#bz1d)" stroke="${gu}" stroke-width="3"/>
        <g stroke="${M[1]}">${B.ticks(cx, cy, RI - 4, 240, 7, .8, 4, 14, 1.6)}</g>
        ${Array.from({ length: 12 }, (_, i) => i % 3 === 0 ? "" : `<g transform="rotate(${i * 30} ${cx} ${cy})"><rect x="${cx - 6}" y="${cy - RI + 30}" width="12" height="46" rx="2" fill="${g}"/></g>`).join("")}
        <text x="${cx}" y="${cy - 200}" text-anchor="middle" font-family="Jost" font-size="40" font-weight="500" letter-spacing="2" fill="${g}">12</text>
        ${sub(cx - 150, cy, "TASKS", c.n, Math.min(c.n, 12) / 12, 12)}${sub(cx + 150, cy, "DONE", B.val(c.done), frontMode ? 0 : Math.min(c.done, 12) / 12, 12)}${sub(cx, cy + 150, "RATE", B.val(Math.round(rt * 100) + "%"), frontMode ? 0 : rt, 20)}
        <text x="${cx}" y="${cy - 128}" text-anchor="middle" font-family="Jost" font-size="19" letter-spacing="7" fill="${p.text}">CHRONOGRAPH</text>
        <text x="${cx}" y="${cy - 100}" text-anchor="middle" font-family="Jost" font-size="15" letter-spacing="5" fill="${p.muted}">${esc(c.date)} · ${c.wen}</text>
        ${B.leaf(cx, cy, B.H, RI - 140, 10, g, 26)}${B.leaf(cx, cy, B.MN, RI - 50, 7, g, 30)}
        ${B.stick(cx, cy, frontMode ? 0 : rt * 360, RI - 10, 2.4, p.jewel, 70)}<circle cx="${B.f(B.pt(cx, cy, -58, frontMode ? 0 : rt * 360)[0])}" cy="${B.f(B.pt(cx, cy, -58, frontMode ? 0 : rt * 360)[1])}" r="9" fill="${p.jewel}"/>
        <circle cx="${cx}" cy="${cy}" r="13" fill="${g}"/><circle cx="${cx}" cy="${cy}" r="5" fill="${p.jewel}"/>`)}
      <div class="abs" style="left:96px;right:96px;top:870px;display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:18px;border-bottom:2px solid ${M[2]}">
        <div style="font-size:72px;font-weight:600;letter-spacing:.1em;line-height:1;${B.ftext(M)}">每日计划</div>
        <div style="font-family:var(--jost);font-size:22px;letter-spacing:.3em;color:${p.muted};text-align:right;line-height:1.6">LAP TIMES<br><span style="color:${p.text}">${B.val(`${c.done}/${c.n}`)} · ${B.val(Math.round(rt * 100) + "%")}</span></div>
      </div>
      <div class="abs" style="left:96px;right:96px;top:966px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:26px;height:${r.h}px;border-bottom:1px dashed color-mix(in srgb, ${p.muted} 35%, transparent)">
        <span style="width:104px;font-family:var(--jost);font-size:20px;letter-spacing:.2em;color:${p.muted}">LAP <b style="font-weight:500;font-size:28px;color:${s === "c" ? p.jewel : p.text}">${p2(i + 1)}</b></span>
        ${B.tx(c, it, s, p, `font-size:${r.f}px;letter-spacing:.03em`)}
        ${B.ck(c, it, s, p, { size: Math.min(40, r.h - 6), sq: true, on: p.jewel, mark: "#fff" })}</div>`)}</div>
      <div class="abs" style="left:96px;right:96px;top:1336px;display:flex;justify-content:space-between;font-family:var(--jost);font-size:19px;letter-spacing:.34em;color:${p.muted}"><span>START · STOP · RESET</span><span>1/5 SEC · ${c.year || ""}</span></div>
      </div>`;
    },

    /* 2 潜水表：单向旋转外圈 + 夜光刻度，右边一根深度尺，清单是下潜日志 */
    diver(c, p) {
      const B = BZ_, M = p.metal, g = "url(#bz2m)", gu = "url(#bz2mu)", cx = 372, cy = 384, RO = 292, RI = 228, rt = B.rate(c), r = c.fit(410, 70, 34), lume = p.lume;
      const knurl = Array.from({ length: 120 }, (_, i) => B.line(cx, cy, RO + 14, RO + 4, i * 3, 3)).join("");
      const bez = Array.from({ length: 60 }, (_, i) => i === 0 ? "" : i % 10 === 0 ? B.ctext(cx, cy, RO - 32, i * 6, i, `font-family="Jost" font-size="40" font-weight="500" fill="${g}"`, true)
        : i < 15 ? B.line(cx, cy, RO - 12, RO - 30, i * 6, 3) : i % 5 === 0 ? B.line(cx, cy, RO - 10, RO - 48, i * 6, 8) : "").join("");
      const idx = Array.from({ length: 12 }, (_, i) => { const [x, y] = B.pt(cx, cy, RI - 44, i * 30);
        return i === 0 ? `<path d="M${cx - 26} ${cy - RI + 14}L${cx + 26} ${cy - RI + 14}L${cx} ${cy - RI + 64}Z" fill="${lume}" stroke="${gu}" stroke-width="3"/>`
          : i % 3 === 0 ? `<g transform="rotate(${i * 30} ${cx} ${cy})"><rect x="${cx - 12}" y="${cy - RI + 14}" width="24" height="58" rx="3" fill="${lume}" stroke="${gu}" stroke-width="3"/></g>`
          : `<circle cx="${B.f(x)}" cy="${B.f(y)}" r="17" fill="${lume}" stroke="${gu}" stroke-width="3"/>`; }).join("");
      const sword = (deg, len, w) => `<g transform="rotate(${deg} ${cx} ${cy})"><path d="M${cx - w} ${cy + 20}L${cx - w} ${cy - len + 30}L${cx} ${cy - len}L${cx + w} ${cy - len + 30}L${cx + w} ${cy + 20}Z" fill="${g}"/><path d="M${cx - w + 5} ${cy - 30}L${cx - w + 5} ${cy - len + 34}L${cx} ${cy - len + 12}L${cx + w - 5} ${cy - len + 34}L${cx + w - 5} ${cy - 30}Z" fill="${lume}"/></g>`;
      /* 深度尺：0–300 米，完成率 = 今天下潜到的深度 */
      const y0 = 120, y1 = 1300, dx = 968, depth = y0 + (y1 - y0) * (frontMode ? 0 : rt);
      const gauge = Array.from({ length: 31 }, (_, i) => { const y = y0 + (y1 - y0) * i / 30;
        return `<line x1="${dx}" y1="${B.f(y)}" x2="${dx - (i % 5 ? 16 : 36)}" y2="${B.f(y)}" stroke="${i % 5 ? p.muted : M[1]}" stroke-width="${i % 5 ? 1.5 : 3}"/>${i % 5 ? "" : `<text x="${dx - 48}" y="${B.f(y + 7)}" text-anchor="end" font-family="Jost" font-size="20" fill="${p.muted}">${i * 10}</text>`}`; }).join("");
      const bubbles = [[900, 230, 9], [930, 300, 5], [884, 352, 13], [920, 430, 7], [870, 520, 4], [905, 600, 10]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="none" stroke="${M[1]}" stroke-opacity=".35" stroke-width="2"/>`).join("");
      return `<div class="lc" style="background:linear-gradient(180deg,${p.bg2} 0%,${p.bg} 62%);color:${p.text};font-family:var(--serif)">
      <div class="abs" style="inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.045) 34%,transparent 40%),linear-gradient(80deg,transparent 52%,rgba(255,255,255,.035) 56%,transparent 61%),linear-gradient(95deg,transparent 12%,rgba(255,255,255,.03) 15%,transparent 19%);mask-image:linear-gradient(180deg,#000,transparent 70%);-webkit-mask-image:linear-gradient(180deg,#000,transparent 70%)"></div>
      ${c.photo}
      ${B.svg(`${B.grad("bz2m", M)}<radialGradient id="bz2d" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="${p.bg2}"/><stop offset="1" stop-color="#030a12"/></radialGradient>`, `
        ${bubbles}
        <line x1="${dx}" y1="${y0}" x2="${dx}" y2="${y1}" stroke="${M[1]}" stroke-width="3"/>${gauge}
        <text x="${dx + 6}" y="${y0 - 30}" text-anchor="end" font-family="Jost" font-size="18" letter-spacing="4" fill="${p.muted}">DEPTH · M</text>
        ${frontMode ? "" : `<path d="M${dx + 6} ${B.f(depth)}l26 -16v32Z" fill="${p.jewel}"/><text x="1012" y="${B.f(depth - 24)}" text-anchor="end" font-family="Jost" font-size="20" font-weight="500" letter-spacing="2" fill="${p.jewel}">TODAY −${Math.round(rt * 300)}M</text>`}
        <circle cx="${cx}" cy="${cy}" r="${RO + 16}" fill="${g}"/>${`<g stroke="${M[0]}">${knurl}</g>`}
        <circle cx="${cx}" cy="${cy}" r="${RO}" fill="#040b14" stroke="${M[0]}" stroke-width="2"/>
        <g stroke="${gu}">${bez}</g>
        <path d="M${cx - 22} ${cy - RO + 8}L${cx + 22} ${cy - RO + 8}L${cx} ${cy - RO + 44}Z" fill="${g}"/><circle cx="${cx}" cy="${cy - RO + 22}" r="6" fill="${lume}"/>
        <circle cx="${cx}" cy="${cy}" r="${RI + 6}" fill="${g}"/>
        <circle cx="${cx}" cy="${cy}" r="${RI}" fill="url(#bz2d)"/>
        <g stroke="${p.text}" opacity=".8">${B.ticks(cx, cy, RI - 4, 60, 8, 1.4, 5, 0, 0)}</g>
        ${idx}
        <text x="${cx}" y="${cy - 84}" text-anchor="middle" font-family="Jost" font-size="20" letter-spacing="6" fill="${p.text}">AUTOMATIC</text>
        <text x="${cx}" y="${cy + 92}" text-anchor="middle" font-family="Jost" font-size="22" font-weight="500" letter-spacing="3" fill="${p.jewel}">300M · 1000FT</text>
        <text x="${cx}" y="${cy + 120}" text-anchor="middle" font-family="Jost" font-size="15" letter-spacing="4" fill="${p.muted}">${esc(c.date)}</text>
        ${sword(B.H, RI - 90, 15)}${sword(B.MN, RI - 30, 11)}
        <g transform="rotate(150 ${cx} ${cy})"><line x1="${cx}" y1="${cy + 50}" x2="${cx}" y2="${cy - RI + 20}" stroke="${p.jewel}" stroke-width="3"/><circle cx="${cx}" cy="${cy - RI + 64}" r="12" fill="${lume}" stroke="${p.jewel}" stroke-width="4"/></g>
        <circle cx="${cx}" cy="${cy}" r="12" fill="${g}"/>`)}
      <div class="abs" style="left:96px;top:740px;width:740px;display:flex;align-items:baseline;justify-content:space-between">
        <div style="font-size:84px;font-weight:600;letter-spacing:.08em;line-height:1;${B.ftext(M)}">每日计划</div>
        <div style="font-family:var(--jost);font-size:20px;letter-spacing:.28em;color:${p.muted};text-align:right;line-height:1.5">DIVE LOG<br><span style="color:${lume}">N° ${c.m ? p2(c.m) + p2(c.d) : "—"}</span></div>
      </div>
      <div class="abs" style="left:96px;width:740px;top:864px;border-top:2px solid ${M[2]}">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:22px;height:${r.h}px;border-bottom:1px solid color-mix(in srgb, ${p.muted} 30%, transparent)">
        <span style="width:92px;font-family:var(--jost);font-size:24px;font-weight:500;letter-spacing:.04em;color:${s === "c" ? lume : p.muted}">−${(i + 1) * 10}m</span>
        ${B.tx(c, it, s, p, `font-size:${r.f}px;letter-spacing:.03em`)}
        ${B.ck(c, it, s, p, { size: Math.min(40, r.h - 6), on: lume, mark: p.bg })}</div>`)}</div>
      <div class="abs" style="left:96px;width:740px;top:1322px;display:flex;justify-content:space-between;font-family:var(--jost);font-size:19px;letter-spacing:.3em;color:${p.muted}"><span>DECOMPRESS · BREATHE</span><span>${B.val(`${c.done}/${c.n}`)} SURFACED</span></div>
      </div>`;
    },

    /* 3 镂空机芯：发条盒、轮系、擒纵、摆轮游丝和夹板螺丝，清单刻在玫瑰金夹板上 */
    skel(c, p) {
      const B = BZ_, M = p.metal, g = "url(#bz3m)", gu = "url(#bz3mu)", f = B.f, r = c.fit(372, 64, 32);
      /* 齿轮：齿 + 镂空辐条（evenodd 挖洞，后面的齿轮能透出来） */
      const gear = (cx, cy, R, n, spokes, hub, op = 1) => {
        let d = "";
        for (let i = 0; i < n; i++) { const a = i * 360 / n, t = 360 / n;
          const q = [[R - 9, a], [R, a + t * .2], [R, a + t * .5], [R - 9, a + t * .7]].map(([rr, aa]) => B.pt(cx, cy, rr, aa).map(f).join(" "));
          d += (i ? "L" : "M") + q.join("L"); }
        d += "Z";
        const ri = R * .3, ro = R - 22, gap = Math.min(18, 360 / spokes * .25);
        for (let k = 0; k < spokes; k++) { const a1 = k * 360 / spokes + gap, a2 = (k + 1) * 360 / spokes - gap;
          const [x1, y1] = B.pt(cx, cy, ri, a1), [x2, y2] = B.pt(cx, cy, ro, a1), [x3, y3] = B.pt(cx, cy, ro, a2), [x4, y4] = B.pt(cx, cy, ri, a2);
          d += `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${ro} ${ro} 0 0 1 ${f(x3)} ${f(y3)}L${f(x4)} ${f(y4)}A${ri} ${ri} 0 0 0 ${f(x1)} ${f(y1)}Z`; }
        return `<path d="${d}" fill="${g}" fill-rule="evenodd" stroke="${M[0]}" stroke-width="1.2" opacity="${op}"/><circle cx="${cx}" cy="${cy}" r="${hub}" fill="${g}" stroke="${M[0]}" stroke-width="1.5"/>`;
      };
      const ruby = (x, y, rr = 9) => `<circle cx="${x}" cy="${y}" r="${rr + 5}" fill="${g}" stroke="${M[0]}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${rr}" fill="${p.jewel}"/><circle cx="${x - rr * .35}" cy="${y - rr * .35}" r="${rr * .3}" fill="#fff" opacity=".6"/>`;
      const screw = (x, y, a = 30, rr = 13) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="#2a3a5a" stroke="${M[0]}" stroke-width="2"/><line x1="${f(x - rr * .8 * Math.cos(a * B.RAD))}" y1="${f(y - rr * .8 * Math.sin(a * B.RAD))}" x2="${f(x + rr * .8 * Math.cos(a * B.RAD))}" y2="${f(y + rr * .8 * Math.sin(a * B.RAD))}" stroke="#0c1424" stroke-width="3.5" stroke-linecap="round"/>`;
      /* 游丝：阿基米德螺线 */
      const bx = 778, by = 640, spiral = Array.from({ length: 220 }, (_, i) => { const t = i / 220 * 14 * Math.PI, rr = 14 + i * .36; return `${i ? "L" : "M"}${f(bx + rr * Math.cos(t))} ${f(by + rr * Math.sin(t))}`; }).join("");
      const balance = `<circle cx="${bx}" cy="${by}" r="118" fill="none" stroke="${gu}" stroke-width="14"/>
        ${[0, 120, 240].map((a) => B.line(bx, by, 0, 112, a + 20, 8)).join("").replace(/<line /g, `<line stroke="${gu}" `)}
        ${Array.from({ length: 8 }, (_, i) => { const [x, y] = B.pt(bx, by, 126, i * 45 + 10); return `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="${g}" stroke="${M[0]}"/>`; }).join("")}
        <path d="${spiral}" fill="none" stroke="#7d9bd6" stroke-width="1.6" opacity=".9"/>`;
      /* 夹板：粗圆头条 + 深色倒角边 + 日内瓦波纹 */
      const bar = (pts, w) => { const d = "M" + pts.map((q) => q.join(" ")).join("L");
        return `<path d="${d}" fill="none" stroke="${M[0]}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${gu}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${M[3]}" stroke-opacity=".35" stroke-width="${w * .34}" stroke-dasharray="3 9" stroke-linecap="butt" stroke-linejoin="round"/>`; };
      const bridge = bar([[170, 330], [300, 380], [598, 300], [880, 300]], 64) + bar([[690, 560], [778, 640], [920, 600]], 54);
      return `<div class="lc" style="background:radial-gradient(900px 800px at 55% 30%,${p.bg2},${p.bg} 75%);color:${p.text};font-family:var(--serif)">
      <div class="abs" style="inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.035) 0 2px,transparent 3px) 0 0/18px 18px"></div>
      ${c.photo}
      ${B.svg(`${B.grad("bz3m", M)}<clipPath id="bz3c"><rect x="0" y="150" width="1080" height="620"/></clipPath>`, `<g clip-path="url(#bz3c)">
        ${gear(300, 380, 196, 96, 5, 34)}
        ${gear(598, 300, 112, 70, 5, 20)}
        ${gear(742, 438, 82, 56, 4, 16)}
        ${gear(470, 560, 74, 50, 4, 14, .92)}
        ${gear(880, 300, 64, 44, 4, 12)}
        ${balance}
        ${(() => { let d = ""; const ex = 610, ey = 650, n = 15; for (let i = 0; i < n; i++) { const a = i * 360 / n; d += (i ? "L" : "M") + [[30, a], [52, a + 6], [44, a + 18]].map(([rr, aa]) => B.pt(ex, ey, rr, aa).map(f).join(" ")).join("L"); } return `<path d="${d}Z" fill="${g}" stroke="${M[0]}"/><circle cx="${ex}" cy="${ey}" r="9" fill="${p.jewel}"/>`; })()}
        ${bridge}
        ${ruby(598, 300)}${ruby(742, 438)}${ruby(880, 300, 8)}${ruby(470, 560, 8)}${ruby(778, 640, 10)}${ruby(300, 380, 12)}
        ${screw(170, 330)}${screw(420, 225, -20)}${screw(640, 360, 60)}${screw(920, 600, 10)}${screw(690, 560, 45)}
      </g>
      <text x="1000" y="140" text-anchor="end" font-family="Cormorant Garamond,serif" font-size="22" letter-spacing="8" fill="${p.muted}">SQUELETTE · ${c.n + 17} JEWELS</text>`)}
      <div class="abs" style="left:90px;top:74px;font-size:66px;font-weight:600;letter-spacing:.14em;line-height:1;${B.ftext(M)}">每日计划</div>
      <div class="abs" style="left:70px;right:70px;top:800px;height:560px;border-radius:30px 30px 30px 120px;background:radial-gradient(circle at 8px 8px,rgba(255,255,255,.22) 0 5px,rgba(0,0,0,.08) 6px,transparent 9px) 0 0/22px 22px,${B.foil(M, 120)};box-shadow:0 -2px 0 ${M[3]} inset,0 3px 0 ${M[0]} inset,0 30px 60px rgba(0,0,0,.5);color:${p.engrave};text-shadow:0 1px 0 rgba(255,255,255,.4),0 -1px 0 rgba(0,0,0,.25)"></div>
      <div class="abs" style="left:70px;right:70px;top:800px;height:560px;color:${p.engrave};text-shadow:0 1px 0 rgba(255,255,255,.45),0 -1px 0 rgba(0,0,0,.28)">
        <div style="position:absolute;left:46px;top:40px;right:46px;display:flex;justify-content:space-between;align-items:baseline;font-family:var(--corm);font-weight:600;font-size:24px;letter-spacing:.34em"><span>TODAY'S MOVEMENT</span><span>${esc(c.date)} · ${c.wen}</span></div>
        <div style="position:absolute;left:46px;right:46px;top:96px;height:2px;background:${p.engrave};opacity:.5"></div>
        <div style="position:absolute;left:70px;right:56px;top:120px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:22px;height:${r.h}px;border-bottom:1px solid rgba(58,34,25,.25)">
          <span style="width:46px;font-family:var(--corm);font-weight:600;font-size:28px">${p2(i + 1)}</span>
          ${c.t(it, `flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:${r.f}px;font-weight:600;letter-spacing:.04em;${s === "x" ? "opacity:.5;text-decoration:line-through" : ""}`)}
          ${c.b(it, `<span style="width:${Math.min(40, r.h - 6)}px;height:${Math.min(40, r.h - 6)}px;border-radius:50%;display:grid;place-items:center;background:${s === "c" ? `radial-gradient(circle at 35% 30%,#ff8aa0,${p.jewel} 55%,#5a0614)` : "rgba(58,34,25,.18)"};box-shadow:inset 0 2px 3px rgba(0,0,0,.45),0 1px 0 rgba(255,255,255,.5);color:${s === "c" ? "#fff" : p.engrave}"><svg viewBox="0 0 24 24" width="22" height="22">${s ? `<path d="${L.P[s]}" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</svg></span>`)}</div>`)}</div>
        <div style="position:absolute;left:150px;right:46px;bottom:26px;display:flex;justify-content:space-between;font-family:var(--corm);font-weight:600;font-size:20px;letter-spacing:.3em"><span>HAND-FINISHED · ${B.val(`${c.done}/${c.n}`)}</span><span>CAL. ${c.year || ""}</span></div>
        ${[[24, 24], [1000 - 40 - 70 + 12, 24], [1000 - 40 - 70 + 12, 516]].map(([x, y]) => `<span style="position:absolute;left:${x}px;top:${y}px;width:22px;height:22px;border-radius:50%;background:#2a3a5a;box-shadow:inset 0 0 0 2px ${M[0]}"><i style="position:absolute;left:3px;right:3px;top:9px;height:4px;background:#0c1424;transform:rotate(35deg);border-radius:2px"></i></span>`).join("")}
      </div>
      </div>`;
    },

    /* 4 雕花证书：玫瑰花纹（guilloché）表盘 + 罗马数字 + 宝玑针，清单像一张刻版证书 */
    guil(c, p) {
      const B = BZ_, M = p.metal, g = "url(#bz4m)", gu = "url(#bz4mu)", cx = 540, cy = 360, R = 232, r = c.fit(376, 66, 34);
      const rose = Array.from({ length: 96 }, (_, i) => { const [x, y] = B.pt(cx, cy, R * .48, i * 3.75); return `<circle cx="${B.f(x)}" cy="${B.f(y)}" r="${B.f(R * .5)}"/>`; }).join("");
      const rose2 = Array.from({ length: 48 }, (_, i) => { const [x, y] = B.pt(cx, cy, R * .2, i * 7.5); return `<circle cx="${B.f(x)}" cy="${B.f(y)}" r="${B.f(R * .2)}"/>`; }).join("");
      const breguet = (deg, len, w) => `<g transform="rotate(${deg} ${cx} ${cy})" fill="${g}" stroke="${gu}"><line x1="${cx}" y1="${cy + 26}" x2="${cx}" y2="${cy - len}" stroke-width="${w}"/><circle cx="${cx}" cy="${cy - len * .74}" r="${w * 3.6}" fill="none" stroke-width="${w * 1.1}"/><path d="M${cx - w * 1.6} ${cy - len + 22}L${cx} ${cy - len - 8}L${cx + w * 1.6} ${cy - len + 22}Z" stroke="none"/></g>`;
      const frame = (i) => `inset:${i}px;border:${i === 40 ? 3 : 1}px solid transparent;border-image:${B.foil(M)} 1`;
      const medal = (x, y, rr) => `<svg class="abs" style="left:${x - rr}px;top:${y - rr}px" width="${rr * 2}" height="${rr * 2}" viewBox="${-rr} ${-rr} ${rr * 2} ${rr * 2}"><circle r="${rr - 2}" fill="${p.bg2}" stroke="${gu}" stroke-width="3"/><g fill="none" stroke="${M[1]}" stroke-width=".6" opacity=".6">${Array.from({ length: 40 }, (_, i) => { const a = i * 9 * B.RAD; return `<circle cx="${(Math.sin(a) * rr * .3).toFixed(1)}" cy="${(-Math.cos(a) * rr * .3).toFixed(1)}" r="${(rr * .52).toFixed(1)}"/>`; }).join("")}</g><circle r="${rr * .42}" fill="${p.bg2}" stroke="${gu}" stroke-width="1.5"/><text y="9" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="${rr * .4}" font-weight="600" fill="${g}">${frontMode ? "N°" : c.done}</text></svg>`;
      return `<div class="lc" style="background:radial-gradient(900px 900px at 50% 26%,${p.bg2},${p.bg} 72%);color:${p.text};font-family:var(--serif)">
      ${c.photo}
      <div class="abs" style="${frame(40)}"></div><div class="abs" style="${frame(52)}"></div>
      ${B.svg(`${B.grad("bz4m", M)}<radialGradient id="bz4d" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="${M[3]}" stop-opacity=".25"/><stop offset="1" stop-color="${p.bg}" stop-opacity="0"/></radialGradient>`, `
        ${[[52, 52], [1028, 52], [52, 1388], [1028, 1388]].map(([x, y]) => `<g transform="translate(${x} ${y})" fill="none" stroke="${gu}" stroke-width="1.5"><circle r="22"/><circle r="12"/>${Array.from({ length: 8 }, (_, i) => `<ellipse rx="22" ry="7" transform="rotate(${i * 22.5})"/>`).join("")}</g>`).join("")}
        <circle cx="${cx}" cy="${cy}" r="${R + 78}" fill="none" stroke="${gu}" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="${R + 72}" fill="none" stroke="${gu}" stroke-width="1"/>
        <g stroke="${gu}">${B.ticks(cx, cy, R + 72, 60, 8, 1.2, 5, 8, 1.2)}</g>
        ${B.ROMAN.map((t, i) => B.ctext(cx, cy, R + 38, i * 30, t, `font-family="Cormorant Garamond,serif" font-size="${i === 0 ? 46 : 38}" font-weight="600" fill="${g}"`, true)).join("")}
        <circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="none" stroke="${gu}" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="${p.bg2}"/>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#bz4d)"/>
        <g fill="none" stroke="${M[1]}" stroke-width=".7" opacity=".55">${rose}</g>
        <circle cx="${cx}" cy="${cy}" r="${R * .42}" fill="${p.bg2}" stroke="${gu}" stroke-width="1.2"/>
        <g fill="none" stroke="${M[1]}" stroke-width=".6" opacity=".5">${rose2}</g>
        <g fill="none" stroke="${M[1]}" stroke-width=".7" opacity=".4">${B.rings(cx, cy, R - 26, R, 4)}</g>
        <text x="${cx}" y="${cy - R * .55}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-style="italic" font-size="26" letter-spacing="2" fill="${g}">Guilloché</text>
        <text x="${cx}" y="${cy + R * .62}" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="18" letter-spacing="6" fill="${M[1]}" opacity=".75">${c.wen ? c.wen + " · " : ""}${c.year || ""}</text>
        ${breguet(B.H, R - 70, 5)}${breguet(B.MN, R - 18, 3.6)}
        <circle cx="${cx}" cy="${cy}" r="12" fill="${g}"/><circle cx="${cx}" cy="${cy}" r="4" fill="${p.jewel}"/>`)}
      <div class="abs" style="left:110px;right:110px;top:712px;text-align:center">
        <div style="font-family:var(--corm);font-weight:600;font-size:22px;letter-spacing:.62em;color:${p.muted}">CERTIFICAT DE DISCIPLINE</div>
        <div style="font-size:78px;font-weight:600;letter-spacing:.3em;line-height:1.2;margin-top:12px;${B.ftext(M)}">每日计划</div>
        <div style="display:flex;align-items:center;gap:20px;margin-top:10px;font-family:var(--corm);font-size:24px;letter-spacing:.3em;color:${p.muted}"><i style="flex:1;height:1px;background:${B.foil(M)}"></i>${esc(c.date)}<i style="flex:1;height:1px;background:${B.foil(M)}"></i></div>
      </div>
      <div class="abs" style="left:130px;right:130px;top:888px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:18px;height:${r.h}px">
        <span style="width:76px;text-align:right;font-family:var(--corm);font-size:30px;font-weight:600;font-style:italic;${B.ftext(M)}">${B.roman(i + 1)}.</span>
        ${c.t(it, `flex:0 1 auto;min-width:0;max-width:560px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:${r.f}px;letter-spacing:.06em;${s === "x" ? `color:${p.muted};text-decoration:line-through;text-decoration-thickness:1.5px` : ""}`)}
        <i style="flex:1;min-width:20px;border-bottom:2px dotted color-mix(in srgb, ${p.muted} 70%, transparent);transform:translateY(${Math.round(r.f * .3)}px)"></i>
        ${B.ck(c, it, s, p, { size: Math.min(38, r.h - 6), sq: true })}</div>`)}</div>
      <div class="abs" style="left:130px;top:1312px;font-family:var(--corm);font-size:20px;letter-spacing:.3em;color:${p.muted}">VÉRIFIÉ · ${B.val(`${c.done} / ${c.n}`)}<div style="margin-top:12px;width:300px;height:1px;background:${B.foil(M)}"></div></div>
      ${medal(540, 1318, 56)}
      <div class="abs" style="right:130px;top:1312px;text-align:right;font-family:var(--corm);font-size:20px;letter-spacing:.3em;color:${p.muted}">N° ${c.year ? c.year + "·" + p2(c.m) + p2(c.d) : "—"}<div style="margin-top:12px;margin-left:auto;width:300px;height:1px;background:${B.foil(M)}"></div></div>
      </div>`;
    },

    /* 5 万年历：星期 / 日期 / 月份三个小盘 + 月相，指针都指着今天；清单行像一排日历窗 */
    perp(c, p) {
      const B = BZ_, M = p.metal, g = "url(#bz5m)", gu = "url(#bz5mu)", cx = 540, cy = 452, R = 346, sr = 104, r = c.fit(340, 62, 32);
      const WD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"], MO = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const wd = Math.max(0, WD.indexOf(c.wen));
      const subd = (x, y, labels, at, extra = "") => `<circle cx="${x}" cy="${y}" r="${sr}" fill="${p.bg}" stroke="${gu}" stroke-width="2.5"/>
        <g fill="none" stroke="${M[1]}" stroke-width=".7" opacity=".18">${B.rings(x, y, 6, sr - 6, 4)}</g>
        <g stroke="${M[1]}">${B.ticks(x, y, sr - 4, labels.length, 6, 1.2, 1, 6, 1.2)}</g>
        ${labels.map((t, i) => t === "" ? "" : B.ctext(x, y, sr - 30, i * 360 / labels.length, t, `font-family="Jost" font-size="${t.length > 2 ? 15 : 17}" font-weight="500" letter-spacing="1" fill="${p.text}"`)).join("")}
        ${extra}
        ${B.leaf(x, y, at * 360 / labels.length, sr - 42, 5, g, 16)}<circle cx="${x}" cy="${y}" r="7" fill="${g}"/><circle cx="${x}" cy="${y}" r="2.5" fill="${p.jewel}"/>`;
      const dates = Array.from({ length: 31 }, (_, i) => [5, 10, 15, 20, 25, 30].includes(i + 1) || i === 0 ? String(i + 1) : "");
      /* 月相 */
      const t = c.year ? Date.UTC(c.year, c.m - 1, c.d, 12) : Date.now();
      const age = (((t - Date.UTC(2000, 0, 6, 18, 14)) / 864e5) % 29.530588 + 29.530588) % 29.530588;
      const mx = cx, my = cy + 196, mr = 84, ma = -90 + age / 29.530588 * 180;
      const moon = (a) => { const [x, y] = B.pt(mx, my + 40, 70, a); return `<circle cx="${B.f(x)}" cy="${B.f(y)}" r="32" fill="url(#bz5mo)"/><g fill="${M[0]}" opacity=".28"><circle cx="${B.f(x - 9)}" cy="${B.f(y - 6)}" r="6"/><circle cx="${B.f(x + 10)}" cy="${B.f(y + 8)}" r="4"/><circle cx="${B.f(x + 4)}" cy="${B.f(y - 14)}" r="3"/></g>`; };
      const stars = Array.from({ length: 22 }, (_, i) => { const R2 = rng(77 + i); const [x, y] = B.pt(mx, my + 40, 30 + R2() * 90, R2() * 360); return `<circle cx="${B.f(x)}" cy="${B.f(y)}" r="${(1 + R2() * 1.8).toFixed(1)}" fill="${M[3]}"/>`; }).join("");
      const moonph = `<g clip-path="url(#bz5ap)"><circle cx="${mx}" cy="${my + 40}" r="${mr + 40}" fill="${p.sky}"/>${stars}${moon(ma)}${moon(ma + 180)}</g>
        <circle cx="${mx - 52}" cy="${my + 40}" r="38" fill="${p.bg}"/><circle cx="${mx + 52}" cy="${my + 40}" r="38" fill="${p.bg}"/>
        <path d="M${mx - mr} ${my + 40}A${mr} ${mr} 0 0 1 ${mx + mr} ${my + 40}" fill="none" stroke="${gu}" stroke-width="3"/>
        <line x1="${mx - mr - 6}" y1="${my + 40}" x2="${mx + mr + 6}" y2="${my + 40}" stroke="${gu}" stroke-width="3"/>
        <text x="${mx}" y="${my + 74}" text-anchor="middle" font-family="Jost" font-size="15" letter-spacing="5" fill="${p.muted}">PHASE DE LUNE · ${Math.round(age)}</text>`;
      return `<div class="lc" style="background:linear-gradient(180deg,${p.bg2},${p.bg} 60%);color:${p.text};font-family:var(--serif)">
      <div class="abs" style="inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.02) 0 1px,transparent 1px 4px)"></div>
      ${c.photo}
      ${B.svg(`${B.grad("bz5m", M)}<radialGradient id="bz5mo" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${M[3]}"/><stop offset=".6" stop-color="${M[1]}"/><stop offset="1" stop-color="${M[2]}"/></radialGradient>
        <clipPath id="bz5ap"><path d="M${mx - mr} ${my + 40}A${mr} ${mr} 0 0 1 ${mx + mr} ${my + 40}Z"/></clipPath>
        <radialGradient id="bz5d" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="${p.bg2}"/><stop offset="1" stop-color="${p.bg}"/></radialGradient>`, `
        <circle cx="${cx}" cy="${cy}" r="${R + 22}" fill="${g}"/>
        <circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="url(#bz5d)" stroke="${M[0]}" stroke-width="2"/>
        <g stroke="${gu}">${B.ticks(cx, cy, R - 4, 60, 9, 1.4, 5, 30, 4)}</g>
        ${subd(cx, cy - 190, MO, c.m ? c.m - 1 : 0, `<text x="${cx}" y="${cy - 190 + 40}" text-anchor="middle" font-family="Jost" font-size="13" letter-spacing="3" fill="${p.muted}">LEAP ${c.year ? c.year % 4 || 4 : ""}</text>`)}
        ${subd(cx - 194, cy + 6, WD, wd)}
        ${subd(cx + 194, cy + 6, dates, c.d ? c.d - 1 : 0)}
        ${moonph}
        ${B.leaf(cx, cy, B.H, R - 150, 9, g, 26)}${B.leaf(cx, cy, B.MN, R - 50, 6, g, 30)}
        <circle cx="${cx}" cy="${cy}" r="12" fill="${g}"/><circle cx="${cx}" cy="${cy}" r="4" fill="${p.jewel}"/>`)}
      <div class="abs" style="left:96px;right:96px;top:56px;display:flex;justify-content:space-between;font-family:var(--jost);font-size:18px;letter-spacing:.4em;color:${p.muted}"><span>QUANTIÈME PERPÉTUEL</span><span>${c.year || ""}</span></div>
      <div class="abs" style="left:96px;right:96px;top:864px;display:flex;align-items:flex-end;justify-content:space-between">
        <div style="font-size:74px;font-weight:600;letter-spacing:.12em;line-height:1;${B.ftext(M)}">每日计划</div>
        <div style="display:flex;gap:10px">${[c.wen || "—", c.day || "—", c.mon || "—"].map((x) => `<span style="min-width:72px;height:54px;padding:0 10px;box-sizing:border-box;display:grid;place-items:center;background:${p.win};color:#1a1a1a;font-family:var(--jost);font-weight:500;font-size:26px;letter-spacing:.08em;border:3px solid ${M[2]};border-radius:4px;box-shadow:inset 0 3px 6px rgba(0,0,0,.35)">${x}</span>`).join("")}</div>
      </div>
      <div class="abs" style="left:96px;right:96px;top:950px;border-top:2px solid ${M[2]}">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:22px;height:${r.h}px;border-bottom:1px solid color-mix(in srgb, ${p.muted} 30%, transparent)">
        <span style="width:50px;height:${Math.min(40, r.h - 12)}px;display:grid;place-items:center;background:${s === "c" ? B.foil(M) : p.win};color:#1a1a1a;font-family:var(--jost);font-weight:500;font-size:22px;border-radius:3px;box-shadow:inset 0 2px 4px rgba(0,0,0,.35)">${i + 1}</span>
        ${B.tx(c, it, s, p, `font-size:${r.f}px;letter-spacing:.04em`)}
        ${B.ck(c, it, s, p, { size: Math.min(38, r.h - 6) })}</div>`)}</div>
      <div class="abs" style="left:96px;right:96px;top:1336px;display:flex;justify-content:space-between;font-family:var(--jost);font-size:18px;letter-spacing:.34em;color:${p.muted}"><span>DAY · DATE · MONTH · MOON</span><span>${B.val(`${c.done}/${c.n}`)}</span></div>
      </div>`;
    },

    /* 6 极简白盘：一块巨大的白表盘从顶上探出来，只露下半圈；发丝刻度、细针、大片留白 */
    mini(c, p) {
      const B = BZ_, cx = 540, cy = 96, R = 590, ink = p.text, r = c.fit(372, 64, 32);
      const nums = [4, 5, 6, 7, 8].map((n) => B.ctext(cx, cy, R - 70, n * 30, n, `font-family="Jost" font-size="44" fill="${ink}"`)).join("");
      return `<div class="lc" style="background:${p.bg};color:${ink};font-family:var(--sans)">
      ${c.photo}
      ${B.svg(`<radialGradient id="bz6d" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${p.bg2}"/></radialGradient>`, `
        <circle cx="${cx + 6}" cy="${cy + 14}" r="${R + 34}" fill="rgba(0,0,0,.06)"/>
        <circle cx="${cx}" cy="${cy}" r="${R + 34}" fill="#f4f5f6" stroke="${p.muted}" stroke-opacity=".45" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#bz6d)" stroke="${ink}" stroke-width="1.5"/>
        <g stroke="${ink}">${B.ticks(cx, cy, R - 6, 60, 14, 1, 5, 32, 2.6)}</g>
        <g stroke="${ink}" opacity=".35">${B.ticks(cx, cy, R - 6, 240, 6, .6, 4, 0, 0)}</g>
        ${nums}
        <text x="${cx}" y="${cy + 230}" text-anchor="middle" font-family="Jost" font-size="17" letter-spacing="8" fill="${p.muted}">AUTOMATIC · ${c.n} TASKS</text>
        <rect x="${cx - 30}" y="${cy + 380}" width="60" height="42" fill="#fff" stroke="${ink}" stroke-width="1.2"/><text x="${cx}" y="${cy + 410}" text-anchor="middle" font-family="Jost" font-size="28" fill="${ink}">${c.day || ""}</text>
        ${B.stick(cx, cy, 236, R - 250, 12, ink, 0)}${B.stick(cx, cy, 128, R - 80, 7, ink, 0)}
        ${B.stick(cx, cy, frontMode ? 180 : 90 + B.rate(c) * 180, R - 30, 2, p.jewel, 0)}`)}
      <div class="abs" style="left:110px;top:752px;display:flex;align-items:baseline;gap:30px">
        <span style="font-size:58px;letter-spacing:.42em">每日计划</span>
        <span style="font-family:var(--jost);font-size:22px;letter-spacing:.3em;color:${p.muted}">${esc(c.date)} ${c.wen}</span>
      </div>
      <div class="abs" style="left:110px;right:110px;top:864px;display:flex;justify-content:space-between;font-family:var(--jost);font-size:18px;letter-spacing:.4em;color:${p.muted};padding-bottom:14px;border-bottom:1.5px solid ${ink}"><span>TODAY</span><span>${B.val(`${c.done} / ${c.n}`)}</span></div>
      <div class="abs" style="left:110px;right:110px;top:902px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:30px;height:${r.h}px;border-bottom:1px solid color-mix(in srgb, ${ink} 14%, transparent)">
        <span style="width:40px;font-family:var(--jost);font-size:20px;color:${p.muted}">${p2(i + 1)}</span>
        ${B.tx(c, it, s, p, `font-size:${r.f}px;letter-spacing:.06em`)}
        ${c.b(it, `<span style="width:${Math.min(32, r.h - 6)}px;height:${Math.min(32, r.h - 6)}px;border-radius:50%;border:1.5px solid ${s === "x" ? p.muted : ink};background:${s === "c" ? ink : "transparent"};display:grid;place-items:center;color:${s === "c" ? p.bg2 : p.muted};box-sizing:border-box"><svg viewBox="0 0 24 24" width="18" height="18">${s ? `<path d="${L.P[s]}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</svg></span>`)}</div>`)}</div>
      <div class="abs" style="left:110px;right:110px;top:1338px;display:flex;justify-content:space-between;font-family:var(--jost);font-size:18px;letter-spacing:.4em;color:${p.muted}"><span>FORM FOLLOWS TIME</span><span style="color:${p.jewel}">●</span></div>
      </div>`;
    },
  };
  LAYOUTS.business = (c, p) => (BZ[p.v] || BZ.grand)(c, p);
