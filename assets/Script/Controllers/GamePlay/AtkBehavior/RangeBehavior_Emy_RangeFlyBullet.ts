import { _decorator, Vec3 } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import { BehaviorBase_Emy } from './BehaviorBase_Emy';
import BulletManager from '../../../CManager/BulletManager';
import { EmyBasic1 } from '../EMY/EmyBasic1';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-敌人远程飞弹
 */
@ccclass('RangeBehavior_Emy_RangeFlyBullet')
export class RangeBehavior_Emy_RangeFlyBullet extends BehaviorBase_Emy {
    protected attackStage: EMYInfo.ATTACK_STAGE = EMYInfo.ATTACK_STAGE.NONE;

    start(): void {
        this.weaponRef.enemyRef.registerAnimationEvent("beforeAttack", this.beforeAttackPlayoff, this);
        this.weaponRef.enemyRef.registerAnimationEvent("playoff", this.animationPlayoff, this);
    }

    public runBehavior(deltaTime: number) {
        if (this.isAttacking) {
            return;
        }

        if (this.calcCd(deltaTime) && this.isInAttackRange()) {
            this.isAttacking = true;
            // this.execAttack(deltaTime);
            this.attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
            this.weaponRef.enemyRef.playBodyAnimation("Emy_Witch_attack");
        }
    }

    private beforeAttackPlayoff() {
        this.attackStage = EMYInfo.ATTACK_STAGE.ATTKING;
        this.execAttack(0);
    }
    private animationPlayoff() {
        this.finishAttack();
    }

    execAttack(deltaTime: number) {
        let enemyRef: EmyBasic1 = this.weaponRef.enemyRef;
        let angle: number = enemyRef.getToCHRAngle();
        let vector: Vec3 = getVectorByAngle(angle);
        BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: enemyRef.node.position, vector });
        this.attackStage = EMYInfo.ATTACK_STAGE.AFTER_ATTACK;
    }
}
