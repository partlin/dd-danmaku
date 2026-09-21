/**
 * localStorage 封装
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { lsGetItem, lsGetKeyById, lsKeys } from '../config/api.js';
import { objectEntries } from '../utils/helpers.js';
import { lsLocalKeys } from '../config/ls-local-keys.js';

export const MATCH_CACHE_EPOCH = '4';

export function lsSetItem(id, value) {
    if (!lsGetKeyById(id)) {
        return;
    }
    let stringValue;
    if (Array.isArray(value)) {
        stringValue = JSON.stringify(value);
    } else if (typeof value === 'object' && value !== null) {
        stringValue = JSON.stringify(value);
    } else {
        stringValue = String(value);
    }
    localStorage.setItem(id, stringValue);
}

export function lsCheckOld(id, value) {
    return JSON.stringify(lsGetItem(id)) === JSON.stringify(value);
}

export function lsCheckSet(id, value) {
    if (lsCheckOld(id, value)) {
        return false;
    }
    lsSetItem(id, value);
    return true;
}

/**
 * 批量设置缓存
 * @param {object} keyValues - 键值对对象，如 { key1: value1, key2: value2 }
 * @param {boolean} [needCheck=true] - 是否检查后设置
 * @returns {boolean|undefined} - needCheck 为 true 时返回是否有更新
 */
export function lsBatchSet(keyValues, needCheck = true) {
    if (needCheck) {
        return objectEntries(keyValues).reduce(
            (acc, [id, value]) => acc || lsCheckSet(id, value),
            false
        );
    }
    objectEntries(keyValues).forEach(([id, value]) => lsSetItem(id, value));
}

/**
 * 按前缀批量移除 localStorage
 * @param {string[]} prefixes - 键前缀数组
 * @returns {boolean} - 是否有移除
 */
export function lsBatchRemove(prefixes) {
    return (
        Object.keys(localStorage)
            .filter((key) => prefixes.some((prefix) => key.startsWith(prefix)))
            .map((key) => localStorage.removeItem(key)).length > 0
    );
}

/**
 * 一次性清理旧版自动匹配缓存，保留用户设置与手动匹配记录。
 */
export function migrateMatchCacheEpoch() {
    try {
        if (localStorage.getItem(lsLocalKeys.matchEpoch) === MATCH_CACHE_EPOCH) return;
        const prefixes = [
            lsLocalKeys.animeEpisodePrefix,
            lsLocalKeys.animeSeasonPrefix,
            lsLocalKeys.animePrefix,
            lsLocalKeys.apiPrefix,
        ];
        const doomed = [];
        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);
            if (key && prefixes.some((prefix) => key.startsWith(prefix))) doomed.push(key);
        }
        doomed.forEach((key) => localStorage.removeItem(key));
        localStorage.setItem(lsLocalKeys.matchEpoch, MATCH_CACHE_EPOCH);
        console.log(`[缓存纪元] 已升级到 v${MATCH_CACHE_EPOCH}，清除 ${doomed.length} 条旧自动匹配缓存`);
    } catch (error) {
        console.warn('[缓存纪元] 迁移失败:', error);
    }
}
