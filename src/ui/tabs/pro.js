/**
 * 高级设置 Tab
 * 从 ede.js 迁移
 */

import { getById, getByClass } from '../components/common.js';
import {
    embyButton,
    embySlider,
    embyCheckbox,
    embyCheckboxList,
    embyTabs,
    embyInput,
    embyTextarea,
    embyALink,
    getTargetInput,
} from '../components/index.js';
import { eleIds } from '../../config/ele-ids.js';
import { classes, styles, iconKeys, timeOffsetBtns } from '../../config/icons.js';
import { lsKeys, lsGetItem, bangumiApi } from '../../config/api.js';
import { lsSetItem, lsCheckSet, lsCheckOld } from '../../core/storage.js';
import { mediaContainerQueryStr } from '../../config/constants.js';
import {
    danmakuTypeFilterOpts,
    danmakuSource,
    showSource,
    danmakuEngineOpts,
    danmakuChConverOpts,
    timeoutCallbackUnitOpts,
    labels,
    getDanmakuComments,
} from '../../config/options.js';
import { LOAD_TYPE } from '../../config/constants.js';
import { loadDanmaku } from '../../danmaku/loader.js';
import { buildProgressBarChart } from '../../danmaku/chart.js';
import { appendvideoOsdDanmakuInfo, addHeaderClock, removeHeaderClock } from '../../events/video-osd.js';
import { customeUrl } from '../../config/custome-url.js';
import { fetchBangumiApiGetMe } from '../../bangumi/api.js';
import { closeEmbyDialog } from '../dialog.js';

let timeoutCallbackId;
const timeoutCallbackClear = () => timeoutCallbackId && clearTimeout(timeoutCallbackId);
const timeoutCallbackTypeOpts = [
    { id: '0', name: '不启用', onChange: () => timeoutCallbackClear() },
    {
        id: '1',
        name: '退出播放',
        onChange: (ms) => {
            timeoutCallbackClear();
            timeoutCallbackId = setTimeout(() => {
                closeEmbyDialog();
                if (typeof Emby !== 'undefined' && Emby.InputManager) {
                    Emby.InputManager.trigger('back');
                }
            }, ms);
        },
    },
    {
        id: '2',
        name: '返回主页',
        onChange: (ms) => {
            timeoutCallbackClear();
            timeoutCallbackId = setTimeout(() => {
                closeEmbyDialog();
                if (typeof Emby !== 'undefined' && Emby.Page) {
                    Emby.Page.goHome();
                }
            }, ms);
        },
    },
];

function onSliderChange(val, opts) {
    onSliderChangeLabel(opts.label != null ? opts.label : val, opts);
    if (opts.lsKey?.id && lsCheckSet(opts.lsKey.id, val)) {
        const needReload = opts.needReload === undefined ? true : opts.needReload;
        if (opts.isManual) return;
        console.log(`${opts.lsKey.id} changed to ${val}, needReload: ${needReload}`);
        if (needReload) loadDanmaku(LOAD_TYPE.RELOAD);
    }
}

function onSliderChangeLabel(val, opts) {
    if (opts?.labelId) {
        const el = getById(opts.labelId);
        if (el) el.innerText = val;
    }
    if (opts?.labelEle) opts.labelEle.innerText = val;
}

