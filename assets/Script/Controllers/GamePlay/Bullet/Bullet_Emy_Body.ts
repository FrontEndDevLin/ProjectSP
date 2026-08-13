import { _decorator, v3 } from 'cc';
import { getDistance } from '../../../Common/utils';
import { BulletBasic } from './BulletBasic';
import { EmyBasic1 } from '../EMY/EmyBasic1';
import { HitInfo } from '../../../CManager/CombatManager';
const { ccclass, property } = _decorator;

/**
 * 普通子弹脚本
 * 飞行的子弹
 */
@ccclass('Bullet_Emy_Body')
export class Bullet_Emy_Body extends BulletBasic {
    public enemyId: string;
    public enemyRef: EmyBasic1;

    public setEnemyId(enemyId: string) {
        this.enemyId = enemyId;
    }

    public setEnemyRef(enemyRef: EmyBasic1) {
        this.enemyRef = enemyRef;
    }

    public onHit(damageInfo: HitInfo) {
        this.enemyRef.onHit(damageInfo);
    }

    protected runBehavior(dt: number) {
    }
}
