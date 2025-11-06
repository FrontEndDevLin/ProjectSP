import CHRManager from "../CManager/CHRManager";
import Profit from "../CManager/Class/Profit";
import { CHRInfo, GamePlayEvent, TraitInfo } from "../Common/Namespace";
import { getFloatNumber, getSuccessRichTxt } from "../Common/utils";
import OBT from "../OBT";
import Trait from "./Trait";

export namespace Trait_def {
    // 远程伤害加成提升50%
    export class Trait_range_dmg_1 extends Trait {
        static getRichTxt(traitConfig: TraitInfo.TraitConfig): string {
            let propTxt: string = getSuccessRichTxt(CHRManager.instance.propCtx.getPropInfo(traitConfig.prop, "txt"));
            let value: number = <number>traitConfig.value;
            let valueTxt: string = getSuccessRichTxt(`+${value * 100}%`);
            return `${propTxt}的收益${valueTxt}`;
        }

        public applyTrait(): void {
            let value: number = <number>this.traitConfig.value;
            let newValue: number = getFloatNumber(Profit.range_dmg + value, 2);
            Profit.setProfit({ range_dmg: newValue });
        }

        public appendTrait(): void {}
    }

    // 敌袭结束后加移速
    export class Trait_pass_boost_spd_1 extends Trait {
        protected cnt: number = 0;

        static getRichTxt(traitConfig: TraitInfo.TraitConfig): string {
            let propTxt: string = getSuccessRichTxt(CHRManager.instance.propCtx.getPropInfo(traitConfig.prop, "txt"));
            let value: number = <number>traitConfig.value;
            let valueTxt: string = getSuccessRichTxt(`+${value}%`);
            return `敌袭结束后${valueTxt}${propTxt.replace("%", "")}`;
        }

        public applyTrait(): void {
            this.cnt++;
            OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_PASS, this.addSpd, this);
        }

        public appendTrait(): void {
            this.cnt++;
        }

        protected addSpd() {
            let value: number = <number>this.traitConfig.value;
            const buff: CHRInfo.Buff = { prop: this.traitConfig.prop, value: value * this.cnt };
            CHRManager.instance.upgradePropByBuff([buff]);
        }
    }
}
