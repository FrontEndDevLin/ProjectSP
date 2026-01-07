import { _decorator, BoxCollider2D, CircleCollider2D, Component, Contact2DType, Node, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { EMYInfo, GameCollider, GamePlayEvent, WarCoreInfo  } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import CHRManager from '../../../CManager/CHRManager';
import BulletManager from '../../../CManager/BulletManager';
import { getFloatNumber, getRandomNumber, getVectorByAngle } from '../../../Common/utils';
import ProcessManager from '../../../CManager/ProcessManager';
import WarCoreManager from '../../../CManager/WarCoreManager';
import ItemWarCore from '../Items/ItemWarCore';
import OBT from '../../../OBT';
const { ccclass, property } = _decorator;

/**
 * 散射攻击核心
 */
@ccclass('ScatterAtkWarCore')
export class ScatterAtkWarCore extends OBT_Component {
    // 警戒碰撞盒
    // private _alertDomainCollider: CircleCollider2D = null;
    // 攻击碰撞盒
    private _attackDomainCollider: CircleCollider2D = null;
    // 警戒范围内的敌人
    private _highEnemyList: string[] = [];
    // 攻击范围内的队列，当该队列中有敌人时，优先从中选择，性能会有提升
    private _dangerEnemyList: string[] = [];

    private _cd: number = 0;

    protected warCore: ItemWarCore;

    // TODO: 作废
    private _mirrorAttack: boolean = true;
    // 新增, 在装备"左右开弓"时, 提升该属性的概率
    private _mirrorAttackRate: number = 0;

    start() {
        this.warCore = WarCoreManager.instance.warCore;
        this._initDomainCollider();
    }

    protected onLoad(): void {

    }

    private _initDomainCollider() {
        let colliders: CircleCollider2D[] = this.getComponents(CircleCollider2D);
        for (let collider of colliders) {
            switch (collider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    // this._alertDomainCollider = collider;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    this._attackDomainCollider = collider;
                } break;
            }
            collider.on(Contact2DType.BEGIN_CONTACT, this._onCHRDomainBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this._onCHRDomainEndContact, this);
        }
        // let { range, alert } = this.weaponPanel;
        let range: number = this.warCore.weaponCtx.range;
        this._attackDomainCollider.radius = range;
        // this._alertDomainCollider.radius = (range + 2) * PIXEL_UNIT;
    }

    private _onCHRDomainBeginContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    // 将敌人放入队列中，结束碰撞时将敌人移出
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    this._highEnemyList[nodeId] = 1;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    this._dangerEnemyList[nodeId] = 1;
                } break;
            }
        }
    }
    private _onCHRDomainEndContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    delete this._highEnemyList[nodeId];
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    delete this._dangerEnemyList[nodeId];
                } break;
            }
        }
    }
    // 每帧检查队列中对应节点距离角色的距离
    private _chooseTarget(callback: EMYInfo.ChooseTargetCallback) {
        // 优先判断攻击范围内的敌人
        if (Object.keys(this._dangerEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this._dangerEnemyList);
            callback(true, target);
            return;
        }
        // 攻击范围内无敌人，再判断警戒范围内的敌人
        if (Object.keys(this._highEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this._highEnemyList);
            callback(false, target);
            return;
        }
    }

    // 旋转武器(改变贴图朝向)
    // private _rotateWeapon() {
    //     // if (this._animateAttacking) {
    //     //     return;
    //     // }
    //     this._chooseTarget((isCanBeAttacked: boolean, target: EMYInfo.RealTimeInfo) => {
    //         if (!target) {
    //             return;
    //         }

    //         // 武器指向离得最近的目标
    //         let chrLoc: Vec3 = CHRManager.instance.getCHRLoc();
    //         // 将武器坐标转为地图坐标
    //         // let currentVec: Vec3 = v3(chrLoc.x + this.node.position.x, chrLoc.y + this.node.position.y);
    //         let currentVec: Vec3 = v3(chrLoc.x, chrLoc.y);
    //         let vecX = target.x - currentVec.x;
    //         let vecY = target.y - currentVec.y;

    //         let angle = Number((Math.atan(vecY / vecX) * 57.32).toFixed(2));
    //         let scaleX = 1;
    //         if (vecX < 0) {
    //             scaleX = -1;
    //         }

    //         this.view("Pic/Hole").angle = angle;
    //         this.view("Pic/Hole").setScale(v3(scaleX, 1));
    //     }); 
    // }

    private _tryAttack(dt: number) {
        if (this._cd <= 0) {
            this._attack(dt);
        } else {
            this._cd -= dt;
        }
    }
    private _attack(dt: number): void {
        this._chooseTarget((hasAtkTarget: boolean, target: EMYInfo.RealTimeInfo) => {
            if (!hasAtkTarget || !target) {
                return;
            }

            // 通知BulletManager发射子弹，带上当前坐标，向量
            const chrLoc: Vec3 = CHRManager.instance.getCHRLoc();
            if (!chrLoc) {
                return;
            }
            let vecX = target.x - chrLoc.x;
            let vecY = target.y - chrLoc.y;
            let angle = Number((Math.atan(vecY / vecX) * (180 / Math.PI)).toFixed(2));
            if (vecX < 0) {
                angle -= 180;
            }

            let angleList: number[] = [];
            let split: number = this.warCore.weaponCtx.split;
            let splitAngle: number = 15;
            let min = -Math.floor(split / 2);
            let max = min + split;
            for (let i = min; i < max; i++) {
                angleList.push(angle + splitAngle * i);
            }

            // 左右开弓概率攻击
            let mirrorAttackRate: number = WarCoreManager.instance.warCore.getProp("mirrorAttackRate");
            if (mirrorAttackRate && mirrorAttackRate > 0) {
                let mirrorAttackRateNum = mirrorAttackRate * 100;
                let mirrorAttack: boolean = false;
                if (mirrorAttackRateNum >= 100) {
                    mirrorAttack = true;
                } else {
                    let randomNum: number = getRandomNumber(1, 100);
                    if (randomNum <= mirrorAttackRateNum) {
                        mirrorAttack = true;
                    }
                }
                if (mirrorAttack) {
                    let mirrorAngleList = []
                    angleList.forEach((angle: number) => {
                        mirrorAngleList.push(angle + 180)
                    })
                    angleList = angleList.concat(mirrorAngleList);
                }
            }

            angleList.forEach((angle: number) => {
                let vector = getVectorByAngle(angle);
                BulletManager.instance.createBullet(this.warCore.weaponCtx.bullet, chrLoc, vector);
            });

            // console.log(Vec3.angle(v3(1,0,0), {x: vecX, y: vecY, z: 0}));
            // console.log(Number((Math.atan(vecY / vecX)).toFixed(2)));
            // 向量要根据贴图的旋转角度计算
            // this._attacking = true;

            // 冷却结合攻击速度修正
            this._cd = this.warCore.weaponCtx.cd;
        });
    }

    update(deltaTime: number) {
        if (!ProcessManager.instance.isOnPlaying()) {
            return;
        }
        this._tryAttack(deltaTime);
    }
}

