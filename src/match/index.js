/**
 * match 模块统一导出
 */

export { fetchSearchEpisodes, fetchSearchEpisodesByTmdbId, fetchMatchApi, fetchComment, fetchExtcommentActual } from './search.js';
export {
    calculateStringSimilarity,
    similarityPercentage,
    normalizeTitle,
    parseSearchKeyword,
    extractKeywords,
} from './similarity.js';
export {
    autoFailback,
    oriTitleAutoFailback,
    movieAutoFailback,
    selectBestMatch,
    calculateMatchScore,
} from './fallback.js';
export { calculateFileHash, tryMatchByHash } from './hash.js';
export { filterMainEpisodes, tryMatchByTmdbId } from './tmdb.js';
export { parseAnimeName, lsSeasonSearchEpisodes, searchEpisodes, writeLsSeasonInfo } from './episode.js';
export { getEpisodeInfo } from './get-episode-info.js';
export { getMapByEmbyItemInfo } from './emby-item.js';
