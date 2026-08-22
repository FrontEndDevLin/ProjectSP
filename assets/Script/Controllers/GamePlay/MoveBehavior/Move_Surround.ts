import { v3, Vec3 } from "cc";
import MoveBasic from "./MoveBasic";
import CHRManager from "../../../CManager/CHRManager";
import { getAngleByVector, getRandomNumber } from "../../../Common/utils";

export default class Move_Surround extends MoveBasic {
    public name: string = "Surround";

    // 获取角色相对于自身的夹角
    // protected getToCHRAngle(): number {
    //     const chrLoc: Vec3 = CHRManager.instance.getCHRLoc();
    //     const curLoc: Vec3 = this.node.position;
        
    //     let vecX = chrLoc.x - curLoc.x;
    //     let vecY = chrLoc.y - curLoc.y;
    //     let angle = Number((Math.atan(vecY / vecX) * (180 / Math.PI)).toFixed(2));
    //     if (vecX < 0) {
    //         if (vecY > 0) {
    //             angle += 180;
    //         } else {
    //             angle -= 180;
    //         }
    //     }
    //     return angle;
    // }
    // private _createVector(): Vec3 {
    //     let angle: number = this.getToCHRAngle();
    //     let randomAngle: number = getRandomNumber(angle - 60, angle + 60);
    //     return getVectorByAngle(randomAngle);
    // }

    protected move(dt: number) {
        // 环绕移动
        if (!this.ref.vector) {
            this.ref.vector = this.ref.createVector();
        }
        // 获取角色相对于自身的夹角
        let angle = this.ref.getToCHRAngle();
        // 当前向量于自身的夹角
        let curAngle: number = getAngleByVector(this.ref.vector);
        if (curAngle < angle - 60 || curAngle > angle + 60) {
            this.ref.vector = this.ref.createVector();
        } else if (getRandomNumber(1, 1000) <= 4) {
            // 0.4%概率改变方向
            this.ref.vector = this.ref.createVector();
        }
    }
}
