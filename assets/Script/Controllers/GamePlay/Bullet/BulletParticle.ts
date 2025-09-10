import { _decorator, UIOpacity, Vec3 } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { getRandomNumber, getRandomVector } from '../../../Common/utils';
import { PIXEL_UNIT } from '../../../Common/Namespace';
const { ccclass, property } = _decorator;

@ccclass('BulletParticle')
export class BulletParticle extends OBT_Component {
    private _opacity: number = 0;
    // 移动的向量，随机生成
    private _vector: Vec3;

    protected onLoad(): void {
        // 随机一个透明度，匀速递减。在有透明度时，做直线运动，透明度归零时销毁
        this._opacity = getRandomNumber(160, 240);
        this.node.getComponent(UIOpacity).opacity = this._opacity;

        this._vector = getRandomVector();
    }

    start() {
    }

    /**
     * 移动动画
     */
    private _move(dt: number) {
        let speed = dt * 10 * PIXEL_UNIT;
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
            this.node.destroy();
            return;
        }

        this.node.getComponent(UIOpacity).opacity -= dt * 400;
    }

    update(dt: number) {
        this._move(dt);
        this._fade(dt);
    }
}


