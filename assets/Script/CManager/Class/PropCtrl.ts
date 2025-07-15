import { CHRInfo } from "../../Common/Namespace";
import { BaseCtrl } from "./BaseCtrl";

export default class PropCtrl extends BaseCtrl {
    // 基准属性，不可修改
    private _basicProps: CHRInfo.CHRBasicProps;
    // 可修改
    private _props: CHRInfo.CHRProps;

    public propList: CHRInfo.CHRPropsAttr[] = [
        { prop: "hp", propTxt: "生命", group: "main", value: 0, percent: false, buffPos: true },
        { prop: "range", propTxt: "范围", group: "main", value: 0, percent: false, buffPos: true },
        { prop: "atk_spd", propTxt: "%攻击速度", group: "main", value: 0, percent: true, buffPos: true },
        { prop: "def", propTxt: "防御力", group: "main", value: 0, percent: false, buffPos: true },
        { prop: "spd", propTxt: "速度", group: "main", value: 0, percent: false, buffPos: true },
        { prop: "avd", propTxt: "%闪避", group: "main", value: 0, percent: false, buffPos: true },
        { prop: "exp_eff", propTxt: "%经验加成", group: "sub", value: 0, percent: true, buffPos: true },
        { prop: "pick_range", propTxt: "拾取范围", group: "sub", value: 0, percent: false, buffPos: true }
    ];

    constructor() {
        super();
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
        console.log(this.propList);
    }

    public initProps(basicProps: CHRInfo.CHRBasicProps, props: CHRInfo.CHRProps) {
        this._basicProps = basicProps;
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
}
