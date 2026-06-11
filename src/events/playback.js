/**
 * 播放事件处理
 */

import { lsGetItem, lsKeys } from '../config/api.js';
import { loadDanmaku } from '../danmaku/loader.js';
import { LOAD_TYPE } from '../config/constants.js';
import { putBangumiEpStatus } from '../bangumi/api.js';
import { embyToast } from '../ui/dialog.js';
import { removeHeaderClock } from './video-osd.js';
import { danmakuAutoFilterCancel } from '../danmaku/filter.js';

/**
 * 播放停止时按百分比处理（Bangumi 提交等）
 */
export function onPlaybackStopPct(e, state) {
    if (!state?.NowPlayingItem) return console.log('跳过 Web 端自身错误触发的第二次播放停止事件');
    console.log(e?.type);
    const positionTicks = state.PlayState?.PositionTicks;
    const runtimeTicks = state.NowPlayingItem.RunTimeTicks;
    if (!runtimeTicks) return console.log('无可播放时长,跳过处理');
    const pct = parseInt((positionTicks / runtimeTicks) * 100);
    console.log(`结束播放百分比: ${pct}%`);
    const bangumiPostPercent = lsGetItem(lsKeys.bangumiPostPercent.id);
    const bangumiToken = lsGetItem(lsKeys.bangumiToken.id);
    if (
        lsGetItem(lsKeys.bangumiEnable.id) &&
        bangumiToken &&
        pct >= bangumiPostPercent &&
        window.ede?.episode_info?.episodeId
    ) {
        const { animeTitle, episodeTitle } = window.ede.episode_info;
        const targetName = `${animeTitle} - ${episodeTitle}`;
        putBangumiEpStatus(bangumiToken)
            .then(() => {
                embyToast({
                    text: `putBangumiEpStatus 成功, 目标: ${targetName}, 结束播放百分比: ${pct}%`,
                });
            })
            .catch((error) => {
                embyToast({ text: `putBangumiEpStatus 失败, 目标: ${targetName}, ${error.message}` });
            });
    }
}

/**
 * 播放开始
 */
export function onPlaybackStart(e, state) {
    console.log(e?.type);
    loadDanmaku(LOAD_TYPE.INIT);
}

/**
 * 播放停止
 */
export function onPlaybackStop(e, state) {
    console.log(e?.type);
    onPlaybackStopPct(e, state);
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
        removeHeaderClock();
    }
    danmakuAutoFilterCancel();
}
