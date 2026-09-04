import { _decorator, Vec3 } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo, GamePlayEventOptions } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getAngleByVector, getVectorByAngle } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-裂变
 */
@ccclass('RangeBehavior_Chr_Fission')
export class RangeBehavior_Chr_Fission extends RangeBehaviorBase_Chr {
    protected isActiveType: boolean = false;
    protected hasDomainCollider: boolean = false;

    start(): void {
        super.start();
        console.log('挂载远程攻击行为组件 RangeBehavior_Chr_Fission');
    }

    protected onLoad(): void {
    }

    public execCustomAttack(dieParams: GamePlayEventOptions.EnemyDieParams, split: number) {
        // 开花代码
        let angle: number = getAngleByVector(dieParams.vector);

        let angleList: number[] = [];
        let splitAngle: number = 30;
        let min = -Math.floor(split / 2);
        let max = min + split;
        for (let i = min; i < max; i++) {
            angleList.push(angle + splitAngle * i);
        }

        angleList.forEach((angle: number) => {
            let vector = getVectorByAngle(angle);
            BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: dieParams.loc, vector });
        });
    }
}
