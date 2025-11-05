import { BaseCtrl } from "./BaseCtrl";
import DBManager from "../DBManager";
import Trait from "../../Trait/Trait";
import { Trait_def } from "../../Trait/Trait_def";

/**
 * 特性控制
 */

interface TraitMap {
    [traitName: string]: Trait;
}

export default class TraitCtrl extends BaseCtrl {
    static instance: TraitCtrl = null;

    protected traitMap: TraitMap = {};

    constructor() {
        super();
        if (!TraitCtrl.instance) {
            TraitCtrl.instance = this;
        } else {
            return TraitCtrl.instance;
        }
    }

    public useTrait(traitName: string) {
        if (this.traitMap[traitName]) {
            this.traitMap[traitName].appendTrait();
        } else {
            let className: string = "Trait_" + traitName;
            let traitClass: Trait = Trait_def[className];
            if (traitClass) {
                this.traitMap[traitName] = new Trait_def[className];
                this.traitMap[traitName].applyTrait();
            }
        }
    }

    public getTraitRichTxt(traitName: string) {

    }
}
