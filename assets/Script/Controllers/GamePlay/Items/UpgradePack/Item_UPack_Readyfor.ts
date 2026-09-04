import { CHRInfo, GamePlayEventOptions } from "db://assets/Script/Common/Namespace";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";
import CHRManager from "db://assets/Script/CManager/CHRManager";

/**
 * "蓄势"核心升级包
 */
export default class Item_UPack_Readyfor extends ItemSpec {
    private _counter: number = 0;
    private _currentCtlRate: number = 0;

    public val_1: number = 20;
    public val_2: number = 1;
    public val_3: number = 40;
    public val_4: number = 1;

    public getIntro(): string {
        let intro: string = this.props.intro;
        intro = intro.replace("o", this.val_1 + "");
        intro = intro.replace("b", this.val_2 + "");
        intro = intro.replace("i", this.val_3 + "");
        intro = intro.replace("t", this.val_4 + "");
        return intro;
    }

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams): void {
        if (this.count <= 0) {
            return;
        }
        // 符合被当前核心子弹击杀条件
        if (dieParams.bullet === WarCoreManager.instance.iWarCore.weaponCtx.orgInf.bullet) {
            let maxCtlRate: number = this.val_3;
            if (this._currentCtlRate >= maxCtlRate) {
                return;
            }
            this._counter++;
            if (this._counter >= this.val_1) {
                this._currentCtlRate++;
                // 修改角色属性的暴击几率
                let buffList: CHRInfo.Buff[] = [{ prop: "ctl", value: this.val_2 }];
                CHRManager.instance.upgradePropByBuff(buffList);

                if (this._currentCtlRate >= maxCtlRate) {
                    // 修改分裂数
                    let warCore: Item_WarCore_ScatterWarCore = <Item_WarCore_ScatterWarCore>WarCoreManager.instance.iWarCore;
                    warCore.addSplit(this.val_4);
                }

                this._counter -= 20;
            }
        }
    }

    public onUse() {
    }
}
