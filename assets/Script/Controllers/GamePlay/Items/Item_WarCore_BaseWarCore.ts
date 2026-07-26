/**
 * 基础核心道具类
 */
import WeaponManager from "../../../CManager/WeaponManager";
import { GamePlayEventOptions, WarCoreInfo } from "../../../Common/Namespace";
import { copyObject } from "../../../Common/utils";
import Item_WarCore from "./Item_WarCore";

export default class Item_WarCore_BaseWarCore extends Item_WarCore {
    protected onInit() {
        // 在这里处理武器挂载
        console.log('Item_WarCore_BaseWarCore onInit');
    }

    public onPassWave() {};

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};

    public onEnterWave() {}

    public onExitWave() {}
}
