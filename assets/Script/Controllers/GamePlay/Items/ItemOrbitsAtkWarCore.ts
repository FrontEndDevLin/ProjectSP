import Profit from "../../../CManager/Class/Profit";
import { getFloatNumber } from "../../../Common/utils";
import ItemWarCore from "./ItemWarCore";

export default class ItemOrbitsAtkWarCore extends ItemWarCore {
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
