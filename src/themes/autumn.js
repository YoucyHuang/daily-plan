  /* 涟漪 · 孔版印刷（Riso）生成图案：纸色 + 2~3 种油墨，每种油墨一层密度场，
     层与层相乘叠色（夜色那套用「滤色」叠亮），带一点错版、颗粒和网点。
     7 套各是一种图案 + 一种版式：双心 / 莫尔纹 / 风过 / 网点 / 等高线 / 雨塘 / 夜旋。
     文字的位置在印版上直接「留白」（镂空），所以字永远印在纸上，不用另加面板。 */
  const RIP = (() => {
    const W = 1080, H = 1440, S = 2, w = W / S, h = H / S;
    const cache = new Map();
    const rgb = (x) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16) / 255);
    const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
    const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

    /* 带种子的梯度噪声，输出大约 -1..1 */
    function noise(seed) {
      const R = rng(seed * 7919 + 17), pm = Array.from({ length: 256 }, (_, i) => i);
      for (let i = 255; i > 0; i--) { const j = (R() * (i + 1)) | 0; [pm[i], pm[j]] = [pm[j], pm[i]]; }
      const perm = new Uint8Array(512); for (let i = 0; i < 512; i++) perm[i] = pm[i & 255];
      const gx = new Float32Array(256), gy = new Float32Array(256);
      for (let i = 0; i < 256; i++) { const a = R() * Math.PI * 2; gx[i] = Math.cos(a); gy[i] = Math.sin(a); }
      const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
      return (x, y) => {
        const X = Math.floor(x), Y = Math.floor(y), fx = x - X, fy = y - Y, xi = X & 255, yi = Y & 255;
        const g = (i, j, dx, dy) => { const k = perm[perm[xi + i] + yi + j]; return gx[k] * dx + gy[k] * dy; };
        const u = fade(fx), v = fade(fy), a = g(0, 0, fx, fy), b = g(1, 0, fx - 1, fy), c = g(0, 1, fx, fy - 1), d = g(1, 1, fx - 1, fy - 1);
        return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 1.45;
      };
    }
    const fbm = (n, x, y, o = 4) => { let s = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { s += a * n(x * f + i * 31.7, y * f); f *= 2; a *= .5; } return s; };

    /* 半分辨率的密度场：fn(x, y) 用整张 1080×1440 的坐标 */
    const field = (fn) => { const a = new Float32Array(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) a[y * w + x] = fn(x * S + 1, y * S + 1); return a; };
    /* 全分辨率的笔触层：在 canvas 上画，用透明度当密度 */
    const strokes = (fn) => {
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const g = cv.getContext("2d"); g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = g.fillStyle = "#000"; fn(g);
      const d = g.getImageData(0, 0, W, H).data, a = new Float32Array(W * H);
      for (let i = 0; i < W * H; i++) a[i] = d[i * 4 + 3] / 255;
      return { a, full: true };
    };
    const at = (L, x, y) => {
      if (L.full) { const xi = x | 0, yi = y | 0; return xi < 0 || yi < 0 || xi >= W || yi >= H ? 0 : L.a[yi * W + xi]; }
      const fx = clamp(x / S - .5, 0, w - 1.001), fy = clamp(y / S - .5, 0, h - 1.001), xi = fx | 0, yi = fy | 0, tx = fx - xi, ty = fy - yi, a = L.a, i = yi * w + xi;
      return (a[i] * (1 - tx) + a[i + 1] * tx) * (1 - ty) + (a[i + w] * (1 - tx) + a[i + w + 1] * tx) * ty;
    };

    /* 镂空：圆角矩形 r:[x0,y0,x1,y1,圆角] / 圆 c:[cx,cy,r]，f = 边缘羽化，k = 镂空强度 */
    const mask = (shapes) => ({ a: field((x, y) => {
      let m = 1;
      for (const s of shapes) {
        let sd;
        if (s.r) { const [x0, y0, x1, y1, rr = 0] = s.r, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, qx = Math.abs(x - cx) - (x1 - x0) / 2 + rr, qy = Math.abs(y - cy) - (y1 - y0) / 2 + rr;
          sd = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - rr; }
        else { const [cx, cy, r] = s.c; sd = Math.hypot(x - cx, y - cy) - r; }
        m *= 1 - (s.k ?? 1) * clamp(.5 - sd / (s.f || 2));
      }
      return m;
    }) });

    /* 印刷：layers = [{ ink, L(密度层), op, off:[dx,dy], dot:{cell, ang} }]，frame = 能印到的范围（孔版印刷总有纸边） */
    function print(key, P) {
      if (cache.has(key)) return cache.get(key);
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const ctx = cv.getContext("2d"), img = ctx.createImageData(W, H), px = img.data;
      const paper = rgb(P.paper), night = !!P.night, [fx0, fy0, fx1, fy1] = P.frame || [0, 0, W, H];
      const Ls = P.layers.map((l) => {
        const ink = rgb(l.ink), o = { ...l, ink, k: night ? ink : ink.map((v) => 1 - v), off: l.off || [0, 0] };
        if (l.dot) { const a = l.dot.ang * Math.PI / 180; o.ca = Math.cos(a) / l.dot.cell; o.sa = Math.sin(a) / l.dot.cell; }
        return o;
      });
      const M = P.mask;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const fib = 1 + (Math.random() - .5) * .035;   // 纸纤维
        let r = paper[0] * fib, g = paper[1] * fib, b = paper[2] * fib;
        if (x >= fx0 && x < fx1 && y >= fy0 && y < fy1) {
          const m = M ? at(M, x, y) : 1;
          if (m > .004) for (const l of Ls) {
            const X = x - l.off[0], Y = y - l.off[1];
            let d = at(l.L, X, Y) * m;
            if (d <= .003) continue;
            let t;
            if (l.dot) {   // 调幅网点
              const u = X * l.ca + Y * l.sa, v = -X * l.sa + Y * l.ca, cu = u - Math.round(u), cvv = v - Math.round(v);
              const rad = Math.sqrt(clamp(d)) * .68, dist = Math.sqrt(cu * cu + cvv * cvv);
              t = clamp((rad - dist) / .07 + .5);
            } else t = Math.random() < d ? 1 : (Math.random() < d * .35 ? .5 : 0);   // 孔版颗粒
            t *= l.op;
            if (!t) continue;
            if (night) { r = 1 - (1 - r) * (1 - t * l.k[0]); g = 1 - (1 - g) * (1 - t * l.k[1]); b = 1 - (1 - b) * (1 - t * l.k[2]); }
            else { r *= 1 - t * l.k[0]; g *= 1 - t * l.k[1]; b *= 1 - t * l.k[2]; }
          }
        }
        const i = (y * W + x) * 4;
        px[i] = r * 255; px[i + 1] = g * 255; px[i + 2] = b * 255; px[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      const out = document.createElement("canvas"); out.width = W; out.height = H;
      const o = out.getContext("2d"); o.filter = "blur(.7px)"; o.drawImage(cv, 0, 0);
      const url = out.toDataURL("image/jpeg", .88);
      if (cache.size > 24) cache.delete(cache.keys().next().value);
      cache.set(key, url);
      return url;
    }

    /* 勾选框：圆 / 方 / 三角 / 涟漪圈 / 星，完成=填色+纸色勾，划掉=叉 */
    const box = (s, { shape = "circle", ink, fill = ink, paper, size = 44, sw = 2.6 }) => {
      size = Math.max(22, size);   // 条数很多时也别小到点不中
      const f = s === "c" ? fill : "none", st = s === "x" ? `stroke-dasharray="4 4" opacity=".7"` : "";
      const sh = shape === "square" ? `<rect x="5" y="5" width="38" height="38" fill="${f}" stroke="${ink}" stroke-width="${sw}" ${st}/>`
        : shape === "tri" ? `<path d="M24 4L45 42H3Z" fill="${f}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round" ${st}/>`
        : shape === "ring" ? `<circle cx="24" cy="24" r="20" fill="none" stroke="${ink}" stroke-width="${sw * .7}" ${st}/><circle cx="24" cy="24" r="13" fill="${f}" stroke="${ink}" stroke-width="${sw}" ${st}/>`
        : shape === "star" ? `<path d="M24 3L29 18.5 45 19 32.3 28.6 37 44 24 35 11 44 15.7 28.6 3 19 19 18.5Z" fill="${f}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round" ${st}/>`
        : `<circle cx="24" cy="24" r="19.5" fill="${f}" stroke="${ink}" stroke-width="${sw}" ${st}/>`;
      const ty = shape === "tri" ? 5 : 0;
      const mk = s === "c" ? `<path d="M${shape === "ring" ? "18 24.5l4.5 4.5 8-9" : `14.5 ${25 + ty}l6.5 6.5 12.5-14`}" fill="none" stroke="${paper}" stroke-width="${shape === "ring" ? 2.8 : 3.6}" stroke-linecap="round" stroke-linejoin="round"/>`
        : s === "x" ? `<path d="M15 ${15 + ty}l18 18M33 ${15 + ty}l-18 18" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>` : "";
      return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" style="flex:0 0 auto;overflow:visible">${sh}${mk}</svg>`;
    };
    const halo = (p, k = 1) => p.night ? `text-shadow:0 0 ${12 * k}px ${p.paper},0 0 ${4 * k}px ${p.paper}` : `text-shadow:0 0 ${12 * k}px ${p.paper},0 0 ${4 * k}px ${p.paper},0 0 2px ${p.paper}`;
    const xs = (s) => s === "x" ? "opacity:.45;text-decoration:line-through;text-decoration-thickness:2px" : "";
    const tally = (c) => frontMode ? `— / ${c.n}` : `${c.done} / ${c.n}`;
    const img = (url) => `<img class="abs" alt="" src="${url}" style="left:0;top:0;width:${W}px;height:${H}px">`;
    /* 套准标记（孔版印刷纸边上的十字圆） */
    const reg = (x, y, col) => `<svg class="abs" style="left:${x - 13}px;top:${y - 13}px;opacity:.55" width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="7" fill="none" stroke="${col}" stroke-width="1.4"/><path d="M13 0v26M0 13h26" stroke="${col}" stroke-width="1.2"/></svg>`;
    return { W, H, noise, fbm, field, strokes, mask, print, box, halo, xs, tally, img, reg, clamp, sstep };
  })();

  /* 每套的列表行号、海拔之类都按 c.n 排，图案会跟着条数重新镂空，所以缓存键里带上条数 */
  const RIPV = {
    /* 0 双心：两个波源的同心圆互相干涉；标题在左上波源的「圆心空白」里，清单是从印版上裁开的一条条纸带 */
    duo(c, p) {
      const top = 790, r = c.fit(1300 - top, 82, 38), A = [330, 400], B = [930, 1190];
      const strips = Array.from({ length: c.n }, (_, i) => ({ r: [92, top + i * r.h + 5, 988, top + (i + 1) * r.h - 5, 10], f: 2 }));
      const ring = (x, y, [cx, cy], lam, ph = 0) => { const d = Math.hypot(x - cx, y - cy); return RIP.sstep(.1, .85, .5 + .5 * Math.cos(d / lam * Math.PI * 2 + ph)) * (.55 + .45 * Math.exp(-d / 900)); };
      const n = RIP.noise(3), mot = (x, y) => .82 + .18 * n(x / 110, y / 110);
      const url = RIP.print(`duo|${p.name}|${c.n}`, { paper: p.paper, frame: [48, 48, 1032, 1392],
        mask: RIP.mask([{ c: [A[0], A[1], 228], f: 3 }, { r: [612, 92, 988, 160, 8], f: 2 }, ...strips]),
        layers: [
          { ink: p.inks[0], op: .8, L: { a: RIP.field((x, y) => ring(x, y, A, 112) * mot(x, y)) } },
          { ink: p.inks[1], op: .78, off: [3, -2], L: { a: RIP.field((x, y) => ring(x, y, B, 126, 1) * mot(y, x)) } },
        ] });
      return `<div class="lc" style="background:${p.paper};color:${p.ink}">${RIP.img(url)}${c.photo}
      ${RIP.reg(540, 24, p.ink)}${RIP.reg(540, 1416, p.ink)}${RIP.reg(24, 720, p.ink)}${RIP.reg(1056, 720, p.ink)}
      <div class="abs" style="left:${A[0] - 200}px;top:${A[1] - 150}px;width:400px;text-align:center">
        <div style="font-family:var(--jost);font-weight:500;font-size:20px;letter-spacing:.4em">RIPPLE · Nº 01</div>
        <div style="font-size:112px;font-weight:900;line-height:1.02;letter-spacing:.06em;margin-top:14px">每日<br>计划</div></div>
      <div class="abs" style="left:612px;top:92px;width:376px;height:68px;display:flex;align-items:center;justify-content:center;font-family:var(--jost);font-weight:500;font-size:24px;letter-spacing:.2em">${esc(c.date)} · ${c.wen}</div>
      <div class="abs" style="left:92px;width:896px;top:${top}px">${c.rows((it, s) => `<div style="display:flex;align-items:center;gap:26px;height:${r.h}px;padding:0 26px">
        ${c.b(it, RIP.box(s, { ink: p.ink, fill: p.acc, paper: p.paper, size: Math.min(44, r.h - 20) }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:700;${RIP.xs(s)}`)}</div>`)}</div>
      <div class="abs" style="left:48px;right:48px;top:1402px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:18px;letter-spacing:.3em"><span>涟漪 · ${esc(p.name)} · TWO SOURCES</span><span>${RIP.tally(c)}</span></div>
      </div>`;
    },

    /* 1 莫尔纹：上半是两组细线光栅叠出的莫尔条纹，像瑞士海报；大标题压在色块下沿，清单是下方的编号表格 */
    moire(c, p) {
      const top = 890, r = c.fit(1324 - top, 74, 36), n = RIP.noise(7);
      /* 两组同样间距的细线，一组转 5° 并轻轻弯曲：交叉处自然「拍」出宽宽的莫尔条纹 */
      const grate = (ph) => RIP.sstep(.55, .9, .5 + .5 * Math.cos(ph * Math.PI * 2));
      const url = RIP.print(`moire|${p.name}`, { paper: p.paper, frame: [64, 64, 1016, 720],
        mask: RIP.mask([{ r: [64, 64, 382, 112, 0], f: 1 }]),
        layers: [
          { ink: p.inks[0], op: .9, L: { a: RIP.field((x, y) => grate((y + 6 * n(x / 300, y / 300)) / 8)) } },
          { ink: p.inks[1], op: .85, off: [2, 3], L: { a: RIP.field((x, y) => grate((y + 70 * Math.sin(x / 260 + 1.3) + 40 * Math.cos(y / 210)) / 8.4)) } },
        ] });
      return `<div class="lc" style="background:${p.paper};color:${p.ink}">${RIP.img(url)}${c.photo}
      <div class="abs" style="left:82px;top:74px;font-family:var(--jost);font-weight:500;font-size:20px;letter-spacing:.32em">FIG. 02 — MOIRÉ</div>
      <div class="abs" style="left:58px;top:628px;font-size:150px;font-weight:900;letter-spacing:.02em;line-height:1;${RIP.halo(p, .6)}">每日计划</div>
      <div class="abs" style="right:64px;top:748px;text-align:right;font-family:var(--jost)"><div style="font-weight:600;font-size:58px;letter-spacing:.02em;line-height:1">${c.m ? `${p2(c.m)}.${c.day}` : esc(c.date)}</div><div style="font-weight:500;font-size:22px;letter-spacing:.34em;margin-top:10px">${c.wen} · ${c.year || ""}</div></div>
      <div class="abs" style="left:64px;right:64px;top:${top}px;border-top:4px solid ${p.ink}">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:24px;height:${r.h}px;border-bottom:1.5px solid color-mix(in srgb, ${p.ink} 28%, transparent)">
        <span style="flex:0 0 64px;font-family:var(--jost);font-weight:600;font-size:${Math.min(30, r.f)}px;color:${p.inks[1]}">${p2(i + 1)}</span>
        ${c.t(it, `font-size:${r.f}px;font-weight:600;${RIP.xs(s)}`)}
        ${c.b(it, RIP.box(s, { shape: "square", ink: p.ink, fill: p.inks[0], paper: p.paper, size: Math.min(40, r.h - 22) }))}</div>`)}</div>
      <div class="abs" style="left:64px;right:64px;top:1356px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:20px;letter-spacing:.28em"><span>涟漪 · ${esc(p.name)} · TWO GRATINGS, ONE DAY</span><span>${RIP.tally(c)}</span></div>
      </div>`;
    },

    /* 2 风过：顺着噪声流场的短笔触（三色），在右侧「吹开」一片空地放清单；竖排标题在左边 */
    wind(c, p) {
      const top = 410, r = c.fit(1250 - top, 96, 40), n = RIP.noise(21);
      const ang = (x, y) => RIP.fbm(n, x / 560, y / 560, 3) * Math.PI * 2.2 - .5;
      const lay = (seed, cnt, lw) => RIP.strokes((g) => { const R = rng(seed);
        for (let k = 0; k < cnt; k++) { let x = R() * 1100 - 10, y = R() * 1460 - 10; g.lineWidth = lw * (.6 + R() * .8); g.beginPath(); g.moveTo(x, y);
          const steps = 10 + (R() * 22 | 0); for (let s = 0; s < steps; s++) { const a = ang(x, y); x += Math.cos(a) * 7; y += Math.sin(a) * 7; g.lineTo(x, y); } g.stroke(); } });
      const url = RIP.print(`wind|${p.name}`, { paper: p.paper, frame: [40, 40, 1040, 1400],
        mask: RIP.mask([{ r: [300, 236, 996, 1300, 70], f: 46 }, { r: [62, 96, 232, 1060, 40], f: 30 }]),
        layers: [
          { ink: p.inks[0], op: .8, L: lay(5, 1500, 3.4) },
          { ink: p.inks[1], op: .75, off: [2, 1], L: lay(9, 900, 3) },
          { ink: p.inks[2], op: .7, off: [-2, 2], L: lay(13, 650, 2.6) },
        ] });
      return `<div class="lc" style="background:${p.paper};color:${p.ink};font-family:var(--serif)">${RIP.img(url)}${c.photo}
      <div class="abs" style="left:96px;top:120px;writing-mode:vertical-rl;font-size:96px;font-weight:700;letter-spacing:.22em;line-height:1">每日计划</div>
      <div class="abs" style="left:110px;top:640px;writing-mode:vertical-rl;font-size:26px;letter-spacing:.5em;line-height:1">风过处　一日一事</div>
      <div class="abs" style="left:360px;right:96px;top:290px;display:flex;justify-content:space-between;align-items:baseline">
        <span style="font-size:40px;font-weight:600;letter-spacing:.12em">${c.m ? `${L.cnMon(c.m)}月${L.cnDay(c.d)}日` : esc(c.date)}</span>
        <span style="font-family:var(--jost);font-weight:500;font-size:22px;letter-spacing:.3em">WIND · ${c.wen}</span></div>
      <div class="abs" style="left:360px;right:96px;top:${top}px">${c.rows((it, s) => `<div style="display:flex;align-items:center;gap:28px;height:${r.h}px;border-bottom:1.5px dashed color-mix(in srgb, ${p.ink} 30%, transparent)">
        ${c.b(it, RIP.box(s, { ink: p.ink, fill: p.inks[0], paper: p.paper, size: Math.min(44, r.h - 24) }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:600;letter-spacing:.04em;${RIP.xs(s)}`)}</div>`)}</div>
      <div class="abs" style="left:360px;right:96px;top:1262px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:20px;letter-spacing:.28em"><span>涟漪 · ${esc(p.name)}</span><span>${RIP.tally(c)}</span></div>
      </div>`;
    },

    /* 3 网点：右上角一圈圈扩散的调幅网点（两色不同网角），左边是报纸式的大号日期 + 清单栏 */
    dots(c, p) {
      const top = 760, r = c.fit(1316 - top, 82, 38), n = RIP.noise(31);
      const rip = (x, y, cx, cy, lam, ph) => { const d = Math.hypot(x - cx, y - cy); return (.52 + .48 * Math.cos(d / lam * Math.PI * 2 + ph)) * RIP.clamp((1300 - d) / 760) ** 1.2 * (.9 + .1 * n(x / 200, y / 200)); };
      const url = RIP.print(`dots|${p.name}`, { paper: p.paper, frame: [36, 36, 1044, 1404],
        mask: RIP.mask([{ r: [0, 0, 1080, 132, 0], f: 1 }, { r: [40, 700, 1040, 1330, 0], f: 60, k: .9 }]),
        layers: [
          { ink: p.inks[0], op: .85, dot: { cell: 15, ang: 15 }, L: { a: RIP.field((x, y) => rip(x, y, 1200, -120, 150, 0)) } },
          { ink: p.inks[1], op: .8, off: [2, -2], dot: { cell: 15, ang: 75 }, L: { a: RIP.field((x, y) => .85 * rip(x, y, 1130, -60, 172, 1.4)) } },
        ] });
      return `<div class="lc" style="background:${p.paper};color:${p.ink}">${RIP.img(url)}${c.photo}
      <div class="abs" style="left:70px;right:70px;top:62px;display:flex;justify-content:space-between;align-items:baseline;font-family:var(--jost);font-weight:600;font-size:24px;letter-spacing:.3em"><span>THE DAILY RIPPLE</span><span>网点日报 · ${c.year || ""}</span></div>
      <div class="abs" style="left:70px;right:70px;top:118px;border-top:5px solid ${p.ink};border-bottom:1.5px solid ${p.ink};height:7px"></div>
      <div class="abs" style="left:58px;top:150px;font-family:var(--jost);font-weight:700;font-size:380px;line-height:.82;letter-spacing:-.04em">${c.day || "—"}</div>
      <div class="abs" style="left:76px;top:490px;font-family:var(--jost);font-weight:600;font-size:40px;letter-spacing:.24em;${RIP.halo(p)}">${c.mon} · ${c.wen}</div>
      <div class="abs" style="left:70px;top:568px;font-size:88px;font-weight:900;letter-spacing:.08em;line-height:1;${RIP.halo(p)}">每日计划</div>
      <div class="abs" style="left:70px;right:70px;top:${top}px;border-top:3px solid ${p.ink}">${c.rows((it, s) => `<div style="display:flex;align-items:center;gap:26px;height:${r.h}px;border-bottom:1.5px solid color-mix(in srgb, ${p.ink} 24%, transparent)">
        ${c.b(it, RIP.box(s, { shape: "square", ink: p.ink, fill: p.inks[1], paper: p.paper, size: Math.min(42, r.h - 22) }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:700;${RIP.xs(s)}`)}</div>`)}</div>
      <div class="abs" style="left:70px;right:70px;top:1340px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:20px;letter-spacing:.28em"><span>Nº 04 · 涟漪 · ${esc(p.name)} · HALFTONE</span><span>${RIP.tally(c)}</span></div>
      </div>`;
    },

    /* 4 等高线：噪声地形的等高线（棕）+ 分层设色（绿）+ 水面（蓝）；左上图名框、左下图例就是清单，带比例尺和指北针 */
    contour(c, p) {
      const L0 = 806, r = c.fit(1324 - L0 - 64, 70, 34), n = RIP.noise(41), n2 = RIP.noise(43);
      const hgt = RIP.field((x, y) => RIP.fbm(n, x / 520, y / 520, 4) + .25 * n2(x / 210, y / 210));
      const wW = 540, step = .042;
      const lines = new Float32Array(hgt.length);
      for (let i = 0; i < hgt.length; i++) {
        const x = i % wW, y = (i / wW) | 0, a = hgt[i], gx = hgt[i + (x < wW - 1 ? 1 : 0)] - hgt[i - (x > 0 ? 1 : 0)], gy = (hgt[i + (y < 719 ? wW : 0)] - hgt[i - (y > 0 ? wW : 0)]);
        const gr = Math.hypot(gx, gy) / 2 / step + 1e-6, q = a / step, k = Math.round(q), dist = Math.abs(q - k) / gr;
        lines[i] = a < -.2 ? 0 : RIP.clamp(1 - dist / (k % 5 === 0 ? 1.5 : .75));
      }
      const url = RIP.print(`contour|${p.name}|${c.n}`, { paper: p.paper, frame: [78, 78, 1002, 1362],
        mask: RIP.mask([{ r: [104, 104, 586, 336, 0], f: 1 }, { r: [104, L0, 720, 1336, 0], f: 1 }, { r: [790, 1258, 976, 1336, 0], f: 1 }]),
        layers: [
          { ink: p.inks[2], op: .55, L: { a: hgt.map((v) => v < -.2 ? .5 + .2 * Math.cos(v / step * 6.28) : 0) } },
          { ink: p.inks[1], op: .5, off: [2, 2], L: { a: hgt.map((v) => v < -.2 ? 0 : (Math.floor(v / step / 2) % 2 ? .22 : .38) * RIP.clamp((v + .3) * 1.4)) } },
          { ink: p.inks[0], op: .9, off: [-1, 1], L: { a: lines } },
        ] });
      const alt = (i) => p2(Math.round((180 + i * 137) % 900 / 10)) + "0";
      const ticks = Array.from({ length: 9 }, (_, i) => { const x = 78 + i * 924 / 8, y = 78 + i * 1284 / 8;
        return `<path d="M${x} 66v12M${x} 1362v12M66 ${y}h12M1002 ${y}h12" stroke="${p.ink}" stroke-width="1.4"/>`; }).join("");
      return `<div class="lc" style="background:${p.paper};color:${p.ink};font-family:var(--serif)">${RIP.img(url)}${c.photo}
      <svg class="abs" style="left:0;top:0" width="1080" height="1440" viewBox="0 0 1080 1440" fill="none">
        <rect x="66" y="66" width="948" height="1308" stroke="${p.ink}" stroke-width="3"/><rect x="78" y="78" width="924" height="1284" stroke="${p.ink}" stroke-width="1"/>${ticks}
        <rect x="104" y="104" width="482" height="232" stroke="${p.ink}" stroke-width="1.5"/><rect x="104" y="${L0}" width="616" height="${1336 - L0}" stroke="${p.ink}" stroke-width="1.5"/>
        <g transform="translate(906 1030)" stroke="${p.ink}" stroke-width="2"><circle r="44" stroke-opacity=".6"/><path d="M0 -62L14 10 0 -2 -14 10Z" fill="${p.ink}"/><path d="M0 62L14 -10 0 2 -14 -10Z" fill="${p.paper}"/></g>
        <text x="906" y="958" text-anchor="middle" font-family="Jost,sans-serif" font-weight="600" font-size="24" fill="${p.ink}">N</text>
        <g transform="translate(806 1300)" stroke="${p.ink}" stroke-width="1.5"><rect width="156" height="10" fill="${p.paper}"/><rect width="39" height="10" fill="${p.ink}"/><rect x="78" width="39" height="10" fill="${p.ink}"/></g>
        <text x="806" y="1286" font-family="Jost,sans-serif" font-size="16" letter-spacing="2" fill="${p.ink}">0 · 1 · 2 KM</text>
      </svg>
      <div class="abs" style="left:132px;top:124px"><div style="font-family:var(--jost);font-weight:500;font-size:18px;letter-spacing:.36em">TOPOGRAPHIC SHEET · 05</div>
        <div style="font-size:78px;font-weight:700;letter-spacing:.14em;line-height:1.1;margin-top:16px">每日计划</div>
        <div style="font-size:26px;letter-spacing:.16em;margin-top:14px">${esc(c.date)}　${c.wcn}　· 1:24 000</div></div>
      <div class="abs" style="left:128px;width:568px;top:${L0 + 18}px"><div style="display:flex;justify-content:space-between;align-items:baseline;height:44px;border-bottom:1.5px solid ${p.ink};font-family:var(--jost);font-weight:600;font-size:20px;letter-spacing:.3em"><span>LEGEND · 今日行程</span><span>${RIP.tally(c)}</span></div>
        ${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:20px;height:${r.h}px;border-bottom:1px solid color-mix(in srgb, ${p.ink} 22%, transparent)">
        ${c.b(it, RIP.box(s, { shape: "tri", ink: p.ink, fill: p.inks[0], paper: p.paper, size: Math.min(38, r.h - 22) }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:600;${RIP.xs(s)}`)}
        <span style="flex:0 0 auto;font-family:var(--jost);font-size:${Math.min(20, r.f - 6)}px;letter-spacing:.12em;opacity:.7">▲ ${alt(i)} m</span></div>`)}</div>
      <div class="abs" style="left:78px;right:78px;top:1384px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:18px;letter-spacing:.3em"><span>涟漪 · ${esc(p.name)}</span><span>CONTOUR INTERVAL · ONE THING</span></div>
      </div>`;
    },

    /* 5 雨塘：很多小雨点各自荡开几圈（两色），清单像落下的雨滴一样左右错落 */
    rain(c, p) {
      const top = 430, r = c.fit(1290 - top, 92, 40), R0 = rng(57);
      const drops = Array.from({ length: 30 }, () => ({ x: 60 + R0() * 960, y: 60 + R0() * 1320, R: 70 + R0() * 230, lam: 20 + R0() * 14, ph: R0() * 6 }));
      const ripple = (x, y, ds) => { let m = 0; for (const d of ds) { const dist = Math.hypot(x - d.x, y - d.y); if (dist >= d.R) continue;
        const v = RIP.sstep(.55, .95, .5 + .5 * Math.cos(dist / d.lam * 6.283 - d.ph)) * (1 - dist / d.R) ** 1.2; if (v > m) m = v; } return m; };
      const rowMask = Array.from({ length: c.n }, (_, i) => ({ r: [110 + (i % 2) * 110, top + i * r.h + 14, 110 + (i % 2) * 110 + 620, top + (i + 1) * r.h - 14, 30], f: 36, k: .88 }));
      const url = RIP.print(`rain|${p.name}|${c.n}`, { paper: p.paper, frame: [56, 56, 1024, 1384],
        mask: RIP.mask([{ r: [96, 96, 640, 330, 40], f: 40, k: .9 }, ...rowMask]),
        layers: [
          { ink: p.inks[0], op: .78, L: { a: RIP.field((x, y) => ripple(x, y, drops.filter((_, i) => i % 2))) } },
          { ink: p.inks[1], op: .72, off: [2, 2], L: { a: RIP.field((x, y) => ripple(x, y, drops.filter((_, i) => !(i % 2)))) } },
        ] });
      return `<div class="lc" style="background:${p.paper};color:${p.ink};font-family:var(--serif)">${RIP.img(url)}${c.photo}
      <div class="abs" style="left:752px;top:84px;font-family:'ZCOOL XiaoWei',var(--serif);font-size:240px;line-height:1;color:${p.inks[0]};${RIP.halo(p, .6)}">雨</div>
      <div class="abs" style="left:120px;top:128px;${RIP.halo(p)}"><div style="font-size:72px;font-weight:700;letter-spacing:.2em;line-height:1">每日计划</div>
        <div style="font-family:var(--jost);font-weight:500;font-size:22px;letter-spacing:.32em;margin-top:26px">RAIN ON THE POND</div>
        <div style="font-size:28px;letter-spacing:.16em;margin-top:14px">${esc(c.date)}　${c.wcn}</div></div>
      <div class="abs" style="left:0;right:0;top:${top}px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:24px;height:${r.h}px;margin-left:${130 + (i % 2) * 110}px;width:${700}px;${RIP.halo(p, .8)}">
        ${c.b(it, RIP.box(s, { shape: "ring", ink: p.ink, fill: p.inks[0], paper: p.paper, size: Math.min(48, r.h - 20) }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:600;letter-spacing:.06em;${RIP.xs(s)}`)}</div>`)}</div>
      <div class="abs" style="left:56px;right:56px;top:1398px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:18px;letter-spacing:.3em"><span>涟漪 · ${esc(p.name)} · ${drops.length} DROPS</span><span>${RIP.tally(c)}</span></div>
      </div>`;
    },

    /* 6 夜旋：深色纸上用浅色油墨「滤色」叠出的旋涡，中心留一个圆放日期；清单居中排在下方 */
    vortex(c, p) {
      const top = 930, r = c.fit(1320 - top, 70, 34), C = [540, 430], n = RIP.noise(61);
      const arm = (x, y, k, tw, ph) => { const dx = x - C[0], dy = y - C[1], rr = Math.hypot(dx, dy) + 1, th = Math.atan2(dy, dx);
        const s = Math.cos(k * th + tw * Math.log(rr / 40) + ph + .5 * n(x / 160, y / 160));
        return RIP.sstep(.25, .95, s) * RIP.sstep(120, 210, rr) * (1 - RIP.sstep(280, 480, rr)); };
      const stars = RIP.strokes((g) => { const R = rng(71); for (let i = 0; i < 300; i++) { g.beginPath(); g.arc(R() * 1080, R() * 1440, .6 + R() * R() * 2.6, 0, 6.283); g.fill(); } });
      const url = RIP.print(`vortex|${p.name}`, { paper: p.paper, night: true, frame: [44, 44, 1036, 1396],
        mask: RIP.mask([{ c: [C[0], C[1], 150], f: 8 }]),
        layers: [
          { ink: p.inks[0], op: .75, L: { a: RIP.field((x, y) => arm(x, y, 3, 7.5, 0)) } },
          { ink: p.inks[1], op: .62, off: [3, -2], L: { a: RIP.field((x, y) => arm(x, y, 3, 7.5, 1.1)) } },
          { ink: p.inks[2], op: .42, off: [-2, 2], L: { a: RIP.field((x, y) => .7 * arm(x, y, 5, 9.5, 2.2)) } },
          { ink: "#efe6cf", op: .85, L: stars },
        ] });
      return `<div class="lc" style="background:${p.paper};color:${p.ink}">${RIP.img(url)}${c.photo}
      <div class="abs" style="left:88px;right:88px;top:84px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:22px;letter-spacing:.32em"><span>NIGHT VORTEX</span><span>${c.wen} · ${c.year || ""}</span></div>
      <div class="abs" style="left:${C[0] - 140}px;top:${C[1] - 92}px;width:280px;text-align:center;font-family:var(--corm)">
        <div style="font-size:132px;font-weight:600;line-height:1">${c.day || "—"}</div><div style="font-size:26px;letter-spacing:.5em;margin-top:6px;padding-left:.5em">${c.mon}</div></div>
      <div class="abs" style="left:0;right:0;top:${top - 116}px;text-align:center;font-family:var(--serif);font-size:62px;font-weight:600;letter-spacing:.5em;padding-left:.5em;${RIP.halo(p, 1.2)}">每日计划</div>
      <div class="abs" style="left:0;right:0;top:${top - 34}px;display:flex;justify-content:center;gap:16px;align-items:center;opacity:.8">${[0, 1, 2].map((i) => `<i style="width:${i === 1 ? 10 : 6}px;height:${i === 1 ? 10 : 6}px;border-radius:50%;background:${p.inks[i]}"></i>`).join("")}</div>
      <div class="abs" style="left:150px;right:150px;top:${top}px;font-family:var(--serif)">${c.rows((it, s) => `<div style="display:flex;align-items:center;justify-content:center;gap:22px;height:${r.h}px;${RIP.halo(p)}">
        ${c.b(it, RIP.box(s, { shape: "star", ink: p.ink, fill: p.inks[0], paper: p.paper, size: Math.min(40, r.h - 22), sw: 2.2 }))}
        <span style="display:flex;min-width:0;max-width:640px">${c.t(it, `font-size:${r.f}px;font-weight:500;letter-spacing:.1em;flex:0 1 auto;${RIP.xs(s)}`)}</span></div>`)}</div>
      <div class="abs" style="left:44px;right:44px;top:1404px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:18px;letter-spacing:.3em;opacity:.85"><span>涟漪 · ${esc(p.name)}</span><span>${RIP.tally(c)}</span></div>
      </div>`;
    },
  };

  /* 孔版油墨色都往灰里收了一点：低对比、像纸上的印刷，不是屏幕上的霓虹 */
  PALETTES.autumn = [
    { name:"双心",   v:"duo",     paper:"#f1ebe0", inks:["#ec7f94","#5279b9"], ink:"#2b2f52", acc:"#e0607a" },
    { name:"莫尔纹", v:"moire",   paper:"#eeede6", inks:["#3a8e8a","#d8635a"], ink:"#1f2a2a" },
    { name:"风过",   v:"wind",    paper:"#f2ede1", inks:["#6b9f73","#e6b54e","#df7d4e"], ink:"#26341f" },
    { name:"网点",   v:"dots",    paper:"#f3eee6", inks:["#4363ac","#ec7a96"], ink:"#1f2748" },
    { name:"等高线", v:"contour", paper:"#efebdf", inks:["#9c6e4b","#86a978","#6a93c0"], ink:"#3b2b1d" },
    { name:"雨塘",   v:"rain",    paper:"#ecf0ea", inks:["#3f9391","#6d8dcf"], ink:"#173a44" },
    { name:"夜旋",   v:"vortex",  paper:"#1b1d33", night:true, inks:["#e2b462","#d27791","#62b0c2"], ink:"#f1eadb" },
  ];
  PAL_SW.autumn = (p) => [p.paper, p.inks[0], p.inks[1]];
  LAYOUTS.autumn = (c, p) => RIPV[p.v](c, p);
