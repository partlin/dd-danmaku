/**
 * UI 布局组件：Tabs、Checkbox、Slider
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { objectEntries, getValueOrInvoke } from '../../utils/helpers.js';
import { classes, styles } from '../../config/icons.js';
import { lsGetItem } from '../../config/api.js';
import { waitForElement } from '../../utils/dom.js';

/**
 * 创建 Emby 风格 Tab 切换
 * @param {Array} options - 选项数组
 * @param {string|number} selectedValue - 选中值
 * @param {string|function} optionValueKey - 值键名或取值函数
 * @param {string|function} optionTitleKey - 标题键名或取值函数
 * @param {function} [onChange] - 切换回调
 * @returns {HTMLElement}
 */
export function embyTabs(options, selectedValue, optionValueKey, optionTitleKey, onChange) {
    const tabs = document.createElement('div', { is: 'emby-tabs' });
    tabs.setAttribute('data-index', '0');
    tabs.className = classes.embyTabsDiv1;
    tabs.style.width = 'fit-content';
    const tabsSlider = document.createElement('div');
    tabsSlider.className = classes.embyTabsDiv2;
    tabsSlider.style.padding = '0.25em';
    options.forEach((option, index) => {
        const value = getValueOrInvoke(option, optionValueKey);
        const title = getValueOrInvoke(option, optionTitleKey);
        const tabButton = document.createElement('button');
        tabButton.id = option.id + 'Btn';
        tabButton.className = `${classes.embyTabsButton}${value == selectedValue ? ' emby-tab-button-active' : ''}`;
        tabButton.setAttribute('data-index', index);
        tabButton.textContent = title;
        tabButton.style.display = option.hidden ? 'none' : '';
        tabsSlider.append(tabButton);
    });
    tabs.append(tabsSlider);
    if (typeof onChange === 'function') {
        tabs.addEventListener('tabchange', (e) =>
            onChange(options[e.detail.selectedTabIndex], e.detail.selectedTabIndex)
        );
    }
    return tabs;
}

/**
 * 创建单个复选框
 * @param {object} opts - { id, name, label, value }
 * @param {boolean} [checked=false]
 * @param {function} [onChange]
 * @returns {HTMLLabelElement}
 */
export function embyCheckbox({ id, name, label, value }, checked = false, onChange) {
    const checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('emby-checkbox-label');
    checkboxLabel.setAttribute('style', 'width: auto;');
    const checkbox = document.createElement('input', { is: 'emby-checkbox' });
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', id);
    checkbox.setAttribute('name', name);
    checkbox.setAttribute('value', value);
    checkbox.checked = checked;
    checkbox.classList.add('emby-checkbox', 'chkEnableLiveTvAccess');
    if (typeof onChange === 'function') {
        checkbox.addEventListener('change', (e) => onChange(e.target.checked));
    }
    const span = document.createElement('span');
    span.setAttribute('class', 'checkboxLabel');
    span.innerHTML = label;
    checkboxLabel.append(checkbox);
    checkboxLabel.append(span);
    return checkboxLabel;
}

/**
 * 创建复选框列表
 * @param {string} id - 容器 ID
 * @param {string} checkBoxName - 复选框 name
 * @param {string[]} [selectedStrArray] - 已选值数组
 * @param {Array} options - 选项数组 { id, name }
 * @param {function} [onChange]
 * @param {boolean} [isVertical=false]
 * @returns {HTMLElement}
 */
export function embyCheckboxList(id, checkBoxName, selectedStrArray, options, onChange, isVertical = false) {
    const checkboxContainer = document.createElement('div');
    checkboxContainer.setAttribute('class', classes.embyCheckboxList);
    checkboxContainer.setAttribute('style', isVertical ? '' : styles.embyCheckboxList);
    checkboxContainer.setAttribute('id', id);
    options.forEach((option) => {
        checkboxContainer.append(
            embyCheckbox(
                { name: checkBoxName, label: option.name, value: option.id },
                selectedStrArray ? selectedStrArray.indexOf(option.id) > -1 : false,
                onChange
            )
        );
    });
    return checkboxContainer;
}

/**
 * 创建滑块
 * @param {object} opts - { id, labelId, value, min, max, step, orient, lsKey, ... }
 * @param {function} [onChange] - 变更回调 (value, opts)
 * @param {function} [onSliding] - 滑动中回调
 * @returns {HTMLInputElement}
 */
export function embySlider(opts = {}, onChange, onSliding) {
    const defaultOpts = {
        min: 0.1,
        max: 3,
        step: 0.1,
        orient: 'horizontal',
        'data-bubble': false,
        'data-hoverthumb': true,
        style: '',
    };
    const options = { ...defaultOpts, ...opts };
    const slider = document.createElement('input', { is: 'emby-slider' });
    slider.setAttribute('type', 'range');
    if (opts.id) {
        slider.setAttribute('id', opts.id);
    }
    objectEntries(options).forEach(([key, value]) => {
        if (key === 'lsKey') {
            const optsKeys = Object.keys(opts);
            if (!optsKeys.includes('value')) {
                options.value = lsGetItem(value.id);
            }
            if (!optsKeys.includes('min')) {
                slider.setAttribute('min', value.min);
            }
            if (!optsKeys.includes('max')) {
                slider.setAttribute('max', value.max);
            }
            if (!optsKeys.includes('step')) {
                slider.setAttribute('step', value.step);
            }
        } else {
            slider.setAttribute(key, value);
        }
    });
    if (typeof onChange === 'function') {
        slider.addEventListener('change', (e) => {
            opts.isManual = e.isManual;
            const nextEle = e.target.parentNode.nextElementSibling;
            opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
            return onChange(e.target.value, opts);
        });
    }
    if (typeof onSliding === 'function') {
        slider.addEventListener('input', (e) => {
            const nextEle = e.target.parentNode.nextElementSibling;
            opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
            return onSliding(e.target.value, opts);
        });
    }
    if (options.value || options.value === 0) {
        slider.setValue(options.value);
        waitForElement({ element: slider, needParent: true }, (ele) => {
            const e = new Event('change');
            e.isManual = true;
            slider.dispatchEvent(e);
        });
    }
    slider.addEventListener('keydown', (e) => {
        const orient = slider.getAttribute('orient') || 'horizontal';
        if (
            (orient === 'horizontal' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) ||
            (orient === 'vertical' && (e.key === 'ArrowUp' || e.key === 'ArrowDown'))
        ) {
            e.stopPropagation();
        }
    });
    return slider;
}
