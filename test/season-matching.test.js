'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '..', 'ede.js'), 'utf8');
const start = source.indexOf('    // 标题标准化函数');
const end = source.indexOf('    // 计算字符串相似度', start);
assert.ok(start >= 0 && end > start, 'season matching helpers must remain in ede.js');

const helpers = new Function(`${source.slice(start, end)}; return {
    parseSearchKeyword,
    getSeasonMatchScore,
    isSeasonCompatible,
    prioritizeSeasonCandidates,
};`)();

test('parses season and episode from Emby episode names', () => {
    assert.deepEqual(helpers.parseSearchKeyword('间谍过家家 S03E01'), {
        title: '间谍过家家',
        season: 3,
        episode: 1,
    });
});

test('rejects a first-season cache for a later-season episode', () => {
    assert.equal(helpers.isSeasonCompatible('Bang Dream S02E01', 'Bang Dream'), false);
    assert.equal(helpers.isSeasonCompatible('Bang Dream S02E01', 'Bang Dream 2'), true);
    assert.equal(helpers.isSeasonCompatible('Bang Dream S02E01', 'Bang Dream S01'), false);
});

test('prioritizes the requested season while preserving API order for ties', () => {
    const candidates = [{ animeTitle: 'Bang Dream' }, { animeTitle: 'Bang Dream 3' }, { animeTitle: 'Bang Dream 2' }];
    const ordered = helpers.prioritizeSeasonCandidates('Bang Dream S02E01', candidates);
    assert.deepEqual(
        ordered.map(({ animeTitle }) => animeTitle),
        ['Bang Dream 2', 'Bang Dream', 'Bang Dream 3'],
    );
});

test('does not reorder searches without explicit season information', () => {
    const candidates = [{ animeTitle: 'A' }, { animeTitle: 'B' }];
    assert.strictEqual(helpers.prioritizeSeasonCandidates('Bang Dream', candidates), candidates);
});
