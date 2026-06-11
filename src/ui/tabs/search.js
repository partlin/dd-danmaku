/**
 * 手动匹配 Tab
 * 从 ede.js 迁移
 */

import { objectEntries } from '../../utils/helpers.js';
import { getById, getByClass } from '../components/common.js';
import { embyInput, embyButton, embySelect, embyCheckbox, embyTabs, embyALink, getTargetInput } from '../components/index.js';
import { eleIds } from '../../config/ele-ids.js';
import { classes, styles, iconKeys } from '../../config/icons.js';
import { lsKeys, lsGetItem, dandanplayApi } from '../../config/api.js';
import { lsSetItem } from '../../core/storage.js';
import { lsLocalKeys } from '../../config/ls-local-keys.js';
import { lsBatchRemove } from '../../core/storage.js';
import { apiPriorityOpts } from '../../config/options.js';
import { corsProxy } from '../../user-config.js';
import { appendvideoOsdDanmakuInfo } from '../../events/video-osd.js';
import { buildCurrentDanmakuInfo } from './info.js';
import { LOAD_TYPE } from '../../config/constants.js';
import { fetchSearchEpisodes, fetchExtcommentActual } from '../../match/search.js';
import { parseAnimeName, writeLsSeasonInfo } from '../../match/episode.js';
import { createDanmaku, loadDanmaku } from '../../danmaku/loader.js';
import { embyToast, closeEmbyDialog } from '../dialog.js';

const createDanmakuHooks = {
    buildCurrentDanmakuInfo,
    appendvideoOsdDanmakuInfo,
};

