import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find, NodePool } from 'cc';
import OBT_UIManager from "../Manager/OBT_UIManager";
import ItemsManager from './ItemsManager';
import WarCoreManager from './WarCoreManager';
import { GamePlayEventOptions } from '../Common/Namespace';
import MapManager from './MapManager';
import { BehaviorBase } from '../Controllers/GamePlay/AtkBehavior/BehaviorBase';
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

    // 进入战斗触发
    public onEnterWave() {
        ItemsManager.instance.onRealTimeEvent('onEnterWave');
        WarCoreManager.instance.onRealTimeEvent('onEnterWave');
    }

    // 结束战斗触发(失败/胜利均触发)
    public onExitWave() {
        ItemsManager.instance.onRealTimeEvent('onExitWave');
        WarCoreManager.instance.onRealTimeEvent('onExitWave');
    }

    // 通过波次触发
    public onPassWave() {
        ItemsManager.instance.onRealTimeEvent('onPassWave');
        WarCoreManager.instance.onRealTimeEvent('onPassWave');
    }

    // 核心攻击触发
    public onWarCoreAttack(behaviorRef?: BehaviorBase) {
        ItemsManager.instance.onRealTimeEvent('onWarCoreAttack', behaviorRef);
        WarCoreManager.instance.onRealTimeEvent('onWarCoreAttack', behaviorRef);
    }

    // "爆拳"核心攻击触发
    public onRhombusPunchBeforeAttack(RhombusPunchBeforeAttackParams: GamePlayEventOptions.RhombusPunchBeforeAttackParams) {
        ItemsManager.instance.onRealTimeEvent('onRhombusPunchBeforeAttack', RhombusPunchBeforeAttackParams);
        WarCoreManager.instance.onRealTimeEvent('onRhombusPunchBeforeAttack', RhombusPunchBeforeAttackParams);
    }
    public onRhombusPunchAttack(rhombusPunchAttackParams: GamePlayEventOptions.RhombusPunchAttackParams) {
        ItemsManager.instance.onRealTimeEvent('onRhombusPunchAttack', rhombusPunchAttackParams);
        WarCoreManager.instance.onRealTimeEvent('onRhombusPunchAttack', rhombusPunchAttackParams);
    }

    // 敌人死亡触发
    public onEnemyDie(dieParams: GamePlayEventOptions.EnemyDieParams) {
        WarCoreManager.instance.onRealTimeEvent('onEnemyDie', dieParams);
        ItemsManager.instance.onRealTimeEvent('onEnemyDie', dieParams);
    }

    // 敌人进入角色警戒范围
    public onAlertRangeEnemyEnter(alertEmyCount: number) {
        WarCoreManager.instance.onRealTimeEvent('onAlertRangeEnemyEnter', alertEmyCount);
        ItemsManager.instance.onRealTimeEvent('onAlertRangeEnemyEnter', alertEmyCount);
    }
    // 敌人离开角色警戒范围
    public onAlertRangeEnemyLeave(alertEmyCount: number) {
        WarCoreManager.instance.onRealTimeEvent('onAlertRangeEnemyLeave', alertEmyCount);
        ItemsManager.instance.onRealTimeEvent('onAlertRangeEnemyLeave', alertEmyCount);
    }

    // 角色进入站立状态
    public onStandingStatusEnter() {
        ItemsManager.instance.onRealTimeEvent('onStandingStatusEnter');
        WarCoreManager.instance.onRealTimeEvent('onStandingStatusEnter');
    }
    // 角色离开站立状态
    public onStandingStatusLeave() {
        ItemsManager.instance.onRealTimeEvent('onStandingStatusLeave');
        WarCoreManager.instance.onRealTimeEvent('onStandingStatusLeave');
    }

    // 暴击触发
    public onCtiticalAttack() {
        // MapManager.instance.onRealTimeEvent("onCtiticalAttack");
        MapManager.instance.shakeMap();
    }
}
