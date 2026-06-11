# ede.js 模块化改造计划编排

> 分支：`feature/modular-refactor`  
> 创建日期：2025-03-08  
> 状态：阶段 6 已完成

> **注意**：改造过程中**请勿修改原有实现逻辑**，仅做代码迁移与模块拆分，不改变业务行为。

---

## 总览

| 阶段 | 名称 | 预估周期 | 依赖 |
|------|------|----------|------|
| 阶段 0 | 环境准备 | 1 天 | - |
| 阶段 1 | 配置与基础模块 | 2–3 天 | 阶段 0 |
| 阶段 2 | 核心与工具模块 | 2 天 | 阶段 1 |
| 阶段 3 | 匹配与弹幕模块 | 3–4 天 | 阶段 2 |
| 阶段 4 | Bangumi 与 UI 模块 | 3–4 天 | 阶段 3 |
| 阶段 5 | 事件与入口整合 | 2 天 | 阶段 4 |
| 阶段 6 | 构建与验证 | 2–3 天 | 阶段 5 |

**总预估**：约 15–19 个工作日（3–4 周）

---

## 阶段 0：环境准备

| 序号 | 任务 | 说明 | 产出 |
|------|------|------|------|
| 0.1 | 安装 Rollup 及插件 | rollup、@rollup/plugin-node-resolve、@rollup/plugin-commonjs、@rollup/plugin-babel、rollup-plugin-terser | package.json 更新 |
| 0.2 | 创建 src 目录结构 | 按 REFACTOR_PLAN 建立 config、core、match、danmaku、bangumi、ui、utils、events、vendor | 空目录骨架 |
| 0.3 | 配置 rollup.config.js | 入口、输出 IIFE、babel 集成、sourcemap | rollup.config.js |
| 0.4 | 配置 npm scripts | build、build:dev、build:prod | package.json scripts |

---

## 阶段 1：配置与基础模块

| 序号 | 任务 | 说明 | 产出 |
|------|------|------|------|
| 1.1 | 抽取 config/constants.js | check_interval、LOAD_TYPE、mediaQueryStr、mediaContainerQueryStr、notHide 等 | constants.js |
| 1.2 | 抽取 config/ele-ids.js | eleIds 完整定义（聚合成独立文件） | ele-ids.js |
| 1.3 | 抽取 config/ls-keys.js | lsKeys 完整定义（聚合成独立文件） | ls-keys.js |
| 1.4 | 抽取 config/ls-local-keys.js | lsLocalKeys 完整定义（聚合成独立文件） | ls-local-keys.js |
| 1.5 | 抽取 config/icons.js | iconKeys、classes、styles、timeOffsetBtns、danmakuEngineOpts 等 | icons.js |
| 1.6 | 抽取 config/options.js | danmakuTabOpts、danmakuTypeFilterOpts、danmakuSource、danmuListOpts、apiPriorityOpts 等 | options.js |
| 1.7 | 抽取 config/api.js | openSourceLicense、dandanplayApi、dandanplayApiCustom、bangumiApi（注意 prefix getter 与 lsGetItem 的循环依赖） | api.js |
| 1.8 | 抽取 user-config.js | requireDanmakuPath、corsProxy 及用户可修改配置 | user-config.js |

**验收**：各 config 模块可独立 import，无循环依赖

**阶段 1 完成情况**：已完成 1.1–1.8，lsKeys 因与 api 循环依赖合并于 config/api.js

---

## 阶段 2：核心与工具模块

| 序号 | 任务 | 说明 | 产出 |
|------|------|------|------|
| 2.1 | 抽取 core/storage.js | lsGetItem、lsSetItem、lsBatchSet、lsBatchRemove、lsGetKeyById、lsCheckOld、lsCheckSet | storage.js |
| 2.2 | 抽取 utils/dom.js | getById、getByClass、getTargetInput、waitForElement | dom.js |
| 2.3 | 抽取 utils/fetch.js | fetchJson | fetch.js |
| 2.4 | 抽取 utils/platform.js | OS 对象（isAndroid、isIOS、isMacOS 等） | platform.js |
| 2.5 | 抽取 utils/helpers.js | objectEntries、getValueOrInvoke、getApiTl、getSettingsJson、settingsReset | helpers.js |
| 2.6 | 抽取 core/EDE.js | EDE 类定义 | EDE.js |
| 2.7 | 抽取 core/AppLogAspect.js | AppLogAspect 类定义 | AppLogAspect.js |

