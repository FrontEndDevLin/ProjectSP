import { _decorator } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CoreCard } from '../GUI_CoreSelect/CoreCard';
import WarCoreManager from '../../../CManager/WarCoreManager';
import Item_WarCore from '../Items/Item_WarCore';
const { ccclass, property } = _decorator;

@ccclass('AtkCore_Tooltips')
export class AtkCore_Tooltips extends OBT_Component {
    protected onLoad(): void {
        
    }

    start() {

    }

    public initAtkCorePreview() {
        this.view("CoreCard").addComponent(CoreCard);
    }

    public updateView() {
        const warCore: Item_WarCore = WarCoreManager.instance.iWarCore;
        this.view("CoreCard").getComponent(CoreCard).updateView(warCore);
    }

    update(deltaTime: number) {
        
    }
}

