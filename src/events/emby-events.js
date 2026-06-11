/**
 * Emby 事件绑定工具
 */

import { objectEntries } from '../utils/helpers.js';

export function refreshEventListener(eventsMap) {
    objectEntries(eventsMap).forEach(([eventName, fn]) => {
        document.removeEventListener(eventName, fn);
        document.addEventListener(eventName, fn);
    });
}

/**
 * 绑定播放器事件（playbackManager）
 * @param {object} eventsMap - { eventName: fn }
 */
export async function playbackEventsRefresh(eventsMap) {
    if (typeof require !== 'function') return;
    try {
        const [playbackManager, events] = await require(['playbackManager', 'events']);
        const player = playbackManager?.getCurrentPlayer?.();
        if (!player) return;
        objectEntries(eventsMap).forEach(([eventName, fn]) => {
            events.off?.(player, eventName, fn);
            events.on?.(player, eventName, fn);
        });
    } catch (e) {
        console.warn('playbackEventsRefresh:', e);
    }
}
