/**
 * 相似度计算与标题解析
 * 用于智能匹配与弹幕相似合并
 */

/**
 * 计算字符串相似度 (简化版编辑距离)
 * @param {string} str1
 * @param {string} str2
 * @returns {number} 0-1
 */
export function calculateStringSimilarity(str1, str2) {
    const s1 = str1.toLowerCase().replace(/[：:]/g, '');
    const s2 = str2.toLowerCase().replace(/[：:]/g, '');

    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    const matrix = [];
    for (let i = 0; i <= s1.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= s2.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    const maxLength = Math.max(s1.length, s2.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[s1.length][s2.length]) / maxLength;
}

/**
 * 计算两个字符串之间的 Levenshtein 相似度百分比 (0-100)
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function similarityPercentage(a, b) {
    if (a === b) return 100;

    if (a.length > b.length) {
        [a, b] = [b, a];
    }

    let previousRow = Array.from({ length: a.length + 1 }, (_, i) => i);
    let currentRow = Array(a.length + 1);

    for (let j = 1; j <= b.length; j++) {
        currentRow[0] = j;
        for (let i = 1; i <= a.length; i++) {
            const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
            currentRow[i] = Math.min(
                previousRow[i - 1] + substitutionCost,
                previousRow[i] + 1,
                currentRow[i - 1] + 1
            );
        }
        [previousRow, currentRow] = [currentRow, previousRow];
    }

    const distance = previousRow[a.length];
    const maxLength = Math.max(a.length, b.length);
    return ((maxLength - distance) / maxLength) * 100;
}

/**
 * 标题标准化
 * @param {string} title
 * @returns {string}
 */
export function normalizeTitle(title) {
    return title
        .toLowerCase()
        .replace(/[：:]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\u4e00-\u9fff]/g, '')
        .trim();
}

/**
 * 解析搜索关键词，提取标题、季数和集数
 * @param {string} keyword
 * @returns {{ title: string, season: number|null, episode: number|null }}
 */
export function parseSearchKeyword(keyword) {
    keyword = keyword.trim();

    const sePattern = /^(.+?)\s*S(\d{1,2})E(\d{1,4})$/i;
    const seMatch = sePattern.exec(keyword);
    if (seMatch) {
        return {
            title: seMatch[1].trim(),
            season: parseInt(seMatch[2], 10),
            episode: parseInt(seMatch[3], 10),
        };
    }

    const seasonPatterns = [
        { pattern: /^(.*?)\s*(?:S|Season)\s*(\d{1,2})$/i, handler: (m) => parseInt(m[2], 10) },
        {
            pattern: /^(.*?)\s*第\s*([一二三四五六七八九十\d]+)\s*[季部]$/i,
            handler: (m) => {
                const seasonMap = {
                    一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
                };
                return seasonMap[m[2]] || parseInt(m[2], 10);
            },
        },
        {
            pattern: /^(.*?)\s*([Ⅰ-Ⅻ])$/,
            handler: (m) => {
                const romanMap = {
                    Ⅰ: 1, Ⅱ: 2, Ⅲ: 3, Ⅳ: 4, Ⅴ: 5, Ⅵ: 6, Ⅶ: 7, Ⅷ: 8, Ⅸ: 9, Ⅹ: 10, Ⅺ: 11, Ⅻ: 12,
                };
                return romanMap[m[2].toUpperCase()];
            },
        },
        { pattern: /^(.*?)\s+(\d{1,2})$/, handler: (m) => parseInt(m[2], 10) },
    ];

    for (const { pattern, handler } of seasonPatterns) {
        const match = pattern.exec(keyword);
        if (match) {
            try {
                const title = match[1].trim();
                const season = handler(match);
                if (season && !(title.length > 4 && /\d{4}$/.test(title))) {
                    return { title, season, episode: null };
                }
            } catch (e) {
                continue;
            }
        }
    }

    return { title: keyword, season: null, episode: null };
}

/**
 * 提取关键词
 * @param {string} title
 * @returns {string[]}
 */
export function extractKeywords(title) {
    const stopWords = [
        '第', '季', '部', '篇', '章', '话', '集', '期',
        'season', 'episode', 'ep', 'ova', 'tv', 'movie',
        'special', 'the', 'of', 'and', 'in', 'to', 'a', 'an',
    ];

    return title
        .toLowerCase()
        .replace(/[：:]/g, ' ')
        .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
        .split(/[\s\u3000]+/)
        .filter((word) => word.length > 1)
        .filter((word) => !stopWords.includes(word))
        .filter((word) => !/^\d+$/.test(word))
        .map((word) => word.trim());
}
