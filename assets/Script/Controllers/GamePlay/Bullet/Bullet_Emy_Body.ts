import { _decorator, BoxCollider2D, v3 } from 'cc';
import { getDistance } from '../../../Common/utils';
import { BulletBasic } from './BulletBasic';
import { EmyBasic1 } from '../EMY/EmyBasic1';
import CombatManager, { HitInfo } from '../../../CManager/CombatManager';
import { GameCollider } from '../../../Common/Namespace';
const { ccclass, property } = _decorator;

/**
 * 敌人身体子弹体
 */
@ccclass('Bullet_Emy_Body')
export class Bullet_Emy_Body extends BulletBasic {
    public hitting: boolean = false;
    protected otherCollider: BoxCollider2D = null;

    protected onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        this.otherCollider = otherCollider;
        this.hitting = true;
    }

    protected onEndContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        this.otherCollider = null;
        this.hitting = false;
    }

    public execAttack() {
        if (!this.collider || !this.otherCollider) {
            return;
        }
        CombatManager.instance.onBulletHit(this.collider, this.otherCollider);
    }

    protected runBehavior(dt: number) {
    }
}