async function doDanmakuSearchEpisode() {
    const embySearch = getById(eleIds.danmakuSearchName);
    if (!embySearch) return;
    const searchName = embySearch.value.trim();
    const danmakuRemarkEle = getById(eleIds.danmakuRemark);
    if (danmakuRemarkEle) {
        danmakuRemarkEle.parentNode.hidden = false;
        danmakuRemarkEle.innerText = searchName ? '' : '请填写标题';
    }
    const spinnerEle = getByClass(classes.mdlSpinner);
    if (spinnerEle) spinnerEle.classList.remove('hide');

    const apiPriority = lsGetItem(lsKeys.apiPriority.id);
    const apiConfigs = {
        official: {
            name: '官方API',
            prefix: corsProxy + 'https://api.dandanplay.net/api/v2',
            enabled: lsGetItem(lsKeys.useOfficialApi.id),
        },
        custom: {
            name: '自定义API',
            prefix: lsGetItem(lsKeys.customApiPrefix.id),
            enabled: lsGetItem(lsKeys.useCustomApi.id),
        },
    };

    let allAnimes = [];
    for (const apiKey of apiPriority) {
        const config = apiConfigs[apiKey];
        if (!config || !config.enabled || (apiKey === 'custom' && !config.prefix)) continue;

        let manualSearchTitle = searchName;
        let manualSearchEpisode = null;

        if (apiKey === 'official') {
            const parsed = parseAnimeName(searchName);
            if (parsed.season !== null) {
                manualSearchTitle =
                    parsed.season === 1 ? parsed.title : `${parsed.title} 第${parsed.season}季`;
                manualSearchEpisode = parsed.episode;
                console.log(
                    `[手动匹配][官方API优化] 格式化搜索: 标题='${manualSearchTitle}', 集数=${manualSearchEpisode}`
                );
            }
        }
        console.log(
            `[手动匹配][${config.name}] 正在搜索: 标题='${manualSearchTitle}', 集数=${manualSearchEpisode || '无'}`
        );
        const animaInfo = await fetchSearchEpisodes(manualSearchTitle, manualSearchEpisode, config.prefix);
        if (animaInfo && animaInfo.animes.length > 0) {
            console.log(`[手动匹配][${config.name}] 搜索成功，找到 ${animaInfo.animes.length} 个结果。`);
            animaInfo.animes.forEach((anime) => {
                anime.apiPrefix = config.prefix;
                anime.apiName = config.name;
            });
            allAnimes.push(...animaInfo.animes);
        } else {
            console.log(`[手动匹配][${config.name}] 未找到结果。`);
        }
    }

    if (spinnerEle) spinnerEle.classList.add('hide');
    if (allAnimes.length < 1) {
        if (danmakuRemarkEle) danmakuRemarkEle.innerText = '搜索结果为空';
        const switchBtn = getById(eleIds.danmakuSwitchEpisode);
        if (switchBtn) switchBtn.disabled = true;
        const episodeFlag = getById(eleIds.danmakuEpisodeFlag);
        if (episodeFlag) episodeFlag.hidden = true;
        return;
    }
    if (danmakuRemarkEle) danmakuRemarkEle.innerText = '';

    const danmakuAnimeDiv = getById(eleIds.danmakuAnimeDiv);
    const danmakuEpisodeNumDiv = getById(eleIds.danmakuEpisodeNumDiv);
    if (!danmakuAnimeDiv || !danmakuEpisodeNumDiv) return;

    danmakuAnimeDiv.innerHTML = '';
    danmakuEpisodeNumDiv.innerHTML = '';
    window.ede.searchDanmakuOpts.animes = allAnimes;

    let selectAnimeIdx = allAnimes.findIndex(
        (anime) => anime.animeId == window.ede.searchDanmakuOpts.animeId
    );
    selectAnimeIdx = selectAnimeIdx !== -1 ? selectAnimeIdx : 0;

    const animeSelect = embySelect(
        {
            id: eleIds.danmakuAnimeSelect,
            label: '剧集: ',
            style: 'width: auto;max-width: 100%;',
        },
        selectAnimeIdx,
        allAnimes,
        'animeId',
        (opt) => `${opt.animeTitle} 类型：${opt.typeDescription} 来源：${opt.apiName}`,
        doDanmakuAnimeSelect
    );
    danmakuAnimeDiv.append(animeSelect);

    const episodes = allAnimes[selectAnimeIdx]?.episodes || [];
    const episodeNumSelect = embySelect(
        {
            id: eleIds.danmakuEpisodeNumSelect,
            label: '集数: ',
            style: 'width: auto;max-width: 100%;',
        },
        window.ede.searchDanmakuOpts.episode - 1,
        episodes,
        'episodeId',
        (opt, i) => `${i + 1} - ${opt.episodeTitle}`
    );
    danmakuEpisodeNumDiv.append(episodeNumSelect);

    const episodeFlag = getById(eleIds.danmakuEpisodeFlag);
    if (episodeFlag) episodeFlag.hidden = false;
    const switchBtn = getById(eleIds.danmakuSwitchEpisode);
    if (switchBtn) switchBtn.disabled = false;

    const selectedAnime = allAnimes[selectAnimeIdx];
    const searchImg = getById(eleIds.searchImg);
    if (searchImg)
        searchImg.src = selectedAnime.imageUrl || dandanplayApi.posterImg(selectedAnime.animeId);

    const apiSourceDiv = getById(eleIds.searchApiSource);
    if (apiSourceDiv) apiSourceDiv.innerText = `来源: ${selectedAnime.apiName}`;
}

function doSearchTitleSwtich(e) {
    const searchInputEle = getById(eleIds.danmakuSearchName);
    const attrKey = 'isOriginalTitle';
    if ('1' === e.target.getAttribute(attrKey)) {
        e.target.setAttribute(attrKey, '0');
        searchInputEle.value = window.ede.searchDanmakuOpts.animeName;
        return;
    }
    const { _episode_key, seriesOrMovieId } = window.ede.searchDanmakuOpts;
    const episode_info = JSON.parse(localStorage.getItem(_episode_key) || '{}');
    const { animeOriginalTitle } = episode_info;
    if (animeOriginalTitle) {
        e.target.setAttribute(attrKey, '1');
        searchInputEle.value = animeOriginalTitle;
        return;
    }
    if (typeof ApiClient !== 'undefined') {
        ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId).then((item) => {
            if (item?.OriginalTitle) {
                e.target.setAttribute(attrKey, '1');
                searchInputEle.value = item.OriginalTitle;
                episode_info.animeOriginalTitle = item.OriginalTitle;
                localStorage.setItem(_episode_key, JSON.stringify(episode_info));
                if (window.ede.episode_info) window.ede.episode_info.animeOriginalTitle = item.OriginalTitle;
            }
        });
    }
}

