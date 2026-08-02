import { _decorator, BoxCollider2D, CircleCollider2D, Contact2DType } from 'cc';
import OBT_Component from '../../../OBT_Component';
import WeaponBasic from '../Weapons/WeaponBasic';
import { EMYInfo, GameCollider } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
const { ccclass, property } = _decorator;

/**
 * 攻击行为组件
 */
@ccclass('BehaviorBase')
export class BehaviorBase extends OBT_Component {
    protected weaponRef: WeaponBasic = null;

    // 是否一直处于攻击状态
    protected alwaysAttack: boolean = false;

    // 警戒碰撞盒
    protected alertDomainCollider: CircleCollider2D = null;
    // 攻击碰撞盒
    protected attackDomainCollider: CircleCollider2D = null;
    // 警戒范围内的敌人
    protected highEnemyList: string[] = [];
    // 攻击范围内的队列，当该队列中有敌人时，优先从中选择，性能会有提升
    protected dangerEnemyList: string[] = [];

    start() {
        console.log('挂载攻击行为组件 BehaviorBase');
        this.initDomainCollider();
    }

    protected onLoad(): void {
    }

    protected initDomainCollider() {
        let colliders: CircleCollider2D[] = this.getComponents(CircleCollider2D);
        for (let collider of colliders) {
            switch (collider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    this.alertDomainCollider = collider;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    this.attackDomainCollider = collider;
                } break;
            }
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCHRDomainBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onCHRDomainEndContact, this);
        }
        // let { range, alert } = this.weaponPanel;
        let range: number = this.weaponRef.curInf.range;
        if (this.attackDomainCollider) {
            this.attackDomainCollider.radius = range;
        }
        if (this.alertDomainCollider) {
            this.alertDomainCollider.radius = range + 50;
        }
    }

    protected onCHRDomainBeginContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    // 将敌人放入队列中，结束碰撞时将敌人移出
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    this.highEnemyList[nodeId] = 1;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    this.dangerEnemyList[nodeId] = 1;
                } break;
            }
        }
    }
    protected onCHRDomainEndContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    delete this.highEnemyList[nodeId];
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = otherCollider.node.OBT_param2.id;
                    delete this.dangerEnemyList[nodeId];
                } break;
            }
        }
    }
    // 每帧检查队列中对应节点距离角色的距离
    protected chooseTarget(callback: EMYInfo.ChooseTargetCallback) {
        // 优先判断攻击范围内的敌人
        if (Object.keys(this.dangerEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this.dangerEnemyList);
            callback(true, target);
            return;
        }
        // 攻击范围内无敌人，再判断警戒范围内的敌人
        if (Object.keys(this.highEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this.highEnemyList);
            callback(false, target);
            return;
        }
        callback(false, null);
    }

    public setWeaponRef(weaponRef: WeaponBasic) {
        this.weaponRef = weaponRef;
    }

    protected tryAttack(dt: number) {
        // if (this.weaponRef.curInf.cd) {
        //     this._attack(dt);
        // } else {
        //     this._cd -= dt;
        // }
    }
    protected execAttack(deltaTime: number) {}

    public runBehavior(deltaTime: number) {
        console.log('运行攻击行为');
        if (this.alwaysAttack) {
            this.execAttack(deltaTime);
        } else {
            
        }
    }
}
