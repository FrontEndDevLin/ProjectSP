import { _decorator, Tween, tween, Vec3, Node, BoxCollider2D, v3 } from 'cc';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getAngleByVector, getArcByVector, getVectorByAngle, transportWorldPosition } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
import { MeleeBehaviorBase_Chr } from './MeleeBehaviorBase_Chr';
import { Bullet_Emy_Body } from '../Bullet/Bullet_Emy_Body';
const { ccclass, property } = _decorator;

/**
 * 近战攻击行为-爆拳
 */
@ccclass('MeleeBehavior_Chr_BreakPunch')
export class MeleeBehavior_Chr_BreakPunch extends MeleeBehaviorBase_Chr {
    public bulletNode: Node;
    public bulletCollider: BoxCollider2D;
    protected isActiveType: boolean = false;

    public setColliderEnabled(enabled: boolean) {
        this.bulletCollider.enabled = enabled;
    }

    public execCustomAttack(loc: Vec3, vector: Vec3) {
        let position = loc.clone();
        BulletManager.instance.createIBullet({
            weaponRealTimeProps: this.weaponRef.curInf,
            position,
            vector,
            onNodeCreated: (node: Node) => {
                let height: number = node.getComponent(BoxCollider2D).size.height / 2;
                let arc: number = getArcByVector(vector);
                let moveWidth: number = Math.cos(arc) * height;
                let moveHeight: number = Math.sin(arc) * height;
                position.add(v3(moveWidth, moveHeight, 0));
            }
        });
    }
}
