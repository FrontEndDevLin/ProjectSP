/**
 * 自由无人机武器
 */
import WeaponBasic, { WeaponVecMap } from "./WeaponBasic";
import Item_WarCore_RhombusPunch from "../Items/WarCore/Item_WarCore_RhombusPunchWarCore";
import { v3, Vec3 } from "cc";
import { MeleeBehavior_Chr_BreakPunch } from "../AtkBehavior/MeleeBehavior_Chr_BreakPunch";

export default class Weapon_Chr_FreeDrone extends WeaponBasic {
    protected behavior: string = "RangeBehavior_Chr_FreeDrone";
    // public behaviorCtx: MeleeBehavior_Chr_BreakPunch;
}
