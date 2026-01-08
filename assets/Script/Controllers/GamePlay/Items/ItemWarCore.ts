/**
 * 核心道具类
 */
import WeaponManager from "../../../CManager/WeaponManager";
import { GamePlayEventOptions, WarCoreInfo } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";

export default class ItemWarCore extends ItemSpecial {
    public ico_gaming: string;
    public upgrade_pool: string[];

    constructor(warCoreData: WarCoreInfo.WarCore) {
        super(null);
        Object.assign(this, warCoreData)
        if (warCoreData.weapon) {
            this.weaponCtx = WeaponManager.instance.getWeaponCtxById(warCoreData.weapon);
        }
    }

    public onPassWave() {};

    public onEmenyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};
}
