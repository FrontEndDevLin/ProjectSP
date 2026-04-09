import { _decorator } from 'cc';
import OBT_Component from '../../../OBT_Component';
import ItemWarCore from '../Items/ItemWarCore';
import { CoreCard } from '../GUI_CoreSelect/CoreCard';
import WarCoreManager from '../../../CManager/WarCoreManager';
import { ItemCard } from '../GUI_Prepare/ItemCard';
import ItemBase from '../Items/ItemBase';
import ItemsManager from '../../../CManager/ItemsManager';
const { ccclass, property } = _decorator;

@ccclass('Item_Tooltips')
export class Item_Tooltips extends OBT_Component {
    protected onLoad(): void {
        
    }

    start() {

    }

    public updateItemPreview(itemKey: string) {
        let item: ItemBase = ItemsManager.instance.getBackpackItemById(itemKey);
        this.view("ItemCard").addComponent(ItemCard);
        this.view("ItemCard").getComponent(ItemCard).updateView(item);
    }

    update(deltaTime: number) {
        
    }
}

