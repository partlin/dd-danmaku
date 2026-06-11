/**
 * 弹幕信息 Tab
 * 从 ede.js 迁移
 */

import { getById, embyImg, embyImgButton } from '../components/common.js';
import { embyButton, embyTabs } from '../components/index.js';
import { eleIds } from '../../config/ele-ids.js';
import { classes, styles, iconKeys } from '../../config/icons.js';
import { lsKeys } from '../../config/api.js';
import { dandanplayApi } from '../../config/api.js';
import { bangumiApi } from '../../config/api.js';
import { fetchJson } from '../../utils/fetch.js';
import { getEpisodeBangumiRel, renderBangumiCharacters } from '../../bangumi/index.js';
import { danmuListOpts } from '../../config/options.js';
import { getDanmakuComments } from '../../config/options.js';
import { danmakuParser } from '../../danmaku/index.js';

/**
 * 构建弹幕信息 Tab
 * @param {string} containerId
 */
export function buildCurrentDanmakuInfo(containerId) {
    const container = getById(containerId);
    if (!container) return;

    const episode_info = window.ede?.episode_info || {};
    const { episodeTitle, animeId, animeTitle, apiName } = episode_info;
    const loadSum = window.ede ? getDanmakuComments(window.ede).length : 0;
    const downloadSum = window.ede?.commentsParsed?.length || 0;

    const template = `
        <div style="display: flex;">
            <div id="${eleIds.posterImgDiv}"></div>
            <div>
                <div>
                    <label class="${classes.embyLabel}">媒体名: </label>
                    <div class="${classes.embyFieldDesc}">${animeTitle || '-'}</div>
                </div>
                ${episodeTitle ? `<div><label class="${classes.embyLabel}">章节名: </label><div class="${classes.embyFieldDesc}">${episodeTitle}</div></div>` : ''}
                <div>
                    <label class="${classes.embyLabel}">其它信息: </label>
                    <div class="${classes.embyFieldDesc}">获取总数: ${downloadSum}, 加载总数: ${loadSum}, 被过滤数: ${downloadSum - loadSum}</div>
                </div>
            </div>
        </div>
        <div style="margin-top: 2%;">
            <label class="${classes.embyLabel}">${lsKeys.danmuList.name}: </label>
            <div id="${eleIds.danmuListDiv}" style="margin: 1% 0;"></div>
        </div>
        <div id="${eleIds.extInfoCtrlDiv}" style="margin: 0.6em 0;"></div>
        <div id="${eleIds.extInfoDiv}" hidden>
            <label class="${classes.embyLabel}">Bangumi 角色介绍: </label>
            <div id="${eleIds.characterImgHeihtDiv}" style="width: 36.5em; text-align: center;"></div>
            <div id="${eleIds.charactersDiv}" style="display: flex; flex-wrap: wrap;"></div>
        </div>
    `;
    container.innerHTML = template.trim();

    if (animeId) {
        getById(eleIds.posterImgDiv, container).append(
            embyImgButton(embyImg(dandanplayApi.posterImg(animeId)), 'width: calc((var(--videoosd-tabs-height) - 3em) * (2 / 3)); margin-right: 1em;')
        );
    }

    buildDanmuListDiv(container);
    buildExtInfo(container);
}

function buildDanmuListDiv(container) {
    const episodeId = window.ede?.episode_info?.episodeId;
    const extCommentCache = window.ede?.extCommentCache?.[window.ede.itemId] || {};
    const danmuListExts = Object.values(extCommentCache).map((value, index) => ({
        id: `ext${index + 1}`,
        name: `附加${index + 1}`,
        onChange: () => danmakuParser(value),
    }));
    let danmuListTabOpts = danmuListOpts;
    if (danmuListExts.length > 0) {
        const dandanplayListOpt = {
            id: 'dandanplay',
            name: '弹弹 play',
            onChange: () => {
                const comments = window.ede?.danmuCache?.[episodeId];
                return comments ? danmakuParser(comments) : [];
            },
        };
        danmuListTabOpts = danmuListTabOpts.concat(dandanplayListOpt).concat(danmuListExts);
    }
    getById(eleIds.danmuListDiv, container).append(
        embyTabs(danmuListTabOpts, lsKeys.danmuList.defaultValue, 'id', 'name', () => {})
    );
}

function onSliderChangeLabel(val, opts) {
    if (opts?.labelId) getById(opts.labelId).innerText = val;
    if (opts?.labelEle) opts.labelEle.innerText = val;
}

function buildExtInfo(container) {
    const extInfoCtrlDiv = getById(eleIds.extInfoCtrlDiv, container);
    extInfoCtrlDiv.append(
        embyButton({ label: '额外信息', iconKey: iconKeys.more }, (e) => {
            const xChecked = !e.target.xChecked;
            e.target.xChecked = xChecked;
            e.target.title = xChecked ? '关闭' : '额外信息';
            e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
            const extInfoDiv = getById(eleIds.extInfoDiv);
            extInfoDiv.hidden = !xChecked;
            const charactersDiv = getById(eleIds.charactersDiv);
            if (charactersDiv.firstChild) return;
            const bangumiInfo = window.ede?.bangumiInfo;
            if (bangumiInfo?.characters && bangumiInfo.animeId === window.ede?.episode_info?.animeId) {
                return renderBangumiCharacters(charactersDiv, bangumiInfo.characters);
            }
            getEpisodeBangumiRel()
                .then((bangumiInfo) => fetchJson(bangumiApi.getCharacters(bangumiInfo.subjectId)))
                .then((characters) => {
                    if (window.ede.bangumiInfo) window.ede.bangumiInfo.characters = characters;
                    renderBangumiCharacters(charactersDiv, characters);
                })
                .catch((err) => console.error(err));
        })
    );
}
