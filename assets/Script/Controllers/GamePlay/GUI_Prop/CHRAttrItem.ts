import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
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
        this.view("LeftWrap/Label").getComponent(Label).string = `${prop.txt}`;
        this.view("Value").getComponent(Label).string = `${prop.real_val}`;

        if (prop.ico) {
            let assets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`Prop/${prop.ico}`);
            this.view("LeftWrap/Ico").getComponent(Sprite).spriteFrame = assets;
            this.view("LeftWrap/Ico").active = true;
        }
    }

    private _showPropInfo() {
        const prop: CHRInfo.Prop = this.node.OBT_param1;
        let index = this.node.OBT_param2 ? this.node.OBT_param2.index : 0;
        let propKey = prop.prop;
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_PROP_INTRO_UI, propKey, index)
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.PROP_UPDATE, this._updateView, this);
    }

    update(deltaTime: number) {
        
    }
}


