/**
 * Emby 媒体项信息获取
 * 从 ede.js 迁移，未修改原有实现逻辑
 * 依赖运行时 ApiClient、require 等 Emby 全局
 */

import { lsLocalKeys } from '../config/ls-local-keys.js';

async function getEmbyItemInfo() {
    if (typeof require === 'function') {
        return require(['playbackManager']).then((items) => items[0].currentItem());
    }
    return null;
}

async function fatchEmbyItemInfo(id) {
    if (!id || typeof ApiClient === 'undefined') return null;
    return ApiClient.getItem(ApiClient.getCurrentUserId(), id);
}

/**
 * 根据当前播放项获取匹配信息映射
 * @returns {Promise<object|null>}
 */
export async function getMapByEmbyItemInfo() {
    let item = await getEmbyItemInfo();
    if (!item && window.ede?.itemId) {
        item = await fatchEmbyItemInfo(window.ede.itemId);
    }
    if (!item) return null;

    const getProviderId = (providerIds, key) => {
        if (!providerIds || typeof providerIds !== 'object') return null;
        const k = Object.keys(providerIds).find((kk) => kk.toLowerCase() === key.toLowerCase());
        return k ? providerIds[k] : null;
    };

    let seriesTmdbId = null;
    if (item.Type === 'Episode' && item.SeriesId) {
        try {
            const seriesInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), item.SeriesId);
            seriesTmdbId = getProviderId(seriesInfo?.ProviderIds, 'Tmdb');
        } catch (e) {
            console.warn('[tmdbId] 获取剧集 tmdbId 失败:', e);
        }
    } else if (item.Type === 'Movie') {
        seriesTmdbId = getProviderId(item.ProviderIds, 'Tmdb');
    }

    if (!['Episode', 'Movie'].includes(item.Type)) {
        console.error('不支持的类型');
        return null;
    }

    window.ede.itemId = item.Id;
    let _id;
    let animeName;
    let episodeName;
    let animeId = -1;
    let episode;
    const seriesName = item.SeriesName;
    const seasonNumber = item.ParentIndexNumber;
    const episodeNumber = item.IndexNumber;

    if (item.Type === 'Episode') {
        _id = item.SeasonId;
        episode = episodeNumber;
        if (seasonNumber !== undefined && episodeNumber !== undefined) {
            episodeName = `${seriesName} S${String(seasonNumber).padStart(2, '0')}E${String(episodeNumber).padStart(2, '0')}`;
        } else {
            episodeName = seriesName + (seasonNumber && seasonNumber !== 1 ? ` ${seasonNumber}` : '');
        }
        animeName = seriesName;
        if (seasonNumber != 1) {
            animeName += ' ' + seasonNumber;
        }
    } else {
        _id = item.Id;
        animeName = item.Name;
        episode = 'movie';
    }

    let _id_key = lsLocalKeys.animePrefix + _id;
    let _season_key = lsLocalKeys.animeSeasonPrefix + _id;
    let _episode_key = lsLocalKeys.animeEpisodePrefix + _id + '_' + episode;
    if (window.localStorage.getItem(_id_key)) {
        animeId = window.localStorage.getItem(_id_key);
    }

    if (!item.MediaSources || item.MediaSources.length === 0) {
        try {
            const fullItem = await fatchEmbyItemInfo(item.Id);
            if (fullItem && fullItem.MediaSources && fullItem.MediaSources.length > 0) {
                item = fullItem;
            }
        } catch (error) {
            console.error('[Stream] 获取item信息失败:', error);
        }
    }

    const mediaSource = item.MediaSources && item.MediaSources[0];
    let streamUrl = null;
    if (mediaSource && typeof ApiClient !== 'undefined') {
        const itemId = item.Id;
        const mediaSourceId = mediaSource.Id;
        const deviceId = ApiClient.deviceId();
        const apiKey = ApiClient.accessToken();
        const serverAddress = ApiClient.serverAddress();
        const isEmby = serverAddress.includes('/emby/') || (ApiClient.appName && ApiClient.appName().toLowerCase().includes('emby'));
        const extraStr = isEmby ? '/emby' : '';
        const container = item.Path ? item.Path.split('.').pop() : 'mkv';
        streamUrl = `${serverAddress}${extraStr}/videos/${itemId}/stream?DeviceId=${deviceId}&MediaSourceId=${mediaSourceId}&api_key=${apiKey}&Static=true&Container=${container}`;
    }

    return {
        _id,
        _id_key,
        _season_key,
        _episode_key,
        animeId,
        episode,
        animeName,
        seriesOrMovieId: item.SeriesId || item.Id,
        seriesTmdbId,
        streamUrl,
        size: mediaSource?.Size,
        duration: (mediaSource?.RunTimeTicks || 0) / 10000000,
        episodeName,
        seriesName,
        seasonNumber,
        episodeNumber,
    };
}
