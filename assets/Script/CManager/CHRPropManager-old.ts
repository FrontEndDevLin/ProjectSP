import { _decorator, Component, Node, Prefab, UITransform, v3 } from 'cc';
import { BProp, Buff, CHTBaseProp, CHTCommonProp } from '../Interface';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { DBManager } from './DBManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { CEVENT_CHARACTER } from '../CEvent';
import { COLOR } from '../Common';
import { getScriptTypeItems } from '../ScriptTypeItems';
import OBT_UIManager from '../Manager/OBT_UIManager';
const { ccclass, property } = _decorator;

@ccclass('CharacterPropManager')
export class CharacterPropManager extends OBT_UIManager {
    private _CHTPropUINode: Node = null;

    static instance: CharacterPropManager;

    public baseProp: CHTBaseProp = null;

    // TODO: 还有一堆隐藏的属性，例如（远程伤害的加成提升50%）等

    public hp: BProp = createBProp({ key: "hp", label: "最大生命" });
    public hp_cur: BProp = createBProp({ key: "hp_cur", label: "当前生命" });
    public hp_floor: BProp = createBProp({ key: "hp_floor", label: "生命下限" });
    public spd: BProp = createBProp({ key: "spd", label: "速度" });
    public range: BProp = createBProp({ key: "range", label: "范围" });
    public atk_spd: BProp = createBProp({ key: "atk_spd", label: "攻击速度" });
    public dmg: BProp = createBProp({ key: "dmg", label: "伤害" });
    public range_dmg: BProp = createBProp({ key: "range_dmg", label: "远程伤害" });
    public melee_dmg: BProp = createBProp({ key: "melee_dmg", label: "近战伤害" });
    public def: BProp = createBProp({ key: "def", label: "防御" });
    public avd: BProp = createBProp({ key: "avd", label: "闪避" });
    public avd_ceil: BProp = createBProp({ key: "avd_ceil", label: "闪避上限" });

    public pick_range: BProp = createBProp({ key: "pick_range", label: "拾取范围" });
    public exp_eff: BProp = createBProp({ key: "exp_eff", label: "经验获取", percent: true });

    public propKeys: string[] = [
        "hp", "spd", "range", "atk_spd", "dmg",
        "range_dmg", "melee_dmg", "def", "avd",
        "avd_ceil", "pick_range", "exp_eff"
    ];
    public majorKeys: string[] = ["hp", "spd", "range", "atk_spd", "dmg", "range_dmg", "melee_dmg", "def", "avd"];
    public minorKeys: string[] = ["pick_range", "exp_eff"];

    protected onLoad(): void {
        if (!CharacterPropManager.instance) {
            CharacterPropManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.baseProp = DBManager.instance.getDBData("Character").base_prop;
    }

    start() {
    }

    public getPropList(group?: string): BProp[] {
        let tar = "propKeys";
        if (group === "major") {
            tar = "majorKeys";
        } else if (group === "minor") {
            tar = "minorKeys";
        }
        let keys: string[] = this[tar];
        let list: BProp[] = [];
        for (let key of keys) {
            let propItem: BProp = this[key];
            list.push(propItem);
        }
        return list;
    }

    // 商店界面，角色属性UI
    // public loadCHTPropUI(page: string = "store") {
    //     this._CHTPropUINode = OO_UIManager.instance.loadUINode("CHTPropUI");
    //     this._CHTPropUINode.OO_param1 = { page }
    //     OO_UIManager.instance.appendUINode(this._CHTPropUINode);
    // }
    // public showCHTPropUI() {
    //     this._CHTPropUINode.setPosition(0, 0);
    // }
    // public hideCHTPropUI() {
    //     this._CHTPropUINode.setPosition(1000, 0);
    // }
    // public removeCHTPropUI() {
    //     OO_UIManager.instance.removeUI("CHTPropUI");
    //     this._CHTPropUINode = null;
    // }
    public initProp() {
        this._initCommonProp();
    }
    // public recoverHP() {
    //     this.hp_cur.value = this.hp.value;
    // }
    // 升级提升属性接口
    // public levelUpProp(upProp: Buff) {
    //     let prop: BProp = this[upProp.prop];
    //     prop.value += upProp.value;
    //     this.runEventFn(CEVENT_CHARACTER.PROP_CHANGE, [upProp.prop]);
    // }
    // 获取buff文本，如+5生命
    // public getBuffTxt(buff: Buff) {
    //     let txt: string = "";
    //     let buffType: string = buff.type || "prop";
    //     if (buffType === "prop") {
    //         let prop: BProp = this[buff.prop];
    //         let oValue: number = buff.value;
    //         let value: string = `${oValue}`;
    //         if (oValue > 0) {
    //             value = `+${oValue}`;
    //         }
    
    //         if (prop.percent) {
    //             value = `${value}%`;
    //         }
            
    //         let color: string = this.getBuffTxtColor(buff);
    //         txt = `<color=${color}>${value}</color>${prop.label}`;
    //     } else if (buffType === "event") {
    //         let scriptName: string = buff.script;
    //         txt = getScriptTypeItems(scriptName).getBuffTxt();
    //     }
    //     return txt;
    // }
    // public getBuffTxtColor(buff: Buff): string {
    //     let prop: BProp = this[buff.prop];
    //     let value = buff.value;
    //     let buff_pos: boolean = prop.buff_pos;
    //     let color: string = "";
    //     if (value === 0) {
    //         color = COLOR.NORMAL;
    //     } else if (value > 0) {
    //         if (buff_pos) {
    //             color = COLOR.SUCCESS;
    //         } else {
    //             color = COLOR.DANGER;
    //         }
    //     } else {
    //         if (buff_pos) {
    //             color = COLOR.DANGER;
    //         } else {
    //             color = COLOR.SUCCESS;
    //         }
    //     }
    //     return color;
    // }
    // public updateProp(buffList: Buff[]) {
    //     let propList = [];
    //     for (let buff of buffList) {
    //         let type = buff.type || "prop";
    //         if (type === "prop") {
    //             let prop: BProp = this[buff.prop];
    //             prop.value += buff.value;
    //             propList.push(buff.prop);
    //         }
    //     }
    //     this.runEventFn(CEVENT_CHARACTER.PROP_CHANGE, propList);
    // }

    private _initCommonProp() {
        let commonProp: CHTCommonProp = DBManager.instance.getDBData("Character").common_prop;
        for (let key in commonProp) {
            if (key.indexOf("desc") != -1) {
                continue;
            }
            this[key].value = commonProp[key];
        }
    }

    update(deltaTime: number) {
        
    }
}

export const getCharacterPropValue = function(key: string, percent: boolean = true): number {
    if (!CharacterPropManager.instance) {
        console.error("CharacterPropManager未实例化!");
        return;
    }
    let prop: BProp = CharacterPropManager.instance[key];
    return percent ? prop.value / 100 : prop.value;
}

export const createBProp = function ({ key, label, value, group, buff_pos = true, percent = false }: BProp): BProp {
    return { key, label, group, value, buff_pos, percent }
}
