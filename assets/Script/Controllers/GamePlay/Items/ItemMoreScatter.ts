import WarCoreManager from "../../../CManager/WarCoreManager";
import { CHRInfo, GamePlayEventOptions } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";
import CHRManager from "../../../CManager/CHRManager";

/**
 * "饱和散射"核心升级包
 * 获得n分裂
 */
export default class ItemMoreScatter extends ItemSpecial {
    public onUse() {
        // 修改分裂数
        let split: number = WarCoreManager.instance.warCore.weaponCtx.split;
        let newSplit: number = split ? split + this.val_1 : 0;
        if (newSplit) {
            WarCoreManager.instance.warCore.weaponCtx.setProps({ split: newSplit });
        }
    }
}
