/**
 * 彩蛋与调试
 */

import { getById, getByClass } from '../ui/components/common.js';
import { embyButton } from '../ui/components/index.js';
import { createDialog } from '../ui/dialog.js';
import { embyToast } from '../ui/dialog.js';
import { eleIds } from '../config/ele-ids.js';
import { lsKeys } from '../config/api.js';
import { lsSetItem } from '../core/storage.js';
import { classes } from '../config/icons.js';
import { EDE } from '../core/EDE.js';
import { corsProxy, requireDanmakuPath } from '../user-config.js';
import { dandanplayApi } from '../config/api.js';
import { OS } from '../utils/platform.js';

function toggleSettingBtn2Header() {
    const targetBtn = getById(eleIds.danmakuSettingBtnDebug);
    if (targetBtn) {
        targetBtn.remove();
        return false;
    }
    const headerRight = getByClass(classes.headerRight);
    if (!headerRight) return false;
    const opt = {
        id: eleIds.danmakuSettingBtnDebug,
        label: '弹幕设置',
        iconKey: 'tune',
        onClick: () => createDialog(),
    };
    headerRight.prepend(embyButton(opt, opt.onClick));
    return true;
}

export function quickDebug() {
    const flag = toggleSettingBtn2Header();
    embyToast({ text: `${lsKeys.quickDebugOn.name}: ${flag}!` });
    if (!window.ede) window.ede = new EDE();
    lsSetItem(lsKeys.quickDebugOn.id, flag);
    checkRuntimeVars();
}

export function checkRuntimeVars(exposeGlobalThis = true) {
    console.log('运行时变量检查');
    console.log(lsKeys.customeCorsProxyUrl.name, corsProxy);
    console.log(lsKeys.customeDanmakuUrl.name, requireDanmakuPath);
    console.log('弹弹 play API 模板', dandanplayApi);
    if (exposeGlobalThis) window.checkRuntimeVars = checkRuntimeVars;
}

export function addEasterEggListener() {
    const target = getByClass(classes.headerUserButton);
    if (!target) return;

    let longPressTimeout;
    function startLongPress() {
        longPressTimeout = setTimeout(() => {
            console.log('恭喜你发现了隐藏功能, 长按了 2 秒!');
            quickDebug();
        }, 2000);
    }
    function cancelLongPress() {
        clearTimeout(longPressTimeout);
    }

    const isMobile = OS?.isMobile?.() || false;
    let startEventName = isMobile ? 'touchstart' : 'mousedown';
    let endEventName = isMobile ? 'touchend' : 'mouseup';

    if (typeof require === 'function') {
        require(['browser'], (browser) => {
            if (browser?.tv) {
                startEventName = 'focus';
                endEventName = 'blur';
            }
            if (target.getAttribute('startFlag') !== '1') {
                target.addEventListener(startEventName, startLongPress);
                target.setAttribute('startFlag', '1');
            }
            if (target.getAttribute('endFlag') !== '1') {
                target.addEventListener(endEventName, cancelLongPress);
                target.setAttribute('endFlag', '1');
            }
        });
    }
}
