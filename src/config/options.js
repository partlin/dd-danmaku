/**
 * 选项配置（弹幕类型、来源、列表等）
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { iconKeys } from './icons.js';

export const currentDanmakuInfoContainerId = 'danmakuTab2';
export const tabIframeId = 'danmakuTab5';

// 弹幕类型过滤
export const danmakuTypeFilterOpts = {
    bottom: { id: 'bottom', name: '底部弹幕' },
    top: { id: 'top', name: '顶部弹幕' },
    ltr: { id: 'ltr', name: '从左至右' },
    rtl: { id: 'rtl', name: '从右至左' },
    rolling: { id: 'rolling', name: '滚动弹幕' },
    onlyWhite: { id: 'onlyWhite', name: '彩色弹幕' },
    emoji: { id: 'emoji', name: 'emoji' },
};

export const danmakuSource = {
    AcFun: { id: 'AcFun', name: 'A站(AcFun)' },
    BiliBili: { id: 'BiliBili', name: 'B站(BiliBili)' },
    DanDanPlay: { id: 'DanDanPlay', name: '弹弹(DanDanPlay)' }, // 无弹幕来源的默认值
    D: { id: 'D', name: 'D' }, // 未知平台
    Gamer: { id: 'Gamer', name: '巴哈(Gamer)' },
    iqiyi: { id: 'iqiyi', name: '爱奇艺(iqiyi)' },
    QQ: { id: 'QQ', name: '腾讯视频(QQ)' },
    Youku: { id: 'Youku', name: '优酷(Youku)' },
    '5dm': { id: '5dm', name: 'D站(5dm)' },
    '异世界动漫': { id: '异世界动漫', name: '异世界动漫' },
};

export const showSource = {
    source: { id: 'source', name: '来源平台' },
    originalUserId: { id: 'originalUserId', name: '用户ID' },
    cid: { id: 'cid', name: '弹幕CID' }, // 非弹幕 id,唯一性需自行用 uid + cid 拼接的 cuid
};

export const danmakuEngineOpts = [
    { id: 'canvas', name: 'canvas' },
    { id: 'dom', name: 'dom' },
];

export const danmakuChConverOpts = [
    { id: '0', name: '未启用' },
    { id: '1', name: '转换为简体' },
    { id: '2', name: '转换为繁体' },
];

export const toastPrefixes = {
    system: '[系统通知] : ',
};

export const hasToastPrefixes = (comment, prefixes) =>
    Object.values(prefixes).some((prefix) => comment.text.startsWith(prefix));

export const getDanmakuComments = (ede) => {
    if (ede.danmaku && ede.danmaku.comments) {
        return ede.danmaku.comments.filter((c) => !hasToastPrefixes(c, toastPrefixes));
    }
    return [];
};

export const danmuListOpts = [
    { id: '0', name: '不展示', onChange: () => [] },
    { id: '1', name: '屏中', onChange: (ede) => (ede.danmaku ? ede.danmaku._.runningList : []) },
    { id: '2', name: '所有', onChange: (ede) => ede.commentsParsed },
    { id: '3', name: '已加载', onChange: getDanmakuComments },
    {
        id: '4',
        name: '被过滤',
        onChange: (ede) => {
            return ede.commentsParsed.filter(
                (p) => !getDanmakuComments(ede).some((c) => p.cuid === c.cuid)
            );
        },
    },
    { id: '5', name: '已相似合并', onChange: (ede) => ede.commentsParsed.filter((p) => p.xCount) },
    {
        id: '100',
        name: '通知',
        onChange: (ede) =>
            ede.danmaku ? ede.danmaku.comments.filter((c) => hasToastPrefixes(c, toastPrefixes)) : [],
    },
];

export const timeoutCallbackUnitOpts = [
    { id: '0', name: '秒', msRate: 1000 },
    { id: '1', name: '分', msRate: 1000 * 60 },
    { id: '2', name: '时', msRate: 1000 * 60 * 60 },
];

export const apiPriorityOpts = [
    { id: 'official', name: '官方API优先' },
    { id: 'custom', name: '自定义API优先' },
];

export const labels = {
    enable: '启用',
};
