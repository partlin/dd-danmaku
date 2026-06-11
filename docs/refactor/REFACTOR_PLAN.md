# ede.js 模块化改造方案

> 基于方案 A：ESM + 构建工具  
> 分支：`feature/modular-refactor`  
> 创建日期：2025-03-08

---

## 一、改造目标

1. **可维护性**：将 5000+ 行单文件拆分为职责清晰的模块，便于阅读与修改

> **注意**：改造过程中**请勿修改原有实现逻辑**，仅做代码迁移与模块拆分，不改变业务行为。
2. **可扩展性**：模块边界清晰，便于后续功能扩展与独立测试
3. **兼容性**：构建产物保持与现有加载方式一致（油猴、index.html、CustomCssJS）
4. **构建流程**：引入 Rollup 作为打包工具，输出 IIFE 格式单文件

---

## 二、目录结构设计

```
dd-danmaku/
├── src/
│   ├── index.js                 # 入口：初始化、事件绑定、IIFE 包装
│   ├── config/
│   │   ├── constants.js         # 常量：check_interval、LOAD_TYPE、mediaQueryStr
│   │   ├── ele-ids.js           # eleIds 元素 ID 集合（聚合成独立文件）
│   │   ├── ls-keys.js           # lsKeys localStorage 配置键（聚合成独立文件）
│   │   ├── ls-local-keys.js      # lsLocalKeys localStorage 前缀键（聚合成独立文件）
│   │   ├── icons.js             # iconKeys、classes、styles
│   │   ├── options.js           # danmakuTabOpts、danmakuTypeFilterOpts、danmakuSource 等
│   │   └── api.js               # dandanplayApi、bangumiApi、openSourceLicense
│   ├── core/
│   │   ├── EDE.js               # EDE 主类
│   │   ├── AppLogAspect.js      # 控制台日志切面
│   │   └── storage.js           # lsGetItem、lsSetItem、lsBatchSet、lsBatchRemove 等
│   ├── match/
│   │   ├── search.js            # fetchSearchEpisodes、fetchSearchEpisodesByTmdbId、fetchComment
│   │   ├── tmdb.js              # tryMatchByTmdbId、filterMainEpisodes
│   │   ├── hash.js              # tryMatchByHash、calculateFileHash、fetchMatchApi
│   │   ├── fallback.js          # autoFailback、selectBestMatch、calculateMatchScore
│   │   ├── similarity.js        # normalizeTitle、calculateStringSimilarity、extractKeywords
│   │   └── episode.js           # searchEpisodes、getEpisodeInfo、getMapByEmbyItemInfo
│   ├── danmaku/
│   │   ├── loader.js            # loadDanmaku、loadOnlineDanmaku、createDanmaku
│   │   ├── filter.js            # danmakuFilter、danmakuTypeFilter、danmakuSourceFilter 等
│   │   ├── parser.js            # danmakuParser、getCommentStyle
│   │   ├── chart.js             # buildProgressBarChart
│   │   └── toast.js             # toastByDanmaku
│   ├── bangumi/
│   │   ├── api.js               # getEpisodeBangumiRel、putBangumiEpStatus、offsetBgmEpisodeIndex
│   │   └── characters.js        # renderBangumiCharacters（从 buildExtInfo 中提取）
│   ├── ui/
│   │   ├── init.js              # initUI、initListener、initCss
│   │   ├── dialog.js            # createDialog、embyDialog、closeEmbyDialog、embyAlert、embyToast
│   │   ├── components/
│   │   │   ├── buttons.js       # embyButton、embyImgButton
│   │   │   ├── inputs.js        # embyInput、embyTextarea、embySelect
│   │   │   ├── layout.js        # embyTabs、embyCheckbox、embyCheckboxList、embySlider
│   │   │   └── common.js        # embyImg、embyALink、getById、getByClass
│   │   └── tabs/
│   │       ├── setting.js       # buildDanmakuSetting、buildFontStyleSetting、buildFontFamilySetting
│   │       ├── search.js       # buildSearchEpisode、buildSearchEpisodeEle、buildExtCommentDiv
│   │       ├── info.js          # buildCurrentDanmakuInfo、buildDanmuListDiv、buildExtInfo
│   │       ├── pro.js           # buildProSetting、buildDanmakuFilterSetting、buildOsdSetting
│   │       └── about.js         # buildAbout、buildConsoleLog、buildDebugCheckbox、buildIframe
│   ├── utils/
│   │   ├── dom.js               # getById、getByClass、getTargetInput、waitForElement
│   │   ├── fetch.js             # fetchJson
│   │   ├── platform.js          # OS 检测对象
│   │   └── helpers.js           # objectEntries、getValueOrInvoke、getApiTl
│   ├── events/
│   │   ├── playback.js          # onPlaybackStart、onPlaybackStop、onPlaybackStopPct
│   │   ├── video-osd.js         # onVideoOsdShow、onVideoOsdHide
│   │   ├── view.js              # onViewShow、beforeDestroy
│   │   └── easter-egg.js        # addEasterEggListener、quickDebug
│   ├── vendor/
│   │   └── danmaku-inline.js    # 内联的 Danmaku 库（或通过 rollup 插件注入）
│   └── user-config.js          # 用户可配置项：requireDanmakuPath、corsProxy
├── dist/
│   ├── ede.js                   # 开发版（未压缩）
│   ├── ede.min.js               # 生产版（压缩）
│   ├── ede.android9.js          # Android 9+ 兼容（保留现有 babel 流程）
│   └── ede.android7.js          # Android 7+ 兼容
├── rollup.config.js
├── package.json
└── docs/
    └── refactor/
        ├── REFACTOR_PLAN.md     # 本文档
        └── REFACTOR_SCHEDULE.md # 计划编排
```

