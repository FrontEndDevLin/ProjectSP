/**
 * 基础武器类
 */

import { SpriteFrame } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { BoostConfig, BulletInfo, COLOR, Common, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject, getDangerRichTxt, getFloatNumber, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";

export default class WeaponBase {
    public id: string;
    public intro: string;
    public bullet: string;
    public penetrate: number; // 穿透数
    public pen_dmg: number; // 穿透伤害
    public split: number; // 分裂
    public split_dmg_rate: number; // 目标被一次攻击的多个子弹击中的伤害比例
    public range: number;
    public cd: number;
    public ctl: number; // 暴击率
    public ctl_dmg_rate: number; // 暴击倍率

    // 子弹相应属性
    public base_dmg: number;
    public dmg: number;
    public boost: BoostConfig;

    public originData: WeaponInfo.Weapon;

    // 可以被setProps更新的属性白名单
    protected propsUpdateWhiteList: string[] = ["penetrate", "split", "split_dmg_rate"];

    constructor(weaponData: WeaponInfo.Weapon) {
        Object.assign(this, weaponData)
        this.originData = copyObject(weaponData);
    }

    // TODO: 可能需要通知更新?
    public setProps(setPropsMap: Common.SimpleObj) {
        for (let prop in setPropsMap) {
            if (this.propsUpdateWhiteList.indexOf(prop) !== -1) {
                this[prop] = setPropsMap[prop];
            }
        }
    }

    public updatePanel() {
        if (!this.id || !this.originData) {
            return;
        }
        let bulletRealTimeAttr: BulletInfo.BulletRealTimeAttr = BulletManager.instance.getBulletRealTimeAttr(this.bullet);
        let ctl: number = CHRManager.instance.propCtx.getPropRealValue("ctl") + this.originData.ctl;
        let cd: number = getFloatNumber(this.originData.cd / CHRManager.instance.propCtx.getPropRealValue("atk_spd"), 3);
        let range: number = CHRManager.instance.propCtx.getPropRealValue("range") + this.originData.range;

        this.ctl = ctl;
        this.cd = cd;
        this.range = range;
        this.base_dmg = bulletRealTimeAttr.base_dmg;
        this.dmg = bulletRealTimeAttr.dmg;
    }

    public getIntroRichTxt(): string {
        let introRichTxt: string = this.intro || "";
        const regex = /<%([^%]+)%>/g;
        const matches = introRichTxt.match(regex)?.map(m => m.replace(/^<%|%>$/g, '')) || [];
        if (matches.length) {
            matches.forEach((key) => {
                let val = this[key]
                introRichTxt = introRichTxt.replace(`<%${key}%>`, `<color=${COLOR.SUCCESS}>${val}</color>`);
            })
        }
        return introRichTxt;
    }

    public getPanelRichTxt(): string {
        let richTxtList: string[] = [
            this.getDmgRichTxt()
        ];
        let ctlRichTxt: string = this.getCtlRichTxt();
        let penRichTxt: string = this.getPenetrateRichTxt();
        let cdRichTxt: string = this.getCdRichTxt();
        let rangeRichTxt: string = this.getRangeRichTxt();
        let splitDmgRateRichTxt: string = this.getSplitDmgRateRichTxt();
        if (ctlRichTxt) {
            richTxtList.push(ctlRichTxt);
        }
        if (penRichTxt) {
            richTxtList.push(penRichTxt);
        }
        if (cdRichTxt) {
            richTxtList.push(cdRichTxt);
        }
        if (rangeRichTxt) {
            richTxtList.push(rangeRichTxt);
        }
        if (splitDmgRateRichTxt) {
            richTxtList.push(splitDmgRateRichTxt);
        }

        let panelRichTxt = richTxtList.join("<br/>");

        return panelRichTxt;
    }

    // 获取伤害属性富文本
    protected getDmgRichTxt(): string {
        const { dmg, base_dmg, boost, split } = this
        let dmgColor: string = dmg >= base_dmg ? COLOR.SUCCESS : COLOR.DANGER;
        let dmgColorTxt: string = `<color=${dmgColor}>${dmg}</color>`;
        if (split && split > 0) {
            dmgColorTxt += `x<color=${COLOR.SUCCESS}>${split}</color>`;
        }
        let boostTxt: string = "";
        if (boost) {
            for (let prop in boost) {
                // TODO: 后续换成图集图标
                let attrTxt: string = CHRManager.instance.propCtx.getPropInfo(prop, "txt");
                boostTxt += `${boost[prop] * 100}%${attrTxt}`;
            }
        }
        return `伤害: ${dmgColorTxt}|${base_dmg}+${boostTxt}`;
    }
    // 获取穿透属性文本
    protected getPenetrateRichTxt(): string {
        const { penetrate} = this
        if (penetrate && penetrate > 0) {
            return `穿透: ${ getSuccessRichTxt(penetrate) }`;
        }
        return "";
    }
    // 获取暴击属性富文本
    protected getCtlRichTxt(): string {
        const { ctl, ctl_dmg_rate } = this;
        if (ctl && ctl_dmg_rate) {
            let color: string = ctl >= this.ctl ? COLOR.SUCCESS : COLOR.DANGER;
            let colorTxt: string = `<color=${color}>${ctl}%</color>`;
            return `暴击: ${ctl_dmg_rate}倍|${colorTxt}概率`;
        }
        return "";
    }
    // 获取冷却属性富文本
    protected getCdRichTxt() {
        const { cd } = this;
        if (cd) {
            let atkSpdVal: number = CHRManager.instance.propCtx.getPropRealValue("atk_spd");
            let color: string = cd <= atkSpdVal ? COLOR.SUCCESS : COLOR.DANGER;
            let colorTxt: string = `<color=${color}>${cd}</color>`;
            return `冷却: ${colorTxt}s`;
        }
        return "";
    }
    // 获取范围属性富文本
    protected getRangeRichTxt() {
        const { range } = this;
        if (range) {
            let color: string = range >= 0 ? COLOR.SUCCESS : COLOR.DANGER;
            let colorTxt: string = `<color=${color}>${range}</color>`;
            return `范围: ${colorTxt}`;
        }
        return "";
    }
    // 获取分裂击中同一目标的伤害衰减
    protected getSplitDmgRateRichTxt(): string {
        const { split_dmg_rate } = this;
        if (split_dmg_rate) {
            let rateStr: string = split_dmg_rate * 100 + "%";
            if (split_dmg_rate >= 1) {
                rateStr = getSuccessRichTxt(rateStr);
            } else {
                rateStr = getDangerRichTxt(rateStr);
            }
            return `对相同目标伤害: ${ rateStr }`
        }
        return "";
    }

    public getIntro(): string {
        return "";
    }
}
