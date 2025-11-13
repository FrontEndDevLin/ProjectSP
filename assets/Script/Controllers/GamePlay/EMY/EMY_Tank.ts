import { _decorator, BoxCollider2D, Color, Contact2DType, Node, Sprite, SpriteComponent, v3, Vec3, Animation, UITransform } from 'cc';
import { DamageInfo, EMYInfo, FLASH_TIME, GameCollider } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import { copyObject, getAngleByVector, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import DropItemManager from '../../../CManager/DropItemManager';
import DamageManager from '../../../CManager/DamageManager';
import { EMY_Base } from './EMY_Base';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 肉怪 EMY06使用
 */
@ccclass('EMY_Tank')
export class EMY_Tank extends EMY_Base {
    protected phase: number = 1;

    protected spNodePath: string[] = ["Body/PIC", "Body/Bone/bone1", "Body/Bone/bone2"];

    protected initOther(): void {
        let bone1UITransform: UITransform = this.spNodes[1].getComponent(UITransform);
        let bone2UITransform: UITransform = this.spNodes[2].getComponent(UITransform);
        const W: number = 8;
        if (bone1UITransform.width !== W) {
            bone1UITransform.width = W;
        }
        if (bone2UITransform.width !== W) {
            bone2UITransform.width = W;
        }
        this.dmgReduceRate = 0;
        this.phase = 1;
    }

    protected onHpReduce(): void {
        // 血量低于60%变身
        if (this.phase === 1 && this.props.hp <= this.maxHp * 0.6) {
            this.changePhase();
        }
    }

    protected changePhase() {
        // console.log('进入二阶段');
        this.phase = 2;
        // 获得40%减伤
        this.dmgReduceRate = 0.4;
        this.node.getComponent(Animation).play("EMY06_change_parse");
    }

    // 攻击前摇播放完成
    // public beforeAttackAnimationPlayoff() {
    //     this._finishBeforeAttack();
    // }

    private _finishBeforeAttack() {
        if (this.alive && ProcessManager.instance.isOnPlaying()) {
            this.attackStage = EMYInfo.ATTACK_STAGE.ATTKING;
        }
    }

    protected trySpecitalAttack(dt: number): void {
        // if (this.cd <= 0) {
        //     if (!this.dis) {
        //         return;
        //     }
        //     if (this.props.attack_range >= this.dis || this.attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
        //         this._specialAttack(dt);
        //     }
        // } else {
        //     this.cd -= dt;
        // }
    }

    /**
     * 进入攻击范围后，朝角色方向发射子弹
     */
    private _specialAttack(dt: number) {
        // if (this.attackStage === EMYInfo.ATTACK_STAGE.NONE) {
        //     this.attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
        //     this.node.getComponent(Animation).play("EMY_range_attack");
        // }
        // if (this.attackStage === EMYInfo.ATTACK_STAGE.ATTKING) {
        //     this._remoteAttack();
        // }
    }

    private _remoteAttack() {
        // let angle: number = this.getToCHRAngle();
        // let vector: Vec3 = getVectorByAngle(angle);
        // BulletManager.instance.createBullet(this._bulletId, this.node.position, vector, this.props.id);

        // this.cd = this.props.attack_cd;
        // this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
    }
}
