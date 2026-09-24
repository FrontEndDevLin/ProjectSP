import { _decorator, tween, Vec3, Node, UIOpacity } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo, GamePlayEventOptions } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getAngleByVector, getVectorByAngle } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-残影
 */
@ccclass('RangeBehavior_Chr_FastShadow')
export class RangeBehavior_Chr_FastShadow extends RangeBehaviorBase_Chr {
    protected isActiveType: boolean = false;

    protected onLoad(): void {
    }

    public exexCustomAttack(rhombusPunchBeforeAttackParams: GamePlayEventOptions.RhombusPunchBeforeAttackParams) {
        let { speed, loc, vector, distance } = rhombusPunchBeforeAttackParams;
        let angle: number = getAngleByVector(vector);
        let angleList: number[] = [angle - 20, angle + 20];
        angleList.forEach((angle: number) => {
            let vec = getVectorByAngle(angle);
            distance += 20;
            let bulletNode: Node = BulletManager.instance.createIBullet({
                weaponRealTimeProps: this.weaponRef.curInf,
                position: loc,
                vector: vec,
                resetAttr: { speed, max_dis: distance }
            });

            let uiOpacity: UIOpacity = bulletNode.getChildByName("SF").getComponent(UIOpacity);
            uiOpacity.opacity = 140;
            tween(uiOpacity)
                .to(distance / speed, { opacity: 0 })
                .start()
        });
    }
}
