import { CHRInfo, GamePlayEventOptions } from "db://assets/Script/Common/Namespace";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";
import CHRManager from "db://assets/Script/CManager/CHRManager";

/**
 * "超载"核心升级包
 */
export default class Item_UPack_Overload extends ItemSpec {
    private onNormalAtk: boolean = true;
    private normalAtkCnt: number = 0;
    private specialAtkCnt: number = 0;

    public val_1: number = 3;
    public val_2: number = 5;
    public val_3: number = 80;
    public val_4: number = 30;

    public getIntro(): string {
        let intro: string = this.props.intro;
        intro = intro.replace("o", this.val_1 + "");
        intro = intro.replace("b", this.val_2 + "");
        intro = intro.replace("i", this.val_3 + "");
        intro = intro.replace("t", this.val_4 + "");
        return intro;
    }

    public onWarCoreAttack(): void {
        if (this.onNormalAtk) {
            this.normalAtkCnt++;
            if (this.normalAtkCnt >= this.val_1) {
                // 暂时提升属性
                this.upgradeProps();
                this.onNormalAtk = false;
                this.specialAtkCnt = 0;
            }
        } else {
            this.specialAtkCnt++;
            if (this.specialAtkCnt >= this.val_2) {
                // 恢复属性
                this.resetProps();
                this.onNormalAtk = true;
                this.normalAtkCnt = 0;
            }
        }
    }

    private upgradeProps() {
        let buffList: CHRInfo.Buff[] = [
            { prop: "atk_spd", value: this.val_3 },
            { prop: "ctl", value: this.val_4 }
        ];
        CHRManager.instance.upgradePropByBuff(buffList);
    }

    private resetProps() {
        let buffList: CHRInfo.Buff[] = [
            { prop: "atk_spd", value: -this.val_3 },
            { prop: "ctl", value: -this.val_4 }
        ];
        CHRManager.instance.upgradePropByBuff(buffList);
    }

    public onUse() {
    }
}
