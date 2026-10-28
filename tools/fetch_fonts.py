"""把 Google Fonts 下载到本站 fonts/ 里（国内打不开 Google）。

保留 Google 的 unicode-range 分片：页面上出现哪些字，浏览器才下载对应的那几片，
所以中文字体虽然整套放在站里，用户实际只下载几百 KB。

    python tools/fetch_fonts.py
"""
import hashlib, os, re, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "fonts")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
FAMILIES = [
    "Noto+Serif+SC:wght@300;400;600",
    "Noto+Sans+SC:wght@400;700;900",
    "Ma+Shan+Zheng", "ZCOOL+XiaoWei",
    "Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400",
    "EB+Garamond:ital,wght@0,400;1,400",
    "Gochi+Hand", "Rubik+Mono+One", "VT323", "Jost:wght@500;700", "Bangers",
]


def get(url, tries=6):
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()
        except Exception:
            if i == tries - 1:
                raise
            time.sleep(2 + i * 2)


def main():
    os.makedirs(os.path.join(OUT, "files"), exist_ok=True)
    css_all = []
    for fam in FAMILIES:
        css = get(f"https://fonts.googleapis.com/css2?family={fam}&display=swap").decode()
        def repl(m):
            url = m.group(1)
            name = hashlib.sha1(url.encode()).hexdigest()[:16] + ".woff2"
            path = os.path.join(OUT, "files", name)
            if not os.path.exists(path):
                open(path, "wb").write(get(url))
            return f"url(files/{name})"
        css_all.append(re.sub(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", repl, css))
        print("ok", fam)
    open(os.path.join(OUT, "fonts.css"), "w", encoding="utf-8").write("\n".join(css_all))


if __name__ == "__main__":
    main()
