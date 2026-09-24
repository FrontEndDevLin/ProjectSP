/**
 * 敌人环绕飞弹武器
 */

import { RangeBehavior_Emy_SurroundBullet } from "../AtkBehavior/RangeBehavior_Emy_SurroundBullet";
import { EmyBasic1 } from "../EMY/EmyBasic1";
import { EmyElite } from "../EMY/EmyElite";
import WeaponEmy from "./WeaponEmy";

export default class Weapon_Emy_SurroundBullet extends WeaponEmy {
    public enemyRef: EmyElite;

    protected prefabName: string = "Surround";

    protected behavior: string = "RangeBehavior_Emy_SurroundBullet";
    public behaviorCtx: RangeBehavior_Emy_SurroundBullet;
    // // 行为组件
    // public behaviorCtx: MeleeBehavior_Emy_Body;

    // public onWeaponInit(): void {
    // }
    // public onWeaponRemove(): void {
    // }
}
