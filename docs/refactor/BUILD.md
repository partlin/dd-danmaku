# 构建说明

> 模块化改造后的构建流程说明

## 前置要求

- Node.js >= 16
- npm

## 安装依赖

```bash
npm install
```

## 构建命令

| 命令 | 说明 | 产出 |
|------|------|------|
| `npm run build` | 默认构建 | dist/ede.js, ede.min.js, ede.user.js, ede.user.min.js |
| `npm run build:android9` | Android 9+ 兼容构建 | dist/ede.android9.js |
| `npm run build:android7` | Android 7+ 兼容构建 | dist/ede.android7.js |
| `npm run build:all` | 全量构建（含 android 变体） | 上述全部 |

## 产出文件说明

| 文件 | 用途 |
|------|------|
| ede.js | 开发版，带 sourcemap，用于 index.html 直接引入 |
| ede.min.js | 压缩版，用于 index.html 或 CDN |
| ede.user.js | 油猴脚本（含 UserScript 头），用于 Tampermonkey |
| ede.user.min.js | 油猴脚本压缩版 |
| ede.android9.js | Android 9+ WebView 兼容 |
| ede.android7.js | Android 7+ WebView 兼容 |

## 目录结构

```
dd-danmaku/
├── src/                    # 模块化源码
│   ├── index.js            # 入口
│   ├── config/             # 配置
│   ├── core/               # 核心逻辑
│   ├── match/              # 弹幕匹配
│   ├── danmaku/            # 弹幕加载与渲染
│   ├── bangumi/            # Bangumi 集成
│   ├── ui/                 # UI 组件
│   ├── events/             # 事件处理
│   ├── utils/              # 工具函数
│   └── vendor/             # 内联依赖
│       └── danmaku-inline.js  # Danmaku 引擎 UMD
├── dist/                   # 构建产物
├── ede.js                  # 原始单文件（保留作参考）
├── rollup.config.js
├── babel.config.js
└── package.json
```

## 加载方式

构建产物与改造前保持一致，支持：

1. **油猴**：使用 `ede.user.js` 或 `ede.user.min.js`
2. **index.html**：`<script src="ede.js">` 或 `ede.min.js`
3. **CustomCssJS**：使用 `ede.min.js`，Danmaku 在 CustomCssJS 环境下从网络加载

## 技术说明

- **Rollup**：ESM 打包为 IIFE
- **Babel**：preset-env 按目标环境转译（android7/android9）
- **Danmaku 内联**：油猴与 index.html 环境内置 Danmaku；CustomCssJS 环境通过 `Emby.importModule` 网络加载
