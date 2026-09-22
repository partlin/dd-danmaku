/**
 * DOM 工具函数
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { check_interval } from '../config/constants.js';

/**
 * Emby 的 SPA 切页会短暂保留隐藏的旧播放页，DOM 查询必须排除它。
 */
export function isElementVisible(element) {
    if (!element || element.isConnected === false) return false;
    if (element.classList?.contains('hide') || element.classList?.contains('page-hidden')) {
        return false;
    }
    if (element.getAttribute?.('aria-hidden') === 'true') return false;

    const getComputedStyleFn = globalThis.window?.getComputedStyle || globalThis.getComputedStyle;
    if (typeof getComputedStyleFn === 'function') {
        const style = getComputedStyleFn(element);
        if (style?.display === 'none' || style?.visibility === 'hidden') return false;
    }
    if (typeof element.getClientRects === 'function' && element.getClientRects().length === 0) {
        return false;
    }
    return true;
}

/**
 * 返回当前可见播放页的媒体容器，避免误命中 SPA 暂留的旧 OSD。
 */
export function getActiveMediaContainer(containerQuery) {
    const containers = Array.from(document.querySelectorAll?.(containerQuery) || []);
    const activeContainers = containers.filter(isElementVisible);
    return activeContainers.length ? activeContainers[activeContainers.length - 1] : null;
}

/**
 * 仅在当前可见播放页内查找 video，不能退回到全局旧 video。
 */
export function getActiveMedia(containerQuery, mediaQuery) {
    const container = getActiveMediaContainer(containerQuery);
    const containedMedia = container?.querySelector?.(mediaQuery);
    if (containedMedia) return containedMedia;

    // Emby 4.10 会在 OSD 过渡期间把实际 video 暂时移到 body。
    // 此时不能因为 video 不在 OSD 子树中就回退到隐藏旧页的 video。
    const mediaList = Array.from(document.querySelectorAll?.(mediaQuery) || []);
    const visibleMedia = mediaList.filter((media) => {
        if (!isElementVisible(media)) return false;
        const parentContainer = media.closest?.(containerQuery);
        return !parentContainer || isElementVisible(parentContainer);
    });
    return visibleMedia.length ? visibleMedia[visibleMedia.length - 1] : null;
}

/**
 * 返回当前播放使用的媒体元素。
 * 优先选择活动播放页中的真实 video；原生播放器没有真实 video 时，
 * 允许使用明确指定的隐藏虚拟 video 作为时间源。
 */
export function getPlaybackMedia(containerQuery, mediaQuery, fallbackId) {
    const activeMedia = getActiveMedia(containerQuery, mediaQuery);
    if (activeMedia) return activeMedia;
    return fallbackId ? document.getElementById?.(fallbackId) || null : null;
}

/**
 * 按 ID 获取元素
 * @param {string} childId - 元素 ID（不带 #）
 * @param {Document|Element} [parentNode=document] - 父节点
 * @returns {Element|null}
 */
export function getById(childId, parentNode = document) {
    if (!parentNode) {
        return null;
    }
    return parentNode.querySelector(`#${childId}`);
}

/**
 * 按类名获取单个元素
 * @param {string} className - 类名（不带点）
 * @param {Document|Element} [parentNode=document] - 父节点
 * @returns {Element|null}
 */
export function getByClass(className, parentNode = document) {
    if (!parentNode) {
        return null;
    }
    return parentNode.querySelector(`.${className}`);
}

/**
 * 仅适用于 input 元素和下一个临近元素的事件
 * @param {Event} e
 * @returns {HTMLInputElement}
 */
export function getTargetInput(e) {
    return e.target.tagName === 'INPUT' ? e.target : e.target.previousElementSibling;
}

/**
 * 等待目标元素出现
 * @param {string|object|function} target - 选择器、{ element: ele, needParent: true }，或动态查找函数
 * @param {function} [callback] - 找到后的回调，参数为元素
 * @param {number} [timeout=10000] - 超时毫秒，0 表示不超时
 * @param {number} [interval=check_interval] - 检查间隔
 * @param {number[]} [destroyIntervalIds] - 用于清理的 interval id 数组，可选
 * @returns {Promise<HTMLElement|null>}
 */
export function waitForElement(
    target,
    callback,
    timeout = 10000,
    interval = check_interval,
    destroyIntervalIds = []
) {
    let intervalId = null;
    let timeoutId = null;
    let settled = false;
    const isSelector = typeof target === 'string';
    const isResolver = typeof target === 'function';
    const elementMark = isSelector ? target : (isResolver ? 'resolver' : target.element?.tagName);
    const registry = destroyIntervalIds && Array.isArray(destroyIntervalIds)
        ? destroyIntervalIds
        : null;
    let resolvePromise;

    const handle = {
        cancel() {
            if (settled) return;
            settled = true;
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            removeHandle();
            resolvePromise(null);
        },
    };

    function removeHandle() {
        if (!registry) return;
        const index = registry.indexOf(handle);
        if (index >= 0) registry.splice(index, 1);
    }

    function findElement() {
        if (isSelector) return document.querySelector(target);
        if (isResolver) return target();
        if (!target?.element) return null;
        return target.needParent ? target.element.parentNode : target.element;
    }

    const promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        function checkElement() {
            if (settled) return;
            const element = findElement();
            if (element) {
                settled = true;
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                removeHandle();
                try {
                    if (typeof callback === 'function') callback(element);
                    resolve(element);
                } catch (error) {
                    reject(error);
                }
            }
        }

        if (registry) registry.push(handle);
        checkElement();
        if (settled) return;
        intervalId = setInterval(checkElement, interval);

        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                if (settled) return;
                settled = true;
                clearInterval(intervalId);
                removeHandle();
                reject(new Error(`Element [${elementMark}] not found within ${timeout}ms`));
            }, timeout);
        }
    });

    promise.cancel = handle.cancel;
    return promise;
}
