# 项目约定

## 界面改动

本项目的所有 UI 工作（视觉调整、布局、组件、响应式、无障碍）都通过 `impeccable` skill 执行：

- 全局 skill 位置：`~/.config/opencode/skills/impeccable`（已安装，可直接 `skill` 调用）。
- 当前定位：`polish` / 窄范围精修——保留既有「海康工业科技风」视觉世界，不重做视觉概念。
- 编辑前先读 `reference/craft-floor.md`；编辑后运行：

```bash
IMPECCABLE_BROWSER="/Applications/ego lite.app/Contents/MacOS/ego lite" \
  ~/.config/opencode/skills/impeccable/scripts/impeccable detect --json <url>
```

- 验收线：detect 输出 0 findings；1440 / 1200 / 1000 / 760 / 390 / 320px 无横向溢出；正文对比度 ≥ 4.5:1。

## 工程约定

- Vue 3 + Vite 静态站，`base: './'` + Hash 路由，直接部署 GitHub Pages。
- 内容在 `src/content/<栏目>/*.md`，文件名即 slug；新增文章不需要改路由。
- 改动后 `npm run build` 必须通过；提交前用 `npm run preview -- --port 4173` 做一次真机尺寸核对。
- 不提交 `.opencode/`（本地工具目录，已在 `.gitignore`）。
