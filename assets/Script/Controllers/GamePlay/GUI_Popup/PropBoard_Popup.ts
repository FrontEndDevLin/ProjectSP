import { _decorator } from 'cc';
import OBT_Component from '../../../OBT_Component';
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


