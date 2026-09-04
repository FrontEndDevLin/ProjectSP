import { v3, Vec3 } from "cc";
import MoveBasic from "./MoveBasic";
import CHRManager from "../../../CManager/CHRManager";
import { getAngleByVector, getRandomNumber, getVectorByAngle } from "../../../Common/utils";

export default class Move_Drag extends MoveBasic {
    public name: string = "Drag";

    protected move(dt: number) {
        /**
         * 拉扯移动
         * 攻击距离>200, 当离角色距离>180, 向主角移动; <180并>150时, 不动;  <150时, 逃离主角
         */
        if (this.ref.dis > 180) {
            let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
            this.ref.vector = v3(characterLoc.x - this.bodyNode.position.x, characterLoc.y - this.bodyNode.position.y).normalize();
        } else {
            if (this.ref.dis > 150) {
                this.ref.vector = v3(0, 0, 0);
            } else {
                let angle: number = this.ref.getToCHRAngle();
                let randomAngle: number = getRandomNumber(angle - 30, angle + 30) - 180;
                this.ref.vector = getVectorByAngle(randomAngle);
            }
        }
    }
}
