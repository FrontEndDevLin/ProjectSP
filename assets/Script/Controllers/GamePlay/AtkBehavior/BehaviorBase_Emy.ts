import { _decorator, BoxCollider2D, CircleCollider2D, Contact2DType } from 'cc';
import OBT_Component from '../../../OBT_Component';
import WeaponBasic from '../Weapons/WeaponBasic';
import { EMYInfo, GameCollider } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import { BehaviorBase } from './BehaviorBase';
import WeaponEmy from '../Weapons/WeaponEmy';
const { ccclass, property } = _decorator;

/**
 * 敌人攻击行为组件
 * 
 * 敌人攻击时不检测攻击范围
 */
@ccclass('BehaviorBase_Emy')
export class BehaviorBase_Emy extends BehaviorBase {
    protected weaponRef: WeaponEmy;
    // 是否在攻击范围内
    protected inAttackRange: boolean = false;

    start() {
        console.log('挂载攻击行为组件 BehaviorBase_Emy');
    }

    public onInit(): void {
        
    }

    public isInAttackRange(): boolean {
        let isInRange = false;
        if (this.weaponRef.curInf.range) {
            if (this.weaponRef.enemyRef.dis <= this.weaponRef.curInf.range) {
                isInRange = true;
            } else {
                isInRange = false;
            }
        } else {
            isInRange = true;
        }
        return isInRange;
    }

    public runBehavior(deltaTime: number) {
        if (this.isAttacking) {
            return;
        }

        if (this.calcCd(deltaTime) && this.isInAttackRange()) {
            this.isAttacking = true;
            this.execAttack(deltaTime);
        }
    }
}
