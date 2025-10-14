/**
 * 游戏中，界面UI控制
 */

import { _decorator, Color, Component, EventTouch, Game, Label, Node, Sprite, UITransform, v3, Widget } from 'cc';
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

        // this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");

        // this.view("Container/InfoWrap/GUI_PropWrap").addComponent("GUI_PropWrap");

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_INIT, this._levelUpTimeInit, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_DEAD_TIME, this._levelUpDeadTime, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIMEOUT, this._levelUpTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.LEVEL_UP_LIST_UPDATE, this._updateLevelUpCard, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GUI.HIDE_PROP_UI, this._showLevelUpUI, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.LEVEL_UP_REF_COST_CHANGE, this._updateRefCost, this);

        this.view("Container/StoreWrap/RefreshBtn").on(Node.EventType.TOUCH_END, this._refreshLevelUpList, this);
        this.view("Bottom/Link").on(Node.EventType.TOUCH_END, this._showPropUI, this);
    }

    start() {
    }

    private _showLevelUpUI() {
        if (ProcessManager.instance.gameNode !== GAME_NODE.LEVEL_UP) {
            return;
        }
        this.showNodeByPath();
    }

    private _showPropUI() {
        this.hideNodeByPath();
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_PROP_UI);
    }

    private _updateLevelUpCard() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        const preLevelUpList: CHRInfo.upgradeProp[] = CHRManager.instance.propCtx.preUpgradeList;
        preLevelUpList.forEach((updateProp, i) => {
            cardSlotList[i].removeAllChildren();
            // preLevelUpList
            const levelUpCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/LevelUpCard" });
            levelUpCard.OBT_param1 = updateProp;
            OBT.instance.uiManager.mountNode({ node: levelUpCard, parentNode: cardSlotList[i] });
        })
    }

    private _levelUpTimeInit() {
        this.view("Bottom/Link").active = true;
    }

    private _levelUpDeadTime() {
        // 如果快超时了还停留在属性界面，切换回升级界面，隐藏“查看属性”入口
        this._showLevelUpUI();

        this.view("Bottom/Link").active = false;
    }

    private _levelUpTimeout() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        node.OBT_param2.autoTouch();
    }

    private _updateRefCost(cost: number) {
        this.view("Container/StoreWrap/RefreshBtn/Cost").getComponent(Label).string = `${cost}`;
    }

    private _refreshLevelUpList() {
        CHRManager.instance.propCtx.refreshPreUpgradeList();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


