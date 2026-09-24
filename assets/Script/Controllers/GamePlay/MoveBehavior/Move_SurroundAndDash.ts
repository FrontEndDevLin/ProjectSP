import Move_Surround from "./Move_Surround";
import { CreateDashMoveBehavior } from "./DashBasic";

export default class Move_SurroundAndDash extends CreateDashMoveBehavior(Move_Surround) {
    public name: string = "SurroundAndDash";
}
