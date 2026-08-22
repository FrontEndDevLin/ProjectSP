import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
import { EmyElite } from './EmyElite';
import EmyEffect_Elite01 from '../Effect/Emy/EmyEffect_Elite01';
const { ccclass, property } = _decorator;

@ccclass('Emy_Elite01')
export class Emy_Elite01 extends EmyElite {
    // 跟随
    protected moveBehavior1: string = "Follow";
    protected moveBehavior2: string = "Surround";

    protected weapon1: string = "Weapon_Emy_Elite01";
    protected weapon2: string = "Weapon_Emy_TripleFlyBullet";

    protected effectName: string = "Emy_Effect_Elite01";
    protected effect: EmyEffect_Elite01;

    protected showHpBar: boolean = true;

    protected onInit(): void {
        super.onInit();
        this.weapon2Ctx.enabled = false;
    }

    protected changePhase() {
        this.effect.breakShell();
        this.setCurrentMoveBehavior(this.moveBehavior2);
        this.weapon2Ctx.enabled = true;
    }

    protected onDie(): void {
        super.onDie();
        this.effect.breakCore();
    }
}

