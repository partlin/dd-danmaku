/**
 * 播放 OSD 显示/隐藏事件
 */

import { getById, getByClass } from '../ui/components/common.js';
import { lsKeys, lsGetItem } from '../config/api.js';
import { eleIds } from '../config/ele-ids.js';
import { classes } from '../config/icons.js';
import { mediaContainerQueryStr } from '../config/constants.js';
import { buildProgressBarChart } from '../danmaku/chart.js';
import { destroyAllInterval } from '../core/index.js';
import { getDanmakuComments } from '../config/options.js';

/**
 * 播放界面右下角显示弹幕信息（弹幕：xxx条 / 未匹配）
 * 从 ede.js 4116-4140 行迁移
 * @param {number} [loadSum] - 已加载弹幕数量，不传时从 window.ede 计算
 */
export function appendvideoOsdDanmakuInfo(loadSum) {
    if (!lsGetItem(lsKeys.osdTitleEnable.id)) return;

    const episode_info = window.ede?.episode_info || {};
    const { episodeId, animeTitle, episodeTitle } = episode_info;
    const videoOsdContainer = document.querySelector(
        `${mediaContainerQueryStr} .videoOsdSecondaryText`
    );
    let videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
    if (!videoOsdDanmakuTitle) {
        videoOsdDanmakuTitle = document.createElement('h3');
        videoOsdDanmakuTitle.id = eleIds.videoOsdDanmakuTitle;
        videoOsdDanmakuTitle.classList.add(classes.videoOsdTitle);
        videoOsdDanmakuTitle.style.cssText =
            'margin-left: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; position: absolute; right: 0px; bottom: 0px;';
    }
    let text = '弹幕：';
    if (episodeId) {
        const count = loadSum ?? (window.ede ? getDanmakuComments(window.ede).length : 0);
        text += `${animeTitle} - ${episodeTitle} - ${count}条`;
    } else {
        text += '未匹配';
    }
    videoOsdDanmakuTitle.innerText = text;
    if (videoOsdContainer) {
        videoOsdContainer.append(videoOsdDanmakuTitle);
    }
}

export function addHeaderClock() {
    const warpper = getByClass('headerMiddle');
    let headerClockEle = getById('headerClock');
    if (!warpper) return;
    if (headerClockEle) headerClockEle.remove();

    const clockElement = document.createElement('div');
    clockElement.id = 'headerClock';
    warpper.append(clockElement);

    function updateClock() {
        clockElement.textContent = new Date().toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    if (window.ede?.destroyIntervalIds) {
        window.ede.destroyIntervalIds.push(intervalId);
    }
}

export function removeHeaderClock() {
    const headerClockEle = getById('headerClock');
    if (headerClockEle) headerClockEle.remove();
    destroyAllInterval();
}

export function onVideoOsdShow(e) {
    console.log(e?.type, e);
    if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
        buildProgressBarChart(20);
    }
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
        addHeaderClock();
    }
    // 播放界面右下角弹幕信息：OSD 显示时刷新，解决新视频播放时 .videoOsdSecondaryText 尚未渲染导致未展示的问题
    if (lsGetItem(lsKeys.osdTitleEnable.id)) {
        appendvideoOsdDanmakuInfo();
    }
}

export function onVideoOsdHide(e) {
    console.log(e?.type, e);
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
        removeHeaderClock();
    }
}
