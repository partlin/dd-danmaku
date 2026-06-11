/**
 * 弹幕高能进度条
 */

import { lsGetItem, lsKeys } from '../config/api.js';
import { getById, getByClass } from '../utils/dom.js';
import { eleIds } from '../config/ele-ids.js';
import { classes } from '../config/icons.js';
import { OS } from '../utils/platform.js';

/**
 * 在进度条上绘制弹幕密度折线图
 * @param {number} chartHeightNum
 */
export function buildProgressBarChart(chartHeightNum) {
    const chartEle = getById(eleIds.progressBarLineChart);
    if (chartEle) chartEle.remove();
    if (!window.ede?.danmaku) return;

    const osdLineChartSkipFilter = lsGetItem(lsKeys.osdLineChartSkipFilter.id);
    const comments = osdLineChartSkipFilter ? window.ede.commentsParsed : window.ede.danmaku.comments;
    const container = getByClass(classes.videoOsdPositionSliderContainer);

    if (!comments?.length || !container) return;

    const progressBarWidth = container.offsetWidth;
    const timeStep = lsGetItem(lsKeys.osdLineChartTime.id);
    const maxTime = Math.max(...comments.map((c) => c.time));
    const timeCounts = Array.from({ length: Math.ceil(maxTime / timeStep) }, () => 0);
    comments.forEach((c) => {
        const index = Math.floor(c.time / timeStep);
        if (index < timeCounts.length) timeCounts[index]++;
    });

    const bulletChartCanvas = document.createElement('canvas');
    bulletChartCanvas.id = eleIds.progressBarLineChart;
    bulletChartCanvas.width = progressBarWidth;
    bulletChartCanvas.height = chartHeightNum;
    bulletChartCanvas.style.position = 'absolute';
    bulletChartCanvas.style.top = OS.isEmbyNoisyX?.() ? '-24px' : '-21px';
    container.prepend(bulletChartCanvas);

    const ctx = bulletChartCanvas.getContext('2d');
    const maxY = Math.max(...timeCounts, 1);
    const scale = chartHeightNum / maxY;

    ctx.clearRect(0, 0, progressBarWidth, chartHeightNum);
    ctx.beginPath();
    ctx.moveTo(0, chartHeightNum - (timeCounts[0] || 0) * scale);
    for (let i = 1; i < timeCounts.length; i++) {
        const x = (i / Math.max(timeCounts.length - 1, 1)) * progressBarWidth;
        const y = chartHeightNum - timeCounts[i] * scale;
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
}
