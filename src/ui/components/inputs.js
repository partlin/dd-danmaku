/**
 * UI 输入组件
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { objectEntries, getValueOrInvoke } from '../../utils/helpers.js';
import { classes } from '../../config/icons.js';
import { getTargetInput } from '../../utils/dom.js';

export { getTargetInput };

/**
 * 创建 Emby 风格输入框
 * @param {object} props - { id, value, type, style, ... }
 * @param {function} [onEnter] - 回车回调
 * @param {function} [onChange] - 变更回调
 * @returns {HTMLInputElement}
 */
export function embyInput(props, onEnter, onChange) {
    const input = document.createElement('input', { is: 'emby-input' });
    objectEntries(props).forEach(([key, value]) => {
        if (typeof value !== 'function') {
            input.setAttribute(key, value);
        }
    });
    input.className = classes.embyInput;
    if (typeof onEnter === 'function') {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') onEnter(e);
        });
    }
    if (typeof onChange === 'function') {
        input.addEventListener('change', onChange);
    }
    input.addEventListener('keydown', (event) => {
        if (
            (event.key === 'ArrowLeft' || event.key === 'ArrowRight') &&
            ((input.selectionStart === 0 && event.key === 'ArrowLeft') ||
                (input.selectionEnd === input.value.length && event.key === 'ArrowRight'))
        ) {
            event.stopPropagation();
            event.preventDefault();
            const options = {
                sourceElement: event.target,
                repeat: event.repeat,
                originalEvent: event,
            };
            if (typeof require === 'function') {
                require(['inputmanager'], (inputmanager) => {
                    inputmanager.trigger(event.key.replace('Arrow', '').toLowerCase(), options);
                });
            }
        }
    });
    return input;
}

/**
 * 创建 Emby 风格文本域
 * @param {object} props - { id, value, rows, style, styleResize, readonly, ... }
 * @param {function} [onBlur] - 失焦回调
 * @returns {HTMLTextAreaElement}
 */
export function embyTextarea(props, onBlur) {
    const defaultProps = { rows: 10, styleResize: 'vertical', readonly: false };
    props = { ...defaultProps, ...props };
    const textarea = document.createElement('textarea', { is: 'emby-textarea' });
    objectEntries(props).forEach(([key, value]) => {
        if (
            typeof value !== 'function' &&
            key !== 'readonly' &&
            key !== 'styleResize' &&
            key !== 'value'
        ) {
            textarea.setAttribute(key, value);
        }
    });
    textarea.className = 'txtOverview emby-textarea';
    textarea.readOnly = props.readonly;
    textarea.style.resize = props.styleResize;
    textarea.value = props.value;
    if (typeof onBlur === 'function') {
        textarea.addEventListener('blur', onBlur);
    }
    return textarea;
}

/**
 * 创建 Emby 风格下拉选择
 * @param {object} props - 属性
 * @param {number|string} selectedIndexOrValue - 选中索引或值
 * @param {Array} options - 选项数组
 * @param {string|function} optionValueKey - 值键名或取值函数
 * @param {string|function} optionTitleKey - 标题键名或取值函数
 * @param {function} [onChange] - 变更回调
 * @param {function} [onFocus] - 聚焦回调
 * @returns {HTMLLabelElement}
 */
export function embySelect(props, selectedIndexOrValue, options, optionValueKey, optionTitleKey, onChange, onFocus) {
    const defaultProps = { class: 'emby-select' };
    props = { ...defaultProps, ...props };
    if (!Number.isInteger(selectedIndexOrValue)) {
        selectedIndexOrValue = options.indexOf(selectedIndexOrValue);
    }
    const selectElement = document.createElement('select', { is: 'emby-select' });
    if (typeof require === 'function') {
        require(['browser'], (browser) => {
            if (browser.tv) {
                selectElement.classList.add(classes.embySelectTv);
            }
        });
    }
    objectEntries(props).forEach(([key, value]) => {
        if (typeof value !== 'function') {
            selectElement.setAttribute(key, value);
        }
    });
    options.forEach((option, index) => {
        const value = getValueOrInvoke(option, optionValueKey, index);
        const title = getValueOrInvoke(option, optionTitleKey, index);
        const optionElement = document.createElement('option');
        optionElement.value = value;
        optionElement.textContent = title;
        if (index === selectedIndexOrValue) {
            optionElement.selected = true;
        }
        selectElement.append(optionElement);
    });
    if (typeof onChange === 'function') {
        selectElement.addEventListener('change', (e) => {
            onChange(e.target.value, e.target.selectedIndex, options[e.target.selectedIndex]);
        });
    }
    if (typeof onFocus === 'function') {
        selectElement.addEventListener('focus', onFocus);
    }
    const selectLabel = document.createElement('label');
    selectLabel.classList.add('selectLabel');
    selectLabel.appendChild(selectElement);
    return selectLabel;
}
