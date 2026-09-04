import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
const { ccclass, property } = _decorator;

@ccclass('Emy_Witch')
export class Emy_Witch extends EmyBasic1 {
    // 跟随
    protected moveBehavior1: string = "Drag";

    protected weapon1: string = "Weapon_Emy_Witch";
    protected weapon2: string = "Weapon_Emy_RangeFlyBullet";

    protected effectName: string = "EmyEffect_Witch";
}

