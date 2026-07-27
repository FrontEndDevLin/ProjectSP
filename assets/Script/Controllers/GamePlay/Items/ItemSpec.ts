/**
 * 特殊型道具类, 所有特殊型道具继承该类
 * 特殊型道具可能包含武器
 */

import WeaponManager from "../../../CManager/WeaponManager";
import { GamePlayEventOptions, ItemInfo, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject } from "../../../Common/utils";
import BaseWeapon from "../Weapons/BaseWeapon";
import WeaponBase from "../Weapons/WeaponBase";
import ItemBasic from "./ItemBasic";

export default class ItemSpec extends ItemBasic {
    public props: ItemInfo.I_Item | WarCoreInfo.I_WarCoreAttr;
    // public weaponCtx: WeaponBase;
    public weaponCtx: BaseWeapon;

    constructor(itemData: ItemInfo.I_Item) {
        super(null)
        if (itemData) {
            const props: ItemInfo.I_Item = copyObject(itemData);
            this.props = props;
            // if (itemData.global === ItemInfo.Global.ITEM) {
            //     let wave: number = ProcessManager.instance.waveRole.wave
            //     this.real_price = Math.round(this.props.price + wave + (this.props.price * 0.1 * wave) * CHRManager.instance.propCtx.getPropRealValue("item_price"));
            //     this.recover_price = Math.ceil(this.real_price * 0.25);
            // }
            this.mountWeapon();
        }

        this.onInit();
    }

    protected onInit() {}

    protected mountWeapon() {
        if (!this.props.weapon) {
            return;
        }
        const weaponCtx: BaseWeapon = WeaponManager.instance.getWeaponCtxById(this.props.weapon);
        if (!weaponCtx) {
            console.error('ItemSpec mountWeapon weaponCtx is null');
            return;
        }
        this.weaponCtx = weaponCtx;
        if (this.props.quality) {
            this.weaponCtx.setQuality(this.props.quality);
        }
    }

    public onPassWave() {};

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};

    public onEnterWave() {}

    public onExitWave() {}
}
