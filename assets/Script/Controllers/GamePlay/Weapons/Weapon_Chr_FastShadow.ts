/**
 * 残影武器
 */
import WeaponBasic from "./WeaponBasic";
import Item_WarCore_RhombusPunch from "../Items/WarCore/Item_WarCore_RhombusPunchWarCore";
import { v3, Vec3 } from "cc";
import { RangeBehavior_Chr_FastShadow } from "../AtkBehavior/RangeBehavior_Chr_FastShadow";

export default class Weapon_Chr_FastShadow extends WeaponBasic {
    protected showCdTxt: boolean = false;
    protected behavior: string = "RangeBehavior_Chr_FastShadow";
    public behaviorCtx: RangeBehavior_Chr_FastShadow;
    // protected prefabName: string = "RhombusPunch";

    // protected weaponVec: Vec3[] = [v3(-20, 0, 0), v3(20, 0, 0)];
}
