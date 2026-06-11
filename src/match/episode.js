/**
 * 剧集匹配编排
 * searchEpisodes 为主入口，协调 tmdb、hash、search、fallback
 */

import { corsProxy } from '../user-config.js';
import { lsGetItem, lsKeys } from '../config/api.js';
import { fetchSearchEpisodes } from './search.js';
import { tryMatchByTmdbId } from './tmdb.js';
import { tryMatchByHash } from './hash.js';
import { autoFailback } from './fallback.js';

/**
 * 写入赛季信息到 localStorage
 * @param {string} _season_key
 * @param {object} newSeasonInfo
 */
export function writeLsSeasonInfo(_season_key, newSeasonInfo) {
    if (!_season_key) {
        return console.log('_season_key is undefined, skip');
    }
    let seasonInfoListStr = localStorage.getItem(_season_key);
    let seasonInfoList = seasonInfoListStr ? JSON.parse(seasonInfoListStr) : [];
    const existingSeasonInfo = seasonInfoList.find((si) => si.name === newSeasonInfo.name);
    if (!existingSeasonInfo) {
        seasonInfoList.push(newSeasonInfo);
    } else {
        Object.assign(existingSeasonInfo, newSeasonInfo);
    }
    localStorage.setItem(_season_key, JSON.stringify(seasonInfoList));
}

/**
 * 解析 "XXXX SXXEXX" 格式的标题
 * @param {string} animeName
 * @returns {{ title: string, season: number|null, episode: number|null }}
 */
export function parseAnimeName(animeName) {
    const match = animeName.match(/^(.*?)\s*[Ss](\d{1,2})[Ee](\d{1,4})\b/);
    if (match) {
        return {
            title: match[1].replace(/[._]/g, ' ').trim(),
            season: parseInt(match[2], 10),
            episode: parseInt(match[3], 10),
        };
    }
    return { title: animeName, season: null, episode: null };
}

/**
 * 通过赛季缓存匹配
 * @param {string} _season_key
 * @param {number} episode
 * @param {string} prefix
 * @returns {Promise<object|null>}
 */
export async function lsSeasonSearchEpisodes(_season_key, episode, prefix) {
    const seasonInfoListStr = window.localStorage.getItem(_season_key);
    if (!seasonInfoListStr) return null;

    const seasonInfoList = JSON.parse(seasonInfoListStr);
    let minPositiveDiff = Infinity;
    let selectedSeasonInfo = null;

    for (let i = 0; i < seasonInfoList.length; i++) {
        const seasonInfo = seasonInfoList[i];
        const adjustedEpisode = episode + seasonInfo.episodeOffset;
        if (adjustedEpisode > 0 && adjustedEpisode < minPositiveDiff) {
            minPositiveDiff = adjustedEpisode;
            selectedSeasonInfo = seasonInfo;
        }
    }

    if (selectedSeasonInfo) {
        const newEpisode = episode + selectedSeasonInfo.episodeOffset;
        console.log(`命中seasonInfo缓存: ${selectedSeasonInfo.name},偏移量: ${selectedSeasonInfo.episodeOffset},集: ${newEpisode}`);
        const animaInfo = await fetchSearchEpisodes(selectedSeasonInfo.name, newEpisode, prefix);
        return { animaInfo, newEpisode };
    }
    return null;
}

/**
 * 主匹配入口：根据 itemInfoMap 搜索弹幕
 * @param {object} itemInfoMap - 由 getMapByEmbyItemInfo 提供
 * @returns {Promise<object|null>}
 */
export async function searchEpisodes(itemInfoMap) {
    const {
        _season_key,
        animeName,
        episodeName,
        episode,
        seriesOrMovieId,
        streamUrl,
        size,
        duration,
    } = itemInfoMap;

    console.log(`[自动匹配] 标题名: ${episodeName}` + (episode ? `,章节过滤: ${episode}` : ''));

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

    const currentPriority =
        Array.isArray(apiPriority) &&
        apiPriority[0] === 'custom' &&
        apiConfigs.custom.enabled &&
        apiConfigs.custom.prefix?.trim()
            ? 'custom'
            : 'official';
    const selectedApiConfig =
        apiConfigs[currentPriority].enabled && apiConfigs[currentPriority].prefix?.trim()
            ? apiConfigs[currentPriority]
            : apiConfigs.custom;

    const animaRes = await lsSeasonSearchEpisodes(_season_key, episode, selectedApiConfig.prefix);
    if (animaRes?.animaInfo?.animes?.length > 0) {
        console.log(`[自动匹配] 命中赛季缓存，直接使用`);
        return { animeOriginalTitle: '', animaInfo: animaRes.animaInfo };
    }

    const tmdbMatchResult = await tryMatchByTmdbId(itemInfoMap, apiConfigs, apiPriority);
    if (tmdbMatchResult) return tmdbMatchResult;

    const hashMatchResult = await tryMatchByHash(episodeName, streamUrl, size, duration, apiConfigs, apiPriority);
    if (hashMatchResult) return hashMatchResult;

    for (const apiKey of apiPriority) {
        const config = apiConfigs[apiKey];
        if (!config || !config.enabled || (apiKey === 'custom' && !config.prefix)) continue;

        let searchTitle = episodeName;
        let searchEpisode = episode;

        if (apiKey === 'official') {
            const parsed = parseAnimeName(episodeName);
            if (parsed.season !== null) {
                searchTitle = parsed.season === 1 ? parsed.title : `${parsed.title} 第${parsed.season}季`;
                searchEpisode = parsed.episode;
                console.log(`[自动匹配][官方API优化] 格式化搜索: 标题='${searchTitle}', 集数=${searchEpisode}`);
            }
        }

        let searchAnimaInfo = await fetchSearchEpisodes(searchTitle, searchEpisode, config.prefix);
        if (searchAnimaInfo?.animes?.length > 0) {
            return { animaInfo: searchAnimaInfo, apiPrefix: config.prefix };
        }

        searchAnimaInfo = await fetchSearchEpisodes(episodeName, null, config.prefix);
        if (searchAnimaInfo?.animes?.length > 0) {
            return { animaInfo: searchAnimaInfo, apiPrefix: config.prefix };
        }
    }

    const animaInfo = await fetchSearchEpisodes(animeName, episode, selectedApiConfig.prefix);
    if (animaInfo?.animes?.length > 0) {
        return { animeOriginalTitle: '', animaInfo };
    }

    return autoFailback(animeName, episode, seriesOrMovieId, selectedApiConfig.prefix);
}
