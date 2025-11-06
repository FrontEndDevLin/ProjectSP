import CHRManager from "../CManager/CHRManager";
import Profit from "../CManager/Class/Profit";
import { TraitInfo } from "../Common/Namespace";
import { getFloatNumber, getSuccessRichTxt } from "../Common/utils";
import Trait from "./Trait";

export namespace Trait_def {
    export class Trait_range_dmg_1 extends Trait {
        static getRichTxt(traitConfig: TraitInfo.TraitConfig): string {
            let propTxt: string = getSuccessRichTxt(CHRManager.instance.propCtx.getPropInfo(traitConfig.prop, "txt"));
            let value: number = <number>traitConfig.value;
            let valueTxt: string = getSuccessRichTxt(`${value * 100}%`);
            return `${propTxt}的收益提升${valueTxt}`;
        }

        public applyTrait(): void {
            let value: number = <number>this.traitConfig.value;
            let newValue: number = getFloatNumber(Profit.range_dmg + value, 2);
            Profit.setProfit({ range_dmg: newValue });
        }

        public appendTrait(): void {}
    }
}
