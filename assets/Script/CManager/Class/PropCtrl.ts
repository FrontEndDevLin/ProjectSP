import { CHRInfo, COLOR, GamePlayEvent } from "../../Common/Namespace";
import { getFloatNumber, getRandomNumbers } from "../../Common/utils";
import OBT from "../../OBT";
import DBManager from "../DBManager";
import { BaseCtrl } from "./BaseCtrl";

/**
 * TODO: 升级逻辑
 * 根据角色等级决定刷新品质
 * 1-3 白色
 * 4 概率蓝色
 * 5 全蓝
 * 6-8 概率蓝色
 * 9 概率紫色
 * 10 全紫
 * 11-14 概率白、蓝、紫
 * 15 全紫
 * 16-18 概率白、蓝、紫
 * 19 概率白、蓝、紫、红
 * 20 全红
 * 逢5全红、其他都是概率白、蓝、紫、红
 * 
 * 考虑不同核心有没有对应的特殊属性(元素伤害？风、冰、火、雷)
 */

export default class PropCtrl2 extends BaseCtrl {
    public propDBData: CHRInfo.PropDBData;
    // 升级时，直接修改propMap里面的数据
    public propMap: CHRInfo.PropMap;
    public propGroup: CHRInfo.PropGroup;
    public qualityConfig: CHRInfo.QualityConfig;

    private _curHP: number = 0;

    // 可升级的属性(随机)
    public preUpgradeList: CHRInfo.upgradeProp[] = [];

    constructor() {
        super();

        this.propDBData = DBManager.instance.getDBData("CHRPropConfig");
        this.propMap = this.propDBData.prop_def;
        this.propGroup = this.propDBData.prop_group;
        this.qualityConfig = this.propDBData.quality_config;
    }