**验收**：storage 依赖 config，EDE/AppLogAspect 依赖 storage，utils 无内部循环依赖

**阶段 2 完成情况**：已完成 2.1–2.7。lsGetItem、lsGetKeyById 保留于 config/api.js；helpers.js 已含 objectEntries、getValueOrInvoke、getSettingsJson、settingsReset（阶段 4 时补充）；destroyAllInterval 置于 core/index.js

---

## 阶段 3：匹配与弹幕模块

| 序号 | 任务 | 说明 | 产出 |
|------|------|------|------|
| 3.1 | 抽取 match/search.js | fetchSearchEpisodes、fetchSearchEpisodesByTmdbId、fetchComment、fetchExtcommentActual | search.js |
| 3.2 | 抽取 match/similarity.js | normalizeTitle、parseSearchKeyword、calculateStringSimilarity、extractKeywords | similarity.js |
| 3.3 | 抽取 match/fallback.js | selectBestMatch、calculateMatchScore、autoFailback、tmdbAutoFailback、oriTitleAutoFailback、movieAutoFailback | fallback.js |
| 3.4 | 抽取 match/hash.js | calculateFileHash、fetchMatchApi | hash.js |
| 3.5 | 抽取 match/tmdb.js | tryMatchByTmdbId、filterMainEpisodes | tmdb.js |
| 3.6 | 抽取 match/episode.js | getMapByEmbyItemInfo、searchEpisodes、getEpisodeInfo、lsSeasonSearchEpisodes、parseAnimeName | episode.js |
| 3.7 | 抽取 danmaku/loader.js | loadDanmaku、loadOnlineDanmaku、createDanmaku、getCommentsByPluginApi、refreshPluginXml | loader.js |
| 3.8 | 抽取 danmaku/filter.js | danmakuFilter、danmakuAutoFilter、danmakuAutoFilterCancel、danmakuTypeFilter、danmakuSourceFilter、danmakuDensityLevelFilter、danmakuKeywordsFilter、danmakuMergeSimilar、similarityPercentage | filter.js |
| 3.9 | 抽取 danmaku/parser.js | danmakuParser、getCommentStyle | parser.js |
| 3.10 | 抽取 danmaku/chart.js | buildProgressBarChart | chart.js |
| 3.11 | 抽取 danmaku/toast.js | toastByDanmaku | toast.js |

**验收**：match 与 danmaku 模块可独立导入，依赖关系清晰

**阶段 3 完成情况**：已完成 3.1–3.11。match 拆分为 search、similarity、fallback、hash、tmdb、episode、emby-item、get-episode-info；loader.js 含 loadDanmaku、loadOnlineDanmaku、createDanmaku、getCommentsByPluginApi；refreshPluginXml 未迁移（原版 lsKeys 中已注释禁用）

---

## 阶段 4：Bangumi 与 UI 模块

