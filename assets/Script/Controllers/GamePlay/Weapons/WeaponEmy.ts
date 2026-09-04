import WeaponBasic from "./WeaponBasic";
import { EmyBasic1 } from "../EMY/EmyBasic1";
import { Camp, ITEM_QUALITY } from "../../../Common/Namespace";

export default class WeaponEmy extends WeaponBasic {
    public enemyRef: EmyBasic1;

    public setEnemyRef(enemyRef: EmyBasic1) {
        this.enemyRef = enemyRef;
    }

    public getRealDamage() {
        return this.curInf.damage;
        // let quality: ITEM_QUALITY = this.quality;
        // let baseDamage: number = this.orgInf.damage[quality - 1];
        // if (this.curInf.camp === Camp.ENEMY) {
        //     return baseDamage;
        // }
    }

    public updatePanel() {
        if (!this.orgInf) {
            return;
        }
    }
}
