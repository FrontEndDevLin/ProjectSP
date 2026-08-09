import { _decorator, BoxCollider2D, Contact2DType } from 'cc';
import { MeleeBehaviorBase } from './MeleeBehaviorBase';
import { EMYInfo } from '../../../Common/Namespace';
const { ccclass, property } = _decorator;

/**
 * 敌人身体攻击行为组件
 */
@ccclass('MeleeBehavior_Emy_Body')
export class MeleeBehavior_Emy_Body extends MeleeBehaviorBase {
    protected hasDomainCollider: boolean = false;

    start() {
        console.log('挂载敌人身体攻击行为组件 MeleeBehavior_Emy_Body');

        let collider = this.node.parent.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        collider.enabled = true;
    }

    protected onBeginContact() {
        console.log(23, '碰撞体受击')
    }

    protected onLoad(): void {
        // 创建碰撞体
    }

    protected execAttack(deltaTime: number, target?: EMYInfo.RealTimeInfo): void {
        
    }
}
