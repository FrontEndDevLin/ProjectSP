/**
 * 基础武器类
 * 所有武器的基类
 * 处理武器数据，包括武器类型、伤害值、攻击范围、攻击间隔等、武器类型（普通、远程）等。
 */

import { SpriteFrame } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { BoostConfig, BulletInfo, COLOR, Common, ITEM_QUALITY, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject, getDangerRichTxt, getFloatNumber, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import WeaponManager from "../../../CManager/WeaponManager";

export default class BaseWeapon {
    // 武器品质
    public quality: ITEM_QUALITY;

    // 当前武器数据
    public cur_inf: WeaponInfo.Weapon;
    // 原始武器数据
    public org_inf: WeaponInfo.Weapon;

    // 攻击行为, 子类需要实现, 暂时使用string类型
    protected attackBehavior: string;

    constructor(weaponId: string) {
        const weaponData: WeaponInfo.Weapon = WeaponManager.instance.getWeaponDataById(weaponId);
        this.cur_inf = weaponData;
        this.org_inf = copyObject(weaponData);
    }
}
