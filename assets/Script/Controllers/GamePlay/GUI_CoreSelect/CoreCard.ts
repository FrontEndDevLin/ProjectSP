import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { BoostConfig, CHRInfo, COLOR, GAME_NODE, GamePlayEvent, WarCoreInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import WarCoreManager from '../../../CManager/WarCoreManager';
import DamageManager from '../../../CManager/DamageManager';
import BulletManager from '../../../CManager/BulletManager';
import { getFloatNumber } from '../../../Common/utils';
const { ccclass, property } = _decorator;

@ccclass('CoreCard')
export class CoreCard extends OBT_Component {
    private _props: WarCoreInfo.AtkWarCoreAttr;

    protected showProps: string[] = ["ctl", "cd", "range"];

    protected onLoad(): void {
        this.node.OBT_param2 = {
            autoTouch: this._touchCard.bind(this)
        }

        this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    start() {

    }

    public updateView(props: WarCoreInfo.AtkWarCoreAttr) {
        this._props = props;

        let assets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`WarCore/${props.icon_ui}`);
        this.view("Head/PicWrap/Pic").getComponent(Sprite).spriteFrame = assets;
        this.view("Head/TitleWrap/CoreName").getComponent(Label).string = props.name;

        this.view("Content/Intro").getComponent(RichText).string = props.weaponCtx.getIntroRichTxt();
        this.view("Content/Attr").getComponent(RichText).string = props.weaponCtx.getPanelRichTxt();

        if (props.itemCtx && props.itemCtx.intro) {
            this.view("Content/Trait").active = true;
            this.view("Content/Trait").getComponent(RichText).string = props.itemCtx.getIntro();
        } else {
            this.view("Content/Trait").active = false;
        }

        if (props.itemCtx.buff_list && props.itemCtx.buff_list.length) {
            this.view("Content/Buff").getComponent(RichText).string = props.itemCtx.getBuffTxt();
        }
    }

    private _touchCard() {
        if (!this._props) {
            return;
        }
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


