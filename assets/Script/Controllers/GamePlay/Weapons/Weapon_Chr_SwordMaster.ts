/**
 * 御剑武器
 */
import WeaponBasic from "./WeaponBasic";
import Item_WarCore_RhombusPunch from "../Items/WarCore/Item_WarCore_RhombusPunchWarCore";
import { v3, Vec3 } from "cc";
import { MeleeBehavior_Chr_BreakPunch } from "../AtkBehavior/MeleeBehavior_Chr_BreakPunch";

export default class Weapon_Chr_SwordMaster extends WeaponBasic {
    protected prefabName: string = "Sword";

    protected behavior: string = "MeleeBehavior_Chr_SwordMaster";
    // public behaviorCtx: MeleeBehavior_Chr_BreakPunch;
}
