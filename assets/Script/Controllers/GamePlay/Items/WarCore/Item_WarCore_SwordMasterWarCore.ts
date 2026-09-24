/**
 * 御剑核心道具类
 */
import WeaponManager from "../../../../CManager/WeaponManager";
import { GamePlayEventOptions, WarCoreInfo } from "../../../../Common/Namespace";
import { copyObject } from "../../../../Common/utils";
import Item_WarCore from "./Item_WarCore";

export default class Item_WarCore_SwordMasterWarCore extends Item_WarCore {
    public onPassWave() {};

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};

    public onEnterWave() {}

    public onExitWave() {}
}
