import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
const { ccclass, property } = _decorator;

@ccclass('Emy_Goblin')
export class Emy_Goblin extends EmyBasic1 {
    // 跟随
    protected moveBehavior1: string = "Follow";

    protected weapon1: string = "Weapon_Emy_Goblin";
}

