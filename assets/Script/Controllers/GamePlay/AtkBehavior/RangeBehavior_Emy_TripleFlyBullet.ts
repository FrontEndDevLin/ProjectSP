import { _decorator, Vec3 } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import { BehaviorBase_Emy } from './BehaviorBase_Emy';
import BulletManager from '../../../CManager/BulletManager';
import { EmyBasic1 } from '../EMY/EmyBasic1';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-敌人三飞弹
 */
@ccclass('RangeBehavior_Emy_TripleFlyBullet')
export class RangeBehavior_Emy_TripleFlyBullet extends BehaviorBase_Emy {
    private _chargeTime: number = 1;
    private _currentCharge: number = 0;

    public runBehavior(deltaTime: number) {
        if (this.isAttacking) {
            return;
        }

        if (this.calcCd(deltaTime)) {
            this._currentCharge += deltaTime;
            if (this._currentCharge >= this._chargeTime) {
                this.weaponRef.enemyRef.startMove();
                this.isAttacking = true;
                this.execAttack(deltaTime);
                this._currentCharge = 0;
            } else {
                this.weaponRef.enemyRef.stopMove();
            }
        }
    }

    execAttack(deltaTime: number) {
        /**
         * 远程攻击 向角色和角色夹角20度的位置发射3枚子弹
         */
        let enemyRef: EmyBasic1 = this.weaponRef.enemyRef;
        let angle: number = enemyRef.getToCHRAngle();
        const angleList: number[] = [angle - 20, angle, angle + 20];

        angleList.forEach((ang: number) => {
            let vector = getVectorByAngle(ang);
            BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: enemyRef.node.position, vector });
        });

        this.finishAttack();
    }
}
