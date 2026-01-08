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
    // 最大距离
    private _maxDisPx: number = null;
    // private _curDisPx: number = 0;
    private _vector: Vec3 = null;

    private _piercing: number = 0;

    private _type: string = "";

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

    public init({ attr, vector, enemyId }: BulletInfo.BulletInitParams) {
        this._collider = this.node.getComponent(BoxCollider2D);
        this._collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);

        this._attr = attr;
        this._vector = vector;
        this._maxDisPx = attr.max_dis;
        this._piercing = attr.piercing;
        // 子弹运动
        this._init = true;
        this._alive = true;
        // 初始位置
        let { x, y } = this.node.position;
        this._startRlt = new Vec3(x, y);

        // 敌人发射的子弹
        if (attr.type === "EMY_bullet" && enemyId) {
            this.node.OBT_param1 = enemyId;
        }

        this.node.OBT_param2 = {
            vector
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
            if (this._attr.type === "EMY_bullet") {
                return;
            }
            this._piercing--;
            if (this._piercing <= 0) {
                BulletManager.instance.particleCtrl.createDieParticle(this.node.position, this._vector, this._attr.speed, 2);
                this._die();
            }
        }
        if (otherCollider.group === GameCollider.GROUP.CHR) {
            if (this._attr.type !== "EMY_bullet") {
                return;
            }
            this._piercing--;
            if (this._piercing <= 0) {
                this._die();
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
        if (getDistance(this._startRlt, newLoc) < this._maxDisPx) {
            this.node.setPosition(newLoc);
        } else {
            this._die();
        }
    }
}


