export function cancelActiveLoad(ede) {
    if (!ede) return;
    ede.activeLoadSession?.controller?.abort();
    ede.activeLoadSession = null;
    ede.loading = false;
}

function createAbortController() {
    if (typeof AbortController === 'function') return new AbortController();
    return {
        signal: undefined,
        aborted: false,
        abort() { this.aborted = true; },
    };
}

export function startViewSession(ede, itemId = '') {
    if (!ede) return;
    cancelActiveLoad(ede);
    ede.viewGeneration = (ede.viewGeneration || 0) + 1;
    ede.itemId = itemId || '';
}

export function syncPlaybackItemSession(ede, state) {
    const itemId = state?.NowPlayingItem?.Id || state?.NowPlayingItem?.ItemId;
    if (!ede || !itemId || ede.itemId === itemId) return false;
    startViewSession(ede, itemId);
    return true;
}

export function beginLoadSession(ede) {
    cancelActiveLoad(ede);
    const session = {
        viewGeneration: ede.viewGeneration,
        loadGeneration: (ede.loadGeneration || 0) + 1,
        itemId: ede.itemId,
        controller: createAbortController(),
    };
    ede.loadGeneration = session.loadGeneration;
    ede.activeLoadSession = session;
    ede.loading = true;
    return session;
}

export function isLoadSessionCurrent(ede, session) {
    if (!session) return true;
    return Boolean(
        ede &&
        ede.activeLoadSession === session &&
        !session.controller.aborted &&
        !session.controller.signal?.aborted &&
        ede.viewGeneration === session.viewGeneration &&
        ede.itemId === session.itemId
    );
}

export function assertLoadSession(ede, session) {
    if (!isLoadSessionCurrent(ede, session)) {
        throw new DOMException('Stale playback load', 'AbortError');
    }
}

export function finishLoadSession(ede, session) {
    if (ede?.activeLoadSession !== session) return;
    ede.activeLoadSession = null;
    ede.loading = false;
}

export function clearPlaybackBindings(ede) {
    if (!ede?.playbackBindings) return;
    ede.playbackBindings.forEach(({ events, player, eventName, fn }) => {
        events?.off?.(player, eventName, fn);
    });
    ede.playbackBindings.clear();
}
