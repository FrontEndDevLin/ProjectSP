import { _decorator, BoxCollider2D, CircleCollider2D, Contact2DType } from 'cc';
import OBT_Component from '../../../OBT_Component';
import WeaponBasic from '../Weapons/WeaponBasic';
import { EMYInfo, GameCollider } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import WeaponEmy from '../Weapons/WeaponEmy';
const { ccclass, property } = _decorator;

/**
 * 攻击行为组件
 * 
 * 未考虑敌人攻击，敌人攻击时不检测攻击范围
 * 可能要区分两个类, 一个是角色武器的攻击, 一个是敌人攻击
 */
@ccclass('BehaviorBase')
export class BehaviorBase extends OBT_Component {
    protected weaponRef: WeaponBasic;

    protected isAttacking: boolean = false;

    start() {
        console.log('挂载攻击行为组件 BehaviorBase');
    }

    protected onLoad(): void {
    }

    public setWeaponRef(weaponRef: WeaponBasic) {
        this.weaponRef = weaponRef;
    }

    protected calcCd(dt: number): boolean {
        if (this.weaponRef.cd <= 0) {
            return true;
        } else {
            this.weaponRef.cd -= dt;
            return false;
        }
    }
    protected execAttack(deltaTime: number, target?: EMYInfo.RealTimeInfo) {}
    protected finishAttack() {
        this.weaponRef.finishAttack();
        this.isAttacking = false;
    }

    public onInit() {}

    public runBehavior(deltaTime: number) {}
}
