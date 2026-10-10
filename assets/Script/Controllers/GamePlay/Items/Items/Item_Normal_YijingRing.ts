import CHRManager from "../../../../CManager/CHRManager";
import { CHRInfo } from "../../../../Common/Namespace";
import ItemSpec from "../ItemSpec";
import ItemSpecial from "../ItemSpecial";

export default class Item_Normal_YijingRing extends ItemSpec {
    protected val_1: number = 3;

    public onPassWave(): void {
        console.log('敌袭结束 +3%伤害')
        let buffList: CHRInfo.Buff[] = [{ prop: "dmg", value: this.val_1 * this.count }]
        CHRManager.instance.upgradePropByBuff(buffList);
    }
}
