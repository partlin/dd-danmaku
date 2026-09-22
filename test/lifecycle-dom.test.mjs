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
import {
    cleanupViewUI,
    getActiveViewRoot,
    initUI,
    isViewRootActive,
    isViewUiSessionCurrent,
} from '../src/ui/init.js';
import { syncPlaybackViewSession } from '../src/events/playback.js';

function fakeElement() {
    return {
        children: [],
        attributes: new Map(),
        classList: { contains: () => false, add() {} },
        style: {},
        isConnected: true,
        setAttribute(name, value) { this.attributes.set(name, String(value)); },
        getAttribute(name) { return this.attributes.get(name) ?? null; },
        addEventListener() {},
        append(child) { this.children.push(child); child.parentNode = this; },
        appendChild(child) { this.append(child); return child; },
        insertBefore(child) { this.append(child); },
        remove() { this.removed = true; },
        querySelector() { return null; },
        querySelectorAll() { return []; },
        contains(child) { return child === this || this.children.includes(child); },
    };
}

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

test('playbackstart 修正实际单集 ID 后会重新启动 UI 挂载', () => {
    const previousWindow = globalThis.window;
    const ede = { viewGeneration: 1, itemId: 'series-id', loading: false };
    let refreshCount = 0;
    globalThis.window = { ede };

    try {
        assert.equal(
            syncPlaybackViewSession(
                { NowPlayingItem: { Id: 'episode-id' } },
                () => { refreshCount += 1; }
            ),
            true
        );
        assert.equal(ede.viewGeneration, 2);
        assert.equal(ede.itemId, 'episode-id');
        assert.equal(refreshCount, 1);

        assert.equal(
            syncPlaybackViewSession(
                { NowPlayingItem: { Id: 'episode-id' } },
                () => { refreshCount += 1; }
            ),
            false
        );
        assert.equal(refreshCount, 1);
    } finally {
        globalThis.window = previousWindow;
    }
});

test('隐藏旧 OSD 已有按钮时仍会在当前 OSD 挂载且保持幂等', async (t) => {
    const previousDocument = globalThis.document;
    const previousWindow = globalThis.window;
    const previousApiClient = globalThis.ApiClient;
    const oldControls = fakeElement();
    const activeRoot = fakeElement();
    const mainControls = fakeElement();
    const buttonArea = fakeElement();
    activeRoot.contains = (element) => element === mainControls;
    activeRoot.querySelector = (selector) => {
        if (selector === '.videoOsdBottom-maincontrols') return mainControls;
        if (selector === '#danmakuCtr') {
            return buttonArea.children.find((child) => child.id === 'danmakuCtr') || null;
        }
        return null;
    };
    mainControls.querySelector = (selector) => selector === '.videoOsdBottom-buttons:not(.hide)'
        ? buttonArea
        : null;

    const documentMock = {
        querySelector(selector) {
            if (selector === '#danmakuCtr') return oldControls;
            if (selector === '.graphicContentContainer:not(.hide)') return activeRoot;
            if (selector === '.graphicContentContainer:not(.hide) .videoOsdBottom-maincontrols') {
                return mainControls;
            }
            return null;
        },
        querySelectorAll(selector) {
            return selector === '.graphicContentContainer:not(.hide)' ? [activeRoot] : [];
        },
        createElement() { return fakeElement(); },
    };
    const ede = {
        viewGeneration: 2,
        episode_info: null,
        destroyIntervalIds: [],
        uiWaitHandles: new Map(),
        viewRoots: new Map(),
        currentViewRoot: null,
    };
    globalThis.document = documentMock;
    globalThis.window = { ede };
    globalThis.ApiClient = undefined;
    t.after(() => {
        globalThis.document = previousDocument;
        globalThis.window = previousWindow;
        globalThis.ApiClient = previousApiClient;
    });

    assert.equal(getActiveViewRoot(), activeRoot);
    initUI();
    await Promise.resolve();
    const controls = activeRoot.querySelector('#danmakuCtr');
    assert.ok(controls);
    assert.equal(controls.children.length, 2);

    initUI();
    await Promise.resolve();
    assert.equal(buttonArea.children.filter((child) => child.id === 'danmakuCtr').length, 1);
});

test('page-hidden 旧 OSD 不会被识别为活动播放页', () => {
    const hiddenRoot = fakeElement();
    hiddenRoot.classList = {
        contains: (name) => name === 'page-hidden',
        add() {},
    };
    const activeRoot = fakeElement();

    assert.equal(isViewRootActive(hiddenRoot), false);
    assert.equal(isViewRootActive(activeRoot), true);
});

test('过期 UI 会话不可操作新 OSD，旧页清理不误删新按钮', () => {
    const oldControl = fakeElement();
    oldControl.setAttribute('data-ede-view-generation', '1');
    const newControl = fakeElement();
    newControl.setAttribute('data-ede-view-generation', '2');
    const oldRoot = fakeElement();
    const newRoot = fakeElement();
    oldRoot.querySelectorAll = () => [oldControl];
    newRoot.querySelectorAll = () => [newControl];
    const ede = {
        viewGeneration: 2,
        currentViewRoot: newRoot,
        uiWaitHandles: new Map(),
        viewRoots: new Map([[1, oldRoot], [2, newRoot]]),
    };

    assert.equal(isViewUiSessionCurrent(ede, 1, oldRoot), false);
    assert.equal(isViewUiSessionCurrent(ede, 2, newRoot), true);
    cleanupViewUI(ede, 1);
    assert.equal(oldControl.removed, true);
    assert.equal(newControl.removed, undefined);
    assert.equal(ede.currentViewRoot, newRoot);
});
