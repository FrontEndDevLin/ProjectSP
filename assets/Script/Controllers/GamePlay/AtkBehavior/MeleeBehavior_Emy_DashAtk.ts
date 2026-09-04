import { _decorator, Vec3 } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import { BehaviorBase_Emy } from './BehaviorBase_Emy';
import BulletManager from '../../../CManager/BulletManager';
import { EmyBasic1 } from '../EMY/EmyBasic1';
import WeaponEmy from '../Weapons/WeaponEmy';
import Weapon_Emy_DashAtk from '../Weapons/Weapon_Emy_DashAtk';
const { ccclass, property } = _decorator;

/**
 * 近战攻击行为-敌人冲刺
 * 
 * 1. 原地呆滞0.2s, 修改Body武器的伤害为当前武器的伤害, 切换移动行为为冲刺
 * 2. 冲刺1s
 * 3. 后摇, 原地呆滞0.2s
 */
@ccclass('MeleeBehavior_Emy_DashAtk')
export class MeleeBehavior_Emy_DashAtk extends BehaviorBase_Emy {
    protected attackStage: EMYInfo.ATTACK_STAGE = EMYInfo.ATTACK_STAGE.NONE;
    private sprintTime: number = 1;
    private sprintTimeCount: number = 0;
    private chargeTime: number = 0.2;
    private chargeTimeCount: number = 0;

    protected currentVector: Vec3;

    protected weaponRef: Weapon_Emy_DashAtk;

    start(): void {
        this.weaponRef.enemyRef.registerAnimationEvent("beforeAttack", this.spinAnimationPlayoff, this);
    }

    public runBehavior(deltaTime: number) {
        if (this.isAttacking) {
            if (this.attackStage === EMYInfo.ATTACK_STAGE.BEFORE_ATTACK) {
                return;
            }
            if (this.attackStage === EMYInfo.ATTACK_STAGE.ENERGY_CHARGE) {
                // 原地呆滞0.2s
                this.chargeTimeCount += deltaTime;
                if (this.chargeTimeCount >= this.chargeTime) {
                    // TODO: 临时修改敌人的伤害，这里没有将武器伤害应用到敌人碰撞体上
                    this.attackStage = EMYInfo.ATTACK_STAGE.ATTKING;
                }
            }
            if (this.attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
                // 冲刺1s
                this.sprintTimeCount += deltaTime;
                if (this.sprintTimeCount >= this.sprintTime) {
                    this.sprintTimeCount = 0;
                    this.chargeTimeCount = 0;
                    this.attackStage = EMYInfo.ATTACK_STAGE.AFTER_ATTACK;
                } else {
                    this.execAttack(deltaTime);
                }
            }
            if (this.attackStage === EMYInfo.ATTACK_STAGE.AFTER_ATTACK) {
                // 攻击结束, 原地呆滞0.2s
                this.chargeTimeCount += deltaTime;
                if (this.chargeTimeCount >= this.chargeTime) {
                    this.chargeTimeCount = 0;
                    this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
                    this.weaponRef.enemyRef.startMove();
                    this.finishAttack();
                }
            }
            return;
        }

        if (this.calcCd(deltaTime) && this.weaponRef.enemyRef.dis <= this.weaponRef.curInf.range) {
            this.isAttacking = true;
            this.currentVector = this.weaponRef.enemyRef.vector;
            this.weaponRef.enemyRef.stopMove();
            this.weaponRef.enemyRef.playBodyAnimation("Emy_Marauder_Spin");
            this.attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
        }
    }
    public spinAnimationPlayoff() {
        this.attackStage = EMYInfo.ATTACK_STAGE.ENERGY_CHARGE;
    }

    execAttack(deltaTime: number) {
        // 强制单位冲刺移动, 这里为了保证单一职责, 不改变单位的移动行为
        if (this.currentVector) {
            // 移动时头始终朝向角色
            let speed = deltaTime * (this.weaponRef.enemyRef.props.spd + 200);
            let newPos: Vec3 = this.weaponRef.enemyRef.node.position.add(new Vec3(this.currentVector.x * speed, this.currentVector.y * speed));
            this.weaponRef.enemyRef.node.setPosition(newPos);
        }
    }
}
