/**
 * 特殊型道具类, 所有特殊型道具继承该类
 * 特殊型道具可能包含武器
 */

import WeaponManager from "../../../CManager/WeaponManager";
import { GamePlayEventOptions, ItemInfo, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject } from "../../../Common/utils";
import WeaponBasic from "../Weapons/WeaponBasic";
import WeaponBase from "../Weapons/WeaponBase";
import ItemBasic from "./ItemBasic";

export default class ItemSpec extends ItemBasic {
    // public weaponCtx: WeaponBase;
    public weaponCtx: WeaponBasic;

    protected onUse() {}

    protected onInit() {}

    public mountWeapon() {
        if (!this.props.weapon) {
            return;
        }
        const weaponCtx: WeaponBasic = WeaponManager.instance.getIWeaponCtxById(this.props.weapon);
        if (!weaponCtx) {
            console.error('ItemSpec mountWeapon weaponCtx is null');
            return;
        }
        this.weaponCtx = weaponCtx;
        if (this.props.quality) {
            // this.weaponCtx.setQuality(this.props.quality);
        }
        console.log('已挂载武器', this.weaponCtx);
    }

    public onPassWave() {};

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};

    public onEnterWave() {}

    public onExitWave() {}
}
