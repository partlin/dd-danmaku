/**
 * 弹窗相关
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { getById, getByClass } from './components/common.js';
import { embyTabs } from './components/layout.js';
import { waitForElement } from '../utils/dom.js';
import { eleIds } from '../config/ele-ids.js';
import { classes } from '../config/icons.js';
import { danmakuTabOpts } from './tabs/index.js';
import { getMapByEmbyItemInfo } from '../match/index.js';

/**
 * 调用 Emby 原生 dialog 模块
 * @param {object} opts - { text, title, timeout, html, buttons }
 * @returns {Promise}
 */
export async function embyDialog(opts = {}) {
    const defaultOpts = { text: '', title: '', timeout: 0, html: '', buttons: [] };
    opts = { ...defaultOpts, ...opts };
    if (typeof require === 'function') {
        return require(['dialog'])
            .then((items) => items[0](opts))
            .catch((error) => {
                console.log('点击弹出框外部取消: ' + error);
            });
    }
    return Promise.reject(new Error('Emby require not available'));
}

/**
 * 关闭当前弹窗
 */
export function closeEmbyDialog() {
    const footerItem = getByClass(classes.formDialogFooterItem);
    if (footerItem) {
        footerItem.dispatchEvent(new Event('click'));
    }
}

/**
 * 调用 Emby 原生 alert 模块
 * @param {object} opts - { text, title, timeout, html }
 * @returns {Promise}
 */
export async function embyAlert(opts = {}) {
    const defaultOpts = { text: '', title: '', timeout: 0, html: '' };
    opts = { ...defaultOpts, ...opts };
    if (typeof require === 'function') {
        return require(['alert'])
            .then((items) => items[0](opts))
            .catch((error) => {
                console.log('点击弹出框外部取消: ' + error);
            });
    }
    return Promise.reject(new Error('Emby require not available'));
}

/**
 * 调用 Emby 原生 toast 模块
 * @param {object} opts - { text, secondaryText, icon, iconStrikeThrough }
 * @returns {Promise}
 */
export async function embyToast(opts = {}) {
    const defaultOpts = { text: '', secondaryText: '', icon: '', iconStrikeThrough: false };
    opts = { ...defaultOpts, ...opts };
    if (typeof require === 'function') {
        return require(['toast'], toast => toast(opts));
    }
    return Promise.reject(new Error('Emby require not available'));
}

/**
 * 弹窗容器就绪后的回调，构建 Tab 内容
 * @param {HTMLElement} dialogContainer
 */
async function afterEmbyDialogCreated(dialogContainer) {
    const itemInfoMap = await getMapByEmbyItemInfo();
    if (itemInfoMap && window.ede) {
        window.ede.searchDanmakuOpts = {
            _id_key: itemInfoMap._id_key,
            _season_key: itemInfoMap._season_key,
            _episode_key: itemInfoMap._episode_key,
            animeId: itemInfoMap.animeId,
            animeName: itemInfoMap.animeName,
            seriesOrMovieId: itemInfoMap.seriesOrMovieId,
            episode: (parseInt(itemInfoMap.episode) || 1) - 1,
            animes: [],
        };
    }

    let formDialogHeader = getByClass(classes.formDialogHeader);
    const formDialogFooter = getByClass(classes.formDialogFooter);
    formDialogHeader = formDialogHeader || dialogContainer;

    const tabsMenuContainer = document.createElement('div');
    tabsMenuContainer.className = classes.embyTabsMenu;
    tabsMenuContainer.append(
        embyTabs(danmakuTabOpts, danmakuTabOpts[0].id, 'id', 'name', (value) => {
            danmakuTabOpts.forEach((obj) => {
                const elem = getById(obj.id);
                if (elem) elem.hidden = obj.id !== value.id;
            });
        })
    );
    formDialogHeader.append(tabsMenuContainer);
    formDialogHeader.style = 'width: 100%; padding: 0; height: auto;';

    danmakuTabOpts.forEach((tab, index) => {
        const tabContainer = document.createElement('div');
        tabContainer.id = tab.id;
        tabContainer.style.textAlign = 'left';
        tabContainer.hidden = index !== 0;
        dialogContainer.append(tabContainer);
        try {
            tab.buildMethod(tab.id);
        } catch (error) {
            console.error(error);
        }
    });

    if (formDialogFooter) {
        formDialogFooter.style.padding = '0.3em';
    }
}

/**
 * 创建弹幕设置弹窗
 * @param {function(HTMLElement): void} [onDialogReady] - 可选，默认使用 afterEmbyDialogCreated
 */
export function createDialog(onDialogReady) {
    if (typeof require === 'function') {
        require([
            'emby-select',
            'emby-checkbox',
            'emby-slider',
            'emby-textarea',
            'emby-collapse',
            'emby-button',
        ]);
    }
    const html = `<div id="${eleIds.dialogContainer}"></div>`;
    embyDialog({ html, buttons: [{ name: '关闭' }] });
    waitForElement('#' + eleIds.dialogContainer, onDialogReady || afterEmbyDialogCreated);
}