function doDanmakuAnimeSelect(value, index, option) {
    const numDiv = getById(eleIds.danmakuEpisodeNumDiv);
    if (!numDiv) return;
    numDiv.innerHTML = '';
    const anime = window.ede.searchDanmakuOpts.animes[index];
    const episodeNumSelect = embySelect(
        { id: eleIds.danmakuEpisodeNumSelect, label: '集数: ' },
        0,
        anime.episodes,
        'episodeId',
        (opt, i) => `${i + 1} - ${opt.episodeTitle}`
    );
    episodeNumSelect.style.maxWidth = '100%';
    numDiv.append(episodeNumSelect);

    const searchImg = getById(eleIds.searchImg);
    if (searchImg) searchImg.src = anime.imageUrl || dandanplayApi.posterImg(anime.animeId);

    const apiSourceDiv = getById(eleIds.searchApiSource);
    if (apiSourceDiv) apiSourceDiv.innerText = `来源: ${anime.apiName}`;
}

function doDanmakuSwitchEpisode() {
    const animeSelect = getById(eleIds.danmakuAnimeSelect);
    const episodeNumSelect = getById(eleIds.danmakuEpisodeNumSelect);
    if (!animeSelect || !episodeNumSelect) return;

    const anime = window.ede.searchDanmakuOpts.animes[animeSelect.selectedIndex];
    const { _episode_key, _season_key, seriesOrMovieId } = window.ede.searchDanmakuOpts;

    const episodeInfo = {
        episodeId: episodeNumSelect.value,
        episodeTitle: episodeNumSelect.options[episodeNumSelect.selectedIndex].text,
        episodeIndex: episodeNumSelect.selectedIndex,
        animeId: anime.animeId,
        animeTitle: anime.animeTitle,
        animeOriginalTitle: '',
        imageUrl: anime.imageUrl,
        seriesOrMovieId: seriesOrMovieId,
        apiPrefix: anime.apiPrefix,
        apiName: anime.apiName,
    };

    const seasonInfo = {
        name: anime.animeTitle,
        episodeOffset: episodeNumSelect.selectedIndex - window.ede.searchDanmakuOpts.episode,
    };
    writeLsSeasonInfo(_season_key, seasonInfo);

    const useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
    const useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
    const apiPriority = lsGetItem(lsKeys.apiPriority.id);
    const enabledApis = apiPriority.filter((apiKey) => {
        if (apiKey === 'official') return useOfficialApi;
        if (apiKey === 'custom') return useCustomApi;
        return false;
    });
    const unique_episode_key = lsLocalKeys.apiPrefix + `${enabledApis.join('_')}_` + _episode_key;
    localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));

    if (window.ede.episode_info) {
        Object.assign(window.ede.episode_info, episodeInfo);
    } else {
        window.ede.episode_info = episodeInfo;
    }
    window.ede.previous_episode_info = { ...window.ede.episode_info };

    console.log('手动匹配成功，已加载新弹幕信息:', episodeInfo);
    loadDanmaku(LOAD_TYPE.RELOAD);
    closeEmbyDialog();
}

function bindManualMatchButtons() {
    const btnClearCache = getById(eleIds.clearLocalMatchCacheBtn);
    if (!btnClearCache) return;
    btnClearCache.addEventListener('click', () => {
        const prefixesToClear = [
            lsLocalKeys.animeEpisodePrefix,
            lsLocalKeys.animeSeasonPrefix,
            lsLocalKeys.animePrefix,
            lsLocalKeys.bangumiEpInfoPrefix,
            lsLocalKeys.bangumiMe,
            lsLocalKeys.apiPrefix,
        ];
        lsBatchRemove(prefixesToClear);

        if (window.ede.episode_info) {
            window.ede.episode_info.episodeId = null;
            window.ede.episode_info.animeId = null;
            window.ede.episode_info.animeTitle = null;
            window.ede.episode_info.episodeTitle = null;
        }

        if (window.ede.searchDanmakuOpts) {
            window.ede.searchDanmakuOpts.animes = [];
            window.ede.searchDanmakuOpts.episodes = [];
        }

        embyToast({ text: '本地匹配缓存已清除,包括animeId、episodeId等所有匹配信息' });
        loadDanmaku(LOAD_TYPE.REFRESH);
    });
}

