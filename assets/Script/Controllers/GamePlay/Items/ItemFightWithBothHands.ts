import ItemsManager from "../../../CManager/ItemsManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import ItemSpecial from "./ItemSpecial";

/**
 * "左右开弓"核心升级包
 */
export default class ItemFightWithBothHands extends ItemSpecial {
    public onUse() {
        let rate = WarCoreManager.instance.warCore.getProp("mirrorAttackRate");
        let newRate = rate ? rate + this.val_1 : this.val_1;
        WarCoreManager.instance.warCore.setProp("mirrorAttackRate", newRate);

        // 激活"左右开弓-全功率"道具
        ItemsManager.instance.activeItems(["Item6"]);
    }
}
