// from workers settings
const appId = APP_ID;
const appSecret = APP_SECRET;

const hostlist = { 'api.dandanplay.net': null };
const allowedMethods = new Set(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, User-Agent',
};

function errorResponse(message, status) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (!allowedMethods.has(request.method)) {
        return errorResponse(`Method ${request.method} not allowed`, 405);
    }

    let tUrlObj;
    try {
        const urlObj = new URL(request.url);
        const marker = urlObj.origin + '/cors/';
        if (!urlObj.href.startsWith(marker)) return errorResponse('Missing /cors/ target URL', 400);
        let targetUrl = urlObj.href.slice(marker.length).trim();
        if (!targetUrl.startsWith('https://') && targetUrl.startsWith('https:')) {
            targetUrl = targetUrl.replace('https:/', 'https://');
        } else if (!targetUrl.startsWith('http://') && targetUrl.startsWith('http:')) {
            targetUrl = targetUrl.replace('http:/', 'http://');
        }
        tUrlObj = new URL(targetUrl);
        if (tUrlObj.protocol !== 'https:') return errorResponse('Only HTTPS targets are allowed', 400);
    } catch (error) {
        return errorResponse('Invalid target URL', 400);
    }
    if (!(tUrlObj.hostname in hostlist)) {
        return Forbidden(tUrlObj);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const apiPath = tUrlObj.pathname;
    const signature = await generateSignature(appId, timestamp, apiPath, appSecret);
    console.log('ApiPath: ' + apiPath);

    // 构建请求头，确保所有原始头部都被正确传递
    const headers = {};
    const skippedHeaders = new Set([
        'host',
        'content-length',
        'connection',
        'transfer-encoding',
        'cf-connecting-ip',
        'cf-ipcountry',
        'cf-ray',
        'cf-visitor',
    ]);
    for (const [key, value] of request.headers.entries()) {
        if (!skippedHeaders.has(key.toLowerCase())) headers[key] = value;
    }
    headers["X-AppId"] = appId;
    headers["X-Signature"] = signature;
    headers["X-Timestamp"] = timestamp.toString();
    headers["X-Auth"] = "1";

    try {
        let response = await fetch(tUrlObj.href, {
            headers,
            body: ['GET'].includes(request.method) ? undefined : request.body,
            method: request.method,
        });
        response = new Response(response.body, response);
        Object.entries(corsHeaders).forEach(([key, value]) => response.headers.set(key, value));
        return response;
    } catch (error) {
        console.error('Upstream request failed:', error?.message || error);
        return errorResponse('Upstream request failed', 502);
    }
}

/**
 * 
 * @param {String} appId 
 * @param {Number} timestamp 使用当前的 UTC 时间生成 Unix 时间戳，单位为秒
 * @param {String} path 此处的 API 路径是指 API 地址后的路径部分，以/开头，不包括前面的协议、域名和?后面的查询参数
 * @param {String} appSecret 
 * @returns signature String
 */
async function generateSignature(appId, timestamp, path, appSecret) {
    const data = appId + timestamp + path + appSecret;
    const dataUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(hashArray.map(byte => String.fromCharCode(byte)).join(''));
    return hashBase64;
}

function Forbidden(url) {
    return errorResponse(`Hostname ${url.hostname} not allowed.`, 403);
}

addEventListener('fetch', (event) => {
    return event.respondWith(handleRequest(event.request));
});
