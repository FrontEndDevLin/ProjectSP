import { _decorator, Tween, tween, Vec3, Node, BoxCollider2D, v3, Collider2D, CircleCollider2D, UITransform, UIOpacity } from 'cc';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getAngleByVector, getArcByVector, getVectorByAngle, transportWorldPosition } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
import { MeleeBehaviorBase_Chr } from './MeleeBehaviorBase_Chr';
import { Bullet_Emy_Body } from '../Bullet/Bullet_Emy_Body';
import WeaponBasic from '../Weapons/WeaponBasic';
import Weapon_Chr_MentalAura from '../Weapons/Weapon_Chr_MentalAura';
import WeaponManager from '../../../CManager/WeaponManager';
const { ccclass, property } = _decorator;

/**
 * 近战攻击行为-气场
 */
@ccclass('MeleeBehavior_Chr_MentalAura')
export class MeleeBehavior_Chr_MentalAura extends MeleeBehaviorBase_Chr {
    // public bulletNode: Node;
    // public bulletCollider: BoxCollider2D;
    protected isActiveType: boolean = false;
    protected weaponRef: Weapon_Chr_MentalAura;

    // public setColliderEnabled(enabled: boolean) {
    //     this.bulletCollider.enabled = enabled;
    // }
    public runBehavior(deltaTime: number): void {
        if (!this.weaponRef.itemRef.standing) {
            return;
        }
        if (this.calcCd(deltaTime)) {
            let position = CHRManager.instance.getCHRLoc();
            BulletManager.instance.createIBullet({
                weaponRealTimeProps: this.weaponRef.curInf,
                position,
                vector: null,
                onNodeCreated: (node: Node) => {
                    let width: number = this.weaponRef.curInf.range;
                    node.getComponent(CircleCollider2D).radius = width;
                    // let height: number = node.getComponent(BoxCollider2D).size.height / 2;
                    // let arc: number = getArcByVector(vector);
                    // let moveWidth: number = Math.cos(arc) * height;
                    // let moveHeight: number = Math.sin(arc) * height;
                    // position.add(v3(moveWidth, moveHeight, 0));
                }
            });

            this.createEffect();
            this.finishAttack();
        }
    }

    public createEffect() {
        let particleNode: Node = WeaponManager.instance.loadPrefab({ prefabPath: "Particle/EmyDieParticle", scriptName: "NONE" });
        WeaponManager.instance.mountNode({ node: particleNode, parentNode: this.node });
        tween(particleNode.getComponent(UITransform))
            .to(0.4, { width: this.weaponRef.curInf.range * 2, height: this.weaponRef.curInf.range * 2 })
            .call(() => {
                if (particleNode) {
                    particleNode.removeFromParent();
                }
            })
            .start();

        tween(particleNode.getComponent(UIOpacity))
            .to(0.4, { opacity: 6 })
            .call(() => {
                if (particleNode) {
                    particleNode.removeFromParent();
                }
            })
            .start();
    }
}
