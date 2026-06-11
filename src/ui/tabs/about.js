/**
 * 关于 Tab
 * 从 ede.js 迁移
 */

import { objectEntries } from '../../utils/helpers.js';
import { getById, getByClass } from '../components/common.js';
import { embyCheckbox, embyButton, embyALink } from '../components/index.js';
import { eleIds } from '../../config/ele-ids.js';
import { classes, styles, iconKeys } from '../../config/icons.js';
import { lsKeys, lsGetItem, openSourceLicense } from '../../config/api.js';
import { lsSetItem } from '../../core/storage.js';
import { lsBatchSet } from '../../core/storage.js';
import { settingsReset } from '../../utils/helpers.js';
import { mediaContainerQueryStr } from '../../config/constants.js';
import { tabIframeId } from '../../config/options.js';
import { LOAD_TYPE } from '../../config/constants.js';
import { createDanmaku, loadDanmaku } from '../../danmaku/loader.js';
import { appendvideoOsdDanmakuInfo } from '../../events/video-osd.js';
import { buildCurrentDanmakuInfo } from './info.js';
import { AppLogAspect } from '../../core/index.js';
import { embyToast } from '../dialog.js';
import { closeEmbyDialog } from '../dialog.js';

const createDanmakuHooks = {
    buildCurrentDanmakuInfo,
    appendvideoOsdDanmakuInfo,
};

function doConsoleLogChange(checked) {
    lsSetItem(lsKeys.consoleLogEnable.id, checked);
    const consoleLogInfo = getById(eleIds.consoleLogInfo);
    if (consoleLogInfo) consoleLogInfo.style.display = checked ? '' : 'none';
    const consoleLogTextEle = getById(eleIds.consoleLogText);
    if (checked) {
        if (!window.ede.appLogAspect) {
            window.ede.appLogAspect = new AppLogAspect().init();
        }
        if (consoleLogTextEle) {
            consoleLogTextEle.value = window.ede.appLogAspect.value;
            window.ede.appLogAspect.on((newValue) => {
                if (consoleLogTextEle.value.length !== newValue.length) {
                    consoleLogTextEle.value = newValue;
                    consoleLogTextEle.scrollTop = consoleLogTextEle.scrollHeight;
                    const consoleLogCountLabel = getById(eleIds.consoleLogCountLabel);
                    if (consoleLogCountLabel) {
                        consoleLogCountLabel.innerHTML = `清空 ${newValue.split('\n').length - 1} 行`;
                    }
                }
            });
        }
    } else {
        if (consoleLogTextEle) consoleLogTextEle.value = '';
        if (window.ede.appLogAspect) {
            window.ede.appLogAspect.destroy();
            window.ede.appLogAspect = null;
        }
    }
}

function generateRandomDanmu(count, duration) {
    count = count || 10000;
    duration = duration || 600;
    const comments = [];
    const modes = [1, 4, 5, 6];
    for (let i = 0; i < count; i++) {
        const time = parseFloat((Math.random() * duration).toFixed(2));
        const mode = modes[Math.floor(Math.random() * modes.length)];
        const color = Math.floor(Math.random() * 16777216);
        const p = time + ',' + mode + ',' + color + ',0';
        const cid = 1000000000 + i;
        comments.push({ cid, p, m: '这是第' + (i + 1) + '条弹幕' });
    }
    return comments;
}

