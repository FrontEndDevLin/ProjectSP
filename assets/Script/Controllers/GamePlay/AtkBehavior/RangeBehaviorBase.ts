import { _decorator } from 'cc';
import { BehaviorBase } from './BehaviorBase';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为组件
 */
@ccclass('RangeBehaviorBase')
export class RangeBehaviorBase extends BehaviorBase {
    start() {
        console.log('挂载远程攻击行为组件 RangeBehaviorBase');
    }

    protected onLoad(): void {
    }
}
