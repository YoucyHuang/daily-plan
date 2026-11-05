  /* 宋人花鸟：7 套配色各是一种装裱 / 构图，主画用博物馆公有领域（CC0）的宋元原作（出处见 assets/songyuan/SOURCES.md）
     册页 · 团扇 · 手卷 · 立轴 · 梅雀小幅（竖排清单）· 荷塘满幅 · 月下梅（夜绢） */
  PALETTES.songyuan = [
    { name:"海棠 · 册页",   v:"album",  sw:["#c7b48a","#8fa08a","#e9dcc6"], ground:"#9fae9c", mount:"#c9cfb8", paper:"#e6dcc3", ink:"#2e2618", soft:"#6e5b3c", seal:"#b0493a", line:"#4a3d29", gold:"#d9bf86" },
    { name:"团扇 · 梅竹双雀", v:"fan",  sw:["#e8e1cf","#8b6a43","#b0493a"], ground:"#e7e0cc", paper:"#efe9d8", ink:"#3a2c1c", soft:"#7a6648", seal:"#b0493a", line:"#5a4630", gold:"#c9a76a", stick:"#9b7a46" },
    { name:"手卷 · 竹禽",   v:"scroll", sw:["#efe7d3","#5e8a83","#b0493a"], ground:"#eee6d2", paper:"#f4eedf", ink:"#2b2419", soft:"#7a6a4c", seal:"#b0493a", line:"#4b3c28", gold:"#c8a96a", brocade:"#3f5f63", brocade2:"#8fb0a6", roller:"#5a3b22" },
    { name:"立轴 · 牡丹",   v:"hang",   sw:["#e6e0d2","#3b2f28","#a83a3a"], ground:"#e6e0d3", paper:"#e6e0d3", ink:"#2a2420", soft:"#7c7062", seal:"#a83a3a", line:"#3b2f28", gold:"#c7a86c", tian:"#d6cdb6", ge:"#5b3a2e", roller:"#3a2a1f" },
    { name:"梅雀 · 竖排",   v:"vert",   sw:["#d8c7a0","#c06a3e","#e8e0cc"], ground:"#d9c9a3", paper:"#e4d7b6", ink:"#2e2416", soft:"#7a6544", seal:"#b0493a", line:"#4a3a24", gold:"#e2c27a" },
    { name:"荷塘 · 燕",     v:"lotus",  sw:["#b59b6c","#4d4a3c","#efe4c8"], ground:"#b49a6b", paper:"#c9b386", ink:"#231b10", soft:"#5e4c30", seal:"#a8402f", line:"#2f2616", gold:"#efe1b8" },
    { name:"月下梅 · 夜绢", v:"moon",   sw:["#1d1a1f","#d9c58e","#f3ead2"], ground:"#191719", paper:"#24211f", ink:"#efe4c6", soft:"#a59777", seal:"#c25a46", line:"#d9c58e", gold:"#d9c58e" },
  ];
  PAL_SW.songyuan = (p) => p.sw;

  const SY_A = (f) => (location.pathname.includes("/studio/") ? "../" : "") + "assets/songyuan/" + f;
  /* 绢纹：横竖细经纬 + 年久的水渍与暗角 */
  const sySilk = (col, dark = .22) => `repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,rgba(0,0,0,.04) 1px 2px,transparent 2px 3px),
    repeating-linear-gradient(90deg,rgba(0,0,0,.035) 0 1px,transparent 1px 3px),
    radial-gradient(520px 380px at 18% 82%,rgba(90,60,20,.10),transparent 70%),
    radial-gradient(620px 420px at 82% 22%,rgba(255,240,205,.12),transparent 70%),
    radial-gradient(1200px 950px at 50% 48%,transparent 55%,rgba(40,26,8,${dark})),${col}`;
  /* 绫纹（装裱用的暗花）：小菱格 */
  const syLing = (col, line) => `url('data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M11 1L21 11L11 21L1 11Z" fill="none" stroke="${line}" stroke-width=".8"/><circle cx="11" cy="11" r="1.4" fill="${line}"/></svg>`)}'),${col}`;
  /* 收藏印：方 / 椭圆，朱文，半透明 */
  const sySeal = (x, y, txt, p, { w = 58, h = 58, round = false, size = 22, op = .72, solid = false } = {}) =>
    `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:2.4px solid ${p.seal};border-radius:${round ? "50%" : "4px"};opacity:${op};
      display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;font-family:var(--brush);font-size:${size}px;line-height:1.05;letter-spacing:-.04em;
      color:${solid ? "#f4e9d6" : p.seal};background:${solid ? p.seal : "transparent"}">${txt}</div>`;
  const syDate = (c) => c.m ? `${L.cnMon(c.m)}月${L.cnDay(c.d)}日` : esc(c.date);
  const syCk = (s, p, size = 38, onDark = false) => L.ck(s, { size, color: s === "x" ? p.seal : p.ink, mark: s === "x" ? p.seal : onDark ? p.gold : p.seal,
    border: `1.4px solid ${s === "x" ? p.seal : p.soft}`, radius: 3, w: 2, paths: L.HP });
  const syTxt = (s, p, f, extra = "") => `font-size:${f}px;letter-spacing:.08em;${s === "x" ? `color:${p.soft};text-decoration:line-through;text-decoration-color:${p.seal};text-decoration-thickness:2px` : ""};${extra}`;
  /* 横排一行：勾选框 + 文字 + 细界线 */
  const syRow = (c, it, s, p, h, f, rule) => `<div style="display:flex;align-items:center;gap:26px;height:${h}px;${rule ? `border-bottom:1px solid ${rule}` : ""}">
    ${c.b(it, syCk(s, p, Math.min(38, h - 10)))}${c.t(it, syTxt(s, p, f))}</div>`;
  const syDone = (c) => frontMode ? `${c.n} 事` : `${c.done} / ${c.n}`;

  const SY = {
    /* 0 册页：小方幅原画居中，左右窄边是竖排题签与日期，下面一张朱丝栏笺纸写清单 */
    album(c, p) {
      const r = c.fit(336, 62, 32), rule = `color-mix(in srgb, ${p.seal} 45%, transparent)`;
      return `<div class="lc grain" style="background:${syLing(p.mount, "rgba(80,90,60,.14)")};color:${p.ink};font-family:var(--serif)">
      <div class="abs" style="inset:0;background:radial-gradient(1100px 900px at 50% 45%,transparent 60%,rgba(40,50,30,.18))"></div>
      ${c.photo}
      <div class="abs" style="left:150px;top:96px;width:780px;height:780px;padding:16px;background:${p.ground};box-shadow:0 2px 0 rgba(0,0,0,.08),0 18px 40px rgba(40,40,20,.18)">
        <div style="width:100%;height:100%;border:1.5px solid ${p.line};padding:5px"><img alt="" src="${SY_A("haitang.jpg")}" style="width:100%;height:100%;object-fit:cover;display:block"></div></div>
      ${sySeal(862, 812, "清玩", p, { w: 44, h: 44, size: 17, op: .66 })}
      <div class="abs" style="right:52px;top:110px;writing-mode:vertical-rl;font-size:62px;font-weight:600;letter-spacing:.3em;line-height:1">每日计划</div>
      <div class="abs" style="right:58px;top:470px;writing-mode:vertical-rl;font-size:22px;letter-spacing:.34em;color:${p.soft}">折枝海棠　宋人册页</div>
      <div class="abs" style="left:62px;top:116px;writing-mode:vertical-rl;font-size:24px;letter-spacing:.32em;color:${p.soft}">${syDate(c)}　${c.wcn}</div>
      <div class="abs" style="left:150px;width:780px;top:920px;height:440px;padding:26px 40px 0;box-sizing:border-box;background:${sySilk(p.paper, .08)};box-shadow:0 10px 26px rgba(40,40,20,.14)">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:10px;border-bottom:2px solid ${p.seal}">
          <span style="font-size:34px;font-weight:600;letter-spacing:.36em">今日功课</span><span style="font-size:20px;letter-spacing:.3em;color:${p.soft}">${syDone(c)}</span></div>
        ${c.rows((it, s) => syRow(c, it, s, p, r.h, r.f, rule))}
        <div style="height:${Math.max(0, 336 - r.h * c.n)}px;background:repeating-linear-gradient(180deg,transparent 0 ${r.h - 1}px,${rule} ${r.h - 1}px ${r.h}px)"></div>
      </div>
      </div>`;
    },

    /* 1 团扇：扇面浮在浅绢上，竹柄与红穗垂下，清单像扇下的题字居中排列 */
    fan(c, p) {
      const r = c.fit(380, 58, 32);
      return `<div class="lc grain" style="background:${sySilk(p.ground, .16)};color:${p.ink};font-family:var(--serif)">
      ${c.photo}
      <svg class="abs" style="left:0;top:0" width="1080" height="1440" viewBox="0 0 1080 1440">
        <g fill="none" stroke="${p.gold}" stroke-width="1.2" opacity=".5">${Array.from({ length: 6 }, (_, i) => `<path d="M${120 + i * 160} 1400q40-26 80 0t80 0"/>`).join("")}</g>
        <rect x="531" y="676" width="18" height="122" rx="6" fill="${p.stick}"/><rect x="531" y="676" width="18" height="122" rx="6" fill="none" stroke="${p.line}" stroke-width="1.4"/>
        ${[712, 744, 776].map((y) => `<line x1="531" x2="549" y1="${y}" y2="${y}" stroke="${p.line}" stroke-width="1.2" opacity=".6"/>`).join("")}
        <circle cx="540" cy="804" r="8" fill="${p.seal}"/>
        <path d="M546 808C580 818 640 806 700 820C740 830 752 846 758 862" fill="none" stroke="${p.seal}" stroke-width="3"/>
        <rect x="750" y="858" width="16" height="11" rx="3" fill="${p.gold}"/>
        <g stroke="${p.seal}" stroke-width="1.6">${Array.from({ length: 9 }, (_, i) => `<line x1="${754 + i * 1.1}" y1="868" x2="${746 + i * 2.6}" y2="${918 + (i % 3) * 5}"/>`).join("")}</g>
      </svg>
      <img class="abs" alt="" src="${SY_A("fan.webp")}" style="left:222px;top:60px;width:636px;height:628px;filter:drop-shadow(0 16px 26px rgba(60,40,10,.28))">
      <div class="abs" style="left:88px;top:90px;writing-mode:vertical-rl;font-size:60px;font-weight:600;letter-spacing:.32em;line-height:1">每日计划</div>
      <div class="abs" style="right:88px;top:96px;writing-mode:vertical-rl;font-size:23px;letter-spacing:.34em;color:${p.soft}">${syDate(c)}　${c.wcn}</div>
      ${sySeal(944, 430, "梅竹", p, { w: 46, h: 46, size: 18 })}
      <div class="abs" style="left:150px;right:150px;top:944px;text-align:center">
        <div style="font-size:24px;letter-spacing:.6em;color:${p.soft};margin-bottom:10px">· 梅竹双雀 ·</div>
        ${c.rows((it, s) => `<div style="display:flex;align-items:center;justify-content:center;gap:20px;height:${r.h}px">
          ${c.b(it, syCk(s, p, Math.min(34, r.h - 12)))}${c.t(it, syTxt(s, p, r.f, "flex:0 1 auto"))}</div>`)}
      </div>
      <div class="abs" style="left:0;right:0;top:1370px;text-align:center;font-size:20px;letter-spacing:.5em;color:${p.soft}">${syDone(c)}</div>
      </div>`;
    },

    /* 2 手卷：一条横贯全幅的长卷（锦边隔水、引首、卷轴头），上面大字标题，下面两栏清单 */
    scroll(c, p) {
      const half = Math.max(1, Math.ceil(c.n / 2)), r = c.fit(Math.round(300 * Math.max(c.n, 1) / half), 66, 32);
      const bro = `repeating-linear-gradient(90deg,${p.brocade} 0 10px,${p.brocade2} 10px 12px,${p.brocade} 12px 22px)`;
      return `<div class="lc grain" style="background:${sySilk(p.ground, .14)};color:${p.ink};font-family:var(--serif)">
      ${c.photo}
      <div class="abs" style="left:90px;top:92px;font-size:112px;font-weight:600;letter-spacing:.22em;line-height:1">每日计划</div>
      <div class="abs" style="left:96px;top:236px;font-size:24px;letter-spacing:.42em;color:${p.soft}">${syDate(c)}　${c.wcn}　·　竹禽图卷</div>
      ${sySeal(900, 96, "卷", p, { w: 86, h: 86, size: 50, solid: true, op: .86 })}
      <div class="abs" style="left:0;right:0;top:330px;height:620px;background:${p.roller};box-shadow:0 16px 30px rgba(40,30,10,.25)"></div>
      <div class="abs" style="left:0;right:0;top:330px;height:22px;background:${bro}"></div>
      <div class="abs" style="left:0;right:0;top:928px;height:22px;background:${bro}"></div>
      <div class="abs" style="left:0;width:150px;top:352px;height:576px;background:${syLing("#d8c69b", "rgba(120,90,40,.25)")};border-right:3px solid ${p.line}"></div>
      <div class="abs" style="left:46px;top:420px;writing-mode:vertical-rl;font-family:var(--brush);font-size:62px;line-height:1;color:${p.seal}">竹禽</div>
      <div class="abs" style="left:150px;right:0;top:352px;height:576px;overflow:hidden"><img alt="" src="${SY_A("zhuqin.jpg")}" style="width:100%;height:100%;object-fit:cover;object-position:30% 50%;display:block"></div>
      <div class="abs" style="left:90px;right:90px;top:1000px;display:flex;justify-content:space-between;align-items:baseline;padding-bottom:8px;border-bottom:1.5px solid ${p.line}">
        <span style="font-size:32px;font-weight:600;letter-spacing:.4em">今日功课</span><span style="font-size:20px;letter-spacing:.3em;color:${p.soft}">${syDone(c)}</span></div>
      <div class="abs" style="left:90px;right:90px;top:1062px;display:grid;grid-template-columns:1fr 1fr;column-gap:60px;grid-auto-flow:column;grid-template-rows:repeat(${half},${r.h}px)">
        ${c.rows((it, s) => syRow(c, it, s, p, r.h, r.f, `color-mix(in srgb, ${p.ink} 16%, transparent)`).replace('<div style="display:flex', '<div style="min-width:0;display:flex'))}</div>
      </div>`;
    },

    /* 3 立轴：粉墙上挂一幅牡丹立轴（天头、惊燕、隔水、地头、轴头），清单写在右边 */
    hang(c, p) {
      const r = c.fit(640, 76, 34), X = 74, W = 420, pw = 372, ph = Math.round(pw * 1300 / 771);
      const y0 = 70, tian = 250, gs = 14, y1 = y0 + tian + gs, y2 = y1 + ph, di = 240;
      const wall = `radial-gradient(900px 700px at 30% 40%,rgba(255,255,255,.35),transparent 70%),repeating-linear-gradient(0deg,rgba(0,0,0,.012) 0 2px,transparent 2px 5px),${p.ground}`;
      return `<div class="lc grain" style="background:${wall};color:${p.ink};font-family:var(--serif)">
      ${c.photo}
      <svg class="abs" style="left:0;top:0" width="1080" height="1440" viewBox="0 0 1080 1440"><path d="M${X + 80} ${y0}L${X + W / 2} 26L${X + W - 80} ${y0}" fill="none" stroke="${p.line}" stroke-width="2"/><circle cx="${X + W / 2}" cy="24" r="6" fill="${p.line}"/></svg>
      <div class="abs" style="left:${X}px;top:${y0}px;width:${W}px;height:${tian + gs + ph + gs + di}px;background:${syLing(p.tian, "rgba(110,95,60,.18)")};box-shadow:14px 18px 30px rgba(50,40,25,.22)"></div>
      <div class="abs" style="left:${X - 6}px;top:${y0 - 14}px;width:${W + 12}px;height:16px;border-radius:4px;background:${p.roller}"></div>
      ${[X + 128, X + W - 140].map((x) => `<div class="abs" style="left:${x}px;top:${y0}px;width:12px;height:${tian}px;background:${p.ge};opacity:.85"></div>`).join("")}
      <div class="abs" style="left:${X}px;top:${y0 + tian}px;width:${W}px;height:${gs}px;background:${p.ge}"></div>
      <div class="abs" style="left:${X + (W - pw) / 2}px;top:${y1}px;width:${pw}px;height:${ph}px;outline:1.5px solid ${p.ge}"><img alt="" src="${SY_A("mudan.jpg")}" style="width:100%;height:100%;display:block"></div>
      <div class="abs" style="left:${X}px;top:${y2}px;width:${W}px;height:${gs}px;background:${p.ge}"></div>
      <div class="abs" style="left:${X - 22}px;top:${y2 + gs + di - 4}px;width:${W + 44}px;height:30px;border-radius:15px;background:linear-gradient(180deg,${p.roller},#120c08 70%,${p.roller})"></div>
      ${[X - 34, X + W + 22].map((x) => `<div class="abs" style="left:${x}px;top:${y2 + gs + di - 8}px;width:14px;height:38px;border-radius:6px;background:${p.gold}"></div>`).join("")}
      ${sySeal(X + (W - pw) / 2 + pw - 50, y1 + ph - 70, "富贵", p, { w: 40, h: 40, size: 16, op: .7 })}
      <div class="abs" style="right:92px;top:96px;writing-mode:vertical-rl;font-size:88px;font-weight:600;letter-spacing:.3em;line-height:1">每日计划</div>
      <div class="abs" style="right:206px;top:210px;writing-mode:vertical-rl;font-size:24px;letter-spacing:.36em;color:${p.soft}">${syDate(c)}　${c.wcn}</div>
      ${sySeal(790, 120, "牡丹", p, { w: 50, h: 64, size: 19, round: true })}
      <div class="abs" style="left:540px;right:92px;top:${1340 - r.h * c.n - 70}px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:10px;border-bottom:1.5px solid ${p.line}">
          <span style="font-size:30px;font-weight:600;letter-spacing:.4em">今日功课</span><span style="font-size:19px;letter-spacing:.24em;color:${p.soft}">${syDone(c)}</span></div>
        ${c.rows((it, s) => syRow(c, it, s, p, r.h, r.f, `color-mix(in srgb, ${p.ink} 16%, transparent)`))}
      </div>
      </div>`;
    },

    /* 4 梅雀竖排：原画出血铺满上半，下面像题跋一样从右往左竖着写清单 */
    vert(c, p) {
      const n = Math.max(c.n, 1), colW = Math.min(92, Math.floor(700 / n)), f = Math.max(22, Math.min(38, Math.round(colW * .5)));
      return `<div class="lc grain" style="background:${sySilk(p.ground, .2)};color:${p.ink};font-family:var(--serif)">
      <div class="abs" style="left:0;right:0;top:0;height:760px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 78%,transparent);mask-image:linear-gradient(180deg,#000 78%,transparent)">
        <img alt="" src="${SY_A("meique.jpg")}" style="width:100%;height:100%;object-fit:cover;object-position:50% 22%;display:block"></div>
      ${c.photo}
      <div class="abs" style="left:74px;right:74px;top:790px;height:560px;display:flex;flex-direction:row-reverse;align-items:flex-start;gap:0">
        <div style="writing-mode:vertical-rl;font-family:var(--brush);font-size:84px;line-height:1.1;letter-spacing:.06em;padding-left:22px">每日计划</div>
        <div style="writing-mode:vertical-rl;font-size:22px;letter-spacing:.32em;color:${p.soft};padding:8px 18px 0 26px;border-left:1px solid color-mix(in srgb, ${p.ink} 30%, transparent)">${syDate(c)}　${c.wcn}</div>
        ${c.rows((it, s) => `<div style="width:${colW}px;height:540px;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:16px;padding-top:6px;border-left:1px solid color-mix(in srgb, ${p.seal} 40%, transparent)">
          ${c.b(it, syCk(s, p, Math.min(34, colW - 20)))}${c.t(it, syTxt(s, p, f, `writing-mode:vertical-rl;max-height:470px;line-height:1.15;flex:0 1 auto;text-decoration-line:${s === "x" ? "line-through" : "none"}`))}</div>`)}
      </div>
      ${sySeal(80, 1268, "梅雀", p, { w: 54, h: 54, size: 20 })}
      <div class="abs" style="left:148px;top:1290px;font-size:20px;letter-spacing:.4em;color:${p.soft}">${syDone(c)}</div>
      </div>`;
    },

    /* 5 荷塘：牧溪《燕子荷花》满幅作底，荷叶在下，清单浮在右上的留白里，一只燕子飞过标题 */
    lotus(c, p) {
      const r = c.fit(560, 70, 34);
      return `<div class="lc" style="background:${p.ground};color:${p.ink};font-family:var(--serif)">
      <img class="abs" alt="" src="${SY_A("lianchi.jpg")}" style="left:0;top:0;width:1080px;height:1440px;object-fit:cover">
      <div class="abs" style="inset:0;background:radial-gradient(700px 760px at 74% 36%,rgba(240,226,190,.30),transparent 72%),radial-gradient(1300px 1000px at 50% 50%,transparent 60%,rgba(30,20,6,.25))"></div>
      ${c.photo}
      <img class="abs" alt="" src="${SY_A("yan.webp")}" style="left:560px;top:120px;width:330px;opacity:.95">
      <div class="abs" style="right:84px;top:96px;writing-mode:vertical-rl;font-size:86px;font-weight:600;letter-spacing:.3em;line-height:1">每日计划</div>
      <div class="abs" style="right:192px;top:310px;writing-mode:vertical-rl;font-size:23px;letter-spacing:.36em;color:${p.soft}">${syDate(c)}　${c.wcn}</div>
      <div class="abs" style="left:470px;right:84px;top:${Math.max(600, Math.min(720, 1070 - r.h * c.n))}px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:8px;border-bottom:1.5px solid ${p.line}">
          <span style="font-size:30px;font-weight:600;letter-spacing:.4em">今日功课</span><span style="font-size:19px;letter-spacing:.24em;color:${p.soft}">${syDone(c)}</span></div>
        ${c.rows((it, s) => syRow(c, it, s, p, r.h, r.f, `color-mix(in srgb, ${p.ink} 22%, transparent)`))}
      </div>
      ${sySeal(960, 1300, "荷", p, { w: 48, h: 48, size: 26, solid: true, op: .82 })}
      </div>`;
    },

    /* 6 月下梅：深色夜绢，圆月一样的扇面梅花发着微光，清单用淡金写在月下 */
    moon(c, p) {
      const r = c.fit(430, 62, 32), rule = "rgba(217,197,142,.22)";
      return `<div class="lc grain" style="background:radial-gradient(760px 640px at 50% 30%,#3a332a,transparent 72%),${sySilk(p.ground, .45)};color:${p.ink};font-family:var(--serif)">
      ${c.photo}
      <div class="abs" style="left:190px;top:70px;width:700px;height:648px;border-radius:50%;box-shadow:0 0 90px 30px rgba(236,214,160,.22),0 0 220px 80px rgba(236,214,160,.08)"></div>
      <img class="abs" alt="" src="${SY_A("yuemei.webp")}" style="left:190px;top:70px;width:700px;height:648px;filter:brightness(1.12) contrast(1.05) sepia(.12)">
      <div class="abs" style="left:76px;top:96px;writing-mode:vertical-rl;font-size:60px;font-weight:600;letter-spacing:.32em;line-height:1">每日计划</div>
      <div class="abs" style="right:80px;top:100px;writing-mode:vertical-rl;font-size:23px;letter-spacing:.36em;color:${p.soft}">${syDate(c)}　${c.wcn}　月下梅</div>
      ${sySeal(86, 520, "夜", p, { w: 46, h: 46, size: 24, solid: true, op: .85 })}
      <div class="abs" style="left:170px;right:170px;top:800px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:10px;border-bottom:1px solid ${p.gold}">
          <span style="font-size:30px;font-weight:600;letter-spacing:.42em;color:${p.gold}">今夜功课</span><span style="font-size:19px;letter-spacing:.24em;color:${p.soft}">${syDone(c)}</span></div>
        ${c.rows((it, s) => `<div style="display:flex;align-items:center;gap:26px;height:${r.h}px;border-bottom:1px solid ${rule}">
          ${c.b(it, L.ck(s, { size: Math.min(34, r.h - 12), color: s === "x" ? p.seal : p.gold, mark: s === "x" ? p.seal : p.gold, border: `1.3px solid ${s === "x" ? p.seal : "rgba(217,197,142,.7)"}`, radius: 50, w: 2, paths: L.HP }))}
          ${c.t(it, syTxt(s, p, r.f))}</div>`)}
      </div>
      <svg class="abs" style="left:0;top:0" width="1080" height="1440" viewBox="0 0 1080 1440"><g fill="${p.gold}" opacity=".5">${[[120, 760, 2.2], [960, 640, 1.6], [880, 1360, 2], [150, 1300, 1.4], [1000, 980, 1.8]].map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}"/>`).join("")}</g></svg>
      </div>`;
    },
  };
  LAYOUTS.songyuan = (c, p) => (SY[p.v] || SY.album)(c, p);
