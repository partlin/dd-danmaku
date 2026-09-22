/** Emby 原生弹窗服务。与 Tab 构建模块保持无依赖，避免循环引用。 */

import { getByClass } from './components/common.js';
import { classes } from '../config/icons.js';

export async function embyDialog(opts = {}) {
    const defaultOpts = { text: '', title: '', timeout: 0, html: '', buttons: [] };
    opts = { ...defaultOpts, ...opts };
    if (typeof require === 'function') {
        return require(['dialog'])
            .then((items) => items[0](opts))
            .catch((error) => console.log('点击弹出框外部取消: ' + error));
    }
    return Promise.reject(new Error('Emby require not available'));
}

export function closeEmbyDialog() {
    const footerItem = getByClass(classes.formDialogFooterItem);
    if (footerItem) footerItem.dispatchEvent(new Event('click'));
}

export async function embyAlert(opts = {}) {
    const defaultOpts = { text: '', title: '', timeout: 0, html: '' };
    opts = { ...defaultOpts, ...opts };
    if (typeof require === 'function') {
        return require(['alert'])
            .then((items) => items[0](opts))
            .catch((error) => console.log('点击弹出框外部取消: ' + error));
    }
    return Promise.reject(new Error('Emby require not available'));
}

export async function embyToast(opts = {}) {
    const defaultOpts = { text: '', secondaryText: '', icon: '', iconStrikeThrough: false };
    opts = { ...defaultOpts, ...opts };
    if (typeof require === 'function') return require(['toast'], (toast) => toast(opts));
    return Promise.reject(new Error('Emby require not available'));
}
