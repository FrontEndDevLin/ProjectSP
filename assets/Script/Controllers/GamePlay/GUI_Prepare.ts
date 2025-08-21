/**
 * 游戏中，界面UI控制
 */

import { _decorator, Color, Component, EventTouch, Game, Label, Node, Sprite, UITransform, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../Common/Namespace';
import ProcessManager from '../../CManager/ProcessManager';
import { getRandomNumber } from '../../Common/utils';
import ItemsManager from '../../CManager/ItemsManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_Prepare')
export class GUI_Prepare extends OBT_Component {
    protected onLoad(): void {
        // this._initCHRAttrCard();

        // this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");

        this.view("Container/InfoWrap/GUI_PropWrap").addComponent("GUI_PropWrap");

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIMEOUT, this._prepareTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.STORE_ITEM_LIST_UPDATE, this._updateStoreItemCard, this);
    }

    start() {
    }

    private _updateStoreItemCard() {
        let storeItemList: ItemInfo.Item[] = ItemsManager.instance.storeItemList;
        console.log("更新商店列表", storeItemList);
        // const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        // const preLevelUpList: CHRInfo.UpdateProp[] = CHRManager.instance.propCtx.preUpdateList;
        // preLevelUpList.forEach((updateProp, i) => {
        //     // preLevelUpList
        //     const levelUpCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/LevelUpCard" });
        //     levelUpCard.OBT_param1 = updateProp;
        //     OBT.instance.uiManager.mountNode({ node: levelUpCard, parentNode: cardSlotList[i] });
        // })
    }

    private _updateCountdownView(duration) {
        this.view("Container/TopBar/Countdown").getComponent(Label).string = duration;
    }

    private _prepareTimeout() {
        // const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        // let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        // node.OBT_param2.autoTouch();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


