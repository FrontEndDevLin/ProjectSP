import { _decorator, v3 } from 'cc';
import { getDistance } from '../../../Common/utils';
import { BulletBasic } from './BulletBasic';
const { ccclass, property } = _decorator;

/**
 * 普通子弹脚本
 * 飞行的子弹
 */
@ccclass('Bullet_Emy_Body')
export class Bullet_Emy_Body extends BulletBasic {
    public enemyId: string;

    public setEnemyId(enemyId: string) {
        this.enemyId = enemyId;
    }

    onHit() {
    }

    protected runBehavior(dt: number) {
    }
}
