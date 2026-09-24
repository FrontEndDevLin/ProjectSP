import { _decorator, Tween, tween, Vec3, Node, BoxCollider2D, v3 } from 'cc';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle, transportWorldPosition } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
import { MeleeBehaviorBase_Chr } from './MeleeBehaviorBase_Chr';
import { Bullet_Emy_Body } from '../Bullet/Bullet_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * 近战攻击行为-棱拳
 */
@ccclass('MeleeBehavior_Chr_RhombusPunch')
export class MeleeBehavior_Chr_RhombusPunch extends MeleeBehaviorBase_Chr {
    public bulletNode: Node;
    public bulletNodeCtx: Bullet_Emy_Body;
    public bulletCollider: BoxCollider2D;
    protected bodyNode: Node;

    /**
     * 以150攻击范围, 1.2s冷却初始化各种时间值
     * chargeTime: 0.15
     * thrustTime: 0.167
     * holdTime: 0.1
     * delayTime: 0.0332
     * freeTime: 0.7498
     * 
     * 在攻击范围变大时, 以10%比例增加冷却时间
     * 例如250攻击范围, 冷却时间为1.2+1.2*0.1=1.32
     */

    protected chargeDistance = 6;
    protected thrustSpeed = 900;

    protected frameTime: number = 0.0167;
    protected thrustDistance: number;
    protected chargeTime: number;
    protected thrustTime: number;
    protected holdTime: number;
    protected delayTime: number;
    // 0.2 / (1 + (stat_attack_speed * 3))

    private _tween: Tween<Node> = null;

    protected onLoad(): void {
    }

    private initAnimationTime() {
        let defaultRange: number = 150;
        let currentRange: number = this.weaponRef.curInf.range;
        this.thrustDistance = currentRange;

        let defaultChargeTime: number = 0.15;
        let defaultHoldTime: number = 0.2;
        let defaultDelayTime: number = 0.0332;
        let thrustTime: number = currentRange / this.thrustSpeed;
        let totalAnimationTime: number = defaultChargeTime + thrustTime + defaultHoldTime + defaultDelayTime;

        let cd: number = this.weaponRef.curInf.cd;
        let freeTime: number = cd - totalAnimationTime;
        // console.log("freeTime: " + freeTime);
        if (freeTime >= this.frameTime) {
            this.chargeTime = defaultChargeTime;
            this.thrustTime = thrustTime;
            this.holdTime = defaultHoldTime;
            this.delayTime = defaultDelayTime;
        } else {
            /**
             * 攻速过快时, freeTime不足以满足攻击时间, 所以需要等比例调整各个动画的时间
             * TODO: 当thrustTime过小时, 会导致飞行速度太快而没有碰撞, 当过小时应将碰撞盒变大
             */
            let animationTime: number = cd - this.frameTime;
            this.chargeTime = animationTime * defaultChargeTime / totalAnimationTime;
            this.thrustTime = animationTime * thrustTime / totalAnimationTime;
            this.holdTime = animationTime * defaultHoldTime / totalAnimationTime;
            this.delayTime = animationTime * defaultDelayTime / totalAnimationTime;
            // console.log("chargeTime: " + this.chargeTime + ", thrustTime: " + this.thrustTime + ", holdTime: " + this.holdTime + ", delayTime: " + this.delayTime);
        }
    }

    public onInit() {
        if (!this.bulletNode) {
            this.bulletNode = BulletManager.instance.createIBullet({
                weaponRealTimeProps: this.weaponRef.curInf,
                position: v3(0, 0, 0),
                vector: null,
                rootNode: this.view("Body")
            });
            this.bulletNodeCtx = this.bulletNode.getComponent(Bullet_Emy_Body);
            this.bulletCollider = this.bulletNode.getComponent(BoxCollider2D);
            this.bodyNode = this.view("Body");
        }
        this.setColliderEnabled(false);
    }

    public setColliderEnabled(enabled: boolean) {
        this.bulletCollider.enabled = enabled;
    }

    execAttack(deltaTime: number, target: EMYInfo.RealTimeInfo) {
        if (!target) {
            return;
        }
        const curLoc: Vec3 = transportWorldPosition(this.node.worldPosition);
        if (!curLoc) {
            return;
        }
        let vecX = target.x - curLoc.x;
        let vecY = target.y - curLoc.y;
        let angle = Number((Math.atan(vecY / vecX) * (180 / Math.PI)).toFixed(2));
        if (vecX < 0) {
            angle -= 180;
        }
        let vector = getVectorByAngle(angle);

        this.initAnimationTime();

        const o = v3(0, 0, 0);
        const backPos = new Vec3(
            o.x - vector.x * this.chargeDistance,
            o.y - vector.y * this.chargeDistance,
            o.z - vector.z * this.chargeDistance,
        );
        const hitPos = new Vec3(
            o.x + vector.x * this.thrustDistance,
            o.y + vector.y * this.thrustDistance,
            o.z + vector.z * this.thrustDistance,
        );
        const backPos2 = new Vec3(
            o.x + vector.x * 20,
            o.y + vector.y * 20,
            o.z + vector.z * 20,
        );

        this._tween = tween(this.view("Body"))
            // 1. 向后蓄力：quadOut，起步快收尾慢，"绷住"的感觉
            .to(this.chargeTime, { position: backPos }, { easing: 'quadOut' })
            .call(() => {
                // console.log('蓄力完成');
                RealTimeEventManager.instance.onWarCoreAttack();
                this.setColliderEnabled(true);
            })
            // 2. 向前直刺：quadOut，瞬间窜出去，末端减速 t=0.1 时进度19%  30.4px/0.0167s
            .to(this.thrustTime, { position: hitPos }, {
                easing: 'quadOut',
                onStart: () => {
                    let loc: Vec3 = transportWorldPosition(this.view("Body").worldPosition);
                    RealTimeEventManager.instance.onRhombusPunchBeforeAttack({ speed: this.thrustDistance / this.thrustTime, distance: this.thrustDistance, loc, vector });
                },
                onComplete: () => {
                    let loc: Vec3 = transportWorldPosition(this.view("Body").worldPosition);
                    RealTimeEventManager.instance.onRhombusPunchAttack({ behaviorRef: this, loc, vector });
                }
            })
            // 命中停顿，让打击感成立
            .delay(this.holdTime)
            .call(() => {
                this.setColliderEnabled(false);
            })
            // 3. 收回原位：瞬移
            .to(0, { position: backPos2 })
            .delay(this.delayTime)
            .call(() => {
                this.view("Body").position = o.clone();
                this._tween = null;
                // console.log('收回')
            }).start();
        this.finishAttack();
    }
}
