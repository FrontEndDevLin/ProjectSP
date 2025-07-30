import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('CHRAttrItem')
export class CHRAttrItem extends OBT_Component {
    protected onLoad(): void {
        const prop: CHRInfo.CHRPropsAttr = this.node.OBT_param1;

        this.view("Label").getComponent(Label).string = `${prop.propTxt}`;
        this.view("Value").getComponent(Label).string = `${prop.value}`;
    }

    start() {

    }

    private _touchCard() {
        // CHRManager.instance.levelUpProp(this._props.prop);
    }

    protected onDestroy(): void {
        // this.node.off(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    update(deltaTime: number) {
        
    }
}


