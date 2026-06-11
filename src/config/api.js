/**
 * API 配置、lsKeys、lsGetItem
 * 从 ede.js 迁移，未修改原有实现逻辑
 * 因 lsKeys 与 dandanplayApi 存在循环引用，合并于本模块
 */

import { corsProxy, requireDanmakuPath } from '../user-config.js';

export const openSourceLicense = {
    self: {
        version: '1.47',
        name: 'Emby Danmaku Extension(Forked from original:1.11)',
        license: 'MIT License',
        url: 'https://github.com/chen3861229/dd-danmaku',
    },
    original: {
        version: '1.11',
        name: 'Emby Danmaku Extension',
        license: 'MIT License',
        url: 'https://github.com/RyoLee/emby-danmaku',
    },
    jellyfinFork: {
        version: '1.52',
        name: 'Jellyfin Danmaku Extension',
        license: 'MIT License',
        url: 'https://github.com/Izumiko/jellyfin-danmaku',
    },
    danmaku: {
        version: '2.0.8',
        name: 'Danmaku',
        license: 'MIT License',
        url: 'https://github.com/weizhenye/Danmaku',
    },
    dandanplayApi: {
        version: 'v2',
        name: '弹弹 play API',
        license: 'MIT License',
        url: 'https://github.com/kaedei/dandanplay-libraryindex',
    },
    dandanplayDoc: {
        version: 'PC',
        name: '赞助弹弹 play 官方',
        license: 'None',
        url: 'https://doc.dandanplay.com/other/donate.html',
    },
    bangumiApi: {
        version: '2025-02-5',
        name: 'Bangumi API',
        license: 'None',
        url: 'https://github.com/bangumi/api',
    },
    embyPluginDanmu: {
        version: '1.0.2',
        name: 'EmbyPluginDanmu',
        license: 'None',
        url: 'https://github.com/fengymi/emby-plugin-danmu',
    },
};

