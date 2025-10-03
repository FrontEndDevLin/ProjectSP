import { _decorator, UIOpacity, v3, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { getRandomNumber, getRandomVector } from '../../../Common/utils';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

@ccclass('BulletParticle')
export class BulletParticle extends OBT_Component {
    private _active: boolean = false;
    private _opacity: number = 0;
    // 移动的向量，随机生成
    private _vector: Vec3;
    private _speed: number;

    protected onLoad(): void {
    }

    start() {
    }

    public init({ vector, speed }: { vector: Vec3, speed: number }) {
        this._active = true;
        // 随机一个透明度，匀速递减。在有透明度时，做直线运动，透明度归零时销毁
        this._opacity = getRandomNumber(160, 240);
        this.node.getComponent(UIOpacity).opacity = getRandomNumber(160, 240);

        this._vector = vector;
        this._speed = speed;
    }
    public reuse() {
    }
    public unuse() {
    }

    /**
     * 移动动画
     */
    private _move(dt: number) {
        let speed = dt * this._speed;
        let nodeLoc = this.node.position;
        let newPos: Vec3 = nodeLoc.add(new Vec3(this._vector.x * speed, this._vector.y * speed));
        this.node.setPosition(newPos);
    }

    /**
     * 透明度动画
     */
    private _fade(dt: number) {
        // 朝血条下方回收图标位置位移，直到小于2px，销毁
        if (this._opacity <= 0) {
            this._active = false;
            this._removeNode();
            return;
        }
        
        this._opacity -= dt * 800;
        this.node.getComponent(UIOpacity).opacity = this._opacity;
    }

    private _removeNode() {
        BulletManager.instance.particleCtrl.recoverParticle(this.node);
    }

    update(dt: number) {
        if (!this._active) {
            return;
        }
        this._move(dt);
        this._fade(dt);
    }
}


