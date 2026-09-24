import { _decorator, v3, Vec3, Node } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle, transportWorldPosition } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import { BehaviorBase_Emy } from './BehaviorBase_Emy';
import BulletManager from '../../../CManager/BulletManager';
import { EmyBasic1 } from '../EMY/EmyBasic1';
import { BulletBasic } from '../Bullet/BulletBasic';
import WeaponEmy from '../Weapons/WeaponEmy';
import Weapon_Emy_SurroundBullet from '../Weapons/Weapon_Emy_SurroundBullet';
import ProcessManager from '../../../CManager/ProcessManager';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-精英敌人环绕飞弹
 */
@ccclass('RangeBehavior_Emy_SurroundBullet')
export class RangeBehavior_Emy_SurroundBullet extends BehaviorBase_Emy {
    private _chargeTime: number = 1;
    private _currentCharge: number = 0;
    private bulletNodeList: Node[] = [];
    protected attackStage: EMYInfo.ATTACK_STAGE = EMYInfo.ATTACK_STAGE.NONE;

    protected weaponRef: Weapon_Emy_SurroundBullet;

    public onInit(): void {
        this.ininSpinBullet();
    }
    protected ininSpinBullet() {
        this.bulletNodeList = [];
        let vec3Ary: Vec3[] = [v3(40, 40, 0), v3(-40, 40, 0), v3(-40, -40, 0), v3(40, -40, 0)];

        vec3Ary.forEach((vec3: Vec3) => {
            let vector: Vec3 = v3(1, 0, 0);
            let bulletNode: Node = BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: vec3, vector, rootNode: this.node });
            bulletNode.getComponent(BulletBasic).setSleep(true);
            this.bulletNodeList.push(bulletNode);
        })
    }

    private shootBullet(bulletNode: Node, delay: number) {
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
            let bullet: BulletBasic = bulletNode.getComponent(BulletBasic);
            bullet.vector = vector;
            bullet.setSleep(false);
        }, delay)
    }

    // public changePhase() {
    //     this.bulletNodeList.forEach((bulletNode: Node) => {
    //         bulletNode.getComponent(BulletBasic).setSleep(this.weaponRef.enemyRef.getPhase() === 1);
    //     })
    // }

    public runBehavior(deltaTime: number) {
        if (this.weaponRef.enemyRef.getPhase() === 1) {
            return;
        }

        if (this.isAttacking) {
            if (this.attackStage === EMYInfo.ATTACK_STAGE.ENERGY_CHARGE) {
                this._currentCharge += deltaTime;
                if (this._currentCharge >= this._chargeTime) {
                    this.execAttack(deltaTime);
                }
            }
            return;
        }

        if (this.calcCd(deltaTime)) {
            this.isAttacking = true;
            this.attackStage = EMYInfo.ATTACK_STAGE.ENERGY_CHARGE;
        }
    }

    /**
     * 如果没有子弹环绕，装载子弹
     * 如果有子弹环绕
     *  远程攻击 向角色发射周边4个子弹
     */
    execAttack(deltaTime: number) {
        if (this.node.children.length) {
            this.bulletNodeList.forEach((bulletNode: Node, index: number) => {
                this.shootBullet(bulletNode, (index + 1) * 200);
            })
        } else {
            this.ininSpinBullet();
        }

        this._currentCharge = 0;
        this.finishAttack();
        this.attackStage = EMYInfo.ATTACK_STAGE.NONE;
    }
}
