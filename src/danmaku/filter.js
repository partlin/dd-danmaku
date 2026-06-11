/**
 * 弹幕过滤逻辑
 */

import { lsGetItem, lsKeys } from '../config/api.js';
import { lsSetItem } from '../core/storage.js';
import { objectEntries } from '../utils/helpers.js';
import { danmakuTypeFilterOpts, showSource } from '../config/options.js';
import { emojiRegex } from '../config/constants.js';
import { similarityPercentage } from '../match/similarity.js';

/** 过滤弹幕类型 */
export function danmakuTypeFilter(comments) {
    let idArray = lsGetItem(lsKeys.typeFilter.id) || [];
    let _comments = [...comments];

    if (idArray.includes(danmakuTypeFilterOpts.onlyWhite.id)) {
        _comments = _comments.filter((c) => '#ffffff' === (c.style?.color || '').toLowerCase().slice(0, 7));
        idArray = idArray.filter((id) => id !== danmakuTypeFilterOpts.onlyWhite.id);
    }
    if (idArray.includes(danmakuTypeFilterOpts.rolling.id)) {
        _comments = _comments.filter(
            (c) => danmakuTypeFilterOpts.ltr.id !== c.mode && danmakuTypeFilterOpts.rtl.id !== c.mode
        );
        idArray = idArray.filter((id) => id !== danmakuTypeFilterOpts.rolling.id);
    }
    if (idArray.includes(danmakuTypeFilterOpts.emoji.id)) {
        _comments = _comments.filter((c) => !emojiRegex.test(c.text || ''));
        idArray = idArray.filter((id) => id !== danmakuTypeFilterOpts.emoji.id);
    }
    if (idArray.length > 0) {
        _comments = _comments.filter((c) => !idArray.includes(c.mode));
    }
    return _comments;
}

/** 过滤弹幕来源平台 */
export function danmakuSourceFilter(comments) {
    const sourceFilter = lsGetItem(lsKeys.sourceFilter.id) || [];
    return comments.filter((c) => !sourceFilter.includes(c.source));
}

/** 过滤弹幕密度等级 */
export function danmakuDensityLevelFilter(comments) {
    const level = lsGetItem(lsKeys.filterLevel.id);
    if (level === 0) return comments;

    const limit = 9 - level * 2;
    const vertical_limit = 6;
    const arr_comments = [];
    const vertical_comments = [];

    for (let index = 0; index < comments.length; index++) {
        const element = { ...comments[index] };
        const i = Math.ceil(element.time);
        const i_v = Math.ceil(element.time / 3);

        if (!arr_comments[i]) arr_comments[i] = [];
        if (!vertical_comments[i_v]) vertical_comments[i_v] = [];

        if (vertical_comments[i_v].length < vertical_limit) {
            vertical_comments[i_v].push(element);
        } else {
            element.mode = 'rtl';
        }
        if (arr_comments[i].length < limit) {
            arr_comments[i].push(element);
        }
    }
    return arr_comments.flat();
}

/** 通过屏蔽关键词过滤弹幕 */
export function danmakuKeywordsFilter(comments) {
    if (!lsGetItem(lsKeys.filterKeywordsEnable.id)) return comments;
    const keywords = (lsGetItem(lsKeys.filterKeywords.id) || '')
        .split(/\r?\n/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0 && !k.startsWith('// '));
    if (keywords.length === 0) return comments;

    const cKeys = ['text', ...Object.keys(showSource)];
    return comments.filter(
        (comment) =>
            !keywords.some((keyword) => {
                try {
                    return cKeys.some((key) => new RegExp(keyword).test(comment[key] || ''));
                } catch (error) {
                    return cKeys.some((key) => (comment[key] || '').includes(keyword));
                }
            })
    );
}

