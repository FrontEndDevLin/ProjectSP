import { _decorator, BoxCollider2D, CircleCollider2D, Contact2DType } from 'cc';
import OBT_Component from '../../../OBT_Component';
import WeaponBasic from '../Weapons/WeaponBasic';
import { EMYInfo, GameCollider } from '../../../Common/Namespace';
import EMYManager from '../../../CManager/EMYManager';
import { BehaviorBase } from './BehaviorBase';
import { EmyBasic } from '../EMY/EmyBasic';
import { MeleeBehavior_Emy_Body } from './MeleeBehavior_Emy_Body';
import { Bullet_Emy_Body } from '../Bullet/Bullet_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * 玩家武器攻击行为组件
 */
@ccclass('BehaviorBase_Chr')
export class BehaviorBase_Chr extends BehaviorBase {
    // 是否一直处于攻击状态, 这个状态下不考虑cd
    protected isAlwaysAttack: boolean = false;

    protected isAttacking: boolean = false;

    // 是否有警戒、攻击范围碰撞盒
    protected hasDomainCollider: boolean = true;
    // 警戒碰撞盒
    protected alertDomainCollider: CircleCollider2D = null;
    // 攻击碰撞盒
    protected attackDomainCollider: CircleCollider2D = null;
    // 警戒范围内的敌人
    protected highEnemyList: string[] = [];
    // 攻击范围内的队列，当该队列中有敌人时，优先从中选择，性能会有提升
    protected dangerEnemyList: string[] = [];

    start() {
        console.log('挂载攻击行为组件 BehaviorBase_Chr');
        if (this.hasDomainCollider) {
            this.initDomainCollider();
        }
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
            const enemyBodyBullet: Bullet_Emy_Body = otherCollider.node.getComponent(Bullet_Emy_Body);
            if (!enemyBodyBullet) {
                console.error('7111111111111111111111')
                console.log(otherCollider)
                return
            }
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    // 将敌人放入队列中，结束碰撞时将敌人移出
                    let nodeId: string = enemyBodyBullet.enemyId;
                    this.highEnemyList[nodeId] = 1;
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = enemyBodyBullet.enemyId;
                    this.dangerEnemyList[nodeId] = 1;
                } break;
            }
        }
    }
    protected onCHRDomainEndContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GameCollider.GROUP.ENEMY) {
            const enemyBodyBullet: Bullet_Emy_Body = otherCollider.node.getComponent(Bullet_Emy_Body);
            if (!enemyBodyBullet) {
                console.error('22222224444444444')
                console.log(otherCollider)
                return
            }
            switch (selfCollider.tag) {
                case GameCollider.TAG.CHR_RANGE_ALERT: {
                    let nodeId: string = enemyBodyBullet.enemyId;
                    delete this.highEnemyList[nodeId];
                } break;
                case GameCollider.TAG.CHR_RANGE_ATTACK: {
                    let nodeId: string = enemyBodyBullet.enemyId;
                    delete this.dangerEnemyList[nodeId];
                } break;
            }
        }
    }
    // 每帧检查队列中对应节点距离角色的距离
    protected chooseTarget(): EMYInfo.ChooseTargetRes {
        // 优先判断攻击范围内的敌人
        if (Object.keys(this.dangerEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this.dangerEnemyList);
            console.log(target)
            return { isCanBeAttacked: true, realTimeEnemyInfo: target };
        }
        // 攻击范围内无敌人，再判断警戒范围内的敌人
        if (Object.keys(this.highEnemyList).length) {
            let target: EMYInfo.RealTimeInfo = EMYManager.instance.getNearestEnemy(this.highEnemyList);
            return { isCanBeAttacked: false, realTimeEnemyInfo: target };
        }
        return { isCanBeAttacked: false, realTimeEnemyInfo: null };
    }

    public runBehavior(deltaTime: number) {
        if (this.isAlwaysAttack) {
            this.execAttack(deltaTime);
        } else {
            if (this.isAttacking) {
                return;
            }
            if (this.isCdOver(deltaTime)) {
                let target: EMYInfo.ChooseTargetRes = this.chooseTarget();
                console.log(target);
                if (target.isCanBeAttacked) {
                    this.isAttacking = true;
                    this.execAttack(deltaTime, target.realTimeEnemyInfo);
                } else {
                    console.log('无可攻击目标');
                }
            }
        }
    }
}
