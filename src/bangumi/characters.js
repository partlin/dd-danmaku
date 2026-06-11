/**
 * Bangumi 角色展示
 * 从 ede.js buildExtInfo 中拆出，未修改原有实现逻辑
 */

import { embyImg, embyImgButton, embyI } from '../ui/components/common.js';
import { iconKeys, classes } from '../config/icons.js';

/**
 * 渲染 Bangumi 角色与声优信息
 * @param {HTMLElement} container - 容器元素
 * @param {Array} characters - 角色数据数组
 */
export function renderBangumiCharacters(container, characters) {
    characters.map((c) => {
        const characterDiv = document.createElement('div');
        characterDiv.style = 'width: 31%; display: flex; margin: .5em;';
        let embyImgButtonInner = embyImg(c.images.large, 'object-position: top;');
        if (!c.images.large) {
            embyImgButtonInner = embyI(iconKeys.person, classes.cardImageIcon);
        }
        characterDiv.append(embyImgButton(embyImgButtonInner));
        const characterRightDiv = document.createElement('div');
        characterRightDiv.style.marginLeft = '.5em';
        const characterNameDiv = document.createElement('div');
        characterNameDiv.textContent = c.relation + ': ' + c.name;
        characterRightDiv.append(characterNameDiv);
        const characterCvDiv = document.createElement('div');
        characterCvDiv.textContent = 'CV: ' + c.actors.map((a) => a.name).join();
        if (c.actors[0]) {
            characterCvDiv.append(embyImgButton(embyImg(c.actors[0].images.large)));
        }
        characterRightDiv.append(characterCvDiv);
        characterDiv.append(characterRightDiv);
        container.append(characterDiv);
    });
}
