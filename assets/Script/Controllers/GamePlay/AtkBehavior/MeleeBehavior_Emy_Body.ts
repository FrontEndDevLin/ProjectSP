import { _decorator, BoxCollider2D, Contact2DType, v3, Node } from 'cc';
import { MeleeBehaviorBase } from './MeleeBehaviorBase';
import { EMYInfo } from '../../../Common/Namespace';
import BulletManager from '../../../CManager/BulletManager';
import { Bullet_Emy_Body } from '../Bullet/Bullet_Emy_Body';
import { EmyBasic1 } from '../EMY/EmyBasic1';
const { ccclass, property } = _decorator;

/**
 * 敌人身体攻击行为组件
 */
@ccclass('MeleeBehavior_Emy_Body')
export class MeleeBehavior_Emy_Body extends MeleeBehaviorBase {
    public enemyId: string;
    public enemyNode: Node;
    protected bulletNode: Node;

    protected hasDomainCollider: boolean = false;

    start() {
        console.log('挂载敌人身体攻击行为组件 MeleeBehavior_Emy_Body');
    }

    protected onLoad(): void {
        // 创建碰撞体
    }

    public init(enemyId: string, enemyRef: EmyBasic1) {
        this.enemyId = enemyId;
        if (!this.enemyNode) {
            this.enemyNode = enemyRef.node;
        }
        if (!this.bulletNode) {
            this.bulletNode = BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: v3(0, 0, 0), vector: null, rootNode: this.node })
        }
        const bullet: Bullet_Emy_Body = this.bulletNode.getComponent(Bullet_Emy_Body);
        bullet.setEnemyId(enemyId);
        if (!bullet.enemyRef) {
            bullet.setEnemyRef(enemyRef);
        }
    }

    protected execAttack(deltaTime: number, target?: EMYInfo.RealTimeInfo): void {
        
    }
}
