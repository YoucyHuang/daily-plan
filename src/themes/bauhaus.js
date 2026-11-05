  /* 包豪斯：纯白（近白）底，颜色只来自几何形。7 套配色各是一种构图：
     经典三原色 / 瑞士网格大数字 / 致敬正方形 / 构成主义斜带 / 拜耳竖排字 / 康定斯基点线面 / 克利色块格 */
  PALETTES.bauhaus = [
    { name:"红黄蓝",   v:"primary",   c:["#d7352a","#1f4e9c","#f2b82e"], k:"#1a1a1a", bg:"#ffffff" },
    { name:"瑞士网格", v:"swiss",     c:["#1a1a1a","#e2352b","#b9b9b9"], k:"#1a1a1a", bg:"#ffffff" },
    { name:"致敬正方形", v:"albers",  c:["#c47f6b","#6e8ca0","#d9b96e"], k:"#2b2b2b", bg:"#fbfaf7" },
    { name:"构成斜带", v:"diagonal",  c:["#e8643c","#1f3a68","#9ec3d9"], k:"#14213d", bg:"#ffffff" },
    { name:"竖排字",   v:"bayer",     c:["#f46a6a","#2bae8c","#f6c445"], k:"#1a1a1a", bg:"#ffffff" },
    { name:"点线面",   v:"kandinsky", c:["#6b3fa0","#f28c28","#f2c6d6"], k:"#1a1a1a", bg:"#fffdf9" },
    { name:"色块格",   v:"grid",      c:["#2f6b4f","#e0a526","#9bb7a6"], k:"#18261f", bg:"#fbfaf6" },
  ];
  PAL_SW.bauhaus = (p) => p.c;

  /* 几何勾选框：k 0 圆 / 1 方 / 2 三角；完成 = 填色 + 白勾，划掉 = 黑描边 + 叉 */
  const bhBox = (s, k, col, K, sz = 52, { onDark = false } = {}) => {
    const line = onDark ? "#fff" : col, fill = s === "c" ? col : "none", stroke = s === "x" ? (onDark ? "#fff" : K) : line;
    const g = k === 0 ? `<circle cx="50" cy="50" r="43" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`
      : k === 1 ? `<rect x="7" y="7" width="86" height="86" fill="${fill}" stroke="${stroke}" stroke-width="8"/>`
      : `<path d="M50 7L94 90H6Z" fill="${fill}" stroke="${stroke}" stroke-width="8" stroke-linejoin="miter"/>`;
    const dy = k === 2 ? 12 : 0;
    const tick = /^#[0-9a-f]{6}$/i.test(col) && isLight(col) ? K : "#fff";
    const mk = s === "c" ? `<path d="M29 ${52 + dy}l14 14 28-30" fill="none" stroke="${tick}" stroke-width="10" stroke-linecap="square"/>`
      : s === "x" ? `<path d="M32 ${32 + dy}l36 36M68 ${32 + dy}l-36 36" fill="none" stroke="${onDark ? "#fff" : K}" stroke-width="9"/>` : "";
    return `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" style="display:block;flex:0 0 auto;overflow:visible">${g}${mk}</svg>`;
  };
  const bhTxt = (s, extra = "") => `font-weight:500;${s === "x" ? "opacity:.38;text-decoration:line-through;text-decoration-thickness:3px;" : ""}${extra}`;
  const bhDone = (c) => frontMode ? "—" : `${c.done}/${c.n}`;
  const bhMix = (c, pct, base = "#fff") => `color-mix(in srgb, ${c} ${pct}%, ${base})`;

  const BH = {
    /* 0 经典三原色：右上大红圆 + 黄半圆 + 蓝方块，粗黑条压住标题，清单左侧一条条色标 */
    primary(c, p) {
      const K = p.k, [R, B, Y] = p.c, f = c.fit(600, 98, 40);
      return `<div class="lc" style="background:${p.bg};color:${K}">
      ${c.photo}
      <div class="abs" style="left:560px;top:-70px;width:560px;height:560px;border-radius:50%;background:${R}"></div>
      <div class="abs" style="left:430px;top:430px;width:300px;height:150px;border-radius:0 0 150px 150px;background:${Y}"></div>
      <div class="abs" style="left:880px;top:400px;width:200px;height:200px;background:${B}"></div>
      <div class="abs" style="left:736px;top:180px;width:0;height:0;border-left:70px solid transparent;border-right:70px solid transparent;border-bottom:122px solid ${K}"></div>
      <div class="abs" style="left:90px;top:96px;font-family:var(--jost);font-weight:700;font-size:168px;line-height:.86;letter-spacing:-.03em">DAILY<br>PLAN</div>
      <div class="abs" style="left:90px;top:410px;width:300px;height:18px;background:${K}"></div>
      <div class="abs" style="left:90px;top:452px;font-weight:700;font-size:30px;letter-spacing:.32em">每日计划</div>
      <div class="abs" style="left:90px;top:500px;font-family:var(--jost);font-weight:500;font-size:28px;letter-spacing:.16em">${esc(c.date)} · ${c.wen}</div>
      <div class="abs" style="left:90px;right:90px;top:616px;height:4px;background:${K}"></div>
      <div class="abs" style="left:90px;right:90px;top:640px">${c.rows((it, s, i) => { const col = p.c[i % 3]; return `<div style="display:flex;align-items:center;gap:30px;height:${f.h}px;border-bottom:2px solid ${bhMix(K, 18)}">
        <i style="width:14px;align-self:stretch;margin:14px 0;background:${col}"></i>
        <span style="font-family:var(--jost);font-weight:700;font-size:30px;width:48px">${p2(i + 1)}</span>
        ${c.b(it, bhBox(s, i % 3, col, K, Math.min(52, f.h - 30)))}
        ${c.t(it, `font-size:${f.f}px;${bhTxt(s)}`)}</div>`; })}</div>
      <div class="abs" style="left:90px;bottom:84px;display:flex;align-items:flex-end;gap:14px">
        <i style="width:46px;height:46px;border-radius:50%;background:${R}"></i><i style="width:46px;height:46px;background:${B}"></i>
        <i style="width:0;height:0;border-left:26px solid transparent;border-right:26px solid transparent;border-bottom:46px solid ${Y}"></i></div>
      <div class="abs" style="right:90px;bottom:88px;font-family:var(--jost);font-weight:500;font-size:28px;letter-spacing:.18em">FORM FOLLOWS FUNCTION · ${bhDone(c)}</div>
      </div>`;
    },

    /* 1 瑞士网格：12 栏发丝网格，巨大的日期数字压满上半张，红点是唯一的颜色 */
    swiss(c, p) {
      const K = p.k, RED = p.c[1], G = p.c[2], f = c.fit(510, 84, 38);
      const grid = Array.from({ length: 13 }, (_, i) => `<i class="abs" style="left:${60 + i * 80}px;top:0;bottom:0;width:1px;background:${bhMix(K, 9)}"></i>`).join("");
      const day = c.day || "00", mon = c.m ? p2(c.m) : "00";
      return `<div class="lc" style="background:${p.bg};color:${K};font-family:var(--jost)">
      ${grid}
      ${c.photo}
      <div class="abs" style="left:60px;right:60px;top:60px;display:flex;justify-content:space-between;font-weight:500;font-size:24px;letter-spacing:.14em;text-transform:uppercase">
        <span>Daily Plan</span><span>${c.wen || ""}</span><span>${c.year || ""}</span><span>Nº ${bhDone(c)}</span></div>
      <div class="abs" style="left:60px;right:60px;top:104px;height:6px;background:${K}"></div>
      <div class="abs" style="left:44px;top:96px;font-weight:700;font-size:560px;line-height:1;letter-spacing:-.07em">${day}</div>
      <div class="abs" style="left:700px;top:150px;font-weight:700;font-size:250px;line-height:1;letter-spacing:-.05em;color:transparent;-webkit-text-stroke:4px ${K}">${mon}</div>
      <div class="abs" style="left:780px;top:430px;width:120px;height:120px;border-radius:50%;background:${RED}"></div>
      <div class="abs" style="left:700px;top:574px;width:320px;font-family:var(--sans);font-weight:700;font-size:40px;line-height:1.2;letter-spacing:.1em">每日<br>计划</div>
      <div class="abs" style="left:860px;top:584px;width:170px;font-size:20px;line-height:1.5;color:${G === "#b9b9b9" ? "#7a7a7a" : G};letter-spacing:.04em">one day,<br>one grid,<br>${c.n} things.</div>
      <div class="abs" style="left:60px;right:60px;top:${1300 - f.h * c.n - 18}px;border-top:6px solid ${K}">
        ${c.rows((it, s, i) => `<div style="display:grid;grid-template-columns:160px minmax(0,1fr) 60px;align-items:center;height:${f.h}px;border-bottom:1px solid ${K}">
          <span style="font-weight:700;font-size:${Math.min(44, f.h - 30)}px;letter-spacing:-.02em;color:${s === "c" ? RED : K}">${p2(i + 1)}</span>
          ${c.t(it, `font-family:var(--sans);font-size:${f.f}px;${bhTxt(s)}`)}
          ${c.b(it, `<span style="display:block;width:${Math.min(44, f.h - 34)}px;height:${Math.min(44, f.h - 34)}px">${bhBox(s, 1, s === "c" ? RED : K, K, Math.min(44, f.h - 34))}</span>`)}</div>`)}
      </div>
      <div class="abs" style="left:60px;right:60px;top:1330px;display:flex;justify-content:space-between;font-weight:500;font-size:22px;letter-spacing:.16em">
        <span>GRID SYSTEM · 12 COL</span><span style="display:flex;align-items:center;gap:12px"><i style="width:18px;height:18px;border-radius:50%;background:${RED}"></i>${c.date}</span></div>
      </div>`;
    },

    /* 2 致敬正方形：层层嵌套、略微下沉的方块（阿尔伯斯），清单写在最里面一层 */
    albers(c, p) {
      const K = p.k, [T, Bl, S] = p.c, f = c.fit(680, 86, 38);
      const sq = (l, t, r, b, col) => `<div class="abs" style="left:${l}px;top:${t}px;right:${r}px;bottom:${b}px;background:${col}"></div>`;
      return `<div class="lc" style="background:${p.bg};color:${K}">
      ${sq(60, 60, 60, 60, S)}${sq(130, 190, 130, 150, T)}${sq(200, 320, 200, 200, Bl)}${sq(256, 430, 256, 236, "#f6f1e7")}
      ${c.photo}
      <div class="abs" style="left:100px;right:100px;top:92px;display:flex;justify-content:space-between;align-items:baseline;font-family:var(--jost);color:${K}">
        <span style="font-weight:600;font-size:30px;letter-spacing:.3em">HOMAGE TO THE DAY</span><span style="font-weight:500;font-size:26px;letter-spacing:.14em">${esc(c.date)}</span></div>
      <div class="abs" style="left:170px;right:170px;top:220px;display:flex;justify-content:space-between;align-items:baseline;color:#fff">
        <span style="font-weight:700;font-size:64px;letter-spacing:.22em">每日计划</span><span style="font-family:var(--jost);font-weight:500;font-size:28px;letter-spacing:.2em">${c.wen}</span></div>
      <div class="abs" style="left:236px;right:236px;top:346px;font-family:var(--jost);font-weight:500;font-size:24px;letter-spacing:.3em;color:rgba(255,255,255,.88)">SQUARE · ${c.n} · ${bhDone(c)}</div>
      <div class="abs" style="left:296px;right:296px;top:470px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:24px;height:${f.h}px;border-bottom:2px solid ${bhMix(K, 12, "#f6f1e7")}">
        ${c.b(it, bhBox(s, 1, [T, Bl, S][i % 3], K, Math.min(46, f.h - 30)))}
        ${c.t(it, `font-size:${f.f}px;${bhTxt(s)}`)}</div>`)}</div>
      <div class="abs" style="left:100px;right:100px;bottom:92px;display:flex;justify-content:space-between;align-items:center;font-family:var(--jost);font-weight:500;font-size:22px;letter-spacing:.28em;color:${K}">
        <span>INTERACTION OF COLOR</span><span>${[S, T, Bl].map((x) => `<i style="display:inline-block;width:22px;height:22px;margin-left:8px;background:${x};vertical-align:-3px;box-shadow:0 0 0 2px ${K}"></i>`).join("")}</span></div>
      </div>`;
    },

    /* 3 构成主义斜带：整条清单压在一条倾斜的深蓝色带上，橙色大圆和细线从斜向切过 */
    diagonal(c, p) {
      const K = p.k, [O, N, L2] = p.c, f = c.fit(620, 82, 36), H = f.h * c.n + 150;
      return `<div class="lc" style="background:${p.bg};color:${K}">
      ${c.photo}
      <div class="abs" style="left:640px;top:70px;width:380px;height:380px;border-radius:50%;background:${O}"></div>
      <div class="abs" style="left:560px;top:520px;width:700px;height:8px;background:${K};transform:rotate(-24deg);transform-origin:0 0"></div>
      <div class="abs" style="left:620px;top:-60px;width:6px;height:620px;background:${K};transform:rotate(28deg)"></div>
      <div class="abs" style="left:700px;top:1120px;width:0;height:0;border-left:190px solid transparent;border-bottom:330px solid ${L2}"></div>
      <div class="abs" style="left:76px;top:118px;transform:rotate(-12deg);transform-origin:0 50%">
        <div style="font-family:var(--jost);font-weight:700;font-size:150px;line-height:.9;letter-spacing:-.02em">DAILY</div>
        <div style="font-family:var(--jost);font-weight:700;font-size:150px;line-height:.9;letter-spacing:-.02em;color:${O === "#e8643c" ? N : O};margin-left:120px">PLAN</div></div>
      <div class="abs" style="left:96px;top:440px;transform:rotate(-12deg);transform-origin:0 0;font-weight:700;font-size:34px;letter-spacing:.36em">每日计划 · ${c.wen}</div>
      <div class="abs" style="left:-60px;width:1200px;top:${Math.max(560, 930 - H / 2)}px;height:${H}px;transform:rotate(-8deg);transform-origin:50% 50%;background:${N};color:#fff;box-shadow:0 22px 0 ${O}">
        <div style="position:absolute;left:150px;right:150px;top:44px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:600;font-size:24px;letter-spacing:.3em;color:${L2}"><span>CONSTRUCT THE DAY → ${esc(c.date)}</span><span>${bhDone(c)}</span></div>
        <div style="position:absolute;left:150px;right:150px;top:100px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:26px;height:${f.h}px;border-bottom:2px solid rgba(255,255,255,.22)">
          <span style="font-family:var(--jost);font-weight:700;font-size:28px;width:46px;color:${L2}">${p2(i + 1)}</span>
          ${c.b(it, bhBox(s, [0, 2, 1][i % 3], s === "c" ? O : "#fff", "#fff", Math.min(48, f.h - 28), { onDark: s !== "c" }))}
          ${c.t(it, `font-size:${f.f}px;${bhTxt(s)}`)}</div>`)}</div></div>
      </div>`;
    },

    /* 4 竖排字：左边一整列竖排巨字「DAILY」，右上一块黄色日期，清单用粗线隔开（拜耳通用字体的感觉） */
    bayer(c, p) {
      const K = p.k, [C, G, Y] = p.c, f = c.fit(700, 92, 38);
      return `<div class="lc" style="background:${p.bg};color:${K}">
      <div class="abs" style="left:0;top:0;bottom:0;width:300px;background:${G}"></div>
      ${c.photo}
      <div class="abs" style="left:30px;top:60px;writing-mode:vertical-rl;transform:rotate(180deg);font-family:var(--jost);font-weight:700;font-size:280px;line-height:.86;letter-spacing:-.01em;color:#fff;height:1320px;text-align:left">daily</div>
      <div class="abs" style="left:50px;top:70px;width:200px;height:200px;border-radius:50%;background:${C}"></div>
      <div class="abs" style="left:50px;top:300px;width:200px;height:100px;border-radius:100px 100px 0 0;background:${Y}"></div>
      <div class="abs" style="left:300px;top:0;width:780px;height:330px;background:${Y}"></div>
      <div class="abs" style="left:350px;top:56px;font-family:var(--jost);font-weight:700;font-size:200px;line-height:1;letter-spacing:-.04em">${c.day || "—"}</div>
      <div class="abs" style="left:640px;top:84px;font-family:var(--jost);font-weight:600;font-size:40px;line-height:1.25;letter-spacing:.04em;text-transform:lowercase">${(c.mon || "").toLowerCase()} ${c.year || ""}<br>${(c.wen || "").toLowerCase()}</div>
      <div class="abs" style="left:640px;top:222px;font-weight:900;font-size:48px;letter-spacing:.3em">每日计划</div>
      <div class="abs" style="right:0;top:330px;width:120px;height:120px;background:${C}"></div>
      <div class="abs" style="left:350px;top:390px;font-family:var(--jost);font-weight:500;font-size:28px;letter-spacing:.06em">plan for: <b style="font-weight:700">${c.n}</b> &nbsp; done: <b style="font-weight:700;color:${C}">${bhDone(c)}</b></div>
      <div class="abs" style="left:350px;right:80px;top:470px;border-top:12px solid ${K}">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:28px;height:${f.h}px;border-bottom:${i === c.n - 1 ? 12 : 3}px solid ${K}">
        ${c.b(it, bhBox(s, 0, i % 2 ? G : C, K, Math.min(50, f.h - 30)))}
        ${c.t(it, `font-size:${f.f}px;${bhTxt(s)}`)}</div>`)}</div>
      <div class="abs" style="left:350px;right:80px;bottom:70px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:26px;letter-spacing:.04em;text-transform:lowercase"><span>universal · one alphabet, one day</span><span style="color:${C}">●</span></div>
      </div>`;
    },

    /* 5 点线面：上半张是康定斯基式构图（同心圆、细线、弧、小三角、棋盘格），每件事都挂在一条长短不一的线上 */
    kandinsky(c, p) {
      const K = p.k, [V, O, Pk] = p.c, f = c.fit(640, 86, 38);
      const R = rng(19);
      const lines = Array.from({ length: 9 }, () => { const x1 = R() * 1080, y1 = R() * 560, a = (R() - .5) * 1.6, l = 300 + R() * 500;
        return `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${(x1 + Math.cos(a) * l).toFixed(0)}" y2="${(y1 + Math.sin(a) * l).toFixed(0)}" stroke="${K}" stroke-width="${(1.5 + R() * 4).toFixed(1)}"/>`; }).join("");
      const checker = Array.from({ length: 16 }, (_, i) => (i + (i >> 2)) % 2 ? `<rect x="${(i % 4) * 22}" y="${(i >> 2) * 22}" width="22" height="22" fill="${K}"/>` : "").join("");
      const off = (i) => [0, 90, 30, 140, 60, 10, 120, 40, 100, 20, 70, 150][i % 12];
      return `<div class="lc" style="background:${p.bg};color:${K}">
      ${c.photo}
      <svg class="abs" style="left:0;top:0" width="1080" height="640" viewBox="0 0 1080 640">
        <circle cx="770" cy="250" r="230" fill="${V}"/><circle cx="770" cy="250" r="150" fill="${O}"/><circle cx="770" cy="250" r="70" fill="${K}"/>
        <circle cx="250" cy="420" r="120" fill="${Pk}"/><circle cx="250" cy="420" r="120" fill="none" stroke="${K}" stroke-width="4"/>
        <circle cx="470" cy="110" r="36" fill="${K}"/><circle cx="960" cy="560" r="26" fill="none" stroke="${V}" stroke-width="8"/>
        ${lines}
        <path d="M80 260 A260 260 0 0 1 520 120" fill="none" stroke="${V}" stroke-width="14"/>
        <path d="M600 560 A180 180 0 0 1 960 520" fill="none" stroke="${K}" stroke-width="5"/>
        <path d="M120 120 L210 40 L230 160Z" fill="${O}"/><path d="M560 470 L640 600 L500 600Z" fill="none" stroke="${K}" stroke-width="5"/>
        <g transform="translate(400 300) rotate(18)">${checker}</g>
      </svg>
      <div class="abs" style="left:80px;top:560px;display:flex;align-items:baseline;gap:30px;background:${p.bg};padding:10px 26px 10px 0">
        <span style="font-weight:900;font-size:64px;letter-spacing:.16em">每日计划</span>
        <span style="font-family:var(--jost);font-weight:500;font-size:26px;letter-spacing:.2em">POINT · LINE · PLANE</span></div>
      <div class="abs" style="left:80px;right:80px;top:680px">${c.rows((it, s, i) => { const col = [V, O, Pk][i % 3], x = off(i);
        return `<div style="position:relative;display:flex;align-items:center;gap:26px;height:${f.h}px;padding-left:${x}px">
          <i style="position:absolute;left:${x + 24}px;right:${(i * 37) % 120}px;bottom:${Math.round(f.h * .16)}px;height:${s === "c" ? 6 : 2}px;background:${s === "c" ? col : K}"></i>
          ${c.b(it, bhBox(s, i % 3 === 1 ? 2 : 0, col === Pk ? V : col, K, Math.min(48, f.h - 30)))}
          ${c.t(it, `position:relative;font-size:${f.f}px;${bhTxt(s)}`)}</div>`; })}</div>
      <div class="abs" style="left:80px;right:80px;bottom:70px;display:flex;justify-content:space-between;font-family:var(--jost);font-weight:500;font-size:24px;letter-spacing:.2em">
        <span>COMPOSITION Nº ${c.d || 1} · ${c.wen}</span><span>${esc(c.date)} · ${bhDone(c)}</span></div>
      </div>`;
    },

    /* 6 色块格：整张是一张克利式的色块棋盘，每件事住进自己的一格，标题也只是其中的一格 */
    grid(c, p) {
      const K = p.k, [Fo, Go, Sa] = p.c, n = Math.max(c.n, 1);
      const cols = n <= 4 ? 1 : 2, rows = Math.ceil(n / cols), top = 470, H = 1440 - 60 - top, ch = Math.floor((H - (rows - 1) * 12) / rows);
      const tints = [Fo, bhMix(Sa, 70), Go, bhMix(Fo, 22), bhMix(Go, 35), Sa, bhMix(Fo, 60), "#ffffff"];
      const dark = (col) => col === Fo || col === tints[6];
      const R = rng(7);
      const mosaic = Array.from({ length: 30 }, (_, i) => { const col = tints[Math.floor(R() * tints.length)];
        const sh = R(), ink = col === Fo ? Go : col === Go ? Fo : col === Sa ? "#fff" : Fo;
        const g = sh < .18 ? `<b style="position:absolute;inset:18%;border-radius:50%;background:${ink}"></b>` : sh < .3 ? `<b style="position:absolute;left:0;bottom:0;width:100%;height:50%;border-radius:0 0 999px 999px;background:${ink}"></b>`
          : sh < .38 ? `<b style="position:absolute;inset:0;background:linear-gradient(135deg,transparent 50%,${ink} 50%)"></b>` : "";
        return `<i style="position:relative;overflow:hidden;background:${col};${col === "#ffffff" ? `box-shadow:inset 0 0 0 2px ${bhMix(K, 12)}` : ""}">${g}</i>`; }).join("");
      const fs = Math.max(26, Math.min(cols === 1 ? 46 : 38, Math.round(ch * .26)));
      return `<div class="lc" style="background:${p.bg};color:${K}">
      <div class="abs" style="left:60px;top:60px;width:960px;height:380px;display:grid;grid-template-columns:repeat(10,1fr);grid-template-rows:repeat(3,1fr);gap:12px">${mosaic}</div>
      <div class="abs" style="left:60px;top:60px;width:377px;height:249px;background:${K};color:#fff;padding:30px 34px;box-sizing:border-box">
        <div style="font-weight:900;font-size:58px;letter-spacing:.14em;line-height:1.1">每日计划</div>
        <div style="font-family:var(--jost);font-weight:500;font-size:24px;letter-spacing:.2em;margin-top:22px;color:${Sa}">${esc(c.date)} · ${c.wen}</div>
        <div style="font-family:var(--jost);font-weight:500;font-size:24px;letter-spacing:.2em;margin-top:6px;color:${Go}">MAGIC SQUARE · ${bhDone(c)}</div></div>
      ${c.photo}
      <div class="abs" style="left:60px;top:${top}px;width:960px;display:grid;grid-template-columns:repeat(${cols},1fr);grid-auto-rows:${ch}px;gap:12px">
        ${c.rows((it, s, i) => { const col = [Fo, bhMix(Sa, 55), Go, bhMix(Fo, 18), bhMix(Go, 30), Sa][(i + (cols === 2 ? Math.floor(i / 2) % 2 : 0)) % 6], d = dark(col);
          return `<div style="position:relative;background:${col};color:${d ? "#fff" : K};padding:0 30px;display:flex;align-items:center;gap:24px;overflow:hidden">
          <span style="position:absolute;right:20px;top:${ch > 120 ? 14 : 6}px;font-family:var(--jost);font-weight:700;font-size:${Math.min(40, Math.round(ch * .3))}px;opacity:.35">${p2(i + 1)}</span>
          ${c.b(it, bhBox(s, [1, 0, 2][i % 3], d ? "#fff" : K, K, Math.min(50, Math.round(ch * .42)), { onDark: d }))}
          ${c.t(it, `position:relative;font-size:${fs}px;${bhTxt(s)}`)}</div>`; })}
        ${cols === 2 && n % 2 ? `<div style="position:relative;background:${Go};overflow:hidden"><i style="position:absolute;left:50%;top:50%;width:${ch * .8}px;height:${ch * .8}px;margin:-${ch * .4}px;border-radius:50%;background:${Fo}"></i><i style="position:absolute;right:0;bottom:0;width:${ch * .4}px;height:${ch * .4}px;background:${K}"></i></div>` : ""}
      </div>
      </div>`;
    },
  };
  LAYOUTS.bauhaus = (c, p) => (BH[p.v] || BH.primary)(c, p);
