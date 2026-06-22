import CHRManager from "../../../CManager/CHRManager";
import { getFloatNumber } from "../../../Common/utils";
import WeaponBase from "./WeaponBase";

export default class WeaponOrbits extends WeaponBase {
    private defaultRange: number;
    private defaultAtkSpd: number;

    protected init(): void {
        this.setDefaultVal();
    }

    protected onQualityChange(): void {
        this.setDefaultVal();
    }

    protected correctPanel(): void {
        /**
         * 半径40, 攻速3s, ->默认线速度。将这三个参数保存下来
         * 提升半径时: 等比例调整攻速, 再根据角色攻速修正攻速, 线速度
         * 提升攻速时: 修正攻速, 线速度
         */
        // console.log("属性升级触发回调")
        let range: number = this.range;
        // 对应当前范围的转速, 没有经过攻速属性修正
        let currentRangeCd: number = range * this.defaultAtkSpd / this.defaultRange;
        // 修正当前范围转速
        let realCd: number = getFloatNumber(currentRangeCd / CHRManager.instance.propCtx.getPropRealValue("atk_spd"), 3);
        this.realCd = realCd;
    }

    private setDefaultVal() {
        let range: number = this.originData.range;
        let cd: number = this.originData.cd[this.quality - 1 || 0];
        this.defaultRange = range;
        this.defaultAtkSpd = cd;
        // this.defaultLineSpd = getFloatNumber(2 * Math.PI * range / cd, 2);
    }
}
