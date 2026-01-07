import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find, NodePool } from 'cc';
import OBT_UIManager from "../Manager/OBT_UIManager";
import ItemsManager from './ItemsManager';
import WarCoreManager from './WarCoreManager';
const { ccclass, property } = _decorator;

/**
 * 实时事件中心
 * 在需要实时(非异步)触发事件时, 调用该类, 并由该类处理分发事件
 */

export default class RealTimeEventManager extends OBT_UIManager {
    static instance: RealTimeEventManager = null;

    protected onLoad(): void {
        if (!RealTimeEventManager.instance) {
            RealTimeEventManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        // this._initBulletCldMap();
    }

    // 通过波次触发
    public onPassWave() {
        ItemsManager.instance.onRealTimeEvent('onPassWave')
        WarCoreManager.instance.onRealTimeEvent('onPassWave')
    }

    // 敌人死亡触发
    public onEnemyDie() {
        
    }
}
