# 海康机器人读码器知识中心

一个面向固定式读码器、手持巴枪（IDH 系列）与 PDA（IDP 系列）的静态知识库。视觉走海康工业科技风，支持全文检索、栏目树、文章目录、上下篇与相关推荐，可直接部署到 GitHub Pages。

**在线访问**：<https://chenze3303.github.io/hikrobot-knowledge/>

> 本项目是示例知识库，不是海康机器人官方站点。产品参数、软件版本与操作步骤请以官方手册和最新固件为准。

## 功能

- **首页**：产品主视觉、7 个栏目入口、最近更新与高频问题
- **栏目页**：栏目说明、关键词、栏目内筛选、文档列表
- **文章页**：Markdown 正文与图片、自动目录、阅读进度、代码复制、一键导出 PDF、反馈、上下篇、相关文档
- **全局搜索**：标题/标签/摘要/正文全文检索，支持 `⌘K`、`/`、方向键与回车
- **响应式**：桌面侧边栏常驻，移动端抽屉式目录
- **部署**：Vite 构建，`base: './'` + Hash 路由，适配 GitHub Pages 子路径

## 本地运行

```bash
npm install
npm run dev
```

默认打开 `http://localhost:5173`。

构建预览：

```bash
npm run build
npm run preview
```

## 目录结构

```text
src/
  content/                # Markdown 正文（按栏目分文件夹）
    selection/
    applications/
    installation/
    software/
    integration/
    troubleshooting/
    maintenance/
  data/
    categories.js         # 栏目、分组、图标、关键词
    knowledge.js          # 读取 Markdown、生成索引、搜索、相关推荐
  components/             # 顶栏、侧边栏、搜索框、面包屑、图标、页脚
  views/                  # 首页、栏目页、文章页、404
  assets/styles.css       # 全局样式与 Markdown 排版
public/
  products/               # 产品图
  favicon.svg
```

## 新增或替换内容

在 `src/content/<栏目>/` 下新增一个 `.md` 文件即可，文件名就是文章 slug（URL 中的 `article/xxx`）。

Frontmatter 示例：

```yaml
---
title: 读不到码：10 步排查法
summary: "从供电、链路、触发、成像到参数，按顺序排查。"
tags: [排障, 读不到, 触发]
level: 入门
updated: 2026-10-28
order: 1
featured: true
---
```

字段说明：

| 字段 | 说明 |
| --- | --- |
| `title` | 文章标题 |
| `summary` | 列表与文章头部的摘要 |
| `tags` | 标签数组，用于搜索与相关推荐 |
| `level` | 难度，如 入门 / 进阶 |
| `updated` | 更新日期，`YYYY-MM-DD` |
| `order` | 栏目内排序，数字越小越靠前 |
| `featured` | 是否在首页精选（可选） |

栏目本身在 `src/data/categories.js` 中配置。新增栏目时需要同时添加图标名和分组。

### 在文档里插图

图片放在 `public/images/` 下，Markdown 用相对站点根目录的路径引用：

```md
![ID2000 安装间距示意](./images/id2000-mounting.png)
```

- 建议宽度不超过 1600px，导出 PDF 时会按页面宽度自动缩放，单张高度上限约 190mm。
- 图片会自动加上边框、懒加载与 `alt`，并避免跨页被切断。
- 用 `/images/xxx.png` 这种以斜杠开头的写法也可以，构建后会自动补上仓库子路径前缀。

### 导出 PDF

文章页 meta 行右侧有「下载 PDF」按钮，点击后打开浏览器打印窗口，目标选择「另存为 PDF」即可：

- 打印样式会自动隐藏导航、侧栏、目录、反馈与相关推荐，只保留标题、摘要、正文与图片。
- 代码块转为浅色主题并自动换行，表格铺满页宽且表头在跨页时重复。
- 页脚会附上文档标题、栏目、更新日期、在线地址与免责声明。
- 图片会在打印前强制加载完成，不会出现懒加载导致的空白图。


## 部署到 GitHub Pages

1. 把项目推送到 GitHub 仓库。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送到 `main` 分支，`.github/workflows/deploy.yml` 会自动构建并发布。
4. 首次部署完成后，页面地址通常是 `https://<用户名>.github.io/<仓库名>/`。

`vite.config.js` 已设置 `base: './'`，因此不需要手动改仓库名。路由使用 Hash 模式（`#/article/...`），刷新不会 404。

如果默认分支是 `master`，请把 workflow 里的 `branches: [main]` 改成 `[master]`。

## 自定义

- **配色**：`src/assets/styles.css` 顶部 CSS 变量（`--blue`、`--orange`、`--navy` 等）。
- **品牌**：`src/components/AppHeader.vue` 的 logo 与标题。
- **首页文案**：`src/views/HomeView.vue`。
- **产品图**：替换 `public/products/id2020.png`，或新增图片后在 Markdown 中引用 `products/xxx.png`。

## 说明

示例文章中的型号参数、端口、触发字符串等均用于演示结构，可能随产品版本变化。正式上线前请用官方手册逐篇校对。
