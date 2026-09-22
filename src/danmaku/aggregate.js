function getCommentKey(comment) {
    if (comment?.cid !== undefined && comment?.cid !== null && comment.cid !== '') {
        return `cid:${comment.cid}`;
    }
    return `content:${comment?.p || ''}\u0000${comment?.m || ''}`;
}

export function dedupeComments(commentGroups) {
    const seen = new Set();
    const result = [];
    commentGroups.forEach((comments) => {
        (comments || []).forEach((comment) => {
            if (!comment) return;
            const key = getCommentKey(comment);
            if (seen.has(key)) return;
            seen.add(key);
            result.push(comment);
        });
    });
    return result;
}

/**
 * 并行获取附加弹幕，但只在全部请求结束后聚合一次。
 */
export async function aggregateExtComments(baseComments, entries, fetcher, signal, session) {
    const settled = await Promise.all(
        entries.map(([url, cached]) =>
            Promise.resolve()
                .then(async () => {
                    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
                    const comments = Array.isArray(cached)
                        ? cached
                        : await fetcher(url, baseComments, signal, session);
                    return { status: 'fulfilled', value: Array.isArray(comments) ? comments : [] };
                })
                .catch((reason) => ({ status: 'rejected', reason }))
        )
    );
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const successful = settled
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);
    const failedCount = settled.length - successful.length;
    return {
        comments: dedupeComments([baseComments || [], ...successful]),
        failedCount,
    };
}
