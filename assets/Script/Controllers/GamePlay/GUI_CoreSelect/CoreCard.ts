import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { BoostConfig, CHRInfo, COLOR, GAME_NODE, GamePlayEvent, ITEM_QUALITY, ItemInfo, WarCoreInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import WarCoreManager from '../../../CManager/WarCoreManager';
import DamageManager from '../../../CManager/DamageManager';
import BulletManager from '../../../CManager/BulletManager';
import { getFloatNumber } from '../../../Common/utils';
import ItemWarCore from '../Items/ItemWarCore';
import ItemsManager from '../../../CManager/ItemsManager';
import Item_WarCore from '../Items/Item_WarCore';
const { ccclass, property } = _decorator;

@ccclass('CoreCard')
export class CoreCard extends OBT_Component {
    private warCoreRef: Item_WarCore;

    protected showProps: string[] = ["ctl", "cd", "range"];

    protected onLoad(): void {
        this.node.OBT_param2 = {
            autoTouch: this._touchCard.bind(this)
        }

        this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    start() {

    }

    public updateView(warCore: Item_WarCore) {
        this.warCoreRef = warCore;

        // return console.log(warCore)

        // console.log('预览核心, 当前核心品质:' + warCore.props.quality);
        let quality = warCore.props.quality || ITEM_QUALITY.LV1;
        let uiConfg: ItemInfo.CardUIConfig = ItemsManager.instance.itemCardUIConfigMap[quality];
        let borderAssets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`Border/${uiConfg.border}`);
        this.view("Border").getComponent(Sprite).spriteFrame = borderAssets;

        this.view("Background").getComponent(Sprite).color = uiConfg.background;
        this.view("Container/Head/TitleWrap/CoreName").getComponent(Label).color = uiConfg.color;

        this.view("Container/Head/PicWrap/Pic").getComponent(Sprite).spriteFrame = warCore.getAssets();
        this.view("Container/Head/TitleWrap/CoreName").getComponent(Label).string = warCore.props.name;

        /**
         * TODO: 由核心介绍文本和武器介绍文本组成
         */

        this.view("Container/Content/Intro").getComponent(RichText).string = warCore.getIntro();
        this.view("Container/Content/Attr").getComponent(RichText).string = warCore.weaponCtx.getPanelRichTxt();

        // if (props.intro) {
        //     this.view("Container/Content/Trait").active = true;
        //     this.view("Container/Content/Trait").getComponent(RichText).string = props.getIntro();
        // } else {
        //     this.view("Container/Content/Trait").active = false;
        // }

        if (warCore.props.buff_list && warCore.props.buff_list.length) {
            this.view("Container/Content/Buff").getComponent(RichText).string = warCore.getBuffTxt();
        }
    }

    private _touchCard() {
        if (!this.warCoreRef) {
            return;
        }
        if (ProcessManager.instance.gameNode === GAME_NODE.CORE_SELECT) {
            WarCoreManager.instance.mountAtkWarCore(this.warCoreRef.props.code);
            this.hideNodeByPath();
        }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    update(deltaTime: number) {
        
    }
}


