/**
 * 特殊型道具类, 所有特殊型道具继承该类
 */

import { GamePlayEventOptions } from "../../../Common/Namespace";
import ItemBase from "./ItemBase";

export default abstract class ItemSpecial extends ItemBase {
    public onPassWave() {};

    public onEmenyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};
}
