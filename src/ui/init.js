/**
 * UI 初始化
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { getById, getByClass } from './components/common.js';
import { embyButton } from './components/index.js';
import { createDialog } from './dialog.js';
import { getActiveMedia, getActiveMediaContainer, isElementVisible, waitForElement } from '../utils/dom.js';
import { eleIds } from '../config/ele-ids.js';
import { lsKeys, lsGetItem } from '../config/api.js';
import { lsSetItem } from '../core/storage.js';
import { iconKeys } from '../config/icons.js';
import { classes } from '../config/icons.js';
import { styles } from '../config/icons.js';
import {
    check_interval,
    mediaContainerQueryStr,
    setMediaContainerQueryStr,
    notHide,
    setVersionOld,
    mediaQueryStr,
} from '../config/constants.js';
import { OS } from '../utils/platform.js';

const mediaBtnOpts = [
    {
        id: eleIds.danmakuSwitchBtn,
        label: '弹幕开关',
        iconKey: iconKeys.comment,
        onClick: doDanmakuSwitch,
    },
    {
        label: '弹幕设置',
        iconKey: iconKeys.setting,
        onClick: () => createDialog(),
    },
];

function isOldEmbyServer() {
    if (typeof ApiClient === 'undefined') return false;
    if (typeof ApiClient.isMinServerVersion === 'function') {
        return !ApiClient.isMinServerVersion('4.8.0.0');
    }
    const parts = String(ApiClient.serverVersion?.() || '')
        .split('.')
        .map((part) => Number.parseInt(part, 10) || 0);
    return (parts[0] || 0) < 4 || ((parts[0] || 0) === 4 && (parts[1] || 0) < 8);
}

export function getActiveViewRoot() {
    return getActiveMediaContainer(mediaContainerQueryStr);
}

/**
 * Emby SPA 会暂留带 page-hidden 的旧 OSD；不能只排除 hide。
 */
export function isViewRootActive(viewRoot) {
    return isElementVisible(viewRoot);
}

function doDanmakuSwitch() {
    const flag = !lsGetItem(lsKeys.switch.id);
    lsSetItem(lsKeys.switch.id, flag);
    if (window.ede?.danmaku) {
        flag ? window.ede.danmaku.show() : window.ede.danmaku.hide();
    }
    const osdDanmakuSwitchBtn = getById(eleIds.danmakuSwitchBtn);
    if (osdDanmakuSwitchBtn) {
        osdDanmakuSwitchBtn.firstChild.innerHTML = flag ? iconKeys.comment : iconKeys.comments_disabled;
    }
    const switchElement = getById(eleIds.danmakuSwitch);
    if (switchElement) {
        switchElement.firstChild.innerHTML = flag ? iconKeys.switch_on : iconKeys.switch_off;
        switchElement.style.color = flag ? styles.colors.switchActiveColor : '';
    }
}

/**
 * 初始化播放页弹幕按钮等 UI
 */
export function initUI() {
    const ede = window.ede;
    const viewGeneration = ede?.viewGeneration;
    console.log('正在初始化UI');

    if (isOldEmbyServer()) {
        setMediaContainerQueryStr('div[data-type="video-osd"]');
        setVersionOld(true);
    }

    const waitHandle = waitForElement(
        () => getActiveViewRoot()?.querySelector('.videoOsdBottom-maincontrols'),
        (wrapper) => {
            const viewRoot = getActiveViewRoot();
            if (!isViewUiSessionCurrent(ede, viewGeneration, viewRoot) || !viewRoot.contains(wrapper)) {
                return;
            }
            ede.currentViewRoot = viewRoot;
            ede.viewRoots.set(viewGeneration, viewRoot);

            const existingCtr = getById(eleIds.danmakuCtr, viewRoot);
            if (existingCtr) {
                existingCtr.setAttribute('data-ede-view-generation', String(viewGeneration));
                return;
            }
            let commonWrapper = getByClass(classes.videoOsdBottomButtons + notHide, wrapper);
            if (commonWrapper) {
                wrapper = commonWrapper;
            } else {
                wrapper = getByClass(classes.videoOsdBottomButtonsTopRight, wrapper);
            }
            if (!wrapper || !isViewUiSessionCurrent(ede, viewGeneration, viewRoot)) return;
            const rightButtons = getByClass(classes.videoOsdBottomButtonsRight, wrapper);
            const menubar = document.createElement('div');
            menubar.id = eleIds.danmakuCtr;
            menubar.setAttribute('data-ede-view-generation', String(viewGeneration));
            if (!window.ede?.episode_info) {
                menubar.style.opacity = '0.5';
            }
            if (rightButtons) {
                wrapper.insertBefore(menubar, rightButtons);
            } else {
                wrapper.append(menubar);
            }
            mediaBtnOpts.forEach((opt) => {
                menubar.appendChild(embyButton(opt, opt.onClick));
            });
            console.log('UI初始化完成');
        },
        0,
        check_interval,
        window.ede?.destroyIntervalIds
    );
    if (ede && viewGeneration != null) {
        const previous = ede.uiWaitHandles.get(viewGeneration);
        previous?.cancel?.();
        ede.uiWaitHandles.set(viewGeneration, waitHandle);
        waitHandle.finally(() => {
            if (ede.uiWaitHandles.get(viewGeneration) === waitHandle) {
                ede.uiWaitHandles.delete(viewGeneration);
            }
        });
    }
}

