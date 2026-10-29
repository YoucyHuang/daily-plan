/* 单款版已经合并到总版：这个旧缓存只负责注销自己 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.registration.unregister()));