function buildSearchEpisodeEle() {
    const searchNameDiv = getById(eleIds.danmakuSearchNameDiv);
    if (!searchNameDiv) return;

    searchNameDiv.append(
        embyInput(
            {
                id: eleIds.danmakuSearchName,
                value: window.ede.searchDanmakuOpts?.animeName || '',
                type: 'search',
            },
            doDanmakuSearchEpisode
        )
    );
    searchNameDiv.append(
        embyButton({ label: '搜索', iconKey: iconKeys.search }, doDanmakuSearchEpisode)
    );
    searchNameDiv.append(
        embyButton({ label: '切换[原]标题', iconKey: iconKeys.text_format }, doSearchTitleSwtich)
    );

    const episodeLoad = getById(eleIds.danmakuEpisodeLoad);
    if (episodeLoad) {
        episodeLoad.append(
            embyButton(
                { id: eleIds.danmakuSwitchEpisode, label: '加载弹幕', iconKey: iconKeys.done },
                doDanmakuSwitchEpisode
            )
        );
    }

    const currentMatchedDiv = getById(eleIds.currentMatchedDiv);
    if (currentMatchedDiv) {
        currentMatchedDiv.append(
            embyButton({ label: '取消匹配/清空弹幕', iconKey: iconKeys.close }, () => {
                if (window.ede.episode_info?.episodeId) {
                    window.ede.episode_info.episodeId = null;
                }
                if (window.ede.danmaku) {
                    createDanmaku([], createDanmakuHooks);
                }
                const label = currentMatchedDiv.querySelector('label');
                if (label) label.textContent = '弹弹 play 总量: 0';
            })
        );
    }
}

function buildExtUrlsDiv() {
    const episodeId = window.ede.episode_info?.episodeId || null;
    const comments = window.ede.danmuCache?.[episodeId] || [];
    const curExtCommentCache = window.ede.extCommentCache?.[window.ede.itemId] || {};
    const allComments = comments.concat(...Object.values(curExtCommentCache));
    const extUrlsDiv = getById(eleIds.extUrlsDiv);
    if (!extUrlsDiv) return;
    extUrlsDiv.innerHTML = '';

    objectEntries(curExtCommentCache).forEach(([key, val]) => {
        const extUrlDiv = document.createElement('div');
        extUrlDiv.append(
            embyButton({ label: '清空此加载', iconKey: iconKeys.close }, (e) => {
                delete curExtCommentCache[key];
                e.target.parentNode.remove();
                createDanmaku(allComments.filter((c) => c.fromUrl !== key), createDanmakuHooks);
            })
        );
        extUrlDiv.append(embyALink(key), document.createTextNode(` 总量: ${val.length}`));
        extUrlsDiv.append(extUrlDiv);
    });
}

async function onEnterExtComment(e) {
    const extUrl = getTargetInput(e).value.trim();
    if (!extUrl.startsWith('http')) {
        embyToast({ text: '输入的 url 应以 http 开头!' });
        return;
    }
    addExtComments(extUrl);
}

async function addExtComments(extUrl, extComments) {
    const episode_info = window.ede.episode_info;
    const episodeId = episode_info?.episodeId || null;
    const comments = window.ede.danmuCache?.[episodeId] || [];
    if (!extComments) {
        extComments = await fetchExtcommentActual(extUrl, comments);
    }
    if (extComments.length === 0) {
        embyToast({ text: '附加弹幕不能为空!' });
        return;
    }
    const allComments = comments.concat(extComments);
    createDanmaku(allComments, createDanmakuHooks)
        .then(() => {
            const beforeLength = window.ede.commentsParsed.length - extComments.length;
            embyToast({
                text: `此次附加总量: ${extComments.length}, 附加前总量: ${beforeLength}, 附加后总量: ${allComments.length}`,
            });
            console.log(`附加弹幕就位, 附加前总量: ${beforeLength}`);
            buildExtUrlsDiv();
        })
        .catch((err) => console.log(err));
}

