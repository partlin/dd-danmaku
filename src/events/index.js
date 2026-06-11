/**
 * 事件模块统一导出
 */

export { onPlaybackStart, onPlaybackStop, onPlaybackStopPct } from './playback.js';
export {
    onVideoOsdShow,
    onVideoOsdHide,
    addHeaderClock,
    removeHeaderClock,
    appendvideoOsdDanmakuInfo,
} from './video-osd.js';
export { onViewShow, beforeDestroy } from './view.js';
export { addEasterEggListener, quickDebug, checkRuntimeVars } from './easter-egg.js';
export { playbackEventsRefresh, refreshEventListener } from './emby-events.js';
export { initH5VideoAdapter, videoTimeUpdateInterval } from './h5-video-adapter.js';
