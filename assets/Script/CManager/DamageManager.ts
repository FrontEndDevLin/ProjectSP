import { _decorator, JsonAsset, Node } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import OBT from '../OBT';
import EMYManager from './EMYManager';
import BulletManager from './BulletManager';
import CHRManager from './CHRManager';
import { BoostConfig, DamageInfo } from '../Common/Namespace';
import WarCoreManager from './WarCoreManager';
import { getRandomNumber } from '../Common/utils';

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

    public getBulletRealDamage(bulletId: string) {
        let bulletDamage: number = BulletManager.instance.getBulletDamage(bulletId);

        // 1. 结合角色属性和核心属性对dmg进行修正
        let boostDmg: number = 0;
        const boost: BoostConfig = BulletManager.instance.getBulletInfo(bulletId, "boost");
        if (boost) {
            for (let prop in boost) {
                let rate: number = boost[prop] || 0;
                let value: number = CHRManager.instance.propCtx.getPropRealValue(prop) || 0;
                boostDmg += value * rate;
            }
        }

        // 2. 将第一步修正后的伤害与当前伤害百分比做计算
        let dmgVal: number = CHRManager.instance.propCtx.getPropRealValue("dmg");
        let finalDamage: number = Math.round((bulletDamage + boostDmg) * dmgVal);
        return finalDamage;
    }

    public calcAttackDamage(bulletId: string, reduceRate: number): DamageInfo.DamageAttr {
        let realDamage: number = this.getBulletRealDamage(bulletId);
        let isCtitical: boolean = false;
        // 只有核心的bullet才能暴击
        if (bulletId === WarCoreManager.instance.atkWarCore.bullet) {
            let ctl: number = WarCoreManager.instance.realAtkWarCore.ctl;
            if (ctl > 0) {
                if (ctl >= 100) {
                    isCtitical = true;
                } else {
                    let num: number = getRandomNumber(1, 100);
                    isCtitical = num <= ctl;
                }
                if (isCtitical) {
                    realDamage = realDamage * WarCoreManager.instance.realAtkWarCore.ctl_dmg_rate;
                }
            }
        }
        if (reduceRate > 1) {
            reduceRate = 1;
        }
        realDamage = Math.round(realDamage - realDamage * reduceRate);
        // 判断是否触发暴击
        return {
            isCtitical,
            dmg: realDamage
        }
    }

    public calcEnemyDamage(enemyId: string, isSpec: boolean) {
        let dmg: number = EMYManager.instance.getEnemyDamage(enemyId, isSpec);
        // TODO: 结合角色属性和核心属性对dmg进行修正
        return dmg;
    }

    update(deltaTime: number) {
        
    }
}

