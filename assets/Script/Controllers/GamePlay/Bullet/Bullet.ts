import { _decorator, BoxCollider2D, Component, Contact2DType, Game, Node, Sprite, v3, Vec3 } from 'cc';
// import { BulletAttr, BulletInitParams } from '../../Interface';
import OBT_Component from '../../../OBT_Component';
import { BulletInfo, GameCollider } from '../../../Common/Namespace';
import { getDistance } from '../../../Common/utils';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 通用的子弹脚本
 */
@ccclass('Bullet')
export class Bullet extends OBT_Component {
    private _init: boolean = false;
    private _alive: boolean = false;

    private _collider: BoxCollider2D;

    private _attr: BulletInfo.BulletAttr = null;
    // private _curDisPx: number = 0;
    private _vector: Vec3 = null;

    private _type: string = "";

    protected ignoreList: string[] = [];

    // 起点位置（相对）
    private _startRlt: Vec3 = null;

    protected onLoad(): void {
        // super.onLoad();

        // let collider: BoxCollider2D = this.node.getComponent(BoxCollider2D);
        // collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);

        // const initParams: BulletInfo.BulletInitParams = this.node.OBT_param1;
        // this._initAttr(initParams);
    }

    start() {
    }

    public init({ attr, vector, enemyId, ignoreList = [], groupId }: BulletInfo.BulletInitParams) {
        this._collider = this.node.getComponent(BoxCollider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);

        this._attr = attr;
        this._vector = vector;
        // 子弹运动
        this._init = true;
        this._alive = true;
        // 初始位置
        let { x, y } = this.node.position;
        this._startRlt = new Vec3(x, y);

        // 敌人发射的子弹
        if (attr.type === "EMY_bullet" && enemyId) {
            this.node.OBT_param1 = enemyId;
        } else if (attr.type === "bullet") {
            // 友方子弹
            this.ignoreList = ignoreList;
        }

        if (this.node.OBT_param2) {
            Object.assign(this.node.OBT_param2, {
                vector,
                ignoreList: this.ignoreList,
                groupId
            })
        } else {
            this.node.OBT_param2 = {
                vector,
                ignoreList: this.ignoreList,
                groupId
            }
        }
    }

    private _die() {
        this._alive = false;

        this._collider.off(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
        this._collider = null;

        BulletManager.instance.recoverBullet(this._attr.id, this.node);
    }

    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            if (otherCollider.node.OBT_param2 && this.ignoreList.indexOf(otherCollider.node.OBT_param2.id) !== -1) {
                console.log(`bullet触发忽略`);
                return;
            }
            if (this._attr.type === "EMY_bullet") {
                return;
            }
            if (typeof this._attr.penetrate !== 'number') {
                BulletManager.instance.particleCtrl.createDieParticle(this.node.position, this._vector, this._attr.speed, 2);
                this._die();
            } else {
                if (this._attr.penetrate <= 0) {
                    BulletManager.instance.particleCtrl.createDieParticle(this.node.position, this._vector, this._attr.speed, 2);
                    this._die();
                } else {
                    this._attr.penetrate--;
                    this._attr.is_penetrate = true;
                    // 修改this._attr会修改OBT_param2上的属性
                    // TODO: 如何做伤害衰减?
                    // 拟定: 在bulletAttr上增加一个属性isReduce初始为false, 在穿透后置为true, 伤害计算根据这个来
                }
            }
        }
        if (otherCollider.group === GameCollider.GROUP.CHR) {
            if (this._attr.type !== "EMY_bullet") {
                return;
            }
            if (this._attr.penetrate <= 0) {
                this._die();
            } else {
                this._attr.penetrate--;
            }
        }
    }

    update(dt: number) {
        if (!this._init || !this._alive) {
            return;
        }
        let ax = dt * this._attr.speed * this._vector.x;
        let ay = dt * this._attr.speed * this._vector.y;
        let { x, y } = this.node.position;
        let newLoc = v3(x + ax, y + ay);
        // 如果两点之间距离超过_maxDisPx，销毁
        if (getDistance(this._startRlt, newLoc) < this._attr.max_dis) {
            this.node.setPosition(newLoc);
        } else {
            this._die();
        }
    }
}


