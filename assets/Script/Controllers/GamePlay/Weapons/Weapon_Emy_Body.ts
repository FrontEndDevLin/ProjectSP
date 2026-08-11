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
import { MeleeBehavior_Emy_Body } from "../AtkBehavior/MeleeBehavior_Emy_Body";

/**
 * 敌人身体碰撞武器, 每个敌人都必须挂载
 * 创建敌人时, 挂载该武器, 由该类创建空节点预设体并挂载行为组件MeleeBehavior_Emy_Body
 * 行为组件再挂载碰撞体EMY_Body001
 */

export default class Weapon_Emy_Body extends WeaponBasic {
    // 武器品质
    public quality: ITEM_QUALITY;

    protected behavior: string = "MeleeBehavior_Emy_Body";
    // 行为组件
    public behaviorCtx: MeleeBehavior_Emy_Body;

    /**
     * TODO: 直接挂载到碰撞体节点上，不使用mountBehaviorModule
     */
    public mount() {

    }
}
