/**
 * 基础武器类
 * 所有武器的基类
 * 处理武器数据，包括武器类型、伤害值、攻击范围、攻击间隔等、武器类型（普通、远程）等。
 */

import { SpriteFrame, Node, Component, v3, Vec3 } from "cc";
import CHRManager from "../../../CManager/CHRManager";
import { BoostConfig, BoostRealTimeConfig, BulletInfo, Camp, COLOR, Common, GamePlayEvent, ITEM_QUALITY, WarCoreInfo, WEAPON_TYPE, WeaponInfo } from "../../../Common/Namespace";
import { copyObject, getDangerRichTxt, getFloatNumber, getSuccessRichTxt } from "../../../Common/utils";
import OBT from "../../../OBT";
import BulletManager from "../../../CManager/BulletManager";
import WarCoreManager from "../../../CManager/WarCoreManager";
import WeaponManager from "../../../CManager/WeaponManager";
import OBT_UIManager, { NodeAndCxtComponent } from "../../../Manager/OBT_UIManager";
import { BehaviorBase } from "../AtkBehavior/BehaviorBase";
import ItemBasic from "../Items/ItemBasic";

export default class WeaponBasic {
    // 武器品质
    public quality: ITEM_QUALITY = ITEM_QUALITY.LV1;

    public enabled: boolean = true;

    // 攻击冷却
    public cd: number = 0;

    // 当前武器数据
    public curInf: WeaponInfo.WeaponRealTimeProps;
    // 原始武器数据
    public orgInf: WeaponInfo.IWeapon;

    // 行为, 子类需要赋值, 使用string类型
    protected behavior: string;
    // 预制体名称
    protected prefabName: string = "Default";
    // 行为组件
    public behaviorCtx: BehaviorBase;
    // 子行为组件(赝品武器), 当一个武器下有多个武器时(例如棱拳武器有2个拳头), 除了第一个武器其他的存入behaviorCtxs中, 他们共享一个WeaponCtx(this)
    public behaviorCtxs: BehaviorBase[] = [];
    protected weaponVec: Vec3[] = [];

    public node: Node;

    // 道具引用(指向创建当前武器的道具, 当武器是敌人携带时, 为空)
    public itemRef: ItemBasic;
    // // 武器挂载节点
    // public mountNode: any;

    protected showCdTxt: boolean = true;
    protected showDamageTxt: boolean = true;

