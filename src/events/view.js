/**
 * 视图显示/隐藏事件
 */

import { getById } from '../ui/components/common.js';
import { eleIds } from '../config/ele-ids.js';
import { lsKeys, lsGetItem } from '../config/api.js';
import { lsSetItem as storageLsSetItem } from '../core/storage.js';
import { EDE, AppLogAspect, destroyAllInterval } from '../core/index.js';
import { initUI, initListener, initCss } from '../ui/init.js';
import { customeUrl } from '../config/custome-url.js';
import { addEasterEggListener, quickDebug } from './easter-egg.js';
import { onPlaybackStart, onPlaybackStop } from './playback.js';
import { onVideoOsdShow, onVideoOsdHide, appendvideoOsdDanmakuInfo } from './video-osd.js';
import { playbackEventsRefresh, refreshEventListener } from './emby-events.js';
import { loadDanmaku } from '../danmaku/loader.js';
import { buildCurrentDanmakuInfo } from '../ui/tabs/info.js';
import { initH5VideoAdapter, videoTimeUpdateInterval } from './h5-video-adapter.js';

/**
 * 退出播放页时清理
 */
export function beforeDestroy(e) {
    if (e?.detail?.type !== 'video-osd') return;

    if (window.ede?.danmaku) {
        window.ede.danmaku.clear();
    }
    const danmakuCtr = getById(eleIds.danmakuCtr);
    if (danmakuCtr) danmakuCtr.remove();

    videoTimeUpdateInterval(null, false);
    destroyAllInterval();
    storageLsSetItem(lsKeys.timelineOffset.id, lsKeys.timelineOffset.defaultValue);
}

/**
 * 进入播放页时初始化
 */
export function onViewShow(e) {
    console.log(e?.type, e);
    customeUrl.init();

    if (lsGetItem(lsKeys.quickDebugOn.id) && !getById(eleIds.danmakuSettingBtnDebug)) {
        quickDebug();
    }
    addEasterEggListener();

    if (e?.detail?.type === 'video-osd') {
        if (!window.ede) window.ede = new EDE();
        if (!window.ede.appLogAspect && lsGetItem(lsKeys.consoleLogEnable.id)) {
            window.ede.appLogAspect = new AppLogAspect().init();
        }
        initUI();
        initH5VideoAdapter();
        initListener({
            onPlaybackStart,
            onPlaybackStop,
            onVideoOsdShow,
            onVideoOsdHide,
            playbackEventsRefresh,
            refreshEventListener,
            loadDanmaku: (type) =>
                loadDanmaku(type, {
                    buildCurrentDanmakuInfo,
                    appendvideoOsdDanmakuInfo,
                }),
        });
        initCss();
    }

    if (window.ede) {
        window.ede.itemId = e?.detail?.params?.id ? e.detail.params.id : '';
    }
}
