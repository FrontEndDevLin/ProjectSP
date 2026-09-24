import { _decorator } from 'cc';
import { BehaviorBase_Chr } from './BehaviorBase_Chr';
const { ccclass, property } = _decorator;

/**
 * 近战攻击行为组件
 */
@ccclass('MeleeBehaviorBase_Chr')
export class MeleeBehaviorBase_Chr extends BehaviorBase_Chr {
    start() {
        super.start();
        console.log('挂载近战攻击行为组件 MeleeBehaviorBase_Chr');
    }

    protected onLoad(): void {
    }
}
