/**
 * 自动匹配回退与智能选择
 * 依赖: ApiClient (全局)
 */

import { fetchSearchEpisodes } from './search.js';
import {
    calculateStringSimilarity,
    normalizeTitle,
    parseSearchKeyword,
    extractKeywords,
} from './similarity.js';

/**
 * @param {string} animeName
 * @param {number} episodeIndex
 * @param {string} seriesOrMovieId
 * @param {string} prefix - API prefix
 * @returns {Promise<object|null>}
 */
export async function autoFailback(animeName, episodeIndex, seriesOrMovieId, prefix) {
    const rvt = await movieAutoFailback(animeName, episodeIndex, prefix);
    if (rvt) return rvt;

    const seriesOrMovieInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId);
    const animeOriginalTitle = seriesOrMovieInfo?.OriginalTitle;
    return oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle, prefix);
}

/**
 * @param {string} animeName
 * @param {number} episodeIndex
 * @param {string} animeOriginalTitle
 * @param {string} prefix
 * @returns {Promise<object|null>}
 */
export async function oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle, prefix) {
    if (!animeOriginalTitle || !prefix) return null;
    console.log(`标题名: ${animeName},自动匹配未查询到结果,将使用原标题名,重试一次`);
    const animaInfo = await fetchSearchEpisodes(animeOriginalTitle, episodeIndex, prefix);
    if (!animaInfo?.animes?.length) return null;
    console.log(`使用原标题名: ${animeOriginalTitle},自动匹配成功`);
    return { animeName, animaInfo, animeOriginalTitle };
}

/**
 * @param {string} animeName
 * @param {number} episodeIndex
 * @param {string} prefix
 * @returns {Promise<object|null>}
 */
export async function movieAutoFailback(animeName, episodeIndex, prefix) {
    if (!prefix) return null;
    console.log(`自动匹配未查询到结果,可能为非番剧,将移除章节过滤,重试一次`);
    const animaInfo = await fetchSearchEpisodes(animeName, null, prefix);
    if (!animaInfo?.animes?.length) return null;
    console.log(`移除章节过滤,自动匹配成功,转换为目标章节索引 0`);
    const epIdx = isNaN(episodeIndex) ? 0 : episodeIndex;
    const episodeInfo = animaInfo.animes[0].episodes[epIdx];
    if (!episodeInfo) return null;
    animaInfo.animes[0].episodes = [episodeInfo];
    return { animeName, animaInfo };
}

/**
 * 智能匹配：从候选列表中选择最佳匹配
 * @param {string} searchTitle
 * @param {object[]} candidates
 * @param {string} prefix - API prefix for fetchSearchEpisodes
 * @returns {object|null}
 */
export function selectBestMatch(searchTitle, candidates, prefix) {
    if (!candidates?.length) return null;

    console.log(`[智能匹配] 搜索标题: "${searchTitle}", 候选数量: ${candidates.length}`);
    const parsedSearch = parseSearchKeyword(searchTitle);
    console.log(`[智能匹配] 解析搜索标题: ${JSON.stringify(parsedSearch)}`);

    const scoredCandidates = candidates.map((candidate) => {
        const score = calculateMatchScore(parsedSearch.title, candidate);

        if (parsedSearch.season && candidate.animeTitle) {
            const candidateParsed = parseSearchKeyword(candidate.animeTitle);
            if (candidateParsed.season === parsedSearch.season) {
                score.total += 0.15;
                console.log(`[智能匹配] 季度匹配加分: ${candidate.animeTitle}`);
            }
        }

        if (parsedSearch.episode) {
            let episodeMatched = false;
            if (candidate.episodeId) {
                const episodeFromId = parseInt(candidate.episodeId.toString().slice(-3), 10);
                if (episodeFromId === parsedSearch.episode) {
                    score.total += 0.25;
                    episodeMatched = true;
                    console.log(`[智能匹配] episodeId集数匹配加分: ${candidate.animeTitle} (${episodeFromId})`);
                }
            }
            if (!episodeMatched && candidate.episodeTitle) {
                const episodeMatch = candidate.episodeTitle.match(/第?(\d+)[话集]/);
                if (episodeMatch && parseInt(episodeMatch[1], 10) === parsedSearch.episode) {
                    score.total += 0.2;
                    console.log(`[智能匹配] episodeTitle集数匹配加分: ${candidate.animeTitle} - ${candidate.episodeTitle}`);
                }
            }
        }

        console.log(`[智能匹配] "${candidate.animeTitle}" (${candidate.typeDescription || ''}) - 得分: ${score.total.toFixed(2)}`);
        return { ...candidate, score: score.total, scoreDetails: score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);
    const bestMatch = scoredCandidates[0];
    if (bestMatch?.score > 0.15) {
        console.log(`[智能匹配] 选择最佳匹配: "${bestMatch.animeTitle}" (得分: ${bestMatch.score.toFixed(2)})`);
        return bestMatch;
    }
    console.log(`[智能匹配] 没有找到足够好的匹配 (最高得分: ${bestMatch?.score?.toFixed(2) || 0})`);
    return null;
}

/**
 * 计算匹配得分
 * @param {string} searchTitle
 * @param {object} candidate
 * @returns {{ titleSimilarity: number, typeBonus: number, keywordMatch: number, exactMatch: number, total: number }}
 */
export function calculateMatchScore(searchTitle, candidate) {
    const score = {
        titleSimilarity: 0,
        typeBonus: 0,
        keywordMatch: 0,
        exactMatch: 0,
        total: 0,
    };

    const normalizedSearch = normalizeTitle(searchTitle);
    const normalizedCandidate = normalizeTitle(candidate.animeTitle || '');
    if (normalizedSearch === normalizedCandidate) {
        score.exactMatch = 0.4;
    } else if (normalizedCandidate.includes(normalizedSearch) || normalizedSearch.includes(normalizedCandidate)) {
        score.exactMatch = 0.3;
    }

    score.titleSimilarity = calculateStringSimilarity(searchTitle, candidate.animeTitle || '') * 0.5;

    if (candidate.type === 'tvseries') score.typeBonus = 0.1;
    else if (candidate.type === 'tvspecial') score.typeBonus = 0.08;
    else if (candidate.type === 'web') score.typeBonus = 0.06;
    else if (candidate.type === 'ova') score.typeBonus = 0.04;
    else if (candidate.type === 'movie') score.typeBonus = 0.02;

    const searchKeywords = extractKeywords(searchTitle);
    const candidateKeywords = extractKeywords(candidate.animeTitle || '');
    const keywordMatches = searchKeywords.filter((keyword) =>
        candidateKeywords.some((ck) => ck.includes(keyword) || keyword.includes(ck))
    ).length;
    score.keywordMatch = (keywordMatches / Math.max(searchKeywords.length, 1)) * 0.1;

    score.total = score.exactMatch + score.titleSimilarity + score.typeBonus + score.keywordMatch;
    return score;
}
