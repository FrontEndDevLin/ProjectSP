import { _decorator, UITransform, v3, Vec3 } from "cc";
import { EmyEffect } from "./EmyEffect";
import { Point } from "db://assets/Script/Common/Namespace";
import EMYManager from "db://assets/Script/CManager/EMYManager";
const { ccclass, property } = _decorator;

@ccclass('EmyEffect_Mummy')
export class EmyEffect_Mummy extends EmyEffect {
    protected spriteNodePaths: string[] = ["Bone/bone1", "Bone/bone2"];

    public reset() {
        let bone1UITransform: UITransform = this.spriteNodes[0].getComponent(UITransform);
        let bone2UITransform: UITransform = this.spriteNodes[1].getComponent(UITransform);
        const W: number = 8;
        if (bone1UITransform.width !== W) {
            bone1UITransform.width = W;
        }
        if (bone2UITransform.width !== W) {
            bone2UITransform.width = W;
        }

        // this.dmgReduceRate = 0;
        // this.phase = 1;

        // TODO: 重置减伤率
    }
}
