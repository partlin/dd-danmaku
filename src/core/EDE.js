/**
 * EDE 主状态类
 * 管理弹幕实例、缓存、匹配信息等
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

import { lsGetItem, lsKeys } from '../config/api.js';

export class EDE {
    constructor() {
        this.chConvert = lsGetItem(lsKeys.chConvert.id);
        this.danmaku = null;
        this.episode_info = null;
        this.ob = null;
        this.loading = false;
        this.danmuCache = {}; // 只包含 comment 未解析
        this.commentsParsed = []; // 包含 comment 和 extComment 解析后全量
        this.extCommentCache = {}; // 只包含 extComment 未解析
        this.destroyIntervalIds = [];
        this.searchDanmakuOpts = {}; // 手动搜索变量
        this.appLogAspect = null; // 应用日志切面
        this.bangumiInfo = {};
        this.itemId = '';
        this.tempLsValues = {}; // 临时存储的由程序更改后的 ls 值
    }
}