function buildConsoleLog(container) {
    const consoleLogEnable = lsGetItem(lsKeys.consoleLogEnable.id);
    const consoleLogInfo = getById(eleIds.consoleLogInfo, container);
    if (consoleLogInfo) consoleLogInfo.style.display = consoleLogEnable ? '' : 'none';
    if (consoleLogEnable) doConsoleLogChange(consoleLogEnable);

    const consoleLogCtrlEle = getById(eleIds.consoleLogCtrl, container);
    if (!consoleLogCtrlEle) return;

    consoleLogCtrlEle.append(
        embyCheckbox(
            { id: lsKeys.consoleLogEnable.id, name: lsKeys.consoleLogEnable.id, label: lsKeys.consoleLogEnable.name },
            consoleLogEnable,
            doConsoleLogChange
        )
    );
    const consoleLogCountLabel = document.createElement('label');
    consoleLogCountLabel.id = eleIds.consoleLogCountLabel;
    consoleLogCtrlEle.append(
        embyButton({ label: '清空', iconKey: iconKeys.block }, () => {
            const textEl = getById(eleIds.consoleLogText, container);
            if (textEl) textEl.value = '';
            const countEl = getById(eleIds.consoleLogCountLabel);
            if (countEl) countEl.innerHTML = '';
            if (window.ede.appLogAspect) window.ede.appLogAspect.value = '';
        }),
        consoleLogCountLabel
    );

    const consoleLogTextInput = getById(eleIds.consoleLogTextInput, container);
    if (consoleLogTextInput) {
        consoleLogTextInput.style.display =
            consoleLogEnable && lsGetItem(lsKeys.quickDebugOn.id) ? '' : 'none';
        consoleLogTextInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const inputVal = e.target.value.trim();
                console.log('输入内容为: \n', inputVal);
                try {
                    eval(inputVal);
                } catch (err) {
                    console.error(err);
                }
                e.target.value = '';
            }
        });
    }
}