/** 相似弹幕合并 */
export function danmakuMergeSimilar(comments, threshold = 50, timeWindow = 15) {
    if (!lsGetItem(lsKeys.mergeSimilarEnable.id)) return comments;

    const mergedComments = [];
    const mergedIndexes = [];
    const startTime = Date.now();

    for (let i = 0; i < comments.length; i++) {
        if (mergedIndexes.includes(i)) continue;

        let mergedComment = { ...comments[i] };
        let count = 1;
        let totalSimilarity = 0;

        for (
            let j = i + 1;
            j < comments.length && Math.abs(comments[j].time - comments[i].time) <= timeWindow;
            j++
        ) {
            if (mergedIndexes.includes(j)) continue;
            const sim = similarityPercentage(mergedComment.text || '', comments[j].text || '');
            if (sim >= threshold) {
                count++;
                mergedIndexes.push(j);
                totalSimilarity += sim;
            }
        }

        if (count > 1) {
            mergedComment.text = (mergedComment.text || '') + ` [x${count}]`;
            mergedComment.xCount = count;
            mergedComment.xTotalSimilarity = totalSimilarity / count;
        }
        mergedComments.push(mergedComment);
    }

    console.log(`danmakuMergeSimilar 耗时: ${Date.now() - startTime} 毫秒`);
    return mergedComments;
}

/** 自动过滤（弹幕数超阈值时调整设置） */
export function danmakuAutoFilter(comments) {
    const autoFilterCount = lsGetItem(lsKeys.autoFilterCount.id);
    if (autoFilterCount === 0 || comments.length < autoFilterCount) {
        return danmakuAutoFilterCancel();
    }
    let msg = `检测到 ${comments.length} 条弹幕 > ${lsKeys.autoFilterCount.name}:${autoFilterCount},准备开始自动过滤(单集有效)`;
    const initMsgLength = msg.length;
    const heightPercent = lsGetItem(lsKeys.heightPercent.id);
    if (heightPercent > 90 && window.ede?.tempLsValues !== undefined) {
        window.ede.tempLsValues[lsKeys.heightPercent.id] = heightPercent;
        lsSetItem(lsKeys.heightPercent.id, 90);
        msg += `\n已自动调整 ${lsKeys.heightPercent.name}:90`;
    }
    const typeFilter = lsGetItem(lsKeys.typeFilter.id) || [];
    if (!typeFilter.includes(danmakuTypeFilterOpts.bottom.id) && window.ede?.tempLsValues !== undefined) {
        window.ede.tempLsValues[lsKeys.typeFilter.id] = typeFilter;
        lsSetItem(lsKeys.typeFilter.id, [...typeFilter, danmakuTypeFilterOpts.bottom.id]);
        msg += `\n已自动添加 ${lsKeys.typeFilter.name}:${danmakuTypeFilterOpts.bottom.name}`;
    }
    const mergeSimilarEnable = lsGetItem(lsKeys.mergeSimilarEnable.id);
    if (!mergeSimilarEnable && window.ede?.tempLsValues !== undefined) {
        window.ede.tempLsValues[lsKeys.mergeSimilarEnable.id] = mergeSimilarEnable;
        lsSetItem(lsKeys.mergeSimilarEnable.id, true);
        msg += `\n已自动调整 ${lsKeys.mergeSimilarEnable.name}:true`;
    }
    if (msg.length !== initMsgLength) {
        console.log(msg);
        if (typeof window.embyToast === 'function') window.embyToast({ text: msg });
    }
}

/** 取消自动过滤，恢复用户设置 */
export function danmakuAutoFilterCancel() {
    if (window.ede?.tempLsValues && Object.keys(window.ede.tempLsValues).length > 0) {
        objectEntries(window.ede.tempLsValues).forEach(([key, val]) => lsSetItem(key, val));
        window.ede.tempLsValues = {};
        console.log('从临时值恢复用户值并重置');
    }
}

/** 组合所有过滤 */
export function danmakuFilter(comments) {
    let _comments = [...comments];
    danmakuAutoFilter(_comments);
    _comments = danmakuTypeFilter(_comments);
    _comments = danmakuSourceFilter(_comments);
    _comments = danmakuDensityLevelFilter(_comments);
    _comments = danmakuKeywordsFilter(_comments);
    _comments = danmakuMergeSimilar(
        _comments,
        lsGetItem(lsKeys.mergeSimilarPercent.id),
        lsGetItem(lsKeys.mergeSimilarTime.id)
    );
    return _comments;
}
