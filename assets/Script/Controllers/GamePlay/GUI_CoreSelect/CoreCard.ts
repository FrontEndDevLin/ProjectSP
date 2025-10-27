import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GAME_NODE, GamePlayEvent, WarCoreInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import WarCoreManager from '../../../CManager/WarCoreManager';
const { ccclass, property } = _decorator;

@ccclass('CoreCard')
export class CoreCard extends OBT_Component {
    private _props: WarCoreInfo.AtkWarCoreAttr;

    protected onLoad(): void {
        this.node.OBT_param2 = {
            autoTouch: this._touchCard.bind(this)
        }

        const props: WarCoreInfo.AtkWarCoreAttr = this.node.OBT_param1;
        this._props = props;

        let assets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`Prop/${props.icon_ui}`);
        this.view("Head/Pic").getComponent(Sprite).spriteFrame = assets;
        this.view("Head/TitleWrap/CoreName").getComponent(Label).string = props.name;
        // this.view("Content/Txt").getComponent(Label).string = props.intro;

        this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    start() {

    }

    private _touchCard() {
        if (ProcessManager.instance.gameNode === GAME_NODE.CORE_SELECT) {
            WarCoreManager.instance.mountAtkWarCore(this._props.id);
            this.hideNodeByPath();
        }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    update(deltaTime: number) {
        
    }
}


