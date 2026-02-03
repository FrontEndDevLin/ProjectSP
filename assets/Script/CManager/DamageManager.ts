import { _decorator, JsonAsset, Node, NodePool } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import OBT from '../OBT';
import EMYManager from './EMYManager';
import BulletManager from './BulletManager';
import CHRManager from './CHRManager';
import { BoostConfig, DamageInfo } from '../Common/Namespace';
import WarCoreManager from './WarCoreManager';
import { getRandomNumber } from '../Common/utils';
import { DamageTxt } from '../Controllers/GamePlay/Common/DamageTxt';
import ProcessManager from './ProcessManager';

/**
 * 伤害管理类
 * 提供接口:
 *  敌人受击伤害
 *  角色受击伤害
 *  显示伤害数字
 * 伤害计算需要结合角色属性、敌人属性、核心属性
 * 
 * 伤害数字预制件-脚本-动画tween
 */

export default class DamageManager extends OBT_UIManager {
    static instance: DamageManager = null;
    public damageTxtRootNode: Node = null;

    public damageTxtNodePool: NodePool = null;

    protected onLoad(): void {
        if (!DamageManager.instance) {
            DamageManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.damageTxtNodePool = new NodePool();
    }

    start() {
    }

    public initRootNode() {
        this.damageTxtRootNode = this.mountEmptyNode({ nodeName: "DamageTxtBox", parentNode: ProcessManager.instance.unitRootNode });
    }

    protected preloadDamageTxtNodePool() {
        this.damageTxtNodePool.clear();
        for (let i = 0; i < 60; i++) {
            let dmgTxtNode: Node = this.loadPrefab({ prefabPath: `Common/DamageTxt` });
            this.damageTxtNodePool.put(dmgTxtNode);
        }
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

        // 最低伤害不可小于1
        if (finalDamage < 1) {
            finalDamage = 1;
        }

        return finalDamage;
    }

    public calcAttackDamage(bulletId: string, reduceRate: number, isGroupReduce: boolean, penDmg: number = 1): DamageInfo.DamageAttr {
        let realDamage: number = this.getBulletRealDamage(bulletId);
        let isCtitical: boolean = false;
        // 只有核心的bullet才能暴击
        if (bulletId === WarCoreManager.instance.warCore.weaponCtx.bullet) {
            let ctl: number = WarCoreManager.instance.warCore.weaponCtx.ctl;
            if (ctl > 0) {
                if (ctl >= 100) {
                    isCtitical = true;
                } else {
                    let num: number = getRandomNumber(1, 100);
                    isCtitical = num <= ctl;
                }
                if (isCtitical) {
                    realDamage = realDamage * WarCoreManager.instance.warCore.weaponCtx.ctl_dmg_rate;
                }
            }

            // 同一批次子弹对相同目标伤害衰减处理
            if (isGroupReduce) {
                let splitDmgRate: number = WarCoreManager.instance.warCore.weaponCtx.split_dmg_rate;
                if (splitDmgRate) {
                    realDamage = realDamage * splitDmgRate;
                }
            }
        }
        if (reduceRate > 1) {
            reduceRate = 1;
        }
        realDamage = Math.round((realDamage - realDamage * reduceRate) * penDmg);
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

    public showDamageTxt(options: DamageInfo.ShowDamageTxtOptions): void {
        let dmgTxtNode: Node = this.damageTxtNodePool.get();
        if (!dmgTxtNode) {
            dmgTxtNode = this.loadPrefab({ prefabPath: `Common/DamageTxt` });
        }
        const dmgTxtCxt: DamageTxt = <DamageTxt>dmgTxtNode.getComponent("DamageTxt");
        dmgTxtCxt.init(options);
        this.mountNode({ node: dmgTxtNode, parentNode: this.damageTxtRootNode });
    }

    public recoverDamageTxtNode(node: Node) {
        console.log('伤害数字节点回收')
        this.damageTxtRootNode.removeChild(node);
        this.damageTxtNodePool.put(node);
    }

    update(deltaTime: number) {
        
    }
}

