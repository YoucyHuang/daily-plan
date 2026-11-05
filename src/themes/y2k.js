  /* Y2K：7 套各是一件千禧年的小物件 —— 桌面窗口 / 翻盖机 / 聊天窗 / CD / 电子宠物蛋 / 赛博 HUD / 播放器 */
  PALETTES.y2k = [
    { name:"甜心桌面", v:"win",    g:["#e7e1ff","#ffd7f0","#d3f3ff","#f1ecff"], a:["#ffb4e6","#a9e4ff","#c9b6ff","#ffe6a8"], nv:"#1c1c4a", hot:"#ff5fb8", tb:["#8ec5ff","#c9a7ff","#ffa8dc"], sw:["#ffd7f0","#d3f3ff","#ff5fb8"] },
    { name:"青柠翻盖机", v:"phone", bg:["#f4ffd6","#d6ffe9","#e3f0ff"], body:["#f3ffc9","#b8f04a","#6fb82a"], lcd:"#cfe6a4", lcd2:"#a9c97e", px:"#1f3a14", nv:"#10361f", hot:"#22c77a", key:"#fbfff0", sw:["#d6ffe9","#b8f04a","#22c77a"] },
    { name:"银河聊天室", v:"chat",  bg:["#dde8ff","#c7d6ff","#e9e1ff","#f3f6ff"], win:"#f4f7ff", tb:["#5b86ff","#9fb8ff","#c9b6ff"], nv:"#0b1f66", me:"#d9e5ff", you:"#ffffff", hot:"#3d6bff", acc:"#ffcf3d", sw:["#c7d6ff","#9fb8ff","#3d6bff"] },
    { name:"蜜桃 CD",   v:"cd",     bg:["#ffe9dc","#ffd3e0","#fff2c9","#ffefe8"], ink:"#4a1e2c", hot:"#ff7a59", cover:["#ffb38a","#ff9ec0","#ffe08a"], paper:"#fff8f3", sw:["#ffd3e0","#ffe08a","#ff7a59"] },
    { name:"薰衣草宠物蛋", v:"pet",  bg:["#eee8ff","#e2d9ff","#f6eeff","#fbf9ff"], egg:["#f3ecff","#c9b2ff","#8a6ff0"], lcd:"#d7dbc6", px:"#2e2a4a", ink:"#2e1f5e", st:["#ffd3ec","#d3e2ff","#fff0bd","#d4f6e6"], hot:"#9b6bff", sw:["#e2d9ff","#8a6ff0","#ffd3ec"] },
    { name:"赛博终端", v:"hud",     bg:"#12082b", bg2:"#2c1460", cy:"#2ee6ff", mg:"#ff2ec4", vi:"#7b2eff", sun:["#ffe14a","#ff7a3d","#ff2ec4"], fg:"#e9f6ff", sw:["#12082b","#2ee6ff","#ff2ec4"] },
    { name:"霓虹播放器", v:"player", bg:"#0f0d1f", body:["#f2f4fa","#a3aabd","#5b6276","#d9dde8"], lcd:"#071710", lg:"#2effa0", hot:"#ff2e88", cy:"#2ee6ff", yl:"#ffe600", fg:"#e9f3ff", sw:["#0f0d1f","#2effa0","#ff2e88"] },
  ];
  PAL_SW.y2k = (p) => p.sw;

  /* 公用小件 */
  const Y2K = (() => {
    /* 铬银字：上亮下暗，中间一道地平线反光 */
    const chrome = (nv, sw = 4) => `background:linear-gradient(180deg,#fff 0%,#e3e7f2 36%,#6b7389 50%,#f6f8fd 60%,#aab2c6 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:${sw}px ${nv};paint-order:stroke fill`;
    const holo = (g) => `linear-gradient(160deg,${g[0]},${g[1]} 34%,${g[2]} 66%,${g[3] || g[0]})`;
    const sparkle = (c, x, y, s, r = 0) => `<svg class="abs" viewBox="0 0 100 100" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;transform:rotate(${r}deg);overflow:visible"><path d="M50 0C53 40 60 47 100 50C60 53 53 60 50 100C47 60 40 53 0 50C40 47 47 40 50 0Z" fill="${c}"/></svg>`;
    const sparkles = (list) => list.map((a) => sparkle(...a)).join("");
    /* 果冻勾选框：完成=亮色果冻，划掉=灰果冻 */
    const jelly = (s, nv, hot, size = 52, rad = 16) => L.ck(s, { size, color: nv, border: `3px solid ${nv}`, radius: rad, w: 3.2, mark: s ? "#fff" : nv,
      bg: s === "c" ? `radial-gradient(circle at 30% 25%,#fff 0 12%,transparent 13%),linear-gradient(180deg,#fff -50%,${hot})` : s === "x" ? "linear-gradient(180deg,#d6dbe6,#8a93a8)" : "linear-gradient(180deg,#fff,#e6e9f2)" });
    const done = (c) => frontMode ? "—" : c.done;
    const seed = (n) => { let s = n; return () => (s = s * 16807 % 2147483647) / 2147483647; };
    return { chrome, holo, sparkle, sparkles, jelly, done, seed };
  })();

  const Y2K_V = {
    /* 0 桌面窗口：全息壁纸 + 桌面图标 + daily_plan.exe + 弹窗 + 任务栏 */
    win(c, p) {
      const nv = p.nv, r = c.fit(600, 84, 38);
      const icon = (y, label, svg) => `<div class="abs" style="left:34px;top:${y}px;width:118px;text-align:center;color:${nv}">
        <svg viewBox="0 0 64 64" width="78" height="78" style="display:block;margin:0 auto 6px;overflow:visible">${svg}</svg>
        <span style="font-family:var(--pix);font-size:28px;line-height:1;background:rgba(255,255,255,.75);padding:1px 6px">${label}</span></div>`;
      const btn = (t) => `<i style="width:38px;height:34px;border:3px solid ${nv};border-radius:9px;background:linear-gradient(180deg,#fff,#dfe4f2);display:grid;place-items:center;font:700 22px/1 var(--jost);font-style:normal;color:${nv}">${t}</i>`;
      return `<div class="lc" style="background:${Y2K.holo(p.g)};color:${nv}">
      <div class="abs" style="inset:-100px;filter:blur(60px);background:radial-gradient(380px 300px at 15% 20%,${p.a[0]},transparent 70%),radial-gradient(420px 340px at 85% 35%,${p.a[1]},transparent 70%),radial-gradient(360px 300px at 30% 85%,${p.a[2]},transparent 70%),radial-gradient(300px 260px at 80% 80%,${p.a[3]},transparent 70%)"></div>
      <div class="abs" style="inset:0;background-image:linear-gradient(rgba(120,120,200,.12) 2px,transparent 2px),linear-gradient(90deg,rgba(120,120,200,.12) 2px,transparent 2px);background-size:72px 72px"></div>
      ${c.photo}
      <div class="abs" style="left:60px;top:58px;font-family:var(--y2k);font-size:124px;line-height:1.02;letter-spacing:-.02em;${Y2K.chrome(nv)}">DAILY<br>PLAN</div>
      <div class="abs" style="right:44px;top:86px;width:372px;border:3px solid ${nv};border-radius:18px;background:#fff;box-shadow:8px 8px 0 ${nv};transform:rotate(3deg);overflow:hidden">
        <div style="height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;background:linear-gradient(90deg,${p.tb.join(",")});border-bottom:3px solid ${nv}"><span style="font-family:var(--pix);font-size:32px">✦ message</span>${btn("×")}</div>
        <div style="display:flex;gap:16px;align-items:center;padding:18px 20px 10px"><svg viewBox="0 0 40 40" width="60" height="60"><circle cx="20" cy="20" r="17" fill="${p.a[3]}" stroke="${nv}" stroke-width="3"/><path d="M20 10v13M20 28v2" stroke="${nv}" stroke-width="4" stroke-linecap="round"/></svg>
          <div style="font-size:26px;font-weight:700;line-height:1.35">${frontMode ? "今天的任务<br>已经加载好啦" : `今天完成了<br><b style="font-family:var(--y2k);font-size:34px;color:${p.hot}">${c.done}/${c.n}</b> 件事！`}</div></div>
        <div style="display:flex;justify-content:flex-end;padding:0 20px 16px"><span style="padding:4px 30px;border:3px solid ${nv};border-radius:10px;background:linear-gradient(180deg,#fff,${p.a[0]});font-family:var(--pix);font-size:30px">OK</span></div>
      </div>
      ${icon(400, "my_day", `<path d="M4 16h22l6 6h28v34H4Z" fill="${p.a[3]}" stroke="${nv}" stroke-width="3" stroke-linejoin="round"/><path d="M4 26h56" stroke="${nv}" stroke-width="3"/>`)}
      ${icon(560, "stars", `<path d="M32 4l8 18 19 2-14 13 4 19-17-10-17 10 4-19L5 24l19-2Z" fill="${p.a[0]}" stroke="${nv}" stroke-width="3" stroke-linejoin="round"/>`)}
      ${icon(720, "love.txt", `<path d="M12 4h28l12 12v44H12Z" fill="#fff" stroke="${nv}" stroke-width="3" stroke-linejoin="round"/><path d="M32 46C22 38 18 34 18 29a6 6 0 0 1 14-3a6 6 0 0 1 14 3c0 5-4 9-14 17Z" fill="${p.hot}"/>`)}
      ${icon(880, "trash", `<path d="M14 16h36l-4 44H18Z" fill="${p.a[1]}" stroke="${nv}" stroke-width="3" stroke-linejoin="round"/><path d="M10 14h44M26 8h12" stroke="${nv}" stroke-width="3" stroke-linecap="round"/>`)}
      <div class="abs" style="left:176px;right:52px;top:376px;bottom:178px;border:4px solid ${nv};border-radius:26px;background:rgba(255,255,255,.78);box-shadow:12px 12px 0 ${nv};overflow:hidden;display:flex;flex-direction:column">
        <div style="flex:none;height:70px;display:flex;align-items:center;justify-content:space-between;padding:0 18px 0 26px;background:linear-gradient(90deg,${p.tb.join(",")});border-bottom:4px solid ${nv}">
          <span style="font-family:var(--pix);font-size:44px">daily_plan.exe</span><span style="display:flex;gap:8px">${btn("_")}${btn("□")}${btn("×")}</span></div>
        <div style="flex:none;height:46px;display:flex;gap:34px;align-items:center;padding:0 26px;font-family:var(--pix);font-size:30px;border-bottom:2px solid rgba(28,28,74,.25)"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span><span style="margin-left:auto;color:${p.hot}">${esc(c.date)} ${c.wen}</span></div>
        <div style="flex:1;display:flex;min-height:0">
          <div style="flex:1;min-width:0;padding:10px 30px 0 36px">${c.rows((it, s) => `<div style="display:flex;align-items:center;gap:26px;height:${r.h}px;border-bottom:3px dashed rgba(28,28,74,.16)">
            ${c.b(it, Y2K.jelly(s, nv, p.hot))}
            ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? "opacity:.42;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}</div>`)}</div>
          <div style="flex:none;width:34px;border-left:3px solid ${nv};background:repeating-linear-gradient(45deg,#fff 0 6px,${p.g[0]} 6px 12px);position:relative">
            <i style="position:absolute;left:3px;right:3px;top:8px;height:160px;border:3px solid ${nv};border-radius:8px;background:linear-gradient(90deg,#fff,${p.a[2]})"></i></div>
        </div>
        <div style="flex:none;height:50px;display:flex;justify-content:space-between;align-items:center;padding:0 26px;border-top:3px solid ${nv};background:#f2f0fb;font-family:var(--pix);font-size:30px"><span>${c.n} object(s)</span><span>${frontMode ? "ready" : `${c.done} done ✓`}</span></div>
      </div>
      <div class="abs" style="left:0;right:0;bottom:0;height:96px;display:flex;align-items:center;gap:18px;padding:0 22px;background:linear-gradient(180deg,#fff,${p.g[3]} 40%,${p.a[2]});border-top:4px solid ${nv}">
        <span style="display:flex;align-items:center;gap:10px;padding:6px 26px 6px 16px;border:3px solid ${nv};border-radius:99px;background:linear-gradient(180deg,#fff,${p.hot});font-family:var(--y2k);font-size:28px;color:#fff;-webkit-text-stroke:2px ${nv};paint-order:stroke fill">✦ start</span>
        <span style="padding:6px 20px;border:3px solid ${nv};border-radius:10px;background:#fff;font-family:var(--pix);font-size:30px">▣ daily_plan.exe</span>
        <span style="margin-left:auto;padding:6px 20px;border:3px inset ${nv};border-radius:10px;background:rgba(255,255,255,.6);font-family:var(--pix);font-size:32px">♥ ${c.year || ""} ${esc(c.mon)} ${c.day}</span>
      </div>
      ${Y2K.sparkles([["#fff", 30, 300, 70], [p.hot, 980, 330, 46], ["#fff", 600, 330, 40], [p.a[1], 1010, 1150, 50]])}
      </div>`;
    },

    /* 1 翻盖机：打开的翻盖手机，清单在点阵屏上，下半是键盘；天线挂手机链 */
    phone(c, p) {
      const nv = p.nv, r = c.fit(486, 72, 32), B = p.body;
      const shell = `background:linear-gradient(100deg,${B[2]} 0%,${B[1]} 14%,${B[0]} 38%,${B[1]} 70%,${B[2]} 100%);border:5px solid ${nv}`;
      const key = (t, sub, w = 186) => `<span style="width:${w}px;height:84px;border:4px solid ${nv};border-radius:40px;background:linear-gradient(180deg,#fff,${p.key} 50%,${B[0]});display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 5px 0 ${nv}">
        <b style="font-family:var(--y2k);font-size:40px;color:${nv}">${t}</b><small style="font-family:var(--pix);font-size:26px;color:${nv};opacity:.7">${sub}</small></span>`;
      const bars = [10, 16, 22, 28].map((h, i) => `<i style="width:8px;height:${h}px;background:${p.px};opacity:${i < 3 ? 1 : .3}"></i>`).join("");
      const bead = (x, y, rr, col) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${col}" stroke="${nv}" stroke-width="3"/><circle cx="${x - rr * .35}" cy="${y - rr * .35}" r="${rr * .28}" fill="#fff" opacity=".85"/>`;
      return `<div class="lc" style="background:${Y2K.holo(p.bg)};color:${nv}">
      <div class="abs" style="inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.65) 0 2px,transparent 3px) 0 0/36px 36px"></div>
      ${c.photo}
      <div class="abs" style="left:0;right:0;top:40px;text-align:center;font-family:var(--y2k);font-size:96px;line-height:1;letter-spacing:-.02em;${Y2K.chrome(nv)}">DAILY PLAN</div>
      <div class="abs" style="left:70px;top:330px;writing-mode:vertical-rl;font-family:var(--pix);font-size:44px;letter-spacing:.2em;color:${nv}">TXT ME · LATER ✦ 2 DAY</div>
      <svg class="abs" style="left:780px;top:150px;overflow:visible" width="260" height="420" viewBox="0 0 260 420">
        <path d="M40 20C90 40 150 90 170 170" fill="none" stroke="${nv}" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>
        ${bead(70, 34, 14, p.hot)}${bead(112, 64, 16, "#fff")}${bead(146, 108, 15, B[1])}${bead(166, 150, 12, "#ffe36b")}
        <path d="M172 178l12 28 30 4-22 20 6 30-26-15-26 15 6-30-22-20 30-4Z" fill="#ffe36b" stroke="${nv}" stroke-width="4" stroke-linejoin="round"/>
      </svg>
      <div class="abs" style="left:800px;top:150px;width:34px;height:100px;border-radius:18px 18px 8px 8px;${shell}"></div>
      <div class="abs" style="left:190px;right:190px;top:220px;height:800px;border-radius:70px 70px 40px 40px;${shell};box-shadow:14px 14px 0 rgba(16,54,31,.18)">
        <div style="position:absolute;left:50%;top:26px;width:140px;height:14px;transform:translateX(-50%);border-radius:9px;background:${nv};opacity:.8"></div>
        <div style="position:absolute;left:44px;right:44px;top:62px;bottom:46px;border:5px solid ${nv};border-radius:26px;background:${p.lcd};box-shadow:inset 0 0 0 10px ${p.lcd2},inset 0 0 50px rgba(0,0,0,.12);overflow:hidden;color:${p.px}">
          <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.05) 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0 2px,transparent 2px 5px)"></div>
          <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-end;padding:22px 30px 0;font-family:var(--pix);font-size:32px;line-height:1"><span style="display:flex;gap:4px;align-items:flex-end">${bars}</span><span>${esc(c.mon)} ${c.day} ${c.wen}</span><span style="display:inline-flex;align-items:center;gap:3px"><i style="width:46px;height:22px;border:3px solid ${p.px};display:block;background:linear-gradient(90deg,${p.px} 70%,transparent 70%)"></i><i style="width:5px;height:10px;background:${p.px};display:block"></i></span></div>
          <div style="position:relative;margin:16px 30px 0;padding:6px 14px;background:${p.px};color:${p.lcd};font-family:var(--pix);font-size:38px;line-height:1;display:flex;justify-content:space-between"><span>▼ TODAY</span><span>✉ ${c.n}</span></div>
          <div style="position:relative;padding:6px 30px 0">${c.rows((it, s) => `<div style="display:flex;align-items:center;gap:20px;height:${r.h}px;border-bottom:2px dotted ${p.px}">
            ${c.b(it, L.ck(s, { size: 36, color: p.px, border: `3px solid ${p.px}`, radius: 0, w: 3.6, bg: s === "c" ? p.px : "transparent", mark: s === "c" ? p.lcd : p.px }))}
            ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? "opacity:.45;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}</div>`)}</div>
          <div style="position:absolute;left:30px;right:30px;bottom:18px;display:flex;justify-content:space-between;font-family:var(--pix);font-size:34px;line-height:1"><span>Menu</span><span>${frontMode ? "Go!" : `Done ${c.done}/${c.n}`}</span></div>
        </div>
      </div>
      <div class="abs" style="left:250px;right:250px;top:1010px;height:54px;border-radius:30px;${shell};background:linear-gradient(180deg,${B[2]},${B[0]} 45%,${B[2]})"></div>
      <div class="abs" style="left:170px;right:170px;top:1060px;height:440px;border-radius:40px 40px 0 0;${shell}">
        <div style="position:absolute;left:50%;top:34px;width:200px;height:120px;transform:translateX(-50%);border:4px solid ${nv};border-radius:60px;background:radial-gradient(circle at 50% 50%,${p.hot} 0 22px,${nv} 23px 27px,#fff 28px)"></div>
        <div style="position:absolute;left:40px;top:50px;width:150px;height:64px;border:4px solid ${nv};border-radius:32px;background:linear-gradient(180deg,#fff,${B[0]});box-shadow:0 5px 0 ${nv}"></div>
        <div style="position:absolute;right:40px;top:50px;width:150px;height:64px;border:4px solid ${nv};border-radius:32px;background:linear-gradient(180deg,#fff,${B[0]});box-shadow:0 5px 0 ${nv}"></div>
        <div style="position:absolute;left:50px;right:50px;top:190px;display:flex;flex-wrap:wrap;gap:26px 22px;justify-content:center">${[["1", "∞"], ["2", "abc"], ["3", "def"], ["4", "ghi"], ["5", "jkl"], ["6", "mno"]].map(([a, b]) => key(a, b)).join("")}</div>
      </div>
      ${Y2K.sparkles([["#fff", 60, 160, 70], [p.hot, 960, 700, 50], ["#fff", 950, 820, 34], ["#fff", 60, 1100, 60], [p.hot, 90, 1230, 36]])}
      </div>`;
    },

    /* 2 聊天室：即时通讯窗口，每件事是一条消息气泡，左边是好友列表 */
    chat(c, p) {
      const nv = p.nv, r = c.fit(640, 92, 34), side = 250;
      const face = (col, sz = 40, mood = "smile") => `<svg viewBox="0 0 40 40" width="${sz}" height="${sz}" style="flex:none"><circle cx="20" cy="20" r="17" fill="${col}" stroke="${nv}" stroke-width="3"/><circle cx="14" cy="16" r="2.6" fill="${nv}"/><circle cx="26" cy="16" r="2.6" fill="${nv}"/>${mood === "smile" ? `<path d="M12 24q8 8 16 0" fill="none" stroke="${nv}" stroke-width="3" stroke-linecap="round"/>` : `<path d="M14 27h12" stroke="${nv}" stroke-width="3" stroke-linecap="round"/>`}</svg>`;
      const buddy = (col, name, st, on = true) => `<div style="display:flex;align-items:center;gap:12px;margin-top:16px">${face(col, 40, on ? "smile" : "flat")}<div style="min-width:0"><b style="display:block;font-size:24px;line-height:1.1">${name}</b><small style="font-family:var(--pix);font-size:22px;opacity:.7">${st}</small></div></div>`;
      const tool = (t) => `<span style="width:58px;height:58px;border:3px solid ${nv};border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,${p.tb[1]});display:grid;place-items:center;font-size:28px">${t}</span>`;
      return `<div class="lc" style="background:${Y2K.holo(p.bg)};color:${nv}">
      <div class="abs" style="inset:-80px;filter:blur(50px);background:radial-gradient(400px 300px at 80% 12%,${p.tb[2]},transparent 70%),radial-gradient(380px 320px at 10% 90%,${p.tb[1]},transparent 70%)"></div>
      ${c.photo}
      <div class="abs" style="left:70px;top:62px;font-family:var(--y2k);font-size:110px;line-height:1;letter-spacing:-.02em;${Y2K.chrome(nv)}">DAILY<br>PLAN</div>
      <div class="abs" style="right:70px;top:84px;text-align:right">
        <div style="display:inline-flex;align-items:center;gap:12px;padding:8px 22px;border:3px solid ${nv};border-radius:99px;background:#fff;font-size:28px;font-weight:700"><i style="width:20px;height:20px;border-radius:50%;background:#3ddc84;border:3px solid ${nv}"></i>小Y 在线</div>
        <div style="font-family:var(--pix);font-size:36px;margin-top:18px">${esc(c.date)} · ${c.wen}</div>
        <div style="font-family:var(--pix);font-size:30px;margin-top:6px;opacity:.7">~*~ brb, doing my day ~*~</div></div>
      <div class="abs" style="left:56px;right:56px;top:310px;bottom:72px;border:4px solid ${nv};border-radius:28px;background:${p.win};box-shadow:12px 12px 0 ${nv};overflow:hidden;display:flex;flex-direction:column">
        <div style="flex:none;height:64px;display:flex;align-items:center;gap:14px;padding:0 22px;background:linear-gradient(90deg,${p.tb.join(",")});border-bottom:4px solid ${nv};color:#fff">
          ${face(p.acc, 40)}<span style="font-family:var(--pix);font-size:38px;color:${nv}">Chat with <b style="font-family:var(--sans);font-size:30px">小Y</b> — today</span>
          <span style="margin-left:auto;display:flex;gap:8px">${["_", "×"].map((t) => `<i style="width:38px;height:34px;border:3px solid ${nv};border-radius:9px;background:#fff;color:${nv};display:grid;place-items:center;font:700 22px/1 var(--jost);font-style:normal">${t}</i>`).join("")}</span></div>
        <div style="flex:none;height:78px;display:flex;align-items:center;gap:14px;padding:0 22px;border-bottom:3px solid rgba(11,31,102,.2);background:linear-gradient(180deg,#fff,${p.win})">${tool("☺")}${tool("✿")}${tool("♫")}${tool("✉")}<span style="margin-left:auto;font-family:var(--pix);font-size:30px;opacity:.7">nudge! ✦</span></div>
        <div style="flex:1;display:flex;min-height:0">
          <div style="flex:none;width:${side}px;padding:16px 20px;border-right:3px solid rgba(11,31,102,.2);background:linear-gradient(180deg,${p.me},${p.win})">
            <div style="font-family:var(--pix);font-size:30px">▼ Buddies (3)</div>
            ${buddy(p.acc, "小Y", "online ✦")}${buddy("#ffb4e6", "星星", "收集中…")}${buddy("#b6f0d2", "连胜", `${frontMode ? "?" : c.done} 🔥`)}
            <div style="font-family:var(--pix);font-size:30px;margin-top:30px;opacity:.6">▶ Offline (1)</div>
            ${buddy("#d6d9e6", "拖延症", "away… zzz", false)}
          </div>
          <div style="flex:1;min-width:0;padding:10px 24px 0;display:flex;flex-direction:column">
            <div style="flex:none;font-family:var(--pix);font-size:28px;opacity:.6;text-align:center;padding:4px 0">— ${c.wen} ${esc(c.mon)} ${c.day} —</div>
            ${c.rows((it, s, i) => { const mine = i % 2 === 0; return `<div style="display:flex;align-items:center;justify-content:${mine ? "flex-start" : "flex-end"};height:${r.h}px">
              <div style="max-width:94%;display:flex;align-items:center;gap:16px;height:${r.h - 16}px;padding:0 24px 0 14px;border:3px solid ${nv};border-radius:${mine ? "8px 30px 30px 30px" : "30px 8px 30px 30px"};background:${s === "c" ? `linear-gradient(180deg,#fff,${p.me})` : s === "x" ? "#eceef4" : mine ? p.you : p.me};box-shadow:4px 4px 0 rgba(11,31,102,.18);min-width:0">
                ${c.b(it, Y2K.jelly(s, nv, p.hot, Math.min(46, r.h - 30), 23))}
                ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? "opacity:.42;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}</div></div>`; })}
          </div>
        </div>
        <div style="flex:none;height:96px;display:flex;align-items:center;gap:16px;padding:0 22px;border-top:3px solid ${nv};background:#fff">
          <span style="flex:1;height:58px;border:3px solid rgba(11,31,102,.35);border-radius:14px;display:flex;align-items:center;padding:0 18px;font-size:26px;opacity:.7">${frontMode ? "今天也一起加油吧 ✦" : `今天搞定了 ${c.done} 件！ (≧▽≦)`}</span>
          <span style="padding:8px 30px;border:3px solid ${nv};border-radius:14px;background:linear-gradient(180deg,#fff,${p.acc});font-family:var(--pix);font-size:36px">Send</span></div>
      </div>
      ${Y2K.sparkles([["#fff", 440, 60, 60], [p.hot, 540, 210, 36], ["#fff", 1000, 1360, 50]])}
      </div>`;
    },

    /* 3 CD：上面是 CD 盒封面 + 滑出来的镭射光盘，下面是封底曲目单 */
    cd(c, p) {
      const ink = p.ink, r = c.fit(440, 64, 34);
      const R = Y2K.seed(7);
      const bars = Array.from({ length: 46 }, () => { const w = R() < .3 ? 6 : 3; return `<i style="width:${w}px;height:70px;background:${ink};display:block;margin-right:${R() < .5 ? 3 : 5}px"></i>`; }).join("");
      const spine = (side) => `<div style="position:absolute;${side}:0;top:0;bottom:0;width:58px;background:${p.cover[0]};border-${side === "left" ? "right" : "left"}:3px solid ${ink};display:flex;align-items:center;justify-content:center"><span style="writing-mode:vertical-rl;${side === "left" ? "transform:rotate(180deg);" : ""}font-family:var(--y2k);font-size:24px;letter-spacing:.12em;white-space:nowrap">DAILY PLAN ✦ ${c.year || ""} ✦ DISC 1</span></div>`;
      return `<div class="lc" style="background:${Y2K.holo(p.bg)};color:${ink}">
      <div class="abs" style="inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.22) 0 2px,transparent 2px 22px)"></div>
      ${c.photo}
      <div class="abs" style="left:430px;top:56px;width:600px;height:600px;border-radius:50%;border:4px solid ${ink};background:radial-gradient(circle,#fff 0 54px,${ink} 55px 59px,rgba(255,255,255,.7) 60px 96px,transparent 97px),repeating-radial-gradient(circle,rgba(255,255,255,.18) 0 2px,transparent 2px 7px),conic-gradient(from 20deg,#ffd1e8,#c7f0ff,#fff6b8,#ffc2a8,#d9c7ff,#c7ffe6,#ffd1e8);box-shadow:inset 0 0 40px rgba(255,255,255,.7)">
        <div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 200deg,transparent 0 20%,rgba(255,255,255,.75) 25%,transparent 32% 70%,rgba(255,255,255,.55) 75%,transparent 80%)"></div>
        <div style="position:absolute;left:200px;right:20px;top:118px;text-align:center;font-family:var(--y2k);font-size:28px;letter-spacing:.06em">✦ ${frontMode ? "NOW PLAYING" : `${c.done} / ${c.n} PLAYED`} ✦</div>
        <div style="position:absolute;left:200px;right:20px;bottom:118px;text-align:center;font-family:var(--pix);font-size:38px">${esc(c.date)} ${c.wen}</div></div>
      <div class="abs" style="left:56px;top:66px;width:560px;height:560px;border:4px solid ${ink};border-radius:10px;background:linear-gradient(150deg,${p.cover[2]},${p.cover[1]} 50%,${p.cover[0]});box-shadow:12px 12px 0 rgba(74,30,44,.25);overflow:hidden">
        <div style="position:absolute;left:0;top:0;bottom:0;width:36px;background:linear-gradient(90deg,rgba(255,255,255,.75),rgba(255,255,255,.2));border-right:3px solid ${ink}"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(125deg,transparent 30%,rgba(255,255,255,.55) 38%,transparent 46%,transparent 70%,rgba(255,255,255,.3) 74%,transparent 78%)"></div>
        <div style="position:absolute;left:74px;top:52px;font-family:var(--pix);font-size:34px;letter-spacing:.1em">Y WORLD RECORDS</div>
        <div style="position:absolute;left:66px;top:110px;font-family:var(--y2k);font-size:96px;line-height:1;letter-spacing:-.02em;${Y2K.chrome(ink)}">TODAY'S<br>HITS</div>
        <div style="position:absolute;left:74px;bottom:66px;right:40px;display:flex;justify-content:space-between;align-items:flex-end"><span style="font-size:36px;font-weight:900;letter-spacing:.1em">每日计划</span><span style="font-family:var(--pix);font-size:34px">vol.${c.m || ""}${c.day ? "." + c.day : ""}</span></div>
        <div style="position:absolute;right:30px;top:300px;width:150px;height:150px;border-radius:50%;background:${p.hot};border:4px solid ${ink};display:grid;place-items:center;transform:rotate(-14deg);text-align:center;color:#fff;font-family:var(--y2k);font-size:24px;line-height:1.15;-webkit-text-stroke:1.5px ${ink};paint-order:stroke fill">100%<br>CUTE<br>✦</div>
      </div>
      <div class="abs" style="left:56px;right:56px;top:690px;bottom:56px;border:4px solid ${ink};border-radius:10px;background:${p.paper};box-shadow:12px 12px 0 rgba(74,30,44,.2);overflow:hidden">
        ${spine("left")}${spine("right")}
        <div style="position:absolute;left:96px;right:96px;top:34px;display:flex;justify-content:space-between;align-items:baseline;border-bottom:4px solid ${ink};padding-bottom:12px"><span style="font-family:var(--y2k);font-size:40px">TRACKLIST</span><span style="font-family:var(--pix);font-size:32px">${c.n} TRACKS · SIDE A</span></div>
        <div style="position:absolute;left:96px;right:96px;top:110px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:20px;height:${r.h}px;border-bottom:2px dotted rgba(74,30,44,.35)">
          <span style="flex:none;width:52px;font-family:var(--y2k);font-size:28px;color:${p.hot}">${p2(i + 1)}</span>
          ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? "opacity:.42;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}
          <span style="flex:none;font-family:var(--pix);font-size:30px;opacity:.65">${s === "c" ? "♪ played" : s === "x" ? "skip" : "--:--"}</span>
          ${c.b(it, L.ck(s, { size: 42, color: ink, border: `3px solid ${ink}`, radius: 50, w: 3.4, bg: s === "c" ? p.cover[1] : s === "x" ? "#e6dcd8" : "#fff" }))}</div>`)}</div>
        <div style="position:absolute;left:96px;right:96px;bottom:26px;display:flex;align-items:flex-end;justify-content:space-between">
          <span style="display:flex;align-items:flex-end;background:#fff;padding:8px 10px 4px;border:2px solid ${ink}">${bars}</span>
          <span style="text-align:right;font-family:var(--pix);font-size:26px;line-height:1.2">℗ ${c.year || ""} Y WORLD<br>ALL TRACKS MADE WITH ♥</span></div>
      </div>
      ${Y2K.sparkles([["#fff", 380, 640, 60], [p.hot, 1000, 640, 40], ["#fff", 20, 40, 50]])}
      </div>`;
    },

    /* 4 宠物蛋：蛋形电子宠物，屏幕里是像素小Y 和心心条，清单是一排鼓鼓的泡泡贴纸 */
    pet(c, p) {
      const ink = p.ink, two = c.n > 7, rows = two ? Math.ceil(c.n / 2) : c.n;
      const rh = Math.min(82, Math.floor(520 / Math.max(rows, 1))), r = { h: rh, f: Math.max(22, Math.round((two ? 30 : 34) * Math.min(1, rh / 82))) };
      /* 像素小Y：刺头 + 天线 + 方块身 + 竖眼 + 罗圈腿，10×12 */
      const PIX = ["......aa..", "..k.k.a...", ".oooooooo.", ".o......o.", ".o.e..e.o.", ".o.e..e.o.", ".o......o.", ".o..mm..o.", ".o......o.", ".oooooooo.", "..o....o..", ".oo....oo."];
      const pix = PIX.map((row, y) => [...row].map((ch, x) => ch === "." ? "" : `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${p.px}"/>`).join("")).join("");
      const G = Y2K.seed(19), glitter = Array.from({ length: 30 }, () => { const a = G() * 6.28, d = 60 + G() * 190; return `<circle cx="${(280 + Math.cos(a) * d * .95).toFixed(0)}" cy="${(390 + Math.sin(a) * d * 1.05).toFixed(0)}" r="${(2 + G() * 4).toFixed(1)}" fill="#fff" opacity=".85"/>`; }).join("");
      const hearts = Array.from({ length: 4 }, (_, i) => { const on = !frontMode && c.n && i < Math.round(c.done / c.n * 4);
        return `<svg viewBox="0 0 7 6" width="34" height="30" shape-rendering="crispEdges"><path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1Z" fill="${on ? p.px : "none"}" stroke="${p.px}" stroke-width=".5"/></svg>`; }).join("");
      const egg = "M280 10C430 10 545 200 545 390C545 560 430 650 280 650C130 650 15 560 15 390C15 200 130 10 280 10Z";
      return `<div class="lc" style="background:${Y2K.holo(p.bg)};color:${ink}">
      <div class="abs" style="inset:0;background:radial-gradient(circle,rgba(155,107,255,.18) 0 3px,transparent 4px) 0 0/48px 48px,radial-gradient(circle,rgba(255,255,255,.9) 0 2px,transparent 3px) 24px 24px/48px 48px"></div>
      ${c.photo}
      <div class="abs" style="left:70px;top:90px;font-family:var(--pix);font-size:40px;line-height:1.2">my lil'<br>day pet ✦</div>
      <div class="abs" style="right:70px;top:90px;text-align:right;font-family:var(--pix);font-size:40px;line-height:1.2">${esc(c.mon)} ${c.day}<br>${c.wen}</div>
      <svg class="abs" style="left:260px;top:30px;overflow:visible" width="560" height="680" viewBox="0 0 560 680">
        <defs><radialGradient id="y2kEgg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${p.egg[0]}"/><stop offset=".8" stop-color="${p.egg[1]}"/><stop offset="1" stop-color="${p.egg[2]}"/></radialGradient></defs>
        <circle cx="280" cy="-6" r="34" fill="none" stroke="${ink}" stroke-width="10"/><circle cx="280" cy="-6" r="34" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="6 10"/>
        <path d="${egg}" fill="url(#y2kEgg)" stroke="${ink}" stroke-width="7"/>
        <path d="M150 90C110 130 80 190 70 250" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".8"/>
        ${glitter}
        <rect x="120" y="200" width="320" height="250" rx="40" fill="${p.egg[2]}" stroke="${ink}" stroke-width="6"/>
        <rect x="146" y="224" width="268" height="202" rx="20" fill="${p.lcd}" stroke="${ink}" stroke-width="4"/>
        <g transform="translate(220 234) scale(12)" shape-rendering="crispEdges">${pix}</g>
        <circle cx="200" cy="545" r="30" fill="${p.st[0]}" stroke="${ink}" stroke-width="6"/><circle cx="280" cy="575" r="30" fill="${p.st[2]}" stroke="${ink}" stroke-width="6"/><circle cx="360" cy="545" r="30" fill="${p.st[1]}" stroke="${ink}" stroke-width="6"/>
        <text x="200" y="625" text-anchor="middle" font-family="VT323,monospace" font-size="30" fill="${ink}">A</text><text x="360" y="625" text-anchor="middle" font-family="VT323,monospace" font-size="30" fill="${ink}">C</text>
      </svg>
      <div class="abs" style="left:406px;top:418px;width:268px;display:flex;justify-content:center;gap:6px">${hearts}</div>
      <div class="abs" style="left:0;right:0;top:722px;text-align:center;font-family:var(--y2k);font-size:84px;line-height:1;letter-spacing:-.02em;${Y2K.chrome(ink, 3.5)}">DAILY PLAN</div>
      <div class="abs" style="left:${two ? 50 : 110}px;right:${two ? 50 : 110}px;top:${840 + Math.max(0, (520 - r.h * rows) / 2)}px;display:grid;grid-template-columns:${two ? "1fr 1fr" : "1fr"};column-gap:22px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;height:${r.h}px;min-width:0">
        <div style="flex:1;min-width:0;height:${r.h - 22}px;display:flex;align-items:center;gap:22px;padding:0 30px 0 14px;border:4px solid ${ink};border-radius:99px;background:radial-gradient(120% 90% at 30% 0%,#fff 0 30%,transparent 60%),${s === "x" ? "#e9e6f0" : p.st[i % 4]};box-shadow:0 6px 0 ${ink},inset 0 -8px 0 rgba(46,31,94,.08);transform:rotate(${(two ? Math.floor(i / 2) : i) % 2 ? .6 : -.6}deg)">
          ${c.b(it, L.ck(s, { size: Math.min(46, r.h - 40), color: ink, border: `3.5px solid ${ink}`, radius: 99, w: 3.6, mark: s === "c" ? "#fff" : ink, bg: s === "c" ? p.hot : "#fff" }))}
          ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? "opacity:.42;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}
          <span style="flex:none;font-size:26px">${s === "c" ? "♥" : s === "x" ? "…" : "✦"}</span></div></div>`)}</div>
      ${Y2K.sparkles([["#fff", 140, 330, 80], [p.hot, 860, 300, 50], ["#fff", 880, 560, 64], [p.hot, 170, 600, 40]])}
      </div>`;
    },

    /* 5 赛博 HUD：合成器日落 + 透视网格地面 + 扫描线，清单是终端命令行 */
    hud(c, p) {
      const r = c.fit(500, 72, 34), rate = c.n ? c.done / c.n : 0;
      const glitch = `text-shadow:-6px 0 ${p.mg},6px 0 ${p.cy}`;
      const blocks = Array.from({ length: 20 }, (_, i) => `<i style="flex:1;height:30px;background:${!frontMode && i < Math.round(rate * 20) ? p.cy : "rgba(46,230,255,.15)"}"></i>`).join("");
      const corner = (pos) => `<i style="position:absolute;${pos};width:44px;height:44px;border-color:${p.cy};border-style:solid;border-width:0"></i>`;
      return `<div class="lc" style="background:linear-gradient(180deg,${p.bg} 0%,${p.bg2} 30%,${p.bg} 46%,${p.bg});color:${p.fg}">
      <div class="abs" style="left:290px;top:190px;width:500px;height:500px;border-radius:50%;background:linear-gradient(180deg,${p.sun.join(",")});-webkit-mask:linear-gradient(180deg,#000 0 25%,transparent 25% 27%,#000 27% 32%,transparent 32% 35%,#000 35% 39%,transparent 39% 43%,#000 43% 46%,transparent 46% 50%,#000 50% 51%,transparent 51%);mask:linear-gradient(180deg,#000 0 25%,transparent 25% 27%,#000 27% 32%,transparent 32% 35%,#000 35% 39%,transparent 39% 43%,#000 43% 46%,transparent 46% 50%,#000 50% 51%,transparent 51%);box-shadow:0 0 90px ${p.mg}"></div>
      <div class="abs" style="left:0;right:0;top:440px;height:200px;overflow:hidden;perspective:300px">
        <div style="position:absolute;left:-60%;right:-60%;top:0;height:600px;transform:rotateX(62deg);transform-origin:50% 0;background-image:linear-gradient(${p.mg} 3px,transparent 3px),linear-gradient(90deg,${p.mg} 3px,transparent 3px);background-size:80px 60px;background-color:${p.bg}"></div>
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,${p.bg} 0%,transparent 40%)"></div></div>
      <div class="abs" style="left:0;right:0;top:440px;height:4px;background:${p.cy};box-shadow:0 0 18px ${p.cy}"></div>
      ${c.photo}
      <div class="abs" style="left:70px;top:58px;font-family:var(--pix);font-size:38px;color:${p.cy}">SYS://Y-WORLD/DAILY_PLAN.EXE</div>
      <div class="abs" style="right:70px;top:58px;font-family:var(--pix);font-size:38px;color:${p.mg}">● REC ${esc(c.date)}</div>
      <div class="abs" style="left:0;right:0;top:126px;text-align:center;font-family:var(--y2k);font-size:100px;line-height:1;letter-spacing:-.02em;${Y2K.chrome(p.bg, 5)};filter:drop-shadow(-5px 0 0 ${p.mg}) drop-shadow(5px 0 0 ${p.cy})">DAILY PLAN</div>
      <div class="abs" style="left:50%;top:268px;transform:translateX(-50%);white-space:nowrap;padding:6px 26px;background:rgba(10,4,30,.85);border:2px solid ${p.cy};font-size:32px;font-weight:700;letter-spacing:.3em;color:${p.fg};${glitch.replace("6px", "2px").replace("6px", "2px")}">每日计划 <span style="font-family:var(--pix);font-size:38px;letter-spacing:.1em;color:${p.cy}">// ${c.wen}</span></div>
      <div class="abs" style="left:60px;right:60px;top:670px;bottom:84px;border:3px solid ${p.cy};background:rgba(10,4,30,.82);box-shadow:0 0 30px rgba(46,230,255,.35),inset 0 0 40px rgba(123,46,255,.25)">
        ${corner("left:-10px;top:-10px;border-left-width:8px;border-top-width:8px")}${corner("right:-10px;top:-10px;border-right-width:8px;border-top-width:8px")}${corner("left:-10px;bottom:-10px;border-left-width:8px;border-bottom-width:8px")}${corner("right:-10px;bottom:-10px;border-right-width:8px;border-bottom-width:8px")}
        <div style="display:flex;justify-content:space-between;padding:20px 34px 12px;border-bottom:2px dashed rgba(46,230,255,.5);font-family:var(--pix);font-size:34px;color:${p.cy}"><span>&gt; run today.sh --date=${c.m ? `${c.year}${p2(c.m)}${c.day}` : "today"}</span><span style="color:${p.mg}">PID ${c.n}${c.day || "00"}</span></div>
        <div style="padding:8px 34px 0">${c.rows((it, s) => `<div style="display:flex;align-items:center;gap:20px;height:${r.h}px;border-bottom:1px solid rgba(46,230,255,.16)">
          <span style="flex:none;font-family:var(--pix);font-size:34px;color:${p.cy}">&gt;</span>
          ${c.b(it, L.ck(s, { size: 40, color: s === "x" ? p.mg : p.cy, border: `3px solid ${s === "x" ? p.mg : p.cy}`, radius: 0, w: 3.4, bg: s === "c" ? "rgba(46,230,255,.22)" : "transparent" }))}
          ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? `color:${p.mg};opacity:.7;text-decoration:line-through;text-decoration-thickness:2px` : ""}`)}
          <span style="flex:none;font-family:var(--pix);font-size:32px;color:${s === "c" ? p.cy : s === "x" ? p.mg : "rgba(233,246,255,.5)"}">${s === "c" ? "[ OK ]" : s === "x" ? "[SKIP]" : "[WAIT]"}</span></div>`)}</div>
        <div style="position:absolute;left:34px;right:34px;bottom:24px;display:flex;align-items:center;gap:16px;font-family:var(--pix);font-size:34px;color:${p.cy}"><span>SYNC</span><span style="flex:1;display:flex;gap:4px">${blocks}</span><span>${frontMode ? "--" : Math.round(rate * 100)}%</span></div>
      </div>
      <div class="abs" style="left:60px;right:60px;bottom:30px;display:flex;justify-content:space-between;font-family:var(--pix);font-size:30px;color:${p.vi};letter-spacing:.1em"><span>// stay online, stay cute</span><span>${c.year || ""} ✦ Y-WORLD</span></div>
      <div class="abs" style="inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 2px,transparent 2px 5px)"></div>
      </div>`;
    },

    /* 6 播放器：异形铬银播放器皮肤（LCD 屏 + 频谱 + 按键）+ 下方播放列表 */
    player(c, p) {
      const r = c.fit(600, 80, 34), rate = c.n ? c.done / c.n : 0, B = p.body;
      const R = Y2K.seed(c.n * 31 + (c.d || 3));
      const eq = Array.from({ length: 18 }, (_, i) => { const h = 20 + R() * 120; return `<i style="width:16px;height:${h.toFixed(0)}px;background:linear-gradient(0deg,${p.lg},${p.yl} 60%,${p.hot});display:block;-webkit-mask:repeating-linear-gradient(0deg,#000 0 6px,transparent 6px 9px);mask:repeating-linear-gradient(0deg,#000 0 6px,transparent 6px 9px)"></i>`; }).join("");
      const metal = `linear-gradient(180deg,${B[0]} 0%,${B[3]} 30%,${B[2]} 52%,${B[1]} 70%,${B[0]} 100%)`;
      const pb = (svg, big) => `<span style="width:${big ? 110 : 84}px;height:${big ? 110 : 84}px;border-radius:50%;border:4px solid #1a1b26;background:radial-gradient(circle at 35% 30%,#fff 0 10%,transparent 40%),${metal};display:grid;place-items:center;box-shadow:0 6px 0 #1a1b26"><svg viewBox="0 0 24 24" width="${big ? 46 : 36}" height="${big ? 46 : 36}" fill="#1a1b26">${svg}</svg></span>`;
      return `<div class="lc" style="background:radial-gradient(800px 600px at 80% 0%,#2a1a52,transparent 70%),radial-gradient(700px 600px at 0% 100%,#0e3340,transparent 70%),${p.bg};color:${p.fg}">
      <div class="abs" style="inset:0;background:radial-gradient(circle,rgba(255,255,255,.5) 0 1.5px,transparent 2px) 0 0/60px 60px;opacity:.5"></div>
      ${c.photo}
      <div class="abs" style="left:56px;right:56px;top:60px;height:520px;border:5px solid #1a1b26;border-radius:70px 170px 70px 170px;background:${metal};box-shadow:0 0 60px rgba(46,230,255,.35),14px 14px 0 rgba(0,0,0,.4)">
        <div style="position:absolute;left:60px;top:26px;font-family:var(--y2k);font-size:30px;color:#1a1b26;letter-spacing:.06em">Y-AMP ✦ 2K</div>
        <div style="position:absolute;right:120px;top:30px;display:flex;gap:10px">${[p.hot, p.yl, p.lg].map((x) => `<i style="width:24px;height:24px;border-radius:50%;background:${x};border:3px solid #1a1b26"></i>`).join("")}</div>
        <div style="position:absolute;left:50px;right:50px;top:80px;height:250px;border:5px solid #1a1b26;border-radius:26px;background:${p.lcd};box-shadow:inset 0 0 40px rgba(46,255,160,.18);overflow:hidden;color:${p.lg}">
          <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0 2px,transparent 2px 4px)"></div>
          <div style="position:absolute;left:28px;right:28px;top:16px;font-family:var(--pix);font-size:38px;white-space:nowrap;overflow:hidden">★ DAILY PLAN ★ ${esc(c.date)} ${c.wen} ★ 每日计划 ★ ${c.n} TRACKS ★</div>
          <div style="position:absolute;left:28px;top:66px;font-family:var(--pix);font-size:130px;line-height:1;text-shadow:0 0 16px ${p.lg}">${frontMode ? "00" : p2(c.done)}<span style="opacity:.5">:</span>${p2(c.n)}</div>
          <div style="position:absolute;left:30px;bottom:18px;font-family:var(--pix);font-size:28px;opacity:.75">128kbps · 44kHz · stereo</div>
          <div style="position:absolute;right:28px;bottom:22px;display:flex;align-items:flex-end;gap:5px;height:160px">${eq}</div>
        </div>
        <div style="position:absolute;left:60px;right:60px;top:352px;height:22px;border:4px solid #1a1b26;border-radius:12px;background:#1a1b26">
          <i style="position:absolute;left:0;top:0;bottom:0;width:${(frontMode ? 0 : rate) * 100}%;border-radius:8px;background:linear-gradient(90deg,${p.cy},${p.hot})"></i>
          <i style="position:absolute;top:-14px;left:calc(${(frontMode ? 0 : rate) * 100}% - 22px);width:44px;height:44px;border-radius:50%;border:4px solid #1a1b26;background:${metal}"></i></div>
        <div style="position:absolute;left:0;right:0;top:400px;display:flex;justify-content:center;align-items:center;gap:26px">
          ${pb('<path d="M6 5h2v14H6zM20 5v14L9 12z"/>')}${pb('<path d="M7 5l13 7-13 7z"/>', true)}${pb('<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>')}${pb('<path d="M6 6h12v12H6z"/>')}${pb('<path d="M16 5h2v14h-2zM4 5v14l11-7z"/>')}</div>
      </div>
      <div class="abs" style="left:56px;right:56px;top:620px;bottom:60px;border:4px solid ${p.cy};border-radius:24px;background:rgba(7,10,24,.88);box-shadow:0 0 40px rgba(255,46,136,.3);overflow:hidden">
        <div style="height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:linear-gradient(90deg,${p.hot},#7b2eff,${p.cy});font-family:var(--pix);font-size:38px;color:#fff"><span>♫ PLAYLIST — today.m3u</span><span>${c.wen}</span></div>
        <div style="padding:12px 28px 0">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:20px;height:${r.h}px;padding:0 14px;border-radius:10px;${i === items.findIndex((x) => c.state(x) === "") ? `background:rgba(46,255,160,.12);outline:2px solid ${p.lg};outline-offset:-4px` : ""}">
          <span style="flex:none;width:58px;font-family:var(--pix);font-size:38px;color:${s === "c" ? p.lg : s === "x" ? p.hot : p.cy}">${p2(i + 1)}.</span>
          ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? "opacity:.45;text-decoration:line-through;text-decoration-thickness:2px" : ""}`)}
          <span style="flex:none;font-family:var(--pix);font-size:32px;opacity:.7">${s === "c" ? "▶ 3:00" : s === "x" ? "⏏ skip" : "··:··"}</span>
          ${c.b(it, L.ck(s, { size: 40, color: s === "x" ? p.hot : p.lg, border: `3px solid ${s === "x" ? p.hot : p.lg}`, radius: 8, w: 3.4, bg: s === "c" ? "rgba(46,255,160,.2)" : "transparent" }))}</div>`)}</div>
        <div style="position:absolute;left:28px;right:28px;bottom:20px;display:flex;justify-content:space-between;align-items:center;font-family:var(--pix);font-size:32px;color:${p.cy}">
          <span style="display:flex;gap:10px">${["+ADD", "REM", "SEL"].map((t) => `<b style="font-weight:400;padding:2px 14px;border:2px solid ${p.cy};border-radius:6px">${t}</b>`).join("")}</span>
          <span>${c.n} tracks · ${frontMode ? "ready" : `${c.done} played`}</span></div>
      </div>
      ${Y2K.sparkles([[p.yl, 990, 600, 50], ["#fff", 20, 590, 40], [p.hot, 1000, 1390, 36]])}
      </div>`;
    },
  };
  LAYOUTS.y2k = (c, p) => Y2K_V[p.v](c, p);
