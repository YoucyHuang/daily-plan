"""把 src/template.html 生成成：
    index.html     免费总版「每日计划 · Y世界」：全部主题 + 游戏系统；经典款和怪朋友免费，其余用星星或星星密钥解锁
    studio/        主理人总控台：全部主题直接可用，要主理人的码
    p/<款>/        以前的单款网址，现在自动跳到总版并打开对应主题（买过的密钥照样能解锁）

    python build.py              生成到仓库里
    python build.py --preview D  生成一份不带钥匙锁的本地预览到目录 D（只用来截图，不要上传）

改功能 / 修 bug 只改 src/template.html，再跑一次这个脚本。
"""
import html, json, os, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
VERSION = 13   # 改了代码就加 1，手机上装好的版本会自动换新
SITE = "https://youcyhuang.github.io/daily-plan/"   # 搬到国内平台后改成新网址
PRODUCTS = json.load(open(os.path.join(ROOT, "products.json"), encoding="utf-8"))
TPL = open(os.path.join(ROOT, "src", "template.html"), encoding="utf-8").read()
STUDIO = next(p for p in PRODUCTS if p["slug"] == "studio")
SHOP = [p for p in PRODUCTS if p["slug"] != "studio"]
ALL = ["forest", "ocean", "morandi", "paper", "night", "lwf", "y2k", "bauhaus", "songyuan", "business", "autumn", "comic", "guai"]
FREE = ["forest", "ocean", "morandi", "paper", "night", "lwf"]

APP = {
    "slug": "app", "name": "每日计划 · Y世界", "short": "Y世界计划",
    "tagline": "像做游戏一样过每一天：打勾得星星、攒连胜、做任务、收集徽章，一键生成小红书卡片。",
    "themes": ALL, "free": True, "freeThemes": FREE, "cost": 500, "defaultTheme": "lwf",
    # 卖出去的星星密钥：输入后直接解锁对应主题
    "codes": {p["slug"]: p.get("hashes", [p["hash"]]) for p in SHOP},
    "themeOf": {p["slug"]: p["themes"] for p in SHOP},
    "samples": {t: p["sample"] for p in SHOP if p.get("sample") for t in p["themes"]},
}
APP["samples"]["guai"] = ["晨起看一会儿窗外的树", "画十分钟速写", "读几页书", "出门走走 · 捡一片叶子", "安静地吃一顿饭", "睡前写一句话给自己"]


def page(prod, up, preview, path, img):
    s = TPL.replace("__MASTER_HASH__", STUDIO["hash"])
    if prod["slug"] != "studio":
        s = s.replace("<!--PRODUCT-->", "<script>window.PRODUCT=" + json.dumps(prod, ensure_ascii=False) + "</script>")
    for a, b in (('href="icon-192.png"', f'href="{up}icon-192.png"'), ('href="apple-touch-icon.png"', f'href="{up}apple-touch-icon.png"'),
                 ('src="html-to-image.js"', f'src="{up}html-to-image.js"'), ('href="fonts/fonts.css"', f'href="{up}fonts/fonts.css"')):
        s = s.replace(a, b)
    s = s.replace('content="每日计划">', f'content="{html.escape(prod["short"])}">', 1)
    meta = "\n".join([
        f'<title>{html.escape(prod["name"])}</title>',
        f'<meta name="description" content="{html.escape(prod["tagline"])}">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:title" content="{html.escape(prod["name"])}">',
        f'<meta property="og:description" content="{html.escape(prod["tagline"])}">',
        f'<meta property="og:url" content="{SITE}{path}">',
        f'<meta property="og:image" content="{SITE}{img}">',
        '<meta name="twitter:card" content="summary_large_image">',
    ])
    s = s.replace("<title>每日计划</title>", meta, 1)
    if preview:
        s = s.replace("(function lock() {", "(function lock() { return;", 1)
    return s


