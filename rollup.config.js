import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildTarget = process.env.BUILD;

const USERSCRIPT_BANNER = `// ==UserScript==
// @name         Emby danmaku extension - Emby style
// @description  Emby弹幕插件 - Emby风格
// @namespace    https://github.com/chen3861229/dd-danmaku
// @author       chen3861229
// @version      1.47
// @copyright    2022, RyoLee (https://github.com/RyoLee)
// @license      MIT; https://raw.githubusercontent.com/RyoLee/emby-danmaku/master/LICENSE
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @grant        none
// @match        *://*/web/index.html
// @match        *://*/web/
// ==/UserScript==

`;

const danmakuInline = readFileSync(
    join(__dirname, 'src/vendor/danmaku-inline.js'),
    'utf8'
).trim();

function danmakuBootstrap() {
    return {
        name: 'danmaku-bootstrap',
        renderChunk(code, chunk, options) {
            const bootstrap = `
(function(){
var skipInnerModule=false;
try{throw new Error()}catch(e){skipInnerModule=!!(e.stack&&e.stack.includes('CustomCssJS'));}
if(!skipInnerModule){
${danmakuInline}
}else if(typeof Emby!=='undefined'&&Emby.importModule){
var p=localStorage.getItem('danmakuCustomeDanmakuUrl')||'https://danmaku.7o7o.cc/danmaku.min.js';
Emby.importModule(p).then(function(f){window.Danmaku=f;}).catch(function(e){console.error('Danmaku load error:',e);});
}
})();
`;
            return { code: bootstrap + code, map: null };
        },
    };
}

function userscriptBanner() {
    return {
        name: 'userscript-banner',
        generateBundle(options, bundle) {
            for (const [fileName, chunk] of Object.entries(bundle)) {
                if (chunk.type === 'chunk' && (fileName.endsWith('.user.js') || fileName.endsWith('.user.min.js'))) {
                    chunk.code = USERSCRIPT_BANNER + chunk.code;
                }
            }
        },
    };
}

const basePlugins = [
    resolve(),
    commonjs(),
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
    }),
    danmakuBootstrap(),
];

const userScriptPlugins = [...basePlugins, userscriptBanner()];

const minPlugins = [
    resolve(),
    commonjs(),
    babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
    }),
    terser(),
    danmakuBootstrap(),
];

const android9Config = {
    input: 'src/index.js',
    output: {
        file: 'dist/ede.android9.js',
        format: 'iife',
        sourcemap: false,
    },
    plugins: basePlugins,
};

const android7Config = {
    input: 'src/index.js',
    output: {
        file: 'dist/ede.android7.js',
        format: 'iife',
        sourcemap: false,
    },
    plugins: basePlugins,
};

const defaultConfigs = [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/ede.js',
            format: 'iife',
            sourcemap: true,
        },
        plugins: basePlugins,
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/ede.min.js',
            format: 'iife',
            sourcemap: true,
        },
        plugins: minPlugins,
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/ede.user.js',
            format: 'iife',
            sourcemap: false,
        },
        plugins: userScriptPlugins,
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/ede.user.min.js',
            format: 'iife',
            sourcemap: false,
        },
        plugins: [...minPlugins, userscriptBanner()],
    },
];

export default buildTarget === 'android9'
    ? [android9Config]
    : buildTarget === 'android7'
      ? [android7Config]
      : defaultConfigs;
