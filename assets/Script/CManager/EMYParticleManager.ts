import { _decorator, Component, find, Game, Node, Prefab, sp, v3, Vec3, Animation, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import OBT_UIManager from '../Manager/OBT_UIManager';
import { EMYInfo, GameConfigInfo, GamePlayEvent, PIXEL_UNIT, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Common/Namespace';
import { getFloatNumber, getRandomNumber } from '../Common/utils';
import OBT from '../OBT';
import ProcessManager from './ProcessManager';
import DBManager from './DBManager';

export default class EMYParticleManager extends OBT_UIManager {
    static instance: EMYParticleManager = null;

    public abName: string = "GP";
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    // 死亡粒子效果根节点
    public dieParticleRootNode: Node = null;

    protected onLoad(): void {
        if (!EMYParticleManager.instance) {
            EMYParticleManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    public creqteDieParticle(loc: Vec3, count: number) {
        if (!this.dieParticleRootNode) {
            this.dieParticleRootNode = this.mountEmptyNode({ nodeName: "DieParticleBox", parentNode: this.rootNode });
        }
        for (let i = 0; i < count; i++) {
            let particleNode = this.loadPrefab({ prefabPath: "EMY/EmyDieParticle" });
            particleNode.setPosition(loc);
            this.mountNode({ node: particleNode, parentNode: this.dieParticleRootNode });
        }
    }

    start() {
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}

