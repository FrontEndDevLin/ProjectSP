import WarCoreManager from "db://assets/Script/CManager/WarCoreManager";
import CHRManager from "../../../../CManager/CHRManager";
import { CHRInfo } from "../../../../Common/Namespace";
import ItemSpec from "../ItemSpec";
import ItemSpecial from "../ItemSpecial";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";
import BulletManager from "db://assets/Script/CManager/BulletManager";

/**
 * "火力保障Plus"道具
 * "火力保障"核心升级包的专属道具
 */
export default class Item_Normal_Item30 extends ItemSpec {
    protected val_1: number = 2;

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.val_1 + "");
    }

    public onUse() {
        let currentMinDamage = BulletManager.instance.getMinDamage("CHR_Bullet_Drone");
        BulletManager.instance.setMinDamage("CHR_Bullet_Drone", currentMinDamage + this.val_1);
    }
}
