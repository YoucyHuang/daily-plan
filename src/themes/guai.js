  /* 鬼怪 · 7 套 7 种构图：山水四季（手卷 / 立轴 / 一枝 / 寒枝）+ 本真三种（肖像 / 眼与唇 / 双联）
     沿用上面的 GK_FILTERS、gkKit、gkBox、gkLine；印章用「怪」字。 */
  PALETTES.guai = [
    { name:"山水 · 春", k:"shan", v:"spring", seed:11, season:"Spring", motto:"Mountains far, things near.", ground:"#eeebdb", light:["#e8dc8e","#f6f3e6"], mid:["#bcc4a6","#a7a27a","#d8be80"], ink:"#3a2f25", ink2:"#74765e", dot:"#3e66b0", red:"#c2502f" },
    { name:"山水 · 夏", k:"shan", v:"summer", seed:31, season:"Summer", motto:"Green shade, slow noon.", ground:"#e9eedf", light:["#cfe3b0","#f3f5ea"], mid:["#8fb39a","#a9b98a","#c9d9a8"], ink:"#2f3328", ink2:"#5f6a55", dot:"#3e66b0", red:"#c2502f" },
    { name:"山水 · 秋", k:"shan", v:"autumn", seed:23, season:"Autumn", motto:"One branch, one thing.", ground:"#f3ebda", light:["#edc25a","#f7f0e1"], mid:["#e59a3c","#d9c9a8","#c9693a"], ink:"#4a3423", ink2:"#8a6a45", dot:"#6f8a55", red:"#b9412a" },
    { name:"山水 · 冬", k:"shan", v:"winter", seed:41, season:"Winter", motto:"Bare branch, clear sky.", ground:"#efeee9", light:["#e3e1da","#f6f5f1"], mid:["#b9bdb9","#9ca3a6","#c9c4b8"], ink:"#2e2c2a", ink2:"#7a7772", dot:"#b9412a", red:"#b9412a" },
    { name:"本真 · 素底", k:"ben", v:"plain", seed:5, motto:"A gaze turned outward, examining inward.", ground:"#eeece6", bg:["#c6c8bf","#e1ded6","#d6ceb9"], panel:"#f3efe6", flesh:["#d9b98a","#c9a27a","#e3c2a2","#886a4b"], hair:["#312724","#4a3a2e","#5b4636"], ink:"#312724", head:"#312724", red:"#b8382a", sealC:"#b8382a", cool:"#7e95a6" },
    { name:"本真 · 赭红", k:"ben", v:"ochre", seed:9, motto:"Look, and be looked at.", ground:"#8e4a30", bg:["#a85a3a","#6e2f22","#b9874f","#9d8857"], panel:"#efe6d2", flesh:["#d9b98a","#c9a27a","#e3c2a2","#b68d5f"], hair:["#312724","#4a2a20","#5b3a2c"], ink:"#312724", head:"#f1e6cf", red:"#c9433a", sealC:"#f1e6cf", cool:"#9db4be" },
    { name:"本真 · 橄榄", k:"ben", v:"olive", seed:13, motto:"Still, and seeing.", ground:"#adaa77", bg:["#9c995f","#c2be8a","#8a8650","#b8b486"], panel:"#f0ebda", flesh:["#d9b98a","#c9a27a","#e3c2a2","#a68a5f"], hair:["#2f2a1c","#463d2a","#5a4e34"], ink:"#2f2a1c", head:"#2f2a1c", red:"#b8382a", sealC:"#b8382a", cool:"#8ba08f" },
  ];
  PAL_SW.guai = (p) => p.k === "shan" ? [p.ground, p.light[0], p.mid[0]] : [p.ground, p.flesh[0], p.red];

  /* 印章「怪」 */
  const gkMark = (c, sz = 64) => `<span style="display:grid;place-items:center;width:${sz}px;height:${sz}px;border:2px solid ${c};color:${c};font-family:var(--serif);font-weight:600;font-size:${Math.round(sz * .56)}px;border-radius:4px;filter:url(#gkRough)">怪</span>`;
  /* 清单行：box(s, size) 画勾选框；line=宽度时每行下面一条手绘线 */
  const gkList = (c, r, o) => c.rows((it, s) => {
    const bs = Math.min(o.box || 46, r.h - 6), lh = o.line ? r.h - 8 : r.h;
    return `<div style="display:flex;align-items:center;gap:${o.gap || 28}px;height:${lh}px">${c.b(it, o.mk(s, bs))}${c.t(it, `font-size:${r.f}px;letter-spacing:${o.ls || ".06em"};${o.style || ""}${s === "x" ? "opacity:.45;text-decoration:line-through;text-decoration-thickness:1.5px" : ""}`)}</div>${o.line ? gkLine(o.line, o.lc, .22) : ""}`;
  });
  const gkDate = (c) => c.m ? `${L.cnMon(c.m)}月${L.cnDay(c.d)}` : esc(c.date);
  /* 叶形勾选框：空 = 勾边；完成 = 填成秋叶；划掉 = 淡掉的叶子 + 朱红叉 */
  const gkLeaf = (s, p, size) => `<svg width="${size}" height="${size}" viewBox="0 0 50 50" style="flex:0 0 auto;overflow:visible;filter:url(#gkRough)">
    <path d="M7 43C6 24 20 8 44 6C45 28 31 43 7 43Z" fill="${s === "c" ? p.mid[0] : "none"}" stroke="${p.ink}" stroke-width="2" stroke-linejoin="round" opacity="${s === "x" ? .4 : .9}"/>
    <path d="M7 43C17 33 27 22 38 12" fill="none" stroke="${p.ink}" stroke-width="1.6" stroke-linecap="round" opacity="${s === "x" ? .35 : .8}"/>
    ${s === "x" ? `<path d="M12 12c8 7 15 15 26 26M38 12c-9 8-17 16-26 26" stroke="${p.red}" stroke-width="3.2" fill="none" stroke-linecap="round"/>` : ""}</svg>`;
  /* 小圆勾选框（冬） */
  const gkRing = (s, p, size) => `<svg width="${size}" height="${size}" viewBox="0 0 40 40" style="flex:0 0 auto;overflow:visible;filter:url(#gkRough)">
    <circle cx="20" cy="20" r="15" fill="none" stroke="${p.ink}" stroke-width="1.6" opacity=".7"/>
    ${s === "c" ? `<circle cx="20" cy="20" r="7" fill="${p.red}"/>` : s === "x" ? `<path d="M11 29L29 11" stroke="${p.ink2}" stroke-width="2" stroke-linecap="round"/>` : ""}</svg>`;
  /* 唇红一笔 */
  const gkLip = (x, y, w, c) => `<svg class="abs" style="left:${x - w / 2}px;top:${y - w * .1}px;filter:url(#gkDry);overflow:visible" width="${w}" height="${w * .2}" viewBox="0 0 200 40"><path d="M6 22C40 10 70 8 100 14C130 8 162 10 194 22C160 30 130 32 100 28C70 32 40 30 6 22Z" fill="${c}"/></svg>`;
  const gkDot = (x, y, r, c) => `<i class="abs" style="left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:${c};filter:url(#gkRough)"></i>`;
  /* 有颜料边的面板（overflow 裁住碎笔） */
  const gkPanel = (x, y, w, h, bg, inner, radius = "0", f = "") => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg};border-radius:${radius};filter:url(#${f || "gkEdge"})"></div>
    <div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${f ? `filter:url(#${f})` : ""}"><div style="width:100%;height:100%;overflow:hidden;border-radius:${radius}">${inner}</div></div>`;
  /* 一张脸：头发团 + 碎笔堆出的脸（毛边）+ 眼窝、鼻影两笔暗赭 + 两点冷色 + 一笔唇红。x,y 是脸的左上角 */
  const gkFace = (K, p, x, y, w, h) => {
    const ex = w * .2, ey = y + h * .45;
    return `${gkPanel(x - w * .1, y - h * .16, w * 1.2, h * .72, "transparent", K.dabs(-30, -20, w * 1.2 + 60, h * .8, p.hair, 60, [w * .14, w * .42], [.4, .75]), "50% 50% 24% 24% / 64% 64% 20% 20%", "gkBrush")}
      ${gkPanel(x + w * .36, y + h * .88, w * .28, h * .3, p.flesh[1], K.dabs(-10, -10, w * .3 + 20, h * .34, p.flesh, 14, [w * .08, w * .2], [.2, .4]), "0 0 30% 30%", "gkDab")}
      ${gkPanel(x, y, w, h, p.flesh[0], K.dabs(-30, -30, w + 60, h + 60, p.flesh, 120, [w * .1, w * .34], [.16, .4]), "50%", "gkDab")}
      ${K.dabs(x + w * .12, ey - h * .07, w * .3, h * .1, [p.flesh[3]], 3, [w * .2, w * .3], [.18, .28])}${K.dabs(x + w * .58, ey - h * .07, w * .3, h * .1, [p.flesh[3]], 3, [w * .2, w * .3], [.18, .28])}
      ${K.dabs(x + w * .44, y + h * .5, w * .14, h * .2, [p.flesh[3]], 2, [w * .1, w * .14], [.2, .3])}
      ${gkDot(x + w / 2 - ex, ey, Math.max(7, w * .028), p.cool)}${gkDot(x + w / 2 + ex, ey, Math.max(7, w * .028), p.cool)}
      ${gkLip(x + w / 2, y + h * .74, w * .3, p.red)}`;
  };
  const gkFoot = (p, label, color) => `<div class="abs" style="right:96px;bottom:84px;display:flex;align-items:flex-end;gap:26px;color:${color}">
    <span style="font-family:var(--en);font-size:22px;letter-spacing:.26em;text-transform:uppercase">${label}</span>${gkMark(p.red === color ? p.red : (p.sealC || p.red), 58)}</div>`;

  const GK = {
    /* 春 · 手卷：底部一条横向长卷（半透明色块叠成远山），枝条从卷里往上长；清单在「天空」里 */
    spring(c, p) {
      const K = gkKit(p.seed), r = c.fit(430, 70, 36);
      return `<div class="lc gk-paper" style="background:${p.ground};font-family:var(--serif);color:${p.ink}">${GK_FILTERS}
      ${K.patch(-140, -100, 720, 360, p.light[0], .5)}${K.patch(640, -90, 560, 300, p.light[1], .8)}
      ${c.photo}
      <div class="abs" style="left:80px;right:80px;top:996px">${gkLine(920, p.ink, .5)}</div>
      <div class="abs" style="left:80px;right:80px;top:1018px;height:282px;overflow:hidden">
        ${K.patch(-80, 60, 460, 250, p.mid[0], .55)}${K.patch(250, 110, 430, 200, p.mid[1], .5)}${K.patch(560, 40, 420, 270, p.mid[2], .5)}
        ${K.patch(-40, 150, 360, 160, p.light[0], .6)}${K.patch(700, 150, 300, 160, p.light[0], .55)}
        ${K.strokes(0, 30, 920, 250, [p.mid[0], p.mid[1], p.mid[2], p.light[0]], 18, [90, 220], [.22, .45])}
      </div>
      <div class="abs" style="left:80px;right:80px;top:1306px">${gkLine(920, p.ink, .5)}</div>
      <svg class="abs" style="left:0;top:0;filter:url(#gkDry)" width="1080" height="1440" viewBox="0 0 1080 1440" fill="none" stroke="${p.ink}" stroke-linecap="round">
        <path d="M904 1240C896 1150 912 1080 900 1010C890 930 918 860 944 800C962 756 958 716 978 676" stroke-width="11"/>
        <path d="M906 1080C874 1050 850 1036 826 1000" stroke-width="5.5"/>
        <path d="M944 800C966 770 1000 760 1030 732" stroke-width="5"/>
        <path d="M978 676C986 640 1006 620 1012 590M978 676C960 650 944 640 936 612" stroke-width="3.8"/>
        <path d="M150 1260C160 1200 146 1160 164 1110C176 1080 172 1050 186 1026" stroke-width="6" opacity=".85"/>
        <path d="M164 1110C190 1090 208 1080 224 1058" stroke-width="3.4" opacity=".85"/>
      </svg>
      ${gkDot(1012, 584, 8, p.dot)}
      <div class="abs" style="left:120px;right:120px;top:120px">
        <div style="font-family:var(--en);font-size:24px;letter-spacing:.3em;text-transform:uppercase;color:${p.ink2}">Daily Plan · ${p.season} · Handscroll</div>
        <div style="font-size:126px;letter-spacing:.24em;line-height:1.15;margin-top:20px">每日计划</div>
        <div style="display:flex;align-items:baseline;gap:30px;margin-top:8px;color:${p.ink2}"><span style="font-family:var(--en);font-style:italic;font-size:34px">${p.motto}</span><span style="font-size:26px;letter-spacing:.14em">${esc(c.date)} ${c.wcn}</span></div>
      </div>
      <div class="abs" style="left:120px;width:680px;top:500px">
        ${gkLine(680, p.ink, .5)}
        ${gkList(c, r, { mk: (s, n) => gkBox(s, p.ink, p.red, n), box: 44, line: 680, lc: p.ink })}
      </div>
      <div class="abs" style="left:96px;bottom:84px;font-size:24px;letter-spacing:.42em;color:${p.ink2}">春 · 卷一</div>
      ${gkFoot(p, `Guai · ${esc(p.name)}`, p.ink2)}
    </div>`;
    },

    /* 夏 · 立轴：左边一整座高山（层层绿色块 + 皴线 + 苔点，中间一线瀑布），右边窄窄一栏清单 */
    summer(c, p) {
      const K = gkKit(p.seed), R = rng(p.seed + 3), r = c.fit(620, 84, 34);
      const ridge = [[40, 300], [110, 170], [190, 96], [262, 120], [318, 210], [372, 300], [418, 400], [404, 520], [392, 640], [430, 760], [452, 880], [430, 1000], [404, 1120], [420, 1240]];
      const moss = ridge.slice(1, -1).map(([x, y]) => Array.from({ length: 3 }, () => {
        const dx = x - 30 + R() * 50, dy = y - 10 + R() * 30, a = -40 + R() * 80;
        return `<path d="M${dx.toFixed(0)} ${dy.toFixed(0)}l${(9 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(9 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke-width="${(5 + R() * 4).toFixed(1)}"/>`; }).join("")).join("");
      return `<div class="lc gk-paper" style="background:${p.ground};font-family:var(--serif);color:${p.ink}">${GK_FILTERS}
      ${K.patch(380, -120, 800, 420, p.light[1], .8)}
      <svg class="abs" style="left:0;top:0;mix-blend-mode:multiply" width="1080" height="1440" viewBox="0 0 1080 1440">
        <g filter="url(#gkBrush)">
          <path d="M-40 1480L-40 300C30 230 110 120 190 90C250 70 300 140 330 220C360 300 430 340 438 420C450 520 384 600 400 700C416 800 476 860 456 980C436 1100 386 1200 424 1300L440 1480Z" fill="${p.mid[0]}" opacity=".6"/>
          <path d="M-40 1480L-40 620C40 560 90 470 150 420C210 380 260 470 280 560C300 650 350 720 340 840C330 960 300 1060 330 1180L350 1480Z" fill="${p.mid[1]}" opacity=".5"/>
          <path d="M-40 1480L-40 1000C40 960 100 900 170 880C230 870 270 960 260 1060C250 1160 270 1260 300 1480Z" fill="${p.mid[2]}" opacity=".55"/>
          <path d="M60 260C120 200 170 160 210 170C230 260 200 340 150 420C110 380 80 320 60 260Z" fill="${p.light[0]}" opacity=".7"/>
        </g>
      </svg>
      <svg class="abs" style="left:0;top:0" width="1080" height="1440" viewBox="0 0 1080 1440">
        <path d="M214 330C224 520 206 700 232 900C236 960 228 1020 240 1080L262 1080C250 1010 258 950 252 890C232 700 248 520 238 330Z" fill="${p.ground}" opacity=".92" filter="url(#gkRough)"/>
        <g stroke="${p.ink2}" stroke-width="1.4" fill="none" opacity=".45" filter="url(#gkRough)"><path d="M226 400C230 560 222 720 240 880"/><path d="M234 380C238 560 232 740 248 1000"/></g>
        <g fill="${p.light[1]}" opacity=".7" filter="url(#gkBrush)"><ellipse cx="250" cy="1110" rx="90" ry="26"/></g>
      </svg>
      ${c.photo}
      <svg class="abs" style="left:0;top:0;filter:url(#gkDry)" width="1080" height="1440" viewBox="0 0 1080 1440" fill="none" stroke="${p.ink}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M${ridge.map((q) => q.join(" ")).join(" L")}" stroke-width="5" opacity=".75"/>
        <path d="M150 420C190 470 220 520 230 600M330 220C300 300 300 380 320 450M400 700C360 760 350 820 360 900" stroke-width="3" opacity=".55"/>
        <g stroke-width="6" opacity=".85">${moss}</g>
      </svg>
      ${gkDot(398, 516, 7, p.dot)}
      <div class="abs" style="left:520px;right:90px;top:130px">
        <div style="font-family:var(--en);font-size:22px;letter-spacing:.22em;white-space:nowrap;text-transform:uppercase;color:${p.ink2}">${p.season} · Hanging scroll</div>
        <div style="font-size:98px;letter-spacing:.14em;line-height:1.15;margin-top:22px">每日计划</div>
        <div style="font-family:var(--en);font-style:italic;font-size:32px;color:${p.ink2};margin-top:8px">${p.motto}</div>
        <div style="font-size:26px;letter-spacing:.14em;margin-top:22px;color:${p.ink2}">${esc(c.date)} ${c.wcn}</div>
      </div>
      <div class="abs" style="left:520px;right:90px;top:540px">
        ${gkLine(470, p.ink, .5)}
        ${gkList(c, r, { mk: (s, n) => gkBox(s, p.ink, p.red, n), box: 42, gap: 22, ls: ".04em", line: 470, lc: p.ink })}
      </div>
      ${gkFoot(p, `Guai · ${esc(p.name)}`, p.ink2)}
    </div>`;
    },

    /* 秋 · 一枝：一根大枝从右上斜着写进来，挂着几片秋叶；清单每条前面是一片叶子 */
    autumn(c, p) {
      const K = gkKit(p.seed), r = c.fit(540, 80, 38);
      const leafShape = (x, y, s, a, col, op) => `<path transform="translate(${x} ${y}) rotate(${a}) scale(${s})" d="M0 0C10 -26 34 -42 70 -40C66 -6 40 12 0 0Z" fill="${col}" opacity="${op}"/>`;
      const leaves = [[700, 250, 1.3, -20, p.mid[0]], [610, 300, 1, 40, p.light[0]], [860, 160, 1.15, -60, p.mid[2]], [520, 380, .9, 110, p.mid[0]], [430, 440, 1.2, 10, p.light[0]], [960, 120, .8, 80, p.mid[0]], [340, 520, .9, 150, p.mid[2]], [760, 330, .85, 160, p.light[0]]];
      return `<div class="lc gk-paper" style="background:${p.ground};font-family:var(--serif);color:${p.ink}">${GK_FILTERS}
      ${K.patch(380, -120, 820, 560, p.light[1], .85)}${K.patch(-160, 1180, 700, 360, p.mid[1], .45)}${K.patch(640, 1260, 560, 260, p.light[0], .35)}
      ${c.photo}
      <svg class="abs" style="left:0;top:0;mix-blend-mode:multiply" width="1080" height="1440" viewBox="0 0 1080 1440"><g filter="url(#gkBrush)">${leaves.map(([x, y, s, a, col]) => leafShape(x, y, s * 1.5, a, col, .78)).join("")}</g></svg>
      <svg class="abs" style="left:0;top:0;filter:url(#gkDry)" width="1080" height="1440" viewBox="0 0 1080 1440" fill="none" stroke="${p.ink}" stroke-linecap="round">
        <path d="M1110 40C1000 90 930 150 850 200C760 256 690 290 600 350C520 404 440 450 330 560" stroke-width="22"/>
        <path d="M600 350C520 404 440 450 330 560C300 590 280 600 250 624" stroke-width="12"/>
        <path d="M850 200C860 150 900 120 920 80" stroke-width="9"/>
        <path d="M690 290C720 250 750 236 790 226" stroke-width="7"/>
        <path d="M470 430C480 480 470 520 490 560" stroke-width="6"/>
        <path d="M920 80C940 60 960 54 990 50M790 226C810 210 830 206 850 196" stroke-width="4"/>
      </svg>
      <svg class="abs" style="left:0;top:0;mix-blend-mode:multiply" width="1080" height="1440" viewBox="0 0 1080 1440"><g filter="url(#gkBrush)">${leafShape(880, 1210, 1, 200, p.mid[0], .55)}${leafShape(960, 1150, .7, 260, p.mid[2], .5)}</g></svg>
      <div class="abs" style="left:100px;top:110px">
        <div style="font-family:var(--en);font-size:22px;letter-spacing:.3em;text-transform:uppercase;color:${p.ink2}">${p.season} · One branch</div>
        <div style="font-size:104px;letter-spacing:.18em;line-height:1.15;margin-top:18px">每日计划</div>
        <div style="font-family:var(--en);font-style:italic;font-size:32px;color:${p.ink2};margin-top:6px">${p.motto}</div>
      </div>
      <div class="abs" style="left:110px;right:110px;top:690px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding-bottom:12px;color:${p.ink2}"><span style="font-size:36px;letter-spacing:.3em;color:${p.ink}">一枝一事</span><span style="font-size:26px;letter-spacing:.14em">${esc(c.date)} ${c.wcn}</span></div>
        ${gkLine(860, p.ink, .5)}
        ${gkList(c, r, { mk: (s, n) => gkLeaf(s, p, n), box: 50, line: 860, lc: p.ink })}
      </div>
      ${gkFoot(p, `Guai · ${esc(p.name)}`, p.ink2)}
    </div>`;
    },

    /* 冬 · 寒枝：几乎全白，一根细枯枝 + 一颗红果；标题竖排靠右，清单稀疏、小字、很透气 */
    winter(c, p) {
      const K = gkKit(p.seed), r = c.fit(520, 88, 32);
      return `<div class="lc gk-paper" style="background:${p.light[1]};font-family:var(--serif);color:${p.ink}">${GK_FILTERS}
      ${K.patch(-200, 1240, 820, 300, p.mid[0], .22)}${K.patch(500, 1300, 760, 240, p.mid[2], .2)}${K.patch(700, -160, 600, 380, p.light[0], .4)}
      ${c.photo}
      <svg class="abs" style="left:0;top:0;filter:url(#gkDry)" width="1080" height="1440" viewBox="0 0 1080 1440" fill="none" stroke="${p.ink}" stroke-linecap="round">
        <path d="M-20 520C80 500 170 470 260 440C360 408 450 380 540 340C600 314 650 300 700 296" stroke-width="7"/>
        <path d="M260 440C280 400 300 380 300 340M300 340C310 320 330 306 344 290" stroke-width="4"/>
        <path d="M430 392C460 420 490 440 520 452" stroke-width="3.4"/>
        <path d="M540 340C560 300 590 280 600 250" stroke-width="3.6"/>
        <path d="M700 296C730 290 750 280 776 268M700 296C716 312 724 326 744 334" stroke-width="2.6"/>
        <path d="M120 494C116 470 120 450 110 430" stroke-width="3"/>
      </svg>
      ${gkDot(612, 262, 12, p.red)}${gkDot(632, 280, 7, p.red)}
      <div class="abs" style="left:110px;top:130px;font-size:24px;letter-spacing:.2em;color:${p.ink2}">冬 · ${esc(c.date)} ${c.wcn}</div>
      <div class="abs" style="right:112px;top:150px;display:flex;gap:30px;writing-mode:vertical-rl">
        <div style="font-size:80px;letter-spacing:.5em;line-height:1">每日计划</div>
        <div style="font-family:var(--en);font-style:italic;font-size:28px;color:${p.ink2};letter-spacing:.06em">${p.motto}</div>
      </div>
      <div class="abs" style="left:150px;width:600px;top:740px;color:${p.ink}">
        ${gkList(c, r, { mk: (s, n) => gkRing(s, p, n), box: 34, gap: 30, ls: ".12em", style: "font-weight:300;", line: 600, lc: p.ink2 })}
      </div>
      ${gkFoot(p, `Guai · ${esc(p.name)}`, p.ink2)}
    </div>`;
    },

    /* 本真 · 素底：一张正面的肖像——头发、脸、两点冷色的眼、一笔唇红；清单写在「肩膀」那块画布上 */
    plain(c, p) {
      const K = gkKit(p.seed), r = c.fit(390, 64, 34);
      return `<div class="lc gk-paper" style="background:${p.ground};font-family:var(--serif);color:${p.ink}">${GK_FILTERS}
      ${K.dabs(0, 0, 1080, 1440, p.bg, 90, [90, 240], [.1, .26])}
      ${c.photo}
      ${gkFace(K, p, 360, 236, 360, 470)}
      ${gkPanel(110, 790, 860, 560, p.panel, K.dabs(-30, -30, 920, 620, p.flesh, 70, [60, 180], [.05, .14]), "420px 420px 26px 26px / 230px 230px 26px 26px")}
      <div class="abs" style="left:0;right:0;top:80px;text-align:center;font-family:var(--en);font-size:22px;letter-spacing:.36em;text-transform:uppercase;opacity:.75">Authenticity · Portrait</div>
      <div class="abs" style="left:150px;top:200px;writing-mode:vertical-rl;font-size:72px;letter-spacing:.34em;line-height:1">每日计划</div>
      <div class="abs" style="right:150px;top:206px;writing-mode:vertical-rl;display:flex;gap:18px">
        <span style="font-size:28px;letter-spacing:.3em">${gkDate(c)} ${c.wcn}</span>
        <span style="font-family:var(--en);font-style:italic;font-size:24px;opacity:.75">${p.motto}</span></div>
      <div class="abs" style="left:230px;right:230px;top:928px">
        ${gkList(c, r, { mk: (s, n) => gkBox(s, p.ink, p.red, n), box: 42 })}
      </div>
      <div class="abs" style="right:96px;bottom:40px">${gkMark(p.sealC, 54)}</div>
    </div>`;
    },

    /* 本真 · 赭红：整片赭红底；上面横切一条「眼睛」的特写，下面是清单，最底一小块「嘴唇」 */
    ochre(c, p) {
      const K = gkKit(p.seed), r = c.fit(470, 76, 36), cream = p.head;
      const eye = (x) => `<g transform="translate(${x} 470)"><g filter="url(#gkDab)">
        <path d="M-130 -64C-80 -92 40 -96 128 -60" fill="none" stroke="${p.hair[0]}" stroke-width="18" stroke-linecap="round" opacity=".7"/>
        <ellipse cx="0" cy="-6" rx="150" ry="62" fill="${p.flesh[3]}" opacity=".35"/></g><g filter="url(#gkRough)">
        <path d="M-120 10C-70 -46 70 -50 124 6C70 50 -70 54 -120 10Z" fill="${p.panel}" opacity=".85"/>
        <circle r="40" cx="4" cy="4" fill="${p.cool}"/><circle r="17" cx="4" cy="4" fill="${p.hair[0]}"/><circle r="6" cx="-8" cy="-8" fill="${p.panel}"/>
        <path d="M-124 10C-70 -48 70 -52 128 4" fill="none" stroke="${p.hair[0]}" stroke-width="7" stroke-linecap="round"/>
        <path d="M-110 18C-60 46 60 48 112 16" fill="none" stroke="${p.flesh[3]}" stroke-width="3" stroke-linecap="round" opacity=".7"/></g></g>`;
      return `<div class="lc gk-paper" style="background:${p.ground};font-family:var(--serif);color:${cream}">${GK_FILTERS}
      ${K.dabs(0, 0, 1080, 1440, p.bg, 110, [90, 260], [.14, .32])}
      ${c.photo}
      <div class="abs" style="left:0;right:0;top:90px;text-align:center">
        <div style="font-family:var(--en);font-size:22px;letter-spacing:.36em;text-transform:uppercase;opacity:.8">Authenticity · Look</div>
        <div style="font-size:118px;letter-spacing:.22em;padding-left:.22em;line-height:1.2;margin-top:16px">每日计划</div>
      </div>
      ${gkPanel(-20, 340, 1120, 260, p.flesh[0], K.dabs(-40, -30, 1200, 330, p.flesh, 120, [50, 160], [.16, .38]))}
      <svg class="abs" style="left:0;top:0;overflow:visible" width="1080" height="1440" viewBox="0 0 1080 1440">${eye(330)}${eye(750)}</svg>
      <div class="abs" style="left:0;right:0;top:640px;text-align:center;font-size:28px;letter-spacing:.16em;opacity:.9">${esc(c.date)} ${c.wcn}<span style="font-family:var(--en);font-style:italic;letter-spacing:.02em;margin-left:28px">${p.motto}</span></div>
      <div class="abs" style="left:170px;right:170px;top:730px">
        ${gkLine(740, cream, .55)}
        ${gkList(c, r, { mk: (s, n) => gkBox(s, cream, "#f2b48a", n), box: 44, line: 740, lc: cream })}
      </div>
      ${gkPanel(410, 1262, 260, 96, p.flesh[0], K.dabs(-20, -20, 300, 140, p.flesh, 20, [30, 90], [.18, .4]))}
      ${gkLip(540, 1306, 190, p.red)}
      <div class="abs" style="right:96px;bottom:84px">${gkMark(p.sealC, 54)}</div>
      <div class="abs" style="left:96px;bottom:92px;font-family:var(--en);font-size:22px;letter-spacing:.26em;text-transform:uppercase;opacity:.75">Guai · 赭红</div>
    </div>`;
    },

    /* 本真 · 橄榄：两联画挂在橄榄色墙上——左联是窄长的一张脸 + 竖排标题，右联是清单 */
    olive(c, p) {
      const K = gkKit(p.seed), r = c.fit(780, 100, 36);
      return `<div class="lc gk-paper" style="background:${p.ground};font-family:var(--serif);color:${p.ink}">${GK_FILTERS}
      ${K.dabs(0, 0, 1080, 1440, p.bg, 100, [90, 240], [.14, .3])}
      ${c.photo}
      <div class="abs" style="left:0;right:0;top:92px;text-align:center;font-family:var(--en);font-size:22px;letter-spacing:.36em;text-transform:uppercase;color:${p.head};opacity:.8">Authenticity · Diptych · I / II</div>
      ${gkPanel(90, 200, 350, 1120, p.panel, `
        ${K.dabs(-20, 560, 390, 560, p.flesh, 40, [60, 160], [.05, .14])}`)}
      ${gkFace(K, p, 155, 300, 220, 400)}
      <div class="abs" style="left:186px;top:820px;writing-mode:vertical-rl;font-size:96px;letter-spacing:.22em;line-height:1">每日计划</div>
      ${gkPanel(480, 200, 510, 1120, p.panel, K.dabs(-20, -20, 550, 1160, p.flesh, 60, [60, 180], [.04, .11]))}
      <div class="abs" style="left:530px;right:130px;top:262px">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:40px;letter-spacing:.3em">今日</span><span style="font-size:26px;letter-spacing:.14em;opacity:.75">${gkDate(c)} ${c.wcn}</span></div>
        <div style="font-family:var(--en);font-style:italic;font-size:28px;opacity:.7;margin:8px 0 18px">${p.motto}</div>
        ${gkLine(420, p.ink, .5)}
        ${gkList(c, r, { mk: (s, n) => gkBox(s, p.ink, p.red, n), box: 42, gap: 22, ls: ".04em", line: 420, lc: p.ink })}
      </div>
      <div class="abs" style="left:0;right:0;bottom:46px;display:flex;justify-content:center">${gkMark(p.sealC, 52)}</div>
    </div>`;
    },
  };
  LAYOUTS.guai = (c, p) => (GK[p.v] || GK.spring)(c, p);
