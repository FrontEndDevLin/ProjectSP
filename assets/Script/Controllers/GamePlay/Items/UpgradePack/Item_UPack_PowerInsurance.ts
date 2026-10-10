import BulletManager from "db://assets/Script/CManager/BulletManager";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";

/**
 * "火力保障"核心升级包
 */
export default class Item_UPack_PowerInsurance extends ItemSpec {
    public val_1: number = 1;
    public val_2: number = 10;

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.val_1 + "").replace("b", this.val_2 + "");
    }

    public onUse() {
        WarCoreManager.instance.iWarCore.addWeaponCnt(this.val_1);
        WarCoreManager.instance.iWarCore.weaponCtx.updateBehaviorModule();

        // 修改所有无人机子弹的最低伤害为val_2
        BulletManager.instance.setMinDamage("CHR_Bullet_Drone", this.val_2);
    }
}
