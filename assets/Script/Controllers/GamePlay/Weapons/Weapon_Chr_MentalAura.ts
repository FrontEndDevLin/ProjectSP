/**
 * 气场武器
 */
import WeaponBasic from "./WeaponBasic";
import Item_WarCore_RhombusPunch from "../Items/WarCore/Item_WarCore_RhombusPunchWarCore";
import { v3, Vec3 } from "cc";
import { RangeBehavior_Chr_FastShadow } from "../AtkBehavior/RangeBehavior_Chr_FastShadow";
import ItemBasic from "../Items/ItemBasic";
import Item_UPack_MentalAura from "../Items/UpgradePack/Item_UPack_MentalAura";

export default class Weapon_Chr_MentalAura extends WeaponBasic {
    protected showDamageTxt: boolean = false;
    protected behavior: string = "MeleeBehavior_Chr_MentalAura";

    public itemRef: Item_UPack_MentalAura;

    // protected weaponVec: Vec3[] = [v3(-20, 0, 0), v3(20, 0, 0)];
}
