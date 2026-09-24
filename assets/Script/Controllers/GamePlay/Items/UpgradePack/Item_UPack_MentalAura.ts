import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import { BehaviorBase } from "../../AtkBehavior/BehaviorBase";
import Weapon_Chr_BreakPunch from "../../Weapons/Weapon_Chr_BreakPunch";
import WeaponBasic from "../../Weapons/WeaponBasic";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";

/**
 * "气场"核心升级包
 */

export default class Item_UPack_MentalAura extends ItemSpec {
    public standing: boolean = false;

    public onStandingStatusEnter(): void {
        this.standing = true;
    }
    public onStandingStatusLeave(): void {
        this.standing = false;
    }

    public onUse() {
        // console.log(this)
    }
}
