import WarCoreManager from "../../../CManager/WarCoreManager";
import { getFloatNumber } from "../../../Common/utils";
import ItemOrbitsAtkWarCore from "./ItemOrbitsAtkWarCore";
import ItemSpecial from "./ItemSpecial";

/**
 * "扩张"核心升级包
 * 刀片长度+n%
 */
export default class ItemExtKnifeSize extends ItemSpecial {
    public onUse() {
        const warCore = <ItemOrbitsAtkWarCore>WarCoreManager.instance.warCore;
        warCore.sizeY = getFloatNumber(warCore.sizeY + this.val_1 / 100, 2);
    }
}