/**
 * 当前播放页会话是否仍可以操作指定 OSD。
 */
export function isViewUiSessionCurrent(ede, viewGeneration, viewRoot) {
    if (!ede || ede.viewGeneration !== viewGeneration || !viewRoot) return false;
    return isViewRootActive(viewRoot);
}

/**
 * 只清理指定播放页会话的 UI，避免延迟的 viewbeforehide 误删新页面按钮。
 */
export function cleanupViewUI(ede, viewGeneration) {
    if (!ede || viewGeneration == null) return;
    ede.uiWaitHandles?.get(viewGeneration)?.cancel?.();
    ede.uiWaitHandles?.delete(viewGeneration);

    const viewRoot = ede.viewRoots?.get(viewGeneration);
    const controls = viewRoot?.querySelectorAll?.(`#${eleIds.danmakuCtr}`) || [];
    Array.from(controls).forEach((control) => {
        if (control.getAttribute('data-ede-view-generation') === String(viewGeneration)) {
            control.remove();
        }
    });
    ede.viewRoots?.delete(viewGeneration);
    if (ede.viewGeneration === viewGeneration && ede.currentViewRoot === viewRoot) {
        ede.currentViewRoot = null;
    }
}

/**
 * 初始化播放事件监听
 * @param {object} [handlers] - { onPlaybackStart, onPlaybackStop, onVideoOsdShow, onVideoOsdHide, playbackEventsRefresh, refreshEventListener, loadDanmaku }
 */
export function initListener(handlers = {}) {
    const _media = getActiveMedia(mediaContainerQueryStr, mediaQueryStr)
        || document.getElementById(eleIds.h5VideoAdapter);
    if (!_media) {
        if (window.ede?.episode_info) window.ede.episode_info = null;
        return;
    }
    const alreadyListening = _media.getAttribute('ede_listening') === 'true';
    console.log('正在初始化Listener');

    if (handlers.playbackEventsRefresh && handlers.onPlaybackStart) {
        handlers.playbackEventsRefresh({ playbackstart: handlers.onPlaybackStart });
    }
    if (handlers.playbackEventsRefresh && handlers.onPlaybackStop) {
        handlers.playbackEventsRefresh({ playbackstop: handlers.onPlaybackStop });
    }
    _media.setAttribute('ede_listening', 'true');
    if (window.ede) window.ede.listeningMedia = _media;

    if (handlers.refreshEventListener) {
        if (handlers.onVideoOsdShow) handlers.refreshEventListener({ 'video-osd-show': handlers.onVideoOsdShow });
        if (handlers.onVideoOsdHide) handlers.refreshEventListener({ 'video-osd-hide': handlers.onVideoOsdHide });
    }

    console.log('Listener初始化完成');

    if (alreadyListening) return;

    if ((OS.isAndroidEmbyNoisyX?.() || OS.isEmbyUWP?.()) && handlers.loadDanmaku) {
        handlers.loadDanmaku('init');
    }
}

/**
 * 初始化样式（修复小秘版 toast 等）
 */
export function initCss() {
    if (OS.isEmbyNoisyX && OS.isEmbyNoisyX()) {
        const existingStyle = document.querySelector('style[css-emby-noisyx-fix]');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.setAttribute('css-emby-noisyx-fix', '');
            style.innerHTML = `
                [class*="accent-"].noScrollY.transparentDocument .toast-group {
                    position: fixed;
                    top: auto;
                }
            `;
            document.head.appendChild(style);
        }
    }
}
