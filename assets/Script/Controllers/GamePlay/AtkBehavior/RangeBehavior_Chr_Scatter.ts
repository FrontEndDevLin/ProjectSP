import { _decorator, Vec3 } from 'cc';
import { RangeBehaviorBase_Chr } from './RangeBehaviorBase_Chr';
import { EMYInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import { getVectorByAngle } from '../../../Common/utils';
import RealTimeEventManager from '../../../CManager/RealTimeEventManager';
import BulletManager from '../../../CManager/BulletManager';
import WeaponBasic from '../Weapons/WeaponBasic';
import Weapon_Chr_Scatter from '../Weapons/Weapon_Chr_Scatter';
const { ccclass, property } = _decorator;

/**
 * 远程攻击行为-散射
 */
@ccclass('RangeBehavior_Chr_Scatter')
export class RangeBehavior_Chr_Scatter extends RangeBehaviorBase_Chr {
    protected weaponRef: Weapon_Chr_Scatter;

    protected onLoad(): void {
    }

    execAttack(deltaTime: number, target: EMYInfo.RealTimeInfo) {
        if (!target) {
            return;
        }

        console.log('TODO: 散射攻击');

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

        let angleList: number[] = [];
        let split: number = this.weaponRef.itemRef.split;
        let splitAngle: number = 15;
        let min = -Math.floor(split / 2);
        let max = min + split;
        for (let i = min; i < max; i++) {
            angleList.push(angle + splitAngle * i);
        }

        // 左右开弓概率攻击
        // let mirrorAttackRate: number = WarCoreManager.instance.warCore.getProp("mirrorAttackRate");
        // if (mirrorAttackRate && mirrorAttackRate > 0) {
        //     let mirrorAttack: boolean = false;
        //     if (mirrorAttackRate >= 100) {
        //         mirrorAttack = true;
        //     } else {
        //         let randomNum: number = getRandomNumber(1, 100);
        //         if (randomNum <= mirrorAttackRate) {
        //             mirrorAttack = true;
        //         }
        //     }
        //     if (mirrorAttack) {
        //         let mirrorAngleList = []
        //         angleList.forEach((angle: number) => {
        //             mirrorAngleList.push(angle + 180)
        //         })
        //         angleList = angleList.concat(mirrorAngleList);
        //     }
        // }

        // 同一批次的子弹, groupId一致
        // let groupId: number = this.bulletGroupId;
        // let { bullet, penetrate, pen_dmg } = this.warCore.weaponCtx;
        // console.log("穿透数量:" + penetrate + ",穿透伤害:" + pen_dmg);
        angleList.forEach((angle: number) => {
            let vector = getVectorByAngle(angle);
            // BulletManager.instance.createBulletByCHR({ bulletId: bullet, position: chrLoc, vector, groupId, penetrate, pen_dmg });
            BulletManager.instance.createIBullet({ weaponRealTimeProps: this.weaponRef.curInf, position: chrLoc, vector });
        });
        // this.bulletGroupId++;
        // console.log(Vec3.angle(v3(1,0,0), {x: vecX, y: vecY, z: 0}));
        // console.log(Number((Math.atan(vecY / vecX)).toFixed(2)));
        // 向量要根据贴图的旋转角度计算
        // BulletManager.instance.createBulletByCHR({ bulletId: this.weaponRef.curInf.bullet, position: chrLoc, vector });
        
        // this._attacking = true;
        RealTimeEventManager.instance.onWarCoreAttack();
        this.finishAttack();
    }
}
