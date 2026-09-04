/**
 * 敌人身体碰撞武器
 */

import { BoostConfig, BulletInfo, COLOR, Common, ITEM_QUALITY, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject } from "../../../Common/utils";
import { MeleeBehavior_Emy_Body } from "../AtkBehavior/MeleeBehavior_Emy_Body";
import WeaponEmy from "./WeaponEmy";

/**
 * 敌人身体碰撞武器, 每个敌人都必须挂载
 * 创建敌人时, 挂载该武器, 由该类创建空节点预设体并挂载行为组件MeleeBehavior_Emy_Body
 * 行为组件再挂载碰撞体Emy_Body_xxx
 */

export default class Weapon_Emy_Body extends WeaponEmy {
    protected behavior: string = "MeleeBehavior_Emy_Body";
    // 行为组件
    public behaviorCtx: MeleeBehavior_Emy_Body;

    public onWeaponInit(): void {
        this.enemyRef.setBodyWeapon(this);
        this.enableBodyCollider();
    }
    public onWeaponRemove(): void {
        this.disableBodyCollider();
    }

    public enableBodyCollider() {
        this.behaviorCtx.setColliderEnabled(true);
    }
    public disableBodyCollider() {
        this.behaviorCtx.setColliderEnabled(false);
    }
}
