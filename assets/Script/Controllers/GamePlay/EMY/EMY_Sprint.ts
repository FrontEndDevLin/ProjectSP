import { _decorator, Vec3, Animation } from 'cc';
import { EMYInfo } from '../../../Common/Namespace';
import ProcessManager from '../../../CManager/ProcessManager';
import { EMY_Base } from './EMY_Base';
const { ccclass, property } = _decorator;

@ccclass('EMY_Sprint')
export class EMY_Sprint extends EMY_Base {
    protected isFaceToTarget: boolean = true;

    private _sprintTime: number = 1;

    // 攻击前摇播放完成
    public beforeAttackAnimationPlayoff() {
        this._finishBeforeAttack();
    }

    protected trySpecitalAttack(dt: number): void {
        if (this.cd <= 0) {
            if (!this.dis) {
                return;
            }
            if (this.props.attack_range >= this.dis || this.attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
                this._specialAttack(dt);
            }
        } else {
            this.cd -= dt;
        }
    }

    // 冲锋怪, 攻击过程中不走普通移动流程
    protected isCanMove(): boolean {
        return !this.isAttacking();
    }

    /**
     * 进入攻击范围后，朝角色冲刺攻击
     * 前摇，旋转自身 + 原地呆滞0.1s
     * 攻击, 朝前摇阶段锁定的位置发起冲锋
     */
    private _specialAttack(dt: number) {
        if (this.attackStage === EMYInfo.ATTACK_STAGE.NONE) {
            this.attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
            this.node.getComponent(Animation).play("EMY_sprint_before_attack");
        }
        if (this.attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
            this._sprint(dt);
        }
    }
    // 攻击前摇
    private _finishBeforeAttack() {
        this.scheduleOnce(() => {
            if (this.alive && ProcessManager.instance.isOnPlaying()) {
                this.attackStage = EMYInfo.ATTACK_STAGE.ATTKING;
            }
        }, 0.2)
    }

    // 冲刺攻击中
    private _sprint(dt: number) {
        let speed = dt * 300;
        let newPos: Vec3 = this.node.position.add(new Vec3(this.vector.x * speed, this.vector.y * speed));
        this.node.setPosition(newPos);
        this._sprintTime -= dt;
        if (this._sprintTime <= 0) {
            this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
            this.cd = this.props.attack_cd;
            this._sprintTime = 1;
        }
    }
}

