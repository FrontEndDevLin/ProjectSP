import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame, UIOpacity } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import ItemsManager from '../../../CManager/ItemsManager';
import ItemBase from '../Items/ItemBase';
const { ccclass, property } = _decorator;

@ccclass('ItemRect')
export class ItemRect extends OBT_Component {
    private _backpackItem: ItemBase;

    protected onLoad(): void {
        const backpackItem: ItemBase = this.node.OBT_param1;

        this.node.OBT_param2.update = this._updateCount.bind(this);

        this._backpackItem = backpackItem;

        this._updateCount();

        let item: ItemInfo.Item = ItemsManager.instance.getItemById(backpackItem.id);
        let assets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`Item/${item.ico}`);
        this.view("Sprite").getComponent(Sprite).spriteFrame = assets;

        this.node.getComponent(UIOpacity).opacity = 255;

        this.node.on(Node.EventType.TOUCH_END, this._previewItem, this);
    }

    private _updateCount() {
        let countStr = this._backpackItem.count > 1 ? `x${this._backpackItem.count}` : "";
        this.view("Dot").getComponent(Label).string = countStr;
    }

    private _previewItem() {
        let index = this.node.OBT_param2.index || 0;
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_PREVIEW_ITEM_UI, this._backpackItem.id, index);
    }

    start() {

    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


