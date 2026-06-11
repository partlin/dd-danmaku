/**
 * localStorage 封装
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { lsGetItem, lsGetKeyById, lsKeys } from '../config/api.js';
import { objectEntries } from '../utils/helpers.js';

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
