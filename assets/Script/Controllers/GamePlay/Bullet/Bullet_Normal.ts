import { _decorator, v3 } from 'cc';
import { getDistance } from '../../../Common/utils';
import { BulletBasic } from './BulletBasic';
const { ccclass, property } = _decorator;

/**
 * 普通子弹脚本
 * 飞行的子弹
 */
@ccclass('Bullet_Normal')
export class Bullet_Normal extends BulletBasic {
    onHit() {
        this.die();
    }

    protected runBehavior(dt: number) {
        let ax = dt * this.attr.speed * this.vector.x;
        let ay = dt * this.attr.speed * this.vector.y;
        let { x, y } = this.node.position;
        let newLoc = v3(x + ax, y + ay);
        // 如果两点之间距离超过_maxDisPx，销毁
        if (getDistance(this.startRlt, newLoc) < this.attr.max_dis) {
            this.node.setPosition(newLoc);
        } else {
            this.die();
        }
    }
}
