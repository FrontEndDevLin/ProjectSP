import { _decorator } from 'cc';
import { BehaviorBase } from './BehaviorBase';
const { ccclass, property } = _decorator;

/**
 * 近战攻击行为组件
 */
@ccclass('MeleeBehaviorBase')
export class MeleeBehaviorBase extends BehaviorBase {
    start() {
        super.start();
        console.log('挂载远程攻击行为组件 MeleeBehaviorBase');
    }

    protected onLoad(): void {
    }
}
