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

        // this.view("Container/InfoWrap/GUI_PropWrap").addComponent("GUI_PropWrap");

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIMEOUT, this._prepareTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.STORE_ITEM_LIST_UPDATE, this._updateStoreItemCard, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GUI.HIDE_PROP_UI, this._showPrepareUI, this);

        this.view("Container/StoreWrap/Ref").on(Node.EventType.TOUCH_END, this._refreshStore, this);

        this.view("Bottom/PropTxt").on(Node.EventType.TOUCH_END, this._showPropUI, this);
    }

    start() {
    }

    private _updateStoreItemCard() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        cardSlotList.forEach((node: Node) => {
            node.removeAllChildren();
        });
        const storeItemList: ItemInfo.Item[] = ItemsManager.instance.storeItemList;
        storeItemList.forEach((item, i) => {
            // preLevelUpList
            const itemCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_Prepare/ItemCard" });
            itemCard.OBT_param1 = item;
            OBT.instance.uiManager.mountNode({ node: itemCard, parentNode: cardSlotList[i] });
        });
    }

    private _updateCountdownView(duration) {
        this.view("Countdown").getComponent(Label).string = duration;
    }

    private _prepareTimeout() {
        // const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        // let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        // node.OBT_param2.autoTouch();
    }

    private _refreshStore() {
        ItemsManager.instance.refreshStoreList();
    }

    private _showPropUI() {
        this.hideNodeByPath("Mask");
        this.hideNodeByPath("Container");
        this.hideNodeByPath("Bottom");
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_PROP_UI);
    }
    private _showPrepareUI() {
        if (ProcessManager.instance.gameNode !== GAME_NODE.PREPARE) {
            return;
        }
        this.showNodeByPath("Mask");
        this.showNodeByPath("Container");
        this.showNodeByPath("Bottom");
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


