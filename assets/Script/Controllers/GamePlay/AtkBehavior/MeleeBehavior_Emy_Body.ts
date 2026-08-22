import { _decorator, BoxCollider2D, Contact2DType, v3, Node } from 'cc';
import { MeleeBehaviorBase } from './MeleeBehaviorBase';
import { EMYInfo } from '../../../Common/Namespace';
import BulletManager from '../../../CManager/BulletManager';
import { Bullet_Emy_Body } from '../Bullet/Bullet_Emy_Body';
import { EmyBasic1 } from '../EMY/EmyBasic1';
// import { BulletBasic } from '../Bullet/BulletBasic';
import { BehaviorBase_Emy } from './BehaviorBase_Emy';
const { ccclass, property } = _decorator;

/**
 * 敌人身体攻击行为组件
 */
@ccclass('MeleeBehavior_Emy_Body')
export class MeleeBehavior_Emy_Body extends BehaviorBase_Emy {
    public bulletNode: Node;
    public bulletNodeCtx: Bullet_Emy_Body;
    public bulletCollider: BoxCollider2D;

    protected hasDomainCollider: boolean = false;

    start() {
        console.log('挂载敌人身体攻击行为组件 MeleeBehavior_Emy_Body');
    }

    protected onLoad(): void {
        // 创建碰撞体
    }

    public onInit() {
        if (!this.bulletNode) {
            this.bulletNode = BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: v3(0, 0, 0), vector: null, rootNode: this.node });
            this.bulletNodeCtx = this.bulletNode.getComponent(Bullet_Emy_Body);
            this.bulletCollider = this.bulletNode.getComponent(BoxCollider2D);
        }
        this.setColliderEnabled(true);
    }

    public setColliderEnabled(enabled: boolean) {
        this.bulletCollider.enabled = enabled;
    }

    public runBehavior(deltaTime: number): void {
        if (this.calcCd(deltaTime) && this.bulletNodeCtx.hitting) {
            this.execAttack(deltaTime);
        }
    }

    protected execAttack(deltaTime: number): void {
        this.bulletNodeCtx.execAttack();
        this.finishAttack();
    }
}
