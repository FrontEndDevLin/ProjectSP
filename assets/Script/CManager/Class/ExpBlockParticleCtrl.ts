import { _decorator, Component, find, Node, v3, Vec3, NodePool } from 'cc';
import { BaseCtrl } from './BaseCtrl';
import OBT from '../../OBT';
import { getAngleByVector, getRandomNumber, getVectorByAngle } from '../../Common/utils';
import { ExpBlockParticle } from '../../Controllers/GamePlay/Particle/ExpBlockParticle';
import ProcessManager from '../ProcessManager';
const { ccclass, property } = _decorator;

/**
 * 经验块粒子管理
 */
export class ExpBlockParticleCtrl extends BaseCtrl {
    static instance: ExpBlockParticleCtrl = null;

    private _nodePool: NodePool;
    // 死亡粒子效果根节点
    public particleRootNode: Node = null;

    constructor() {
        super();
        if (!ExpBlockParticleCtrl.instance) {
            ExpBlockParticleCtrl.instance = this;
        } else {
            return ExpBlockParticleCtrl.instance;
        }

        this._nodePool = new NodePool("ExpBlockParticle");
    }

    public initRootNode() {
        this.particleRootNode = OBT.instance.uiManager.mountEmptyNode({ nodeName: "ExpBlockParticleBox", parentNode: ProcessManager.instance.particleRootNode });
    }

    public preloadParticle(count: number) {
        for (let i = this._nodePool.size(); i < count; i++) {
            let particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "Particle/ExpBlockParticle" });
            this._nodePool.put(particleNode);
        }
    }

    public recoverParticle(node: Node) {
        this.particleRootNode.removeChild(node);
        this._nodePool.put(node);
    }

    public createDieParticle(loc: Vec3, count: number) {
        for (let i = 0; i < count; i++) {
            let particleNode = this._nodePool.get();
            if (!particleNode) {
                particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "Particle/ExpBlockParticle" });
            }
            let scale = getRandomNumber(0, 40) / 100 + 1;
            particleNode.setScale(v3(scale, scale, 0));
            particleNode.setPosition(loc);
            let scriptComp = <ExpBlockParticle>particleNode.getComponent("ExpBlockParticle");
            scriptComp.init();
            OBT.instance.uiManager.mountNode({ node: particleNode, parentNode: this.particleRootNode });
        }
    }
}