function buildExtCommentDiv() {
    const extCommentSearchDiv = getById(eleIds.extCommentSearchDiv);
    if (!extCommentSearchDiv) return;
    buildExtUrlsDiv();
    extCommentSearchDiv.append(
        embyInput({ type: 'search', placeholder: 'http(s)://' }, onEnterExtComment)
    );
    extCommentSearchDiv.append(
        embyButton({ label: '搜索', iconKey: iconKeys.search }, onEnterExtComment)
    );
}

function buildDanmuPluginDiv() {
    const danmuPluginDiv = getById(eleIds.danmuPluginDiv);
    if (!danmuPluginDiv) return;
    danmuPluginDiv.append(
        embyCheckbox(
            { id: lsKeys.useFetchPluginXml.id, name: lsKeys.useFetchPluginXml.id, label: lsKeys.useFetchPluginXml.name },
            lsGetItem(lsKeys.useFetchPluginXml.id),
            (checked) => lsSetItem(lsKeys.useFetchPluginXml.id, checked)
        )
    );
}

function buildCustomApiDiv() {
    const apiCheckboxListDiv = getById(eleIds.apiCheckboxListDiv);
    if (!apiCheckboxListDiv) return;

    apiCheckboxListDiv.append(
        embyCheckbox(
            { id: lsKeys.useOfficialApi.id, name: lsKeys.useOfficialApi.id, label: lsKeys.useOfficialApi.name },
            lsGetItem(lsKeys.useOfficialApi.id),
            (checked) => lsSetItem(lsKeys.useOfficialApi.id, checked)
        )
    );
    apiCheckboxListDiv.append(
        embyCheckbox(
            { id: lsKeys.useCustomApi.id, name: lsKeys.useCustomApi.id, label: lsKeys.useCustomApi.name },
            lsGetItem(lsKeys.useCustomApi.id),
            (checked) => lsSetItem(lsKeys.useCustomApi.id, checked)
        )
    );

    const apiPriorityDiv = getById(eleIds.apiPriorityDiv);
    if (apiPriorityDiv) {
        apiPriorityDiv.append(
            embyTabs(
                apiPriorityOpts,
                lsGetItem(lsKeys.apiPriority.id)[0],
                'id',
                'name',
                (value, tabIndex) => {
                    const currentPriority = lsGetItem(lsKeys.apiPriority.id);
                    const apiPriorityArr = apiPriorityOpts.map((opt) => opt.id);
                    const newPriority =
                        currentPriority[0] === apiPriorityArr[1]
                            ? [apiPriorityArr[0], apiPriorityArr[1]]
                            : [apiPriorityArr[1], apiPriorityArr[0]];
                    lsSetItem(lsKeys.apiPriority.id, newPriority);
                    console.log(
                        '[API优先级] 切换为:',
                        newPriority[0] === apiPriorityOpts[0].id ? apiPriorityOpts[0].name : apiPriorityOpts[1].name
                    );
                }
            )
        );
    }

    const customApiPrefixInputDiv = getById(eleIds.customApiPrefixInputDiv);
    if (customApiPrefixInputDiv) {
        customApiPrefixInputDiv.append(
            embyInput(
                {
                    id: 'customApiPrefixInput',
                    value: lsGetItem(lsKeys.customApiPrefix.id) || '',
                    type: 'search',
                },
                null,
                (e) => {
                    const val = e.target.value.trim();
                    lsSetItem(lsKeys.customApiPrefix.id, val);
                    embyToast({ text: '自定义API地址已保存', secondaryText: val });
                }
            )
        );
    }
}

/**
 * 构建手动匹配 Tab
 * @param {string} containerId
 */
