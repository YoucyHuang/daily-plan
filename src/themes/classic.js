  /* 经典 5 色：每个颜色是一张独立的设计（森林=植物标本 / 海洋=航海日志 / 莫兰迪=静物 / 宣纸=稿纸 / 夜墨=夜观星象） */
  DESIGNED.push(...CLASSIC);
  (() => {
    const A = (f) => (location.pathname.includes("/studio/") ? "../" : "") + "assets/classic/" + f;
    const f1 = (n) => n.toFixed(1);
    const photoIn = (c, inset) => c.photo ? `<div class="abs" style="inset:${inset};overflow:hidden">${c.photo}</div>` : "";
    const CNUM = ["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六"];
    const cnYear = (y) => String(y).split("").map((d) => "〇一二三四五六七八九"[d]).join("");

    PALETTES.forest  = [{ name:"植物标本", bg:"#22382d", sheet:"#efe8d6", ink:"#24372b", soft:"#6f7a68", leaf:"#4f7a4a", rule:"rgba(36,55,43,.26)", seal:"#9b4a2c", tape:"rgba(236,226,196,.82)" }];
    PALETTES.ocean   = [{ name:"航海日志", bg:"#1c3b50", bg2:"#24506a", ink:"#e8eef0", soft:"rgba(232,238,240,.62)", line:"rgba(232,238,240,.5)", faint:"rgba(232,238,240,.13)", acc:"#86b9cc", gold:"#dccaa2", red:"#d0694e" }];
    PALETTES.morandi = [{ name:"静物", wall:"#c8bdae", wall2:"#d3c9bb", table:"#ddd4c5", ink:"#4b453e", soft:"rgba(75,69,62,.6)", rule:"rgba(75,69,62,.2)",
      v:["#9b8f82", "#e9e1d2", "#b08a7c", "#8a9690", "#d2b892", "#6f7c82", "#c9b9a8"] }];
    PALETTES.paper   = [{ name:"稿纸", bg:"#ece3d2", ink:"#2f2a24", soft:"rgba(47,42,36,.55)", red:"#c0533a", grid:"rgba(192,83,58,.55)", seal:"#b5452e" }];
    PALETTES.night   = [{ name:"夜观星象", bg:"#16171a", bg2:"#252830", ink:"#e9e3d6", soft:"rgba(233,227,214,.55)", gold:"#c8a96a", gold2:"#f1dca6", moon:"#efe6cf", dark:"#2b2d33" }];

    /* ── 森林：植物标本。奶白标本纸 + 自然印刷蕨叶（1855 年 Bradbury《英国与爱尔兰蕨类》，公有领域）+ 标本签 ── */
    LAYOUTS.forest = (c, p) => {
      const r = c.fit(680, 92, 38);
      const linen = `repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0 2px,transparent 2px 6px),repeating-linear-gradient(-45deg,rgba(0,0,0,.07) 0 2px,transparent 2px 6px),${p.bg}`;
      const sheet = `radial-gradient(700px 500px at 20% 15%,rgba(255,255,255,.35),transparent 70%),radial-gradient(800px 600px at 85% 90%,rgba(140,110,60,.10),transparent 70%),${p.sheet}`;
      const tape = (x, y, w, rot) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:30px;background:${p.tape};transform:rotate(${rot}deg);box-shadow:0 1px 2px rgba(0,0,0,.08)"></div>`;
      const no = c.year ? `${c.year}${p2(c.m)}${c.day}` : "—";
      return `<div class="lc grain" style="background:${linen};color:${p.ink};font-family:var(--serif)">
      <div class="abs" style="left:56px;top:56px;right:56px;bottom:56px;background:${sheet};box-shadow:0 22px 50px rgba(0,0,0,.4)"></div>
      ${photoIn(c, "56px")}
      <img class="abs" alt="" src="${A("fern.webp")}" style="left:560px;top:92px;width:462px;height:1067px;filter:drop-shadow(0 3px 3px rgba(40,50,30,.18))">
      ${tape(815, 1100, 110, -62)}${tape(905, 960, 100, 30)}${tape(800, 470, 92, 28)}
      <div class="abs" style="left:120px;top:126px">
        <div style="font-family:var(--en);font-size:22px;letter-spacing:.42em;color:${p.leaf}">HERBARIUM · DIEI</div>
        <div style="font-size:88px;font-weight:600;letter-spacing:.12em;line-height:1;margin-top:26px">每日计划</div>
        <div style="margin-top:26px;font-size:24px;letter-spacing:.24em;color:${p.soft}">植物标本 · <span style="font-family:var(--en);letter-spacing:.12em">No. ${no}</span></div>
        <div style="margin-top:28px;width:420px;border-top:2px solid ${p.ink}"></div>
      </div>
      <div class="abs" style="left:120px;width:448px;top:${Math.max(420, 1100 - r.h * c.n)}px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:20px;height:${r.h}px;border-bottom:1.5px dotted ${p.rule}">
        <span style="flex:none;width:52px;font-family:var(--en);font-style:italic;font-size:${Math.min(28, r.f - 6)}px;color:${p.soft}">№${i + 1}</span>
        ${c.b(it, `<span style="width:${Math.min(40, r.h - 22)}px;height:${Math.min(40, r.h - 22)}px;border-radius:50%;border:2px solid ${s === "x" ? p.seal : p.leaf};background:${s === "c" ? p.leaf : "transparent"};display:grid;place-items:center;color:${s === "c" ? p.sheet : p.seal}">${s ? `<svg viewBox="0 0 24 24" width="62%" height="62%"><path d="${L.P[s]}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}</span>`)}
        ${c.t(it, `font-size:${r.f}px;letter-spacing:.04em;${s === "x" ? `color:${p.soft};text-decoration:line-through;text-decoration-color:${p.seal};text-decoration-thickness:2px` : ""}`)}</div>`)}</div>
      <div class="abs" style="left:120px;top:1150px;width:500px;border:2px solid ${p.ink};padding:5px;background:rgba(255,253,246,.55)">
        <div style="border:1px solid ${p.ink};padding:16px 24px 14px">
          <div style="display:flex;justify-content:space-between;font-family:var(--en);font-size:19px;letter-spacing:.34em;color:${p.soft}"><span>FLORA DIEI</span><span>${c.wen}</span></div>
          <div style="font-size:30px;font-weight:600;letter-spacing:.18em;margin-top:10px">每日植物志</div>
          <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:21px;letter-spacing:.12em;color:${p.soft};border-top:1px solid ${p.rule};padding-top:10px">
            <span>采集日期 <span style="font-family:var(--en);color:${p.ink}">${esc(c.date)}</span> ${c.wcn}</span><span>已采集 <span style="font-family:var(--en);color:${p.ink}">${frontMode ? "—" : c.done} / ${c.n}</span></span></div>
        </div>
      </div>
      <div class="abs" style="left:660px;top:1210px;width:120px;height:120px;border-radius:50%;border:3px solid ${p.seal};color:${p.seal};opacity:.72;transform:rotate(-14deg);display:grid;place-items:center">
        <div style="position:absolute;inset:7px;border-radius:50%;border:1px solid ${p.seal}"></div>
        <div style="text-align:center;line-height:1.15"><div style="font-family:var(--en);font-size:14px;letter-spacing:.3em">HERB.</div><div style="font-size:30px;font-weight:700;letter-spacing:.08em">标本</div><div style="font-family:var(--en);font-size:14px;letter-spacing:.2em">${c.m ? p2(c.m) : ""}·${c.day || ""}</div></div>
      </div>
      </div>`;
    };

    /* ── 海洋：航海图 + 航海日志。刻度图框、罗经花、放射航向线、日志表格、版画式浪纹 ── */
    LAYOUTS.ocean = (c, p) => {
      const r = c.fit(500, 76, 36);
      const W = 1080, H = 1440, o = 48, o2 = 70, cx = 770, cy = 330, R = 178;
      /* 图框：内外两道线，中间黑白相间的经纬刻度 */
      const seg = (x1, y1, x2, y2, step) => { const len = Math.hypot(x2 - x1, y2 - y1), n = Math.round(len / step), out = [];
        for (let i = 0; i < n; i += 2) { const a = i / n, b = Math.min(1, (i + 1) / n);
          out.push(`<line x1="${f1(x1 + (x2 - x1) * a)}" y1="${f1(y1 + (y2 - y1) * a)}" x2="${f1(x1 + (x2 - x1) * b)}" y2="${f1(y1 + (y2 - y1) * b)}"/>`); }
        return out.join(""); };
      const mid = (o + o2) / 2, frame = `<g stroke="${p.gold}" stroke-width="${o2 - o - 8}" opacity=".85">${seg(mid, mid, W - mid, mid, 36)}${seg(mid, H - mid, W - mid, H - mid, 36)}${seg(mid, mid, mid, H - mid, 36)}${seg(W - mid, mid, W - mid, H - mid, 36)}</g>
        <rect x="${o}" y="${o}" width="${W - 2 * o}" height="${H - 2 * o}" fill="none" stroke="${p.gold}" stroke-width="2"/>
        <rect x="${o2}" y="${o2}" width="${W - 2 * o2}" height="${H - 2 * o2}" fill="none" stroke="${p.gold}" stroke-width="1.5"/>`;
      const grid = [270, 540, 810].map((x) => `<line x1="${x}" y1="${o2}" x2="${x}" y2="${H - o2}"/>`).join("") + [360, 720, 1080].map((y) => `<line x1="${o2}" y1="${y}" x2="${W - o2}" y2="${y}"/>`).join("");
      const glab = [[270, "120°E"], [540, "121°E"]].map(([x, t]) => `<text x="${x + 8}" y="${o2 + 26}">${t}</text>`).join("");
      /* 放射航向线：从罗经花中心射向四面八方 */
      const rhumb = Array.from({ length: 32 }, (_, i) => { const a = i * Math.PI / 16; return `<line x1="${cx}" y1="${cy}" x2="${f1(cx + Math.sin(a) * 1700)}" y2="${f1(cy - Math.cos(a) * 1700)}"/>`; }).join("");
      /* 罗经花：主方位菱形（明暗两半）+ 次方位 + 细方位 + 360° 刻度环 */
      const point = (deg, len, w, light, dark) => { const a = deg * Math.PI / 180, s = Math.sin(a), co = Math.cos(a);
        const tip = [cx + s * len, cy - co * len], l = [cx + Math.sin(a - Math.PI / 2) * w, cy - Math.cos(a - Math.PI / 2) * w], rr = [cx + Math.sin(a + Math.PI / 2) * w, cy - Math.cos(a + Math.PI / 2) * w];
        return `<path d="M${cx} ${cy}L${tip.map(f1)}L${l.map(f1)}Z" fill="${light}"/><path d="M${cx} ${cy}L${tip.map(f1)}L${rr.map(f1)}Z" fill="${dark}"/>`; };
      let rose = "";
      for (let i = 0; i < 16; i++) rose += i % 2 ? point(i * 22.5, R * .52, 9, p.soft, p.bg2) : "";
      for (let i = 0; i < 8; i++) rose += i % 2 ? point(i * 45, R * .7, 15, p.acc, p.bg2) : "";
      for (let i = 0; i < 4; i++) rose += point(i * 90, R * .96, 22, p.ink, p.acc);
      const ticks = Array.from({ length: 72 }, (_, i) => { const a = i * 5 * Math.PI / 180, l = i % 2 ? 8 : 16;
        return `<line x1="${f1(cx + Math.sin(a) * (R + 20))}" y1="${f1(cy - Math.cos(a) * (R + 20))}" x2="${f1(cx + Math.sin(a) * (R + 20 - l))}" y2="${f1(cy - Math.cos(a) * (R + 20 - l))}"/>`; }).join("");
      const nesw = [["N", 0], ["E", 90], ["S", 180], ["W", 270]].map(([t, d]) => { const a = d * Math.PI / 180;
        return `<text x="${f1(cx + Math.sin(a) * (R + 46))}" y="${f1(cy - Math.cos(a) * (R + 46) + 12)}" text-anchor="middle">${t}</text>`; }).join("");
      /* 版画浪纹：一组错位的正弦线 */
      const waves = Array.from({ length: 9 }, (_, k) => { const y0 = 1222 + k * 15, amp = 6 + (k % 3) * 2, ph = k * .9, pts = [];
        for (let x = o2; x <= W - o2; x += 12) pts.push(`${x} ${f1(y0 + Math.sin(x / 46 + ph) * amp + Math.sin(x / 13 + k) * 1.4)}`);
        return `<path d="M${pts.join("L")}" stroke-width="${k % 3 ? 1.4 : 2.2}" opacity="${f1(.35 + .07 * k)}"/>`; }).join("");
      const rate = c.n ? c.done / c.n : 0;
      const hdg = (i) => String(Math.round(i * 360 / Math.max(c.n, 1)) % 360).padStart(3, "0") + "°";
      const colT = `display:grid;grid-template-columns:76px 118px minmax(0,1fr) 56px;align-items:center`;
      return `<div class="lc" style="background:radial-gradient(900px 700px at 75% 20%,${p.bg2},${p.bg} 75%);color:${p.ink};font-family:var(--serif)">
      ${photoIn(c, o2 + "px")}
      <svg class="abs" style="left:0;top:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        <g stroke="${p.faint}" stroke-width="1">${rhumb}</g>
        <g stroke="${p.faint}" stroke-width="1.2" stroke-dasharray="2 6">${grid}</g>
        <g fill="${p.soft}" font-family="Cormorant Garamond,serif" font-size="18" letter-spacing="2">${glab}</g>
        <circle cx="${cx}" cy="${cy}" r="${R + 20}" fill="${p.bg}" fill-opacity=".55" stroke="${p.line}" stroke-width="1.5"/>
        <circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="none" stroke="${p.line}" stroke-width="1"/>
        <g stroke="${p.line}" stroke-width="1.4">${ticks}</g>
        ${rose}
        <circle cx="${cx}" cy="${cy}" r="10" fill="${p.gold}"/><circle cx="${cx}" cy="${cy}" r="4" fill="${p.bg}"/>
        <g fill="${p.gold}" font-family="Cormorant Garamond,serif" font-size="34" font-weight="600">${nesw}</g>
        <g fill="none" stroke="${p.acc}" stroke-linecap="round">${waves}</g>
        ${frame}
      </svg>
      <div class="abs" style="left:120px;top:150px">
        <div style="font-family:var(--corm);font-weight:600;font-size:24px;letter-spacing:.44em;color:${p.gold}">SHIP'S LOG</div>
        <div style="font-size:90px;font-weight:600;letter-spacing:.1em;line-height:1;margin-top:24px">每日计划</div>
        <div style="margin-top:24px;font-size:24px;letter-spacing:.28em;color:${p.soft}">航海日志 · <span style="font-family:var(--corm);font-size:28px;letter-spacing:.14em">${esc(c.date)} ${c.wen}</span></div>
      </div>
      <div class="abs" style="left:120px;right:120px;top:600px;background:rgba(10,28,40,.42);border:1.5px solid ${p.line}">
        <div style="${colT};height:56px;border-bottom:3px double ${p.line};font-family:var(--corm);font-size:20px;letter-spacing:.24em;color:${p.gold}">
          <span style="padding-left:20px">NO.</span><span style="border-left:1px solid ${p.faint};padding-left:16px">HDG</span><span style="border-left:1px solid ${p.faint};padding-left:22px">REMARKS · 事项</span><span></span></div>
        ${c.rows((it, s, i) => `<div style="${colT};height:${r.h}px;border-bottom:1px solid ${p.faint}">
          <span style="padding-left:20px;font-family:var(--corm);font-size:${Math.min(30, r.f - 4)}px;font-weight:600;color:${p.gold}">${p2(i + 1)}</span>
          <span style="height:100%;display:flex;align-items:center;border-left:1px solid ${p.faint};padding-left:16px;font-family:var(--corm);font-size:${Math.min(26, r.f - 8)}px;letter-spacing:.06em;color:${p.soft}">${hdg(i)}</span>
          <span style="height:100%;display:flex;align-items:center;min-width:0;border-left:1px solid ${p.faint};padding-left:22px">${c.t(it, `font-size:${r.f}px;letter-spacing:.04em;${s === "x" ? `color:${p.soft};text-decoration:line-through;text-decoration-color:${p.red};text-decoration-thickness:2px` : ""}`)}</span>
          ${c.b(it, L.ck(s, { size: Math.min(36, r.h - 22), color: s === "x" ? p.red : p.gold, border: `1.5px solid ${s === "x" ? p.red : p.gold}`, mark: s === "c" ? p.bg : p.red, bg: s === "c" ? p.gold : "transparent", w: 2.6 }))}</div>`)}
      </div>
      <div class="abs" style="left:120px;right:120px;top:1290px;display:flex;justify-content:space-between;align-items:center;font-family:var(--corm);font-size:22px;letter-spacing:.3em;color:${p.ink};text-shadow:0 0 8px ${p.bg}">
        <span>FAIR WINDS · 一路顺风</span><span>已航行 ${frontMode ? "—" : Math.round(rate * 100) + "%"} · ${frontMode ? "—" : c.done}/${c.n}</span></div>
      </div>`;
    };

    /* ── 莫兰迪：静物。一组低饱和的瓶罐立在桌沿上，清单写在桌面 ── */
    LAYOUTS.morandi = (c, p) => {
      const r = c.fit(540, 80, 36), base = 650, V = p.v;
      /* 每个器物：左亮右暗的竖向渐变 + 顶面椭圆，边缘用位移滤镜做出油画的毛边 */
      let defs = "", objs = "", shadows = "";
      const grad = (id, col) => { defs += `<linearGradient id="clMo${id}" x1="0" x2="1"><stop offset="0" stop-color="${col}" stop-opacity="1"/><stop offset=".18" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="${col}" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>`; return `url(#clMo${id})`; };
      const vessel = (id, d, col) => `<path d="${d}" fill="${col}"/><path d="${d}" fill="${grad(id, col)}"/>`;
      const shadow = (x, w) => { shadows += `<ellipse cx="${x + w * .62}" cy="${base + 6}" rx="${w * .62}" ry="12" fill="rgba(60,50,40,.22)"/>`; };
      const bottle = (id, x, w, h, nw, nh, col) => { shadow(x, w); const r0 = w * .32, t = base - h;
        return vessel(id, `M${x} ${base}V${t + r0}Q${x} ${t} ${x + r0} ${t}H${x + (w - nw) / 2 - 2}V${t - nh}H${x + (w + nw) / 2 + 2}V${t}H${x + w - r0}Q${x + w} ${t} ${x + w} ${t + r0}V${base}Z`, col)
          + `<rect x="${x + (w - nw) / 2 - 6}" y="${t - nh - 10}" width="${nw + 12}" height="14" rx="3" fill="${col}"/>`; };
      const box = (id, x, w, h, col) => { shadow(x, w); return vessel(id, `M${x} ${base}V${base - h}H${x + w}V${base}Z`, col) + `<path d="M${x} ${base - h}L${x + 26} ${base - h - 22}H${x + w + 26}L${x + w} ${base - h}Z" fill="${col}"/><path d="M${x} ${base - h}L${x + 26} ${base - h - 22}H${x + w + 26}L${x + w} ${base - h}Z" fill="#fff" fill-opacity=".25"/><path d="M${x + w} ${base}V${base - h}L${x + w + 26} ${base - h - 22}V${base - 22}Z" fill="${col}"/><path d="M${x + w} ${base}V${base - h}L${x + w + 26} ${base - h - 22}V${base - 22}Z" fill="#000" fill-opacity=".14"/>`; };
      const jug = (id, x, w, h, col) => { shadow(x, w); const t = base - h;
        return `<path d="M${x + w - 8} ${t + 50}C${x + w + 52} ${t + 46} ${x + w + 50} ${t + 140} ${x + w - 10} ${t + 150}" fill="none" stroke="${col}" stroke-width="16"/>`
          + vessel(id, `M${x + 10} ${base}C${x - 14} ${t + 150} ${x + 4} ${t + 70} ${x + w * .28} ${t + 30}L${x + w * .2} ${t}H${x + w * .86}L${x + w * .76} ${t + 30}C${x + w} ${t + 70} ${x + w + 14} ${t + 150} ${x + w - 10} ${base}Z`, col)
          + `<ellipse cx="${x + w * .53}" cy="${t}" rx="${w * .33}" ry="8" fill="#000" fill-opacity=".18"/>`; };
      const tin = (id, x, w, h, col) => { shadow(x, w);
        return vessel(id, `M${x} ${base - 8}V${base - h}A${w / 2} 12 0 0 1 ${x + w} ${base - h}V${base - 8}A${w / 2} 12 0 0 1 ${x} ${base - 8}Z`, col) + `<ellipse cx="${x + w / 2}" cy="${base - h}" rx="${w / 2}" ry="12" fill="#fff" fill-opacity=".28"/>`; };
      objs += box(0, 520, 230, 150, V[1]);
      objs += bottle(1, 300, 120, 300, 38, 120, V[0]);
      objs += tin(2, 750, 106, 210, V[3]);
      objs += bottle(3, 430, 86, 380, 30, 70, V[5]);
      objs += jug(4, 600, 150, 240, V[2]);
      objs += tin(5, 200, 90, 120, V[4]);
      objs += bottle(6, 850, 74, 170, 26, 60, V[6]);
      return `<div class="lc grain" style="background:linear-gradient(180deg,${p.wall2},${p.wall} ${base}px,${p.table} ${base}px,${p.table});color:${p.ink};font-family:var(--serif)">
      <div class="abs" style="left:0;right:0;top:${base}px;height:150px;background:linear-gradient(180deg,rgba(80,70,55,.10),transparent)"></div>
      ${c.photo}
      <svg class="abs" style="left:0;top:0;overflow:visible" width="1080" height="1440" viewBox="0 0 1080 1440">
        <defs>${defs}<filter id="clMoRough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
          <filter id="clMoBlur"><feGaussianBlur stdDeviation="7"/></filter></defs>
        <g filter="url(#clMoBlur)">${shadows}</g>
        <g filter="url(#clMoRough)">${objs}</g>
        <line x1="0" y1="${base}" x2="1080" y2="${base}" stroke="rgba(75,69,62,.35)" stroke-width="1.5"/>
      </svg>
      <div class="abs" style="left:110px;right:110px;top:112px;display:flex;justify-content:space-between;align-items:flex-end">
        <div style="font-size:66px;font-weight:500;letter-spacing:.2em;line-height:1">每日计划</div>
        <div style="text-align:right;font-family:var(--corm);font-size:22px;letter-spacing:.34em;color:${p.soft};line-height:1.6">NATURA MORTA<br>${esc(c.date)} · ${c.wen}</div>
      </div>
      <div class="abs" style="left:130px;right:130px;top:${base + 70}px">${c.rows((it, s, i) => { const BX = V.filter((x) => !isLight(x)), col = BX[i % BX.length]; const sz = Math.min(36, r.h - 26);
        return `<div style="display:flex;align-items:center;gap:30px;height:${r.h}px;border-bottom:1px solid ${p.rule}">
        ${c.b(it, `<span style="width:${sz}px;height:${sz}px;border-radius:7px;background:${s === "c" ? col : "transparent"};border:2px solid ${s === "x" ? p.soft : col};display:grid;place-items:center;color:${s === "c" ? "#f4efe6" : p.soft}">${s ? `<svg viewBox="0 0 24 24" width="64%" height="64%"><path d="${L.P[s]}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}</span>`)}
        ${c.t(it, `font-size:${r.f}px;letter-spacing:.08em;${s === "x" ? `color:${p.soft};text-decoration:line-through;text-decoration-thickness:1.5px` : ""}`)}</div>`; })}</div>
      <div class="abs" style="left:130px;right:130px;top:1320px;display:flex;justify-content:space-between;align-items:center;font-family:var(--corm);font-size:24px;letter-spacing:.3em;color:${p.soft}">
        <span style="display:flex;gap:8px">${V.map((x) => `<i style="width:22px;height:22px;border-radius:50%;background:${x}"></i>`).join("")}</span><span>STILL · ${frontMode ? "—" : c.done} / ${c.n}</span></div>
      </div>`;
    };

    /* ── 宣纸：方格稿纸。每格一个字，红笔批改：完成打红勾，划掉画删除线；角上一方「日课」朱文印 ── */
    LAYOUTS.paper = (c, p) => {
      const COLS = 18, x0 = 81, rows = Math.max(13, c.n), cell = Math.min(51, Math.floor(910 / rows * .73)), gap = Math.round(cell * .37), pitch = cell + gap;
      const cw = 918 / COLS, top = 300, fs = Math.round(cell * .72);
      const gridH = rows * pitch;
      /* 稿纸格：每行一条格子带，行与行之间留空 */
      let g = "";
      for (let rI = 0; rI < rows; rI++) { const y = top + rI * pitch;
        g += `<rect x="${x0}" y="${y}" width="918" height="${cell}"/>`;
        for (let k = 1; k < COLS; k++) g += `<line x1="${f1(x0 + k * cw)}" y1="${y}" x2="${f1(x0 + k * cw)}" y2="${y + cell}"/>`; }
      const tick = `<svg viewBox="0 0 60 60" width="${cell * 1.35}" height="${cell * 1.35}" style="position:absolute;left:${-cell * .15}px;top:${-cell * .32}px;overflow:visible"><path d="M8 32C14 36 19 42 23 50C30 32 40 18 56 6" fill="none" stroke="${p.red}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      const row = (it, s, i) => `<div style="position:absolute;left:0;top:${i * pitch}px;width:918px;height:${cell}px;display:flex;align-items:center">
        <span style="width:${f1(cw)}px;text-align:center;font-size:${Math.round(fs * .62)}px;color:${p.soft}">${CNUM[i] || i + 1}</span>
        ${c.b(it, `<span style="position:relative;width:${f1(cw)}px;height:${cell}px;display:block">${s === "c" ? tick : s === "x" ? `<svg viewBox="0 0 60 60" width="${cell * .8}" height="${cell * .8}" style="position:absolute;left:${cell * .1}px;top:${cell * .1}px"><path d="M14 14L46 46M46 14L14 46" stroke="${p.red}" stroke-width="5" stroke-linecap="round"/></svg>` : ""}</span>`)}
        <span style="position:relative;display:flex;width:${f1(cw * (COLS - 2))}px;min-width:0;overflow:hidden">${c.t(it, `font-size:${fs}px;letter-spacing:${f1(cw - fs)}px;padding-left:${f1((cw - fs) / 2)}px;line-height:${cell}px;font-variant-east-asian:full-width;${s === "x" ? `color:${p.soft}` : ""}`)}
          ${s === "x" ? `<svg class="abs" style="left:0;top:0;pointer-events:none" width="${f1(cw * Math.min(COLS - 2, [...it.text].length))}" height="${cell}" preserveAspectRatio="none" viewBox="0 0 100 10"><path d="M0 5.4Q25 3.6 50 5.2T100 4.8" stroke="${p.red}" stroke-width="1.3" fill="none" vector-effect="non-scaling-stroke" style="stroke-width:3px"/></svg>` : ""}</span></div>`;
      const fibers = Array.from({ length: 26 }, (_, i) => { const R = rng(100 + i), x = R() * 1080, y = R() * 1440, a = R() * 180, l = 60 + R() * 160;
        return `<div class="abs" style="left:${f1(x)}px;top:${f1(y)}px;width:${f1(l)}px;height:1px;background:rgba(120,95,60,.14);transform:rotate(${f1(a)}deg)"></div>`; }).join("");
      const zh = c.year ? `${cnYear(c.year)}年 ${L.cnMon(c.m)}月${L.cnDay(c.d)}日` : esc(c.date);
      return `<div class="lc grain" style="background:radial-gradient(800px 600px at 30% 20%,rgba(255,255,255,.4),transparent 70%),radial-gradient(900px 700px at 80% 90%,rgba(150,110,60,.08),transparent 70%),${p.bg};color:${p.ink};font-family:var(--serif)">
      ${fibers}
      ${c.photo}
      <div class="abs" style="left:390px;top:32px;width:300px;height:66px;transform:rotate(-3deg);background:repeating-linear-gradient(90deg,rgba(192,83,58,.28) 0 10px,transparent 10px 22px),rgba(250,244,230,.72);box-shadow:0 2px 4px rgba(0,0,0,.08)"></div>
      <div class="abs" style="left:${x0}px;top:126px;font-family:var(--brush);font-size:118px;line-height:1;letter-spacing:.06em">每日计划</div>
      <div class="abs" style="right:${x0}px;top:142px;text-align:right;color:${p.red};line-height:1.7">
        <div style="font-size:30px;letter-spacing:.2em">${zh}</div><div style="font-size:26px;letter-spacing:.5em">${c.wcn ? "星期" + c.wcn.slice(1) : ""}</div></div>
      <div class="abs" style="left:${x0}px;top:${top - 30}px;width:918px;border-top:3px solid ${p.red};border-bottom:1px solid ${p.red};height:4px"></div>
      <svg class="abs" style="left:0;top:0" width="1080" height="1440"><g fill="none" stroke="${p.grid}" stroke-width="1.3">${g}</g></svg>
      <div class="abs" style="left:${x0}px;top:${top}px;width:918px;height:${gridH}px">${c.rows(row)}</div>
      <div class="abs" style="left:${x0}px;top:${top + gridH + 4}px;width:918px;border-top:1px solid ${p.red};border-bottom:3px solid ${p.red};height:4px"></div>
      <div class="abs" style="left:${x0}px;top:${top + gridH + 26}px;font-size:22px;letter-spacing:.3em;color:${p.red}">${COLS} × ${rows} = ${COLS * rows}　·　今日功课 ${frontMode ? "—" : c.done} / ${c.n}</div>
      <div class="abs" style="right:${x0 + 10}px;top:1250px;width:128px;height:128px;transform:rotate(4deg);filter:url(#clPaperSeal)">
        <svg width="0" height="0" style="position:absolute"><filter id="clPaperSeal"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.35"/><feComposite in="SourceGraphic" operator="in"/></filter></svg>
        <div style="width:100%;height:100%;background:${p.seal};border-radius:8px;display:grid;grid-template-rows:1fr 1fr;place-items:center;color:${p.bg};font-family:var(--serif);font-weight:900;font-size:50px;line-height:1;padding:6px 0">
          <span>日</span><span>课</span></div></div>
      </div>`;
    };

    /* ── 夜墨：夜观星象。今天真实的月相 + 前后一周的月相，清单连成一条星座线，完成的点亮成金色星星 ── */
    const moonAge = (y, m, d) => { const syn = 29.530588853, t = (Date.UTC(y, m - 1, d, 12) - Date.UTC(2000, 0, 6, 18, 14)) / 864e5; return ((t % syn) + syn) % syn; };
    const moonName = (a) => a < 1.85 ? "朔月" : a < 5.54 ? "蛾眉月" : a < 9.23 ? "上弦月" : a < 12.92 ? "盈凸月" : a < 16.61 ? "望月" : a < 20.3 ? "亏凸月" : a < 23.99 ? "下弦月" : a < 27.68 ? "残月" : "朔月";
    const moonPath = (cx, cy, R, age) => {
      const f = age / 29.530588853, rx = Math.abs(Math.cos(2 * Math.PI * f)) * R, wax = f < .5;
      const outer = wax ? 1 : 0, inner = wax ? (f < .25 ? 0 : 1) : (f > .75 ? 1 : 0);
      return `M${f1(cx)} ${f1(cy - R)}A${R} ${R} 0 0 ${outer} ${f1(cx)} ${f1(cy + R)}A${f1(rx)} ${R} 0 0 ${inner} ${f1(cx)} ${f1(cy - R)}Z`; };
    LAYOUTS.night = (c, p) => {
      const r = c.fit(600, 84, 37), top = Math.max(640, 1250 - r.h * c.n);
      const now = new Date(), y = c.year || now.getFullYear(), m = c.m || now.getMonth() + 1, d = c.d || now.getDate();
      const age = moonAge(y, m, d), mx = 812, my = 262, MR = 118;
      const R = rng(7), stars = Array.from({ length: 150 }, () => { const x = R() * 1080, yy = R() * 1440, s = .6 + R() * R() * 2.4;
        return `<circle cx="${f1(x)}" cy="${f1(yy)}" r="${f1(s)}" opacity="${f1(.25 + R() * .6)}"/>`; }).join("");
      const week = Array.from({ length: 7 }, (_, k) => { const dt = new Date(y, m - 1, d + k - 3), a = moonAge(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()), x = 150 + k * 130, cy = 520, rr = k === 3 ? 22 : 16;
        return `<circle cx="${x}" cy="${cy}" r="${rr}" fill="${p.dark}" stroke="${k === 3 ? p.gold : "rgba(233,227,214,.25)"}" stroke-width="${k === 3 ? 2 : 1}"/><path d="${moonPath(x, cy, rr - (k === 3 ? 3 : 2), a)}" fill="${p.moon}" opacity="${k === 3 ? 1 : .75}"/>
          <text x="${x}" y="${cy + 54}" text-anchor="middle" fill="${k === 3 ? p.gold : p.soft}" font-size="20" font-family="Noto Serif SC,serif">${"日一二三四五六"[dt.getDay()]}</text>`; }).join("");
      const off = [0, 46, 14, 64, 26, 52, 6, 38];
      const node = (i) => [142 + off[i % off.length], top + i * r.h + r.h / 2];
      const path = c.n > 1 ? `<polyline points="${Array.from({ length: c.n }, (_, i) => node(i).map(f1).join(",")).join(" ")}" fill="none" stroke="${p.gold}" stroke-opacity=".45" stroke-width="1.4"/>` : "";
      const star4 = (sz, col) => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" style="overflow:visible"><path d="M50 0C53 36 64 47 100 50C64 53 53 64 50 100C47 64 36 53 0 50C36 47 47 36 50 0Z" fill="${col}"/></svg>`;
      const lit = (s) => s === "c" ? `<span style="width:48px;height:48px;display:grid;place-items:center;filter:drop-shadow(0 0 10px ${p.gold})">${star4(46, p.gold2)}</span>`
        : s === "x" ? `<span style="width:48px;height:48px;display:grid;place-items:center"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 6L18 18M18 6L6 18" stroke="${p.soft}" stroke-width="2" stroke-linecap="round"/></svg></span>`
        : `<span style="width:48px;height:48px;display:grid;place-items:center"><i style="width:16px;height:16px;border-radius:50%;border:2px solid ${p.gold};background:${p.bg}"></i></span>`;
      return `<div class="lc" style="background:radial-gradient(900px 800px at 78% 12%,${p.bg2},${p.bg} 70%);color:${p.ink};font-family:var(--serif)">
      ${c.photo}
      <svg class="abs" style="left:0;top:0" width="1080" height="1440" viewBox="0 0 1080 1440">
        <defs><radialGradient id="clNtGlow"><stop offset=".55" stop-color="${p.moon}" stop-opacity=".22"/><stop offset="1" stop-color="${p.moon}" stop-opacity="0"/></radialGradient></defs>
        <g fill="#fff">${stars}</g>
        <circle cx="${mx}" cy="${my}" r="${MR * 2}" fill="url(#clNtGlow)"/>
        <circle cx="${mx}" cy="${my}" r="${MR}" fill="${p.dark}"/>
        <path d="${moonPath(mx, my, MR, age)}" fill="${p.moon}"/>
        <g fill="#000" opacity=".07"><circle cx="${mx - 38}" cy="${my - 30}" r="22"/><circle cx="${mx + 30}" cy="${my + 34}" r="30"/><circle cx="${mx + 44}" cy="${my - 46}" r="12"/><circle cx="${mx - 20}" cy="${my + 52}" r="14"/></g>
        <line x1="110" y1="440" x2="970" y2="440" stroke="rgba(233,227,214,.18)" stroke-width="1"/>
        ${week}
        ${path}
      </svg>
      <div class="abs" style="left:110px;top:150px">
        <div style="font-family:var(--corm);font-weight:600;font-size:24px;letter-spacing:.46em;color:${p.gold}">NOCTURNE</div>
        <div style="font-size:90px;font-weight:600;letter-spacing:.12em;line-height:1;margin-top:24px">每日计划</div>
        <div style="margin-top:24px;font-size:24px;letter-spacing:.26em;color:${p.soft}">夜观星象 · <span style="font-family:var(--corm);font-size:28px;letter-spacing:.14em">${esc(c.date)} ${c.wen}</span></div>
      </div>
      <div class="abs" style="left:${mx - 120}px;width:240px;top:${my + MR + 26}px;text-align:center;font-size:24px;letter-spacing:.4em;color:${p.gold}">${moonName(age)}</div>
      <div class="abs" style="left:118px;right:110px;top:${top}px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:${36 + (off[3] - off[i % off.length])}px;height:${r.h}px;padding-left:${off[i % off.length]}px">
        ${c.b(it, lit(s))}
        ${c.t(it, `font-size:${r.f}px;letter-spacing:.06em;${s === "x" ? `color:${p.soft};opacity:.7;text-decoration:line-through;text-decoration-thickness:1.5px` : s === "c" ? `color:${p.gold2}` : ""}`)}</div>`)}</div>
      <div class="abs" style="left:110px;right:110px;top:1312px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(233,227,214,.18);padding-top:22px;font-size:22px;letter-spacing:.24em;color:${p.soft}">
        <span>今夜 · ${moonName(age)} · 月龄 <span style="font-family:var(--corm);font-size:26px">${age.toFixed(1)}</span></span><span>${frontMode ? "—" : c.done} / ${c.n} 颗星已点亮</span></div>
      </div>`;
    };
  })();
