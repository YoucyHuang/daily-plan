"""把 src/template.html 生成成 8 款独立产品 + 主理人总控台 + 首页目录。

    python build.py              生成到仓库里（p/<款>/、studio/、index.html）
    python build.py --preview D  生成一份不带访问码锁的本地预览到目录 D（只用来截图，不要上传）

改主题 / 修 bug 只改 src/template.html，再跑一次这个脚本，8 款一起更新。
"""
import html, json, os, shutil, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
VERSION = 6   # 改了代码就加 1，手机上装好的版本会自动换新
PRODUCTS = json.load(open(os.path.join(ROOT, "products.json"), encoding="utf-8"))
TPL = open(os.path.join(ROOT, "src", "template.html"), encoding="utf-8").read()
STUDIO = next(p for p in PRODUCTS if p["slug"] == "studio")


def page(prod, up, preview):
    s = TPL.replace("__MASTER_HASH__", STUDIO["hash"])
    if prod["slug"] != "studio":
        cfg = {k: prod[k] for k in ("slug", "name", "themes", "hash")}
        s = s.replace("<!--PRODUCT-->", "<script>window.PRODUCT=" + json.dumps(cfg, ensure_ascii=False) + "</script>")
    s = s.replace('href="icon-192.png"', f'href="{up}icon-192.png"')
    s = s.replace('href="apple-touch-icon.png"', f'href="{up}apple-touch-icon.png"')
    s = s.replace('src="html-to-image.js"', f'src="{up}html-to-image.js"')
    s = s.replace('content="每日计划">', f'content="{html.escape(prod["short"])}">', 1)
    if preview:
        s = s.replace("(function lock() {", "(function lock() { return;", 1)
    return s


def manifest(prod, up):
    return {
        "name": prod["name"], "short_name": prod["short"], "description": prod["tagline"],
        "id": "./", "start_url": "./index.html#today", "scope": "./", "display": "standalone", "orientation": "portrait",
        "background_color": "#f3eee5", "theme_color": "#f3eee5",
        "icons": [{"src": f"{up}icon-192.png", "sizes": "192x192", "type": "image/png"},
                  {"src": f"{up}icon-512.png", "sizes": "512x512", "type": "image/png"}],
        "shortcuts": [{"name": "今日清单", "url": "./index.html#today"}, {"name": "全部清单", "url": "./index.html#archive"},
                      {"name": "制作卡片", "url": "./index.html#studio"}],
    }


def worker(prod, up):
    assets = ["./", "./index.html", "./manifest.json", f"{up}html-to-image.js", f"{up}icon-192.png", f"{up}icon-512.png"]
    return f"""/* {prod['name']} · 离线缓存（build.py 生成） */
const CACHE = "daily-plan-{prod['slug']}-v{VERSION}";
const ASSETS = {json.dumps(assets)};
self.addEventListener("install", (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys()
  .then((ks) => Promise.all(ks.filter((k) => k.startsWith("daily-plan-{prod['slug']}-") && k !== CACHE).map((k) => caches.delete(k))))
  .then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {{
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;
  if (e.request.mode === "navigate") {{
    e.respondWith(fetch(e.request).then((r) => {{ const c = r.clone(); caches.open(CACHE).then((x) => x.put("./index.html", c)); return r; }})
      .catch(() => caches.match("./index.html")));
    return;
  }}
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
}});
"""


def catalog():
    cards = "".join(f"""
    <a class="card" href="p/{p['slug']}/">
      <img src="previews/{p['slug']}.jpg" alt="{html.escape(p['name'])}" loading="lazy">
      <div class="meta"><span class="no">{i:02d}</span><b>{html.escape(p['name'].replace('每日计划 · ', ''))}</b><span>{html.escape(p['tagline'])}</span></div>
    </a>""" for i, p in enumerate([p for p in PRODUCTS if p["slug"] != "studio"], 1))
    return f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>每日计划 · 全部款式</title>
<link rel="icon" type="image/png" href="icon-192.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&family=EB+Garamond:ital@0;1&display=swap">
<style>
:root{{--bg:#faf9f5;--ink:#191817;--ink2:#5e5a55;--ink3:#9a958e;--rule:#e5e1db}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#131211;--ink:#eeeae4;--ink2:#aba59c;--ink3:#77726b;--rule:#2c2a27}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font-family:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;line-height:1.7}}
.wrap{{max-width:1240px;margin:0 auto;padding:56px clamp(16px,4vw,48px) 64px}}
.cap{{font-family:"EB Garamond",serif;font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink3)}}
h1{{font-family:"Noto Serif SC",serif;font-weight:600;font-size:clamp(32px,5vw,56px);letter-spacing:.08em;margin:10px 0 8px}}
.lead{{color:var(--ink2);max-width:36em;margin:0 0 40px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));gap:36px 24px;border-top:1px solid var(--ink);padding-top:32px}}
.card{{color:inherit;text-decoration:none;display:block}}
.card img{{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;box-shadow:0 0 0 1px var(--rule)}}
.meta{{display:grid;grid-template-columns:auto 1fr;gap:0 12px;padding-top:12px}}
.meta .no{{font-family:"EB Garamond",serif;color:var(--ink3);grid-row:span 2}}
.meta b{{font-family:"Noto Serif SC",serif;font-size:17px;letter-spacing:.06em}}
.meta span:last-child{{color:var(--ink2);font-size:13px}}
.card:hover b{{text-decoration:underline;text-underline-offset:4px}}
footer{{border-top:1px solid var(--rule);margin-top:56px;padding-top:20px;font-size:12.5px;color:var(--ink3)}}
</style></head><body><main class="wrap">
<div class="cap">Daily Plan · 8 Editions</div>
<h1>每日计划</h1>
<p class="lead">手机全屏打勾的每日清单，一键生成 1080×1440 小红书卡片，所有日子围成一个卷筒慢慢转。共 8 款，各自独立，打开需要购买后收到的访问码。</p>
<div class="grid">{cards}
</div>
<footer>© 黄鈺茜 Youcy Huang · 数据只存在你自己的设备上</footer>
</main></body></html>
"""


def build(out, preview=False):
    for prod in PRODUCTS:
        sub = "studio" if prod["slug"] == "studio" else os.path.join("p", prod["slug"])
        up = "../" if prod["slug"] == "studio" else "../../"
        d = os.path.join(out, sub)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w", encoding="utf-8", newline="\n").write(page(prod, up, preview))
        json.dump(manifest(prod, up), open(os.path.join(d, "manifest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        open(os.path.join(d, "service-worker.js"), "w", encoding="utf-8", newline="\n").write(worker(prod, up))
    open(os.path.join(out, "index.html"), "w", encoding="utf-8", newline="\n").write(catalog())
    if out != ROOT:
        for f in ("html-to-image.js", "icon-192.png", "icon-512.png", "apple-touch-icon.png"):
            shutil.copy(os.path.join(ROOT, f), os.path.join(out, f))
    print("built →", out)


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--preview":
        build(os.path.abspath(sys.argv[2]), preview=True)
    else:
        build(ROOT)
