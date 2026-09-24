import Move_Follow from "./Move_Follow";
import { CreateDashMoveBehavior } from "./DashBasic";

export default class Move_FollowAndDash extends CreateDashMoveBehavior(Move_Follow) {
    public name: string = "FollowAndDash";
}
