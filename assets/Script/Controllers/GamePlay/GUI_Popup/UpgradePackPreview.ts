import { _decorator, Component, Label, Node, RichText } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { ItemInfo, WarCoreInfo } from '../../../Common/Namespace';
import GUI_GamePlayManager from '../../../CManager/GUI_GamePlayManager';
import { transportWorldPosition } from '../../../Common/utils';
import WarCoreManager from '../../../CManager/WarCoreManager';
import { CoreUpgradeCard } from '../GUI_CoreSelect/CoreUpgradeCard';
const { ccclass, property } = _decorator;

@ccclass('UpgradePackPreview')
export class UpgradePackPreview extends OBT_Component {
    protected onLoad(): void {
        this.view("CoreUpgradeCard").addComponent("CoreUpgradeCard");
    }

    start() {

    }

    public showPreviewPopup() {
        const packInfo: WarCoreInfo.WarCoreUpgradePack = WarCoreManager.instance.getPreviewUpgradePackInfo();
        const upgradeCardCtx: CoreUpgradeCard = <CoreUpgradeCard>this.view("CoreUpgradeCard").getComponent("CoreUpgradeCard");
        upgradeCardCtx.updateView(packInfo);

        // let backpackWrapNode: Node = GUI_GamePlayManager.instance.getBackpackWrapNode();
        // let postion = transportWorldPosition(backpackWrapNode.children[index].worldPosition);
        // postion.x -= 28;
        // postion.y += 28;
        // this.node.setPosition(postion);
        this.showNodeByPath();
    }

    public hidePreviewPopup() {
        this.hideNodeByPath();
    }

    update(deltaTime: number) {
        
    }
}


