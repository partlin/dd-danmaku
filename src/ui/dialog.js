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
import { embyDialog } from './dialog-service.js';
export { embyDialog, closeEmbyDialog, embyAlert, embyToast } from './dialog-service.js';

/**
 * 调用 Emby 原生 dialog 模块
 * @param {object} opts - { text, title, timeout, html, buttons }
 * @returns {Promise}
 */
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
