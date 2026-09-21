import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const moduleSource = await readFile(
    new URL('../src/match/episode-number.js', import.meta.url),
    'utf8'
);
const episodeNumberModule = await import(
    `data:text/javascript;base64,${Buffer.from(moduleSource).toString('base64')}`
);
const {
    findCompatibleEpisode,
    inspectEpisodeNumber,
    isEpisodeCompatible,
} = episodeNumberModule;

test('第123集不会匹配第12集，反向也不会匹配', () => {
    assert.equal(isEpisodeCompatible(123, { episodeTitle: '第12集' }), false);
    assert.equal(isEpisodeCompatible(12, { episodeTitle: '第123集' }), false);
});

test('episodeId 与标题集号一致时通过', () => {
    const episode = { episodeId: 4560123, episodeTitle: '第 123 話' };
    assert.equal(isEpisodeCompatible(123, episode, 456), true);
});

test('episodeId 与标题集号冲突时拒绝', () => {
    const inspected = inspectEpisodeNumber({ episodeId: 4560123, episodeTitle: '第12集' }, 456);
    assert.equal(inspected.conflict, true);
    assert.equal(isEpisodeCompatible(123, { episodeId: 4560123, episodeTitle: '第12集' }, 456), false);
});

test('无法解析集号时严格拒绝', () => {
    assert.equal(isEpisodeCompatible(3, { episodeTitle: '精彩继续' }), false);
});

test('支持 E/EP/Episode 和数字开头标题', () => {
    assert.equal(isEpisodeCompatible(123, { episodeTitle: 'E123 正片' }), true);
    assert.equal(isEpisodeCompatible(123, { episodeTitle: 'EP 123 - 正片' }), true);
    assert.equal(isEpisodeCompatible(123, { episodeTitle: 'Episode 123：正片' }), true);
    assert.equal(isEpisodeCompatible(123, { episodeTitle: '123 - 正片' }), true);
});

test('特典 episodeId 不会被当作正片集号', () => {
    assert.equal(isEpisodeCompatible(1, { episodeId: 1009001 }, 100), false);
});

test('按真实集号选择，不回退到第一集', () => {
    const episodes = [
        { episodeId: 1000012, episodeTitle: '第12集' },
        { episodeId: 1000123, episodeTitle: '第123集' },
    ];
    assert.equal(findCompatibleEpisode(episodes, 100, 123), episodes[1]);
    assert.equal(findCompatibleEpisode(episodes, 100, 99), null);
});

test('季度偏移后的目标集号可以精确匹配', () => {
    assert.equal(isEpisodeCompatible(13, { episodeId: 1000013 }, 100), true);
});

test('电影允许使用第一条结果', () => {
    const episode = { episodeTitle: '正片' };
    assert.equal(findCompatibleEpisode([episode], 100, 'movie'), episode);
});