export function buildSearchEpisode(containerId) {
    const container = getById(containerId);
    if (!container) return;

    const episodeId = window.ede?.episode_info?.episodeId || null;
    const comments = window.ede?.danmuCache?.[episodeId] || [];

    const template = `
        <div>
            <div>
                <label class="${classes.embyLabel}">标题: </label>
                <div id="${eleIds.danmakuSearchNameDiv}" style="display: flex;"></div>
            </div>
            <div id="${eleIds.danmakuEpisodeFlag}" hidden>
                <div style="display: flex;">
                    <div style="width: 80%;">
                        <label class="${classes.embyLabel}">媒体名: </label>
                        <div id="${eleIds.danmakuAnimeDiv}" class="${classes.embySelectWrapper}"></div>
                        <label class="${classes.embyLabel}">分集名: </label>
                        <div style="display: flex;">
                            <div id="${eleIds.danmakuEpisodeNumDiv}" style="max-width: 90%;" class="${classes.embySelectWrapper}"></div>
                            <div id="${eleIds.danmakuEpisodeLoad}"></div>
                        </div>
                    </div>
                    <div style="width: 20%; margin: 0 2%; text-align: center;">
                        <img id="${eleIds.searchImg}" style="width: 100%; height: auto;"
                            loading="lazy" decoding="async" draggable="false" class="coveredImage-noScale"></img>
                        <div id="${eleIds.searchApiSource}" class="${classes.embyFieldDesc}" style="margin-top: 0.5em;">
                        </div>
                    </div>
                </div>
            </div>
            <div hidden>
                <label class="${classes.embyLabel}" id="${eleIds.danmakuRemark}"></label>
            </div>
            <div>
                <h4>匹配源</h4>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div id="${eleIds.currentMatchedDiv}">
                            <label class="${classes.embyLabel}">弹弹 play 总量: ${comments.length}</label>
                        </div>
                        <label class="${classes.embyLabel}">弹弹 play 附加的第三方 url: </label>
                    </div>
                    <button is="emby-button" type="button"
                        class="${classes.embyButtons.basic}" id="${eleIds.clearLocalMatchCacheBtn}">
                        清除本地匹配缓存
                    </button>
                </div>
                <div id="${eleIds.extUrlsDiv}"></div>
            </div>
            <div is="emby-collapse" title="附加弹幕">
                <div class="${classes.collapseContentNav}">
                    <label class="${classes.embyLabel}">弹弹 play 支持解析的第三方 url: </label>
                    <div id="${eleIds.extCommentSearchDiv}" style="display: flex;"></div>
                    <div class="${classes.embyFieldDesc}">
                        原接口文档说明支持(如A/B/C站),自测另外支持[ 爱奇艺视频, 腾讯视频, 优酷视频, ],不支持[ 芒果 TV, ]
                    </div>
                    <div class="${classes.embyFieldDesc}">
                        仅[ 爱奇艺视频, ]需要注意网址后不能带 ? 的参数,其余网址带不带都可以
                    </div>
                    <div class="${classes.embyFieldDesc}">
                        详细网址示例: 弹弹 play PC 官方客户端 -> 添加更多弹幕 -> 查看支持解析的网址示例
                    </div>
                </div>
            </div>
            <div is="emby-collapse" title="服务端 Danmu 插件">
                <div class="${classes.collapseContentNav}">
                    <div id="${eleIds.danmuPluginDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList}"></div>
                </div>
            </div>
            <div is="emby-collapse" title="API选择、自定义API配置">
                <div class="${classes.collapseContentNav}">
                    <div id="${eleIds.apiCheckboxListDiv}" class="${classes.embyCheckboxList}" style="${styles.embyCheckboxList} align-items: center;">
                    </div>
                    <label class="${classes.embyLabel}">${lsKeys.apiPriority.name}: </label>
                    <div id="${eleIds.apiPriorityDiv}" style="margin: 1% 0;">
                    </div>
                    <label class="${classes.embyLabel}">${lsKeys.customApiPrefix.name}: </label>
                    <div id="${eleIds.customApiPrefixInputDiv}" style="display: flex;">
                    </div>
                    <div class="${classes.embyFieldDesc}">
                        如需自定义弹幕API地址,请填写完整URL(如 https://api.example.com ),<br>留空则使用原生API
                    </div>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = template.trim();

    buildSearchEpisodeEle();
    buildExtCommentDiv();
    buildDanmuPluginDiv();
    bindManualMatchButtons();
    buildCustomApiDiv();
}
