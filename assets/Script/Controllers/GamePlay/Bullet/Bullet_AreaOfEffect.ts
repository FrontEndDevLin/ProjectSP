import { _decorator, v3 } from 'cc';
import { getDistance } from '../../../Common/utils';
import { BulletBasic } from './BulletBasic';
import ProcessManager from '../../../CManager/ProcessManager';
const { ccclass, property } = _decorator;

/**
 * 区域效果子弹脚本
 */
@ccclass('Bullet_AreaOfEffect')
export class Bullet_AreaOfEffect extends BulletBasic {
    private currentFrame: number = 0;
    protected onInit() {
        this.currentFrame = 0;
    }

    protected runBehavior(dt: number) {
        this.currentFrame++;
        if (this.currentFrame >= this.attr.effect_frame) {
            this.die();
        }
    }
}
