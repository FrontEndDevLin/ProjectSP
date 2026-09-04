import { _decorator, v3, Vec3 } from "cc";
import { EmyEffect } from "./EmyEffect";
import { Point } from "db://assets/Script/Common/Namespace";
import EMYManager from "db://assets/Script/CManager/EMYManager";
const { ccclass, property } = _decorator;

@ccclass('EmyEffect_Witch')
export class EmyEffect_Witch extends EmyEffect {
    protected spriteNodePaths: string[] = ["PIC01", "PIC02"];
}
