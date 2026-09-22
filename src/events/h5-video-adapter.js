/**
 * H5 视频适配器
 * 魔改版客户端（NativePlayer 等）无 <video> 时，创建虚拟 video 并同步播放状态
 * 从 ede.js 5113-5180 行迁移
 */

import { mediaContainerQueryStr, mediaQueryStr } from '../config/constants.js';
import { eleIds } from '../config/ele-ids.js';
import { lsKeys, lsGetItem } from '../config/api.js';
import { OS } from '../utils/platform.js';
import { playbackEventsRefresh } from './emby-events.js';
import { getPlaybackMedia } from '../utils/dom.js';

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
 * 启动虚拟 video 的时间轴，但不等待 play() Promise。
 * 旧版 Electron 的无媒体 video 会让该 Promise 一直 pending，直到页面退出时
 * 被 pause() 打断；等待它会导致后续时间同步和播放器事件绑定永远不执行。
 */
export function startVirtualMediaPlayback(media) {
    if (!media) return;
    try {
        const playResult = media.play();
        playResult?.catch?.((error) => {
            console.warn('虚拟 video 自动播放被拒绝，将继续同步播放器事件:', error);
        });
    } catch (error) {
        console.warn('虚拟 video 自动播放被拒绝，将继续同步播放器事件:', error);
    }
    videoTimeUpdateInterval(media, true);
}

/**
 * 将 libmpv 的真实播放状态同步给弹幕引擎监听的虚拟 video。
 */
export function syncVirtualMediaPlaybackState(media, playerState) {
    if (!media || media.id !== eleIds.h5VideoAdapter) return;
    const isPaused = playerState?.PlayState?.IsPaused;
    if (typeof isPaused !== 'boolean') return;
    media.dispatchEvent(new Event(isPaused ? 'pause' : 'play'));
    videoTimeUpdateInterval(media, !isPaused);
}

/**
 * 当播放页没有 <video> 时，创建虚拟 video 并同步 Native 播放器状态
 */
export async function initH5VideoAdapter() {
    const ede = window.ede;
    const viewGeneration = ede?.viewGeneration;
    const isCurrentView = () =>
        ede && window.ede === ede && ede.viewGeneration === viewGeneration;
    let _media = getPlaybackMedia(
        mediaContainerQueryStr,
        mediaQueryStr,
        eleIds.h5VideoAdapter
    );
    if (_media && _media.id !== eleIds.h5VideoAdapter) return;

    if (!_media) {
        console.log('播放页不存在 video 标签,适配器处理开始');
        _media = document.createElement('video');
        if (OS.isApple()) {
            _media.src = '';
        }
        _media.style.display = 'none';
        _media.id = eleIds.h5VideoAdapter;
        _media.classList.add('htmlvideoplayer', 'moveUpSubtitles');
        document.body.prepend(_media);
    }

    startVirtualMediaPlayback(_media);
    if (!isCurrentView()) {
        videoTimeUpdateInterval(_media, false);
        _media.remove();
        return;
    }

    if (typeof require !== 'function') {
        console.warn('initH5VideoAdapter: require 不可用，跳过 playbackManager 同步');
        return;
    }

    const [playbackManager] = await require(['playbackManager']);
    if (!isCurrentView()) {
        videoTimeUpdateInterval(_media, false);
        _media.remove();
        return;
    }
    await playbackEventsRefresh({
        timeupdate: () => {
            const realCurrentTime =
                playbackManager.currentTime(playbackManager.getCurrentPlayer()) / 1e7;
            const mediaTime = _media.currentTime;
            _media.currentTime = realCurrentTime;
            const embyPlaybackRate = playbackManager.getPlayerState?.()?.PlayState?.PlaybackRate;
            _media.playbackRate = embyPlaybackRate || 1;
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
        pause: () => {
            console.warn('pause');
            syncVirtualMediaPlaybackState(_media, { PlayState: { IsPaused: true } });
        },
        unpause: () => {
            console.warn('unpause');
            syncVirtualMediaPlaybackState(_media, { PlayState: { IsPaused: false } });
        },
    });

    console.log('已创建虚拟 video 标签,适配器处理正确结束');
}
