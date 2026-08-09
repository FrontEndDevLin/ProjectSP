import { _decorator, Vec3 } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-基础飞弹
 */
@ccclass('RangeBehavior_Chr_BaseFlyBullet')
export class RangeBehavior_Chr_BaseFlyBullet extends RangeBehaviorBase_Chr {
    // start() {
    //     super.start();
    //     console.log('挂载远程攻击行为组件 RangeBehavior_BaseFlyBullet');
    //     // TODO: 原BaseAtkWarCore逻辑
    // }

    protected onLoad(): void {
    }

    execAttack(deltaTime: number, target: EMYInfo.RealTimeInfo) {
        if (!target) {
            return;
        }

        // 通知BulletManager发射子弹，带上当前坐标，向量
        const chrLoc: Vec3 = CHRManager.instance.getCHRLoc();
        if (!chrLoc) {
            return;
        }
        let vecX = target.x - chrLoc.x;
        let vecY = target.y - chrLoc.y;
        let angle = Number((Math.atan(vecY / vecX) * (180 / Math.PI)).toFixed(2));
        if (vecX < 0) {
            angle -= 180;
        }
        let vector = getVectorByAngle(angle);

        // console.log(Vec3.angle(v3(1,0,0), {x: vecX, y: vecY, z: 0}));
        // console.log(Number((Math.atan(vecY / vecX)).toFixed(2)));
        // 向量要根据贴图的旋转角度计算
        // BulletManager.instance.createBulletByCHR({ bulletId: this.weaponRef.curInf.bullet, position: chrLoc, vector });
        BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: chrLoc, vector });
        // this._attacking = true;
        RealTimeEventManager.instance.onWarCoreAttack();
        this.finishAttack();
    }
}
