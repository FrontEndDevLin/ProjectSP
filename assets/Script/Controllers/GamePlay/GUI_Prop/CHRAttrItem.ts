import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GamePlayEvent } from '../../../Common/Namespace';
import OBT from '../../../OBT';
import CHRManager from '../../../CManager/CHRManager';
import GUI_TooltipsManager from '../../../CManager/GUI_TooltipsManager';
const { ccclass, property } = _decorator;

@ccclass('CHRAttrItem')
export class CHRAttrItem extends OBT_Component {
    protected onLoad(): void {
        this._updateView();
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PROP_UPDATE, this._updateView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GUI.UPDATE_PROP_ITEM_ACTIVE, this._activePropItem, this);

        this.node.on(Node.EventType.TOUCH_END, this._showPropInfo, this);
    }

    start() {
        
    }

    private _updateView() {
        const prop: CHRInfo.Prop = this.node.OBT_param1;
        this.view("LeftWrap/Label").getComponent(Label).string = `${prop.txt}`;
        this.view("Value").getComponent(Label).string = `${prop.real_val}`;

        if (prop.ico) {
            let assets: SpriteFrame = this.view("LeftWrap/Ico").getComponent(Sprite).spriteAtlas.getSpriteFrame(prop.ico);
            this.view("LeftWrap/Ico").getComponent(Sprite).spriteFrame = assets;
            this.view("LeftWrap/Ico").active = true;
        }
    }

    private _showPropInfo() {
        const prop: CHRInfo.Prop = this.node.OBT_param1;
        let index = this.node.OBT_param2 ? this.node.OBT_param2.index : 0;
        let propKey = prop.prop;
        GUI_TooltipsManager.instance.showPropIntroTooltips(propKey, this.node);

        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.UPDATE_PROP_ITEM_ACTIVE, propKey, index)
    }

    private _activePropItem(propKey: string, index: number) {
        const prop: CHRInfo.Prop = this.node.OBT_param1;
        let currentIndex: number = this.node.OBT_param2 ? this.node.OBT_param2.index : 0;
        // console.log(prop.prop, currentIndex)
        if (prop.prop === propKey && currentIndex === index) {
            this.view("Border").getComponent(Sprite).enabled = true;
        } else {
            this.view("Border").getComponent(Sprite).enabled = false;
        }
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.PROP_UPDATE, this._updateView, this);
    }

    update(deltaTime: number) {
        
    }
}


