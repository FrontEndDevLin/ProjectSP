import CHRManager from "../CManager/CHRManager";
import Profit from "../CManager/Class/Profit";
import { CHRInfo } from "../Common/Namespace";
import { getFloatNumber } from "../Common/utils";
import ItemSpecial from "./ItemSpecial";

export default class ItemScatterAtkWarCore extends ItemSpecial {
    public onPassWave(): void {
        console.log('敌袭结束 +1%移动速度')
    }

    public onUse() {
        let value: number = this.val_1;
        let newValue: number = getFloatNumber(Profit.range_dmg + value, 2);
        Profit.setProfit({ range_dmg: newValue });
    }
}
