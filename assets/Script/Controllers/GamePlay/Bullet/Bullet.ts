import { _decorator, BoxCollider2D, Component, Contact2DType, Node, Sprite, v3, Vec3 } from 'cc';
// import { BulletAttr, BulletInitParams } from '../../Interface';
import OBT_Component from '../../../OBT_Component';
import { BulletInfo, GameCollider, PIXEL_UNIT } from '../../../Common/Namespace';
import { getDistance } from '../../../Common/utils';
const { ccclass, property } = _decorator;

interface BulletAttr {
    id: string,
    prefab: string,
    // 飞行速度，伤害、穿透数由武器决定？
    speed: number,
    // 最大飞行距离
    max_dis: number
}

/**
 * 通用的子弹脚本
 */
@ccclass('Bullet')
export class Bullet extends OBT_Component {
    private _init: boolean = false;
    private _isDie: boolean = false;

    private _attr: BulletAttr = null;
    // 最大距离
    private _maxDisPx: number = null;
    // private _curDisPx: number = 0;
    private _vector: Vec3 = null;

    private _piercing: number = 0;

    // 起点位置（相对）
    private _startRlt: Vec3 = null;

    protected onLoad(): void {
        // super.onLoad();

        let collider: BoxCollider2D = this.node.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);

        const initParams: BulletInfo.BulletInitParams = this.node.OBT_param1;
        this._initAttr(initParams);
    }

    start() {
    }

    private _initAttr({ attr, vector }: BulletInfo.BulletInitParams) {
        this._attr = attr;
        this._vector = vector;
        this._maxDisPx = attr.max_dis * PIXEL_UNIT;
        this._piercing = attr.piercing;
        // 子弹运动
        this._init = true;
        // 初始位置
        let { x, y } = this.node.position;
        this._startRlt = new Vec3(x, y);
    }

    private _die() {
        this._isDie = true;
        this.view("SF").active = false;
        this.node.destroy();
    }

    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            this._piercing--;
            if (this._piercing <= 0) {
                this._die();
            }
        }
    }

    update(dt: number) {
        if (!this._init || this._isDie) {
            return;
        }
        let ax = dt * this._attr.speed * this._vector.x * PIXEL_UNIT;
        let ay = dt * this._attr.speed * this._vector.y * PIXEL_UNIT;
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


