/**
 * 文件哈希计算与 /match 接口调用
 * 使用头尾 16MB 计算 MD5
 */

import { fetchMatchApi } from './search.js';
import { selectBestMatch } from './fallback.js';
import { isSeasonCompatible, prioritizeSeasonCandidates } from './season.js';
import { isEpisodeCompatible } from './episode-number.js';
import SparkMD5 from 'spark-md5/spark-md5.min.js';

/**
 * 计算文件哈希（头尾各 16MB）
 * @param {string} streamUrl
 * @param {number} fileSize
 * @returns {Promise<string|null>}
 */
export async function calculateFileHash(streamUrl, fileSize, signal) {
    if (!streamUrl || !fileSize) {
        console.warn('缺少 streamUrl 或 fileSize，无法计算哈希。');
        return null;
    }

    console.log(`[Hash] 使用流媒体URL: ${streamUrl ? '已获取' : '未获取'}`);

    if (!streamUrl.includes('api_key=')) {
        console.warn('[Hash] 流媒体URL缺少api_key参数，可能导致认证失败');
    }

    const authHeaders = {
        Accept: '*/*',
    };

    const CHUNK_SIZE = 16 * 1024 * 1024;
    const spark = new SparkMD5.ArrayBuffer();

    try {
        if (fileSize < CHUNK_SIZE * 2) {
            console.log(`[Hash] 文件大小 (${(fileSize / 1024 / 1024).toFixed(2)}MB) 小于32MB，将下载整个文件计算哈希。`);
            const response = await fetch(streamUrl, { headers: authHeaders, signal });
            if (!response.ok) {
                throw new Error(`下载文件失败: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength === 0) throw new Error('下载的文件内容为空');
            spark.append(arrayBuffer);
        } else {
            console.log(`[Hash] 文件大小 (${(fileSize / 1024 / 1024).toFixed(2)}MB)，将分块下载计算哈希。`);
            const headResponse = await fetch(streamUrl, {
                headers: {
                    ...authHeaders,
                    Range: `bytes=0-${CHUNK_SIZE - 1}`,
                    'Accept-Ranges': 'bytes',
                },
                signal,
            });
            if (headResponse.status !== 206) {
                throw new Error(`下载文件头部失败: ${headResponse.status} ${headResponse.statusText}`);
            }
            const headBuffer = await headResponse.arrayBuffer();
            if (headBuffer.byteLength === 0) throw new Error('下载的文件头部为空');
            spark.append(headBuffer);

            const tailResponse = await fetch(streamUrl, {
                headers: {
                    ...authHeaders,
                    Range: `bytes=${fileSize - CHUNK_SIZE}-${fileSize - 1}`,
                    'Accept-Ranges': 'bytes',
                },
                signal,
            });
            if (tailResponse.status !== 206) {
                throw new Error(`下载文件尾部失败: ${tailResponse.status} ${tailResponse.statusText}`);
            }
            const tailBuffer = await tailResponse.arrayBuffer();
            if (tailBuffer.byteLength === 0) throw new Error('下载的文件尾部为空');
            spark.append(tailBuffer);
        }
        const hash = spark.end();
        console.log(`[Hash] 文件哈希计算成功: ${hash}`);
        return hash;
    } catch (error) {
        if (error?.name !== 'AbortError') {
            console.warn('[Hash] 文件哈希计算过程中发生错误:', error);
        }
        return null;
    }
}

/**
 * 通过文件哈希尝试匹配
 * @param {string} animeName
 * @param {number|string} expectedEpisodeNumber
 * @param {string} streamUrl
 * @param {number} size
 * @param {number} duration
 * @param {object} apiConfigs
 * @param {string[]} apiPriority
 * @returns {Promise<object|null>}
 */
export async function tryMatchByHash(
    animeName,
    expectedEpisodeNumber,
    streamUrl,
    size,
    duration,
    apiConfigs,
    apiPriority,
    signal
) {
    if (!streamUrl || !(size > 0)) {
        console.warn('未找到播放链接或文件大小，跳过哈希匹配。');
        return null;
    }
    const fileHash = await calculateFileHash(streamUrl, size, signal);
    if (!fileHash || signal?.aborted) {
        console.warn('没有有效文件哈希，跳过哈希匹配。');
        return null;
    }
    const matchPayload = {
        fileName: animeName,
        fileHash,
        fileSize: size || 0,
        videoDuration: Math.floor(duration || 0),
        matchMode: 'hashAndFileName',
    };

    for (const apiKey of apiPriority) {
        const config = apiConfigs[apiKey];
        if (!config || !config.enabled || (apiKey === 'custom' && !config.prefix)) continue;

        console.log(`[自动匹配] 尝试 ${config.name} /match 接口`);
        const matchResult = await fetchMatchApi(matchPayload, config.prefix, signal);

        if (matchResult?.isMatched && matchResult.animes?.length > 0) {
            const candidates = prioritizeSeasonCandidates(animeName, matchResult.animes);
            const match = candidates.find(
                (candidate) =>
                    isSeasonCompatible(animeName, candidate.animeTitle, candidate.type) &&
                    isEpisodeCompatible(expectedEpisodeNumber, candidate, candidate.animeId)
            );
            if (!match) {
                console.warn(`${config.name} /match 接口命中结果与当前季度或集数冲突，放弃直接匹配`);
                continue;
            }
            console.log(`${config.name} /match 接口直接匹配成功`);
            return {
                directMatch: true,
                apiPrefix: config.prefix,
                apiName: config.name,
                expectedEpisodeNumber,
                episodeInfo: {
                    ...match,
                    episodes: [{ episodeId: match.episodeId, episodeTitle: match.episodeTitle }],
                    imageUrl: match.imageUrl,
                },
            };
        }

        if (matchResult && !matchResult.isMatched && matchResult.animes?.length > 0) {
            console.log(`[${config.name}] /match 接口返回候选列表，尝试智能匹配...`);
            const bestMatch = selectBestMatch(animeName, matchResult.animes, expectedEpisodeNumber);
            if (bestMatch) {
                return {
                    directMatch: true,
                    apiPrefix: config.prefix,
                    apiName: config.name,
                    expectedEpisodeNumber,
                    episodeInfo: {
                        ...bestMatch,
                        episodes: [{ episodeId: bestMatch.episodeId, episodeTitle: bestMatch.episodeTitle }],
                        imageUrl: bestMatch.imageUrl,
                    },
                };
            }
        }
    }
    return null;
}
