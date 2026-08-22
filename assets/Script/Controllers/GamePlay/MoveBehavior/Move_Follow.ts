import { v3, Vec3 } from "cc";
import MoveBasic from "./MoveBasic";
import CHRManager from "../../../CManager/CHRManager";
import { getAngleByVector } from "../../../Common/utils";

export default class Move_Follow extends MoveBasic {
    public name: string = "Follow";

    protected move(dt: number) {
        let characterLoc: Vec3 = CHRManager.instance.getCHRLoc();
        this.ref.vector = v3(characterLoc.x - this.bodyNode.position.x, characterLoc.y - this.bodyNode.position.y).normalize();
    }
}
