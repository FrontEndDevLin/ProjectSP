import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GamePlayEvent } from '../../../Common/Namespace';
import OBT from '../../../OBT';
import CHRManager from '../../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('CHRAttrItem')
export class CHRAttrItem extends OBT_Component {
    protected onLoad(): void {
        this._updateView();

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PROP_UPDATE, this._updateView, this);

        this.node.on(Node.EventType.TOUCH_END, this._showPropInfo, this);
    }

    start() {
        
    }

    private _updateView() {
        const prop: CHRInfo.Prop = this.node.OBT_param1;
        this.view("Label").getComponent(Label).string = `${prop.txt}`;
        this.view("Value").getComponent(Label).string = `${prop.val}`;
    }

    private _showPropInfo() {
        const prop: CHRInfo.Prop = this.node.OBT_param1;
        let index = this.node.OBT_param2 ? this.node.OBT_param2.index : 0;
        CHRManager.instance.propCtx.showPropIntro(prop.prop, index);
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.PROP_UPDATE, this._updateView, this);
    }

    update(deltaTime: number) {
        
    }
}


