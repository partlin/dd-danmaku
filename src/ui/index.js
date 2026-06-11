/**
 * UI 模块统一导出
 */

export * from './components/index.js';
export {
    createDialog,
    embyDialog,
    closeEmbyDialog,
    embyAlert,
    embyToast,
} from './dialog.js';
export { initUI, initListener, initCss } from './init.js';
