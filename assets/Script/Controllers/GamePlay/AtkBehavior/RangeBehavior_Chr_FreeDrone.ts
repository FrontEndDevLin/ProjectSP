import { _decorator, Vec3 } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle, transportWorldPosition } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-自由无人机
 */
@ccclass('RangeBehavior_Chr_FreeDrone')
export class RangeBehavior_Chr_FreeDrone extends RangeBehaviorBase_Chr {
    protected onLoad(): void {
    }
}
