import { _decorator, Component, Label, Node, RichText } from 'cc';
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

        this.view("OperBar/BuyBtn").once(Node.EventType.TOUCH_END, this._buyItem, this);
    }

    start() {

    }

    private _buyItem() {
        ItemsManager.instance.buyItem(this._item.id);
        // if (ProcessManager.instance.gameNode === GAME_NODE.LEVEL_UP) {
        //     CHRManager.instance.upgradeProp(this._props.prop);
        //     // 通知更新属性UI, TODO:(UI更新后2秒, 移除升级UI)
            this.hideNodeByPath();
        // }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._buyItem, this);
    }

    update(deltaTime: number) {
        
    }
}


