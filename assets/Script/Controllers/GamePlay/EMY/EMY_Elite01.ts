import { _decorator, SpriteComponent, v3, Vec3, UITransform } from 'cc';
import { EMYInfo, Point } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import { getVectorByAngle } from '../../../Common/utils';
import BulletManager from '../../../CManager/BulletManager';
import { EMY_Base } from './EMY_Base';
const { ccclass, property } = _decorator;

@ccclass('EMY_Elite01')
export class EMY_Elite01 extends EMY_Base {
    protected phase: number = 1;

    protected spNodePath: string[] = ["Body/Shell", "Body/Core"];

    private _bulletId: string = "EMY_Bullet020";

    start() {
    }

    protected onLoad(): void {
    }

    protected initOther(): void {
        this.updateHpBar();
    }

    protected updateHpBar() {
        let width: number = Math.floor(86 * this.props.hp / this.maxHp);
        this.view("Elite_HPBar/HPProg").getComponent(UITransform).width = width;
    }

    // 二阶段
    protected changePhase() {
        // console.log('进入二阶段');
        this._breakShell();
        this.vector = null;
        this.phase = 2;
        this.currentMoveType = this.moveTypeList[this.phase - 1];
    }

    private _breakShell() {
        this.aniComps[0].play("Break");

        let curPosition: Vec3 = this.node.position;
        let shellBreakPoints: Vec3[] = [];

        let shellPoints: Point[] = <Point[]>this.props.broken_point[0];
        shellPoints.forEach((point: Point) => {
            let relPoint: Vec3 = v3(point[0], point[1], 0).add(curPosition);
            shellBreakPoints.push(relPoint);
        });

        EMYManager.instance.particleCtrl.createGroupDieParticle(shellBreakPoints, 2);
        // this.spNodes[0].active = false;
    }
    private _breakCore() {
        let curPosition: Vec3 = this.node.position;
        let coreBreakPoints: Vec3[] = [];

        let corePoints: Point[] = <Point[]>this.props.broken_point[1];
        corePoints.forEach((point: Point) => {
            let relPoint: Vec3 = v3(point[0], point[1], 0).add(curPosition);
            coreBreakPoints.push(relPoint);
        });

        EMYManager.instance.particleCtrl.createGroupDieParticle(coreBreakPoints, 3);
    }

    protected onHpReduce(): void {
        if (this.phase === 1 && this.props.hp <= this.maxHp / 2) {
            this.changePhase();
        }
        this.updateHpBar();
    }

    protected flashSprite(): void {
        let spComp: SpriteComponent = this.spComps[this.phase - 1];
        spComp.color = this.FLASH_COLOR;
    }
    protected offFlashSprite(): void {
        let spComp: SpriteComponent = this.spComps[this.phase - 1];
        spComp.color = this.NORMAL_COLOR;
    }

    protected onDie(): void {
        this.view("Elite_HPBar").active = false;
        this._breakCore();
    }

    private _chargeTime: number = 1;
    private _currentCharge: number = 0;

    protected trySpecitalAttack(dt: number): void {
        if (this.phase === 1) {
            return;
        }
        if (this.cd <= 0) {
            this._remoteAttack(dt);
        } else {
            this.cd -= dt;
        }
    }

    private _remoteAttack(dt: number) {
        this._currentCharge += dt;
        if (this._currentCharge >= this._chargeTime) {
            /**
             * 远程攻击 向角色和角色夹角30度的位置发射3枚子弹
             */
            let angle: number = this.getToCHRAngle();
            const angleList: number[] = [angle - 20, angle, angle + 20];
            angleList.forEach((ang: number) => {
                let vector = getVectorByAngle(ang);
                BulletManager.instance.createBullet({ bulletId: this._bulletId, position: this.node.position, vector, enemyId: this.props.id });
            });

            this._currentCharge = 0;
            this.cd = this.props.attack_cd;
            this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
        } else {
            // 前摇阶段
            this.attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
        }
    }
    // 是否处于攻击前摇
    // private _isCharging() {
    //     return this.cd <= 0 && this._currentCharge < this._chargeTime;
    // }

    protected isCanMove(): boolean {
        let isCanMove = true;
        if (this.phase === 2) {
            isCanMove = this.attackStage === EMYInfo.ATTACK_STAGE.NONE;
        }

        return isCanMove;
    }
}

