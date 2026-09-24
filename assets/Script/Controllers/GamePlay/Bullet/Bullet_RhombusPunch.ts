import { _decorator, v3 } from 'cc';
import { getDistance } from '../../../Common/utils';
import { BulletBasic } from './BulletBasic';
import ProcessManager from '../../../CManager/ProcessManager';
import { HitInfo } from '../../../CManager/CombatManager';
const { ccclass, property } = _decorator;

/**
 * 棱拳子弹脚本
 */
@ccclass('Bullet_RhombusPunch')
export class Bullet_RhombusPunch extends BulletBasic {
    private lastHitEnemyId: string;
    private boostFlag: boolean = false;
    private boostRate: number = 1.5;

    public onHit(hitInfo: HitInfo) {
        let isSame = hitInfo.enemyId === this.lastHitEnemyId;
        this.lastHitEnemyId = hitInfo.enemyId;
        if (isSame) {
            if (this.boostFlag) {
                return;
            }
            this.realTimeProps.damage = Math.round(this.realTimeProps.damage * this.boostRate);
            this.boostFlag = true;
        } else {
            if (!this.boostFlag) {
                return;
            }
            this.realTimeProps.damage = Math.round(this.realTimeProps.damage / this.boostRate);
            this.boostFlag = false;
        }
    }
}
