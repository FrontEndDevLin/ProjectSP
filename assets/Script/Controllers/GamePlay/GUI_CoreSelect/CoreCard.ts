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

        let assets: SpriteFrame = OBT.instance.resourceManager.getSpriteFrameAssets(`Prop/${props.icon_ui}`);
        this.view("Head/Pic").getComponent(Sprite).spriteFrame = assets;
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

        let realAttr: WarCoreInfo.AtkWarCoreDataAttr = WarCoreManager.instance.getWarCoreRealAttr(props.id);
        let richTxtList: string[] = [
            this._getDmgRichTxt(realAttr.dmg, realAttr.base_dmg, realAttr.boost, props.split),
            this._getCtlRichTxt(realAttr.ctl, realAttr.ctl_dmg_rate),
            this._getCdRichTxt(realAttr.cd),
            this._getRangeRichTxt(realAttr.range)
        ];

        let attrRichTxt = "";
        richTxtList.forEach((richTxt: string, idx: number) => {
            if (richTxt) {
                if (idx > 0) {
                    attrRichTxt += "<br/>";
                }
                attrRichTxt += richTxt;
            }
        });

        this.view("Content/Intro").getComponent(RichText).string = introRichTxt;
        this.view("Content/Attr").getComponent(RichText).string = attrRichTxt;
    }

    // 获取伤害属性富文本
    private _getDmgRichTxt(dmg: number, baseDmg: number, boost: BoostConfig, split?: number): string {
        let dmgColor: string = dmg >= baseDmg ? COLOR.SUCCESS : COLOR.DANGER;
        let dmgColorTxt: string = `<color=${dmgColor}>${dmg}</color>`;
        if (split && split > 0) {
            dmgColorTxt += `x<color=${COLOR.SUCCESS}>${split}</color>`;
        }
        let boostTxt: string = "|";
        if (boost) {
            for (let prop in boost) {
                // TODO: 后续换成图集图标
                let attrTxt: string = CHRManager.instance.propCtx.getPropInfo(prop, "txt");
                boostTxt += `${boost[prop] * 100}%${attrTxt}`;
            }
        }
        return `伤害: ${dmgColorTxt}|${baseDmg}${boostTxt}`;
    }
    // 获取暴击属性富文本
    private _getCtlRichTxt(ctl: number, ctlDmgRate: number): string {
        let color: string = ctl >= this._props.ctl ? COLOR.SUCCESS : COLOR.DANGER;
        let colorTxt: string = `<color=${color}>${ctl}%</color>`;
        return `暴击: ${ctlDmgRate}倍|${colorTxt}概率`;
    }
    // 获取冷却属性富文本
    private _getCdRichTxt(cd: number) {
        let atkSpdVal: number = CHRManager.instance.propCtx.getPropRealValue("atk_spd");
        let color: string = cd <= atkSpdVal ? COLOR.SUCCESS : COLOR.DANGER;
        let colorTxt: string = `<color=${color}>${cd}</color>`;
        return `冷却: ${colorTxt}s`;
    }
    // 获取范围属性富文本
    private _getRangeRichTxt(range: number) {
        let color: string = range >= 0 ? COLOR.SUCCESS : COLOR.DANGER;
        let colorTxt: string = `<color=${color}>${range}</color>`;
        return `范围: ${colorTxt}`;
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


