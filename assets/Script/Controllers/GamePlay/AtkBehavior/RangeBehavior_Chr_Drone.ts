import { _decorator, Vec3 } from 'cc';
import BulletManager from '../../../CManager/BulletManager';
import { RangeBehavior_Chr_BaseFlyBullet } from './RangeBehavior_Chr_BaseFlyBullet';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-无人机
 */
@ccclass('RangeBehavior_Chr_Drone')
export class RangeBehavior_Chr_Drone extends RangeBehavior_Chr_BaseFlyBullet {
    // start() {
    //     super.start();
    //     console.log('挂载远程攻击行为组件 RangeBehavior_BaseFlyBullet');
    //     // TODO: 原BaseAtkWarCore逻辑
    // }

    public onInit(): void {
        this.bodyNode = this.view("Body");
    }
}
