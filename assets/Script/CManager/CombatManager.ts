import { BoxCollider2D } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import { GameCollider } from "../Common/Namespace";
import { BulletBasic } from "../Controllers/GamePlay/Bullet/BulletBasic";
import { EmyBasic } from "../Controllers/GamePlay/EMY/EmyBasic";

export default class CombatManager extends OBT_UIManager {
    static instance: CombatManager = null;

    protected onLoad(): void {
        if (!CombatManager.instance) {
            CombatManager.instance = this;
        } else {
            this.destroy();
            return;
        }
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
                // 子弹命中角色
                this.onCHRHit(bulletCollider, targetCollider);
            } break;
        }
    }

    protected onEnemyHit(bulletCollider: BoxCollider2D, enemyCollider: BoxCollider2D) {
        // 伤害等在这里计算好

        let enemy = enemyCollider.node.getComponent(EmyBasic);
        if (enemy) {
            enemy.onHit();
        }

        let bullet: BulletBasic = bulletCollider.node.getComponent(BulletBasic);
        if (bullet) {
            bullet.onHit();
        }
        console.log("敌人被击中");
    }
    protected onCHRHit(bulletCollider: BoxCollider2D, chrCollider: BoxCollider2D) {
        // 角色被击中
    }
}
