import { _decorator, Component, find, Node, v3, Vec3 } from 'cc';
import { BaseCtrl } from './BaseCtrl';
import OBT from '../../OBT';
import { getRandomNumber } from '../../Common/utils';
const { ccclass, property } = _decorator;

/**
 * 子弹粒子管理
 */
export class BulletParticleCtrl extends BaseCtrl {
    static instance: BulletParticleCtrl = null;

    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    // 死亡粒子效果根节点
    public particleRootNode: Node = null;

    constructor() {
        super();
        if (!BulletParticleCtrl.instance) {
            BulletParticleCtrl.instance = this;
        } else {
            return BulletParticleCtrl.instance;
        }
    }

    // TODO: 还需要传入子弹向量，粒子的飞行弹道在30°内偏移
    public createDieParticle(loc: Vec3, count: number) {
        if (!this.particleRootNode) {
            this.particleRootNode = OBT.instance.uiManager.mountEmptyNode({ nodeName: "BulletParticleBox", parentNode: this.rootNode });
        }
        for (let i = 0; i < count; i++) {
            let particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "Bullet/BulletParticle" });
            let scale = getRandomNumber(0, 40) / 100 + 1;
            particleNode.setScale(v3(scale, scale, 0));
            particleNode.setPosition(loc);
            OBT.instance.uiManager.mountNode({ node: particleNode, parentNode: this.particleRootNode });
        }
    }
}


