/**
 * 散射核心道具类
 */
import WeaponManager from "../../../CManager/WeaponManager";
import { GamePlayEventOptions, WarCoreInfo } from "../../../Common/Namespace";
import { copyObject } from "../../../Common/utils";
import Item_WarCore from "./Item_WarCore";

export default class Item_WarCore_ScatterWarCore extends Item_WarCore {
    public split: number = 3;
    // protected onInit() {
    //     // 在这里处理武器挂载
    //     console.log('Item_WarCore_ScatterWarCore onInit');
    // }

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.split.toString());
    }

    public onPassWave() {};

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};

    public onEnterWave() {}

    public onExitWave() {}
}
