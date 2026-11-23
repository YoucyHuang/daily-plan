/* 每日计划 · 离线缓存（build.py 生成） */
const CACHE = "daily-plan-app-v34";
const ASSETS = ["./", "./index.html", "./manifest.json", "html-to-image.js", "fonts/fonts.css", "icon-192.png", "icon-512.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys()
  .then((ks) => Promise.all(ks.filter((k) => /^daily-plan-/.test(k) && k !== CACHE && (k.startsWith("daily-plan-app-") || /^daily-plan-v\d+$/.test(k))).map((k) => caches.delete(k))))
  .then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;
  if (e.request.mode === "navigate") {
    /* 防卡：每次都向服务器要新版（no-cache），但最多等 3 秒。
       国内访问 github.io 常常不是断开而是一直转圈：3 秒没回来，就先用手机里存的那份打开，
       新版在后台继续下载、存好，下次打开就是新的。手机里还没存过（第一次打开）就只能等网络。 */
    const net = fetch(e.request, { cache: "no-cache" }).then((r) => {
      if (r.ok) { const c = r.clone(); return caches.open(CACHE).then((x) => x.put("./index.html", c)).then(() => r, () => r); }
      return r;
    });
    e.waitUntil(net.catch(() => {}));
    e.respondWith(caches.match("./index.html").then((saved) => {
      if (!saved) return net;
      const late = new Promise((res) => setTimeout(() => res(saved), 3000));
      return Promise.race([net.catch(() => saved), late]);
    }));
    return;
  }
  /* 字体分片、主题图片用到一个存一个，下次断网也能显示 */
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => {
    if (r.ok && /\/(fonts\/files|assets)\//.test(e.request.url)) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); }
    return r;
  })));
});

const p2 = (n) => String(n).padStart(2, "0");
async function remindCheck() {
  const c = await caches.open("daily-plan-remind"), r = await c.match("./__remind.json");
  if (!r) return;
  const s = await r.json();
  if (!s.on) return;
  const now = new Date(), today = `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}`;
  // 每天可以有几个提醒时间（默认 12:00 和 20:00）：找今天已经过了的最晚那个，提醒过就不再提醒
  const mins = now.getHours() * 60 + now.getMinutes();
  const passed = (s.times || [s.time || "20:00"]).filter((t) => { const [h, m] = String(t).split(":").map(Number); return h * 60 + m <= mins; }).sort();
  if (!passed.length) return;
  const slot = today + "@" + passed[passed.length - 1];
  if (String(s.last || "") >= slot) return;
  const n = s.day === today ? s.pending : null;
  if (n === 0) return;
  const title = n === null ? "今天的清单还没写哦" : `还有 ${n} 件待办`;
  const body = s.streak ? `连胜 ${s.streak} 天了，别断在今天哦` : "小Y在等你回来打勾 ✦";
  await self.registration.showNotification(title, { body, icon: "icon-192.png", badge: "icon-192.png", tag: "remind" });
  s.last = slot;
  await c.put("./__remind.json", new Response(JSON.stringify(s), { headers: { "content-type": "application/json" } }));
}
self.addEventListener("periodicsync", (e) => { if (e.tag === "remind") e.waitUntil(remindCheck()); });
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ws) => {
    const w = ws.find((x) => "focus" in x);
    return w ? w.focus() : self.clients.openWindow("./index.html#today");
  }));
});