function buildDebugCheckbox(container) {
    const debugWrapper = getById(eleIds.debugCheckbox, container);
    if (!debugWrapper) return;

    debugWrapper.append(
        embyCheckbox(
            {
                id: lsKeys.debugShowDanmakuWrapper.id,
                name: lsKeys.debugShowDanmakuWrapper.id,
                label: lsKeys.debugShowDanmakuWrapper.name,
            },
            lsGetItem(lsKeys.debugShowDanmakuWrapper.id),
            (checked) => {
                lsSetItem(lsKeys.debugShowDanmakuWrapper.id, checked);
                const wrapper = getById(eleIds.danmakuWrapper);
                if (wrapper) {
                    wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
                    if (checked) {
                        console.log(
                            `弹幕容器(#${eleIds.danmakuWrapper})宽高像素:`,
                            wrapper.offsetWidth,
                            wrapper.offsetHeight
                        );
                        const stage = wrapper.firstChild;
                        if (stage)
                            console.log(`实际舞台(${stage.tagName})宽高像素:`, stage.offsetWidth, stage.offsetHeight);
                    }
                }
            }
        )
    );
    debugWrapper.append(
        embyCheckbox(
            {
                id: lsKeys.debugShowDanmakuCtrWrapper.id,
                name: lsKeys.debugShowDanmakuCtrWrapper.id,
                label: lsKeys.debugShowDanmakuCtrWrapper.name,
            },
            lsGetItem(lsKeys.debugShowDanmakuCtrWrapper.id),
            (checked) => {
                lsSetItem(lsKeys.debugShowDanmakuCtrWrapper.id, checked);
                const wrapper = getById(eleIds.danmakuCtr);
                if (wrapper) {
                    wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
                    if (checked)
                        console.log(`按钮容器(#${eleIds.danmakuCtr})宽高像素:`, wrapper.offsetWidth, wrapper.offsetHeight);
                }
            }
        )
    );
    debugWrapper.append(
        embyCheckbox(
            {
                id: lsKeys.debugReverseDanmu.id,
                name: lsKeys.debugReverseDanmu.id,
                label: lsKeys.debugReverseDanmu.name,
            },
            lsGetItem(lsKeys.debugReverseDanmu.id),
            (checked) => {
                lsSetItem(lsKeys.debugReverseDanmu.id, checked);
                const comments = window.ede?.commentsOriginal;
                if (comments) {
                    const modified = comments.map((c) => {
                        const values = c.p.split(',');
                        values[1] = { '6': '1', '1': '6', '5': '4', '4': '5' }[values[1]] || values[1];
                        return { ...c, p: values.join() };
                    });
                    console.log('已' + lsKeys.debugReverseDanmu.name);
                    createDanmaku(modified, createDanmakuHooks);
                }
            }
        )
    );

    const toggleDanmuColor = (checked, lsKey, colorFn) => {
        lsSetItem(lsKey.id, checked);
        let comments = window.ede?.commentsOriginal;
        if (!comments) return;
        if (checked) {
            window.ede._oriComments = structuredClone(comments);
            comments = comments.map((c) => {
                const values = c.p.split(',');
                values[2] = colorFn();
                return { ...c, p: values.join() };
            });
            console.log('已' + lsKey.name);
        } else {
            comments = window.ede._oriComments;
            window.ede.commentsOriginal = comments;
            console.log('已还原' + lsKey.name);
        }
        createDanmaku(comments, createDanmakuHooks);
    };
    debugWrapper.append(
        embyCheckbox(
            {
                id: lsKeys.debugRandomDanmuColor.id,
                name: lsKeys.debugRandomDanmuColor.id,
                label: lsKeys.debugRandomDanmuColor.name,
            },
            lsGetItem(lsKeys.debugRandomDanmuColor.id),
            (checked) =>
                toggleDanmuColor(checked, lsKeys.debugRandomDanmuColor, () =>
                    parseInt(Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), 16)
                )
        )
    );
    debugWrapper.append(
        embyCheckbox(
            {
                id: lsKeys.debugForceDanmuWhite.id,
                name: lsKeys.debugForceDanmuWhite.id,
                label: lsKeys.debugForceDanmuWhite.name,
            },
            lsGetItem(lsKeys.debugForceDanmuWhite.id),
            (checked) =>
                toggleDanmuColor(checked, lsKeys.debugForceDanmuWhite, () =>
                    parseInt(styles.colors.info.toString(16).padStart(6, '0'), 16)
                )
        )
    );

    const toggleTopBottomToScroll = (checked, lsKey) => {
        lsSetItem(lsKey.id, checked);
        let comments = window.ede?.commentsOriginal;
        if (!comments) return;
        if (checked) {
            window.ede._oriComments = structuredClone(comments);
            comments = comments.map((c) => {
                const values = c.p.split(',');
                if (values[1] === '4' || values[1] === '5') values[1] = '1';
                return { ...c, p: values.join() };
            });
            console.log('已' + lsKey.name);
        } else {
            comments = window.ede._oriComments;
            window.ede.commentsOriginal = comments;
            console.log('已还原' + lsKey.name);
        }
        createDanmaku(comments, createDanmakuHooks);
    };
    debugWrapper.append(
        embyCheckbox(
            {
                id: lsKeys.debugTopBottomToScroll.id,
                name: lsKeys.debugTopBottomToScroll.id,
                label: lsKeys.debugTopBottomToScroll.name,
            },
            lsGetItem(lsKeys.debugTopBottomToScroll.id),
            (checked) => toggleTopBottomToScroll(checked, lsKeys.debugTopBottomToScroll)
        )
    );

    const dialogContainer = document.querySelector('.' + classes.dialogContainer);
    const centeredDialog = dialogContainer?.firstChild;
    if (dialogContainer && centeredDialog) {
        const isExist1 = dialogContainer.classList.contains(classes.dialogBackdropOpened);
        const isExist2 = centeredDialog.classList.contains(classes.dialogBlur);
        const debugDialogHyalinizeOnChange = (checked) => {
            lsSetItem(lsKeys.debugDialogHyalinize.id, checked);
            if (checked) {
                centeredDialog.classList.remove(classes.dialog);
                if (isExist1) dialogContainer.classList.remove(classes.dialogBackdropOpened);
                if (isExist2) centeredDialog.classList.remove(classes.dialogBlur);
            } else {
                centeredDialog.classList.add(classes.dialog);
                if (isExist1) dialogContainer.classList.add(classes.dialogBackdropOpened);
                if (isExist2) centeredDialog.classList.add(classes.dialogBlur);
            }
        };
        debugDialogHyalinizeOnChange(lsGetItem(lsKeys.debugDialogHyalinize.id));
        debugWrapper.append(
            embyCheckbox(
                {
                    id: lsKeys.debugDialogHyalinize.id,
                    name: lsKeys.debugDialogHyalinize.id,
                    label: lsKeys.debugDialogHyalinize.name,
                },
                lsGetItem(lsKeys.debugDialogHyalinize.id),
                debugDialogHyalinizeOnChange
            )
        );

        const isExist3 = centeredDialog.classList.contains(classes.dialogFullscreen);
        const isExist4 = centeredDialog.classList.contains(classes.dialogFullscreenLowres);
        const debugDialogWindowOnChange = (checked) => {
            lsSetItem(lsKeys.debugDialogWindow.id, checked);
            if (isExist3) centeredDialog.classList.toggle(classes.dialogFullscreen, !checked);
            if (isExist4) centeredDialog.classList.toggle(classes.dialogFullscreenLowres, !checked);
        };
        debugDialogWindowOnChange(lsGetItem(lsKeys.debugDialogWindow.id));
        debugWrapper.append(
            embyCheckbox(
                {
                    id: lsKeys.debugDialogWindow.id,
                    name: lsKeys.debugDialogWindow.id,
                    label: lsKeys.debugDialogWindow.name,
                },
                lsGetItem(lsKeys.debugDialogWindow.id),
                debugDialogWindowOnChange
            )
        );

        const debugDialogRightOnChange = (checked) => {
            lsSetItem(lsKeys.debugDialogRight.id, checked);
            dialogContainer.classList.toggle(classes.dialogBackdropOpened, !checked);
            centeredDialog.style = checked ? styles.rightLayout : '';
            if (checked) {
                if (isExist3) centeredDialog.classList.remove(classes.dialogFullscreen);
                if (isExist4) centeredDialog.classList.remove(classes.dialogFullscreenLowres);
            }
        };
        debugDialogRightOnChange(lsGetItem(lsKeys.debugDialogRight.id));
        debugWrapper.append(
            embyCheckbox(
                {
                    id: lsKeys.debugDialogRight.id,
                    name: lsKeys.debugDialogRight.id,
                    label: lsKeys.debugDialogRight.name,
                },
                lsGetItem(lsKeys.debugDialogRight.id),
                debugDialogRightOnChange
            )
        );
    }

    if (lsGetItem(lsKeys.quickDebugOn.id)) {
        const tabIframeBtn = getById(tabIframeId + 'Btn');
        if (tabIframeBtn) {
            debugWrapper.append(
                embyCheckbox(
                    { id: lsKeys.debugTabIframeEnable.id, name: lsKeys.debugTabIframeEnable.id, label: lsKeys.debugTabIframeEnable.name },
                    false,
                    (checked) => {
                        tabIframeBtn.style.display = checked ? '' : 'none';
                    }
                )
            );
        }
    }

    const h5VideoAdapter = getById(eleIds.h5VideoAdapter);
    if (h5VideoAdapter) {
        debugWrapper.append(
            embyCheckbox(
                {
                    id: lsKeys.debugH5VideoAdapterEnable.id,
                    name: lsKeys.debugH5VideoAdapterEnable.id,
                    label: lsKeys.debugH5VideoAdapterEnable.name,
                },
                lsGetItem(lsKeys.debugH5VideoAdapterEnable.id),
                (checked) => {
                    lsSetItem(lsKeys.debugH5VideoAdapterEnable.id, checked);
                    h5VideoAdapter.style.display = checked ? '' : 'none';
                    h5VideoAdapter.style.backgroundColor = checked ? styles.colors.highlight : '';
                }
            )
        );
    }

    if (lsGetItem(lsKeys.quickDebugOn.id)) {
        debugWrapper.append(
            embyCheckbox(
                {
                    id: lsKeys.debugDanmuAnywhereEnable.id,
                    name: lsKeys.debugDanmuAnywhereEnable.id,
                    label: lsKeys.debugDanmuAnywhereEnable.name,
                },
                false,
                (checked) => {
                    if (checked) {
                        const bodyEle = document.body;
                        const media = document.createElement('video');
                        media.id = 'test-media';
                        const containerEle = document.createElement('div');
                        containerEle.id = 'test-media-container';
                        containerEle.className = mediaContainerQueryStr.replace('.', '');
                        containerEle.style.position = 'fixed';
                        containerEle.style.zIndex = '255';
                        containerEle.prepend(media);
                        bodyEle.prepend(containerEle);
                        media.play();
                        setInterval(() => {
                            media.currentTime += 100 / 1e3;
                            media.dispatchEvent(new Event('timeupdate'));
                        }, 100);
                        createDanmaku(generateRandomDanmu(50000, 600), createDanmakuHooks)
                            .then(() => console.log('弹幕就位'))
                            .catch((err) => console.log(err));
                    } else {
                        if (window.ede?.danmaku) {
                            window.ede.danmaku.destroy();
                            window.ede.danmaku = null;
                        }
                        getById('test-media-container')?.remove();
                    }
                }
            )
        );
    }
}

