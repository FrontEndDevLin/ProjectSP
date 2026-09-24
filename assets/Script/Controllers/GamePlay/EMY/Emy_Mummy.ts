import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
import { EmyEffect_Mummy } from '../Effect/Emy/EmyEffect_Mummy';
import { EmyElite } from './EmyElite';
const { ccclass, property } = _decorator;

/**
 * 木乃伊
 */

@ccclass('Emy_Mummy')
export class Emy_Mummy extends EmyElite {
    // protected showHpBar: boolean = true;
    // 转换2阶段的血量阈值
    protected phaseHpLine1: number = 0.4;

    // 跟随
    protected moveBehavior1: string = "Follow";
    protected weapon1: string = "Weapon_Emy_Mummy";

    protected effectName: string = "EmyEffect_Mummy";
    protected effect: EmyEffect_Mummy;

    // protected onInit(): void {
    // }

    protected changePhase(): void {
        this.effect.playBodyAnimation("Emy_Mummy_changeParse");
        this.setBuff("dmg_reduce_rate", 0.5);
    }

    protected onDie(): void {
        this.effect.reset();
        super.onDie();
    }
}

