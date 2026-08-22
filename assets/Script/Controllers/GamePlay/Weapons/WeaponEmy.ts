import WeaponBasic from "./WeaponBasic";
import { EmyBasic1 } from "../EMY/EmyBasic1";

export default class WeaponEmy extends WeaponBasic {
    public enemyRef: EmyBasic1;

    public setEnemyRef(enemyRef: EmyBasic1) {
        this.enemyRef = enemyRef;
    }
}
