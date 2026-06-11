/**
 * 弹幕设置 Tab
 * 从 ede.js 迁移
 */

import { getById } from '../components/common.js';
import { embyButton, embySlider, embySelect, embyInput, getTargetInput } from '../components/index.js';
import { eleIds } from '../../config/ele-ids.js';
import { lsKeys, lsGetItem } from '../../config/api.js';
import { classes, styles, iconKeys, timeOffsetBtns } from '../../config/icons.js';
import { lsSetItem, lsCheckSet, lsBatchSet } from '../../core/storage.js';
import { getSettingsJson } from '../../utils/helpers.js';
import { LOAD_TYPE } from '../../config/constants.js';
import { loadDanmaku } from '../../danmaku/loader.js';
import { getCommentStyle } from '../../danmaku/parser.js';
import { closeEmbyDialog } from '../dialog.js';

function doDanmakuSwitch() {
    const flag = !lsGetItem(lsKeys.switch.id);
    console.log(`切换${lsKeys.switch.name}: ${flag}`);
    if (window.ede?.danmaku) {
        flag ? window.ede.danmaku.show() : window.ede.danmaku.hide();
    }
    const osdDanmakuSwitchBtn = getById(eleIds.danmakuSwitchBtn);
    if (osdDanmakuSwitchBtn) {
        osdDanmakuSwitchBtn.firstChild.innerHTML = flag ? iconKeys.comment : iconKeys.comments_disabled;
    }
    const switchElement = getById(eleIds.danmakuSwitch);
    if (switchElement) {
        switchElement.firstChild.innerHTML = flag ? iconKeys.switch_on : iconKeys.switch_off;
        switchElement.style.color = flag ? styles.colors.switchActiveColor : '';
    }
    lsSetItem(lsKeys.switch.id, flag);
}

function onSliderChange(val, opts) {
    onSliderChangeLabel(opts.label != null ? opts.label : val, opts);
    if (opts.lsKey?.id && lsCheckSet(opts.lsKey.id, val)) {
        const needReload = opts.needReload === undefined ? true : opts.needReload;
        if (opts.isManual) {
            return;
        }
        console.log(`${opts.lsKey.id} changed to ${val}, needReload: ${needReload}`);
        if (needReload) {
            changeFontStylePreview();
            loadDanmaku(LOAD_TYPE.RELOAD);
        }
    }
}

function onSliderChangeLabel(val, opts) {
    if (opts?.labelId) {
        const el = getById(opts.labelId);
        if (el) el.innerText = val;
    }
    if (opts?.labelEle) {
        opts.labelEle.innerText = val;
    }
}

function changeFontStylePreview() {
    const fontStylePreview = getById(eleIds.fontStylePreview);
    if (!fontStylePreview) return;
    const fontWeight = lsGetItem(lsKeys.fontWeight.id);
    const fontStyle = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)]?.id || 'normal';
    const fontFamily = lsGetItem(lsKeys.fontFamily.id);
    const fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255)
        .toString(16)
        .padStart(2, '0');
    const baseColor = Number(styles.colors.info).toString(16).padStart(6, '0');
    const color = `${baseColor}${fontOpacity}`;
    const shadowColor = baseColor === '000000' ? `#ffffff${fontOpacity}` : `#000000${fontOpacity}`;
    const fontSizeReferent = fontStylePreview.previousElementSibling;
    const fontSize = fontSizeReferent
        ? parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', ''))
        : 16;
    const cmtStyle = getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily);
    Object.assign(fontStylePreview.style, cmtStyle);
}

function buildFontFamilyCtrl(container) {
    const fontFamilyCtrl = getById(eleIds.fontFamilyCtrl, container);
    if (!fontFamilyCtrl) return;
    fontFamilyCtrl.innerHTML = '';
    fontFamilyCtrl.append(
        embyButton({ label: '切换手填', iconKey: iconKeys.edit }, (e) => {
            const xChecked = !e.target.xChecked;
            e.target.xChecked = xChecked;
            e.target.title = xChecked ? '手填' : '选择';
            const selectEl = getById(eleIds.fontFamilySelect);
            const inputEl = getById(eleIds.fontFamilyInput);
            if (selectEl) selectEl.style.display = xChecked ? 'none' : '';
            if (inputEl) inputEl.style.display = xChecked ? '' : 'none';
            if (xChecked) {
                const labelEl = getById(eleIds.fontFamilyLabel);
                if (labelEl) labelEl.innerHTML = '';
            }
        })
    );
    fontFamilyCtrl.append(
        embyButton({ label: '重置为默认', iconKey: iconKeys.refresh }, () => {
            if (lsCheckSet(lsKeys.fontFamily.id, lsKeys.fontFamily.defaultValue)) {
                changeFontStylePreview();
                onSliderChangeLabel(lsKeys.fontFamily.defaultValue, { labelId: eleIds.fontFamilyLabel });
                const inputEl = getById(eleIds.fontFamilyInput);
                if (inputEl) inputEl.value = lsGetItem(lsKeys.fontFamily.id);
                loadDanmaku(LOAD_TYPE.RELOAD);
            }
        })
    );
}

