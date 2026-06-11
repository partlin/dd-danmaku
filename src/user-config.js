/**
 * 用户可配置项
 * 从 ede.js 迁移，未修改原有实现逻辑
 * note01: 部分 AndroidTV 仅支持最高 ES9 (支持 webview 内核版本 60 以上)
 * note02: url 禁止使用相对路径,非 web 环境的根路径为文件路径,非 http
 */

export let requireDanmakuPath = 'https://danmaku.7o7o.cc/danmaku.min.js';
export let corsProxy = 'https://ddplay-api.7o7o.cc/cors/';

export function setRequireDanmakuPath(v) {
    requireDanmakuPath = v;
}
export function setCorsProxy(v) {
    corsProxy = v;
}
