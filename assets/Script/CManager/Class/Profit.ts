import { Common, GamePlayEvent } from "../../Common/Namespace";
import OBT from "../../OBT";

export default class Profit {
    static hp: number = 1;
    static dmg: number = 1;
    static range_dmg: number = 1;
    static melee_dmg: number = 1;
    static range: number = 1;
    static atk_spd: number = 1;
    static ctl: number = 1;
    static def: number = 1;
    static spd: number = 1;
    static avd: number = 1;
    static luck: number = 1;

    static setProfit(options: Common.SimpleObj) {
        if (options && Object.keys(options).length) {
            let updateKeys: string[] = [];
            for (let key in options) {
                if (typeof Profit[key] === "number") {
                    Profit[key] = options[key];
                    updateKeys.push(key);
                }
            }
            if (updateKeys.length) {
                OBT.instance.eventCenter.emit(GamePlayEvent.PROFIT.PROFIT_CHANGE, updateKeys);
            }
        }
    }
}