function resetFontFamilyDiv(selectedIndexOrValue, opts, container) {
    const fontFamilyDiv = getById(eleIds.fontFamilyDiv, container);
    if (!fontFamilyDiv) return;
    fontFamilyDiv.innerHTML = '';
    const parent = container || document;
    fontFamilyDiv.append(
        embySelect(
            { id: eleIds.fontFamilySelect, label: `${lsKeys.fontFamily.name}: ` },
            selectedIndexOrValue,
            opts,
            'family',
            'family',
            (value, index, option) => {
                if (lsCheckSet(lsKeys.fontFamily.id, value)) {
                    changeFontStylePreview();
                    const labelVal = option.family !== option.fullName ? option.fullName : '';
                    onSliderChangeLabel(labelVal, { labelId: eleIds.fontFamilyLabel });
                    loadDanmaku(LOAD_TYPE.RELOAD);
                }
            },
            (e) => {
                if ('queryLocalFonts' in window && opts.length <= 6) {
                    queryLocalFonts()
                        .then((fonts) => {
                            const merged = [...opts, ...fonts].reduce((acc, font) => {
                                if (!acc.some((f) => f.family === font.family)) acc.push(font);
                                return acc;
                            }, []);
                            const fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
                            const idx = merged.findIndex((f) => f.family === fontFamilyVal);
                            resetFontFamilyDiv(idx, merged, container);
                        })
                        .catch((err) => console.error(err));
                    console.info('queryLocalFonts 高级查询 API 可用,已补充字体列表');
                }
            }
        )
    );
    fontFamilyDiv.append(
        embyInput(
            {
                id: eleIds.fontFamilyInput,
                value: lsGetItem(lsKeys.fontFamily.id),
                type: 'search',
                style: 'display: none;',
            },
            (e) => {
                const inputVal = getTargetInput(e).value.trim();
                if (!inputVal) return;
                if (lsCheckSet(lsKeys.fontFamily.id, inputVal)) {
                    changeFontStylePreview();
                    loadDanmaku(LOAD_TYPE.RELOAD);
                }
            }
        )
    );
    changeFontStylePreview();
    const fontFamilyOpt = opts.find((opt) => opt.family === lsGetItem(lsKeys.fontFamily.id));
    const labelVal = fontFamilyOpt ? fontFamilyOpt.fullName : '';
    onSliderChangeLabel(labelVal, { labelId: eleIds.fontFamilyLabel });
}

function buildFontFamilySetting(container) {
    const fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
    const availableFonts = [
        { family: lsKeys.fontFamily.defaultValue, fullName: lsKeys.fontFamily.defaultValue },
        { family: 'Consolas', fullName: 'Consolas' },
        { family: 'SimHei', fullName: '黑体' },
        { family: 'SimSun', fullName: '宋体' },
        { family: 'KaiTi', fullName: '楷体' },
        { family: 'Microsoft YaHei', fullName: '微软雅黑' },
    ];
    const selectedIndex = availableFonts.findIndex((f) => f.family === fontFamilyVal);
    resetFontFamilyDiv(selectedIndex, availableFonts, container);
    buildFontFamilyCtrl(container);
}

function buildFontStyleSetting(container) {
    const parent = container || document;
    const fontWeightDiv = getById(eleIds.danmakuFontWeightDiv, parent);
    const fontStyleDiv = getById(eleIds.danmakuFontStyleDiv, parent);
    if (fontWeightDiv) {
        fontWeightDiv.append(embySlider({ lsKey: lsKeys.fontWeight }, onSliderChange, onSliderChangeLabel));
    }
    if (fontStyleDiv) {
        fontStyleDiv.append(
            embySlider(
                { lsKey: lsKeys.fontStyle },
                (val, opts) => {
                    opts.label = styles.fontStyles[val].id;
                    onSliderChange(val, opts);
                },
                (val, opts) => onSliderChangeLabel(styles.fontStyles[val].id, opts)
            )
        );
    }
    buildFontFamilySetting(container);
}

