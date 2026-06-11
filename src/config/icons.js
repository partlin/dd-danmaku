/**
 * 图标、样式、类名配置
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

// https://fonts.google.com/icons
export const iconKeys = {
    replay_30: 'replay_30',
    replay_10: 'replay_10',
    replay_5: 'replay_5',
    replay: 'replay',
    reset: 'repeat',
    forward_media: 'forward_media', // electron 中图标不正确,使用 replay 反转
    forward_5: 'forward_5',
    forward_10: 'forward_10',
    forward_30: 'forward_30',
    comment: 'comment',
    comments_disabled: 'comments_disabled',
    switch_on: 'toggle_on',
    switch_off: 'toggle_off',
    setting: 'tune',
    search: 'search',
    done: 'done_all',
    done_disabled: 'remove_done',
    more: 'more_horiz',
    close: 'close',
    refresh: 'refresh',
    block: 'block',
    text_format: 'translate',
    person: 'person',
    sentiment_very_satisfied: 'sentiment_very_satisfied',
    check: 'check',
    edit: 'edit',
};

export const embyOffsetBtnStyle = 'margin: 0;padding: 0;';

export const timeOffsetBtns = [
    { label: '-30', valueOffset: '-30', iconKey: iconKeys.replay_30, style: embyOffsetBtnStyle },
    { label: '-10', valueOffset: '-10', iconKey: iconKeys.replay_10, style: embyOffsetBtnStyle },
    { label: '-5', valueOffset: '-5', iconKey: iconKeys.replay_5, style: embyOffsetBtnStyle },
    { label: '-1', valueOffset: '-1', iconKey: iconKeys.replay, style: embyOffsetBtnStyle },
    { label: '0', valueOffset: '0', iconKey: iconKeys.reset, style: embyOffsetBtnStyle },
    { label: '+1', valueOffset: '1', iconKey: iconKeys.replay, style: embyOffsetBtnStyle + ' transform: rotateY(180deg);' },
    { label: '+5', valueOffset: '5', iconKey: iconKeys.forward_5, style: embyOffsetBtnStyle },
    { label: '+10', valueOffset: '10', iconKey: iconKeys.forward_10, style: embyOffsetBtnStyle },
    { label: '+30', valueOffset: '30', iconKey: iconKeys.forward_30, style: embyOffsetBtnStyle },
];

// emby ui class
export const classes = {
    dialogContainer: 'dialogContainer',
    dialogBackdropOpened: 'dialogBackdropOpened',
    dialogBlur: 'dialog-blur', // Emby Theater (魔改版)上的毛玻璃背景
    dialog: 'dialog',
    formDialogHeader: 'formDialogHeader',
    formDialogFooter: 'formDialogFooter',
    formDialogFooterItem: 'formDialogFooterItem',
    dialogFullscreen: 'dialog-fullscreen',
    dialogFullscreenLowres: 'dialog-fullscreen-lowres', // Emby Android (魔改版)特殊全屏
    videoOsdTitle: 'videoOsdTitle', // 播放页媒体次级标题
    videoOsdBottomButtons: 'videoOsdBottom-buttons', // 新老客户端播放页通用的底部按钮,但在 TV 下是 hide
    videoOsdBottomButtonsTopRight: 'videoOsdBottom-buttons-topright', // 新客户端播放页右上方的按钮
    videoOsdBottomButtonsRight: 'videoOsdBottom-buttons-right', // 老客户端上的右侧按钮
    videoOsdPositionSliderContainer: 'videoOsdPositionSliderContainer',
    cardImageIcon: 'cardImageIcon',
    headerRight: 'headerRight',
    headerUserButton: 'headerUserButton',
    mdlSpinner: 'mdl-spinner',
    collapseContentNav: 'collapseContent navDrawerCollapseContent',
    embyLabel: 'inputLabel',
    embyInput: 'emby-input emby-input-smaller',
    embySelectWrapper: 'emby-select-wrapper',
    embySelectTv: 'emby-select-tv', // highlight on tv layout
    embyCheckboxList: 'checkboxList',
    embyFieldDesc: 'fieldDescription',
    embyTabsMenu: 'headerMiddle headerSection sectionTabs headerMiddle-withSectionTabs',
    embyTabsDiv1: 'tabs-viewmenubar tabs-viewmenubar-backgroundcontainer focusable scrollX hiddenScrollX smoothScrollX scrollFrameX emby-tabs',
    embyTabsDiv2: 'tabs-viewmenubar-slider emby-tabs-slider padded-left padded-right nohoverfocus scrollSliderX',
    embyTabsButton: 'emby-button secondaryText emby-tab-button main-tab-button',
    embyButtons: {
        basic: 'raised emby-button',
        submit: 'button-submit',
        help: 'button-help',
        link: 'button-link',
        iconButton: 'flex-shrink-zero paper-icon-button-light',
    },
};

export const styles = {
    embyCheckboxList: 'display: flex;flex-wrap: wrap;',
    embySliderList: 'display: flex;flex-direction: column;justify-content: center;align-items: center;',
    embySlider: 'display: flex; align-items: center; margin-bottom: 0.3em;',
    embySliderLabel: 'width: 4em; margin-left: 1em;',
    rightLayout: 'position: fixed; right: 0; width: 40%; min-width: auto; min-height: auto; max-width: 100%; max-height: 100%;',
    colors: {
        info: 0xffffff,  // 白色
        success: 0x00ff00,  // 绿色
        warn: 0xffff00,  // 黄色
        error: 0xff0000,  // 红色
        highlight: 'rgba(115, 160, 255, 0.3)', // 尽量接近浏览器控制台选定元素的淡蓝色背景色
        switchActiveColor: '#52b54b',
    },
    fontStyles: [
        { id: 'normal', name: '正常' },
        { id: 'italic', name: '原生斜体' },
        { id: 'oblique', name: '形变斜体' },
    ],
};
