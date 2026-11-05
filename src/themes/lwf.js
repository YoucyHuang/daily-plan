  /* 01 Little Weird Friends：雾光 + 手写 + 白涂鸦。7 套配色各是一种构图：
     笔记本 / 小水母 / 贴纸 / 风筝 / 气球 / 汽水 / 果冻 */
  PALETTES.lwf = [
    { v:"note",    name:"粉红力量", base:"#a9c1ee", a1:"#eba3c3", a2:"#f0d9a8", a3:"#d8e1f5", ink:"#1f44a8", acc:"#e0457b", d2:"#3e64c8" },
    { v:"jelly",   name:"小水母",   base:"#93b1a7", a1:"#eedd92", a2:"#e3e6de", a3:"#7fa79a", ink:"#155e4e", acc:"#b4733a", d2:"#ffffff" },
    { v:"sticker", name:"怪小子",   base:"#efe3b8", a1:"#e2b6c6", a2:"#f5e9b8", a3:"#b9a7b8", ink:"#7a2e93", acc:"#ee9440", d2:"#f0b43a" },
    { v:"kite",    name:"风中小蓝", base:"#5e6d9c", a1:"#4b86cf", a2:"#8ea0cc", a3:"#34477c", ink:"#ffffff", acc:"#f2c94c", d2:"#26387f" },
    { v:"balloon", name:"蓝气球",   base:"#6e6488", a1:"#cfb02e", a2:"#6e86c8", a3:"#4e4470", ink:"#ffffff", acc:"#8fa8ff", d2:"#2d2650" },
    { v:"soda",    name:"薄荷汽水", base:"#bfe8dd", a1:"#fff0a8", a2:"#9fd9f0", a3:"#e8f7f2", ink:"#0e6b62", acc:"#ff7a59", d2:"#ff7a59" },
    { v:"gummy",   name:"葡萄冻",   base:"#d9ccf2", a1:"#f7b6d2", a2:"#b8e1ff", a3:"#efe6ff", ink:"#5b2a9e", acc:"#ff5e8a", d2:"#7c5cff" },
  ];

  /* 小Y：直接用「今日」页里那只的 SVG，按表情显示对应的脸 */
  (function lwfStyle() {
    if (document.getElementById("lwfStyle")) return;
    const st = document.createElement("style"); st.id = "lwfStyle";
    st.textContent = `.lwf-y svg { width:100%; height:100%; display:block; overflow:visible; }
      .lwf-y .m { display:none; }
      .lwf-y[data-mood="ok"] .m-ok, .lwf-y[data-mood="first"] .m-first, .lwf-y[data-mood="party"] .m-party { display:inline; }
      .lwf-y[data-mood="party"] .b-eyes { display:none; }
      .lc .lwf-wrap { white-space:normal; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-height:1.25; }`;
    document.head.appendChild(st);
  })();
  const lwfY = (mood, w, css = "") => { const s = document.querySelector("#buddy svg");
    return `<div class="abs lwf-y" data-mood="${mood}" style="width:${w}px;height:${Math.round(w * 1.252)}px;${css}">${s ? s.outerHTML : ""}</div>`; };
  const lwfHaze = (blobs, inset = 120, blur = 70) => `<div class="abs" style="inset:-${inset}px;filter:blur(${blur}px);background:${blobs}"></div>`;
  /* 白字深色描边（背卡风） */
  const lwfStroke = (c, w) => `-webkit-text-stroke:${w}px ${c};paint-order:stroke fill`;
  /* 一条穿过各点的平滑曲线 */
  const lwfCurve = (pts) => pts.reduce((d, [x, y], i) => { if (!i) return `M${x} ${y}`; const [px, py] = pts[i - 1], mx = (px + x) / 2, my = (py + y) / 2; return d + ` Q${px} ${py} ${mx} ${my}`; }, "") + (pts.length > 1 ? ` T${pts[pts.length - 1].join(" ")}` : "");
  const lwfBubble = (x, y, r, c, sw = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="${sw}"/><path d="M${x - r * .55} ${y - r * .2}Q${x - r * .45} ${y - r * .6} ${x - r * .05} ${y - r * .62}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const lwfDone = (c) => frontMode ? "" : ` · ${c.done}/${c.n}`;

  const LWF = {
    /* 0 笔记本：线圈本 + 小Y 趴在本子上 */
    note(c, p) {
      const ink = p.ink, acc = p.acc, r = c.fit(640, 92, 42);
      const rings = Array.from({ length: 10 }, (_, i) => `<div class="abs" style="left:${178 + i * 76}px;top:402px;width:24px;height:60px;border:6px solid #fff;border-radius:14px;box-shadow:2px 3px 0 rgba(0,0,0,.08)"></div>`).join("");
      return `<div class="lc grain" style="background:${p.base};color:${ink}">
      ${lwfHaze(`radial-gradient(330px 380px at 52% 38%,${p.a1},transparent 70%),radial-gradient(260px 240px at 50% 62%,${p.a2},transparent 70%),radial-gradient(500px 400px at 50% 85%,${p.a3},transparent 70%)`)}
      ${c.photo}
      <div class="abs" style="left:92px;top:64px;font-family:var(--hand);font-size:148px;line-height:.96;transform:rotate(-2deg)">DAILY<br>PLAN!</div>
      <div class="abs" style="left:560px;top:96px;font-family:var(--hand);font-size:46px;line-height:1.1">Tiny<br>steps<br>count!<div style="margin-top:18px">${L.wave(ink, 150)}</div></div>
      ${lwfY("first", 200, "left:790px;top:170px;transform:rotate(7deg)")}
      <div class="abs" style="left:110px;right:110px;top:430px;height:770px;border-radius:44px;background:rgba(255,255,255,.26);border:3px solid color-mix(in srgb, ${ink} 45%, transparent)"></div>
      <div class="abs" style="left:228px;top:470px;bottom:250px;width:3px;background:${acc};opacity:.45"></div>
      ${rings}
      <div class="abs" style="left:160px;right:160px;top:490px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:40px;height:${r.h}px;border-bottom:2.5px dashed color-mix(in srgb, ${ink} 22%, transparent)">
        ${c.b(it, L.ck(s, { size: 50, color: s === "x" ? acc : ink, border: `3.5px solid ${s === "x" ? acc : ink}`, radius: 14, w: 3, rot: L.ROT[i % 7], paths: L.HP }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:500;${s === "x" ? "opacity:.5" : ""}`)}</div>`)}</div>
      ${L.deco([["s4","#fff",30,470,70],["bub","#fff",26,610,90],["dot",acc,50,760,26],["s4","#fff",22,880,96],["s5",p.d2,30,1040,76],["s4","#fff",990,520,60],["s5","#fff",984,700,70],["dot","#fff",1004,880,22],["s4",acc,990,1000,62]])}
      <div class="abs" style="left:96px;top:1236px;font-family:var(--hand);font-size:48px;line-height:1.2">little things<br>for a brighter day ☆<div style="margin-top:10px">${L.wave(ink, 330)}</div></div>
      <div class="abs" style="right:96px;top:1244px;text-align:right"><div style="font-family:var(--hand);font-size:48px">Little Weird Friends</div><div style="font-size:28px;margin-top:18px">${esc(p.name)} · ${esc(c.date)} ${c.wcn}${lwfDone(c)}</div></div>
      </div>`;
    },

    /* 1 小水母：一只大水母漂在上面，触手一路垂下来，每件事挂在一个泡泡上 */
    jelly(c, p) {
      const ink = p.ink, r = c.fit(760, 104, 42), top = 470;
      const bs = Math.max(40, Math.min(66, Math.round(r.h * .66)));
      const xs = (i) => 150 + [0, 90, 30, 120, 10, 80, 40][i % 7];
      const pts = [[748, 338], ...items.map((_, i) => [xs(i) + bs / 2, top + i * r.h + r.h / 2])];
      const pts2 = pts.map(([x, y], i) => [x + (i ? 26 : -40), y + (i ? 30 : 0)]);
      return `<div class="lc grain" style="background:${p.base};color:${ink}">
      ${lwfHaze(`radial-gradient(360px 300px at 70% 18%,${p.a1},transparent 70%),radial-gradient(300px 340px at 30% 60%,${p.a2},transparent 70%),radial-gradient(500px 400px at 60% 95%,${p.a3},transparent 70%)`)}
      ${c.photo}
      <div class="abs" style="left:84px;top:70px;font-family:var(--hand);font-size:120px;line-height:.96">DAILY<br>JELLY</div>
      <div class="abs" style="left:88px;top:330px;font-family:var(--hand);font-size:40px;line-height:1.1">Floating in my own space ~</div>
      <svg class="abs" style="left:0;top:0;overflow:visible" width="1080" height="1440" viewBox="0 0 1080 1440">
        <path d="${lwfCurve(pts2)}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55" stroke-dasharray="2 14"/>
        <path d="${lwfCurve(pts)}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85"/>
        <g transform="translate(518 70)">
          <path d="M14 262Q6 20 232 16Q458 20 452 262Q414 240 376 262Q338 284 300 262Q262 240 232 262Q202 284 166 262Q128 240 90 262Q52 284 14 262Z" fill="rgba(255,255,255,.5)" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
          <path d="M70 160Q86 70 180 52" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".9"/>
          <circle cx="190" cy="170" r="11" fill="${ink}"/><circle cx="276" cy="170" r="11" fill="${ink}"/>
          <path d="M214 198q19 16 38 0" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
          <circle cx="160" cy="200" r="16" fill="${p.acc}" opacity=".35"/><circle cx="306" cy="200" r="16" fill="${p.acc}" opacity=".35"/>
          ${[90, 160, 300, 370].map((x, k) => `<path d="M${x} ${266 + (k % 2) * 10}q${k % 2 ? 14 : -14} 40 0 80q${k % 2 ? -14 : 14} 40 0 80" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`).join("")}
        </g>
        ${lwfBubble(990, 520, 18, "#fff", 3)}${lwfBubble(1010, 760, 26, "#fff", 3.5)}${lwfBubble(970, 980, 14, "#fff", 3)}${lwfBubble(60, 1180, 22, "#fff", 3)}
      </svg>
      ${c.rows((it, s, i) => `<div class="abs" style="left:${xs(i)}px;right:96px;top:${top + i * r.h}px;height:${r.h}px;display:flex;align-items:center;gap:28px">
        ${c.b(it, L.ck(s, { size: bs, color: s === "x" ? p.acc : ink, border: `4px solid #fff`, radius: 999, w: 3, bg: s === "c" ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.28)", paths: L.HP }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:500;${s === "x" ? "opacity:.5" : ""}`)}</div>`)}
      ${L.deco([["s4","#fff",960,400,56],["s4",p.a1,40,560,60],["dot","#fff",44,720,20],["s4","#fff",980,1120,70]])}
      <div class="abs" style="left:96px;right:96px;top:1290px;display:flex;justify-content:space-between;align-items:flex-end">
        <div style="font-family:var(--hand);font-size:46px">little jelly, big ocean ☆<div style="margin-top:8px">${L.wave(ink, 380, 3.5)}</div></div>
        <div style="text-align:right;font-size:26px">Little Weird Friends<br>${esc(p.name)} · ${esc(c.date)} ${c.wcn}${lwfDone(c)}</div></div>
      </div>`;
    },

    /* 2 怪小子：一整张贴纸，每件事是一枚歪歪的胶囊贴纸，小Y 也是一枚 */
    sticker(c, p) {
      const ink = p.ink, r = c.fit(700, 98, 40), top = 430;
      const fills = [p.a1, "#fff", p.a2, p.d2, "#fff", p.a1, p.a2];
      const off = [0, 70, 24, 96, 40, 80, 10];
      const sticker = `filter:drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 10px 8px rgba(80,40,60,.18))`;
      const word = (t, x, y, rot, sz) => `<div class="abs" style="left:${x}px;top:${y}px;font-family:var(--hand);font-size:${sz}px;line-height:1;color:${ink};${lwfStroke("#fff", 22)};transform:rotate(${rot}deg);filter:drop-shadow(0 8px 0 rgba(80,40,60,.12))">${t}</div>`;
      return `<div class="lc grain" style="background:${p.base};color:${ink}">
      ${lwfHaze(`radial-gradient(380px 320px at 30% 30%,${p.a1},transparent 70%),radial-gradient(340px 340px at 80% 70%,${p.a3},transparent 70%),radial-gradient(420px 300px at 40% 95%,${p.a2},transparent 70%)`)}
      ${c.photo}
      ${word("DAILY", 84, 70, -5, 150)}${word("PLAN", 150, 218, 3, 150)}
      <div class="abs" style="left:760px;top:70px;width:220px;height:220px;border-radius:50%;background:${p.acc};border:10px solid #fff;box-shadow:0 10px 10px rgba(80,40,60,.16);transform:rotate(12deg);display:grid;place-items:center;text-align:center;font-family:var(--hand);font-size:40px;line-height:1;color:#fff">TINY<br>BUT<br>MIGHTY!</div>
      <div class="abs" style="left:560px;top:300px;padding:8px 22px;background:#fff;border-radius:10px;transform:rotate(-3deg);font-size:26px;box-shadow:0 6px 8px rgba(80,40,60,.12)">${esc(p.name)} · ${esc(c.date)} ${c.wcn}</div>
      ${c.rows((it, s, i) => `<div class="abs" style="left:${86 + off[i % 7]}px;width:720px;top:${top + i * r.h + Math.min(6, r.h * .06)}px;height:${r.h - Math.min(16, r.h * .14)}px;border-radius:999px;background:${fills[i % 7]};border:8px solid #fff;box-shadow:0 8px 8px rgba(80,40,60,.14);transform:rotate(${L.ROT[i % 7] * (r.h > 80 ? .5 : .15)}deg);display:flex;align-items:center;gap:22px;padding:0 34px;box-sizing:border-box">
        ${c.b(it, L.ck(s, { size: Math.max(30, Math.min(48, r.h - 40)), color: s === "x" ? p.acc : ink, border: `3.5px solid ${s === "x" ? p.acc : ink}`, radius: 999, w: 3.2, bg: "#fff", paths: L.HP }))}
        ${c.t(it, `font-size:${Math.max(22, Math.min(r.f, Math.round(r.h * .5)))}px;font-weight:700;${s === "x" ? "opacity:.45;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}</div>`)}
      ${lwfY("party", 190, `left:850px;top:1120px;transform:rotate(9deg);${sticker}`)}
      <svg class="abs" style="left:900px;top:470px;width:110px;height:110px;transform:rotate(-12deg);${sticker}" viewBox="0 0 100 100"><path d="M50 4L62 36L96 37L69 58L79 92L50 72L21 92L31 58L4 37L38 36Z" fill="${p.d2}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/></svg>
      <div class="abs" style="left:880px;top:700px;width:130px;height:130px;border-radius:50%;background:#fff;transform:rotate(8deg);display:grid;place-items:center;font-family:var(--hand);font-size:44px;color:${p.acc};box-shadow:0 8px 8px rgba(80,40,60,.14)">WOW</div>
      <div class="abs" style="left:900px;top:900px;padding:10px 18px;border-radius:16px;background:${p.a1};border:6px solid #fff;transform:rotate(-8deg);font-family:var(--hand);font-size:38px;box-shadow:0 8px 8px rgba(80,40,60,.14)">OK!</div>
      <div class="abs" style="left:96px;top:1300px;font-family:var(--hand);font-size:46px">stick with it! ☆${frontMode ? "" : `  ${c.done}/${c.n}`}<div style="margin-top:8px">${L.wave(ink, 340, 3.5)}</div></div>
      <div class="abs" style="left:520px;top:1316px;font-family:var(--hand);font-size:34px;opacity:.8">Little Weird Friends</div>
      </div>`;
    },

    /* 3 风中小蓝：左上一只风筝，尾巴一路飘下来，每件事是尾巴上的一面燕尾小旗 */
    kite(c, p) {
      const dk = p.d2, r = c.fit(780, 100, 40), top = 450;
      const xs = (i) => 150 + Math.round(26 * Math.sin(i * 1.25));
      const pts = [[210, 400], ...items.map((_, i) => [xs(i), top + i * r.h + r.h / 2]), [xs(c.n) - 20, top + c.n * r.h + 40]];
      const fills = ["#ffffff", p.acc, "#dfe6f7", p.a2, "#ffffff", p.acc, "#dfe6f7"];
      const bows = items.slice(0, -1).map((_, i) => { const x = (xs(i) + xs(i + 1)) / 2, y = top + (i + 1) * r.h; return `<path d="M${x} ${y}l-16 -10v20Z M${x} ${y}l16 -10v20Z" fill="${p.acc}" stroke="${dk}" stroke-width="2.5" stroke-linejoin="round"/>`; }).join("");
      return `<div class="lc grain" style="background:${p.base};color:#fff">
      ${lwfHaze(`radial-gradient(420px 360px at 70% 30%,${p.a1},transparent 70%),radial-gradient(360px 300px at 20% 80%,${p.a2},transparent 70%),radial-gradient(500px 360px at 80% 100%,${p.a3},transparent 70%)`)}
      ${c.photo}
      <svg class="abs" style="left:0;top:0;overflow:visible" width="1080" height="1440" viewBox="0 0 1080 1440">
        <g fill="none" stroke="#fff" stroke-linecap="round" opacity=".55" stroke-width="5">
          <path d="M640 560q80 -40 160 0t160 0"/><path d="M700 640q60 -30 120 0t120 0"/><path d="M620 1060q90 -44 180 0t180 0"/><path d="M720 1140q50 -24 100 0"/>
        </g>
        <path d="${lwfCurve(pts)}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
        ${bows}
        <g transform="translate(90 70)">
          <path d="M120 0L240 150L120 330L0 150Z" fill="${p.a1}" stroke="${dk}" stroke-width="8" stroke-linejoin="round"/>
          <path d="M120 0L240 150L120 150Z" fill="#fff" opacity=".85"/><path d="M0 150L120 330L120 150Z" fill="${p.acc}" opacity=".9"/>
          <path d="M120 0V330M0 150H240" stroke="${dk}" stroke-width="5"/>
          <circle cx="94" cy="140" r="8" fill="${dk}"/><circle cx="146" cy="140" r="8" fill="${dk}"/><path d="M106 168q14 12 28 0" fill="none" stroke="${dk}" stroke-width="5" stroke-linecap="round"/>
        </g>
      </svg>
      <div class="abs" style="left:420px;top:84px;font-family:var(--hand);font-size:136px;line-height:.95;${lwfStroke(dk, 14)}">DAILY<br>PLAN!</div>
      <div class="abs" style="left:430px;top:356px;font-family:var(--hand);font-size:42px;${lwfStroke(dk, 8)}">Off to somewhere bright ~</div>
      ${c.rows((it, s, i) => `<div class="abs" style="left:${xs(i) + 18}px;width:${700 - (i % 2) * 40}px;top:${top + i * r.h + Math.min(10, r.h * .08)}px;height:${r.h - Math.min(20, r.h * .16)}px;background:${fills[i % 7]};clip-path:polygon(0 0,100% 0,94% 50%,100% 100%,0 100%);transform:rotate(${i % 2 ? 1.6 : -1.6}deg);transform-origin:0 50%;display:flex;align-items:center;gap:22px;padding:0 70px 0 26px;box-sizing:border-box;color:${dk}">
        ${c.b(it, L.ck(s, { size: Math.max(28, Math.min(46, r.h - 36)), color: s === "x" ? "#c2452f" : dk, border: `3.5px solid ${dk}`, radius: 10, w: 3.2, rot: L.ROT[i % 7], paths: L.HP }))}
        ${c.t(it, `font-size:${Math.max(22, Math.min(r.f, Math.round(r.h * .5)))}px;font-weight:700;${s === "x" ? "opacity:.45;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}</div>`)}
      ${L.deco([["s4",p.acc,960,420,70],["s4","#fff",1000,760,50],["s5","#fff",960,880,76],["dot",p.acc,40,1230,24],["s4","#fff",990,1240,60]])}
      <div class="abs" style="left:96px;right:96px;top:1300px;display:flex;justify-content:space-between;align-items:flex-end;${lwfStroke(dk, 6)}">
        <div style="font-family:var(--hand);font-size:42px;white-space:nowrap">let the wind carry you ☆</div>
        <div style="text-align:right;font-size:26px;white-space:nowrap">Little Weird Friends<br>${esc(p.name)} · ${esc(c.date)} ${c.wcn}${lwfDone(c)}</div></div>
      </div>`;
    },

    /* 4 蓝气球：小Y 在左下角攥着一把气球，每件事是一只气球 */
    balloon(c, p) {
      const ink = p.ink, dk = p.d2, r = c.fit(700, 100, 40), top = 360 + Math.round(Math.max(0, 700 - c.n * r.h) * .6);
      const bw = Math.max(38, Math.min(70, Math.round(r.h * .7))), bh = Math.round(bw * 1.2);
      const cols = [p.a1, p.acc, "#ffffff", "#f29fb8", p.a1, "#9fe0d0", p.acc];
      const bx = (i) => 190 + [0, 44, 12, 56, 20, 50, 4][i % 7];
      const hand = [277, 1186];
      const yc = (i) => top + i * r.h + r.h / 2;
      const strings = items.map((_, i) => { const x = bx(i) + bw / 2, y = yc(i) + bh / 2; return `<path d="M${x} ${y}Q${x + (hand[0] - x) * .2 + 30} ${(y + hand[1]) / 2} ${hand[0]} ${hand[1]}" fill="none" stroke="#fff" stroke-width="2.4" opacity=".75"/>`; }).join("");
      const ball = (s, col) => `<svg viewBox="0 0 50 62" width="${bw}" height="${bh}" style="overflow:visible;display:block">
        <path d="M25 2C40 2 48 14 48 26C48 40 36 52 25 52C14 52 2 40 2 26C2 14 10 2 25 2Z" fill="${col}" stroke="${dk}" stroke-width="2.6"/>
        <path d="M22 52l3 5 3-5Z" fill="${col}" stroke="${dk}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M11 22Q12 11 22 8" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".85"/>
        ${s ? `<path d="${L.HP[s]}" transform="translate(13 15)" fill="none" stroke="${s === "x" ? "#c2452f" : dk}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</svg>`;
      return `<div class="lc grain" style="background:${p.base};color:${ink}">
      ${lwfHaze(`radial-gradient(380px 320px at 70% 25%,${p.a1},transparent 70%),radial-gradient(400px 360px at 25% 55%,${p.a2},transparent 70%),radial-gradient(500px 360px at 60% 100%,${p.a3},transparent 70%)`)}
      ${c.photo}
      <div class="abs" style="left:640px;top:190px;width:300px;height:90px;border-radius:60px;background:#fff;opacity:.28;box-shadow:-80px 30px 0 -10px rgba(255,255,255,.9)"></div>
      <div class="abs" style="left:92px;top:72px;font-family:var(--hand);font-size:134px;line-height:.95;${lwfStroke(dk, 14)}">UP, UP<br>&amp; AWAY!</div>
      <div class="abs" style="left:700px;top:84px;font-family:var(--hand);font-size:42px;line-height:1.1;color:${p.a1};${lwfStroke(dk, 7)}">Small body,<br>big dreams.</div>
      <svg class="abs" style="left:0;top:0;overflow:visible" width="1080" height="1440" viewBox="0 0 1080 1440">${strings}</svg>
      ${c.rows((it, s, i) => `<div class="abs" style="left:${bx(i)}px;right:96px;top:${top + i * r.h}px;height:${r.h}px;display:flex;align-items:center;gap:${36 + (56 - [0, 44, 12, 56, 20, 50, 4][i % 7])}px">
        ${c.b(it, ball(s, cols[i % 7]))}
        ${c.t(it, `font-size:${r.f}px;font-weight:700;${lwfStroke(dk, 6)};${s === "x" ? "opacity:.5;text-decoration:line-through;text-decoration-thickness:3px" : ""}`)}</div>`)}
      ${lwfY("party", 230, "left:70px;top:1062px")}
      ${L.deco([["s4",p.a1,960,420,70],["s4",p.acc,990,620,46],["s5","#fff",960,820,72],["dot",p.a1,1000,980,22]])}
      <div class="abs" style="right:96px;top:1236px;text-align:right;${lwfStroke(dk, 6)}"><div style="font-family:var(--hand);font-size:48px">hold on to the little things ☆</div>
        <div style="font-size:26px;margin-top:12px">Little Weird Friends · ${esc(p.name)} · ${esc(c.date)} ${c.wcn}${lwfDone(c)}</div></div>
      </div>`;
    },

    /* 5 薄荷汽水：一大杯汽水，每件事是往上冒的一颗泡泡 */
    soda(c, p) {
      const ink = p.ink, r = c.fit(720, 98, 40), top = 500;
      const R = rng(7), fizz = Array.from({ length: 26 }, () => lwfBubble(Math.round(200 + R() * 680), Math.round(470 + R() * 760), Math.round(5 + R() * 13), "#fff", 2.5)).join("");
      const glass = "M150 380H930L870 1270Q868 1290 848 1290H232Q212 1290 210 1270Z";
      return `<div class="lc grain" style="background:${p.base};color:${ink}">
      ${lwfHaze(`radial-gradient(380px 320px at 30% 18%,${p.a1},transparent 70%),radial-gradient(420px 380px at 70% 60%,${p.a2},transparent 70%),radial-gradient(500px 360px at 40% 100%,${p.a3},transparent 70%)`)}
      ${c.photo}
      <svg class="abs" style="left:0;top:0;overflow:visible" width="1080" height="1440" viewBox="0 0 1080 1440">
        <defs><clipPath id="lwfGlass"><path d="${glass}"/></clipPath>
          <linearGradient id="lwfLiq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a2}" stop-opacity=".55"/><stop offset="1" stop-color="${p.a1}" stop-opacity=".55"/></linearGradient></defs>
        <g transform="rotate(14 820 260)"><rect x="800" y="70" width="40" height="420" rx="18" fill="#fff" stroke="${ink}" stroke-width="5"/>
          ${Array.from({ length: 7 }, (_, i) => `<path d="M803 ${100 + i * 56}l34 -22v24l-34 22Z" fill="${p.acc}"/>`).join("")}</g>
        <g clip-path="url(#lwfGlass)">
          <rect x="140" y="440" width="800" height="860" fill="url(#lwfLiq)"/>
          <path d="M140 452q45 -22 90 0t90 0t90 0t90 0t90 0t90 0t90 0t90 0t90 0V500H140Z" fill="#fff" opacity=".55"/>
          ${fizz}
          <path d="M190 420L250 1260" stroke="#fff" stroke-width="22" stroke-linecap="round" opacity=".45"/>
        </g>
        <path d="${glass}" fill="rgba(255,255,255,.14)" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
        <g transform="translate(176 300)"><circle r="94" fill="${p.a1}" stroke="${ink}" stroke-width="5"/><circle r="74" fill="#fffbe0" stroke="${p.acc}" stroke-width="3" opacity=".9"/>
          ${Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4; return `<path d="M0 0L${(70 * Math.cos(a - .3)).toFixed(1)} ${(70 * Math.sin(a - .3)).toFixed(1)}A70 70 0 0 1 ${(70 * Math.cos(a + .3)).toFixed(1)} ${(70 * Math.sin(a + .3)).toFixed(1)}Z" fill="${p.a1}" opacity=".9"/>`; }).join("")}</g>
        ${lwfBubble(990, 540, 20, "#fff", 3)}${lwfBubble(1000, 700, 12, "#fff", 3)}${lwfBubble(70, 760, 24, "#fff", 3)}${lwfBubble(60, 960, 14, "#fff", 3)}
      </svg>
      <div class="abs" style="left:320px;top:84px;font-family:var(--hand);font-size:132px;line-height:.95;transform:rotate(-3deg)">SODA<br>DAY!</div>
      <div class="abs" style="left:600px;top:226px;font-family:var(--hand);font-size:40px;line-height:1.1;color:${p.acc};transform:rotate(-4deg)">fizzy<br>&amp; fresh ~</div>
      <div class="abs" style="left:250px;right:250px;top:${top}px">${c.rows((it, s, i) => `<div style="display:flex;align-items:center;gap:26px;height:${r.h}px">
        ${c.b(it, L.ck(s, { size: Math.min(54, r.h - 30), color: s === "x" ? p.acc : ink, border: `4px solid #fff`, radius: 999, w: 3.2, bg: s === "c" ? "#fff" : "rgba(255,255,255,.35)", paths: L.HP }))}
        ${c.t(it, `font-size:${r.f}px;font-weight:700;${s === "x" ? "opacity:.45" : ""}`)}</div>`)}</div>
      <div class="abs" style="left:96px;right:96px;top:1320px;display:flex;justify-content:space-between;align-items:flex-end">
        <div style="font-family:var(--hand);font-size:40px;white-space:nowrap">pop! one bubble at a time ☆</div>
        <div style="text-align:right;font-size:26px;white-space:nowrap">Little Weird Friends<br>${esc(p.name)} · ${esc(c.date)} ${c.wcn}${lwfDone(c)}</div></div>
      </div>`;
    },

    /* 6 葡萄冻：两列 Q 弹果冻块，每件事一块 */
    gummy(c, p) {
      const ink = p.ink, n = Math.max(c.n, 1), rows = Math.ceil(n / 2), gap = 26, top = 420, avail = 830;
      const th = Math.min(230, Math.floor((avail - gap * (rows - 1)) / rows)), tw = 437;
      const f = Math.max(24, Math.min(40, Math.round(th * .2)));
      const cols = [p.a1, p.a2, "#ffffff", "#c9f2c7", p.a2, p.a1, "#ffe7a8"];
      const rad = ["70px 52px 64px 44px / 58px 66px 46px 60px", "52px 72px 46px 66px / 66px 50px 62px 48px", "64px 46px 72px 52px / 50px 62px 56px 68px"];
      const title = "JELLY".split("").map((ch, i) => `<span style="display:inline-block;transform:rotate(${[-8, 6, -4, 8, -6][i]}deg) translateY(${[0, 10, -6, 8, 0][i]}px);color:${[p.acc, p.d2, ink, p.acc, p.d2][i]}">${ch}</span>`).join("");
      const grapes = [[0, 0], [44, 0], [88, 0], [22, 38], [66, 38], [44, 76]].map(([x, y]) => `<circle cx="${x + 30}" cy="${y + 50}" r="24" fill="${p.d2}" stroke="${ink}" stroke-width="4"/><path d="M${x + 18} ${y + 42}q4 -8 12 -9" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`).join("");
      return `<div class="lc grain" style="background:${p.base};color:${ink}">
      ${lwfHaze(`radial-gradient(380px 300px at 30% 20%,${p.a1},transparent 70%),radial-gradient(420px 380px at 75% 55%,${p.a2},transparent 70%),radial-gradient(500px 360px at 30% 100%,${p.a3},transparent 70%)`)}
      ${c.photo}
      <div class="abs" style="left:84px;top:60px;font-family:var(--hand);font-size:168px;line-height:1;${lwfStroke("#fff", 18)}">${title}</div>
      <div class="abs" style="left:96px;top:262px;font-family:var(--hand);font-size:46px">wobbly, but still going ~</div>
      <div class="abs" style="left:96px;top:330px;font-size:26px;opacity:.8">${esc(p.name)} · ${esc(c.date)} ${c.wcn}${lwfDone(c)}</div>
      <svg class="abs" style="left:800px;top:70px;overflow:visible" width="180" height="200" viewBox="0 0 180 200"><path d="M74 30Q80 6 104 0" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M84 22q30 -24 56 -4q-26 16 -56 4Z" fill="#9fd98a" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>${grapes}</svg>
      ${c.rows((it, s, i) => { const col = i % 2, row = Math.floor(i / 2);
        return `<div class="abs" style="left:${90 + col * (tw + gap)}px;top:${top + row * (th + gap)}px;width:${tw}px;height:${th}px;border-radius:${rad[i % 3]};background:radial-gradient(160px 70px at 30% 20%,rgba(255,255,255,.8),transparent 70%),${cols[i % 7]};box-shadow:inset 0 -12px 0 rgba(91,42,158,.10),0 10px 0 rgba(91,42,158,.14);transform:rotate(${[-1.4, 1.2, .8, -1, 1.5, -.8][i % 6]}deg);display:flex;align-items:center;gap:20px;padding:0 30px;box-sizing:border-box">
          ${c.b(it, L.ck(s, { size: Math.min(50, th - 40), color: s === "x" ? p.acc : ink, border: `4px solid ${ink}`, radius: 999, w: 3.2, bg: "rgba(255,255,255,.7)", paths: L.HP }))}
          ${c.t(it, `font-size:${f}px;font-weight:700;${th > 110 ? "" : ""}${s === "x" ? "opacity:.45;text-decoration:line-through;text-decoration-thickness:3px" : ""}`).replace('class="lc-t"', th >= 2.6 * f ? 'class="lc-t lwf-wrap"' : 'class="lc-t"')}</div>`; })}
      ${n % 2 ? lwfY("party", Math.min(170, Math.round(th * .72)), `left:${90 + tw + gap + tw / 2 - Math.min(170, Math.round(th * .72)) / 2}px;top:${top + (rows - 1) * (th + gap) + th / 2 - Math.min(170, Math.round(th * .72)) * .6}px;transform:rotate(6deg)`) : ""}
      ${L.deco([["s4","#fff",30,600,56],["bub","#fff",24,900,70],["s4",p.acc,1000,700,50],["dot","#fff",1010,1000,20]])}
      <div class="abs" style="left:96px;right:96px;top:1300px;display:flex;justify-content:space-between;align-items:flex-end">
        <div style="font-family:var(--hand);font-size:46px">jiggle jiggle, done ☆<div style="margin-top:8px">${L.wave(ink, 330, 3.5)}</div></div>
        <div style="font-family:var(--hand);font-size:40px">Little Weird Friends</div></div>
      </div>`;
    },
  };
  LAYOUTS.lwf = (c, p) => (LWF[p.v] || LWF.note)(c, p);
