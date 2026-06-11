/**
 * 平台检测
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { objectEntries } from './helpers.js';

function safeApiClient() {
    try {
        return (typeof window !== 'undefined' && window.ApiClient) || null;
    } catch {
        return null;
    }
}

const OS = {
    isAndroid: () => /android/i.test(navigator.userAgent),
    isIOS: () => /iPad|iPhone|iPod/i.test(navigator.userAgent),
    isMacOS: () => /Macintosh|MacIntel/i.test(navigator.userAgent),
    isApple: () => OS.isMacOS() || OS.isIOS(),
    isWindows: () => /compatible|Windows/i.test(navigator.userAgent),
    isMobile: () => OS.isAndroid() || OS.isIOS(),
    isUbuntu: () => /Ubuntu/i.test(navigator.userAgent),
    isAndroidEmbyNoisyX: () => {
        const api = safeApiClient();
        return api && OS.isAndroid() && api.appVersion?.().includes('-');
    },
    isEmbyNoisyX: () => {
        const api = safeApiClient();
        return api && api.appVersion?.().includes('-');
    },
    isEmbyTheater: () => {
        const api = safeApiClient();
        return api && api.appName?.() === 'Emby Theater';
    },
    isEmbyUWP: () => {
        const api = safeApiClient();
        return api && api.appName?.() === 'Emby Windows';
    },
    isOthers: () =>
        objectEntries(OS)
            .filter(([key]) => key !== 'isOthers')
            .every(([, val]) => !val()),
};

export { OS };
