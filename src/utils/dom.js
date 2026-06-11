/**
 * DOM 工具函数
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { check_interval } from '../config/constants.js';

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
 * @param {string|object} target - 选择器字符串，或 { element: ele, needParent: true }
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
    const isSelector = typeof target === 'string';
    const elementMark = isSelector ? target : target.element?.tagName;

    const promise = new Promise((resolve, reject) => {
        function checkElement() {
            let element = null;
            if (isSelector) {
                element = document.querySelector(target);
            } else if (target?.element) {
                if (target.needParent) {
                    element = target.element.parentNode;
                } else {
                    element = target.element;
                }
            }
            if (element) {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                if (typeof callback === 'function') {
                    callback(element);
                }
                resolve(element);
            }
        }

        intervalId = setInterval(checkElement, interval);
        if (destroyIntervalIds && Array.isArray(destroyIntervalIds)) {
            destroyIntervalIds.push(intervalId);
        }

        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                reject(new Error(`Element [${elementMark}] not found within ${timeout}ms`));
            }, timeout);
        }
    });

    return promise;
}
