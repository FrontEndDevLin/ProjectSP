import { _decorator, Component, find, Node, v3, Vec3, NodePool } from 'cc';
import { BaseCtrl } from './BaseCtrl';
import OBT from '../../OBT';
import { getAngleByVector, getRandomNumber, getVectorByAngle } from '../../Common/utils';
const { ccclass, property } = _decorator;

/**
 * 子弹粒子管理
 */
export class BulletParticleCtrl extends BaseCtrl {
    static instance: BulletParticleCtrl = null;

    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

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

        this._nodePool = new NodePool();
    }

    // TODO: 还需要传入子弹向量，粒子的飞行弹道在30°内偏移
    public createDieParticle(loc: Vec3, vector: Vec3, speed: number, count: number) {
        if (!this.particleRootNode) {
            this.particleRootNode = OBT.instance.uiManager.mountEmptyNode({ nodeName: "BulletParticleBox", parentNode: this.rootNode });
        }
        let baseAngle: number = getAngleByVector(vector);
        console.log('基础角度:' + baseAngle)
        for (let i = 0; i < count; i++) {
            let particleNode = OBT.instance.uiManager.loadPrefab({ prefabPath: "Bullet/BulletParticle" });
            let scale = getRandomNumber(0, 40) / 100 + 1;
            particleNode.setScale(v3(scale, scale, 0));

            let angle = getRandomNumber(baseAngle - 30, baseAngle + 30);
            let newVector = getVectorByAngle(angle);

            particleNode.OBT_param1 = {
                vector: newVector,
                speed
            }

            particleNode.setPosition(loc);
            OBT.instance.uiManager.mountNode({ node: particleNode, parentNode: this.particleRootNode });
        }
    }
}


