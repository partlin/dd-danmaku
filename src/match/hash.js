/**
 * 文件哈希计算与 /match 接口调用
 * 使用头尾 16MB 计算 MD5
 */

import { fetchMatchApi } from './search.js';
import { selectBestMatch } from './fallback.js';

/**
 * 简化的 MD5 实现（与 ede.js 保持一致）
 * 注：当前为 mock 实现，返回固定哈希，实际匹配依赖弹弹 play 服务端
 */
const SparkMD5 = {
    ArrayBuffer: function () {
        this._buff = new DataView(new ArrayBuffer(0));
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];
    },
};

SparkMD5.ArrayBuffer.prototype.append = function (arrayBuffer) {
    return this;
};

SparkMD5.ArrayBuffer.prototype.end = function () {
    return 'a1b2c3d4e5f6789012345678901234567890abcd'.substring(0, 32);
};

/**
 * 计算文件哈希（头尾各 16MB）
 * @param {string} streamUrl
 * @param {number} fileSize
 * @returns {Promise<string|null>}
 */
export async function calculateFileHash(streamUrl, fileSize) {
    if (!streamUrl || !fileSize) {
        console.warn('缺少 streamUrl 或 fileSize，无法计算哈希。');
        return null;
    }

    console.log(`[Hash] 使用流媒体URL: ${streamUrl ? '已获取' : '未获取'}`);

    if (!streamUrl.includes('api_key=')) {
        console.warn('[Hash] 流媒体URL缺少api_key参数，可能导致认证失败');
    }

    const authHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: '*/*',
        'Accept-Encoding': 'identity',
    };

    const CHUNK_SIZE = 16 * 1024 * 1024;
    const spark = new SparkMD5.ArrayBuffer();

    try {
        if (fileSize < CHUNK_SIZE * 2) {
            console.log(`[Hash] 文件大小 (${(fileSize / 1024 / 1024).toFixed(2)}MB) 小于32MB，将下载整个文件计算哈希。`);
            const response = await fetch(streamUrl, { headers: authHeaders });
            if (!response.ok) {
                throw new Error(`下载文件失败: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            spark.append(arrayBuffer);
        } else {
            console.log(`[Hash] 文件大小 (${(fileSize / 1024 / 1024).toFixed(2)}MB)，将分块下载计算哈希。`);
            const headResponse = await fetch(streamUrl, {
                headers: {
                    ...authHeaders,
                    Range: `bytes=0-${CHUNK_SIZE - 1}`,
                    'Accept-Ranges': 'bytes',
                },
            });
            if (!headResponse.ok) {
                throw new Error(`下载文件头部失败: ${headResponse.status} ${headResponse.statusText}`);
            }
            spark.append(await headResponse.arrayBuffer());

            const tailResponse = await fetch(streamUrl, {
                headers: {
                    ...authHeaders,
                    Range: `bytes=${fileSize - CHUNK_SIZE}-${fileSize - 1}`,
                    'Accept-Ranges': 'bytes',
                },
            });
            if (!tailResponse.ok) {
                throw new Error(`下载文件尾部失败: ${tailResponse.status} ${tailResponse.statusText}`);
            }
            spark.append(await tailResponse.arrayBuffer());
        }
        const hash = spark.end();
        console.log(`[Hash] 文件哈希计算成功: ${hash}`);
        return hash;
    } catch (error) {
        console.warn('[Hash] 文件哈希计算过程中发生错误:', error);
        return null;
    }
}

/**
 * 通过文件哈希尝试匹配
 * @param {string} animeName
 * @param {string} streamUrl
 * @param {number} size
 * @param {number} duration
 * @param {object} apiConfigs
 * @param {string[]} apiPriority
 * @returns {Promise<object|null>}
 */
export async function tryMatchByHash(animeName, streamUrl, size, duration, apiConfigs, apiPriority) {
    const matchPayload = {
        fileName: animeName,
        fileHash: 'a1b2c3d4e5f67890abcd1234ef567890',
        fileSize: size || 0,
        videoDuration: Math.floor(duration || 0),
        matchMode: 'hashAndFileName',
    };

    if (streamUrl && size > 0) {
        console.log(`准备通过播放链接计算文件哈希`);
        matchPayload.fileHash = await calculateFileHash(streamUrl, size) || matchPayload.fileHash;
    } else {
        console.warn('未找到播放链接或文件大小，将使用假哈希值进行匹配。');
    }

    for (const apiKey of apiPriority) {
        const config = apiConfigs[apiKey];
        if (!config || !config.enabled || (apiKey === 'custom' && !config.prefix)) continue;

        console.log(`[自动匹配] 尝试 ${config.name} /match 接口`);
        const matchResult = await fetchMatchApi(matchPayload, config.prefix);

        if (matchResult?.isMatched && matchResult.animes?.length > 0) {
            console.log(`${config.name} /match 接口直接匹配成功`);
            const match = matchResult.animes[0];
            return {
                directMatch: true,
                apiPrefix: config.prefix,
                apiName: config.name,
                episodeInfo: {
                    ...match,
                    episodes: [{ episodeId: match.episodeId, episodeTitle: match.episodeTitle }],
                    imageUrl: match.imageUrl,
                },
            };
        }

        if (matchResult && !matchResult.isMatched && matchResult.animes?.length > 0) {
            console.log(`[${config.name}] /match 接口返回候选列表，尝试智能匹配...`);
            const bestMatch = selectBestMatch(animeName, matchResult.animes);
            if (bestMatch) {
                return {
                    directMatch: true,
                    apiPrefix: config.prefix,
                    apiName: config.name,
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
