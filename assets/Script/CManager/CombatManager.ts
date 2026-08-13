import { BoxCollider2D, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import { GameCollider } from "../Common/Namespace";
import { BulletBasic } from "../Controllers/GamePlay/Bullet/BulletBasic";
import { EmyBasic } from "../Controllers/GamePlay/EMY/EmyBasic";
import { getRandomNumber } from "../Common/utils";
import { Bullet_Emy_Body } from "../Controllers/GamePlay/Bullet/Bullet_Emy_Body";

export interface HitInfo {
    damage: number,
    isCritical?: boolean,
    vector?: Vec3,
    bullet: string
    // TODO: 还有击退属性, 击退时, 判断方向为武器位置到目标位置的向量
}

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
        console.log(45)
        let bullet: BulletBasic = bulletCollider.node.getComponent(BulletBasic);
        // 伤害等在这里计算好
        if (!bullet) {
            return console.error("弹体脚本不存在");
        }
        let enemy = enemyCollider.node.getComponent(Bullet_Emy_Body);
        if (!enemy) {
            return;
        }
        let realDamage: number = bullet.realTimeProps.damage;
        let isCritical: boolean = false;
        let crit_rate: number = bullet.realTimeProps.crit_rate;
        if (crit_rate > 0) {
            if (crit_rate >= 1) {
                isCritical = true;
            } else {
                let num: number = getRandomNumber(1, 100) / 100;
                isCritical = num <= crit_rate;
            }
            if (isCritical) {
                realDamage = realDamage * bullet.realTimeProps.crit_dmg_rate;
            }
        }

        // 计算伤害
        let damageInfo: HitInfo = {
            bullet: bullet.realTimeProps.code,
            damage: bullet.realTimeProps.damage,
            isCritical,
            vector: bullet.vector
        };

        enemy.onHit(damageInfo);
        bullet.onHit(damageInfo);
    }
    protected onCHRHit(bulletCollider: BoxCollider2D, chrCollider: BoxCollider2D) {
        // 角色被击中
    }
}
