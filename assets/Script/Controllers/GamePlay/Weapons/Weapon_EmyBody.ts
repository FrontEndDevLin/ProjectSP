/**
 * 敌人身体碰撞武器
 */

import { SpriteFrame } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { BoostConfig, BulletInfo, COLOR, Common, ITEM_QUALITY, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject, getDangerRichTxt, getFloatNumber, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import WeaponManager from "../../../CManager/WeaponManager";
import WeaponBasic from "./WeaponBasic";

// 定义武器预制体, 包含武器的模型, 和武器的行为脚本

export default class Weapon_EmyBody extends WeaponBasic {
    // 武器品质
    public quality: ITEM_QUALITY;

    protected behavior: string = "RangeBehavior_BaseFlyBullet";
    protected prefabName: string = "BaseFlyBullet";
}
