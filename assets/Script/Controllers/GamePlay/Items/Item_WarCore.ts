/**
 * 特殊道具-核心道具基类
 */
import WeaponManager from "../../../CManager/WeaponManager";
import { GamePlayEventOptions, WarCoreInfo } from "../../../Common/Namespace";
import { copyObject } from "../../../Common/utils";
import ItemSpec from "./ItemSpec";

export default class Item_WarCore extends ItemSpec {
    public props: WarCoreInfo.I_WarCoreAttr;
    public ico_gaming: string;
    public upgrade_pool: string[];

    constructor(warCoreData: WarCoreInfo.I_WarCoreAttr) {
        super(warCoreData);
    }

    public onWarCoreAttack() {};
}
