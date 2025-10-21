import { _decorator, Component, find, Game, Node, Prefab, sp, v3, Vec3, Animation, NodePool, AnimationComponent } from 'cc';
const { ccclass, property } = _decorator;
import OBT_UIManager from '../Manager/OBT_UIManager';
import { EMYInfo, GameConfigInfo, GamePlayEvent, PIXEL_UNIT, Point, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Common/Namespace';
import { getFloatNumber, getRandomNumber } from '../Common/utils';
import OBT from '../OBT';
import ProcessManager from './ProcessManager';
import DBManager from './DBManager';
import { EmyParticleCtrl } from './Class/EmyParticleCtrl';
import { EMYBase } from '../Controllers/GamePlay/EMY/EMYBase';

export interface EnemyInfo {
    x?: number,
    y?: number,
    dis?: number,
    alive: number
}
interface EnemyMap {
    [nodeId: string]: EnemyInfo
}
interface EmyNodePoolMap {
    [emyId: string]: NodePool
}

export default class EMYManager extends OBT_UIManager {
    static instance: EMYManager = null;

    public abName: string = "GP";
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    public enemyRootNode: Node = null;
    public alertRootNode: Node = null;

    private _waveRole: GameConfigInfo.WaveRole;

    public enemyData: EMYInfo.EMYDBData;

    public particleCtrl: EmyParticleCtrl;

    // private _spawnRoles: any[] = [];
    /**
     * 维护一个敌人map表，每一帧更新坐标和是否存活，当敌人被消灭后，播放完阵亡动画后从表中移除
     */
    // 利用该计数器给敌人生成唯一id
    private createCounter: number = 0;
    public enemyMap: EnemyMap = {};

    private _alertNodePool: NodePool = null;

    private _emyNodePoolMap: EmyNodePoolMap = {};

    protected onLoad(): void {
        if (!EMYManager.instance) {
            EMYManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log("Enemy Manager loaded");

        this.enemyData = DBManager.instance.getDBData("EMY");

        this.particleCtrl = new EmyParticleCtrl();

        this._alertNodePool = new NodePool();
    }

    start() {
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_REDUCE_TINY, this._loadEnemy, this);
    }
    
    public preloadNode() {
        const preloadConfig: GameConfigInfo.PreloadConfig = ProcessManager.instance.waveRole.preload;
        this.preloadAlertNode(preloadConfig.alert);
        this.preloadEmyNode(preloadConfig.emy);
        this.particleCtrl.preloadParticle(preloadConfig.emy_particle);
    }

    public initRootNode() {
        this.alertRootNode = this.mountEmptyNode({ nodeName: "AlertBox", parentNode: ProcessManager.instance.unitRootNode });
        this.enemyRootNode = this.mountEmptyNode({ nodeName: "EnemyBox", parentNode: ProcessManager.instance.unitRootNode });
        this.particleCtrl.initRootNode();
    }

    // config -> [{ type: "EMY01", count: 10 }, { type: "PEACE", count: 1 }]
    protected preloadEmyNode(configList: GameConfigInfo.EmyPreloadConfig[]) {
        configList.forEach(config => {
            let { emyId, count } = config;
            let enemyProps: EMYInfo.EMYProps = this.enemyData[emyId];
            let scriptName = enemyProps.script || "EMYBase";
            if (!this._emyNodePoolMap[emyId]) {
                this._emyNodePoolMap[emyId] = new NodePool();
            }
            for (let i = this._emyNodePoolMap[emyId].size(); i < count; i++) {
                let enemyNode = this.loadPrefab({ prefabPath: `EMY/${emyId}`, scriptName });
                this._emyNodePoolMap[emyId].put(enemyNode);
            }
        })
    }
    public removeEmyNode(node: Node) {
        let type: string = node.name;
        this.enemyRootNode.removeChild(node);
        this._emyNodePoolMap[type].put(node);
    }

    protected preloadAlertNode(count: number) {
        for (let i = this._alertNodePool.size(); i < count; i++) {
            let alertNode = this.loadPrefab({ prefabPath: `EMY/EmyAlert`, scriptName: "NONE" });
            this._alertNodePool.put(alertNode);
        }
    }
    public recoverAlertNode(node: Node) {
        this.alertRootNode.removeChild(node);
        this._alertNodePool.put(node);
    }

    public startListen() {
        
    }

    // public getDBEnemyList(attrList: string[] = ['id']): any[] {
    //     if (!this.enemyData) {
    //         console.error("this.enemyData not loaded");
    //         return;
    //     }
    //     let list: any[] = [];
    //     for (let emyId in this.enemyData) {
    //         if (!emyId.includes("EMY")) {
    //             continue;
    //         }
    //         let emyItem = this.enemyData[emyId];
    //         let item = {};
    //         for (let key of attrList) {
    //             item[key] = emyItem[key];
    //         }
    //         list.push(item);
    //     }
    //     return list;
    // }

    private _roleMap: any = {
        // "timeNode": [
        //     { role: "normal", emy: 1, emyMax: 2 }
        // ]
    }
    public setSpawnRole(): boolean {
        this._waveRole = { ...ProcessManager.instance.waveRole };
        // 初始化spawned_count和next_spawn_time
        this._waveRole.spawn_roles.forEach((spawnRole: GameConfigInfo.EMYSpawnRole, i: number) => {
            spawnRole.spawn_total = spawnRole.spawn_total || 1;
            spawnRole.spawn_once_time = spawnRole.spawn_once_time || 1;
            spawnRole.start_delay = spawnRole.start_delay || 0;
            spawnRole.spawn_duration = spawnRole.spawn_duration || 1;
            spawnRole.spawn_count = Math.ceil(spawnRole.spawn_total / spawnRole.spawn_once_time);
            spawnRole.spawned_count = 0;
            spawnRole.next_spawn_time = getFloatNumber(this._waveRole.duration - spawnRole.start_delay);

            this.enemyData[spawnRole.enemy_type].hp = spawnRole.hp;
            this.enemyData[spawnRole.enemy_type].dmg = spawnRole.dmg;
            this.enemyData[spawnRole.enemy_type].spec_dmg = spawnRole.spec_dmg;
            this.enemyData[spawnRole.enemy_type].core = spawnRole.core;
        })
        return true;
    }

    /**
     * 
     * @param duration 剩余时间
     * @returns 
     */
    private _loadEnemy(duration: number) {
        // 利用spawned_count, next_spawn_time和duration来计算
        for (let spawnRole of this._waveRole.spawn_roles) {
            if (spawnRole.spwaned) {
                continue;
            }
            if (spawnRole.spawned_count >= spawnRole.spawn_count) {
                spawnRole.spwaned = true;
                continue;
            }
            // 波次总时间 - 刷出延迟 - 剩余时间 > 该组生成持续时间时，表示持续时间已过
            if (this._waveRole.duration - spawnRole.start_delay - duration > spawnRole.spawn_duration) {
                spawnRole.spwaned = true;
                continue;
            }
            if (spawnRole.next_spawn_time < duration) {
                continue;
            }

            let canCreate: boolean = true;
            let relation: string = "normal";
            if (spawnRole.spawn_mode === "random") {
                let rate: number = spawnRole.spawn_rate;
                let num = getRandomNumber(1, 100);
                // 命中，生成
                if (num > rate * 100) {
                    canCreate = false;
                } else {
                    // console.log('生成中立生物')
                    canCreate = true;
                }
                relation = "peace";
            }

            let createOptions: EMYInfo.CreateEMYParams = {
                enemyType: spawnRole.enemy_type,
                enemyCount: spawnRole.spawn_once_time,
                spawnPattern: spawnRole.spawn_pattern,
                spawnPoint: spawnRole.spawn_point,
                batchMode: spawnRole.batch_mode,
                relation
            }

            if (canCreate) {
                this.createEnemy(createOptions);
            }
            if (spawnRole.spawned_count + 1 <= spawnRole.spawn_count) {
                spawnRole.spawned_count++;
                const { start_delay, spawned_count, spawn_interval } = spawnRole;
                spawnRole.next_spawn_time = getFloatNumber(this._waveRole.duration - start_delay - spawned_count * spawn_interval, 1);
            } else {
                spawnRole.spwaned = false;
            }
        }
    }

    /**
     * 
     * @param type 敌人类型
     * @param count 生成的数量
     * @param pattern 生成位置模式
     * @param batchMode 批量生成模式
     */
    public createEnemy({ enemyType, enemyCount, spawnPattern, spawnPoint, batchMode = "normal", relation }: EMYInfo.CreateEMYParams) {
        // console.log(`生成${enemyCount}个${enemyType}类型的敌人, 生成位置模式为${pattern}, 批量生成模式为${batchMode}`);

        switch (batchMode) {
            case "normal": {
                if (!ProcessManager.instance.isOnPlaying()) {
                    return
                }
                for (let i = 0; i < enemyCount; i++) {
                    this._createAnEnemy({ enemyType, spawnPattern, spawnPoint }, (i + 1) * 60);
                }
            } break;
        }
    }
    private _createAnEnemy({ enemyType, spawnPattern, spawnPoint }: EMYInfo.CreateAnEnemyParams, delay: number = 0) {
        let loc: Vec3 = this._createEnemyLoc(spawnPattern, spawnPoint);
        // 生成警告标志
        let alertNode = this._alertNodePool.get();
        if (!alertNode) {
            alertNode = this.loadPrefab({ prefabPath: `EMY/EmyAlert`, scriptName: "NONE" });
        }
        alertNode.angle = getRandomNumber(0, 360);
        let { x, y } = loc;
        alertNode.setPosition(v3(x, y));
        let alertAnimation: AnimationComponent = alertNode.getComponent(Animation);
        setTimeout(() => {
            if (ProcessManager.instance.isOnPlaying()) {
                this.mountNode({ node: alertNode, parentNode: this.alertRootNode });
                alertAnimation.play("emy_alert");
            }
        }, delay);

        let enemyProps: EMYInfo.EMYProps = this.enemyData[enemyType];
        let scriptName: string = enemyProps.script || "EMYBase";
        let enemyNode = this._emyNodePoolMap[enemyType].get();
        if (!enemyNode) {
            enemyNode = this.loadPrefab({ prefabPath: `EMY/${enemyType}`, scriptName });
        }
        let enemyScript: EMYBase = <EMYBase>enemyNode.getComponent(scriptName);
        this.createCounter++;
        let nodeId: string = `${this.createCounter}`;
        enemyScript.init(enemyProps, nodeId);
        enemyNode.setPosition(v3(x, y));

        alertAnimation.once(Animation.EventType.FINISHED, () => {
            this.recoverAlertNode(alertNode);
            if (ProcessManager.instance.isOnPlaying()) {
                this.enemyMap[nodeId] = { x, y, dis: 0, alive: 1 };
                this.mountNode({ node: enemyNode, parentNode: this.enemyRootNode });
            }
        })
    }
    private _createEnemyLoc(pattern: string, spawnPoint: Point): Vec3 {
        let vec: Vec3 = v3(0, 0, 0);
        switch (pattern) {
            case "random": {
                vec = this._createRandomLoc();
            } break;
            case "fixed": {
                vec = v3(spawnPoint[0], spawnPoint[1], 0);
            } break;
        }
        return vec;
    }

    private _createRandomLoc() {
        let x = SCREEN_WIDTH / 2;
        let y = SCREEN_HEIGHT / 2;

        let locX = getRandomNumber(-x, x);
        let locY = getRandomNumber(-y, y);
        // let characterLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
        let characterLoc: Vec3 = v3(0, 0);
        let dis = Math.sqrt(Math.pow(locX - characterLoc.x, 2) + Math.pow(locY - characterLoc.y, 2));
        // 生成一个随机坐标，判断是否与角色距离过近（小于8个单位），如果过近重新生成
        if (dis < 8 * PIXEL_UNIT) {
            return this._createRandomLoc();
        }
        return v3(locX, locY);
    }

    public updateEnemy(nodeId: string, enemyInfo: EnemyInfo) {
        for (let k in enemyInfo) {
            if (!this.enemyMap[nodeId]) {
                continue;
            }
            this.enemyMap[nodeId][k] = enemyInfo[k];
        }
    }
    public removeEnemy(nodeId: string) {
        delete this.enemyMap[nodeId];
    }
    // 移除enemyRootNode下所有节点
    public removeAllEnemy() {
        const nodeList: Node[] = this.enemyRootNode.children;
        nodeList.forEach(node => {
            node.OBT_param2.fadeOut();
        });
        this.enemyMap = {};
    }
    public getNearestEnemy(nodeIdList: string[]): EnemyInfo {
        let min: number = 0;
        let target: string = null;
        for (let nodeId in nodeIdList) {
            if (!this.enemyMap[nodeId]) {
                continue;
            }
            let dis = this.enemyMap[nodeId].dis;
            if (!target) {
                min = dis;
                target = nodeId;
            } else {
                if (dis < min) {
                    min = dis;
                    target = nodeId;
                }
            }
        }
        return this.enemyMap[target];
    }

    public getEnemyDamage(enemyType: string, isSpec?: boolean): number {
        return isSpec ? (this.enemyData[enemyType].spec_dmg || 0) : this.enemyData[enemyType].dmg;
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_REDUCE_TINY, this._loadEnemy, this);
    }

    update(deltaTime: number) {
        
    }
}

