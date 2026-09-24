import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import { BehaviorBase } from "../../AtkBehavior/BehaviorBase";
import Weapon_Chr_BreakPunch from "../../Weapons/Weapon_Chr_BreakPunch";
import WeaponBasic from "../../Weapons/WeaponBasic";
import ItemSpec from "../ItemSpec";
import Item_WarCore_ScatterWarCore from "../WarCore/Item_WarCore_ScatterWarCore";

/**
 * "爆拳"核心升级包
 */

interface BehaviorMap {
    [uuid: string]: number
}

export default class Item_UPack_BreakPunch extends ItemSpec {
    public val_1: number = 3;
    public behaviorMap: BehaviorMap = {};
    public weaponCtx: Weapon_Chr_BreakPunch;

    public onRhombusPunchAttack({ behaviorRef, loc, vector }): void {
        let uuid = behaviorRef.uuid;
        if (this.behaviorMap[uuid]) {
            this.behaviorMap[uuid]++;
        } else {
            this.behaviorMap[uuid] = 1;
        }

        if (this.behaviorMap[uuid] >= this.val_1) {
            this.behaviorMap[uuid] = 0;
            this.weaponCtx.behaviorCtx.execCustomAttack(loc, vector);
            // console.log('触发爆炸拳', loc)
        }
    }

    public onUse() {
        console.log('挂载爆拳核心升级Core');
    }
}
