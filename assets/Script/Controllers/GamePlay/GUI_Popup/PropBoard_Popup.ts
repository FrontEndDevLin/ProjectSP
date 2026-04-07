import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import { CHRInfo } from '../../../Common/Namespace';
import OBT_Component from '../../../OBT_Component';
import CHRManager from '../../../CManager/CHRManager';
import { getSuccessRichTxt } from '../../../Common/utils';
import { GUI_Prop } from '../GUI_Prop';
const { ccclass, property } = _decorator;

@ccclass('PropBoard_Popup')
export class PropBoard_Popup extends OBT_Component {
    protected onLoad(): void {
    }

    start() {

    }

    public initBoard() {
        // console.log(this.view("GUI_Prop"))
        this.view("GUI_Prop").addComponent(GUI_Prop);
        this.view("GUI_Prop").getComponent(GUI_Prop).initCHRAttrCard();
    }

    update(deltaTime: number) {
        
    }
}