const getApiTl = (fn) => {
    if (!fn || typeof fn.toString !== 'function') {
        return '';
    }
    const match = fn.toString().match(/\=>\s*(.*)$/);
    if (!match || !match[1]) {
        return '';
    }
    return match[1].trim().replace(/`/g, '');
};

// dandanplayApi 需在 lsKeys 之前定义，getter 运行时才需要 lsGetItem/lsKeys
export const dandanplayApi = {
    get prefix() {
        const custom = lsGetItem(lsKeys.customApiPrefix.id);
        if (custom && custom.length > 0 && !lsGetItem(lsKeys.useOfficialApi.id)) {
            return custom;
        }
        return corsProxy + 'https://api.dandanplay.net/api/v2';
    },
    getSearchEpisodes: (anime, episode, tmdbId) =>
        `${dandanplayApi.prefix}/search/episodes?anime=${anime}${episode ? `&episode=${episode}` : ''}${tmdbId ? `&tmdbId=${tmdbId}` : ''}`,
    getComment: (episodeId, chConvert) =>
        `${dandanplayApi.prefix}/comment/${episodeId}?withRelated=true&chConvert=${chConvert}`,
    getExtcomment: (url) => `${dandanplayApi.prefix}/extcomment?url=${encodeURI(url)}`,
    getBangumi: (animeId) => `${dandanplayApi.prefix}/bangumi/${animeId}`,
    posterImg: (animeId) => `https://img.dandanplay.net/anime/${animeId}.jpg`,
};

export const dandanplayApiCustom = {
    get prefix() {
        const custom = lsGetItem(lsKeys.customApiPrefix.id);
        return custom && custom.length > 0 ? custom : corsProxy + 'https://api.dandanplay.net/api/v2';
    },
    getMatchUrl: () => `${dandanplayApiCustom.prefix}/match`,
};

export const bangumiApi = {
    prefix: 'https://api.bgm.tv/v0',
    accessTokenUrl: 'https://next.bgm.tv/demo/access-token',
    getCharacters: (subjectId) => `${bangumiApi.prefix}/subjects/${subjectId}/characters`,
    getMe: () => `${bangumiApi.prefix}/me`,
    getUserCollection: (userName, subjectId) =>
        `${bangumiApi.prefix}/users/${userName}/collections/${subjectId}`,
    postUserCollection: (subjectId) => `${bangumiApi.prefix}/users/-/collections/${subjectId}`,
    getUserSubjectEpisodeCollection: (subjectId) =>
        `${bangumiApi.prefix}/users/-/collections/${subjectId}/episodes?offset=0&limit=100`,
    putUserEpisodeCollection: (episodeId) =>
        `${bangumiApi.prefix}/users/-/collections/-/episodes/${episodeId}`,
};

// lsKeys 需在 dandanplayApi 之后，因 defaultValue 使用 getApiTl(dandanplayApi.getComment)
export const lsKeys = {
    chConvert: { id: 'danmakuChConvert', defaultValue: 1, name: '简繁转换' },
    switch: { id: 'danmakuSwitch', defaultValue: true, name: '弹幕开关' },
    filterLevel: { id: 'danmakuFilterLevel', defaultValue: 0, name: '过滤强度', min: 0, max: 3, step: 1 },
    heightPercent: { id: 'danmakuHeightPercent', defaultValue: 100, name: '显示区域', min: 3, max: 100, step: 1 },
    fontSizeRate: { id: 'danmakuFontSizeRate', defaultValue: 1, name: '弹幕大小', min: 0.1, max: 3, step: 0.1 },
    fontOpacity: { id: 'danmakuFontOpacity', defaultValue: 1, name: '透明度', min: 0.1, max: 1, step: 0.1 },
    speed: { id: 'danmakuBaseSpeed', defaultValue: 1, name: '速度', min: 0.1, max: 3, step: 0.1 },
    timelineOffset: { id: 'danmakuTimelineOffset', defaultValue: 0, name: '轴偏秒' },
    fontWeight: { id: 'danmakuFontWeight', defaultValue: 400, name: '弹幕粗细', min: 100, max: 1000, step: 100 },
    fontStyle: { id: 'danmakuFontStyle', defaultValue: 0, name: '弹幕斜体', min: 0, max: 2, step: 1 },
    fontFamily: { id: 'danmakuFontFamily', defaultValue: 'sans-serif', name: '字体' },
    danmuList: { id: 'danmakuDanmuList', defaultValue: 0, name: '弹幕列表' },
    typeFilter: { id: 'danmakuTypeFilter', defaultValue: [], name: '屏蔽类型' },
    sourceFilter: { id: 'danmakuSourceFilter', defaultValue: [], name: '屏蔽来源平台' },
    showSource: { id: 'danmakuShowSource', defaultValue: [], name: '显示每条来源' },
    autoFilterCount: {
        id: 'danmakuAutoFilterCount',
        defaultValue: 0,
        name: '自动过滤弹幕数阈值',
        min: 0,
        max: 10000,
        step: 500,
    },
    mergeSimilarEnable: { id: 'danmakuMergeSimilarEnable', defaultValue: false, name: '合并相似弹幕' },
    mergeSimilarPercent: {
        id: 'danmakuMergeSimilarPercent',
        defaultValue: 80,
        name: '相似度百分比',
        min: 20,
        max: 100,
        step: 1,
    },
    mergeSimilarTime: {
        id: 'danmakuMergeSimilarTime',
        defaultValue: 10,
        name: '相似度时间窗口秒',
        min: 1,
        max: 60,
        step: 1,
    },
    filterKeywords: { id: 'danmakuFilterKeywords', defaultValue: '', name: '屏蔽关键词' },
    filterKeywordsEnable: { id: 'danmakuFilterKeywordsEnable', defaultValue: true, name: '屏蔽关键词启用' },
    engine: { id: 'danmakuEngine', defaultValue: 'canvas', name: '弹幕引擎' },
    osdTitleEnable: { id: 'danmakuOsdTitleEnable', defaultValue: false, name: '播放界面右下角显示弹幕信息' },
    osdLineChartEnable: { id: 'danmakuOsdLineChartEnable', defaultValue: false, name: '弹幕高能进度条' },
    osdLineChartSkipFilter: {
        id: 'danmakuOsdLineChartSkipFilter',
        defaultValue: false,
        name: '弹幕高能进度条免过滤',
    },
    osdLineChartTime: {
        id: 'danmakuOsdLineChartTime',
        defaultValue: 10,
        name: '弹幕高能进度条颗粒度秒',
        min: 1,
        max: 60,
        step: 1,
    },
    osdHeaderClockEnable: { id: 'danmakuOsdHeaderClockEnable', defaultValue: false, name: '播放界面头中显示时钟' },
    timeoutCallbackUnit: { id: 'danmakuTimeoutCallbackUnit', defaultValue: 1, name: '定时单位' },
    timeoutCallbackValue: { id: 'danmakuTimeoutCallbackValue', defaultValue: 0, name: '定时值' },
    bangumiEnable: { id: 'danmakuBangumiEnable', defaultValue: false, name: '启用并填写个人令牌' },
    bangumiToken: { id: 'danmakuBangumiToken', defaultValue: '', name: '个人令牌' },
    bangumiPostPercent: {
        id: 'danmakuBangumiPostPercent',
        defaultValue: 95,
        name: '时长比',
        min: 1,
        max: 99,
        step: 1,
    },
    consoleLogEnable: { id: 'danmakuConsoleLogEnable', defaultValue: false, name: '控制台日志' },
    useFetchPluginXml: { id: 'danmakuUseFetchPluginXml', defaultValue: false, name: '加载媒体服务端xml弹幕' },
    debugShowDanmakuWrapper: { id: 'danmakuDebugShowDanmakuWrapper', defaultValue: false, name: '弹幕容器边界' },
    debugShowDanmakuCtrWrapper: { id: 'danmakuDebugShowDanmakuCtrWrapper', defaultValue: false, name: '按钮容器边界' },
    debugReverseDanmu: { id: 'danmakuDebugReverseDanmu', defaultValue: false, name: '反转弹幕方向' },
    debugRandomDanmuColor: { id: 'danmakuDebugRandomDanmuColor', defaultValue: false, name: '随机弹幕颜色' },
    debugForceDanmuWhite: { id: 'danmakuDebugForceDanmuWhite', defaultValue: false, name: '强制弹幕白色' },
    debugTopBottomToScroll: { id: 'danmakuDebugTopBottomToScroll', defaultValue: false, name: '顶底弹幕滚动' },
    debugGenerateLarge: { id: 'danmakuDebugGenerateLarge', defaultValue: false, name: '测试大量弹幕' },
    debugDialogHyalinize: { id: 'danmakuDebugDialogHyalinize', defaultValue: false, name: '透明弹窗背景' },
    debugDialogWindow: { id: 'danmakuDebugDialogWindow', defaultValue: false, name: '弹窗窗口化' },
    debugDialogRight: { id: 'danmakuDebugDialogRight', defaultValue: false, name: '弹窗靠右布局' },
    debugTabIframeEnable: { id: 'danmakuDebugTabIframeEnable', defaultValue: false, name: '打开内嵌网页' },
    debugH5VideoAdapterEnable: {
        id: 'danmakuDebugH5VideoAdapterEnable',
        defaultValue: false,
        name: '查看视频适配器情况',
    },
    debugDanmuAnywhereEnable: {
        id: 'danmakuDebugDanmuAnywhereEnable',
        defaultValue: false,
        name: '在任意处测试弹幕',
    },
    quickDebugOn: { id: 'danmakuQuickDebugOn', defaultValue: false, name: '快速调试' },
    customeCorsProxyUrl: { id: 'danmakuCustomeCorsProxyUrl', defaultValue: corsProxy, name: '跨域代理前缀' },
    customeDanmakuUrl: { id: 'danmakuCustomeDanmakuUrl', defaultValue: requireDanmakuPath, name: '弹幕引擎依赖' },
    customeGetCommentUrl: {
        id: 'danmakuCustomeGetCommentUrl',
        defaultValue: getApiTl(dandanplayApi.getComment),
        name: '获取指定弹幕库的所有弹幕',
    },
    customeGetExtcommentUrl: {
        id: 'danmakuCustomeGetExtcommentUrl',
        defaultValue: getApiTl(dandanplayApi.getExtcomment),
        name: '获取指定第三方url的弹幕',
    },
    customePosterImgUrl: {
        id: 'danmakuCustomePosterImgUrl',
        defaultValue: getApiTl(dandanplayApi.posterImg),
        name: '媒体海报',
    },
    customApiPrefix: { id: 'danmakuCustomApiPrefix', defaultValue: '', name: '自定义弹弹play API地址' },
    useOfficialApi: { id: 'danmakuUseOfficialApi', defaultValue: true, name: '使用官方API' },
    useCustomApi: { id: 'danmakuUseCustomApi', defaultValue: false, name: '使用自定义API' },
    apiPriority: { id: 'danmakuApiPriority', defaultValue: ['official', 'custom'], name: 'API 优先级' },
};

export function lsGetKeyById(id) {
    return Object.keys(lsKeys).find((key) => lsKeys[key].id === id);
}

export function lsGetItem(id) {
    const key = lsGetKeyById(id);
    if (!key) {
        return null;
    }
    const defaultValue = lsKeys[key].defaultValue;
    const item = localStorage.getItem(id);
    if (item === null) {
        return defaultValue;
    }
    if (Array.isArray(defaultValue) || (typeof defaultValue === 'object' && defaultValue !== null)) {
        return JSON.parse(item);
    }
    if (typeof defaultValue === 'boolean') {
        return item === 'true';
    }
    if (typeof defaultValue === 'number') {
        return parseFloat(item);
    }
    return item;
}

export { getApiTl };
