import { _decorator, SpriteComponent, v3, Vec3, UITransform, Node } from 'cc';
import { EMYInfo, Point } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import { getVectorByAngle, transportWorldPosition } from '../../../Common/utils';
import BulletManager from '../../../CManager/BulletManager';
import { EMY_Base } from './EMY_Base';
import CHRManager from '../../../CManager/CHRManager';
import { Bullet } from '../Bullet/Bullet';
import ProcessManager from '../../../CManager/ProcessManager';
const { ccclass, property } = _decorator;

@ccclass('EMY_Elite02')
export class EMY_Elite02 extends EMY_Base {
    protected phase: number = 1;

    protected spNodePath: string[] = ["Body/Shell", "Body/Core"];

    private _bulletId: string = "EMY_Bullet021";

    private _bulletNodeList: Node[] = [];

    start() {
    }

    protected onLoad(): void {
    }

    protected initOther(): void {
        this.ininSpinBullet();
        this.updateHpBar();
    }

    protected ininSpinBullet() {
        this._bulletNodeList = [];
        let vec3Ary: Vec3[] = [v3(40, 40, 0), v3(-40, 40, 0), v3(-40, -40, 0), v3(40, -40, 0)];

        vec3Ary.forEach((vec3: Vec3) => {
            let bulletNode: Node = BulletManager.instance.createBulletByEnemy({
                bulletId: this._bulletId,
                position: vec3,
                vector: v3(1, 0, 0),
                enemyId: this.props.id,
                rootNode: this.view("Body/Shell"),
                sleep: true
            });
            this._bulletNodeList.push(bulletNode);
        })
    }

    protected updateHpBar() {
        let width: number = Math.floor(66 * this.props.hp / this.maxHp);
        this.view("Elite_HPBar/HPProg").getComponent(UITransform).width = width;
    }

    // 二阶段
    protected changePhase() {
        console.log('进入二阶段');
        this._breakShell()
        this.vector = null;
        this.phase = 2;
        this.currentMoveType = this.moveTypeList[this.phase - 1];
    }

    private _breakShell() {
        // this.aniComps[0].stop();
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

    private _chargeTime: number = 0.2;
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
             * 如果没有子弹环绕，装载子弹
             * 如果有子弹环绕
             *  远程攻击 向角色发射周边4个子弹
             */
            if (this.view("Body/Shell").children.length) {
                this._bulletNodeList.forEach((bulletNode: Node, index: number) => {
                    this._shootBullet(bulletNode, (index + 1) * 200);
                })
            } else {
                this.ininSpinBullet();
            }

            this._currentCharge = 0;
            this.cd = this.props.attack_cd;
            this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
        } else {
            // 前摇阶段
            this.attackStage = EMYInfo.ATTACK_STAGE.BEFORE_ATTACK;
        }
    }
    private _shootBullet(bulletNode: Node, delay: number) {
        let timer = setTimeout(() => {
            if (!ProcessManager.instance.isOnPlaying()) {
                clearTimeout(timer);
                return;
            }

            let position: Vec3 = transportWorldPosition(bulletNode.worldPosition);
            bulletNode.setParent(BulletManager.instance.bulletRootNode);
            bulletNode.setPosition(position);
            const chrLoc: Vec3 = CHRManager.instance.getCHRLoc();
            const curLoc: Vec3 = position;
            let vecX = chrLoc.x - curLoc.x;
            let vecY = chrLoc.y - curLoc.y;
            let angle = Number((Math.atan(vecY / vecX) * (180 / Math.PI)).toFixed(2));
            if (vecX < 0) {
                if (vecY > 0) {
                    angle += 180;
                } else {
                    angle -= 180;
                }
            }

            let vector = getVectorByAngle(angle);
            bulletNode.getComponent(Bullet).awaken(vector);
        }, delay)
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

