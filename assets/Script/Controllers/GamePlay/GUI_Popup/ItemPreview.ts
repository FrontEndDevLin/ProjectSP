import { _decorator, Component, Label, Node, RichText } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { ItemInfo } from '../../../Common/Namespace';
import GUI_GamePlayManager from '../../../CManager/GUI_GamePlayManager';
import { transportWorldPosition } from '../../../Common/utils';
import ItemBase from '../../../Items/ItemBase';
const { ccclass, property } = _decorator;

@ccclass('ItemPreview')
export class ItemPreview extends OBT_Component {
    protected onLoad(): void {
        this.view("ItemCard").addComponent("ItemCard");
    }

    start() {

    }

    public showPreviewPopup(item: ItemBase, index: number) {
        this.view("ItemCard").OBT_param2.updateView(item);

        let backpackWrapNode: Node = GUI_GamePlayManager.instance.getBackpackWrapNode();
        let postion = transportWorldPosition(backpackWrapNode.children[index].worldPosition);
        postion.x -= 28;
        postion.y += 28;
        this.node.setPosition(postion);
    }

    public hidePreviewPopup() {
        this.hideNodeByPath();
    }

    update(deltaTime: number) {
        
    }
}


