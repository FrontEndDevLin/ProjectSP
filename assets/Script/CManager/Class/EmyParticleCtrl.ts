import { _decorator, Component, find, Node, NodePool, v3, Vec3 } from 'cc';
import { BaseCtrl } from './BaseCtrl';
import OBT from '../../OBT';
import { getRandomNumber } from '../../Common/utils';
import { EmyDieParticle } from '../../Controllers/GamePlay/Particle/EmyDieParticle';
import ProcessManager from '../ProcessManager';
const { ccclass, property } = _decorator;

/**
 * 敌人粒子管理
 */
export class EmyParticleCtrl extends BaseCtrl {
    static instance: EmyParticleCtrl = null;

    private _nodePool: NodePool;
    // 死亡粒子效果根节点
    public dieParticleRootNode: Node = null;

    constructor() {
        super();
        if (!EmyParticleCtrl.instance) {
            EmyParticleCtrl.instance = this;
        } else {
            return EmyParticleCtrl.instance;
        }

        this._nodePool = new NodePool("EmyDieParticle");
    }

    public initRootNode() {
        this.dieParticleRootNode = OBT.instance.uiManager.mountEmptyNode({ nodeName: "DieParticleBox", parentNode: ProcessManager.instance.particleRootNode });
    }

    public preloadParticle(count: number) {
        for (let i = this._nodePool.size(); i < count; i++) {
            let particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "Particle/EmyDieParticle" });
            this._nodePool.put(particleNode);
        }
    }

    public recoverParticle(node: Node) {
        this.dieParticleRootNode.removeChild(node);
        this._nodePool.put(node);
    }

    public createDieParticle(loc: Vec3, count: number, fadeSpd?: number) {
        for (let i = 0; i < count; i++) {
            let particleNode = this._nodePool.get();
            if (!particleNode) {
                particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "EMY/EmyDieParticle" });
            }
            let scale = getRandomNumber(0, 40) / 100 + 1;
            particleNode.setScale(v3(scale, scale, 0));
            particleNode.setPosition(loc);
            let scriptComp = <EmyDieParticle>particleNode.getComponent("EmyDieParticle");
            scriptComp.init(fadeSpd);
            OBT.instance.uiManager.mountNode({ node: particleNode, parentNode: this.dieParticleRootNode });
        }
    }

    public createGroupDieParticle(locList: Vec3[], count: number) {
        locList.forEach((loc: Vec3) => {
            this.createDieParticle(loc, count, 100);
        })
    }
}