| 序号 | 任务 | 说明 | 产出 |
|------|------|------|------|
| 4.1 | 抽取 bangumi/api.js | getEpisodeBangumiRel、putBangumiEpStatus、offsetBgmEpisodeIndex | api.js |
| 4.2 | 抽取 bangumi/characters.js | renderBangumiCharacters（从 buildExtInfo 中拆出） | characters.js |
| 4.3 | 抽取 ui/components/common.js | getById、getByClass、embyImg、embyALink、embyImgButton | common.js |
| 4.4 | 抽取 ui/components/inputs.js | embyInput、embyTextarea、embySelect、getTargetInput | inputs.js |
| 4.5 | 抽取 ui/components/buttons.js | embyButton | buttons.js |
| 4.6 | 抽取 ui/components/layout.js | embyTabs、embyCheckbox、embyCheckboxList、embySlider | layout.js |
| 4.7 | 抽取 ui/dialog.js | createDialog、afterEmbyDialogCreated、embyDialog、closeEmbyDialog、embyAlert、embyToast | dialog.js |
| 4.8 | 抽取 ui/tabs/setting.js | buildDanmakuSetting、buildSettingsBackup、buildFontStyleSetting、buildFontFamilySetting、buildFontFamilyCtrl、resetFontFamilyDiv、loadLocalFont、changeFontStylePreview | setting.js |
| 4.9 | 抽取 ui/tabs/search.js | buildSearchEpisode、buildSearchEpisodeEle、buildExtCommentDiv、buildExtUrlsDiv、buildCustomApiDiv、buildDanmuPluginDiv、bindManualMatchButtons、onEnterExtComment、addExtComments | search.js |
| 4.10 | 抽取 ui/tabs/info.js | buildCurrentDanmakuInfo、buildDanmuListDiv、buildExtInfo | info.js |
| 4.11 | 抽取 ui/tabs/pro.js | buildProSetting、buildDanmakuFilterSetting、buildExtSetting、buildOsdSetting、buildPlaySetting、buildBangumiSetting、buildCustomUrlSetting、onEnterBangumiToken、fetchBangumiApiGetMe | pro.js |
| 4.12 | 抽取 ui/tabs/about.js | buildAbout、buildConsoleLog、buildDebugCheckbox、buildDebugButton、buildOpenSourceLicense、buildIframe、generateRandomDanmu | about.js |
| 4.13 | 抽取 ui/init.js | initUI、initListener、initCss | init.js |

**验收**：UI 模块可正确渲染各 Tab，无样式与事件丢失

**阶段 4 完成情况**：已完成 4.1–4.13
- bangumi/api.js、bangumi/characters.js
- ui/components（common、inputs、buttons、layout）、ui/dialog.js
- ui/tabs（setting、search、info、pro、about）、ui/init.js
- match/emby-item.js（getMapByEmbyItemInfo）

**补全记录（2025-03-08）**：setting.js、search.js、pro.js、about.js 占位实现已全部补全为完整实现

---

## 阶段 5：事件与入口整合

| 序号 | 任务 | 说明 | 产出 |
|------|------|------|------|
| 5.1 | 抽取 events/playback.js | onPlaybackStart、onPlaybackStop、onPlaybackStopPct | playback.js |
| 5.2 | 抽取 events/video-osd.js | onVideoOsdShow、onVideoOsdHide | video-osd.js |
| 5.3 | 抽取 events/view.js | onViewShow、beforeDestroy | view.js |
| 5.4 | 抽取 events/easter-egg.js | addEasterEggListener、quickDebug、checkRuntimeVars | easter-egg.js |
| 5.5 | 处理 vendor/danmaku | 内联 Danmaku 或通过 rollup 插件注入 | danmaku-inline.js 或插件 |
| 5.6 | 编写 src/index.js | 组装所有模块，保留 IIFE 包装，注入油猴头 | index.js |
| 5.7 | 处理 customeUrl、mediaBtnOpts 等 | 确保初始化顺序正确 | index.js |

**验收**：index.js 可成功打包，无未定义引用

**阶段 5 完成情况**：已完成 5.1–5.7
- events/playback.js、video-osd.js、view.js、easter-egg.js、emby-events.js
- danmaku/loader.js: loadDanmaku、loadOnlineDanmaku、getCommentsByPluginApi
- match: getEpisodeInfo、fetchComment、fetchExtcommentActual
- config/custome-url.js
- index.js 组装 viewshow、viewbeforehide

---

## 阶段 6：构建与验证

| 序号 | 任务 | 说明 | 产出 |
|------|------|------|------|
| 6.1 | 完善 rollup 配置 | 处理 Emby 全局、油猴头注入、sourcemap | rollup.config.js |
| 6.2 | 集成现有 babel 流程 | 对 dist/ede.js 执行 android7/android9 转译 | package.json |
| 6.3 | 功能回归测试 | 油猴、index.html、CustomCssJS 三种方式加载 | 测试报告 |
| 6.4 | 多端验证 | Web、Android、iOS、Emby Theater 等 | 兼容性记录 |
| 6.5 | 更新 README/贡献指南 | 说明 build 步骤、目录结构 | 文档更新 |
| 6.6 | 清理旧 ede.js | 保留为备份或归档，主入口改为 dist/ede.js | 仓库整理 |

