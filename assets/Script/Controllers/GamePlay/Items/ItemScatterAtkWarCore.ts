import Profit from "../../../CManager/Class/Profit";
import { getFloatNumber } from "../../../Common/utils";
import ItemWarCore from "./ItemWarCore";

export default class ItemScatterAtkWarCore extends ItemWarCore {
    public onPassWave(): void {
        console.log('敌袭结束 +1%移动速度')
    }

    public onUse() {
        let value: number = this.val_1;
        let newValue: number = getFloatNumber(Profit.range_dmg + value, 2);
        Profit.setProfit({ range_dmg: newValue });
    }
}
