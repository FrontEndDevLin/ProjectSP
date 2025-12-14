/**
 * 游戏中，界面UI控制
 */

import { _decorator, EventTouch, Label, Node, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { GAME_NODE, GamePlayEvent, ItemInfo, WarCoreInfo } from '../../Common/Namespace';
import ProcessManager from '../../CManager/ProcessManager';
import ItemsManager from '../../CManager/ItemsManager';
import GUI_GamePlayManager from '../../CManager/GUI_GamePlayManager';
import WarCoreManager from '../../CManager/WarCoreManager';
import { GUI_PropWrap } from './GUI_PropWrap';
const { ccclass, property } = _decorator;

@ccclass('GUI_Prepare')
export class GUI_Prepare extends OBT_Component {
    private _backpackWrapNode: Node;

    protected onLoad(): void {
        this.view("GUI_PropWrap").addComponent("GUI_PropWrap");
        this.view("SidePropBtn").on(Node.EventType.TOUCH_END, this.showPropGUI, this);

        OBT.instance.eventCenter.on(GamePlayEvent.CURRENCY.CURRENCY_CHANGE, this._updateCurrency, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_INIT, this._prepareInit, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PREPARE_TIMEOUT, this._prepareTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.STORE_ITEM_LIST_UPDATE, this._updateStoreItemCard, this);
        OBT.instance.eventCenter.on(GamePlayEvent.STORE.STORE_REF_COST_CHANGE, this._updateRefCost, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.ITEM_CHANGE, this._updateItemList, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.ATK_CORE_CHANGE, this.updateAtkWarCoreIcon, this);

        this.view("OperBtns/RefreshBtn").on(Node.EventType.TOUCH_END, this._refreshStore, this);

        this._loadItemList();

        this.view("OperBtns/NextWave").on(Node.EventType.TOUCH_END, this._nextWave, this);

        this.bindWarCoreTouchEvent();
    }

    start() {
    }

    protected showPropGUI() {
        const propWrapCtx: GUI_PropWrap = <GUI_PropWrap>this.view("GUI_PropWrap").getComponent("GUI_PropWrap");
        propWrapCtx.showPropGUI();
    }

    private _updateCurrency() {
        this.view("Currency/Val").getComponent(Label).string = `${CHRManager.instance.currencyCtrl.getCurrency()}`;
    }

    private _updateStoreItemCard() {
        const cardSlotList: Node[] = this.view("PrepareWrap/StoreWrap/CardWrap").children;
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
        this.view("OperBtns/RefreshBtn/Cost").getComponent(Label).string = `${cost}`;
    }

    private _prepareInit(duration) {
        this._updateCurrency();
        this._updateCountdownView(duration);
        this.updateWarCoreUpgradeIcon();
        this.view("Header/TitleWrap/Val").getComponent(Label).string = `${ProcessManager.instance.waveRole.wave + 1}`;
    }
    private _updateCountdownView(duration) {
        this.view("Countdown").getComponent(Label).string = duration;
    }

    private _prepareTimeout() {
        const propWrapCtx: GUI_PropWrap = <GUI_PropWrap>this.view("GUI_PropWrap").getComponent("GUI_PropWrap");
        propWrapCtx.hidePropGUI();
        this._nextWave();
    }

    private _refreshStore() {
        ItemsManager.instance.refreshStoreList();
    }

    private _mountItemRectNode(backpackItem: ItemInfo.BackpackItem, index?: number) {
        if (!this._backpackWrapNode) {
            this._backpackWrapNode = this.view("PrepareWrap/InfoWrap/ItemsWrap/ScrollView/view/content");
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

    // 下一波
    private _nextWave() {
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.PREPARE_FINISH);
    }

    // 核心区主核心图标
    protected updateAtkWarCoreIcon() {
        const warCore: WarCoreInfo.AtkWarCoreAttr = WarCoreManager.instance.atkWarCore;
        let assets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`WarCore/${warCore.icon_ui}`);
        this.view("PrepareWrap/InfoWrap/CoreWrap/Wrap/WarCoreSlot/Pic").getComponent(Sprite).spriteFrame = assets;
    }
    // 核心区升级包图标
    protected updateWarCoreUpgradeIcon() {
        const slotList: Node[] = this.view("PrepareWrap/InfoWrap/CoreWrap/Wrap/UpgradeWrap").children;
        slotList.forEach((slotNode: Node, i: number) => {
            let packId: string = WarCoreManager.instance.upgradeSlot[i];
            let assets: SpriteFrame;
            if (packId) {
                let packInfo: WarCoreInfo.WarCoreUpgradePack = WarCoreManager.instance.getUpgradePackInfo(packId);
                let icon = packInfo.icon_ui;
                assets = OBT.instance.resourceManager.getSpriteFrameAssets(`WarCore/${icon}`);
            } else {
                assets = OBT.instance.resourceManager.getSpriteFrameAssets(`GamePlay/lock-ico`);
            }
            slotNode.OBT_param1 = packId;
            slotNode.OBT_param2 = i;
            slotNode.children[0].getComponent(Sprite).spriteFrame = assets;
        })
    }
    protected bindWarCoreTouchEvent() {
        this.view("PrepareWrap/InfoWrap/CoreWrap/Wrap/WarCoreSlot").on(Node.EventType.TOUCH_END, this._showAtkCorePreview, this);

        const slotList: Node[] = this.view("PrepareWrap/InfoWrap/CoreWrap/Wrap/UpgradeWrap").children;
        for (let slotNode of slotList) {
            slotNode.on(Node.EventType.TOUCH_END, this.warCoreUpgradeIconTouch, this);
        }
    }

    private _showAtkCorePreview() {
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_PREVIEW_WAR_CORE_UI);
    }
    private warCoreUpgradeIconTouch(e: EventTouch) {
        const targetNode: Node = e.currentTarget;
        // e.currentTarget.OBT_param2 idx
        // TODO: 展示升级包卡片
        let packId: string = targetNode.OBT_param1;
        WarCoreManager.instance.previewUpgradePack(packId);
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_PREVIEW_UPGRADE_PACK_UI);
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


