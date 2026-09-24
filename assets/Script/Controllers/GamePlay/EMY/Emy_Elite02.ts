import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
import { EmyElite } from './EmyElite';
import { EmyEffect_Elite01 } from '../Effect/Emy/EmyEffect_Elite01';
import Weapon_Emy_SurroundBullet from '../Weapons/Weapon_Emy_SurroundBullet';
const { ccclass, property } = _decorator;

/**
 * 精英敌人2
 * 武器1: 生成多个子弹并环绕自身，进入二阶段时直接飞向目标。
 * 武器2: 生成多个子弹，按顺序飞向目标。
 */
@ccclass('Emy_Elite02')
export class Emy_Elite02 extends EmyElite {
    // 跟随
    protected moveBehavior1: string = "Follow";
    protected moveBehavior2: string = "Surround";

    protected weapon1: string = "Weapon_Emy_Elite02";
    protected weapon2: string = "Weapon_Emy_SurroundBullet";
    protected weapon2Ctx: Weapon_Emy_SurroundBullet;

    protected effectName: string = "EmyEffect_Elite02";
    // protected effect: EmyEffect_Elite01;

    protected showHpBar: boolean = true;

    protected onInit(): void {
        super.onInit();
        // this.weapon2Ctx.enabled = false;
    }

    protected changePhase() {
        // this.effect.breakShell();
        this.setCurrentMoveBehavior(this.moveBehavior2);
        // this.weapon2Ctx.behaviorCtx.changePhase();
        // this.weapon2Ctx.enabled = true;
    }

    protected onDie(): void {
        super.onDie();
        // this.effect.breakCore();
    }
}

