import { _decorator, Component, Label, Node, RichText } from 'cc';
import OBT_Component from '../../../OBT_Component';
import WarCoreManager from '../../../CManager/WarCoreManager';
import { CoreUpgradeCard } from '../GUI_CoreSelect/CoreUpgradeCard';
import ItemBase from '../Items/ItemBase';
const { ccclass, property } = _decorator;

@ccclass('UpgradePackPreview')
export class UpgradePackPreview extends OBT_Component {
    protected onLoad(): void {
        this.view("CoreUpgradeCard").addComponent("CoreUpgradeCard");
    }

    start() {

    }

    public showPreviewPopup() {
        const packInfo: ItemBase = WarCoreManager.instance.getPreviewUpgradePackInfo();
        if (packInfo) {
            const upgradeCardCtx: CoreUpgradeCard = <CoreUpgradeCard>this.view("CoreUpgradeCard").getComponent("CoreUpgradeCard");
            upgradeCardCtx.updateView(packInfo);
    
            // let backpackWrapNode: Node = GUI_GamePlayManager.instance.getBackpackWrapNode();
            // let postion = transportWorldPosition(backpackWrapNode.children[index].worldPosition);
            // postion.x -= 28;
            // postion.y += 28;
            // this.node.setPosition(postion);
            this.showNodeByPath();
        }
    }

    public hidePreviewPopup() {
        this.hideNodeByPath();
    }

    update(deltaTime: number) {
        
    }
}


