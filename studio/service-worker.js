/* 每日计划 · 离线缓存（build.py 生成） */
const CACHE = "daily-plan-studio-v22";
const ASSETS = ["./", "./index.html", "./manifest.json", "../html-to-image.js", "../fonts/fonts.css", "../icon-192.png", "../icon-512.png"];
self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys()
  .then((ks) => Promise.all(ks.filter((k) => /^daily-plan-/.test(k) && k !== CACHE && (k.startsWith("daily-plan-studio-") || /^daily-plan-v\d+$/.test(k))).map((k) => caches.delete(k))))
  .then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;
  if (e.request.mode === "navigate") {
    /* no-cache：每次都向服务器确认有没有新版，不吃浏览器 10 分钟的 HTTP 缓存 */
    e.respondWith(fetch(e.request, { cache: "no-cache" }).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put("./index.html", c)); return r; })
      .catch(() => caches.match("./index.html")));
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
  const [h, m] = String(s.time || "20:00").split(":").map(Number);
  if (s.last === today || now.getHours() * 60 + now.getMinutes() < h * 60 + m) return;
  const n = s.day === today ? s.pending : null;
  if (n === 0) return;
  const title = n === null ? "今天的清单还没写哦" : `还有 ${n} 件待办`;
  const body = s.streak ? `连胜 ${s.streak} 天了，别断在今天哦` : "小Y在等你回来打勾 ✦";
  await self.registration.showNotification(title, { body, icon: "../icon-192.png", badge: "../icon-192.png", tag: "remind" });
  s.last = today;
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
