import Move_Drag from "./Move_Drag";
import Move_Follow from "./Move_Follow";
import Move_Surround from "./Move_Surround";
import MoveBasic from "./MoveBasic";
import Move_SurroundAndDash from "./Move_SurroundAndDash";

export namespace MoveBehavior_def {
    // Normal不会自主移动, 移动路径为EmyBasic的vector属性
    export const Normal = MoveBasic;
    export const Follow = Move_Follow;
    export const Surround = Move_Surround;
    export const Drag = Move_Drag;
    export const SurroundAndDash = Move_SurroundAndDash;
}
