/**
 * 弹幕加载与创建
 * 依赖运行时: window.Danmaku, window.ede, mediaContainerQueryStr
 */

import { objectEntries } from '../utils/helpers.js';
import { isVersionOld } from '../config/constants.js';
import { LOAD_TYPE } from '../config/constants.js';
import { mediaContainerQueryStr, mediaQueryStr } from '../config/constants.js';
import { lsGetItem, lsKeys } from '../config/api.js';
import { eleIds } from '../config/ele-ids.js';
import { currentDanmakuInfoContainerId } from '../config/options.js';
import { getById, getByClass, waitForElement } from '../utils/dom.js';
import { danmakuParser } from './parser.js';
import { danmakuFilter } from './filter.js';
import { buildProgressBarChart } from './chart.js';
import { getEpisodeInfo } from '../match/get-episode-info.js';
import { fetchComment, fetchExtcommentActual } from '../match/search.js';

/**
 * 创建并初始化弹幕实例
 * @param {object[]} comments - 原始弹幕数据
 * @param {object} [hooks] - 可选回调 { buildCurrentDanmakuInfo, appendvideoOsdDanmakuInfo }
 * @returns {Promise<void>}
 */
export async function createDanmaku(comments, hooks = {}) {
    if (!comments) return;

    const buildCurrentDanmakuInfo =
        hooks.buildCurrentDanmakuInfo || (() => {});
    const appendvideoOsdDanmakuInfo =
        hooks.appendvideoOsdDanmakuInfo || (() => {});

    if (window.ede.danmaku) {
        window.ede.danmaku.destroy();
        window.ede.danmaku = null;
    }

    window.ede.commentsOriginal = comments;
    const commentsParsed = danmakuParser(comments);
    window.ede.commentsParsed = commentsParsed;
    const _comments = danmakuFilter(commentsParsed);
    console.log('[加载]弹幕成功: ' + _comments.length);

    const _media = document.querySelector(mediaQueryStr);
    if (!_media) {
        if (!window.ede.danmaku) {
            window.ede.danmaku = { comments: _comments };
        }
        buildCurrentDanmakuInfo(currentDanmakuInfoContainerId);
        throw new Error('用户已退出视频播放');
    }

    if (!isVersionOld) _media.style.position = 'absolute';

    const wrapperTop = 0;
    let wrapper = getById(eleIds.danmakuWrapper);
    if (wrapper) wrapper.remove();
    wrapper = document.createElement('div');
    wrapper.id = eleIds.danmakuWrapper;
    wrapper.style.cssText = `
        position: fixed;
        width: 100%;
        height: calc(${lsGetItem(lsKeys.heightPercent.id)}% - ${wrapperTop}px);
        background-color: ${lsGetItem(lsKeys.debugShowDanmakuWrapper.id) ? 'rgba(115, 160, 255, 0.3)' : ''};
        top: ${wrapperTop}px;
        pointer-events: none;
    `;

    const _container = await waitForElement(mediaContainerQueryStr);
    _container.prepend(wrapper);

    const _speed = 144 * lsGetItem(lsKeys.speed.id);
    const DanmakuClass = window.Danmaku;
    if (!DanmakuClass) {
        throw new Error('Danmaku 引擎未加载');
    }

    window.ede.danmaku = new DanmakuClass({
        container: wrapper,
        media: _media,
        comments: _comments,
        engine: lsGetItem(lsKeys.engine.id),
        speed: _speed,
    });

    lsGetItem(lsKeys.switch.id) ? window.ede.danmaku.show() : window.ede.danmaku.hide();

    if (window.ede.ob) {
        window.ede.ob.disconnect();
    }
    window.ede.ob = new ResizeObserver(() => {
        if (window.ede.danmaku) {
            window.ede.danmaku.resize();
            if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
                buildProgressBarChart(20);
            }
        }
    });
    window.ede.ob.observe(_container);

    if (_media.id) {
        if (typeof require === 'function') {
            require(['playbackManager'], (playbackManager) => {
                if (
                    playbackManager?.getCurrentPlayer() &&
                    playbackManager.getPlayerState()?.PlayState?.IsPaused
                ) {
                    _media.dispatchEvent(new Event('pause'));
                }
            });
        }
    }

    buildCurrentDanmakuInfo(currentDanmakuInfoContainerId);
    appendvideoOsdDanmakuInfo(_comments.length);

    if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
        buildProgressBarChart(20);
    }
}

/**
 * 从服务端 Danmu 插件获取 XML 弹幕
 * @param {string} mediaServerItemId
 * @returns {Promise<object[]|null>}
 */
