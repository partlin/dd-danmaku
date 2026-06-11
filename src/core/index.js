/**
 * core 模块统一导出
 */

export { EDE } from './EDE.js';
export { AppLogAspect } from './AppLogAspect.js';
export {
    lsSetItem,
    lsCheckOld,
    lsCheckSet,
    lsBatchSet,
    lsBatchRemove,
} from './storage.js';

/**
 * 清理所有由 waitForElement 创建的 interval
 * @param {EDE} [ede] - EDE 实例，不传时使用 window.ede
 */
export function destroyAllInterval(ede) {
    const target = ede ?? window.ede;
    if (target?.destroyIntervalIds) {
        target.destroyIntervalIds.forEach((id) => clearInterval(id));
        target.destroyIntervalIds = [];
    }
}
