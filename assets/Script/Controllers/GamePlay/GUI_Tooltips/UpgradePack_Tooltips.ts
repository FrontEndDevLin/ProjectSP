import { _decorator } from 'cc';
import OBT_Component from '../../../OBT_Component';
import WarCoreManager from '../../../CManager/WarCoreManager';
import ItemBase from '../Items/ItemBase';
import { CoreUpgradeCard } from '../GUI_CoreSelect/CoreUpgradeCard';
const { ccclass, property } = _decorator;

@ccclass('UpgradePack_Tooltips')
export class UpgradePack_Tooltips extends OBT_Component {
    protected onLoad(): void {
        
    }

    start() {

    }

    public initUpgradePackPreview() {
        this.view("CoreUpgradeCard").addComponent(CoreUpgradeCard);
    }

    public updateView() {
        const packInfo: ItemBase = WarCoreManager.instance.getPreviewUpgradePackInfo();
        if (packInfo) {
            this.view("CoreUpgradeCard").getComponent(CoreUpgradeCard).updateView(packInfo);
        }
    }

    update(deltaTime: number) {
        
    }
}