export async function getCommentsByPluginApi(mediaServerItemId) {
    if (typeof ApiClient === 'undefined') return null;
    const url = `${ApiClient.serverAddress()}/api/danmu/${mediaServerItemId}/raw?X-Emby-Token=${ApiClient.accessToken()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const xmlText = await response.text();
        if (!xmlText?.length) return null;
        const parser = new DOMParser();
        const data = parser.parseFromString(xmlText, 'text/xml');
        const comments = [];
        for (const comment of data.getElementsByTagName('d')) {
            const p = comment.getAttribute('p')?.split(',').map(Number) || [];
            comments.push({
                cid: p[7],
                p: `${p[0]},${p[1]},${p[3]},${p[6]}`,
                m: comment.textContent,
            });
        }
        return comments;
    } catch (error) {
        console.error('Failed to parse XML data:', error);
        return null;
    }
}

async function addExtCommentsForLoad(extUrl, extComments, hooks = {}) {
    const episodeId = window.ede?.episode_info?.episodeId;
    const comments = window.ede?.danmuCache?.[episodeId] || [];
    if (!extComments) {
        extComments = await fetchExtcommentActual(extUrl, comments);
    }
    if (!extComments?.length) return;
    const allComments = comments.concat(extComments);
    await createDanmaku(allComments, hooks).catch((err) => console.log(err));
}

/**
 * 加载弹幕（主入口）
 * @param {string} loadType - LOAD_TYPE
 * @param {object} [hooks] - { buildCurrentDanmakuInfo }
 */
export async function loadDanmaku(loadType = LOAD_TYPE.CHECK, hooks = {}) {
    const _media = document.querySelector(mediaQueryStr);
    if (!_media) {
        console.warn('用户已退出视频播放,停止加载弹幕');
        return false;
    }
    if (loadType === LOAD_TYPE.RELOAD) window.ede.loading = false;
    if (window.ede?.loading) {
        console.log('正在重新加载');
        return false;
    }
    window.ede.loading = true;

    const buildCurrentDanmakuInfoFn = hooks.buildCurrentDanmakuInfo || (() => {});
    const appendvideoOsdDanmakuInfoFn = hooks.appendvideoOsdDanmakuInfo || (() => {});
    const createHooks = {
        buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
        appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn,
    };

    try {
        window.ede.onlineDanmakuOk = false;
        const onlineLoaded = await loadOnlineDanmaku(loadType, hooks);
        if (onlineLoaded || !lsGetItem(lsKeys.useFetchPluginXml.id)) return onlineLoaded;

        const comments = await getCommentsByPluginApi(window.ede.itemId);
        if (!comments?.length) return false;

        await createDanmaku(comments, createHooks);
        window.ede.onlineDanmakuOk = true;
        console.log(`${lsKeys.useFetchPluginXml.name}:就位(在线失败回退服务端)`);
        const ctr = getById(eleIds.danmakuCtr);
        if (ctr) ctr.style.opacity = '1';
        const title = getById(eleIds.videoOsdDanmakuTitle);
        if (title) title.innerText = `弹幕：${lsKeys.useFetchPluginXml.name} - ${comments.length}条`;
        return true;
    } catch (error) {
        console.error('[加载]弹幕加载失败:', error);
        return false;
    } finally {
        window.ede.loading = false;
    }
}

/**
 * 在线加载弹幕
 * @param {string} loadType
 * @param {object} [hooks] - { buildCurrentDanmakuInfo }
 */
export async function loadOnlineDanmaku(loadType, hooks = {}) {
    const buildCurrentDanmakuInfoFn = hooks.buildCurrentDanmakuInfo || (() => {});
    const appendvideoOsdDanmakuInfoFn = hooks.appendvideoOsdDanmakuInfo || (() => {});

    const createHooks = {
        buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
        appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn,
    };

    try {
        const info = await getEpisodeInfo(
            loadType !== LOAD_TYPE.SEARCH,
            appendvideoOsdDanmakuInfoFn
        );
        if (!info) {
            if (loadType !== LOAD_TYPE.INIT) console.log('播放器未完成加载');
            return false;
        }
        if (
            ![LOAD_TYPE.SEARCH, LOAD_TYPE.REFRESH, LOAD_TYPE.RELOAD, LOAD_TYPE.INIT].includes(loadType) &&
            window.ede?.danmaku &&
            window.ede?.episode_info?.episodeId == info.episodeId
        ) {
            console.log('当前播放视频未变动');
            window.ede.onlineDanmakuOk = true;
            return true;
        }

        if (window.ede.episode_info) {
            window.ede.previous_episode_info = { ...window.ede.episode_info };
        }
        window.ede.episode_info = info;
        const episodeId = info.episodeId;
        let comments =
            loadType === LOAD_TYPE.RELOAD ? window.ede?.danmuCache?.[episodeId] : null;
        if (!comments) {
            comments = await fetchComment(episodeId);
            window.ede.danmuCache = window.ede.danmuCache || {};
            window.ede.danmuCache[episodeId] = comments;
        }
        if (!comments?.length) return false;

        await createDanmaku(comments, createHooks);
        window.ede.onlineDanmakuOk = true;

        const extCommentCache = window.ede?.extCommentCache?.[window.ede.itemId] || {};
        try {
            await Promise.all(
                objectEntries(extCommentCache).map(([key, val]) =>
                    addExtCommentsForLoad(key, val, createHooks)
                )
            );
        } catch (error) {
            console.warn('[在线弹幕]附加弹幕加载失败，不影响主弹幕:', error);
        }
        const ctr = getById(eleIds.danmakuCtr);
        if (ctr) ctr.style.opacity = '1';
        return true;
    } catch (error) {
        console.error('[在线弹幕]加载失败:', error);
        window.ede.onlineDanmakuOk = false;
        return false;
    }
}
