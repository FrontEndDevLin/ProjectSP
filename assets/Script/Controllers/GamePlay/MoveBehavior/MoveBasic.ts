import { v3, Vec3, Node } from "cc";
import { EmyBasic1 } from "../EMY/EmyBasic1";
import { getAngleByVector } from "../../../Common/utils";

export default class MoveBasic {
    public name: string = "";
    protected isFaceToTarget: boolean;
    protected ref: EmyBasic1 = null;
    protected bodyNode: Node = null;
    public isCanMove: boolean = true;

    constructor(ref: EmyBasic1) {
        this.ref = ref;
        this.bodyNode = ref.node;
        this.isFaceToTarget = ref.isFaceToTarget;
    }

    protected move(dt) {}

    public runBehavior(dt: number) {
        if (!this.isCanMove) {
            return;
        }
        this.move(dt);
        if (this.ref.vector) {
            // 移动时头始终朝向角色
            if (this.isFaceToTarget) {
                let angle = getAngleByVector(this.ref.vector);
                this.bodyNode.angle = angle;
            }
            let speed = dt * this.ref.props.spd;
            let newPos: Vec3 = this.bodyNode.position.add(new Vec3(this.ref.vector.x * speed, this.ref.vector.y * speed));
            this.bodyNode.setPosition(newPos);
        }
    }
}
