/**
 * 基础飞弹武器
 */

import { SpriteFrame } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { BoostConfig, BulletInfo, COLOR, Common, ITEM_QUALITY, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject, getDangerRichTxt, getFloatNumber, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import WeaponManager from "../../../CManager/WeaponManager";
import WeaponBasic from "./WeaponBasic";

interface WeaponInitOptions {
    // 道具引用(指向创建当前武器的道具, 当武器是敌人携带时, 为空)
    itemRef: any;
    // 武器挂载节点
    mountNode: any;
}

export default class Weapon_BaseFlyBullet extends WeaponBasic {
    // 武器品质
    public quality: ITEM_QUALITY;

    // 当前武器数据
    public curInf: WeaponInfo.IWeapon;
    // 原始武器数据
    public orgInf: WeaponInfo.IWeapon;

    // 攻击行为, 子类需要实现, 暂时使用string类型
    protected attackBehavior: string;

    public updatePanel() {
        if (!this.orgInf) {
            return;
        }
        // let isCurrentWarCoreBullet: boolean = true;
        // let bulletRealTimeAttr: BulletInfo.BulletRealTimeAttr = BulletManager.instance.getBulletRealTimeAttr(this.bullet, isCurrentWarCoreBullet);
        // let quality: ITEM_QUALITY = WarCoreManager.instance.warCore.quality || 1;
        // let ctl: number = CHRManager.instance.propCtx.getPropRealValue("ctl") + this.originData.ctl[quality - 1];
        // let cd: number = getFloatNumber(this.originData.cd[quality - 1] / CHRManager.instance.propCtx.getPropRealValue("atk_spd"), 3);
        // let range: number = CHRManager.instance.propCtx.getPropRealValue("range") + this.originData.range;

        // this.realCtl = ctl;
        // this.realCd = cd;
        // this.range = range;
        // this.base_dmg = bulletRealTimeAttr.base_dmg;
        // this.dmg = bulletRealTimeAttr.dmg;

        // this.correctPanel();
    }
}
