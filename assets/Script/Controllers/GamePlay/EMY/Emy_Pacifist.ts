import { _decorator } from 'cc';
import { EmyBasic1 } from './EmyBasic1';
const { ccclass, property } = _decorator;

/**
 * 和平之星
 */
@ccclass('Emy_Pacifist')
export class Emy_Pacifist extends EmyBasic1 {
    // 跟随
    protected moveBehavior1: string = "";

    protected weapon1: string = "";
}

