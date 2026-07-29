import { _decorator } from 'cc';
import OBT_Component from '../../../OBT_Component';
const { ccclass, property } = _decorator;

/**
 * 攻击行为组件
 */
@ccclass('BehaviorBase')
export class BehaviorBase extends OBT_Component {
    start() {
        console.log('挂载攻击行为组件 BehaviorBase');
    }

    protected onLoad(): void {
    }
}
