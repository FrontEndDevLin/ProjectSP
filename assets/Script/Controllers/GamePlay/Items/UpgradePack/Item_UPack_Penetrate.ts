import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";

/**
 * "贯穿"核心升级包
 */
export default class Item_UPack_Penetrate extends ItemSpec {
    public val_1: number = 2;

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.val_1 + "");
    }

    public onUse() {
        WarCoreManager.instance.iWarCore.weaponCtx.addPenetrate(this.val_1);
    }
}
