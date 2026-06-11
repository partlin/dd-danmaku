/**
 * 网络请求工具
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

/**
 * 封装 fetch，支持 JSON 请求
 * @param {string} url
 * @param {object} [opts] - { token, headers, body, method }
 * @returns {Promise<object>}
 */
export async function fetchJson(url, opts = {}) {
    const { token, headers, body } = opts;
    let { method = 'GET' } = opts;
    if (method === 'GET' && body) {
        method = 'POST';
    }
    const requestHeaders = {
        'Accept-Encoding': 'gzip',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': navigator.userAgent,
    };
    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }
    if (headers) {
        Object.assign(requestHeaders, headers);
    }
    const requestBody = body ? JSON.stringify(body) : null;
    const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseText = await response.text();
    if (responseText.length > 0) {
        try {
            return JSON.parse(responseText);
        } catch (parseError) {
            console.warn('responseText not is JSON:', parseError);
        }
    }
    return { success: true };
}
