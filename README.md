# Yehua Ou - Portfolio

## 项目结构

```
portfolio website/
├── index.html          # 单页：首屏（Shader 背景 + 球体通道）+ 第二页（导航 + 草坪背景 + About + Footer）
├── styles.css          # 全局样式、首屏/球体/过渡光晕/第二页/响应式
├── vite.config.js      # Vite 配置（开发与构建）
├── package.json        # 依赖：React、ShaderGradient（首屏背景）等
├── src/                # React 入口与首屏 Shader 背景
│   ├── main.jsx        # 挂载 ShaderBackground 到 #bgLayer
│   └── ShaderBackground.jsx
├── js/                 # 纯脚本（无框架）
│   ├── grass-bg.js     # 第二页动态草坪背景，注入到 .cover-bg
│   └── script.js       # 滚轮与转场、球体辉度、光晕渐隐、返回第一页
├── backgroundimg/      # 静态资源（可选）
├── texts/              # 字体资源（可选）
└── shader-bg/          # ShaderGradient 源码参考（可选，首屏已用 src/ShaderBackground.jsx）
```

## 运行方式

1. `npm install`
2. `npm run serve` 或 `npx vite --port 8080`
3. 浏览器打开 http://localhost:8080

首屏：Shader 渐变背景 + 发光球体通道，滚动走进通道后光晕渐隐露出第二页；第二页为动态草坪背景（鼠标可交互）。
