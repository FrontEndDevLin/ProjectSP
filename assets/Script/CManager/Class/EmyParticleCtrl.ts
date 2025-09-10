import { _decorator, Component, find, Node, v3, Vec3 } from 'cc';
import { BaseCtrl } from './BaseCtrl';
import OBT from '../../OBT';
import { getRandomNumber } from '../../Common/utils';
const { ccclass, property } = _decorator;

/**
 * 敌人粒子管理
 */
export class EmyParticleCtrl extends BaseCtrl {
    static instance: EmyParticleCtrl = null;

    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    // 死亡粒子效果根节点
    public dieParticleRootNode: Node = null;

    constructor() {
        super();
        if (!EmyParticleCtrl.instance) {
            EmyParticleCtrl.instance = this;
        } else {
            return EmyParticleCtrl.instance;
        }
    }

    public createDieParticle(loc: Vec3, count: number) {
        if (!this.dieParticleRootNode) {
            this.dieParticleRootNode = OBT.instance.uiManager.mountEmptyNode({ nodeName: "DieParticleBox", parentNode: this.rootNode });
        }
        for (let i = 0; i < count; i++) {
            let particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "EMY/EmyDieParticle" });
            let scale = getRandomNumber(0, 40) / 100 + 1;
            particleNode.setScale(v3(scale, scale, 0));
            particleNode.setPosition(loc);
            OBT.instance.uiManager.mountNode({ node: particleNode, parentNode: this.dieParticleRootNode });
        }
    }
}


