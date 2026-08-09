import { _decorator } from 'cc';
import { BehaviorBase_Chr } from './BehaviorBase_Chr';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为组件
 */
@ccclass('RangeBehaviorBase_Chr')
export class RangeBehaviorBase_Chr extends BehaviorBase_Chr {
    start() {
        super.start();
        console.log('挂载远程攻击行为组件 RangeBehaviorBase_Chr');
    }

    protected onLoad(): void {
    }
}
