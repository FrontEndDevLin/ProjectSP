import Profit from "../../../CManager/Class/Profit";
import { getFloatNumber } from "../../../Common/utils";
import ItemWarCore from "./ItemWarCore";

export default class ItemOrbitsAtkWarCore extends ItemWarCore {
    private defaultRange: number;
    private defaultAtkSpd: number;
    private defaultLineSpd: number;

    protected onInit(): void {
        console.log(this.weaponCtx)
        /**
         * 半径40, 攻速3s, ->默认线速度。将这三个参数保存下来
         * 提升半径时: 等比例调整攻速, 再根据角色攻速修正攻速, 线速度
         * 提升攻速时: 修正攻速, 线速度
         */
        this.setDefaultVal();
    }

    private setDefaultVal() {
        let range: number = this.weaponCtx.originData.range;
        let cd: number = this.weaponCtx.originData.cd[this.quality - 1 || 0];
        this.defaultRange = range;
        this.defaultAtkSpd = cd;
        this.defaultLineSpd = getFloatNumber(2 * Math.PI * range / cd, 2);
    }

    protected onUpgradeQuality(): void {
        this.setDefaultVal();
    }

    public onEnterWave(): void {
        console.log('展开刀片')
    }

    public onExitWave(): void {
        console.log('收起刀片')
    }

    public onPassWave(): void {
    }

    public onUse() {
        
    }
}
