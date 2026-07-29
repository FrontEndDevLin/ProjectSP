import { _decorator } from 'cc';
import { RangeBehaviorBase } from './RangeBehaviorBase';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-基础飞弹
 */
@ccclass('RangeBehavior_BaseFlyBullet')
export class RangeBehavior_BaseFlyBullet extends RangeBehaviorBase {
    start() {
        console.log('挂载远程攻击行为组件 RangeBehavior_BaseFlyBullet');
    }

    protected onLoad(): void {
    }
}
