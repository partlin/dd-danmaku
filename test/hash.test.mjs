import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { calculateFileHash, tryMatchByHash } from '../src/match/hash.js';

test('小文件计算真实 MD5', async (t) => {
    const originalFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = originalFetch; });
    const body = new TextEncoder().encode('hello');
    globalThis.fetch = async () => new Response(body, { status: 200 });
    assert.equal(await calculateFileHash('https://media.test/file', body.length), '5d41402abc4b2a76b9719d911017c592');
});

test('大文件只拼接头尾分块并要求 206', async (t) => {
    const originalFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = originalFetch; });
    const head = new Uint8Array([1, 2, 3]);
    const tail = new Uint8Array([4, 5, 6]);
    const ranges = [];
    globalThis.fetch = async (_url, options) => {
        ranges.push(options.headers.Range);
        return new Response(ranges.length === 1 ? head : tail, { status: 206 });
    };
    const expected = createHash('md5').update(head).update(tail).digest('hex');
    assert.equal(await calculateFileHash('https://media.test/file?api_key=x', 40 * 1024 * 1024), expected);
    assert.equal(ranges.length, 2);

    globalThis.fetch = async () => new Response(head, { status: 200 });
    assert.equal(await calculateFileHash('https://media.test/file?api_key=x', 40 * 1024 * 1024), null);
});

test('缺少流地址或大小时不发送假哈希请求', async (t) => {
    const originalFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = originalFetch; });
    let calls = 0;
    globalThis.fetch = async () => { calls += 1; throw new Error('unexpected'); };
    const result = await tryMatchByHash('title', 1, null, 0, 60, {}, []);
    assert.equal(result, null);
    assert.equal(calls, 0);
});

test('哈希响应无有效数据时返回 null', async (t) => {
    const originalFetch = globalThis.fetch;
    t.after(() => { globalThis.fetch = originalFetch; });
    globalThis.fetch = async () => new Response(new Uint8Array(), { status: 200 });
    assert.equal(await calculateFileHash('https://media.test/empty', 5), null);
});
