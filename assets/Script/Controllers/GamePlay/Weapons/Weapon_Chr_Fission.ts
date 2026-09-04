/**
 * "裂变"武器
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
import ItemBasic from "../Items/ItemBasic";
import Item_WarCore_ScatterWarCore from "../Items/WarCore/Item_WarCore_ScatterWarCore";
import { BehaviorBase } from "../AtkBehavior/BehaviorBase";
import { RangeBehavior_Chr_Fission } from "../AtkBehavior/RangeBehavior_Chr_Fission";

export default class Weapon_Chr_Fission extends WeaponBasic {
    public itemRef: Item_WarCore_ScatterWarCore;
    protected showCdTxt: boolean = false;

    protected behavior: string = "RangeBehavior_Chr_Fission";
    protected prefabName: string = "BaseFlyBullet";

    public behaviorCtx: RangeBehavior_Chr_Fission;

    // public updatePanel() {
    //     if (!this.orgInf) {
    //         return;
    //     }
    //     // let isCurrentWarCoreBullet: boolean = true;
    //     // let bulletRealTimeAttr: BulletInfo.BulletRealTimeAttr = BulletManager.instance.getBulletRealTimeAttr(this.bullet, isCurrentWarCoreBullet);
    //     // let quality: ITEM_QUALITY = WarCoreManager.instance.warCore.quality || 1;
    //     // let ctl: number = CHRManager.instance.propCtx.getPropRealValue("ctl") + this.originData.ctl[quality - 1];
    //     // let cd: number = getFloatNumber(this.originData.cd[quality - 1] / CHRManager.instance.propCtx.getPropRealValue("atk_spd"), 3);
    //     // let range: number = CHRManager.instance.propCtx.getPropRealValue("range") + this.originData.range;

    //     // this.realCtl = ctl;
    //     // this.realCd = cd;
    //     // this.range = range;
    //     // this.RangeBehavior_Chr_Fission = bulletRealTimeAttr.base_dmg;
    //     // this.dmg = bulletRealTimeAttr.dmg;

    //     // this.correctPanel();
    // }
}
