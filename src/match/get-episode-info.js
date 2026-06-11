/**
 * 根据当前播放项获取剧集弹幕匹配信息
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { lsGetItem, lsKeys, dandanplayApi } from '../config/api.js';
import { lsLocalKeys } from '../config/ls-local-keys.js';
import { getMapByEmbyItemInfo } from './emby-item.js';
import { searchEpisodes } from './episode.js';
import { fetchComment } from './search.js';

/**
 * @param {boolean} [is_auto=true]
 * @param {function} [appendvideoOsdDanmakuInfo] - 匹配失败时回调
 * @returns {Promise<object|null>}
 */
export async function getEpisodeInfo(is_auto = true, appendvideoOsdDanmakuInfo) {
    const itemInfoMap = await getMapByEmbyItemInfo();
    if (!itemInfoMap) return null;

    const { _episode_key, animeId, episode, seriesOrMovieId } = itemInfoMap;

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
        return JSON.parse(window.localStorage.getItem(unique_episode_key));
    }

    const previous_info = window.ede?.previous_episode_info;
    if (
        is_auto &&
        previous_info?.episodeId &&
        previous_info.seriesOrMovieId === seriesOrMovieId
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
    let selectAnime_id = 0;
    if (animeId != -1) {
        const idx = animaInfo.animes.findIndex((a) => a.animeId == animeId);
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
        animeOriginalTitle,
        imageUrl: anime.imageUrl || (anime.animeId ? dandanplayApi.posterImg(anime.animeId) : undefined),
        apiPrefix: res.apiPrefix,
        seriesOrMovieId,
    };
    window.localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
    return episodeInfo;
}
