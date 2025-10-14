import { _decorator, Color, Component, Label, Node, RichText, Sprite } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import ItemsManager from '../../../CManager/ItemsManager';
const { ccclass, property } = _decorator;

@ccclass('StoreItem')
export class StoreItem extends OBT_Component {
    private _item: ItemInfo.Item;

    protected onLoad(): void {
        const item: ItemInfo.Item = this.node.OBT_param1;

        this._item = item;
        this.view("ItemCard").OBT_param1 = item;
        this.view("ItemCard").addComponent("ItemCard");
        this.view("OperBar/BuyBtn/Price/Cost").getComponent(Label).string = `${item.price}`;

        this.view("OperBar/BuyBtn").once(Node.EventType.TOUCH_END, this._buyItem, this);

        // 244,164,96锁定颜色
        this.view("OperBar/LockBtn").on(Node.EventType.TOUCH_END, this._toggleLock, this);

        this._changeLockBtn();
    }

    start() {

    }

    private _buyItem() {
        let buyRes: boolean = ItemsManager.instance.buyItem(this._item.id);
        if (buyRes) {
            this.hideNodeByPath();
        }
    }

    private _toggleLock() {
        ItemsManager.instance.toggleLockStoreItem(this._item.id);
        this._changeLockBtn();
    }

    private _changeLockBtn() {
        let color = new Color(58, 58, 58);
        if (this._item.lock) {
            color = new Color(244, 164, 96);
        }
        this.view("OperBar/LockBtn").getComponent(Sprite).color = color;
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._buyItem, this);
    }

    update(deltaTime: number) {
        
    }
}


