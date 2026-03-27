import { _decorator, Component, Label, Node, RichText, Sprite, SpriteFrame } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { BoostConfig, BulletInfo, CHRInfo, COLOR, GAME_NODE, GamePlayEvent, ITEM_QUALITY, ItemInfo, WarCoreInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import WarCoreManager from '../../../CManager/WarCoreManager';
import DamageManager from '../../../CManager/DamageManager';
import BulletManager from '../../../CManager/BulletManager';
import { getFloatNumber } from '../../../Common/utils';
import ItemsManager from '../../../CManager/ItemsManager';
import ItemBase from '../Items/ItemBase';
const { ccclass, property } = _decorator;

@ccclass('CoreUpgradeCard')
export class CoreUpgradeCard extends OBT_Component {
    private _props: ItemBase;

    protected showProps: string[] = ["ctl", "cd", "range"];

    protected onLoad(): void {
        this.node.OBT_param2 = {
            autoTouch: this._touchCard.bind(this)
        }

        this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
    }

    start() {

    }

    public updateView(props: ItemBase) {
        this._props = props;

        let quality = props.quality || ITEM_QUALITY.LV1;
        let uiConfg: ItemInfo.CardUIConfig = ItemsManager.instance.itemCardUIConfigMap[quality];
        let borderAssets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`Border/${uiConfg.border}`);
        this.view("Border").getComponent(Sprite).spriteFrame = borderAssets;

        this.view("Background").getComponent(Sprite).color = uiConfg.background;
        this.view("Container/Head/TitleWrap/CoreName").getComponent(Label).color = uiConfg.color;

        this.view("Container/Head/PicWrap/Pic").getComponent(Sprite).spriteFrame = props.getAssets();

        this.view("Container/Head/TitleWrap/CoreName").getComponent(Label).string = props.label;
        
        // TODO: 2026.1.3

        if (props.intro) {
            this.view("Container/Content/Intro").active = true;
            this.view("Container/Content/Intro").getComponent(RichText).string = props.getIntro();
        }

        let buffTxt: string = props.getBuffTxt();
        if (buffTxt) {
            this.view("Container/Content/Buff").getComponent(RichText).string = buffTxt;
        }
        // if (props.id === 'Item_Blossom') {
        //     console.log(props.getIntro())
        //     console.log(props.weaponCtx.getIntroRichTxt())
        // }

        if (props.weapon) {
            this.view("Container/Content/Attr").active = true;
            this.view("Container/Content/Attr").getComponent(RichText).string = props.weaponCtx.getPanelRichTxt();
        }

        // this.view("Content/Intro").getComponent(RichText).string = introRichTxt;

        // let buffList: CHRInfo.Buff[] = props.buff_list;
        // if (Array.isArray(buffList) && buffList.length) {
        //     let buffRichTxt: string = "";
        //     buffList.forEach((buff: CHRInfo.Buff, idx: number) => {
        //         buffRichTxt += CHRManager.instance.propCtx.getBuffTxt(buff);
        //         if (idx !== buffList.length - 1) {
        //             buffRichTxt += "<br/>"
        //         }
        //     });
        //     this.view("Content/Buff").getComponent(RichText).string = buffRichTxt;
        // }
    }

    // 获取伤害加成文本 实际伤害|[基础伤害+X%属性]
    // private _getRealDmgRichTxt(bulletRealTimeAttr): string {
    //     let { dmg, base_dmg, boost } = bulletRealTimeAttr;
    //     let dmgColor: string = dmg >= base_dmg ? COLOR.SUCCESS : COLOR.DANGER;
    //     let dmgColorTxt: string = `<color=${dmgColor}>${dmg}</color>`;
    //     let boostTxt: string = "";
    //     if (boost) {
    //         boostTxt += `|[${base_dmg}`;
    //         for (let prop in boost) {
    //             boostTxt += "+"
    //             // TODO: 后续换成图集图标
    //             let attrTxt: string = CHRManager.instance.propCtx.getPropInfo(prop, "txt");
    //             boostTxt += `${boost[prop] * 100}%${attrTxt}`;
    //         }
    //         boostTxt += ']'
    //     }
    //     return `${dmgColorTxt}${boostTxt}`;
    // }

    // 获取伤害属性富文本, 如果升级包里有弹头id, 则需要获取伤害
    // private _getDmgRichTxt(dmg: number, baseDmg: number, boost: BoostConfig, split?: number): string {
    //     let dmgColor: string = dmg >= baseDmg ? COLOR.SUCCESS : COLOR.DANGER;
    //     let dmgColorTxt: string = `<color=${dmgColor}>${dmg}</color>`;
    //     if (split && split > 0) {
    //         dmgColorTxt += `x<color=${COLOR.SUCCESS}>${split}</color>`;
    //     }
    //     let boostTxt: string = "|";
    //     if (boost) {
    //         for (let prop in boost) {
    //             // TODO: 后续换成图集图标
    //             let attrTxt: string = CHRManager.instance.propCtx.getPropInfo(prop, "txt");
    //             boostTxt += `${boost[prop] * 100}%${attrTxt}`;
    //         }
    //     }
    //     return `伤害: ${dmgColorTxt}|${baseDmg}${boostTxt}`;
    // }
    // // 获取暴击属性富文本
    // private _getCtlRichTxt(ctl: number, ctlDmgRate: number): string {
    //     let color: string = ctl >= this._props.ctl ? COLOR.SUCCESS : COLOR.DANGER;
    //     let colorTxt: string = `<color=${color}>${ctl}%</color>`;
    //     return `暴击: ${ctlDmgRate}倍|${colorTxt}概率`;
    // }
    // // 获取冷却属性富文本
    // private _getCdRichTxt(cd: number) {
    //     let atkSpdVal: number = CHRManager.instance.propCtx.getPropRealValue("atk_spd");
    //     let color: string = cd <= atkSpdVal ? COLOR.SUCCESS : COLOR.DANGER;
    //     let colorTxt: string = `<color=${color}>${cd}</color>`;
    //     return `冷却: ${colorTxt}s`;
    // }
    // // 获取范围属性富文本
    // private _getRangeRichTxt(range: number) {
    //     let color: string = range >= 0 ? COLOR.SUCCESS : COLOR.DANGER;
    //     let colorTxt: string = `<color=${color}>${range}</color>`;
    //     return `范围: ${colorTxt}`;
    // }

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


