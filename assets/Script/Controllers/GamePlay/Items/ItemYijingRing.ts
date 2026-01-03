import CHRManager from "../../../CManager/CHRManager";
import { CHRInfo } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";

export default class ItemYijingRing extends ItemSpecial {
    public onPassWave(): void {
        console.log('敌袭结束 +3%伤害')
        let buffList: CHRInfo.Buff[] = [{ prop: "dmg", value: this.val_1 * this.count }]
        CHRManager.instance.upgradePropByBuff(buffList);
    }
}
