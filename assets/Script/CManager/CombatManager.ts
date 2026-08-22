import { BoxCollider2D, Vec3 } from "cc";
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

    protected onEnemyHit(bulletCollider: BoxCollider2D, enemyCollider: BoxCollider2D) {
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
            bullet: bullet.realTimeProps.code,
            damage: realDamage,
            isCritical,
            vector: bullet.vector
        };

        enemy.onHit(damageInfo);
        bullet.onHit(damageInfo);
    }
    protected onCHRHit(bulletCollider: BoxCollider2D, chrCollider: BoxCollider2D) {
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
            bullet: bullet.realTimeProps.code,
            damage: realDamage,
            vector: bullet.vector
        };
        // console.log('角色造成伤害', realDamage);
        chr.onHit(damageInfo);
        bullet.onHit(damageInfo);
    }
}
