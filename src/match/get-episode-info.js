/**
 * 根据当前播放项获取剧集弹幕匹配信息
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { lsGetItem, lsKeys, dandanplayApi } from '../config/api.js';
import { lsLocalKeys } from '../config/ls-local-keys.js';
import { getMapByEmbyItemInfo } from './emby-item.js';
import { searchEpisodes } from './episode.js';
import { fetchComment } from './search.js';
import { isSeasonCompatible } from './season.js';

/**
 * @param {boolean} [is_auto=true]
 * @param {function} [appendvideoOsdDanmakuInfo] - 匹配失败时回调
 * @returns {Promise<object|null>}
 */
export async function getEpisodeInfo(is_auto = true, appendvideoOsdDanmakuInfo) {
    const itemInfoMap = await getMapByEmbyItemInfo();
    if (!itemInfoMap) return null;

    const { _episode_key, animeId, episode, seriesOrMovieId, animeName } = itemInfoMap;

    // 手动匹配拥有最高优先级，不受自动缓存、季度校验或上下集推理覆盖。
    try {
        const manualKeys = [];
        if (_episode_key) manualKeys.push(`_ede_manual_match_${_episode_key}`);
        if (window.ede?.itemId) manualKeys.push(`_ede_manual_match_${window.ede.itemId}`);
        for (const manualKey of manualKeys) {
            try {
                const manualValue = window.localStorage.getItem(manualKey);
                if (!manualValue) continue;
                const manualInfo = JSON.parse(manualValue);
                if (manualInfo?.episodeId) {
                    console.log('[手动匹配] 命中持久化手动选择:', manualInfo.animeTitle, '-', manualInfo.episodeTitle);
                    return manualInfo;
                }
            } catch (error) {
                console.warn(`[手动匹配] 记录损坏，忽略 ${manualKey}:`, error);
            }
        }
    } catch (error) {
        console.warn('[手动匹配] 读取持久化记录失败:', error);
    }

    const useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
    const useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
    const apiPriority = lsGetItem(lsKeys.apiPriority.id) || ['official', 'custom'];
    const enabledApis = apiPriority.filter((apiKey) => {
        if (apiKey === 'official') return useOfficialApi;
        if (apiKey === 'custom') return useCustomApi;
        return false;
    });
    const unique_episode_key = lsLocalKeys.apiPrefix + `${enabledApis.join('_')}_` + _episode_key;

    if (is_auto && window.localStorage.getItem(unique_episode_key)) {
        try {
            const cachedEpisodeInfo = JSON.parse(window.localStorage.getItem(unique_episode_key));
            const cachedEpisodeNumber =
                (Number.isFinite(Number(cachedEpisodeInfo.episodeIndex))
                    ? Number(cachedEpisodeInfo.episodeIndex)
                    : -1) + 1;
            const seasonCompatible = isSeasonCompatible(
                animeName,
                cachedEpisodeInfo.animeTitle,
                cachedEpisodeInfo.animeType
            );
            const episodeCompatible = !Number.isFinite(Number(episode)) || cachedEpisodeNumber === Number(episode);
            if (seasonCompatible && episodeCompatible) return cachedEpisodeInfo;
            console.warn(
                `[自动匹配] 缓存与当前季度或集数不符，清除重搜: 缓存第${cachedEpisodeNumber}话, 当前第${episode}话`
            );
            window.localStorage.removeItem(unique_episode_key);
        } catch (error) {
            console.warn('[自动匹配] 本地匹配缓存损坏，清除重搜:', error);
            window.localStorage.removeItem(unique_episode_key);
        }
    }

    const previous_info = window.ede?.previous_episode_info;
    if (
        is_auto &&
        previous_info?.episodeId &&
        previous_info.seriesOrMovieId === seriesOrMovieId &&
        isSeasonCompatible(animeName, previous_info.animeTitle, previous_info.animeType)
    ) {
        const previousEpisodeIndex = previous_info.episodeIndex;
        const currentEpisodeNumber = episode;
        const previousEpisodeId = parseInt(previous_info.episodeId, 10);
        let predictedEpisodeId = null;

        if (currentEpisodeNumber === previousEpisodeIndex + 2) {
            predictedEpisodeId = previousEpisodeId + 1;
        } else if (currentEpisodeNumber === previousEpisodeIndex) {
            predictedEpisodeId = previousEpisodeId - 1;
        }

        if (predictedEpisodeId) {
            const comments = await fetchComment(predictedEpisodeId);
            if (comments?.length > 0) {
                return {
                    ...itemInfoMap,
                    episodeId: predictedEpisodeId,
                    episodeTitle: `第 ${currentEpisodeNumber} 集 (推理)`,
                    animeId: previous_info.animeId,
                    animeTitle: previous_info.animeTitle,
                    animeType: previous_info.animeType,
                    imageUrl: previous_info.imageUrl,
                    seriesOrMovieId,
                    episodeIndex: currentEpisodeNumber - 1,
                };
            }
        }
    }

    const res = await searchEpisodes(itemInfoMap);

    if (!lsGetItem(lsKeys.useOfficialApi.id) && !lsGetItem(lsKeys.useCustomApi.id)) {
        return null;
    }
    if (!res) {
        if (typeof appendvideoOsdDanmakuInfo === 'function') appendvideoOsdDanmakuInfo();
        return null;
    }

    const episodeIndex = isNaN(episode) ? 0 : episode - 1;

    if (res.directMatch && res.episodeInfo) {
        const ep = res.episodeInfo.episodes?.[0] || res.episodeInfo;
        const episodeInfo = {
            episodeId: ep.episodeId,
            episodeTitle: ep.episodeTitle,
            episodeIndex,
            animeId: res.episodeInfo.animeId,
            animeTitle: res.episodeInfo.animeTitle,
            animeType: res.episodeInfo.animeType || res.episodeInfo.type,
            animeOriginalTitle: '',
            imageUrl: res.episodeInfo.imageUrl,
            apiName: res.apiName,
            apiPrefix: res.apiPrefix,
            seriesOrMovieId,
        };
        window.localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
        return episodeInfo;
    }

    if (!res.animaInfo?.animes?.length) {
        if (typeof appendvideoOsdDanmakuInfo === 'function') appendvideoOsdDanmakuInfo();
        return null;
    }

    const { animeOriginalTitle = '', animaInfo } = res;
    let selectAnime_id = animaInfo.animes.findIndex((candidate) =>
        isSeasonCompatible(animeName, candidate.animeTitle, candidate.type)
    );
    if (selectAnime_id < 0) {
        console.warn('[自动匹配] 搜索结果均与当前季度冲突，放弃自动匹配');
        if (typeof appendvideoOsdDanmakuInfo === 'function') appendvideoOsdDanmakuInfo();
        return null;
    }
    if (animeId != -1) {
        const idx = animaInfo.animes.findIndex(
            (a) => a.animeId == animeId && isSeasonCompatible(animeName, a.animeTitle, a.type)
        );
        if (idx >= 0) selectAnime_id = idx;
    }
    const anime = animaInfo.animes[selectAnime_id];
    const eps = anime?.episodes || [];
    const ep = eps[episodeIndex] || eps[0];
    if (!ep) return null;

    const episodeInfo = {
        episodeId: ep.episodeId,
        episodeTitle: ep.episodeTitle,
        episodeIndex,
        animeId: anime.animeId,
        animeTitle: anime.animeTitle,
        animeType: anime.type,
        animeOriginalTitle,
        imageUrl: anime.imageUrl || (anime.animeId ? dandanplayApi.posterImg(anime.animeId) : undefined),
        apiPrefix: res.apiPrefix,
        seriesOrMovieId,
    };
    window.localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
    return episodeInfo;
}
