import WeaponBasic from "./WeaponBasic";
import { EmyBasic1 } from "../EMY/EmyBasic1";
import { Camp, DifficultyInfo, ITEM_QUALITY } from "../../../Common/Namespace";
import DifficultyManager from "../../../CManager/DifficultyManager";
import ProcessManager from "../../../CManager/ProcessManager";

export default class WeaponEmy extends WeaponBasic {
    public enemyRef: EmyBasic1;

    public setEnemyRef(enemyRef: EmyBasic1) {
        this.enemyRef = enemyRef;
    }

    public getRealDamage() {
        let dmg = this.orgInf.damage[0];
        let { code } = this.enemyRef.props;
        let emyGrowth: DifficultyInfo.EmyGrowth = DifficultyManager.instance.getEnemyGrowth(code) || { dmg_growth: 0, hp_growth: 0 };
        return Math.round(dmg + dmg * emyGrowth.dmg_growth * (ProcessManager.instance.waveRole.wave - 1));
    }

    public updatePanel() {
        if (!this.orgInf) {
            return;
        }
        this.curInf.damage = this.getRealDamage();
        console.log('敌人伤害', this.curInf.damage);
    }
}
