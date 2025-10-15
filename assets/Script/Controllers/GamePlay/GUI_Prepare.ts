/**
 * 游戏中，界面UI控制
 */

import { _decorator, Color, Component, EventTouch, Game, Label, Node, Sprite, SpriteFrame, UITransform, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../Common/Namespace';
import ProcessManager from '../../CManager/ProcessManager';
import { getRandomNumber } from '../../Common/utils';
import ItemsManager from '../../CManager/ItemsManager';
import GUI_GamePlayManager from '../../CManager/GUI_GamePlayManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_Prepare')
export class GUI_Prepare extends OBT_Component {
    private _backpackWrapNode: Node;

    protected onLoad(): void {
        // this._initCHRAttrCard();

        // this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");

        // this.view("Container/InfoWrap/GUI_PropWrap").addComponent("GUI_PropWrap");
        OBT.instance.eventCenter.on(GamePlayEvent.CURRENCY.CURRENCY_CHANGE, this._updateCurrency, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_DEAD_TIME, this._prepareDeadTime, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIMEOUT, this._prepareTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.STORE_ITEM_LIST_UPDATE, this._updateStoreItemCard, this);
        OBT.instance.eventCenter.on(GamePlayEvent.STORE.STORE_REF_COST_CHANGE, this._updateRefCost, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GUI.HIDE_PROP_UI, this._showPrepareUI, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.ITEM_CHANGE, this._updateItemList, this);

        this.view("Container/StoreWrap/RefreshBtn").on(Node.EventType.TOUCH_END, this._refreshStore, this);

        this.view("Bottom/PropTxt").on(Node.EventType.TOUCH_END, this._showPropUI, this);

        this._loadItemList();
    }

    start() {
    }

    private _updateCurrency() {
        this.view("Currency/Val").getComponent(Label).string = `${CHRManager.instance.currencyCtrl.getCurrency()}`;
    }

    private _updateStoreItemCard() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        cardSlotList.forEach((node: Node) => {
            node.removeAllChildren();
        });
        const storeItemList: ItemInfo.Item[] = ItemsManager.instance.storeItemList;
        storeItemList.forEach((item, i) => {
            const storeItemCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_Prepare/StoreItem" });
            storeItemCard.OBT_param1 = item;
            OBT.instance.uiManager.mountNode({ node: storeItemCard, parentNode: cardSlotList[i] });
        });
    }

    private _updateRefCost(cost: number) {
        this.view("Container/StoreWrap/RefreshBtn/Cost").getComponent(Label).string = `${cost}`;
    }

    private _updateCountdownView(duration) {
        this.view("Countdown").getComponent(Label).string = duration;
    }

    private _prepareDeadTime() {
        // 如果快超时了还停留在属性界面，切换回升级界面，隐藏“查看属性”入口
        this._showPrepareUI();

        this.view("Bottom/PropTxt").active = false;
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

    private _mountItemRectNode(backpackItem: ItemInfo.BackpackItem, index?: number) {
        if (!this._backpackWrapNode) {
            this._backpackWrapNode = this.view("Container/InfoWrap/WrapLeft/ScrollView/view/content");
            GUI_GamePlayManager.instance.setBackpackWrapNode(this._backpackWrapNode);
        }
        const itemRect: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_Prepare/ItemRect" });
        itemRect.OBT_param1 = backpackItem;
        if (!index) {
            index = this._backpackWrapNode.children.length
        }
        itemRect.OBT_param2 = {
            index
        }

        OBT.instance.uiManager.mountNode({ node: itemRect, parentNode: this._backpackWrapNode });
    }
    private _loadItemList() {
        let backpack: ItemInfo.BackpackItem[] = ItemsManager.instance.backpack;
        backpack.forEach((backpackItem: ItemInfo.BackpackItem, i: number) => {
            this._mountItemRectNode(backpackItem, i);
        })
    }
    private _updateItemList({ hasItemInBackpack, backpackItem }: { hasItemInBackpack: Boolean, backpackItem: ItemInfo.BackpackItem }) {
        if (hasItemInBackpack) {
            // 背包已有该道具，更新数量
            for (let node of this._backpackWrapNode.children) {
                let nodeBackpackItem: ItemInfo.BackpackItem = node.OBT_param1;
                if (nodeBackpackItem.id === backpackItem.id) {
                    node.OBT_param2.update();
                    break;
                }
            }
        } else {
            // 背包没有该道具，追加到列表后
            this._mountItemRectNode(backpackItem);
        }
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


