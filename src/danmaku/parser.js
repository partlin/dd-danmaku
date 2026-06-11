/**
 * 弹幕解析与样式
 */

import { lsGetItem, lsKeys } from '../config/api.js';
import { getByClass } from '../utils/dom.js';
import { classes, styles } from '../config/icons.js';
import { danmakuSource, showSource } from '../config/options.js';

/**
 * 解析弹幕数据为引擎格式
 * @param {object[]} $obj - 原始弹幕数组 { p, m, cid }
 * @returns {object[]}
 */
export function danmakuParser($obj) {
    const fontSizeRate = lsGetItem(lsKeys.fontSizeRate.id);
    let fontSize = 25;
    const fontSizeReferent = getByClass(classes.videoOsdTitle);
    if (fontSizeReferent) {
        fontSize = parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', '')) * fontSizeRate;
    } else {
        fontSize = Math.round(
            ((window.screen.height > window.screen.width ? window.screen.width : window.screen.height) / 1080) *
                18 *
                fontSizeRate
        );
    }
    const fontWeight = lsGetItem(lsKeys.fontWeight.id);
    const fontStyle = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)]?.id || 'normal';
    const fontFamily = lsGetItem(lsKeys.fontFamily.id);
    const fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255)
        .toString(16)
        .padStart(2, '0');
    const timelineOffset = lsGetItem(lsKeys.timelineOffset.id);
    const sourceUidReg = /\[(.*)\](.*)/;
    const showSourceIds = lsGetItem(lsKeys.showSource.id) || [];

    return $obj
        .map(($comment) => {
            const p = $comment.p;
            const values = p.split(',');
            const mode = { 6: 'ltr', 1: 'rtl', 5: 'top', 4: 'bottom' }[values[1]];
            if (!mode) return null;

            const baseColor = Number(values[2]).toString(16).padStart(6, '0');
            const color = `${baseColor}${fontOpacity}`;
            const shadowColor = baseColor === '000000' ? `#ffffff${fontOpacity}` : `#000000${fontOpacity}`;
            const sourceUidMatches = values[3]?.match(sourceUidReg);
            const sourceId =
                sourceUidMatches?.[1] ? sourceUidMatches[1] : danmakuSource.DanDanPlay?.id || 'DanDanPlay';
            const originalUserId = sourceUidMatches?.[2] ? sourceUidMatches[2] : values[3];

            const cmt = {
                text: $comment.m,
                mode,
                time: values[0] * 1 + timelineOffset,
                style: getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily),
                [showSource.cid.id]: $comment.cid,
                [showSource.source.id]: sourceId,
                [showSource.originalUserId.id]: originalUserId,
            };
            if (showSourceIds.length > 0) {
                cmt.originalText = cmt.text;
                cmt.text += showSourceIds
                    .map((id) => (id === showSource.source.id ? `,[${cmt[id]}]` : ',' + cmt[id]))
                    .join('');
            }
            cmt.cuid = cmt[showSource.cid.id] + ',' + cmt[showSource.originalUserId.id];
            return cmt;
        })
        .filter((x) => x)
        .sort((a, b) => a.time - b.time);
}

/**
 * 获取弹幕样式对象
 */
export function getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily) {
    return {
        color: `#${color}`,
        textShadow: `-1px -1px ${shadowColor}, -1px 1px ${shadowColor}, 1px -1px ${shadowColor}, 1px 1px ${shadowColor}`,
        font: `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`,
        fillStyle: `#${color}`,
        strokeStyle: shadowColor,
        lineWidth: 2.0,
    };
}
