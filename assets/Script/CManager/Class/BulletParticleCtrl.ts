import { _decorator, Component, find, Node, v3, Vec3, NodePool } from 'cc';
import { BaseCtrl } from './BaseCtrl';
import OBT from '../../OBT';
import { getAngleByVector, getRandomNumber, getVectorByAngle } from '../../Common/utils';
import { BulletParticle } from '../../Controllers/GamePlay/Particle/BulletParticle';
import ProcessManager from '../ProcessManager';
const { ccclass, property } = _decorator;

/**
 * 子弹粒子管理
 */
export class BulletParticleCtrl extends BaseCtrl {
    static instance: BulletParticleCtrl = null;

    private _nodePool: NodePool;
    // 死亡粒子效果根节点
    public particleRootNode: Node = null;

    constructor() {
        super();
        if (!BulletParticleCtrl.instance) {
            BulletParticleCtrl.instance = this;
        } else {
            return BulletParticleCtrl.instance;
        }

        this._nodePool = new NodePool("BulletParticle");
    }

    public initRootNode() {
        this.particleRootNode = OBT.instance.uiManager.mountEmptyNode({ nodeName: "BulletParticleBox", parentNode: ProcessManager.instance.particleRootNode });
    }

    public preloadParticle(count: number) {
        this._nodePool.clear();

        for (let i = 0; i < count; i++) {
            let particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "Particle/BulletParticle" });
            this._nodePool.put(particleNode);
        }
    }

    public recoverParticle(node: Node) {
        this.particleRootNode.removeChild(node);
        this._nodePool.put(node);
    }

    public createDieParticle(loc: Vec3, vector: Vec3, speed: number, count: number) {
        let baseAngle: number = getAngleByVector(vector);
        for (let i = 0; i < count; i++) {
            let particleNode = this._nodePool.get();
            if (!particleNode) {
                particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "Particle/BulletParticle" });
            }
            let scale = getRandomNumber(0, 40) / 100 + 1;
            particleNode.setScale(v3(scale, scale, 0));

            let angle = getRandomNumber(baseAngle - 18, baseAngle + 18);
            let newVector = getVectorByAngle(angle);

            let scriptComp = <BulletParticle>particleNode.getComponent("BulletParticle");
            scriptComp.init({ vector: newVector, speed })

            particleNode.setPosition(loc);
            OBT.instance.uiManager.mountNode({ node: particleNode, parentNode: this.particleRootNode });
        }
    }
}


