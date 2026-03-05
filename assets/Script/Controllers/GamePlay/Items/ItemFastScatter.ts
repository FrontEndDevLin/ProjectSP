import WarCoreManager from "../../../CManager/WarCoreManager";
import { CHRInfo, GamePlayEventOptions } from "../../../Common/Namespace";
import ItemSpecial from "./ItemSpecial";
import CHRManager from "../../../CManager/CHRManager";

/**
 * "急速散射"核心升级包
 * 在a次攻击过后, 接下来的b次攻击附带c攻速和d暴击几率
 */
export default class ItemFastScatter extends ItemSpecial {
    private onNormalAtk: boolean = true;
    private normalAtkCnt: number = 0;
    private specialAtkCnt: number = 0;

    public onPassWave(): void {
        if (!this.onNormalAtk) {
            this.resetProps();
        }

        this.onNormalAtk = true;
        this.normalAtkCnt = 0;
        this.specialAtkCnt = 0;
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
        console.log('提升属性')
        // CHRManager.instance.propCtx.getPropRealValue('atk_spd')
        // console.log()
    }

    private resetProps() {
        let buffList: CHRInfo.Buff[] = [
            { prop: "atk_spd", value: -this.val_3 },
            { prop: "ctl", value: -this.val_4 }
        ];
        CHRManager.instance.upgradePropByBuff(buffList);
        console.log('恢复属性')
    }

    public onUse() {
        
    }
}
