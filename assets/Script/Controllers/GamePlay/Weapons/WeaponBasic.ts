/**
 * 基础武器类
 * 所有武器的基类
 * 处理武器数据，包括武器类型、伤害值、攻击范围、攻击间隔等、武器类型（普通、远程）等。
 */

import { SpriteFrame, Node, Component } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { BoostConfig, BulletInfo, COLOR, Common, ITEM_QUALITY, WarCoreInfo, WeaponInfo } from "../../../Common/Namespace";
import { copyObject, getDangerRichTxt, getFloatNumber, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import WeaponManager from "../../../CManager/WeaponManager";
import OBT_UIManager, { NodeAndCxtComponent } from "../../../Manager/OBT_UIManager";
import { BehaviorBase } from "../AtkBehavior/BehaviorBase";

export default class WeaponBasic {
    // 武器品质
    public quality: ITEM_QUALITY;

    // 攻击冷却
    public cd: number = 0;

    // 当前武器数据
    public curInf: WeaponInfo.IWeapon;
    // 原始武器数据
    public orgInf: WeaponInfo.IWeapon;

    // 行为, 子类需要赋值, 暂时使用string类型
    protected behavior: string;
    // 预制体名称
    protected prefabName: string;
    // 行为组件
    protected behaviorCtx: BehaviorBase;

    // 道具引用(指向创建当前武器的道具, 当武器是敌人携带时, 为空)
    // public itemRef: any;
    // // 武器挂载节点
    // public mountNode: any;

    constructor(weaponData: WeaponInfo.IWeapon) {
        this.curInf = weaponData;
        this.orgInf = copyObject(weaponData);
    }

    public finishAttack(): boolean {
        this.cd = this.curInf.cd[this.quality - 1] || this.curInf.cd[0];
        console.log(this.cd)
        return true;
    }

    public updatePanel() {
        if (!this.orgInf) {
            return;
        }
        // let isCurrentWarCoreBullet: boolean = true;
        // let bulletRealTimeAttr: BulletInfo.BulletRealTimeAttr = BulletManager.instance.getBulletRealTimeAttr(this.bullet, isCurrentWarCoreBullet);
        // let quality: ITEM_QUALITY = WarCoreManager.instance.warCore.quality || 1;
        // let ctl: number = CHRManager.instance.propCtx.getPropRealValue("ctl") + this.originData.ctl[quality - 1];
        // let cd: number = getFloatNumber(this.originData.cd[quality - 1] / CHRManager.instance.propCtx.getPropRealValue("atk_spd"), 3);
        // let range: number = CHRManager.instance.propCtx.getPropRealValue("range") + this.originData.range;

        // this.realCtl = ctl;
        // this.realCd = cd;
        // this.range = range;
        // this.base_dmg = bulletRealTimeAttr.base_dmg;
        // this.dmg = bulletRealTimeAttr.dmg;

        // this.correctPanel();
    }

    // 挂载攻击行为模块, 模块里实现挂载预制体, 警告检测, 攻击检测等
    public mountBehaviorModule(mountNode: Node) {
        if (!this.prefabName || !this.behavior) {
            console.log(`武器预设体或行为未定义, 预设体: ${this.prefabName}, 行为: ${this.behavior}`);
            return;
        }
        // 挂载对应武器的预制体, 和对应的行为脚本
        // 加载后拿到攻击行为脚本组件, 指向到 this.behavior
        const nodeAndCtx: NodeAndCxtComponent = WeaponManager.instance.loadPrefabAndScript({ prefabPath: `Weapon/${this.prefabName}`, scriptName: this.behavior });
        this.behaviorCtx = nodeAndCtx.ctx as BehaviorBase;
        this.behaviorCtx.setWeaponRef(this);
        WeaponManager.instance.mountNode({ parentNode: mountNode, node: nodeAndCtx.node });
    }

    public runBehavior(deltaTime: number) {
        if (this.behaviorCtx) {
            this.behaviorCtx.runBehavior(deltaTime);
        }
    }
}
