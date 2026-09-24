import { CHRInfo } from "db://assets/Script/Common/Namespace";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";
import CHRManager from "db://assets/Script/CManager/CHRManager";

/**
 * "困兽"核心升级包
 */
export default class Item_UPack_Besieged extends ItemSpec {
    public val_1: number = 1;
    private isBesieged: boolean = false;
    private buffId: string = "";

    public onAlertRangeEnemyEnter(alertEmyCount: number): void {
        if (alertEmyCount >= this.val_1) {
            if (this.isBesieged) {
                return;
            }
            this.upgradeProps();
            this.isBesieged = true;
        }
    }
    public onAlertRangeEnemyLeave(alertEmyCount: number): void {
        if (alertEmyCount < this.val_1) {
            if (!this.isBesieged) {
                return;
            }
            this.resetProps();
            this.isBesieged = false;
        }
    }

    private upgradeProps() {
        console.log('被包围, 提升属性')
        let buffList: CHRInfo.Buff[] = this.props.buff_list;
        let upgradeBuffList: CHRInfo.Buff[] = [];
        for (let buff of buffList) {
            if (buff.value && buff.value > 0) {
                upgradeBuffList.push(buff);
            }
        }
        this.buffId = CHRManager.instance.propCtx.upgradePropByTempBuff(upgradeBuffList, -1);
    }

    private resetProps() {
        console.log('解除包围, 恢复属性')
        CHRManager.instance.propCtx.removeTempBuff(this.buffId);
    }

    // public getIntro(): string {
    //     let intro: string = this.props.intro;
    //     return intro.replace("o", (this.val_1 * 100) + "%");
    // }

    public onUse() {
        // let warCore = <Item_WarCore_ScatterWarCore>WarCoreManager.instance.iWarCore;
        // warCore.addMirrorAttackRate(this.val_1);

        // // 激活"左右开弓-全功率"道具
        // ItemsManager.instance.activeItems(["Item6"]);
    }
}