    public initHP() {
        let maxHP: number = this.propMap["hp"].val;
        this._curHP = maxHP;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.HP_CHANGE, this._curHP);
    }
    public addHP(n: number) {
        if (n === 0) {
            return;
        }
        if (n > 0) {
            let maxHP: number = this.propMap["hp"].val;
            if (this._curHP === maxHP) {
                return;
            }
            this._curHP = this._curHP + n > maxHP ? maxHP : this._curHP + n;
        } else {
            this._curHP = this._curHP + n < 0 ? 0 : this._curHP + n;
        }
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.HP_CHANGE, this._curHP);
    }
    public getCurrentHP(): number {
        return this._curHP;
    }

    private _getPropInfo(propKey: string): CHRInfo.Prop {
        return this.propMap[propKey];
    }
    // new ..
    public getPropBasicValue(propKey: string) {
        return this.propMap[propKey].basic_val;
    }
    public getPropValue(propKey: string) {
        return this.propMap[propKey].val;
    }
    public getPropRealValue(propKey: string): number {
        let prop: CHRInfo.Prop = this._getPropInfo(propKey);
        let basicVal: number = prop.basic_val;
        let val: number = prop.val;
        if (basicVal === 0) {
            if (prop.percent) {
                // 存在百分比类型的属性，但基础值为0(闪避)
                return val;
            } else {
                return val;
            }
        } else {
            if (prop.percent) {
                return getFloatNumber(basicVal + basicVal * val / 100, 4);
            } else {
                return basicVal + val;
            }
        }
    }

    private _getPropsList(group?: CHRInfo.GroupKeys): CHRInfo.Prop[] {
        const propList: CHRInfo.Prop[] = [];
        const propKeyList: string[] = this.propGroup[group];
        propKeyList.forEach(propKey => {
            propList.push(this.propMap[propKey])
        });
        return propList;
    }
    public getMainPropsList() {
        return this._getPropsList(CHRInfo.GroupKeys.major);
    }
    public getSubPropsList() {
        return this._getPropsList(CHRInfo.GroupKeys.sub);
    }

    // private _syncPropList() {
    //     this.propList.forEach(propAttr => {
    //         propAttr.value = this._props[propAttr.prop];
    //     });
    // }

    public initProps(props: CHRInfo.PropValMap) {
        for (let prop in props) {
            if (this.propMap[prop]) {
                this.propMap[prop].val = props[prop];
            }
        }

        // 保存对存档数据的引用，修改这里即可同步修改到存档
        // this._syncPropList();
    }

    private _getPreUpgradeProps(): string[] {
        // 主要属性才可升级
        let majorProps: string[] = this.propGroup[CHRInfo.GroupKeys.major];
        let randomIdxList: number[] = getRandomNumbers(0, majorProps.length - 1, 3);
        let props: string[] = [];
        for (let i = 0; i < randomIdxList.length; i++) {
            let idx: number = randomIdxList[i];
            props.push(majorProps[idx]);
        }
        return props;
    }

    // 获取升级列表
    public refreshPreUpgradeList() {
        let props: string[] = this._getPreUpgradeProps();
        const list: CHRInfo.upgradeProp[] = [];
        // TODO: level结合当前等级计算
        let level = 1;
        // TODO: 每一个主要属性设计一个图标，在这里可以返回，UI界面可以显示
        props.forEach(prop => {
            let propInfo: CHRInfo.Prop = this._getPropInfo(prop);
            list.push({
                prop,
                propTxt: propInfo.txt,
                icon: "",
                level,   // 品质
                // TODO: 需要根据当前角色等级，调整刷出 低级/中级/高级 升级属性的概率
                value: this.qualityConfig[prop][0],
                // pos: true -> 当value值为正数时，为正向buff；false -> value值为负数时，为正向buff
                // percent: propInfo.percent
            })
        })

        this.preUpgradeList = list;
        OBT.instance.eventCenter.emit(GamePlayEvent.STORE.LEVEL_UP_LIST_UPDATE);
        return true;
    }

    public upgradeProp(propKey: string): boolean {
        if (this.propGroup[CHRInfo.GroupKeys.major].indexOf(propKey) === -1) {
            return false;
        }
        if (!this.preUpgradeList.length) {
            return false;
        }
        // let prop: CHRInfo.upgradeProp;
        for (let item of this.preUpgradeList) {
            if (item.prop === propKey) {
                this.propMap[propKey].val += item.value;
                break;
            }
        }

        // 选择一个升级属性后不可再继续升级，所以清空
        this.preUpgradeList = [];

        // this._syncPropList();

        return true;
    }

    public upgradePropByBuff(buffList: CHRInfo.Buff[]): boolean {
        if (!buffList || !buffList.length) {
            return false;
        }
        buffList.forEach((buff: CHRInfo.Buff) => {
            this.propMap[buff.prop].val += buff.value;
        });
        return true;
    }

    // 获取buff文本，如+5生命
    public getBuffTxt(buff: CHRInfo.Buff) {
        let txt: string = "";
        let buffType: string = buff.type || "prop";
        if (buffType === "prop") {
            let prop: CHRInfo.Prop = this._getPropInfo(buff.prop);
            let oValue: number = buff.value;
            let value: string = `${oValue}`;
            if (oValue > 0) {
                value = `+${oValue}`;
            }
    
            if (prop.percent) {
                value = `${value}%`;
            }
            
            let color: string = this.getBuffTxtColor(buff);
            txt = `<color=${color}>${value}</color>${prop.txt}`;
        } else if (buffType === "event") {
            // let scriptName: string = buff.script;
            // txt = getScriptTypeItems(scriptName).getBuffTxt();
        }
        return txt;
    }
    public getBuffTxtColor(buff: CHRInfo.Buff): string {
        let prop: CHRInfo.Prop = this._getPropInfo(buff.prop);
        let value = buff.value;
        let forward_val: boolean = prop.forward_val;
        let color: string = "";
        if (value === 0) {
            color = COLOR.NORMAL;
        } else if (value > 0) {
            if (forward_val) {
                color = COLOR.SUCCESS;
            } else {
                color = COLOR.DANGER;
            }
        } else {
            if (forward_val) {
                color = COLOR.DANGER;
            } else {
                color = COLOR.SUCCESS;
            }
        }
        return color;
    }
}
