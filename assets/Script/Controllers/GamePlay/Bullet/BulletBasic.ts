import { _decorator, BoxCollider2D, Component, Contact2DType, Game, Node, Sprite, v3, Vec3 } from 'cc';
// import { BulletAttr, BulletInitParams } from '../../Interface';
import OBT_Component from '../../../OBT_Component';
import { BulletInfo, GameCollider, WeaponInfo } from '../../../Common/Namespace';
import { getDistance } from '../../../Common/utils';
import BulletManager, { CreateIBulletParams } from '../../../CManager/BulletManager';
import CombatManager, { HitInfo } from '../../../CManager/CombatManager';
const { ccclass, property } = _decorator;

export interface InitIBulletPrams extends CreateIBulletParams {
    bulletAttr: BulletInfo.IBulletAttr;
}

/**
 * 通用的子弹脚本
 * 说是子弹, 实际上是能造成伤害的碰撞体
 */
@ccclass('BulletBasic')
export class BulletBasic extends OBT_Component {
    protected isInit: boolean = false;
    protected isAlive: boolean = false;

    protected collider: BoxCollider2D;

    protected attr: BulletInfo.IBulletAttr = null;
    public realTimeProps: WeaponInfo.WeaponRealTimeProps = null;
    public vector: Vec3 = null;

    protected isSleep: boolean;

    // 起点位置（相对）
    protected startRlt: Vec3 = null;

    start() {
    }

    public init({ bulletAttr, weaponRealTimeProps, position, vector }: InitIBulletPrams) {
        this.collider = this.node.getComponent(BoxCollider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
        this.collider.on(Contact2DType.END_CONTACT, this._onEndContact, this);

        this.node.setPosition(position);
        this.attr = bulletAttr;
        this.realTimeProps = weaponRealTimeProps;
        this.vector = vector;
        // 旋转子弹
        if (vector) {
            let vX: number = vector.x;
            let vY: number = vector.y;
            let angle = Number((Math.atan(vY / vX) * (180 / Math.PI)).toFixed(2));
            let scaleX = 1;
            if (vX < 0) {
                scaleX = -1;
            }
            let sfNode: Node = this.node.getChildByName("SF");
            sfNode.angle = angle;
            sfNode.setScale(v3(scaleX, 1));
        }
        // 子弹运动
        // this.isInit = true;
        this.isAlive = true;
        // 初始位置
        let { x, y } = this.node.position;
        this.startRlt = new Vec3(x, y);
        // this.isSleep = isSleep;
    }

    public onHit(damageInfo?: HitInfo) {}

    protected die() {
        this.isAlive = false;

        this.collider.off(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
        this.collider.off(Contact2DType.END_CONTACT, this._onEndContact, this);
        this.collider = null;

        BulletManager.instance.recoverBullet(this.attr.code, this.node);
    }

    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.CORE_DOMAIN) {
            return;
        }
        this.onBeginContact(selfCollider, otherCollider);
    }

    protected onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        CombatManager.instance.onBulletHit(selfCollider, otherCollider);
        // switch (otherCollider.group) {
        //     case GameCollider.GROUP.ENEMY: {

        //     } break;
        //     case GameCollider.GROUP.CHR: {

        //     } break;
        // }

        // if (otherCollider.group === GameCollider.GROUP.ENEMY) {
        //     // if (otherCollider.node.OBT_param2 && this.ignoreList.indexOf(otherCollider.node.OBT_param2.id) !== -1) {
        //     //     console.log(`bullet触发忽略`);
        //     //     return;
        //     // }
        //     if (this.attr.type === "EMY_bullet") {
        //         return;
        //     }
        //     if (typeof this.attr.penetrate !== 'number') {
        //         BulletManager.instance.particleCtrl.createDieParticle(this.node.position, this.vector, this.attr.speed, 2);
        //         this._die();
        //     } else {
        //         if (this.attr.penetrate <= 0) {
        //             BulletManager.instance.particleCtrl.createDieParticle(this.node.position, this.vector, this.attr.speed, 2);
        //             this._die();
        //         } else {
        //             // 由于节点堆叠顺序导致碰撞的回调触发顺序不同, 会先触发bullet的onBeginContact方法再触发emy的onBeginContact方法
        //             // setTimeout(() => {
        //             //     this.attr.penetrate--;
        //             //     this.attr.is_penetrate = true;
        //             // })
        //             // 修改this.attr会修改OBT_param2上的属性
        //             // TODO: 如何做伤害衰减?
        //             // 拟定: 在bulletAttr上增加一个属性isReduce初始为false, 在穿透后置为true, 伤害计算根据这个来
        //         }
        //     }
        // }
        // if (otherCollider.group === GameCollider.GROUP.CHR) {
        //     if (this.attr.type !== "EMY_bullet") {
        //         return;
        //     }
        //     if (this.attr.penetrate <= 0) {
        //         this._die();
        //     } else {
        //         this.attr.penetrate--;
        //     }
        // }
    }

    private _onEndContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.CORE_DOMAIN) {
            return;
        }
        this.onEndContact(selfCollider, otherCollider);
    }

    protected onEndContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
    }

    // public awaken(vector?: Vec3) {
    //     if (vector) {
    //         this.vector = vector;
    //     }
    //     this.isSleep = false;
    // }

    protected runBehavior(dt: number) {}

    update(dt: number) {
        // if (!this.isInit || !this.isAlive) {
        //     return;
        // }
        if (!this.isAlive) {
            return;
        }
        this.runBehavior(dt);
    }
}
