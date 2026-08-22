import { v3, Vec3 } from "cc";
import EmyEffect from "./EmyEffect";
import { Point } from "db://assets/Script/Common/Namespace";
import EMYManager from "db://assets/Script/CManager/EMYManager";

export default class EmyEffect_Elite01 extends EmyEffect {
    protected spriteNodePaths: string[] = ["Body/Shell", "Body/Core"];

    public breakShell() {
        this.animationComps[0].play("Break");

        let curPosition: Vec3 = this.ref.node.position;
        let shellBreakPoints: Vec3[] = [];

        let shellPoints: Point[] = <Point[]>this.ref.props.broken_point[0];
        shellPoints.forEach((point: Point) => {
            let relPoint: Vec3 = v3(point[0], point[1], 0).add(curPosition);
            shellBreakPoints.push(relPoint);
        });

        EMYManager.instance.particleCtrl.createGroupDieParticle(shellBreakPoints, 2);
        this.spriteNodes[0].active = false;
    }

    public breakCore() {
        let curPosition: Vec3 = this.ref.node.position;
        let coreBreakPoints: Vec3[] = [];

        let corePoints: Point[] = <Point[]>this.ref.props.broken_point[1];
        corePoints.forEach((point: Point) => {
            let relPoint: Vec3 = v3(point[0], point[1], 0).add(curPosition);
            coreBreakPoints.push(relPoint);
        });

        EMYManager.instance.particleCtrl.createGroupDieParticle(coreBreakPoints, 3);
    }
}
