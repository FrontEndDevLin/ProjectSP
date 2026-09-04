import { v3, Vec3, Node } from "cc";
import { EmyBasic1 } from "../EMY/EmyBasic1";
import { getAngleByVector } from "../../../Common/utils";

export default class MoveBasic {
    public name: string = "Normal";
    protected isFaceToTarget: boolean;
    protected ref: EmyBasic1 = null;
    protected bodyNode: Node = null;
    public isCanMove: boolean = true;

    // 速度修正, 移动时优先使用修正后的速度, 没有修正速度时使用自身移速
    public boostSpeed: number = 0;

    constructor(ref: EmyBasic1) {
        this.ref = ref;
        this.bodyNode = ref.node;
        this.isFaceToTarget = ref.isFaceToTarget;
    }

    protected move(dt) {}

    public onInit() {}

    public runBehavior(dt: number) {
        if (!this.isCanMove) {
            return;
        }
        this.move(dt);
        this.doMove(dt);
    }

    // 移动时头始终朝向角色
    public faceToTarget() {
        if (this.isFaceToTarget) {
            let angle = getAngleByVector(this.ref.vector);
            // let angle = this.ref.getToCHRAngle();
            this.bodyNode.angle = angle;
        }
    }

    public doMove(dt: number) {
        if (this.ref.vector) {
            this.faceToTarget();
            let speed = dt * (this.boostSpeed || this.ref.props.spd);
            let newPos: Vec3 = this.bodyNode.position.add(new Vec3(this.ref.vector.x * speed, this.ref.vector.y * speed));
            this.bodyNode.setPosition(newPos);
        }
    }
}
