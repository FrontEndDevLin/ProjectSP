import WarCoreManager from "../../../CManager/WarCoreManager";
import { GamePlayEventOptions } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";

/**
 * "开花"核心升级包
 */
export default class ItemBlossom extends ItemSpecial {
    public onEmenyDie(dieParams: GamePlayEventOptions.EnemyDieParams): void {
        // 符合被当前核心子弹击杀条件
        if (dieParams.bullet === WarCoreManager.instance.warCore.weaponCtx.bullet) {
            // 开花代码
        }
    }

    public onUse() {
        let rate = WarCoreManager.instance.warCore.getProp("mirrorAttackRate");
        let newRate = rate ? rate + this.val_1 : this.val_1;
        WarCoreManager.instance.warCore.setProp("mirrorAttackRate", newRate);
    }
}
