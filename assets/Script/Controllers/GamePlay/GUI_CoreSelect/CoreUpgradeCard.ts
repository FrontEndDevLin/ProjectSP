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
import ItemsManager from '../../../CManager/ItemsManager';
const { ccclass, property } = _decorator;

@ccclass('CoreUpgradeCard')
export class CoreUpgradeCard extends OBT_Component {
    private _props: WarCoreInfo.WarCoreUpgradePack;

    protected showProps: string[] = ["ctl", "cd", "range"];

    protected onLoad(): void {
        this.node.OBT_param2 = {
            autoTouch: this._touchCard.bind(this)
        }

        this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    start() {

    }

    public updateView(props: WarCoreInfo.WarCoreUpgradePack) {
        this._props = props;

        let assets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`WarCore/${props.icon_ui}`);
        this.view("Head/PicWrap/Pic").getComponent(Sprite).spriteFrame = assets;
        this.view("Head/TitleWrap/CoreName").getComponent(Label).string = props.name;
  
        let introRichTxt: string = props.atk_intro;
        const regex = /<%([^%]+)%>/g;
        const matches = introRichTxt.match(regex)?.map(m => m.replace(/^<%|%>$/g, '')) || [];
        if (matches.length) {
            matches.forEach((key) => {
                let val = props[key]
                introRichTxt = introRichTxt.replace(`<%${key}%>`, `<color=${COLOR.SUCCESS}>${val}</color>`);
            })
        }

        this.view("Content/Intro").getComponent(RichText).string = introRichTxt;

        let traits: string[] = props.traits;
        if (Array.isArray(traits) && traits.length) {
            let traitRichTxt: string = "";
            traits.forEach((trait: string, idx: number) => {
                traitRichTxt += ProcessManager.instance.traitCtrl.getTraitRichTxt(trait);
                if (idx !== traits.length - 1) {
                    traitRichTxt += "<br/>";
                }
            });
            this.view("Content/Trait").getComponent(RichText).string = traitRichTxt;
        }

        let buffList: CHRInfo.Buff[] = props.buff_list;
        if (Array.isArray(buffList) && buffList.length) {
            let buffRichTxt: string = "";
            buffList.forEach((buff: CHRInfo.Buff, idx: number) => {
                buffRichTxt += CHRManager.instance.propCtx.getBuffTxt(buff);
                if (idx !== buffList.length - 1) {
                    buffRichTxt += "<br/>"
                }
            });
            this.view("Content/Buff").getComponent(RichText).string = buffRichTxt;
        }
    }

    private _touchCard() {
        if (!this._props) {
            return;
        }
        if (ProcessManager.instance.gameNode === GAME_NODE.CORE_UPGRADE) {
            WarCoreManager.instance.mountUpgradePack(this._props.id);
            this.hideNodeByPath();
        }
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    update(deltaTime: number) {
        
    }
}


