import { GamePlayEventOptions } from "db://assets/Script/Common/Namespace";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Weapon_Chr_Fission from "../../Weapons/Weapon_Chr_Fission";

/**
 * "裂变"核心升级包
 */
export default class Item_UPack_Fission extends ItemSpec {
    public val_1: number = 3;
    public weaponCtx: Weapon_Chr_Fission;

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams): void {
        // 符合被当前核心子弹击杀条件
        if (dieParams.bullet === WarCoreManager.instance.iWarCore.weaponCtx.orgInf.bullet) {
            this.weaponCtx.behaviorCtx.execCustomAttack(dieParams, this.val_1);
        } else {
            console.log('非当前核心子弹击杀条件');
        }
    }

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.val_1.toString());
    }

    public onUse() {
    }
}
