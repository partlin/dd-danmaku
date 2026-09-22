import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateExtComments, dedupeComments } from '../src/danmaku/aggregate.js';

test('附加源乱序完成后只生成稳定聚合结果', async () => {
    const base = [{ cid: 1, p: '0,1,1,u', m: 'base' }];
    const entries = [['slow', null], ['failed', null], ['fast', null]];
    const fetcher = async (url) => {
        if (url === 'failed') throw new Error('offline');
        if (url === 'slow') await new Promise((resolve) => setTimeout(resolve, 15));
        return url === 'slow'
            ? [{ cid: 2, p: '1,1,1,u', m: 'slow' }]
            : [{ cid: 1, p: '0,1,1,u', m: 'duplicate' }, { cid: 3, p: '2,1,1,u', m: 'fast' }];
    };
    const result = await aggregateExtComments(base, entries, fetcher);
    assert.equal(result.failedCount, 1);
    assert.deepEqual(result.comments.map((comment) => comment.cid), [1, 2, 3]);
});

test('无 cid 时按参数和内容稳定去重', () => {
    const a = { p: '1,1,1,u', m: 'same' };
    assert.equal(dedupeComments([[a], [{ ...a }]]).length, 1);
});
