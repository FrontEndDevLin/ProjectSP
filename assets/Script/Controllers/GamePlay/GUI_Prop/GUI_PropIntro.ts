import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GamePlayEvent } from '../../../Common/Namespace';
import OBT from '../../../OBT';
import CHRManager from '../../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_PropIntro')
export class GUI_PropIntro extends OBT_Component {
    protected onLoad(): void {
        this.node.OBT_param2 = {
            updateView: this._updateView.bind(this)
        }

        this.view("Mask").on(Node.EventType.TOUCH_END, this._hideUI, this);
    }

    start() {
        
    }

    private _updateView(prop: CHRInfo.Prop) {
        this.view("Container/Intro").getComponent(Label).string = `${prop.txt}: ${prop.intro}`;
    }

    private _hideUI() {
        console.log('关闭界面')
        CHRManager.instance.hidePropIntro();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


