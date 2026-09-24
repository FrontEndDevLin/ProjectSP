import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
import { EmyEffect_Marauder } from '../Effect/Emy/EmyEffect_Marauder';
import WeaponEmy from '../Weapons/WeaponEmy';
import Weapon_Emy_Body from '../Weapons/Weapon_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * "掠夺者"敌人, 会朝目标冲刺
 * 
 * 普通时候跟随目标
 * 发动冲刺时, 移动行为改为冲刺, 武器改为对应的冲刺武器
 * 
 * 实现一件武器 Weapon_Emy_DashAtk
 * 武器有range属性, 当武器属于敌人阵营时, 角色进入range范围时发动冲刺攻击
 * 冷却由cd属性控制
 * 攻击流程为
 * 1. 前摇, 旋转自身 + 原地呆滞0.1s
 * 2. 攻击, 朝前摇阶段锁定的位置发起冲锋
 * 3. 后摇, 原地呆滞0.1s
 * 
 * dash
 * 
 * 程序拆解
 * 1. 播放旋转动画, 0.1s后修改Body武器的伤害为当前武器的伤害, 切换移动行为为冲刺
 * 2. 无
 * 3. 还原Body武器的伤害, 0.1s后切换移动行为为普通移动
 */
@ccclass('Emy_Marauder')
export class Emy_Marauder extends EmyBasic1 {
    public isFaceToTarget: boolean = true;
    // 跟随
    protected moveBehavior1: string = "FollowAndDash";

    protected weapon1: string = "Weapon_Emy_Marauder";
    protected weapon1Ctx: Weapon_Emy_Body;

    // public playSpinAnimation() {
    //     this.stopMove();
    //     this.effect.playSpinAnimation();
    // }

    // 攻击前摇动画播放完成
    // public spinAnimationPlayoff() {
    //     this.weapon2Ctx.behaviorCtx.spinAnimationPlayoff();
    // }
}

