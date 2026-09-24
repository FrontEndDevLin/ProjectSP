import { v3, Vec3, Node } from "cc";
import { EmyBasic1 } from "../EMY/EmyBasic1";
import { getAngleByVector } from "../../../Common/utils";
import { REPEL_TIME } from "../../../Common/Namespace";

export default class MoveBasic {
    public name: string = "Normal";
    protected isFaceToTarget: boolean;
    protected ref: EmyBasic1 = null;
    protected bodyNode: Node = null;
    public isCanMove: boolean = true;

    protected repelTime: number = 0;
    protected repelSpeed: number = 0;

    constructor(ref: EmyBasic1) {
        this.ref = ref;
        this.bodyNode = ref.node;
        this.isFaceToTarget = ref.isFaceToTarget;
    }

    protected move(dt) {}

    public onInit() {}
    public onDie() {
        this.repelTime = 0;
        this.repelSpeed = 0;
    }

    public runBehavior(dt: number) {
        if (!this.isCanMove) {
            return;
        }
        if (this.repelTime > 0) {
            this.repelTime -= dt;
        } else {
            this.move(dt);
        }
        this.doMove(dt);
    }
    public doRepel(repel: number) {
        this.repelTime = REPEL_TIME;
        this.repelSpeed = repel / REPEL_TIME;
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
            let speed: number;
            if (this.repelTime > 0) {
                speed = this.repelSpeed;
            } else {
                speed = this.ref.props.spd + this.ref.getBuffValue("spd");
            }
            this.faceToTarget();
            speed = dt * speed;
            let newPos: Vec3 = this.bodyNode.position.add(new Vec3(this.ref.vector.x * speed, this.ref.vector.y * speed));
            this.bodyNode.setPosition(newPos);
        }
    }
}
