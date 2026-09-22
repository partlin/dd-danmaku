import test from 'node:test';
import assert from 'node:assert/strict';

function createStorage(initial = {}) {
    const values = new Map(Object.entries(initial));
    return {
        getItem: (key) => values.has(key) ? values.get(key) : null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
        key: (index) => [...values.keys()][index] || null,
        get length() { return values.size; },
    };
}

function installGlobal(t, name, value) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
    t.after(() => {
        if (descriptor) Object.defineProperty(globalThis, name, descriptor);
        else delete globalThis[name];
    });
}

test('连续 emoji 弹幕都被过滤，非法关键词按纯文本处理', async (t) => {
    installGlobal(t, 'localStorage', createStorage({
        danmakuTypeFilter: JSON.stringify(['emoji']),
        danmakuFilterKeywordsEnable: 'true',
        danmakuFilterKeywords: '[',
    }));
    const { danmakuTypeFilter, danmakuKeywordsFilter } = await import('../src/danmaku/filter.js');
    assert.deepEqual(danmakuTypeFilter([{ text: '😀' }, { text: '😁' }, { text: 'plain' }]), [{ text: 'plain' }]);
    assert.deepEqual(danmakuKeywordsFilter([{ text: 'a[b' }, { text: 'safe' }]), [{ text: 'safe' }]);
});

test('损坏设置回退默认值并清除对应键', async (t) => {
    const storage = createStorage({ danmakuApiPriority: '{bad json' });
    installGlobal(t, 'localStorage', storage);
    const { lsGetItem, lsKeys } = await import('../src/config/api.js');
    assert.deepEqual(lsGetItem(lsKeys.apiPriority.id), ['official', 'custom']);
    assert.equal(storage.getItem(lsKeys.apiPriority.id), null);
});

test('弹幕解析跳过损坏记录而不终止整批加载', async (t) => {
    installGlobal(t, 'localStorage', createStorage());
    installGlobal(t, 'window', { screen: { width: 1920, height: 1080 } });
    installGlobal(t, 'document', { querySelector: () => null });
    const { danmakuParser } = await import('../src/danmaku/parser.js');
    const parsed = danmakuParser([
        null,
        { p: 'bad', m: 'broken' },
        { p: '1,1,16777215,user', m: 'ok', cid: 1 },
    ]);
    assert.equal(parsed.length, 1);
    assert.equal(parsed[0].text, 'ok');
});