function buildDebugButton(container) {
    const debugWrapper = getById(eleIds.debugButton, container);
    if (!debugWrapper) return;

    debugWrapper.append(
        embyButton({ label: '打印环境信息', style: 'margin: 0.3em;' }, () => {
            if (typeof require === 'function') {
                require(['browser'], (browser) => console.log('Emby 内部自身判断: ', browser));
            }
            if (typeof ApiClient !== 'undefined') {
                console.log('Emby appName: ', ApiClient.appName());
                console.log('Emby appVersion: ', ApiClient.appVersion());
            }
        })
    );
    debugWrapper.append(
        embyButton({ label: '打印弹幕引擎信息', style: 'margin: 0.3em;' }, () => {
            const msg = `弹幕引擎是否存在: ${!!window.Danmaku}, 弹幕引擎是否实例化成功: ${!!window.ede?.danmaku}`;
            console.log(msg);
            embyToast({ text: msg });
        })
    );
    debugWrapper.append(
        embyButton({ label: '打印视频加载方', style: 'margin: 0.3em;' }, () => {
            const _media = document.querySelector(mediaContainerQueryStr);
            if (!_media) return console.error('严重错误,页面中依旧不存在 <video> 标签');
            if (_media.currentTime < 1) return console.error('严重错误,<video> 的 currentTime < 1');
            if (!_media.id) {
                console.log('视频加载方为 Web 端 <video> 标签:', _media.parentNode?.outerHTML);
            } else {
                console.log('当前 <video> 标签为虚拟适配器:', _media.outerHTML);
                const _embed = document.querySelector('embed');
                if (_embed) {
                    console.log('视频加载方为 <embed> 标签占位的 Native 播放器:', _embed.parentNode?.outerHTML);
                } else {
                    console.log('视频加载方为无占位标签的 Native 播放器,无信息');
                }
            }
        })
    );
    debugWrapper.append(
        embyButton({ label: '重置设置', class: classes.embyButtons.submit, style: 'margin: 0.3em;' }, () => {
            settingsReset(lsKeys, lsBatchSet);
            console.log(`已重置设置, 跳过了 ${lsKeys.filterKeywords.name} 重置`);
            embyToast({ text: `已重置设置, 跳过了 ${lsKeys.filterKeywords.name} 重置` });
            loadDanmaku(LOAD_TYPE.INIT);
            closeEmbyDialog();
        })
    );
}