function buildSettingsBackup(container) {
    const settingsCtrlEle = getById(eleIds.settingsCtrl, container);
    if (!settingsCtrlEle) return;
    settingsCtrlEle.append(
        embyButton({ label: '配置', iconKey: iconKeys.more }, (e) => {
            const xChecked = !e.target.xChecked;
            e.target.xChecked = xChecked;
            e.target.title = xChecked ? '关闭' : '配置';
            e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
            const settingsTextEle = getById(eleIds.settingsText);
            if (settingsTextEle) {
                settingsTextEle.style.display = xChecked ? '' : 'none';
                if (xChecked) settingsTextEle.value = getSettingsJson(lsKeys, lsGetItem, 2);
            }
            [eleIds.settingReloadBtn, eleIds.settingsImportBtn].forEach((id) => {
                const el = getById(id);
                if (el) el.style.display = xChecked ? '' : 'none';
            });
        })
    );
    settingsCtrlEle.append(
        embyButton(
            { id: eleIds.settingReloadBtn, label: '刷新', iconKey: iconKeys.refresh, style: 'display: none;' },
            () => {
                const el = getById(eleIds.settingsText);
                if (el) el.value = getSettingsJson(lsKeys, lsGetItem, 2);
            }
        )
    );
    settingsCtrlEle.append(
        embyButton(
            { id: eleIds.settingsImportBtn, label: '应用', iconKey: iconKeys.done, style: 'display: none;' },
            () => {
                const textEl = getById(eleIds.settingsText);
                if (textEl?.value) {
                    lsBatchSet(JSON.parse(textEl.value));
                    loadDanmaku(LOAD_TYPE.INIT);
                    closeEmbyDialog();
                }
            }
        )
    );
}

/**
 * 构建弹幕设置 Tab
 * @param {string} containerId
 */