function doDanmakuTypeFilterSelect() {
    const checkList = Array.from(document.getElementsByName(eleIds.danmakuTypeFilterSelectName))
        .filter((item) => item.checked)
        .map((item) => item.value);
    lsSetItem(lsKeys.typeFilter.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
}

function doDanmakuSourceFilterSelect() {
    const checkList = Array.from(document.getElementsByName(eleIds.danmakuSourceFilterSelectName))
        .filter((item) => item.checked)
        .map((item) => item.value);
    lsSetItem(lsKeys.sourceFilter.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
}

function doDanmakuShowSourceSelect() {
    const checkList = Array.from(document.getElementsByName(eleIds.danmakuShowSourceSelectName))
        .filter((item) => item.checked)
        .map((item) => item.value);
    lsSetItem(lsKeys.showSource.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
}

function doDanmakuChConverChange(value) {
    window.ede.chConvert = value.id;
    lsSetItem(lsKeys.chConvert.id, window.ede.chConvert);
    loadDanmaku(LOAD_TYPE.REFRESH);
    console.log(value.name);
}

function doDanmakuEngineSelect(value) {
    const selectedValue = value.id;
    if (lsCheckSet(lsKeys.engine.id, selectedValue)) {
        console.log(`已更改弹幕引擎为: ${selectedValue}`);
        loadDanmaku(LOAD_TYPE.RELOAD);
    }
}

function doDanmakuFilterKeywordsBtnClick(event) {
    const btn = event.currentTarget;
    if (btn) {
        btn.style = '';
        btn.disabled = true;
    }
    const keywords = getById(eleIds.filterKeywordsId)?.value?.trim() || '';
    const enable = getById(eleIds.filterKeywordsEnableId)?.checked ?? false;
    lsCheckSet(lsKeys.filterKeywordsEnable.id, enable);
    if (!lsCheckSet(lsKeys.filterKeywords.id, keywords) && keywords === '') return;
    loadDanmaku(LOAD_TYPE.RELOAD);
}

function updateFilterKeywordsBtn(btn, flag, keywords) {
    const isSame =
        lsCheckOld(lsKeys.filterKeywordsEnable.id, flag) &&
        lsCheckOld(lsKeys.filterKeywords.id, keywords);
    if (btn) {
        btn.firstChild.innerHTML = isSame ? iconKeys.done_disabled : iconKeys.done;
        btn.disabled = isSame;
    }
}

function buildDanmakuFilterSetting(container) {
    const typeFilterDiv = getById(eleIds.danmakuTypeFilterDiv, container);
    const sourceFilterDiv = getById(eleIds.danmakuSourceFilterDiv, container);
    const showSourceDiv = getById(eleIds.danmakuShowSourceDiv, container);

    if (typeFilterDiv) {
        typeFilterDiv.append(
            embyCheckboxList(
                'danmakuTypeFilterList',
                eleIds.danmakuTypeFilterSelectName,
                lsGetItem(lsKeys.typeFilter.id),
                Object.values(danmakuTypeFilterOpts).filter((o) => !o.hidden),
                doDanmakuTypeFilterSelect
            )
        );
    }
    if (sourceFilterDiv) {
        sourceFilterDiv.append(
            embyCheckboxList(
                'danmakuSourceFilterList',
                eleIds.danmakuSourceFilterSelectName,
                lsGetItem(lsKeys.sourceFilter.id),
                Object.values(danmakuSource),
                doDanmakuSourceFilterSelect
            )
        );
    }
    if (showSourceDiv) {
        showSourceDiv.append(
            embyCheckboxList(
                'danmakuShowSourceList',
                eleIds.danmakuShowSourceSelectName,
                lsGetItem(lsKeys.showSource.id),
                Object.values(showSource),
                doDanmakuShowSourceSelect
            )
        );
    }

    const autoFilterDiv = getById(eleIds.danmakuAutoFilterCountDiv);
    if (autoFilterDiv) {
        autoFilterDiv.append(embySlider({ lsKey: lsKeys.autoFilterCount }, onSliderChange, onSliderChangeLabel));
    }

    const filterProDiv = getById(eleIds.danmakuFilterProDiv, container);
    if (filterProDiv) {
        filterProDiv.append(
            embyCheckbox(
                { id: 'mergeSimilarEnable', name: 'mergeSimilarEnable', label: labels.enable },
                lsGetItem(lsKeys.mergeSimilarEnable.id),
                (checked) => {
                    lsSetItem(lsKeys.mergeSimilarEnable.id, checked);
                    loadDanmaku(LOAD_TYPE.RELOAD);
                }
            )
        );
    }

    const mergePercentDiv = getById(eleIds.mergeSimilarPercentDiv);
    if (mergePercentDiv) {
        mergePercentDiv.append(
            embySlider({ lsKey: lsKeys.mergeSimilarPercent }, onSliderChange, onSliderChangeLabel)
        );
    }
    const mergeTimeDiv = getById(eleIds.mergeSimilarTimeDiv);
    if (mergeTimeDiv) {
        mergeTimeDiv.append(
            embySlider({ lsKey: lsKeys.mergeSimilarTime }, onSliderChange, onSliderChangeLabel)
        );
    }

    const keywordsContainer = getById(eleIds.filterKeywordsDiv, container);
    if (keywordsContainer) {
        const keywordsEnableDiv = keywordsContainer.appendChild(document.createElement('div'));
        const keywordsBtn = embyButton(
            { label: '加载关键词过滤', iconKey: iconKeys.done_disabled },
            doDanmakuFilterKeywordsBtnClick
        );
        keywordsBtn.disabled = true;
        keywordsEnableDiv.setAttribute(
            'style',
            'display: flex; justify-content: space-between; align-items: center; width: 100%;'
        );
        keywordsEnableDiv.append(
            embyCheckbox(
                { id: eleIds.filterKeywordsEnableId, name: eleIds.filterKeywordsEnableId, label: labels.enable },
                lsGetItem(lsKeys.filterKeywordsEnable.id),
                (flag) =>
                    updateFilterKeywordsBtn(
                        keywordsBtn,
                        flag,
                        getById(eleIds.filterKeywordsId)?.value?.trim() || ''
                    )
            )
        );
        keywordsEnableDiv.appendChild(document.createElement('div')).appendChild(keywordsBtn);
        keywordsContainer.appendChild(document.createElement('div')).appendChild(
            embyTextarea(
                {
                    id: eleIds.filterKeywordsId,
                    value: lsGetItem(lsKeys.filterKeywords.id),
                    style: 'width: 100%;margin-top: 0.2em;',
                    rows: 8,
                },
                (event) =>
                    updateFilterKeywordsBtn(
                        keywordsBtn,
                        getById(eleIds.filterKeywordsEnableId)?.checked ?? false,
                        event.target?.value?.trim() || ''
                    )
            )
        );
        const label = document.createElement('label');
        label.innerText = `关键词/正则匹配过滤,支持过滤[正文,${Object.values(showSource)
            .map((o) => o.name)
            .join()}],多个表达式用换行分隔`;
        label.className = classes.embyFieldDesc;
        keywordsContainer.appendChild(document.createElement('div')).appendChild(label);
    }
}

function buildExtSetting(container) {
    const chConverDiv = getById(eleIds.danmakuChConverDiv, container);
    const engineDiv = getById(eleIds.danmakuEngineDiv, container);
    if (chConverDiv) {
        chConverDiv.append(
            embyTabs(
                danmakuChConverOpts,
                window.ede?.chConvert ?? lsGetItem(lsKeys.chConvert.id),
                'id',
                'name',
                doDanmakuChConverChange
            )
        );
    }
    if (engineDiv) {
        engineDiv.append(
            embyTabs(danmakuEngineOpts, lsGetItem(lsKeys.engine.id), 'id', 'name', doDanmakuEngineSelect)
        );
    }
}

function buildOsdSetting() {
    const osdCheckboxDiv = getById(eleIds.osdCheckboxDiv);
    const osdLineChartDiv = getById(eleIds.osdLineChartDiv);
    const osdLineChartTimeDiv = getById(eleIds.osdLineChartTimeDiv);

    if (osdCheckboxDiv) {
        osdCheckboxDiv.append(
            embyCheckbox(
                { id: lsKeys.osdTitleEnable.id, name: lsKeys.osdTitleEnable.id, label: lsKeys.osdTitleEnable.name },
                lsGetItem(lsKeys.osdTitleEnable.id),
                (checked) => {
                    lsSetItem(lsKeys.osdTitleEnable.id, checked);
                    const videoOsdContainer = document.querySelector(
                        `${mediaContainerQueryStr} .videoOsdSecondaryText`
                    );
                    const videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
                    if (videoOsdDanmakuTitle) {
                        videoOsdDanmakuTitle.style.display = checked ? 'block' : 'none';
                    } else if (checked) {
                        appendvideoOsdDanmakuInfo(getDanmakuComments(window.ede).length);
                    }
                }
            )
        );
        osdCheckboxDiv.append(
            embyCheckbox(
                {
                    id: lsKeys.osdHeaderClockEnable.id,
                    name: lsKeys.osdHeaderClockEnable.id,
                    label: lsKeys.osdHeaderClockEnable.name,
                },
                lsGetItem(lsKeys.osdHeaderClockEnable.id),
                (checked) => {
                    lsSetItem(lsKeys.osdHeaderClockEnable.id, checked);
                    checked ? addHeaderClock() : removeHeaderClock();
                }
            )
        );
    }
    if (osdLineChartDiv) {
        osdLineChartDiv.append(
            embyCheckbox(
                {
                    id: lsKeys.osdLineChartEnable.id,
                    name: lsKeys.osdLineChartEnable.id,
                    label: lsKeys.osdLineChartEnable.name,
                },
                lsGetItem(lsKeys.osdLineChartEnable.id),
                (checked) => {
                    lsSetItem(lsKeys.osdLineChartEnable.id, checked);
                    const progressBarLineChart = getById(eleIds.progressBarLineChart);
                    if (progressBarLineChart) {
                        progressBarLineChart.style.display = checked ? 'block' : 'none';
                    } else if (checked) {
                        buildProgressBarChart(20);
                    }
                }
            )
        );
        osdLineChartDiv.append(
            embyCheckbox(
                {
                    id: lsKeys.osdLineChartSkipFilter.id,
                    name: lsKeys.osdLineChartSkipFilter.id,
                    label: lsKeys.osdLineChartSkipFilter.name,
                },
                lsGetItem(lsKeys.osdLineChartSkipFilter.id),
                (checked) => {
                    lsSetItem(lsKeys.osdLineChartSkipFilter.id, checked);
                    buildProgressBarChart(20);
                }
            )
        );
    }
    if (osdLineChartTimeDiv) {
        osdLineChartTimeDiv.append(
            embySlider(
                { lsKey: lsKeys.osdLineChartTime, needReload: false },
                (val, opts) => {
                    onSliderChange(val, opts);
                    if (lsGetItem(lsKeys.osdLineChartEnable.id)) buildProgressBarChart(20);
                },
                onSliderChangeLabel
            )
        );
    }
}

function buildPlaySetting(container) {
    const btnContainer = getById(eleIds.timeoutCallbackDiv, container);
    const timeoutCallbacktOpts = {
        labelId: eleIds.timeoutCallbackLabel,
        key: lsKeys.timeoutCallbackValue.id,
        needReload: false,
    };
    onSliderChangeLabel(lsGetItem(lsKeys.timeoutCallbackValue.id), timeoutCallbacktOpts);
    if (btnContainer) {
        timeOffsetBtns.forEach((btn) => {
            btnContainer.append(
                embyButton(btn, (e) => {
                    if (e.target) {
                        let oldValue = lsGetItem(lsKeys.timeoutCallbackValue.id);
                        let newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
                        if (newValue === oldValue || newValue < 0) newValue = 0;
                        onSliderChange(newValue, timeoutCallbacktOpts);
                    }
                })
            );
        });
    }

    const unitDiv = getById(eleIds.timeoutCallbackUnitDiv, container);
    if (unitDiv) {
        unitDiv.append(
            embyTabs(
                timeoutCallbackUnitOpts,
                lsGetItem(lsKeys.timeoutCallbackUnit.id),
                'id',
                'name',
                (value, index) => lsSetItem(lsKeys.timeoutCallbackUnit.id, index)
            )
        );
    }

    const typeDiv = getById(eleIds.timeoutCallbackTypeDiv, container);
    if (typeDiv) {
        typeDiv.append(
            embyTabs(timeoutCallbackTypeOpts, timeoutCallbackTypeOpts[0].id, 'id', 'name', (value) => {
                const unitObj = timeoutCallbackUnitOpts[lsGetItem(lsKeys.timeoutCallbackUnit.id)];
                value.onChange(lsGetItem(lsKeys.timeoutCallbackValue.id) * unitObj.msRate);
            })
        );
    }
}

function onEnterBangumiToken(e) {
    const bangumiToken = getById(eleIds.bangumiTokenInput)?.value?.trim() || '';
    lsSetItem(lsKeys.bangumiToken.id, bangumiToken);
    const label = getById(eleIds.bangumiTokenLabel);
    fetchBangumiApiGetMe(bangumiToken)
        .then(() => {
            if (label) {
                label.innerText = 'Bangumi Token 验证成功';
                label.style.color = 'green';
            }
        })
        .catch((error) => {
            if (label) {
                label.innerText = 'Bangumi Token 验证失败';
                label.style.color = 'red';
            }
            throw error;
        });
}

function buildBangumiSetting(container) {
    const bangumiSettingsDiv = getById(eleIds.bangumiSettingsDiv, container);
    const bangumiEnable = lsGetItem(lsKeys.bangumiEnable.id);
    if (bangumiSettingsDiv) bangumiSettingsDiv.hidden = !bangumiEnable;

    const bangumiEnableLabel = getById(eleIds.bangumiEnableLabel, container);
    if (bangumiEnableLabel) {
        bangumiEnableLabel.append(
            embyCheckbox(
                {
                    id: lsKeys.bangumiEnable.id,
                    name: lsKeys.bangumiEnable.id,
                    label: lsKeys.bangumiEnable.name,
                },
                bangumiEnable,
                (checked) => {
                    lsSetItem(lsKeys.bangumiEnable.id, checked);
                    if (bangumiSettingsDiv) bangumiSettingsDiv.hidden = !checked;
                }
            )
        );
    }

    const bangumiTokenInputDiv = getById(eleIds.bangumiTokenInputDiv, container);
    if (bangumiTokenInputDiv) {
        bangumiTokenInputDiv.append(
            embyInput(
                {
                    id: eleIds.bangumiTokenInput,
                    type: 'password',
                    value: lsGetItem(lsKeys.bangumiToken.id),
                },
                onEnterBangumiToken
            )
        );
        bangumiTokenInputDiv.append(
            embyButton({ label: '校验', iconKey: iconKeys.check }, onEnterBangumiToken)
        );
    }

    const bangumiPostPercentDiv = getById(eleIds.bangumiPostPercentDiv, container);
    if (bangumiPostPercentDiv) {
        bangumiPostPercentDiv.append(
            embySlider(
                { lsKey: lsKeys.bangumiPostPercent, needReload: false },
                (val, opts) => onSliderChange(val, opts),
                onSliderChangeLabel
            )
        );
    }

    const bangumiTokenLinkDiv = getById(eleIds.bangumiTokenLinkDiv, container);
    if (bangumiTokenLinkDiv) {
        bangumiTokenLinkDiv.append(embyALink(bangumiApi.accessTokenUrl, bangumiApi.accessTokenUrl));
    }
}

function buildCustomUrlSetting(container) {
    const customeUrlsDiv = getById(eleIds.customeUrlsDiv, container);
    if (!customeUrlsDiv) return;

    const getTemplate = (obj) => `
        <label class="${classes.embyLabel}">${obj.lsKey.name}(${obj.msg1}): </label>
        <div id="${obj.divId}" style="display: flex;"></div>
        <div class="${classes.embyFieldDesc}">${obj.msg2 || ''}</div>
    `;

    customeUrl.mapping.forEach((obj) => {
        customeUrlsDiv.innerHTML += getTemplate(obj);
    });
    customeUrl.mapping.forEach((obj) => {
        const inputDiv = getById(obj.divId, container);
        if (!inputDiv) return;
        const onEnter = (e) => {
            const target = getTargetInput(e);
            let value = target?.value?.trim() || '';
            if (!value) {
                value = obj.lsKey.defaultValue;
                if (target) target.value = value;
            }
            lsSetItem(obj.lsKey.id, value);
            obj.rewrite(value);
        };
        inputDiv.append(embyInput({ type: 'search', value: lsGetItem(obj.lsKey.id) }, onEnter));
        inputDiv.append(embyButton({ label: '确认', iconKey: iconKeys.check }, onEnter));
    });
}

/**
 * 构建高级设置 Tab
 * @param {string} containerId
 */
export function buildProSetting(containerId) {
    const container = getById(containerId);
    if (!container) return;

    const template = `
        <div style="height: 30em;">
            <div is="emby-collapse" title="弹幕屏蔽" data-expanded="true">
                <div class="${classes.collapseContentNav}">
                    <div id="${eleIds.danmakuTypeFilterDiv}" style="margin-bottom: 0.2em;">
                        <label class="${classes.embyLabel}">${lsKeys.typeFilter.name}: </label>
                    </div>
                    <div id="${eleIds.danmakuSourceFilterDiv}">
                        <label class="${classes.embyLabel}">${lsKeys.sourceFilter.name}: </label>
                    </div>
                    <div id="${eleIds.danmakuShowSourceDiv}">
                        <label class="${classes.embyLabel}">${lsKeys.showSource.name}: </label>
                    </div>
                </div>
            </div>
            <div is="emby-collapse" title="弹幕高级屏蔽">
                <div class="${classes.collapseContentNav}">
                    <div>
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width: 10em;">${lsKeys.autoFilterCount.name}: </label>
                            <div id="${eleIds.danmakuAutoFilterCountDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label style="${styles.embySliderLabel}">0</label>
                        </div>
                        <label class="${classes.embyLabel}">${lsKeys.mergeSimilarEnable.name}: </label>
                        <div id="${eleIds.danmakuFilterProDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width: 10em;">${lsKeys.mergeSimilarPercent.name}: </label>
                            <div id="${eleIds.mergeSimilarPercentDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label><label style="${styles.embySliderLabel}"></label><label>%</label></label>
                        </div>
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width: 10em;">${lsKeys.mergeSimilarTime.name}: </label>
                            <div id="${eleIds.mergeSimilarTimeDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label style="${styles.embySliderLabel}">-1</label>
                        </div>
                    </div>
                    <div id="${eleIds.filterKeywordsDiv}" style="margin-bottom: 0.2em;">
                        <label class="${classes.embyLabel}">${lsKeys.filterKeywords.name}: </label>
                    </div>
                </div>
            </div>
            <div is="emby-collapse" title="额外设置">
                <div class="${classes.collapseContentNav}" style="padding-top: 0.5em !important;">
                    <div id="${eleIds.extCheckboxDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                    <div id="${eleIds.danmakuChConverDiv}" style="margin-bottom: 0.2em;">
                        <label class="${classes.embyLabel}">${lsKeys.chConvert.name}: </label>
                    </div>
                    <div id="${eleIds.danmakuEngineDiv}" style="margin-bottom: 0.2em;">
                        <label class="${classes.embyLabel}">${lsKeys.engine.name}: </label>
                    </div>
                </div>
            </div>
            <div is="emby-collapse" title="播放界面设置">
                <div class="${classes.collapseContentNav}">
                    <div id="${eleIds.osdCheckboxDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                    <div>
                        <div id="${eleIds.osdLineChartDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width: 12em;">${lsKeys.osdLineChartTime.name}: </label>
                            <div id="${eleIds.osdLineChartTimeDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label style="${styles.embySliderLabel}"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div is="emby-collapse" title="播放设置">
                <div class="${classes.collapseContentNav}">
                    <label class="${classes.embyLabel}">单次定时执行: </label>
                    <div id="${eleIds.timeoutCallbackTypeDiv}"></div>
                    <label class="${classes.embyLabel}">定时单位: </label>
                    <div id="${eleIds.timeoutCallbackUnitDiv}"></div>
                    <div style="${styles.embySlider} margin-top: 0.3em;">
                        <label class="${classes.embyLabel}" style="width:4em;">${lsKeys.timeoutCallbackValue.name}: </label>
                        <div id="${eleIds.timeoutCallbackDiv}" style="width: 15.5em; text-align: center;"></div>
                        <label id="${eleIds.timeoutCallbackLabel}" style="${styles.embySliderLabel}"></label>
                    </div>
                </div>
            </div>
            <div is="emby-collapse" title="Bangumi 设置">
                <div class="${classes.collapseContentNav}" style="padding-top: 0.5em !important;">
                    <label id="${eleIds.bangumiEnableLabel}" class="${classes.embyLabel}"></label>
                    <div id="${eleIds.bangumiSettingsDiv}">
                        <div id="${eleIds.bangumiTokenInputDiv}" style="display: flex;"></div>
                        <div id="${eleIds.bangumiTokenLabel}" class="${classes.embyFieldDesc}"></div>
                        <div class="${classes.embyFieldDesc}">你可以在以下链接生成一个 Access Token</div>
                        <div id="${eleIds.bangumiTokenLinkDiv}" style="padding-bottom: 0.5em;"></div>
                        <label class="${classes.embyLabel}">自动更新单章节收藏信息: </label>
                        <div style="${styles.embySlider}">
                            <label class="${classes.embyLabel}" style="width:4em;">${lsKeys.bangumiPostPercent.name}: </label>
                            <div id="${eleIds.bangumiPostPercentDiv}" style="width: 15.5em; text-align: center;"></div>
                            <label><label style="${styles.embySliderLabel}"></label><label>%</label></label>
                        </div>
                        <div class="${classes.embyFieldDesc}">
                            触发时机为正常停止播放,且播放进度超过设定百分比时;
                            同步的媒体信息为自动匹配而来,可在"弹幕信息"中查看;
                            自动匹配有误可"手动匹配",仍无法匹配可点击按钮X"取消匹配/清除弹幕",则此单章节不会同步;
                        </div>
                    </div>
                </div>
            </div>
            <div is="emby-collapse" title="自定义接口地址">
                <div id="${eleIds.customeUrlsDiv}" class="${classes.collapseContentNav}"></div>
            </div>
        </div>
    `;
    container.innerHTML = template.trim();

    buildDanmakuFilterSetting(container);
    buildExtSetting(container);
    buildOsdSetting();
    buildPlaySetting(container);
    buildBangumiSetting(container);
    buildCustomUrlSetting(container);
}
