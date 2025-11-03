import { _decorator, Color, Component, EventTouch, Label, Node, Sprite, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
const { ccclass, property } = _decorator;

@ccclass('GUI_PropWrap')
export class GUI_PropWrap extends OBT_Component {
    protected onLoad(): void {
        this.view("GUI_Prop").addComponent("GUI_Prop");

        this.view("Mask").on(Node.EventType.TOUCH_END, this.hidePropGUI, this);
    }

    start() {
    }

    public showPropGUI() {
        this.showNodeByPath();
        this.view("GUI_Prop").getComponent(Widget).left = 0;
    }

    public hidePropGUI() {
        this.hideNodeByPath();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


