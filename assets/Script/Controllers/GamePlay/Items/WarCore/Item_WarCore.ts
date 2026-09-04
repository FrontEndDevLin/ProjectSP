/**
 * 特殊道具-核心道具基类
 */
import WeaponManager from "../../../../CManager/WeaponManager";
import { GamePlayEventOptions, ItemInfo, WarCoreInfo } from "../../../../Common/Namespace";
import { copyObject } from "../../../../Common/utils";
import ItemSpec from "../ItemSpec";

export default class Item_WarCore extends ItemSpec {
    public ico_gaming: string;
    public props: WarCoreInfo.I_WarCoreAttr;

    public onWarCoreAttack() {};
    protected onUpgradeQuality() {}

    public upgradeQuality() {
        // 核心等级和武器等级同步升级
        this.props.quality++;
        this.weaponCtx.upgradeQuality();
        this.onUpgradeQuality();
    }
}
