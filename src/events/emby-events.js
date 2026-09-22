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
    const ede = window.ede;
    const viewGeneration = ede?.viewGeneration;
    try {
        const [playbackManager, events] = await require(['playbackManager', 'events']);
        if (!ede || window.ede !== ede || ede.viewGeneration !== viewGeneration) return;
        const player = playbackManager?.getCurrentPlayer?.();
        if (!player) return;
        if (!ede.playbackBindings) ede.playbackBindings = new Map();
        objectEntries(eventsMap).forEach(([eventName, fn]) => {
            const previous = ede.playbackBindings.get(eventName);
            if (previous) {
                previous.events?.off?.(previous.player, eventName, previous.fn);
            }
            events.on?.(player, eventName, fn);
            ede.playbackBindings.set(eventName, { events, player, eventName, fn });
        });
    } catch (e) {
        console.warn('playbackEventsRefresh:', e);
    }
}
