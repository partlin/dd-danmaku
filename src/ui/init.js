/**
 * UI 初始化
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { getById, getByClass } from './components/common.js';
import { embyButton } from './components/index.js';
import { createDialog } from './dialog.js';
import { waitForElement } from '../utils/dom.js';
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
    if (getById(eleIds.danmakuCtr)) return;
    console.log('正在初始化UI');

    if (typeof ApiClient !== 'undefined' && parseFloat(ApiClient.serverVersion()) < 4.8) {
        setMediaContainerQueryStr('div[data-type="video-osd"]');
        setVersionOld(true);
    }

    const queryStr =
        mediaContainerQueryStr + (mediaContainerQueryStr.includes(notHide) ? '' : notHide);
    const ctrlWrapperQueryStr = `${queryStr} .videoOsdBottom-maincontrols`;
    waitForElement(
        ctrlWrapperQueryStr,
        (wrapper) => {
            let commonWrapper = getByClass(classes.videoOsdBottomButtons + notHide, wrapper);
            if (commonWrapper) {
                wrapper = commonWrapper;
            } else {
                wrapper = getByClass(classes.videoOsdBottomButtonsTopRight, wrapper);
            }
            const rightButtons = getByClass(classes.videoOsdBottomButtonsRight, wrapper);
            const menubar = document.createElement('div');
            menubar.id = eleIds.danmakuCtr;
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
}

/**
 * 初始化播放事件监听
 * @param {object} [handlers] - { onPlaybackStart, onPlaybackStop, onVideoOsdShow, onVideoOsdHide, playbackEventsRefresh, refreshEventListener, loadDanmaku }
 */
export function initListener(handlers = {}) {
    const _media = document.querySelector(mediaQueryStr);
    if (!_media) {
        if (window.ede?.episode_info) window.ede.episode_info = null;
        return;
    }
    if (_media.getAttribute('ede_listening')) return;
    console.log('正在初始化Listener');

    if (handlers.playbackEventsRefresh && handlers.onPlaybackStart) {
        handlers.playbackEventsRefresh({ playbackstart: handlers.onPlaybackStart });
    }
    if (handlers.playbackEventsRefresh && handlers.onPlaybackStop) {
        handlers.playbackEventsRefresh({ playbackstop: handlers.onPlaybackStop });
    }
    _media.setAttribute('ede_listening', 'true');

    if (handlers.refreshEventListener) {
        if (handlers.onVideoOsdShow) handlers.refreshEventListener({ 'video-osd-show': handlers.onVideoOsdShow });
        if (handlers.onVideoOsdHide) handlers.refreshEventListener({ 'video-osd-hide': handlers.onVideoOsdHide });
    }

    console.log('Listener初始化完成');

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
