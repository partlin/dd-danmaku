/**
 * 季度匹配与季度缓存辅助函数
 */

import { normalizeTitle, parseSearchKeyword } from './similarity.js';

export function isSpecialAnimeType(candidateType) {
    const normalizedType = String(candidateType || '').toLowerCase();
    return normalizedType === 'ova' || normalizedType === 'tvspecial';
}

/**
 * 返回季度兼容分数；负数表示明确冲突。
 */
export function getSeasonMatchScore(searchTitle, candidateTitle, candidateType) {
    const parsedSearch = parseSearchKeyword(String(searchTitle || ''));
    if (parsedSearch.season === null) return 0;

    const parsedCandidate = parseSearchKeyword(String(candidateTitle || ''));
    if (parsedCandidate.season !== null) {
        return parsedCandidate.season === parsedSearch.season ? 2 : -2;
    }

    if (parsedSearch.season === 0) {
        if (!candidateType) {
            return normalizeTitle(parsedCandidate.title) === normalizeTitle(parsedSearch.title) ? -1 : 1;
        }
        return isSpecialAnimeType(candidateType) ? 3 : -2;
    }

    // 未标注季度且与基础标题完全相同的条目通常为第一季。
    if (
        parsedSearch.season > 1 &&
        normalizeTitle(parsedCandidate.title) === normalizeTitle(parsedSearch.title)
    ) {
        return -1;
    }

    return 1;
}

export function isSeasonCompatible(searchTitle, candidateTitle, candidateType) {
    return getSeasonMatchScore(searchTitle, candidateTitle, candidateType) >= 0;
}

export function prioritizeSeasonCandidates(searchTitle, candidates) {
    if (!Array.isArray(candidates) || candidates.length < 2) return candidates;
    const parsedSearch = parseSearchKeyword(String(searchTitle || ''));
    if (parsedSearch.season === null) return candidates;

    return candidates
        .map((candidate, index) => ({
            candidate,
            index,
            seasonScore: getSeasonMatchScore(searchTitle, candidate.animeTitle, candidate.type),
        }))
        .sort((a, b) => b.seasonScore - a.seasonScore || a.index - b.index)
        .map(({ candidate }) => candidate);
}

export function getSeasonEpisodeOffset(seasonInfo) {
    const episodeOffset = Number(seasonInfo?.episodeOffset);
    if (!Number.isFinite(episodeOffset)) return NaN;
    // 旧缓存按 0-based 下标计算，所有偏移少了 1。
    return seasonInfo.episodeOffsetVersion === 2 ? episodeOffset : episodeOffset + 1;
}

export function selectSeasonInfo(searchTitle, seasonInfoList, episode) {
    if (!Array.isArray(seasonInfoList)) return null;
    return seasonInfoList
        .map((seasonInfo, index) => ({
            seasonInfo,
            index,
            adjustedEpisode: Number(episode) + getSeasonEpisodeOffset(seasonInfo),
            seasonScore: getSeasonMatchScore(searchTitle, seasonInfo.name, seasonInfo.animeType),
        }))
        .filter((item) => item.adjustedEpisode > 0 && item.seasonScore >= 0)
        .sort(
            (a, b) =>
                b.seasonScore - a.seasonScore ||
                Number(b.seasonInfo.updatedAt || 0) - Number(a.seasonInfo.updatedAt || 0) ||
                a.adjustedEpisode - b.adjustedEpisode ||
                a.index - b.index
        )[0]?.seasonInfo || null;
}

export function createSeasonInfo(anime, selectedEpisodeIndex, embyEpisode) {
    return {
        name: anime.animeTitle,
        episodeOffset: Number(selectedEpisodeIndex) + 1 - Number(embyEpisode),
        episodeOffsetVersion: 2,
        animeId: anime.animeId,
        animeType: anime.type,
        apiPrefix: anime.apiPrefix,
        apiName: anime.apiName,
        updatedAt: Date.now(),
    };
}
