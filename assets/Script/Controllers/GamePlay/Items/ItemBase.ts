/**
 * 基础道具类, 只有数值的增减的道具可继承该类
 */

import { SpriteFrame } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { CHRInfo, ItemInfo } from "../../../Common/Namespace";
import { getDangerRichTxt, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import WeaponBase from "../Weapons/WeaponBase";
import WeaponManager from "../../../CManager/WeaponManager";

export default class ItemBase {
    public count: number = 0;

    public id: string;
    public global: ItemInfo.Global;
    public type: ItemInfo.Type;
    public level: number;
    public label: string;
    public intro: string;
    public group: ItemInfo.Group;
    public ico: string;
    public max: number;
    public price: number;
    public lock: boolean;
    public val_1: number;
    public val_2: number;
    public buff_list: CHRInfo.Buff[] = [];
    public weapon: string;
    public weaponCxt: WeaponBase;

    constructor(itemData: ItemInfo.Item) {
        Object.assign(this, itemData)
        if (itemData.weapon) {
            this.weaponCxt = WeaponManager.instance.getWeaponCtxById(itemData.weapon);
        }
    }

    public getGroupTxt(): string {
        let txt = "";
        switch (this.group) {
            case ItemInfo.Group.NORMAL: {
                txt = "道具";
            } break;
            case ItemInfo.Group.LIMIT: {
                txt = "限制的";
            } break;
            case ItemInfo.Group.SPECIAL: {
                txt = "唯一的";
            } break;
        }
        return txt;
    }

    public getAssets(): SpriteFrame {
        return OBT.instance.resourceManager.getSpriteFrameAssets(`Item/${this.ico}`);
    }

    // 道具介绍
    public getIntro() {
        let intro = this.intro;

        // 对模板的 <%XX%> 进行处理
        const valRegex = /<%([^%]+)%>/g;
        const valMatches = intro.match(valRegex)?.map(m => m.replace(/^<%|%>$/g, '')) || [];
        if (valMatches.length) {
            valMatches.forEach((key) => {
                let val: number = this[key];
                if (val) {
                    let valRichTxt: string;
                    if (val >= 0) {
                        valRichTxt = getSuccessRichTxt(`+${val}`);
                    } else {
                        valRichTxt = getDangerRichTxt(`-${val}`);
                    }
                    intro = intro.replace(`<%${key}%>`, valRichTxt);
                }
            })
        }

        // 对模板的 <&XX&> 进行处理
        const propRegex = /<&([^&]+)&>/g;
        const propMatches = intro.match(propRegex)?.map(m => m.replace(/^<&|&>$/g, '')) || [];
        if (propMatches.length) {
            propMatches.forEach((key) => {
                let propTxt = CHRManager.instance.propCtx.getPropInfo(key, "txt");
                if (propTxt) {
                    let propTxtRichTxt: string = getSuccessRichTxt(propTxt);
                    intro = intro.replace(`<&${key}&>`, propTxtRichTxt);
                }
            })
        }

        // TODO: 普通道具不会对全局收益进行修正, 这段代码可以优化到特殊类里面。
        // 对模板的 <~XX,YY~>进行处理(全局修正属性)
        const amendRegex = /<~([^~]+)~>/g;
        const amendMatches = intro.match(amendRegex)?.map(m => m.replace(/^<~|~>$/g, '')) || [];
        if (amendMatches.length) {
            amendMatches.forEach((rule) => {
                let [amendProp, key] = rule.split(',')
                if (amendProp && key) {
                    let value = this[key];
                    let propTxt = CHRManager.instance.propCtx.getPropInfo(amendProp, "txt");
                    if (value && propTxt) {
                        let amendTxtRichTxt: string = getSuccessRichTxt(propTxt) + '的加成';
                        let amendValTxt: string;
                        value *= 100;
                        if (value > 0) {
                            amendValTxt = getSuccessRichTxt(`+${value}%`);
                        } else {
                            amendValTxt = getDangerRichTxt(`-${value}%`);
                        }

                        intro = intro.replace(`<~${rule}~>`, `${amendTxtRichTxt}${amendValTxt}`);
                    }
                }
            })
        }

        return intro;
    }

    // buff富文本
    public getBuffTxt() {
        let buffTxt = "";
        this.buff_list.forEach((buff, i) => {
            buffTxt += CHRManager.instance.propCtx.getBuffTxt(buff);
            if (i !== this.buff_list.length - 1) {
                buffTxt += "<br/>";
            }
        });
        return buffTxt;
    }

    // 使用道具
    public use(): boolean {
        if (this.group === ItemInfo.Group.LIMIT) {
            if (this.count >= this.max) {
                return false; 
            }
        }
        if (this.group === ItemInfo.Group.SPECIAL) {
            if (this.count >= 1) {
                return false;
            }
        }
        this.count++;
        // 将道具中的buff应用上
        if (this.buff_list.length) {
            return CHRManager.instance.upgradePropByBuff(this.buff_list);
        }

        this.onUse();
        return true;
    }

    public onUse() {}
}
