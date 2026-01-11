import { v3 } from "cc";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import { GamePlayEventOptions } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";
import { getAngleByVector, getRandomNumber, getVectorByAngle } from "../../../Common/utils";

/**
 * "开花"核心升级包
 */
export default class ItemBlossom extends ItemSpecial {
    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams): void {
        // 符合被当前核心子弹击杀条件
        if (dieParams.bullet === WarCoreManager.instance.warCore.weaponCtx.bullet) {
            // 开花代码
            let angle: number = getAngleByVector(dieParams.vector);

            let angleList: number[] = [];
            let split: number = this.val_1;
            let splitAngle: number = 30;
            let min = -Math.floor(split / 2);
            let max = min + split;
            for (let i = min; i < max; i++) {
                angleList.push(angle + splitAngle * i);
            }

            angleList.forEach((angle: number) => {
                let vector = getVectorByAngle(angle);
                BulletManager.instance.createBullet(this.weaponCtx.bullet, dieParams.loc, vector, null, [dieParams.id]);
            });
        }
    }

    public onUse() {
        let rate = WarCoreManager.instance.warCore.getProp("mirrorAttackRate");
        let newRate = rate ? rate + this.val_1 : this.val_1;
        WarCoreManager.instance.warCore.setProp("mirrorAttackRate", newRate);
    }
}
