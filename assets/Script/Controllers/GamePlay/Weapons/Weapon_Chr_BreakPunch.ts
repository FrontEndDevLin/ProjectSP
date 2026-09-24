/**
 * 棱拳武器
 */
import WeaponBasic from "./WeaponBasic";
import Item_WarCore_RhombusPunch from "../Items/WarCore/Item_WarCore_RhombusPunchWarCore";
import { v3, Vec3 } from "cc";
import { MeleeBehavior_Chr_BreakPunch } from "../AtkBehavior/MeleeBehavior_Chr_BreakPunch";

export default class Weapon_Chr_BreakPunch extends WeaponBasic {
    protected behavior: string = "MeleeBehavior_Chr_BreakPunch";
    public behaviorCtx: MeleeBehavior_Chr_BreakPunch;
    protected weaponVec: Vec3[] = [v3(-20, 0, 0), v3(20, 0, 0)];
    protected showCdTxt: boolean = false;
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
    //     // this.base_dmg = bulletRealTimeAttr.base_dmg;
    //     // this.dmg = bulletRealTimeAttr.dmg;

    //     // this.correctPanel();
    // }
}
