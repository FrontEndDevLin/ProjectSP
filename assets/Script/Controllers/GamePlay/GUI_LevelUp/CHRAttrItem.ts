import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GamePlayEvent } from '../../../Common/Namespace';
import OBT from '../../../OBT';
const { ccclass, property } = _decorator;

@ccclass('CHRAttrItem')
export class CHRAttrItem extends OBT_Component {
    protected onLoad(): void {
        this._updateView();

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PROP_UPDATE, this._updateView, this);
    }

    start() {
        
    }

    private _updateView() {
        const prop: CHRInfo.Prop = this.node.OBT_param1;
        this.view("Label").getComponent(Label).string = `${prop.txt}`;
        this.view("Value").getComponent(Label).string = `${prop.val}`;
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.PROP_UPDATE, this._updateView, this);
    }

    update(deltaTime: number) {
        
    }
}


