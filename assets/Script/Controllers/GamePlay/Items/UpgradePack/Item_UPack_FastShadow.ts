import CHRManager from "db://assets/Script/CManager/CHRManager";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import { BehaviorBase } from "../../AtkBehavior/BehaviorBase";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";
import { getAngleByVector, getFloatNumber, getVectorByAngle } from "db://assets/Script/Common/utils";
import Weapon_Chr_FastShadow from "../../Weapons/Weapon_Chr_FastShadow";
import { GamePlayEventOptions } from "db://assets/Script/Common/Namespace";

/**
 * "残影"核心升级包
 */
export default class Item_UPack_FastShadow extends ItemSpec {
    public val_1: number = 80;
    public weaponCtx: Weapon_Chr_FastShadow;

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.val_1 + "");
    }

    public onRhombusPunchBeforeAttack(params: GamePlayEventOptions.RhombusPunchBeforeAttackParams): void {
        let atkSpd: number = CHRManager.instance.propCtx.getPropRealValue("atk_spd");
        if (getFloatNumber(atkSpd - 1) < getFloatNumber(this.val_1 / 100)) {
            console.log('攻速不足')
            return;
        }

        this.weaponCtx.behaviorCtx.exexCustomAttack(params);
    }

    public onUse() {
    }
}
