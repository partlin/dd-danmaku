/**
 * UI 通用组件：图片、链接、图标等
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { getById, getByClass } from '../../utils/dom.js';
import { OS } from '../../utils/platform.js';

export { getById, getByClass };

/**
 * 创建 Material Design 图标元素
 * @param {string} iconKey - 图标键名
 * @param {string} [extClassName] - 额外类名
 * @returns {HTMLElement}
 */
export function embyI(iconKey, extClassName) {
    const iNode = document.createElement('i');
    iNode.className = 'md-icon' + (extClassName ? ' ' + extClassName : '');
    iNode.style = 'pointer-events: none;';
    iNode.innerHTML = iconKey;
    return iNode;
}

/**
 * 创建图片元素
 * @param {string} src - 图片地址
 * @param {string} [style] - 样式
 * @param {string} [id] - 元素 ID
 * @param {boolean} [draggable=false] - 是否可拖拽
 * @returns {HTMLImageElement}
 */
export function embyImg(src, style, id, draggable = false) {
    const img = document.createElement('img');
    img.id = id;
    img.src = src;
    img.style = style;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = draggable;
    img.className = 'coveredImage-noScale cardImage';
    return img;
}

/**
 * 创建带图片的按钮
 * @param {HTMLElement} childNode - 子节点（通常为图片）
 * @param {string} [btnStyle] - 按钮样式
 * @returns {HTMLButtonElement}
 */
export function embyImgButton(childNode, btnStyle) {
    const btn = document.createElement('button');
    btn.style = btnStyle;
    btn.className = 'cardContent-button cardImageContainer cardPadder-portrait defaultCardBackground';
    btn.append(childNode);
    btn.addEventListener('focus', () => {
        btn.style.boxShadow = '0 0 0 5px green';
    });
    btn.addEventListener('blur', () => {
        btn.style.boxShadow = '';
    });
    return btn;
}

/**
 * 创建链接元素
 * @param {string} href - 链接地址
 * @param {string} [text] - 显示文本
 * @returns {HTMLAnchorElement}
 */
export function embyALink(href, text) {
    const aEle = document.createElement('a');
    aEle.setAttribute('is', 'emby-linkbutton');
    aEle.href = href;
    aEle.textContent = text || href;
    aEle.target = '_blank';
    aEle.className = 'button-link button-link-color-inherit button-link-fontweight-inherit emby-button';
    if (OS && OS.isMobile && OS.isMobile()) {
        aEle.addEventListener('click', (event) => {
            event.preventDefault();
            navigator.clipboard.writeText(href).then(
                () => {
                    console.log('Link copied to clipboard:', href);
                    const label = document.createElement('label');
                    label.textContent = '已复制';
                    label.style.color = 'green';
                    label.style.paddingLeft = '0.5em';
                    aEle.append(label);
                    setTimeout(() => {
                        aEle.removeChild(label);
                    }, 3000);
                },
                (err) => {
                    console.error('Failed to copy link:', err);
                }
            );
        });
    }
    return aEle;
}
