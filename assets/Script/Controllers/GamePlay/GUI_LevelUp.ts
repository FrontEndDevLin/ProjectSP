/**
 * 游戏中，界面UI控制
 */

import { _decorator, Color, Component, EventTouch, Game, Label, Node, Sprite, UITransform, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { CHRInfo, GAME_NODE, GamePlayEvent } from '../../Common/Namespace';
import ProcessManager from '../../CManager/ProcessManager';
import { getRandomNumber } from '../../Common/utils';
const { ccclass, property } = _decorator;

@ccclass('GUI_LevelUp')
export class GUI_LevelUp extends OBT_Component {
    protected onLoad(): void {
        // this._initCHRAttrCard();

        this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");

        this.view("Container/InfoWrap/GUI_PropWrap").addComponent("GUI_PropWrap");

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIMEOUT, this._levelUpTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.LEVEL_UP_LIST_UPDATE, this._updateLevelUpCard, this);
    }

    start() {
    }

    private _updateLevelUpCard() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        const preLevelUpList: CHRInfo.UpdateProp[] = CHRManager.instance.propCtx.preUpdateList;
        preLevelUpList.forEach((updateProp, i) => {
            // preLevelUpList
            const levelUpCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/LevelUpCard" });
            levelUpCard.OBT_param1 = updateProp;
            OBT.instance.uiManager.mountNode({ node: levelUpCard, parentNode: cardSlotList[i] });
        })
    }

    private _updateCountdownView(duration) {
        this.view("Container/TopBar/Countdown").getComponent(Label).string = duration;
    }

    private _levelUpTimeout() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        node.OBT_param2.autoTouch();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


