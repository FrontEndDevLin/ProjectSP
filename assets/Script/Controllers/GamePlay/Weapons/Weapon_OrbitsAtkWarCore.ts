import { getFloatNumber } from "../../../Common/utils";
import WeaponBase from "./WeaponBase";

export default class WeaponOrbits extends WeaponBase {
    private defaultRange: number;
    private defaultAtkSpd: number;
    private defaultLineSpd: number;

    protected correctPanel(): void {
        /**
         * 半径40, 攻速3s, ->默认线速度。将这三个参数保存下来
         * 提升半径时: 等比例调整攻速, 再根据角色攻速修正攻速, 线速度
         * 提升攻速时: 修正攻速, 线速度
         */
        console.log("属性升级触发回调")
    }

    private setDefaultVal() {
        let range: number = this.originData.range;
        let cd: number = this.originData.cd[this.quality - 1 || 0];
        this.defaultRange = range;
        this.defaultAtkSpd = cd;
        this.defaultLineSpd = getFloatNumber(2 * Math.PI * range / cd, 2);
    }
}
