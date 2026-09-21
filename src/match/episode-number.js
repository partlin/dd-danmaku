/**
 * 自动匹配集号解析与严格校验。
 * episodeId 规则：episodeId = animeId * 10000 + 集号；9000 以上为特典。
 */

function toPositiveInteger(value) {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 ? number : null;
}

function extractEpisodeNumberFromTitle(title) {
    const value = String(title || '');
    const patterns = [
        /第\s*(\d+)\s*[话話集]/i,
        /(?:^|\b)E(?:P(?:ISODE)?)?\s*0*(\d+)(?=\D|$)/i,
        /^\s*0*(\d+)(?=\s*(?:[-－:：.]|$))/,
    ];
    for (const pattern of patterns) {
        const match = pattern.exec(value);
        if (match) return toPositiveInteger(match[1]);
    }
    return null;
}

/**
 * 汇总可用的集号来源。多个来源冲突时返回 invalid，避免近似结果被接受。
 */
export function inspectEpisodeNumber(episode, animeId) {
    const sources = {};
    const explicitNumber = toPositiveInteger(episode?.episodeNumber);
    if (explicitNumber) sources.episodeNumber = explicitNumber;

    const numericEpisodeId = Number(episode?.episodeId);
    const numericAnimeId = Number(animeId ?? episode?.animeId);
    if (Number.isFinite(numericEpisodeId) && Number.isFinite(numericAnimeId)) {
        const offset = numericEpisodeId - numericAnimeId * 10000;
        if (Number.isInteger(offset) && offset > 0 && offset < 9000) {
            sources.episodeId = offset;
        }
    }

    const titleNumber = extractEpisodeNumberFromTitle(episode?.episodeTitle);
    if (titleNumber) sources.episodeTitle = titleNumber;

    const numbers = [...new Set(Object.values(sources))];
    return {
        number: numbers.length === 1 ? numbers[0] : null,
        valid: numbers.length === 1,
        conflict: numbers.length > 1,
        sources,
    };
}

export function getEpisodeNumber(episode, animeId) {
    return inspectEpisodeNumber(episode, animeId).number;
}

export function isEpisodeCompatible(expectedEpisodeNumber, episode, animeId) {
    if (expectedEpisodeNumber === 'movie') return true;
    const expected = toPositiveInteger(expectedEpisodeNumber);
    if (!expected) return false;
    const inspected = inspectEpisodeNumber(episode, animeId);
    return inspected.valid && inspected.number === expected;
}

export function findCompatibleEpisode(episodes, animeId, expectedEpisodeNumber) {
    if (!Array.isArray(episodes) || episodes.length === 0) return null;
    if (expectedEpisodeNumber === 'movie') return episodes[0] || null;
    return episodes.find((episode) =>
        isEpisodeCompatible(expectedEpisodeNumber, episode, animeId)
    ) || null;
}
