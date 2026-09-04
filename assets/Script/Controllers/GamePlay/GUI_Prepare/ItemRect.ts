import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame, UIOpacity } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import ItemsManager from '../../../CManager/ItemsManager';
import ItemBase from '../Items/ItemBase';
import GUI_TooltipsManager from '../../../CManager/GUI_TooltipsManager';
import ItemBasic from '../Items/ItemBasic';
const { ccclass, property } = _decorator;

@ccclass('ItemRect')
export class ItemRect extends OBT_Component {
    private _backpackItem: ItemBasic;

    protected onLoad(): void {
        const backpackItem: ItemBasic = this.node.OBT_param1;

        this.node.OBT_param2.update = this._updateCount.bind(this);

        this._backpackItem = backpackItem;

        this._updateCount();

        let item: ItemInfo.I_Item = ItemsManager.instance.getItemById(backpackItem.props.code);

        let uiConfg: ItemInfo.CardUIConfig = ItemsManager.instance.itemCardUIConfigMap[item.quality];
        this.node.getComponent(Sprite).color = uiConfg.darkBackground;

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
        GUI_TooltipsManager.instance.showItemTooltips({ itemKey: this._backpackItem.props.code, node: this.node });
    }

    start() {

    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


