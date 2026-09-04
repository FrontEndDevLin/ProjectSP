/**
 * 敌人冲刺武器
 */

import { MeleeBehavior_Emy_DashAtk } from "../AtkBehavior/MeleeBehavior_Emy_DashAtk";
import { Emy_Marauder } from "../EMY/Emy_Marauder";
import { EmyBasic1 } from "../EMY/EmyBasic1";
import WeaponEmy from "./WeaponEmy";

export default class Weapon_Emy_DashAtk extends WeaponEmy {
    public enemyRef: Emy_Marauder;
    protected behavior: string = "MeleeBehavior_Emy_DashAtk";
    // 行为组件
    public behaviorCtx: MeleeBehavior_Emy_DashAtk;

    // public onWeaponInit(): void {
    // }
    // public onWeaponRemove(): void {
    // }
}
