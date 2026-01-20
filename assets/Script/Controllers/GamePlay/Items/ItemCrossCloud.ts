import { v3 } from "cc";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import { GamePlayEventOptions } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";
import { getAngleByVector, getRandomNumber, getVectorByAngle } from "../../../Common/utils";

/**
 * "穿云"核心升级包
 * 获得穿透效果
 * 角色增加"穿透伤害"属性
 * 修改主核心的穿透值
 * 当主核心有穿透值时, 显示 穿透: XX
 */
export default class ItemCrossCloud extends ItemSpecial {
    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams): void {
        
    }

    public onUse() {
        WarCoreManager.instance.warCore.weaponCtx.setProps({ penetrate: this.val_1 });
    }
}
