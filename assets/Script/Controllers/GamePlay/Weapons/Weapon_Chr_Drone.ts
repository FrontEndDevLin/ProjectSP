/**
 * 无人机武器
 */
import WeaponBasic, { WeaponVecMap } from "./WeaponBasic";
import Item_WarCore_RhombusPunch from "../Items/WarCore/Item_WarCore_RhombusPunchWarCore";
import { v3, Vec3 } from "cc";
import { MeleeBehavior_Chr_BreakPunch } from "../AtkBehavior/MeleeBehavior_Chr_BreakPunch";

export default class Weapon_Chr_Drone extends WeaponBasic {
    protected prefabName: string = "Drone";

    protected behavior: string = "RangeBehavior_Chr_Drone";
    protected weaponVecMap: WeaponVecMap = {
        "1": [v3(0, 0, 0)],
        "2": [v3(-32, 0, 0), v3(32, 0, 0)],
        "3": [v3(0, 32, 0), v3(-32, -6, 0), v3(32, -6, 0)]
    };
    // public behaviorCtx: MeleeBehavior_Chr_BreakPunch;
}
