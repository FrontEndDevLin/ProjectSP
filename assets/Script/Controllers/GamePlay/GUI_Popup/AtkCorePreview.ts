import { _decorator, Component, Label, Node, RichText } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { ItemInfo, WarCoreInfo } from '../../../Common/Namespace';
import GUI_GamePlayManager from '../../../CManager/GUI_GamePlayManager';
import { transportWorldPosition } from '../../../Common/utils';
import WarCoreManager from '../../../CManager/WarCoreManager';
import { CoreCard } from '../GUI_CoreSelect/CoreCard';
const { ccclass, property } = _decorator;

@ccclass('AtkCorePreview')
export class AtkCorePreview extends OBT_Component {
    protected onLoad(): void {
        this.view("CoreCard").addComponent("CoreCard");
    }

    start() {

    }

    public showPreviewPopup() {
        const warCore: WarCoreInfo.AtkWarCoreAttr = WarCoreManager.instance.atkWarCore;
        const coreCardCtx: CoreCard = <CoreCard>this.view("CoreCard").getComponent("CoreCard");
        coreCardCtx.updateView(warCore);

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


