import { Node, tween, UIOpacity, Vec3 } from "cc";
import WeaponManager from "db://assets/Script/CManager/WeaponManager";
import ItemsManager from "../../../../CManager/ItemsManager";
import WarCoreManager from "../../../../CManager/WarCoreManager";
import ItemSpec from "../ItemSpec";
import Weapon_Chr_FreeDroneUnit from "../../Weapons/Weapon_Chr_FreeDroneUnit";
import OBT from "db://assets/Script/OBT";
import { getRandomNumber, getRandomVector, transportWorldPosition } from "db://assets/Script/Common/utils";

/**
 * "自由无人机"核心升级包
 * 每4s, 朝随机位置发射1无人机, 自动攻击附近的敌人, 持续12s
 */

export interface FreeDroneNodeMap {
    [nodeId: string]: {
        node: Node,
        expireTime: number,
        ctx: Weapon_Chr_FreeDroneUnit,
        die: boolean
    };
}

export default class Item_UPack_FreeDrone extends ItemSpec {
    public val_1: number = 4;
    public val_2: number = 12;
    private _time: number = 0;

    private nodeMap: FreeDroneNodeMap = {};

    public getIntro(): string {
        let intro: string = this.props.intro;
        return intro.replace("o", this.val_1 + "").replace("b", this.val_2 + "");
    }

    public onEnterWave(): void {
        this._time = 0;
    }

    public onExitWave(): void {
        for (let nodeId in this.nodeMap) {
            let nodeInfo = this.nodeMap[nodeId];
            nodeInfo.ctx.destory();
            nodeInfo.ctx = null;
            nodeInfo.node.removeFromParent();
        }
        this.nodeMap = {};
    }

    public onUpdate(dt: number): void {
        this._time += dt;
        if (this._time >= this.val_1) {
            this._time = 0;
            // 发射无人机
            let weaponCtx: Weapon_Chr_FreeDroneUnit = <Weapon_Chr_FreeDroneUnit>WeaponManager.instance.getIWeaponCtxById("Weapon_Chr_FreeDroneUnit");
            weaponCtx.mountBehaviorModule(null);
            weaponCtx.updatePanel();
            this.nodeMap[weaponCtx.node.uuid] = {
                node: weaponCtx.node,
                expireTime: this.val_2,
                ctx: weaponCtx,
                die: false
            };

            let vector: Vec3 = getRandomVector();
            let moveDistance: number = getRandomNumber(180, 260);
            let startPosition: Vec3 = transportWorldPosition(this.weaponCtx.behaviorCtx.node.worldPosition);
            weaponCtx.node.setPosition(startPosition);
            let endPosition: Vec3 = new Vec3(
                startPosition.x + vector.x * moveDistance,
                startPosition.y + vector.y * moveDistance,
                startPosition.z + vector.z * moveDistance,
            );
            tween(weaponCtx.node)
                .to(2, { position: endPosition }, { easing: "linear" })
                .start();
        }

        for (let nodeId in this.nodeMap) {
            let nodeInfo = this.nodeMap[nodeId];
            nodeInfo.expireTime -= dt;
            if (nodeInfo.expireTime <= 0) {
                if (nodeInfo.die) {
                    continue;
                }
                nodeInfo.die = true;
                let node = nodeInfo.node;
                tween(node.getChildByName("Body").getComponent(UIOpacity))
                    .to(1, { opacity: 0 })
                    .call(() => {
                        node.removeFromParent();
                        delete this.nodeMap[nodeId];
                    })
                    .start();
                nodeInfo.ctx.destory();
                nodeInfo.ctx = null;
            } else {
                nodeInfo.ctx.runBehavior(dt);
            }
        }
    }

    public onUse() {
    }
}
