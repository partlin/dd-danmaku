/**
 * EDE 模块化入口
 * 阶段 0-5，组装 config、core、utils、match、danmaku、bangumi、ui、events
 * 与原始 ede.js 一致：window.ede 在 onViewShow(video-osd) 时懒初始化，不在此处创建
 */
import { refreshEventListener } from './events/emby-events.js';
import { onViewShow, beforeDestroy } from './events/view.js';

(function () {
    'use strict';

    refreshEventListener({ viewshow: onViewShow });
    refreshEventListener({ viewbeforehide: beforeDestroy });

    console.log('[EDE] modular init done');
})();
