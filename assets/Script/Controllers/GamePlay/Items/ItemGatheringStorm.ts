import { v3 } from "cc";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import { GamePlayEventOptions } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";
import { getAngleByVector, getRandomNumber, getVectorByAngle } from "../../../Common/utils";

/**
 * "风暴聚集"核心升级包
 * 散射核心每击杀n个敌人, 永久提升少量暴击几率, 有上限。当达到上限时，额外获得分裂数
 */
export default class ItemGatheringStorm extends ItemSpecial {
    private _counter: number = 0;
    private _currentCtlRate: number = 0;

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams): void {
        if (this.count <= 0) {
            return;
        }
        // 符合被当前核心子弹击杀条件
        if (dieParams.bullet === WarCoreManager.instance.warCore.weaponCtx.bullet) {
            let maxCtlRate: number = this.val_3;
            if (this._currentCtlRate >= maxCtlRate) {
                return;
            }
            this._counter++;
            if (this._counter >= 20) {
                this._currentCtlRate++;
                // TODO: 修改角色属性的暴击几率

                if (this._currentCtlRate >= maxCtlRate) {
                    // TODO: 修改分裂数
                }
            }
        }
    }

    public onUse() {
    }
}
