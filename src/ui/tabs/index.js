/**
 * UI Tabs 统一导出与 danmakuTabOpts
 */

import { currentDanmakuInfoContainerId, tabIframeId } from '../../config/options.js';
import { buildDanmakuSetting } from './setting.js';
import { buildSearchEpisode } from './search.js';
import { buildCurrentDanmakuInfo } from './info.js';
import { buildProSetting } from './pro.js';
import { buildAbout } from './about.js';

function buildIframe(containerId) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '<iframe id="' + tabIframeId + '" style="width:100%;height:100%;"></iframe>';
}

export const danmakuTabOpts = [
    { id: 'danmakuTab0', name: '弹幕设置', buildMethod: buildDanmakuSetting },
    { id: 'danmakuTab1', name: '手动匹配', buildMethod: buildSearchEpisode },
    { id: currentDanmakuInfoContainerId, name: '弹幕信息', buildMethod: buildCurrentDanmakuInfo },
    { id: 'danmakuTab3', name: '高级设置', buildMethod: buildProSetting },
    { id: 'danmakuTab4', name: '关于', buildMethod: buildAbout },
    { id: tabIframeId, name: '内嵌网页', hidden: true, buildMethod: buildIframe },
];

export { buildDanmakuSetting, buildSearchEpisode, buildCurrentDanmakuInfo, buildProSetting, buildAbout };
