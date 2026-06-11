/**
 * UI 按钮组件
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { objectEntries } from '../../utils/helpers.js';
import { classes, iconKeys } from '../../config/icons.js';
import { embyI } from './common.js';

/**
 * 创建 Emby 风格按钮
 * @param {object} props - { id, label, style, iconKey, ... }
 * @param {function} [onClick] - 点击回调
 * @returns {HTMLButtonElement}
 */
export function embyButton(props, onClick) {
    const button = document.createElement('button');
    button.setAttribute('is', 'emby-button');
    button.setAttribute('type', 'button');
    objectEntries(props).forEach(([key, value]) => {
        if (key !== 'iconKey' && typeof value !== 'function') {
            button.setAttribute(key, value);
        }
    });
    if (props.iconKey) {
        button.setAttribute('title', props.label);
        button.setAttribute('aria-label', props.label);
        button.innerHTML = embyI(props.iconKey).outerHTML;
        button.className = classes.embyButtons.iconButton;
    } else {
        button.classList.add(...classes.embyButtons.basic.split(' '));
        button.textContent = props.label;
    }
    if (typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    return button;
}
