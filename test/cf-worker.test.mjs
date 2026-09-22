import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';

async function loadWorker(fetchImpl = globalThis.fetch) {
    const source = await readFile(new URL('../cf_worker.js', import.meta.url), 'utf8');
    const context = {
        APP_ID: 'test-id', APP_SECRET: 'test-secret',
        URL, Response, Request, TextEncoder, crypto: webcrypto, btoa,
        console, fetch: fetchImpl, addEventListener: () => {},
    };
    vm.createContext(context);
    vm.runInContext(`${source}\n;globalThis.__handleRequest = handleRequest;`, context);
    return context.__handleRequest;
}

test('Worker 处理预检、非法目标、白名单和方法限制', async () => {
    const handle = await loadWorker();
    assert.equal((await handle(new Request('https://worker.test/cors/x', { method: 'OPTIONS' }))).status, 204);
    assert.equal((await handle(new Request('https://worker.test/not-cors'))).status, 400);
    assert.equal((await handle(new Request('https://worker.test/cors/https://example.com/api'))).status, 403);
    assert.equal((await handle(new Request('https://worker.test/cors/https://api.dandanplay.net/api', { method: 'PATCH' }))).status, 405);
});

test('Worker 上游异常返回带 CORS 的 502', async () => {
    const handle = await loadWorker(async () => { throw new Error('offline'); });
    const response = await handle(new Request('https://worker.test/cors/https://api.dandanplay.net/api/v2/test'));
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('access-control-allow-origin'), '*');
});
