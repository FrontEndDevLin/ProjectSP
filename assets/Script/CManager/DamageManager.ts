import { _decorator, JsonAsset, Node } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import OBT from '../OBT';
import EMYManager from './EMYManager';
import BulletManager from './BulletManager';
import CHRManager from './CHRManager';

/**
 * 伤害管理类
 * 提供接口:
 *  敌人受击伤害
 *  角色受击伤害
 *  显示伤害数字
 * 伤害计算需要结合角色属性、敌人属性、核心属性
 */

export default class DamageManager extends OBT_UIManager {
    static instance: DamageManager = null;

    protected onLoad(): void {
        if (!DamageManager.instance) {
            DamageManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    start() {

    }

    public calcAttackDamage(bulletId: string) {
        let bulletDamage: number = BulletManager.instance.getBulletDamage(bulletId);
        // TODO: 1. 结合角色属性和核心属性对dmg进行修正

        // 2. 将第一步修正后的伤害与当前伤害百分比做计算
        let dmgVal: number = CHRManager.instance.propCtx.getPropRealValue("dmg");
        let finalDamage: number = Math.round(bulletDamage * dmgVal);
        return finalDamage;
    }

    public calcEnemyDamage(enemyId: string, isSpec: boolean) {
        let dmg: number = EMYManager.instance.getEnemyDamage(enemyId, isSpec);
        // TODO: 结合角色属性和核心属性对dmg进行修正
        return dmg;
    }

    update(deltaTime: number) {
        
    }
}

