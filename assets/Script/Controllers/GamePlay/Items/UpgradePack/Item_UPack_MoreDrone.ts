import BulletManager from "db://assets/Script/CManager/BulletManager";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";

/**
 * "增援"核心升级包
 */
export default class Item_UPack_MoreDrone extends ItemSpec {
    public val_1: number = 2;
    public val_2: number = 120;

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.val_1 + "");
    }

    public onUse() {
        WarCoreManager.instance.iWarCore.addWeaponCnt(this.val_1);
        WarCoreManager.instance.iWarCore.weaponCtx.updateBehaviorModule();
        BulletManager.instance.setBoostSpeed("CHR_Bullet_Drone", this.val_2);
    }
}
