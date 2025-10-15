import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo } from '../../../Common/Namespace';
import GUI_GamePlayManager from '../../../CManager/GUI_GamePlayManager';
import { transportWorldPosition } from '../../../Common/utils';
const { ccclass, property } = _decorator;

@ccclass('PropIntro')
export class PropIntro extends OBT_Component {
    protected onLoad(): void {
    }

    start() {
        
    }

    private _updateView(prop: CHRInfo.Prop) {
        this.view("Container/Intro").getComponent(Label).string = `${prop.txt}: ${prop.intro}`;
    }

    public showPropIntro(prop: CHRInfo.Prop, index: number) {
        this._updateView(prop);

        const propWrapNode: Node = GUI_GamePlayManager.instance.getPropWrapNode();
        const targetNode: Node = propWrapNode.children[index];

        let position = transportWorldPosition(targetNode.worldPosition);
        position.y -= 22; 
        this.node.setPosition(position);
    }
    public hidePropIntro() {
        this.hideNodeByPath();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


