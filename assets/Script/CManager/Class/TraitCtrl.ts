import { BaseCtrl } from "./BaseCtrl";
import DBManager from "../DBManager";
import Trait from "../../Trait/Trait";
import { Trait_def } from "../../Trait/Trait_def";
import { TraitInfo } from "../../Common/Namespace";

/**
 * 特性控制
 */

interface TraitMap {
    [traitName: string]: Trait;
}

export default class TraitCtrl extends BaseCtrl {
    static instance: TraitCtrl = null;

    protected traitMap: TraitMap = {};

    protected traitDBData: TraitInfo.TraitDBData = null;

    constructor() {
        super();
        
        this.traitDBData = DBManager.instance.getDBData("Trait");
    }

    public useTrait(traitName: string) {
        if (this.traitMap[traitName]) {
            this.traitMap[traitName].appendTrait();
        } else {
            let className: string = "Trait_" + traitName;
            let traitClass: Trait = Trait_def[className];
            let traitConfig: TraitInfo.TraitConfig = this.traitDBData.trait_def[traitName];
            if (traitClass) {
                this.traitMap[traitName] = new Trait_def[className](traitConfig);
                this.traitMap[traitName].applyTrait();
            }
        }
    }

    public getTraitRichTxt(traitName: string): string {
        let className: string = "Trait_" + traitName;
        let traitClass: Trait = Trait_def[className];
        let traitConfig: TraitInfo.TraitConfig = this.traitDBData.trait_def[traitName];
        if (traitClass) {
            return traitClass.getRichTxt(traitConfig);
        }
        return "";
    }
}
