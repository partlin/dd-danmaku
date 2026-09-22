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
import { getActiveMediaContainer, getPlaybackMedia, getById, waitForElement } from '../utils/dom.js';
import { danmakuParser } from './parser.js';
import { danmakuFilter } from './filter.js';
import { buildProgressBarChart } from './chart.js';
import { getEpisodeInfo } from '../match/get-episode-info.js';
import { fetchComment, fetchExtcommentActual } from '../match/search.js';
import { aggregateExtComments } from './aggregate.js';
import { syncVirtualMediaPlaybackState } from '../events/h5-video-adapter.js';
import {
    beginLoadSession,
    assertLoadSession,
    finishLoadSession,
    isLoadSessionCurrent,
} from '../core/lifecycle.js';

/**
 * 创建并初始化弹幕实例
 * @param {object[]} comments - 原始弹幕数据
 * @param {object} [hooks] - 可选回调 { buildCurrentDanmakuInfo, appendvideoOsdDanmakuInfo }
 * @returns {Promise<void>}
 */
export async function createDanmaku(comments, hooks = {}) {
    if (!comments) return;
    const session = hooks.session;
    if (session) assertLoadSession(window.ede, session);

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

    const wrapperTop = 0;
    let candidateContainer = null;
    let stableChecks = 0;
    const _container = await waitForElement(
        () => {
            const container = getActiveMediaContainer(mediaContainerQueryStr);
            if (!container) return null;

            // playbackstart 早于 Emby OSD 的根节点切换。连续一秒取到同一
            // 可见根节点后再创建 canvas，避免它随后变成 page-hidden 而缩成 0x0。
            if (container !== candidateContainer) {
                candidateContainer = container;
                stableChecks = 0;
            }
            stableChecks += 1;
            return stableChecks >= 10 ? container : null;
        },
        null,
        0,
        100,
        window.ede?.destroyIntervalIds
    );
    if (!_container) throw new DOMException('Danmaku container wait cancelled', 'AbortError');
    if (session) assertLoadSession(window.ede, session);

    // Emby 新版过渡时会将实际 video 移到 body；DOM 工具会排除隐藏旧 OSD。
    const _media = getPlaybackMedia(
        mediaContainerQueryStr,
        mediaQueryStr,
        eleIds.h5VideoAdapter
    );
    if (!_media) throw new Error('当前播放页不存在 video 标签');
    if (!isVersionOld) _media.style.position = 'absolute';

    let wrapper = getById(eleIds.danmakuWrapper, _container);
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
                if (!playbackManager?.getCurrentPlayer()) return;
                syncVirtualMediaPlaybackState(_media, playbackManager.getPlayerState?.());
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
export async function getCommentsByPluginApi(mediaServerItemId, signal) {
    if (typeof ApiClient === 'undefined') return null;
    const url = `${ApiClient.serverAddress()}/api/danmu/${mediaServerItemId}/raw?X-Emby-Token=${ApiClient.accessToken()}`;
    try {
        const response = await fetch(url, { signal });
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
        if (error?.name === 'AbortError') throw error;
        console.error('Failed to parse XML data:', error);
        return null;
    }
}

/**
 * 加载弹幕（主入口）
 * @param {string} loadType - LOAD_TYPE
 * @param {object} [hooks] - { buildCurrentDanmakuInfo }
 */
export async function loadDanmaku(loadType = LOAD_TYPE.CHECK, hooks = {}) {
    const _media = getPlaybackMedia(
        mediaContainerQueryStr,
        mediaQueryStr,
        eleIds.h5VideoAdapter
    );
    if (!_media) {
        console.warn('用户已退出视频播放,停止加载弹幕');
        return false;
    }
    if (
        window.ede?.loading &&
        ![LOAD_TYPE.RELOAD, LOAD_TYPE.REFRESH, LOAD_TYPE.SEARCH].includes(loadType)
    ) {
        console.log('正在重新加载');
        return false;
    }
    const session = beginLoadSession(window.ede);

    const buildCurrentDanmakuInfoFn = hooks.buildCurrentDanmakuInfo || (() => {});
    const appendvideoOsdDanmakuInfoFn = hooks.appendvideoOsdDanmakuInfo || (() => {});
    const createHooks = {
        buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
        appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn,
        session,
    };

    try {
        window.ede.onlineDanmakuOk = false;
        const onlineLoaded = await loadOnlineDanmaku(loadType, hooks, session);
        assertLoadSession(window.ede, session);
        if (onlineLoaded || !lsGetItem(lsKeys.useFetchPluginXml.id)) return onlineLoaded;

        const comments = await getCommentsByPluginApi(window.ede.itemId, session.controller.signal);
        assertLoadSession(window.ede, session);
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
        if (error?.name !== 'AbortError') console.error('[加载]弹幕加载失败:', error);
        return false;
    } finally {
        finishLoadSession(window.ede, session);
    }
}

/**
 * 在线加载弹幕
 * @param {string} loadType
 * @param {object} [hooks] - { buildCurrentDanmakuInfo }
 */
export async function loadOnlineDanmaku(loadType, hooks = {}, session) {
    const buildCurrentDanmakuInfoFn = hooks.buildCurrentDanmakuInfo || (() => {});
    const appendvideoOsdDanmakuInfoFn = hooks.appendvideoOsdDanmakuInfo || (() => {});

    const createHooks = {
        buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
        appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn,
        session,
    };

    try {
        const info = await getEpisodeInfo(
            loadType !== LOAD_TYPE.SEARCH,
            appendvideoOsdDanmakuInfoFn,
            session?.controller.signal,
            session
        );
        if (session) assertLoadSession(window.ede, session);
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
            comments = await fetchComment(episodeId, session?.controller.signal);
            if (session) assertLoadSession(window.ede, session);
            window.ede.danmuCache = window.ede.danmuCache || {};
            window.ede.danmuCache[episodeId] = comments;
        }
        if (!comments?.length) return false;

        const extCommentCache = window.ede?.extCommentCache?.[window.ede.itemId] || {};
        const extEntries = objectEntries(extCommentCache);
        let allComments = comments;
        if (extEntries.length > 0) {
            const aggregated = await aggregateExtComments(
                comments,
                extEntries,
                fetchExtcommentActual,
                session?.controller.signal,
                session
            );
            allComments = aggregated.comments;
            if (aggregated.failedCount > 0) {
                console.warn(`[在线弹幕] ${aggregated.failedCount} 个附加源加载失败`);
            }
        }
        await createDanmaku(allComments, createHooks);
        window.ede.onlineDanmakuOk = true;
        const ctr = getById(eleIds.danmakuCtr);
        if (ctr) ctr.style.opacity = '1';
        return true;
    } catch (error) {
        if (error?.name !== 'AbortError') console.error('[在线弹幕]加载失败:', error);
        if (!session || isLoadSessionCurrent(window.ede, session)) {
            window.ede.onlineDanmakuOk = false;
        }
        return false;
    }
}