function buildOpenSourceLicense(container) {
    const openSourceWrapper = getById(eleIds.openSourceLicenseDiv, container);
    if (!openSourceWrapper) return;
    objectEntries(openSourceLicense).forEach(([key, val]) => {
        openSourceWrapper.append(
            embyALink(val.url, [key, val.name, val.version, val.license].join(' : '))
        );
    });
}

/**
 * 构建关于 Tab
 * @param {string} containerId
 */
export function buildAbout(containerId) {
    const container = getById(containerId);
    if (!container) return;

    const template = `
        <div style="height: 30em;">
            <div id="${eleIds.consoleLogCtrl}"></div>
            <div id="${eleIds.consoleLogInfo}">
                <textarea id="${eleIds.consoleLogText}" readOnly style="resize: vertical;margin-top: 0.6em;"
                    rows="12" is="emby-textarea" class="txtOverview emby-textarea"></textarea>
                <textarea id="${eleIds.consoleLogTextInput}" hidden style="resize: vertical;"
                    rows="1" is="emby-textarea" class="txtOverview emby-textarea"></textarea>
            </div>
            <div class="${classes.embyFieldDesc}">注意开启后原本控制台中调用方信息将被覆盖,不使用请保持关闭状态</div>
            <div is="emby-collapse" title="开发者选项">
                <div class="${classes.collapseContentNav}">
                    <label class="${classes.embyLabel}">调试开关: </label>
                    <div id="${eleIds.debugCheckbox}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                    <label class="${classes.embyLabel}">调试按钮: </label>
                    <div id="${eleIds.debugButton}"></div>
                </div>
            </div>
            <div is="emby-collapse" title="开放源代码许可" data-expanded="true" style="margin-top: 0.6em;">
                <div id="${eleIds.openSourceLicenseDiv}" class="${classes.collapseContentNav}" style="display: flex; flex-direction: column;"></div>
            </div>
        </div>
    `;
    container.innerHTML = template.trim();

    buildConsoleLog(container);
    buildDebugCheckbox(container);
    buildDebugButton(container);
    buildOpenSourceLicense(container);
}

export { generateRandomDanmu };
