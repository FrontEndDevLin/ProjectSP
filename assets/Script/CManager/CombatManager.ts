import { BoxCollider2D } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import { GameCollider } from "../Common/Namespace";

export default class CombatManager extends OBT_UIManager {
    static instance: CombatManager = null;

    protected onLoad(): void {
        if (!CombatManager.instance) {
            CombatManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        console.log("Battle Manager loaded");
    }

    /**
     * 参数，子弹碰撞体，目标碰撞体
     */
    public onBulletHit(bulletCollider: BoxCollider2D, targetCollider: BoxCollider2D) {
        switch (bulletCollider.group) {
            case GameCollider.GROUP.CHR_BULLET: {
                // 子弹击中敌人
                this.onEnemyHit(bulletCollider, targetCollider);
            } break;
            case GameCollider.GROUP.EMY_BULLET: {
                // 敌人被击中
                this.onCHRHit(bulletCollider, targetCollider);
            } break;
        }
    }

    protected onEnemyHit(bulletCollider: BoxCollider2D, enemyCollider: BoxCollider2D) {
        // 敌人被击中
        console.log("敌人被击中");
    }
    protected onCHRHit(bulletCollider: BoxCollider2D, chrCollider: BoxCollider2D) {
        // 角色被击中
    }
}
