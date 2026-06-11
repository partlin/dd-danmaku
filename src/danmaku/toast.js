/**
 * 弹幕内 Toast 通知
 * 通过弹幕引擎 emit 显示系统通知
 */

import { getByClass } from '../utils/dom.js';
import { classes, styles } from '../config/icons.js';
import { toastPrefixes } from '../config/options.js';
import { mediaQueryStr } from '../config/constants.js';

/**
 * 通过弹幕引擎发送 Toast 消息
 * @param {string} text
 * @param {string} type - 'info'|'success'|'warn'|'error'
 */
export function toastByDanmaku(text, type = 'info') {
    text = toastPrefixes.system + text;

    const videoEl = document.querySelector(mediaQueryStr);
    if (!videoEl || !window.ede?.danmaku) return;

    const fontSizeReferent = getByClass(classes.videoOsdTitle);
    const fontSize = fontSizeReferent
        ? parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', '')) * 1.5
        : 24;
    const color = styles.colors?.[type] ?? 0xffffff;
    const colorStr = `000000${color.toString(16)}ff`.slice(-8);
    const mode = 'top';

    const comment = {
        text,
        mode,
        time: videoEl.currentTime,
        style: {
            fontSize: `${fontSize}px`,
            color: `#${colorStr}`,
            textShadow:
                colorStr === '00000000'
                    ? '-1px -1px #fff, -1px 1px #fff, 1px -1px #fff, 1px 1px #fff'
                    : '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',
            font: `${fontSize}px sans-serif`,
            fillStyle: `#${colorStr}`,
            strokeStyle: colorStr === '00000000' ? '#ffffffff' : '#000000ff',
            lineWidth: 2.0,
        },
    };
    window.ede.danmaku.emit(comment);
}
