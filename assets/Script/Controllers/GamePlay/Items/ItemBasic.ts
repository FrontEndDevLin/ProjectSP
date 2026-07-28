/**
 * 基础道具类, 只有数值的增减的道具可继承该类
 */

import { SpriteFrame } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { CHRInfo, ITEM_QUALITY, ItemInfo, WarCoreInfo } from "../../../Common/Namespace";
import { copyObject, getDangerRichTxt, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import WeaponBase from "../Weapons/WeaponBase";
import WeaponManager from "../../../CManager/WeaponManager";
import ProcessManager from "../../../CManager/ProcessManager";

export default class ItemBasic {
    public props: ItemInfo.I_Item | WarCoreInfo.I_WarCoreAttr;

    public count: number = 0;
    // 当前价格=(基础价格+当前波次+(基础价格*0.1*当前波次)*角色属性'%道具价格')
    public real_price: number;
    public recover_price: number;

    public val_prefix: ItemInfo.ItemValPrefix = {
        val_1: "+-",
        val_2: "+-"
    }

    constructor(itemData: ItemInfo.I_Item) {
        if (itemData) {
            const props: ItemInfo.I_Item = copyObject(itemData);
            this.props = props;
            // if (itemData.global === ItemInfo.Global.ITEM) {
            //     let wave: number = ProcessManager.instance.waveRole.wave
            //     this.real_price = Math.round(this.props.price + wave + (this.props.price * 0.1 * wave) * CHRManager.instance.propCtx.getPropRealValue("item_price"));
            //     this.recover_price = Math.ceil(this.real_price * 0.25);
            // }
        }
    }

    protected onUpgradeQuality() {}

    public upgradeQuality() {
        // this.quality++;
        // this.onUpgradeQuality();
        // this.weaponCtx.setQuality(this.quality);
    }

    public getGroupTxt(): string {
        let txt = "";
        // switch (this.group) {
        //     case ItemInfo.Group.NORMAL: {
        //         txt = "道具";
        //     } break;
        //     case ItemInfo.Group.LIMIT: {
        //         txt = "限制的";
        //     } break;
        //     case ItemInfo.Group.SPECIAL: {
        //         txt = "唯一的";
        //     } break;
        // }
        return txt;
    }

    public getAssets(): SpriteFrame {
        return OBT.instance.resourceManager.getSpriteFrameAssets(`Item/${this.props.ico}`);
    }

    public getProp(propKey: string): any {
        // return this[propKey];
    }

    public setProp(propKey: string, value: any) {
        // if (this[propKey] !== undefined) {
        //     this[propKey] = value;
        // }
    }

    // 使用道具
    public use(): boolean {
        if (this.props.group === ItemInfo.Group.LIMIT) {
            if (this.count >= this.props.max) {
                return false; 
            }
        }
        if (this.props.group === ItemInfo.Group.SPECIAL) {
            if (this.count >= 1) {
                return false;
            }
        }
        this.count++;
        // 将道具中的buff应用上
        if (this.props.buff_list && this.props.buff_list.length) {
            CHRManager.instance.upgradePropByBuff(this.props.buff_list);
        }

        this.onUse();
        return true;
    }

    protected onUse() {}
}
