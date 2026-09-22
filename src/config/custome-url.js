/**
 * 自定义 URL 配置（从 localStorage 应用用户设置）
 */

import { lsGetItem, lsKeys, openSourceLicense, dandanplayApi } from './api.js';
import { eleIds } from './ele-ids.js';
import * as userConfig from '../user-config.js';

const customeUrlMsg1 = '限弹弹 play API 兼容结构';

// 兼容历史高级配置：用户可在 localStorage 中保存模板字符串。
// 此入口刻意集中保留动态执行，调用方只传入下列白名单变量；不要用于任何远端响应内容。
function evaluateLegacyUrlTemplate(template, variables) {
    const { episodeId, chConvert, url, animeId } = variables;
    return eval('`' + template + '`');
}

export const customeUrl = {
    init: () => {
        customeUrl.mapping.forEach((obj) => obj.rewrite(lsGetItem(obj.lsKey.id)));
    },
    mapping: [
        {
            divId: eleIds.customeDanmakuDiv,
            lsKey: lsKeys.customeDanmakuUrl,
            rewrite: (tl) => userConfig.setRequireDanmakuPath(tl),
            msg1: `限 ${openSourceLicense.danmaku.url} 兼容结构`,
            msg2: `Danmaku 依赖路径,index.html 引入的和篡改猴环境不会使用到,依赖已内置,
                    仅在被 CustomCssJS 执行的特殊环境下使用,支持相对/绝对/网络路径,
                    默认是相对路径等同 https://emby/web/ 和 /system/dashboard-ui/ ,非浏览器客户端必须使用网络路径`,
        },
        {
            divId: eleIds.customeCorsProxyDiv,
            lsKey: lsKeys.customeCorsProxyUrl,
            rewrite: (tl) => userConfig.setCorsProxy(tl),
            msg1: '仅弹弹 play API 跨域使用,限 URL 前缀反代方式,例如 cf_worker',
            msg2: '以下共用变量: { dandanplayApi.prefix: 反代前缀拼接的弹弹 play API 路径前缀, }',
        },
        {
            divId: eleIds.customeGetCommentDiv,
            lsKey: lsKeys.customeGetCommentUrl,
            rewrite: (tl) => {
                dandanplayApi.getComment = (episodeId, chConvert) =>
                    evaluateLegacyUrlTemplate(tl, { episodeId, chConvert });
            },
            msg1: customeUrlMsg1,
            msg2: '变量: { episodeId: 章节 ID, chConvert: 简繁转换, }',
        },
        {
            divId: eleIds.customeGetExtcommentDiv,
            lsKey: lsKeys.customeGetExtcommentUrl,
            rewrite: (tl) => {
                dandanplayApi.getExtcomment = (url) => evaluateLegacyUrlTemplate(tl, { url });
            },
            msg1: customeUrlMsg1,
            msg2: '变量: { url: 附加弹幕输入框中的网址, }',
        },
        {
            divId: eleIds.customePosterImgDiv,
            lsKey: lsKeys.customePosterImgUrl,
            rewrite: (tl) => {
                dandanplayApi.posterImg = (animeId) => evaluateLegacyUrlTemplate(tl, { animeId });
            },
            msg1: customeUrlMsg1,
            msg2: '变量: { animeId: 弹弹 play 的作品 ID, }',
        },
    ],
};
