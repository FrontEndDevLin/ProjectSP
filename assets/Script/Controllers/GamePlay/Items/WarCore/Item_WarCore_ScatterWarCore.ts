/**
 * 散射核心道具类
 */
import WeaponManager from "../../../../CManager/WeaponManager";
import { GamePlayEventOptions, WarCoreInfo } from "../../../../Common/Namespace";
import { copyObject } from "../../../../Common/utils";
import Item_WarCore from "./Item_WarCore";

export default class Item_WarCore_ScatterWarCore extends Item_WarCore {
    public split: number = 3;
    public mirrorAttackRate: number = 0;
    // protected onInit() {
    //     // 在这里处理武器挂载
    //     console.log('Item_WarCore_ScatterWarCore onInit');
    // }
    public addSplit(split: number) {
        this.split += split;
        console.log('提升分裂数', this.split);
    }

    public addMirrorAttackRate(rate: number) {
        this.mirrorAttackRate += rate;
        console.log('镜像攻击概率', this.mirrorAttackRate);
    }

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.split.toString());
    }

    public onPassWave() {};

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};

    public onEnterWave() {}

    public onExitWave() {}
}
