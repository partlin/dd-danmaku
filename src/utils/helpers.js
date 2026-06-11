/**
 * 通用工具函数
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

/**
 * 将对象转为 [key, value] 数组，兼容非对象
 * @param {object} obj
 * @returns {Array<[string, any]>}
 */
export function objectEntries(obj) {
    if (obj && typeof obj === 'object') {
        return Object.keys(obj).map((key) => [key, obj[key]]);
    }
    return [];
}

/**
 * 获取选项的值或执行函数
 * @param {object} option - 选项对象
 * @param {string|function} keyOrFunc - 键名或取值函数
 * @param {number} [index] - 可选索引
 * @returns {any}
 */
export function getValueOrInvoke(option, keyOrFunc, index) {
    return typeof keyOrFunc === 'function' ? keyOrFunc(option, index) : option[keyOrFunc];
}

/**
 * 获取当前设置 JSON 字符串
 * @param {object} lsKeys - 配置键对象
 * @param {function} lsGetItem - 获取存储项函数
 * @param {number} [space=4] - 缩进空格数
 * @returns {string}
 */
export function getSettingsJson(lsKeys, lsGetItem, space = 4) {
    return JSON.stringify(
        Object.fromEntries(
            objectEntries(lsKeys).map(([key, value]) => [value.id, lsGetItem(value.id)])
        ),
        null,
        space
    );
}

/**
 * 重置设置为默认值
 * @param {object} lsKeys - 配置键对象
 * @param {function} lsBatchSet - 批量设置函数
 */
export function settingsReset(lsKeys, lsBatchSet) {
    const defaultSettings = Object.fromEntries(
        objectEntries(lsKeys)
            .filter(([key, value]) => lsKeys.filterKeywords.id !== value.id)
            .map(([key, value]) => [value.id, value.defaultValue])
    );
    lsBatchSet(defaultSettings);
}