def manifest(prod, up):
    return {
        "name": prod["name"], "short_name": prod["short"], "description": prod["tagline"],
        "id": "./", "start_url": "./index.html#today", "scope": "./", "display": "standalone", "orientation": "portrait",
        "background_color": "#c8d5f4", "theme_color": "#c8d5f4",
        "icons": [{"src": f"{up}icon-192.png", "sizes": "192x192", "type": "image/png"},
                  {"src": f"{up}icon-512.png", "sizes": "512x512", "type": "image/png"}],
        "shortcuts": [{"name": "今日清单", "url": "./index.html#today"}, {"name": "全部清单", "url": "./index.html#archive"},
                      {"name": "制作卡片", "url": "./index.html#studio"}],
    }


def worker(slug, up):
    assets = ["./", "./index.html", "./manifest.json", f"{up}html-to-image.js", f"{up}fonts/fonts.css", f"{up}icon-192.png", f"{up}icon-512.png"]
    return f"""/* 每日计划 · 离线缓存（build.py 生成） */
const CACHE = "daily-plan-{slug}-v{VERSION}";
const ASSETS = {json.dumps(assets)};
self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys()
  .then((ks) => Promise.all(ks.filter((k) => /^daily-plan-/.test(k) && k !== CACHE && (k.startsWith("daily-plan-{slug}-") || /^daily-plan-v\\d+$/.test(k))).map((k) => caches.delete(k))))
  .then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {{
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;
  if (e.request.mode === "navigate") {{
    e.respondWith(fetch(e.request).then((r) => {{ const c = r.clone(); caches.open(CACHE).then((x) => x.put("./index.html", c)); return r; }})
      .catch(() => caches.match("./index.html")));
    return;
  }}
  /* 字体分片用到一片存一片，下次断网也能显示 */
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => {{
    if (r.ok && e.request.url.includes("/fonts/files/")) {{ const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); }}
    return r;
  }})));
}});
"""


def redirect(prod):
    """旧的单款网址：跳到总版并打开这一款的主题"""
    t = prod["themes"][0]
    target = "../../" + ("" if prod["slug"] == "classic" else f"?theme={t}") + "#today"
    return f"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(prod['name'])}</title>
<meta http-equiv="refresh" content="0;url={target}">
<script>
  /* 以前装过的单款离线缓存先注销，再跳到总版 */
  if ("serviceWorker" in navigator) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => {{ if (r.scope.includes("/p/")) r.unregister(); }}));
  location.replace("{target}");
</script></head><body><p>正在前往 <a href="{target}">每日计划 · Y世界</a>…</p></body></html>
"""


RETIRE_SW = """/* 单款版已经合并到总版：这个旧缓存只负责注销自己 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.registration.unregister()));
"""


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8", newline="\n").write(text)


def build(out, preview=False):
    # 免费总版放在根目录
    write(os.path.join(out, "index.html"), page(APP, "", preview, "", "previews/weird.jpg"))
    json.dump(manifest(APP, ""), open(os.path.join(out, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    write(os.path.join(out, "service-worker.js"), worker("app", ""))
    # 主理人总控台
    write(os.path.join(out, "studio", "index.html"), page(STUDIO, "../", preview, "studio/", "previews/songhua.jpg"))
    json.dump(manifest(STUDIO, "../"), open(os.path.join(out, "studio", "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    write(os.path.join(out, "studio", "service-worker.js"), worker("studio", "../"))
    # 旧的单款网址 → 跳转
    for prod in SHOP:
        d = os.path.join(out, "p", prod["slug"])
        write(os.path.join(d, "index.html"), redirect(prod))
        write(os.path.join(d, "service-worker.js"), RETIRE_SW)
        if os.path.exists(os.path.join(d, "manifest.json")):
            os.remove(os.path.join(d, "manifest.json"))
    if out != ROOT:
        for f in ("html-to-image.js", "icon-192.png", "icon-512.png", "apple-touch-icon.png"):
            shutil.copy(os.path.join(ROOT, f), os.path.join(out, f))
        for d in ("fonts", "previews"):
            shutil.copytree(os.path.join(ROOT, d), os.path.join(out, d), dirs_exist_ok=True)
    print("built →", out)


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--preview":
        build(os.path.abspath(sys.argv[2]), preview=True)
    else:
        build(ROOT)