export function buildDanmakuSetting(containerId) {
    const container = getById(containerId);
    if (!container) return;

    const template = `
        <div style="display: flex; justify-content: center;">
            <div>
                <div id="${eleIds.danmakuSwitchDiv}" style="margin-bottom: 0.2em;">
                    <label class="${classes.embyLabel}">${lsKeys.switch.name} </label>
                </div>
                <div style="${styles.embySlider}">
                    <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.filterLevel.name}: </label>
                    <div id="${eleIds.filterLevelDiv}" style="width: 15.5em; text-align: center;"></div>
                    <label style="${styles.embySliderLabel}"></label>
                </div>
                <div style="${styles.embySlider}">
                    <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.heightPercent.name}: </label>
                    <div id="${eleIds.heightPercentDiv}" style="width: 15.5em; text-align: center;"></div>
                    <label>
                        <label style="${styles.embySliderLabel}"></label>
                        <label>%</label>
                    </label>
                </div>
                <div style="${styles.embySlider}">
                    <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontSizeRate.name}: </label>
                    <div id="${eleIds.danmakuSizeDiv}" style="width: 15.5em; text-align: center;"></div>
                    <label>
                        <label style="${styles.embySliderLabel}"></label>
                        <label>倍</label>
                    </label>
                </div>
                <div style="${styles.embySlider}">
                    <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontOpacity.name}: </label>
                    <div id="${eleIds.danmakuOpacityDiv}" style="width: 15.5em; text-align: center;"></div>
                    <label style="${styles.embySliderLabel}"></label>
                </div>
                <div style="${styles.embySlider}">
                    <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.speed.name}: </label>
                    <div id="${eleIds.danmakuSpeedDiv}" style="width: 15.5em; text-align: center;"></div>
                    <label>
                        <label style="${styles.embySliderLabel}"></label>
                        <label>倍</label>
                    </label>
                </div>
                <div style="${styles.embySlider}">
                    <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.timelineOffset.name}: </label>
                    <div id="${eleIds.timelineOffsetDiv}" style="width: 15.5em; text-align: center;"></div>
                    <label style="${styles.embySliderLabel}"></label>
                </div>
                <div is="emby-collapse" title="弹幕字体样式" data-expanded="false">
                    <div class="${classes.collapseContentNav}">
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontWeight.name}: </label>
                            <div id="${eleIds.danmakuFontWeightDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label style="${styles.embySliderLabel}"></label>
                        </div>
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontStyle.name}: </label>
                            <div id="${eleIds.danmakuFontStyleDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label style="${styles.embySliderLabel}"></label>
                        </div>
                        <div id="${eleIds.fontFamilyCtrl}" style="margin: 0.6em 0;"></div>
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width: 5em;">${lsKeys.fontFamily.name}: </label>
                            <div id="${eleIds.fontFamilyDiv}" class="${classes.embySelectWrapper}"></div>
                            <label id="${eleIds.fontFamilyLabel}" style="width: 10em; margin-left: 1em;"></label>
                        </div>
                        <div style="max-width: 31.5em;">
                            <label class="${classes.embyLabel}" style="width: 5em;">弹幕外观: </label>
                            <div id="${eleIds.fontStylePreview}"
                                class="flex justify-content-center"
                                style="border: .08em solid gray;color: black;border-radius: .24em;padding: .5em;;background-color: #6a96bd;">
                                简中/繁體/English/こんにちはウォルド/</br>
                                ABC/abc/012/~!@<?>[]/《？》【】</br>
                                ☆*: .｡. o(≧▽≦)o .｡.:*☆</br>
                                emoji:😆👏🎈🍋🌞⁉️🎉</br>
                            </div>
                            <div class="${classes.embyFieldDesc}">
                                这些设置会影响此设备上的弹幕外观,此处固定为 dom 引擎,
                                canvas 引擎效果一样,此处不做切换展示,
                                因为弹幕大小是根据播放页次标题动态计算的,此处不做参考,
                                选择或输入的字体是否有效取决于设备本身的字体库,没有网络加载
                            </div>
                        </div>
                    </div>
                </div>
                <div id="${eleIds.settingsCtrl}" style="margin: 0.6em 0;"></div>
                <textarea id="${eleIds.settingsText}" style="display: none;resize: vertical;width: 100%" rows="20"
                    is="emby-textarea" class="txtOverview emby-textarea"></textarea>
            </div>
        </div>
    `;
    container.innerHTML = template.trim();

    getById(eleIds.danmakuSwitchDiv, container).prepend(
        embyButton(
            {
                id: eleIds.danmakuSwitch,
                label: '弹幕开关',
                iconKey: lsGetItem(lsKeys.switch.id) ? iconKeys.switch_on : iconKeys.switch_off,
                style: (lsGetItem(lsKeys.switch.id) ? 'color:#52b54b;' : '') + 'font-size:1.5em;padding:0;',
            },
            doDanmakuSwitch
        )
    );

    getById(eleIds.filterLevelDiv, container).append(
        embySlider({ lsKey: lsKeys.filterLevel }, onSliderChange, onSliderChangeLabel)
    );
    getById(eleIds.heightPercentDiv, container).append(
        embySlider({ lsKey: lsKeys.heightPercent }, onSliderChange, onSliderChangeLabel)
    );
    getById(eleIds.danmakuSizeDiv, container).append(
        embySlider({ lsKey: lsKeys.fontSizeRate }, onSliderChange, onSliderChangeLabel)
    );
    getById(eleIds.danmakuOpacityDiv, container).append(
        embySlider({ lsKey: lsKeys.fontOpacity }, onSliderChange, onSliderChangeLabel)
    );
    getById(eleIds.danmakuSpeedDiv, container).append(
        embySlider({ lsKey: lsKeys.speed }, onSliderChange, onSliderChangeLabel)
    );

    const btnContainer = getById(eleIds.timelineOffsetDiv, container);
    const nextEle = btnContainer?.nextElementSibling;
    const labelEle = nextEle?.children?.length > 0 ? nextEle.children[0] : nextEle;
    const timelineOffsetOpts = { lsKey: lsKeys.timelineOffset, labelEle };
    onSliderChangeLabel(lsGetItem(lsKeys.timelineOffset.id), timelineOffsetOpts);
    timeOffsetBtns.forEach((btn) => {
        btnContainer?.append(
            embyButton(btn, (e) => {
                if (e.target) {
                    let oldValue = lsGetItem(lsKeys.timelineOffset.id);
                    let newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
                    if (newValue === oldValue) newValue = 0;
                    onSliderChange(newValue, timelineOffsetOpts);
                }
            })
        );
    });

    buildFontStyleSetting(container);
    buildSettingsBackup(container);
}
