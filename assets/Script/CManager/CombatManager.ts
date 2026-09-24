import { BoxCollider2D, Collider2D, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import { GameCollider } from "../Common/Namespace";
import { BulletBasic } from "../Controllers/GamePlay/Bullet/BulletBasic";
import { EmyBasic } from "../Controllers/GamePlay/EMY/EmyBasic";
import { getRandomNumber } from "../Common/utils";
import { Bullet_Emy_Body } from "../Controllers/GamePlay/Bullet/Bullet_Emy_Body";
import { EmyBasic1 } from "../Controllers/GamePlay/EMY/EmyBasic1";
import { CHR } from "../Controllers/GamePlay/CHR/CHR";

export interface HitInfo {
    damage: number,
    isCritical?: boolean,
    vector?: Vec3,
    repel?: number,
    bullet: string,
    enemyId?: string,
    slowdown?: number,
    slowdownTime?: number
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
    public onBulletHit(bulletCollider: Collider2D, targetCollider: Collider2D) {
        switch (bulletCollider.group) {
            case GameCollider.GROUP.CHR_BULLET: {
                // 子弹击中敌人
                this.onEnemyHit(bulletCollider, targetCollider);
            } break;
            case GameCollider.GROUP.EMY_BULLET: {
                console.log('子弹命中角色')
                // 子弹命中角色
                this.onCHRHit(bulletCollider, targetCollider);
            } break;
            default:
                // 8 16
                console.log('子弹命中未知目标', bulletCollider.group, targetCollider.group);
                break;
        }
    }

    protected onEnemyHit(bulletCollider: Collider2D, enemyCollider: Collider2D) {
        let bullet: BulletBasic = bulletCollider.node.getComponent(BulletBasic);
        // 伤害等在这里计算好
        if (!bullet) {
            return console.error("弹体脚本不存在");
        }
        let enemy = enemyCollider.node.getComponent(EmyBasic1);
        
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
                realDamage = Math.round(realDamage * bullet.realTimeProps.crit_dmg_rate);
            }
        }

        // 计算伤害
        let damageInfo: HitInfo = {
            bullet: bullet.realTimeProps.bullet,
            damage: realDamage,
            slowdown: bullet.realTimeProps.slowdown,
            slowdownTime: bullet.realTimeProps.slowdown_time,
            isCritical,
            repel: bullet.realTimeProps.repel || 0,
            vector: bullet.vector,
            enemyId: enemy.id
        };

        enemy.onHit(damageInfo);
        bullet.onHit(damageInfo);
    }
    protected onCHRHit(bulletCollider: Collider2D, chrCollider: Collider2D) {
        // 角色被击中
        let bullet: BulletBasic = bulletCollider.node.getComponent(BulletBasic);
        // 伤害等在这里计算好
        if (!bullet) {
            return console.error("弹体脚本不存在");
        }
        let chr = chrCollider.node.getComponent(CHR);
        if (!chr) {
            return;
        }

        // if (bulletCollider.tag === GameCollider.TAG.BULLET_EMY_BODY) {
        //     console.log('角色被敌人身体碰撞')
        // }

        let realDamage: number = bullet.realTimeProps.damage;

        let damageInfo: HitInfo = {
            bullet: bullet.realTimeProps.bullet,
            damage: realDamage,
            vector: bullet.vector
        };
        // console.log('角色造成伤害', realDamage);
        chr.onHit(damageInfo);
        bullet.onHit(damageInfo);
    }
}