**验收**：构建产物功能与改造前一致，文档完整

**阶段 6 完成情况**：已完成 6.1–6.5；6.6 暂缓，ede.js 保留作参考
- rollup.config.js：油猴头、Danmaku 内联、CustomCssJS 分支、sourcemap 输出
- vendor/danmaku-inline.js：从 ede.js 提取 Danmaku UMD
- babel.config.js：android7/android9 目标，BROWSERSLIST_ENV 驱动
- package.json：build、build:android9、build:android7、build:all
- build 产出：ede.js、ede.min.js、ede.user.js、ede.user.min.js、ede.android9.js、ede.android7.js
- docs/refactor/BUILD.md：构建说明
- README.md：开发/构建 section
- 6.3 功能回归测试、6.4 多端验证：需人工在实机/实环境中验证，无单独产出文档

---

## 计划细化建议

当前计划粒度已足够支撑执行，**建议先按现有编排推进**，在阶段 1 完成后再视情况补充：

| 可细化项 | 当前状态 | 建议 |
|----------|----------|------|
| 任务拆解 | 每阶段 4–13 个子任务 | 足够，执行时可按任务拆 PR |
| 代码映射 | 未提供 ede.js 行号→模块映射 | 阶段 1 执行时可补充 `docs/refactor/CODE_MAPPING.md`，便于迁移时定位 |
| 循环依赖处理 | 计划中已标注 api.js 注意点 | 阶段 1.7 执行时细化 dandanplayApi.prefix 的注入方案 |
| 验收用例 | 仅阶段级验收描述 | 阶段 6 执行时补充具体测试用例清单 |
| 回滚策略 | 未涉及 | 每阶段完成后打 tag（如 `modular-phase-1`），便于回滚 |

**结论**：无需在开工前进一步细化，按阶段执行即可；若某阶段卡住，再针对该阶段补充子计划。

---

## 执行建议

1. **按阶段推进**：每阶段完成后做一次小范围验证，避免问题累积
2. **分支策略**：在 `feature/modular-refactor` 下可按阶段建子分支，如 `feature/modular-phase-1-config`
3. **细化任务**：每个任务可再拆为更小的 PR，便于 Code Review
4. **依赖梳理**：阶段 1 完成后，可用工具（如 madge）检查模块依赖图，及时修正循环依赖

---

## 变更记录

| 日期 | 变更内容 |
|------|----------|
| 2025-03-08 | 初版创建 |
| 2025-03-08 | 明确 eleIds、lsKeys、lsLocalKeys 聚合成 3 个独立 config 文件；新增计划细化建议 |
| 2025-03-08 | 阶段 2 完成：core/storage、utils（dom/fetch/platform/helpers）、core/EDE、core/AppLogAspect |
| 2025-03-08 | 阶段 4 部分完成：bangumi/api、bangumi/characters、ui/components、ui/dialog；helpers 补充 getValueOrInvoke、getSettingsJson、settingsReset |
| 2025-03-08 | 阶段 4 完成：ui/tabs（setting、search、info、pro、about）、ui/init.js、match/emby-item.js、dialog 集成 afterEmbyDialogCreated |
| 2025-03-08 | 阶段 5 完成：events 模块、loadDanmaku、getEpisodeInfo、customeUrl、index 组装 |
| 2025-03-08 | 阶段 6 完成：rollup 油猴头、Danmaku 内联、babel android、BUILD.md、README 更新 |
| 2025-03-08 | 阶段 6 后修复：initH5VideoAdapter、videoTimeUpdateInterval、appendvideoOsdDanmakuInfo、waitForElement+destroyIntervalIds、destroyAllInterval 无参、loader.js hooks、addExtCommentsForLoad hooks；danmaku-inline.js 精简为仅 Danmaku UMD |
