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

interface WeaponInitOptions {
    // 道具引用(指向创建当前武器的道具, 当武器是敌人携带时, 为空)
    // itemRef: any;
    // 武器挂载节点
    mountNode: any;
}

export default class ItemSpec extends ItemBasic {
    // public weaponCtx: WeaponBase;
    public weaponCtx: WeaponBasic;

    protected onUse() {}

    protected onInit() {}

    public initWeapon(initOptions: WeaponInitOptions = { mountNode: null }) {
        if (!this.props.weapon) {
            return;
        }
        const weaponCtx: WeaponBasic = WeaponManager.instance.getIWeaponCtxById(this.props.weapon);
        if (!weaponCtx) {
            console.error('ItemSpec initWeapon weaponCtx is null');
            return;
        }
        this.weaponCtx = weaponCtx;
        if (this.props.quality) {
            // this.weaponCtx.setQuality(this.props.quality);
        }
        if (initOptions.mountNode) {
            // TODO
        }
        console.log('已挂载武器', this.weaponCtx);
    }

    public onPassWave() {};

    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {};

    public onEnterWave() {}

    public onExitWave() {}
}
