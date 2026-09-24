import { _decorator, Tween, tween, Vec3, Node, BoxCollider2D, v3 } from 'cc';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getAngleByVector, getArcByVector, getVectorByAngle, transportWorldPosition } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
import { MeleeBehaviorBase_Chr } from './MeleeBehaviorBase_Chr';
import { Bullet_Emy_Body } from '../Bullet/Bullet_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * 近战攻击行为-御剑
 */
@ccclass('MeleeBehavior_Chr_SwordMaster')
export class MeleeBehavior_Chr_SwordMaster extends MeleeBehaviorBase_Chr {
    protected isActiveType: boolean = false;
}
