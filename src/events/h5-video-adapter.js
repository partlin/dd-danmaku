/**
 * H5 视频适配器
 * 魔改版客户端（NativePlayer 等）无 <video> 时，创建虚拟 video 并同步播放状态
 * 从 ede.js 5113-5180 行迁移
 */

import { mediaQueryStr } from '../config/constants.js';
import { eleIds } from '../config/ele-ids.js';
import { lsKeys, lsGetItem } from '../config/api.js';
import { OS } from '../utils/platform.js';
import { playbackEventsRefresh } from './emby-events.js';

/**
 * 平滑补充 <video> timeupdate 中秒级间隔缺失的 100ms 间隙
 * @param {HTMLVideoElement|null} media - video 元素，null 时自动查询
 * @param {boolean} enable - 是否启用
 */
export function videoTimeUpdateInterval(media, enable) {
    const _media = media || document.querySelector(mediaQueryStr);
    if (!_media) return;
    if (enable && !_media.timeupdateIntervalId) {
        _media.timeupdateIntervalId = setInterval(() => {
            _media.currentTime += 100 / 1e3;
        }, 100);
    } else if (!enable && _media.timeupdateIntervalId) {
        clearInterval(_media.timeupdateIntervalId);
        _media.timeupdateIntervalId = null;
    }
}

/**
 * 当播放页没有 <video> 时，创建虚拟 video 并同步 Native 播放器状态
 */
export async function initH5VideoAdapter() {
    let _media = document.querySelector(mediaQueryStr);
    if (_media) {
        if (_media.id === eleIds.h5VideoAdapter) {
            videoTimeUpdateInterval(_media, true);
        }
        return;
    }

    console.log('播放页不存在 video 标签,适配器处理开始');
    _media = document.createElement('video');
    if (OS.isApple()) {
        _media.src = '';
    }
    _media.style.display = 'none';
    _media.id = eleIds.h5VideoAdapter;
    _media.classList.add('htmlvideoplayer', 'moveUpSubtitles');
    document.body.prepend(_media);

    _media.play();
    videoTimeUpdateInterval(_media, true);

    if (typeof require !== 'function') {
        console.warn('initH5VideoAdapter: require 不可用，跳过 playbackManager 同步');
        return;
    }

    require(['playbackManager'], (playbackManager) => {
        playbackEventsRefresh({
            timeupdate: () => {
                const realCurrentTime =
                    playbackManager.currentTime(playbackManager.getCurrentPlayer()) / 1e7;
                const mediaTime = _media.currentTime;
                _media.currentTime = realCurrentTime;
                const embyPlaybackRate =
                    playbackManager.getPlayerState?.()?.PlayState?.PlaybackRate;
                _media.playbackRate = embyPlaybackRate ? embyPlaybackRate : 1;
                if (Math.abs(mediaTime - realCurrentTime) > 2) {
                    _media.dispatchEvent(new Event('seeking'));
                    console.warn('seeking', realCurrentTime, mediaTime);
                }
                if (lsGetItem(lsKeys.debugH5VideoAdapterEnable.id)) {
                    console.warn(
                        `${eleIds.h5VideoAdapter}, currentTime: ${_media.currentTime}, playbackRate: ${_media.playbackRate}`
                    );
                }
            },
        });
    });

    playbackEventsRefresh({
        pause: () => {
            console.warn('pause');
            _media.dispatchEvent(new Event('pause'));
            videoTimeUpdateInterval(_media, false);
        },
        unpause: () => {
            console.warn('unpause');
            _media.dispatchEvent(new Event('play'));
            videoTimeUpdateInterval(_media, true);
        },
    });

    console.log('已创建虚拟 video 标签,适配器处理正确结束');
}
