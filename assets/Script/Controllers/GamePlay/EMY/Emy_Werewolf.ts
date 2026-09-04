import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
import { EmyEffect_Marauder } from '../Effect/Emy/EmyEffect_Marauder';
import WeaponEmy from '../Weapons/WeaponEmy';
import Weapon_Emy_Body from '../Weapons/Weapon_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * "狼人"敌人, 会朝目标冲刺
 * 
 * 实现移动行为，内置已实现的行为模块，在行为模块中实现冲刺移动
 */
@ccclass('Emy_Werewolf')
export class Emy_Werewolf extends EmyBasic1 {
    public isFaceToTarget: boolean = true;
    // 环绕冲刺
    protected moveBehavior1: string = "SurroundAndDash";

    protected weapon1: string = "Weapon_Emy_Werewolf";

    // public playSpinAnimation() {
    //     this.stopMove();
    //     this.effect.playSpinAnimation();
    // }

    // 攻击前摇动画播放完成
    // public spinAnimationPlayoff() {
    //     this.weapon2Ctx.behaviorCtx.spinAnimationPlayoff();
    // }
}

