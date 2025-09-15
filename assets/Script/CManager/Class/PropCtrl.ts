import { CHRInfo, COLOR, GamePlayEvent } from "../../Common/Namespace";
import { getRandomNumbers } from "../../Common/utils";
import OBT from "../../OBT";
import { BaseCtrl } from "./BaseCtrl";

export default class PropCtrl extends BaseCtrl {
    // 基准属性，不可修改
    private _basicProps: CHRInfo.CHRBasicProps;
    // 可修改
    private _props: CHRInfo.CHRProps;

    private _curHP: number = 0;

    public propList: CHRInfo.CHRPropsAttr[] = [
        { prop: "hp", propTxt: "生命", group: "main", value: 0, percent: false, buff_pos: true },
        { prop: "range", propTxt: "范围", group: "main", value: 0, percent: false, buff_pos: true },
        { prop: "dmg", propTxt: "伤害", group: "main", value: 0, percent: true, buff_pos: true },
        { prop: "atk_spd", propTxt: "%攻击速度", group: "main", value: 0, percent: true, buff_pos: true },
        { prop: "def", propTxt: "防御力", group: "main", value: 0, percent: false, buff_pos: true },
        { prop: "spd", propTxt: "速度", group: "main", value: 0, percent: false, buff_pos: true },
        { prop: "avd", propTxt: "%闪避", group: "main", value: 0, percent: false, buff_pos: true },
        { prop: "exp_eff", propTxt: "%经验加成", group: "sub", value: 0, percent: true, buff_pos: true },
        { prop: "pick_range", propTxt: "拾取范围", group: "sub", value: 0, percent: false, buff_pos: true }
    ];

    // able to update props list
    private _ableUpdatePropsList: string[] = ["hp", "range", "atk_spd", "def", "spd", "avd"];

    // 可升级的属性(随机)
    public preUpdateList: CHRInfo.UpdateProp[] = [];

    private _updateList = {
        hp: [3, 6, 9],
        range: [20, 40, 60],
        atk_spd: [3, 6, 9],
        def: [1, 2, 3],
        spd: [2, 4, 6],
        avd: [2, 4, 6]
    }

    constructor() {
        super();
    }

    public initHP() {
        let maxHP: number = this._props.hp;
        this._curHP = maxHP;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.HP_CHANGE, this._curHP);
    }
    public addHP(n: number) {
        if (n === 0) {
            return;
        }
        if (n > 0) {
            let maxHP: number = this._props.hp;
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

    private _getPropInfo(propKey: string): CHRInfo.CHRPropsAttr {
        let targetProp: CHRInfo.CHRPropsAttr;
        for (let props of this.propList) {
            if (props.prop === propKey) {
                targetProp = props;
                break;
            }
        }
        return targetProp;
    }

    private _getPropsList(group?: string): CHRInfo.CHRPropsAttr[] {
        const propsList: CHRInfo.CHRPropsAttr[] = [];
        this.propList.forEach(propItem => {
            if (group) {
                if (propItem.group === group) {
                    propsList.push(propItem);
                }
            } else {
                propsList.push(propItem);
            }
        });
        return propsList;
    }

    private _syncPropList() {
        this.propList.forEach(propAttr => {
            propAttr.value = this._props[propAttr.prop];
        });
    }

    public initProps(basicProps: CHRInfo.CHRBasicProps, props: CHRInfo.CHRProps) {
        this._basicProps = basicProps;
        // 保存对存档数据的引用，修改这里即可同步修改到存档
        this._props = props;
        this._syncPropList();
    }

    public getPropValue(propKey: string) {
        let basicVal: number = this._basicProps[`basic_${propKey}`];
        return basicVal ? basicVal + this._props[propKey] : this._props[propKey];
    }

    public getMainPropsList() {
        return this._getPropsList("main");
    }

    public getSubPropsList() {
        return this._getPropsList("sub");
    }

    private _getPreUpdateProps(): string[] {
        let randomIdxList: number[] = getRandomNumbers(0, this._ableUpdatePropsList.length - 1, 3);
        let props: string[] = [];
        for (let i = 0; i < randomIdxList.length; i++) {
            let idx: number = randomIdxList[i];
            props.push(this._ableUpdatePropsList[idx]);
        }
        return props;
    }

    // 获取升级列表
    public refreshPreUpdateList() {
        let props: string[] = this._getPreUpdateProps();
        const list: CHRInfo.UpdateProp[] = [];
        // TODO: 每一个主要属性设计一个图标，在这里可以返回，UI界面可以显示
        props.forEach(propKey => {
            let propInfo: CHRInfo.CHRPropsAttr = this._getPropInfo(propKey);
            list.push({
                prop: propKey,
                propTxt: propInfo.propTxt,
                icon: "",
                level: 1,   // 品质
                // TODO: 需要根据当前角色等级，调整刷出 低级/中级/高级 升级属性的概率
                value: this._updateList[propKey][0],
                // pos: true -> 当value值为正数时，为正向buff；false -> value值为负数时，为正向buff
                // percent: true -> 
            })
        })

        this.preUpdateList = list;
        OBT.instance.eventCenter.emit(GamePlayEvent.STORE.LEVEL_UP_LIST_UPDATE);
        return true;
    }

    public levelUpProp(propKey: string): boolean {
        if (this._ableUpdatePropsList.indexOf(propKey) === -1) {
            return false;
        }
        if (!this.preUpdateList.length) {
            return false;
        }
        // let prop: CHRInfo.UpdateProp;
        for (let item of this.preUpdateList) {
            if (item.prop === propKey) {
                this._props[propKey] += item.value;
                break;
            }
        }

        // 选择一个升级属性后不可再继续升级，所以清空
        this.preUpdateList = [];

        this._syncPropList();

        return true;
    }

    // 获取buff文本，如+5生命
    public getBuffTxt(buff: CHRInfo.Buff) {
        let txt: string = "";
        let buffType: string = buff.type || "prop";
        if (buffType === "prop") {
            let prop: CHRInfo.CHRPropsAttr = this._getPropInfo(buff.prop);
            let oValue: number = buff.value;
            let value: string = `${oValue}`;
            if (oValue > 0) {
                value = `+${oValue}`;
            }
    
            if (prop.percent) {
                value = `${value}%`;
            }
            
            let color: string = this.getBuffTxtColor(buff);
            txt = `<color=${color}>${value}</color>${prop.propTxt}`;
        } else if (buffType === "event") {
            // let scriptName: string = buff.script;
            // txt = getScriptTypeItems(scriptName).getBuffTxt();
        }
        return txt;
    }
    public getBuffTxtColor(buff: CHRInfo.Buff): string {
        let prop: CHRInfo.CHRPropsAttr = this._getPropInfo(buff.prop);
        let value = buff.value;
        let buff_pos: boolean = prop.buff_pos;
        let color: string = "";
        if (value === 0) {
            color = COLOR.NORMAL;
        } else if (value > 0) {
            if (buff_pos) {
                color = COLOR.SUCCESS;
            } else {
                color = COLOR.DANGER;
            }
        } else {
            if (buff_pos) {
                color = COLOR.DANGER;
            } else {
                color = COLOR.SUCCESS;
            }
        }
        return color;
    }
}
