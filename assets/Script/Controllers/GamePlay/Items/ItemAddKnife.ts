import WarCoreManager from "../../../CManager/WarCoreManager";
import ItemSpecial from "./ItemSpecial";

/**
 * "接轨"核心升级包
 * 获得+n刀片
 */
export default class ItemAddKnife extends ItemSpecial {
    public onUse() {
        // 修改刀片数
        let count: number = WarCoreManager.instance.warCore.weaponCtx.count;
        let newCount: number = count ? count + this.val_1 : 0;
        if (newCount) {
            WarCoreManager.instance.warCore.weaponCtx.setProps({ count: newCount });
        }
    }
}
