import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('LevelUpCard')
export class LevelUpCard extends OBT_Component {
    private _props: CHRInfo.UpdateProp;

    protected onLoad(): void {
        const props: CHRInfo.UpdateProp = this.node.OBT_param1;
        this._props = props;

        this.view("Content/Txt").getComponent(Label).string = `+${props.value} ${props.propTxt}`;

        this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    start() {

    }

    private _touchCard() {
        CHRManager.instance.levelUpProp(this._props.prop);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    update(deltaTime: number) {
        
    }
}