    constructor(weaponData: WeaponInfo.IWeapon) {
        this.orgInf = weaponData;
        this.initCurInf();

        if (this.orgInf.camp === Camp.ALLY) {
            OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PROP_UPDATE, this.updatePanel, this);
        }
    }

    protected onUpgradeQuality() {}

    public upgradeQuality() {
        this.quality++;
        this.onUpgradeQuality();

        // 更新curInf
        this.updateCurInf();

        this.updatePanel();
    }

    protected updateCurInf() {
        let nAryKey = ["damage", "cd", "crit_rate"];
        for (let key in this.curInf) {
            if (nAryKey.indexOf(key) !== -1) {
                this.curInf[key] = this.orgInf[key][this.quality - 1] || this.orgInf[key][0];
            } else if (key === 'boost') {
                let boost = {};
                for (let propKey in this.orgInf[key]) {
                    boost[propKey] = this.orgInf[key][propKey][this.quality - 1] || this.orgInf[key][propKey][0];
                }
                this.curInf[key] = boost;
            } else {
                if (this.orgInf[key]) {
                    this.curInf[key] = this.orgInf[key];
                }
            }
        }
    }

    protected initCurInf() {
        let nAryKey = ["damage", "cd", "crit_rate"];
        let curInf: any = {};
        for (let key in this.orgInf) {
            if (key === 'penetrate') {
                curInf[key] = this.orgInf[key] || 0;
            } else if (nAryKey.indexOf(key) !== -1) {
                curInf[key] = this.orgInf[key][this.quality - 1] || this.orgInf[key][0];
            } else if (key === 'boost') {
                let boost = {};
                for (let propKey in this.orgInf[key]) {
                    boost[propKey] = this.orgInf[key][propKey][this.quality - 1] || this.orgInf[key][propKey][0];
                }
                curInf[key] = boost;
            } else {
                curInf[key] = this.orgInf[key];
            }
        }
        this.curInf = curInf;
    }

    public setItemRef(itemRef: ItemBasic) {
        this.itemRef = itemRef;
    }

    // 角色的武器
    public getRealDamage() {
        let quality: ITEM_QUALITY = this.quality;
        let baseDamage: number = this.orgInf.damage[quality - 1];
        if (this.curInf.camp === Camp.ENEMY) {
            return baseDamage;
        }
        let boost: BoostRealTimeConfig = this.curInf.boost;
        let boostDmg: number = 0;
        // 1. 结合角色属性和武器属性对dmg进行修正
        if (boost) {
            for (let prop in boost) {
                let rate: number = boost[prop] || 0;
                let value: number = CHRManager.instance.propCtx.getPropRealValue(prop) || 0;
                boostDmg += value * rate;
            }
        }
        // 2. 将第一步修正后的伤害与当前伤害百分比做计算
        let dmgVal: number = CHRManager.instance.propCtx.getPropRealValue("dmg");
        let finalDamage: number = Math.round((baseDamage + boostDmg) * dmgVal);

        // 最低伤害不可小于1
        if (finalDamage < 1) {
            finalDamage = 1;
        }
        return finalDamage;
    }

    public addPenetrate(penetrate: number) {
        if (typeof this.curInf.penetrate === 'number') {
            this.curInf.penetrate += penetrate;
        } else {
            this.curInf.penetrate = penetrate;
        }
    }

    /**
     * 角色属性变化时调用
     * 更新武器数据
     */
    public updatePanel() {
        if (!this.orgInf) {
            return;
        }
        // let isCurrentWarCoreBullet: boolean = true;
        let quality: ITEM_QUALITY = this.quality || 1;
        let crit: number;
        if (this.orgInf.crit_rate) {
            crit = CHRManager.instance.propCtx.getPropRealValue("ctl") / 100 + this.orgInf.crit_rate[quality - 1];
        }
        let cd: number = getFloatNumber(this.orgInf.cd[quality - 1] / CHRManager.instance.propCtx.getPropRealValue("atk_spd"), 3);
        let boostRange: number = CHRManager.instance.propCtx.getPropRealValue("range");
        // 近战武器范围收益减半, 在攻击范围变大100时, 以10%比例增加冷却时间
        if (this.curInf.type === WEAPON_TYPE.MELEE) {
            boostRange = Math.round(boostRange / 2);
            cd += getFloatNumber(boostRange * 0.001 * cd, 3);
        }
        let range: number = boostRange + this.orgInf.range;
        if (this.orgInf.min_range) {
            range = Math.max(range, this.orgInf.min_range);
        }
        this.curInf.crit_rate = crit;
        this.curInf.cd = cd;
        this.curInf.range = range;

        if (this.curInf.penetrate && this.curInf.penetrate !== 100) {
            let penetrate_damage = Math.round(this.curInf.damage * CHRManager.instance.propCtx.getPropRealValue("pen_dmg"));
            if (penetrate_damage <= 1) {
                penetrate_damage = 1;
            }
            if (penetrate_damage > this.curInf.damage) {
                penetrate_damage = this.curInf.damage;
            }
            this.curInf.penetrate_damage = penetrate_damage;
        }

        // this.base_dmg = bulletRealTimeAttr.base_dmg;
        if (this.orgInf.damage) {
            this.curInf.damage = this.getRealDamage();
        }
        if (this.behaviorCtx) {
            this.behaviorCtx.updateDomain();
        }
        for (let ctx of this.behaviorCtxs) {
            ctx.updateDomain();
        }
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
        let weaponCnt: number = 1;
        if (this.itemRef && this.itemRef.props.weapon_cnt) {
            weaponCnt = this.itemRef.props.weapon_cnt;
        }
        for (let i = 0; i < weaponCnt; i++) {
            const nodeAndCtx: NodeAndCxtComponent = WeaponManager.instance.loadPrefabAndScript({ prefabPath: `Weapon/${this.prefabName}`, scriptName: this.behavior });
            let behaviorCtx = nodeAndCtx.ctx as BehaviorBase;
            if (!behaviorCtx) {
                console.log(`武器行为组件未定义, 行为: `, nodeAndCtx);
                return;
            }
            if (i === 0) {
                this.behaviorCtx = behaviorCtx;
            } else {
                this.behaviorCtxs.push(behaviorCtx);
            }
            nodeAndCtx.node.setPosition(this.weaponVec[i] || v3(0, 0, 0));
            behaviorCtx.setWeaponRef(this);
            behaviorCtx.onInit();
            WeaponManager.instance.mountNode({ parentNode: mountNode, node: nodeAndCtx.node });
        }
    }

    public removeBehaviorModule() {
        if (this.behaviorCtx) {
            this.behaviorCtx.node.removeFromParent();
            this.behaviorCtx = null;
        }
        if (this.behaviorCtxs && this.behaviorCtxs.length) {
            this.behaviorCtxs.forEach(ctx => {
                ctx.node.removeFromParent();
            });
            this.behaviorCtxs = [];
        }
    }

    public getIntroRichTxt(): string {
        let introRichTxt: string = this.curInf.intro || "";
        const regex = /<%([^%]+)%>/g;
        const matches = introRichTxt.match(regex)?.map(m => m.replace(/^<%|%>$/g, '')) || [];
        if (matches.length) {
            matches.forEach((key) => {
                let val = this[key]
                introRichTxt = introRichTxt.replace(`<%${key}%>`, `<color=${COLOR.SUCCESS}>${val}</color>`);
            })
        }
        return introRichTxt;
    }

    public getPanelRichTxt(): string {
        let richTxtList: string[] = [];
        let dmgRichTxt: string = this.getDmgRichTxt();
        let ctlRichTxt: string = this.getCritRichTxt();
        let penRichTxt: string = this.getPenetrateRichTxt();
        let repelRichTxt: string = this.getRepelRichTxt();
        let cdRichTxt: string = this.getCdRichTxt();
        let rangeRichTxt: string = this.getRangeRichTxt();
        let splitDmgRateRichTxt: string = this.getSplitDmgRateRichTxt();
        if (dmgRichTxt) {
            richTxtList.push(dmgRichTxt);
        }
        if (ctlRichTxt) {
            richTxtList.push(ctlRichTxt);
        }
        if (penRichTxt) {
            richTxtList.push(penRichTxt);
        }
        if (cdRichTxt) {
            richTxtList.push(cdRichTxt);
        }
        if (repelRichTxt) {
            richTxtList.push(repelRichTxt);
        }
        if (rangeRichTxt) {
            richTxtList.push(rangeRichTxt);
        }
        if (splitDmgRateRichTxt) {
            richTxtList.push(splitDmgRateRichTxt);
        }

        let panelRichTxt = richTxtList.join("<br/>");

        return panelRichTxt;
    }

    // 获取伤害属性富文本
    protected getDmgRichTxt(): string {
        if (!this.showDamageTxt) {
            return "";
        }
        // , split
        const { damage, boost } = this.curInf;
        let quality: ITEM_QUALITY = this.quality || 1;
        let baseDmg: number = this.orgInf.damage[quality - 1];
        let dmgColor: string = damage >= baseDmg ? COLOR.SUCCESS : COLOR.DANGER;
        let dmgColorTxt: string = `<color=${dmgColor}>${damage}</color>`;
        // if (split && split > 0) {
        //     dmgColorTxt += `x<color=${COLOR.SUCCESS}>${split}</color>`;
        // }
        let boostTxt: string = "";
        if (boost) {
            for (let prop in boost) {
                let ico: string = CHRManager.instance.propCtx.getPropInfo(prop, "ico");
                boostTxt += `${(boost[prop] * 100).toFixed()}%<img src='${ico}' />`;
            }
        }
        return `伤害: ${dmgColorTxt}|${baseDmg}+${boostTxt}`;
    }
    // 获取贯穿属性文本
    protected getPenetrateRichTxt(): string {
        const { penetrate } = this.curInf;
        let pen_dmg: number = CHRManager.instance.propCtx.getPropRealValue("pen_dmg");
        if (penetrate && penetrate > 0 && penetrate !== 100 && pen_dmg && pen_dmg > 0) {
            // TODO: pen_dmg结合角色属性计算
            return `贯穿: ${ getSuccessRichTxt(penetrate) }|${ pen_dmg * 100 }%伤害`;
        }
        return "";
    }
    // 获取击退属性文本
    protected getRepelRichTxt(): string {
        return "";
        // let { realRepel, repel } = this.curInf;
        // if (!realRepel) {
        //     if (repel && repel.length) {
        //         realRepel = repel[WarCoreManager.instance.warCore.quality - 1];
        //     } else {
        //         return;
        //     }
        // }

        // if (realRepel <= 0) {
        //     return "";
        // }
        // return `击退: ${ getSuccessRichTxt(realRepel) }`;
    }
    // 获取暴击属性富文本
    protected getCritRichTxt(): string {
        let { crit_rate, crit_dmg_rate } = this.curInf;
        if (typeof crit_rate !== "number") {
            return "";
        }
        if (crit_dmg_rate) {
            let color: string = crit_rate >= this.orgInf.crit_rate[this.quality - 1] ? COLOR.SUCCESS : COLOR.DANGER;
            let colorTxt: string = `<color=${color}>${crit_rate * 100}%</color>`;
            return `暴击: ${crit_dmg_rate}倍|${colorTxt}概率`;
        }
        return "";
    }
    // 获取冷却属性富文本
    protected getCdRichTxt(): string {
        if (!this.showCdTxt) {
            return "";
        }
        let { cd } = this.curInf;
        if (typeof cd !== "number") {
            return "";
        }
        // let atkSpdVal: number = CHRManager.instance.propCtx.getPropRealValue("atk_spd");
        let color: string = cd <= this.orgInf.cd[this.quality - 1] ? COLOR.SUCCESS : COLOR.DANGER;
        let colorTxt: string = `<color=${color}>${cd}</color>`;
        return `冷却: ${colorTxt}s`;
    }
    // 获取范围属性富文本
    protected getRangeRichTxt() {
        const { range } = this.curInf;
        if (range) {
            let color: string = range >= 0 ? COLOR.SUCCESS : COLOR.DANGER;
            let colorTxt: string = `<color=${color}>${range}</color>`;
            return `范围: ${colorTxt}`;
        }
        return "";
    }
    // 获取分裂击中同一目标的伤害衰减
    protected getSplitDmgRateRichTxt(): string {
        // const { split_dmg_rate } = this;
        // if (split_dmg_rate) {
        //     let rateStr: string = split_dmg_rate * 100 + "%";
        //     if (split_dmg_rate >= 1) {
        //         rateStr = getSuccessRichTxt(rateStr);
        //     } else {
        //         rateStr = getDangerRichTxt(rateStr);
        //     }
        //     return `对相同目标伤害: ${ rateStr }`
        // }
        return "";
    }

    /**
     * 触发武器行为
     */
    public onWeaponRemove() {
    }
    public onWeaponInit() {
    }

    public runBehavior(deltaTime: number) {
        if (!this.enabled) {
            return;
        }
        if (this.behaviorCtx) {
            this.behaviorCtx.runBehavior(deltaTime);
        }
        this.behaviorCtxs.forEach(ctx => {
            ctx.runBehavior(deltaTime);
        });
    }
}
