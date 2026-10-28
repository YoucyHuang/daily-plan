/* 旧版（整站一个 App）的缓存：现在首页是目录页，各款在 p/<款>/ 里有自己的缓存。
   这个文件只负责把旧版注销、清掉旧缓存。 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => /^daily-plan-v\d+$/.test(k)).map((k) => caches.delete(k))))
    .then(() => self.registration.unregister())
));
