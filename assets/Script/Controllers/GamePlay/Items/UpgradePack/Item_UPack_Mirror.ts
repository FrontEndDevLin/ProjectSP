import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";

/**
 * "镜像"核心升级包
 */
export default class Item_UPack_Mirror extends ItemSpec {
    public val_1: number = 0.5;

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", (this.val_1 * 100) + "%");
    }

    public onUse() {
        let warCore = <Item_WarCore_ScatterWarCore>WarCoreManager.instance.iWarCore;
        warCore.addMirrorAttackRate(this.val_1);

        // 激活"左右开弓-全功率"道具
        ItemsManager.instance.activeItems(["Item6"]);
    }
}