### 2.1 设计决策：config 聚合方式

**eleIds、lsKeys、lsLocalKeys** 采用聚合成 3 个独立 config 文件的方案：

| 文件 | 内容 | 说明 |
|------|------|------|
| `ele-ids.js` | eleIds | DOM 元素 ID 集合，约 60+ 项 |
| `ls-keys.js` | lsKeys | localStorage 配置键（含 defaultValue、min、max 等），约 50+ 项 |
| `ls-local-keys.js` | lsLocalKeys | localStorage 前缀键（animePrefix、apiPrefix 等），约 6 项 |

**原因**：单一数据源、维护集中、避免散落导致的不一致，各使用方通过 `import` 按需引用。

---

## 三、模块依赖关系

```
index.js
  ├── config/* (constants, ele-ids, ls-keys, ls-local-keys, icons, options, api)
  ├── core/* (EDE, AppLogAspect, storage)
  ├── match/* (search, tmdb, hash, fallback, similarity, episode)
  ├── danmaku/* (loader, filter, parser, chart, toast)
  ├── bangumi/* (api, characters)
  ├── ui/* (init, dialog, components, tabs)
  ├── utils/* (dom, fetch, platform, helpers)
  ├── events/* (playback, video-osd, view, easter-egg)
  └── vendor/danmaku-inline

依赖层级（自底向上）：
  L0: config (constants, ele-ids, ls-keys, ls-local-keys, icons, options, api), utils, vendor
  L1: core/storage (依赖 config)
  L2: core/EDE, core/AppLogAspect
  L3: match/*, danmaku/*, bangumi/*
  L4: ui/*
  L5: events/*
  L6: index (入口)
```

---

## 四、构建配置要点

### 4.1 Rollup 输出格式

- **格式**：IIFE（立即执行函数表达式）
- **原因**：与现有 ede.js 运行方式一致，无需修改加载逻辑
- **全局变量**：无需暴露，脚本自执行

### 4.2 兼容性

- **目标**：ES2015+，与现有 babel 流程衔接
- **Android 7/9**：保留 `build:android7`、`build:android9`，对 dist/ede.js 进行二次转译

### 4.3 依赖处理

- **Danmaku 库**：内联到产物，或通过 rollup-plugin-inject 注入
- **Emby 全局**：`ApiClient`、`Emby`、`require` 等不打包，运行时由 Emby 环境提供

### 4.4 油猴头注释

- 通过 rollup 插件在产物顶部注入 `// ==UserScript==` 等元数据
- 或单独维护 `ede.user.js` 模板，构建时拼接

---

## 五、迁移注意事项

### 5.1 循环依赖

- `lsGetItem` 在 `config/api.js` 的 getter 中被调用，需将 `api.js` 中对 `lsGetItem` 的依赖改为运行时注入，或调整 config 与 storage 的拆分方式
- 建议：`dandanplayApi.prefix` 等动态 API 可移至 `core` 或单独模块，在初始化时注入 `lsGetItem`

### 5.2 全局状态

- `window.ede`：在 `index.js` 中创建并挂载，各模块通过参数传入或从 `window.ede` 读取
- `window.Danmaku`：在 vendor 加载后挂载，弹幕引擎模块依赖此全局

### 5.3 外部依赖

- `ApiClient`、`Emby`、`require`：不打包，各模块使用时需明确标注为外部依赖，便于后续 mock 测试

---

## 六、验收标准

1. 构建产物 `dist/ede.js` 功能与现有 `ede.js` 完全一致
2. 油猴、index.html、CustomCssJS 三种加载方式均可正常使用
3. Android 7/9 兼容构建流程保留且通过
4. 单文件行数控制在 500 行以内（单模块），总模块数约 25–30 个
5. 新增 `npm run build` 脚本，文档中说明构建步骤

---

## 七、后续可扩展

- 为 `match`、`danmaku`、`utils` 等模块补充单元测试
- 对核心模块引入 TypeScript 类型定义
- 若需支持按需加载，可输出多 chunk 版本（需评估 Emby 客户端兼容性）
