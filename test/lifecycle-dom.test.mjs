import test from 'node:test';
import assert from 'node:assert/strict';
import {
    beginLoadSession,
    clearPlaybackBindings,
    isLoadSessionCurrent,
    startViewSession,
    syncPlaybackItemSession,
} from '../src/core/lifecycle.js';
import { waitForElement } from '../src/utils/dom.js';

test('新播放会话会中止旧请求并使旧结果失效', () => {
    const ede = { viewGeneration: 0, loadGeneration: 0, itemId: '', loading: false };
    startViewSession(ede, 'episode-a');
    const first = beginLoadSession(ede);
    assert.equal(isLoadSessionCurrent(ede, first), true);
    startViewSession(ede, 'episode-b');
    assert.equal(first.controller.signal.aborted, true);
    assert.equal(isLoadSessionCurrent(ede, first), false);
});

test('waitForElement 立即命中且取消后会正常结束', async (t) => {
    const previousDocument = globalThis.document;
    const element = { id: 'ready' };
    globalThis.document = { querySelector: (selector) => selector === '#ready' ? element : null };
    t.after(() => { globalThis.document = previousDocument; });
    assert.equal(await waitForElement('#ready'), element);

    const registry = [];
    const pending = waitForElement('#missing', null, 0, 5, registry);
    assert.equal(registry.length, 1);
    pending.cancel();
    assert.equal(await pending, null);
    assert.equal(registry.length, 0);
});

test('播放器事件清理使用原始处理器引用并清空注册表', () => {
    const calls = [];
    const events = { off: (...args) => calls.push(args) };
    const player = { id: 'player' };
    const fn = () => {};
    const ede = {
        playbackBindings: new Map([
            ['timeupdate', { events, player, eventName: 'timeupdate', fn }],
        ]),
    };

    clearPlaybackBindings(ede);

    assert.deepEqual(calls, [[player, 'timeupdate', fn]]);
    assert.equal(ede.playbackBindings.size, 0);
});

test('同一 OSD 内切集会启动新视频会话', () => {
    const ede = { viewGeneration: 1, loadGeneration: 1, itemId: 'episode-a', loading: false };
    const oldLoad = beginLoadSession(ede);

    assert.equal(
        syncPlaybackItemSession(ede, { NowPlayingItem: { Id: 'episode-b' } }),
        true
    );
    assert.equal(ede.itemId, 'episode-b');
    assert.equal(ede.viewGeneration, 2);
    assert.equal(oldLoad.controller.signal.aborted, true);
    assert.equal(isLoadSessionCurrent(ede, oldLoad), false);
    assert.equal(
        syncPlaybackItemSession(ede, { NowPlayingItem: { Id: 'episode-b' } }),
        false
    );
});
