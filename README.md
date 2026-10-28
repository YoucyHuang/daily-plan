# 每日计划 · Daily Plan

手机全屏打勾的每日清单 + 生成小红书 3:4 卡片（1080×1440）+ 全部清单卷筒回看。共 8 款独立产品，打开需要访问码。

| 款 | 网址 |
|---|---|
| 经典（5 个经典配色） | `p/classic/` |
| Little Weird Friends | `p/weird/` |
| Y2K 千禧 | `p/y2k/` |
| 包豪斯 | `p/bauhaus/` |
| 宋人花鸟 | `p/songhua/` |
| 机芯 | `p/calibre/` |
| 涟漪 | `p/ripple/` |
| 波普网点 | `p/pop/` |
| 主理人总控台（全部主题） | `studio/` |

首页目录：https://youcyhuang.github.io/daily-plan/

## 怎么改
只改 `src/template.html`，然后运行 `python build.py`，8 款和总控台一起重新生成。
`products.json` 里是每款的名字、主题和访问码的 SHA-256 摘要（访问码本身不在仓库里）。

数据只存在用户自己的浏览器里（localStorage），不上传。
