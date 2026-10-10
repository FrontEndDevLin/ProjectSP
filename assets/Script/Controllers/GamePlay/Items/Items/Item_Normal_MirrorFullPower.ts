import WarCoreManager from "db://assets/Script/CManager/WarCoreManager";
import CHRManager from "../../../../CManager/CHRManager";
import { CHRInfo } from "../../../../Common/Namespace";
import ItemSpec from "../ItemSpec";
import ItemSpecial from "../ItemSpecial";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";

/**
 * "镜像全功率"道具
 * "镜像"核心升级包的专属道具
 */
export default class Item_Normal_MirrorFullPower extends ItemSpec {
    protected val_1: number = 0.5;

    public onUse() {
        let warCore = <Item_WarCore_ScatterWarCore>WarCoreManager.instance.iWarCore;
        warCore.addMirrorAttackRate(this.val_1);
    }
}
