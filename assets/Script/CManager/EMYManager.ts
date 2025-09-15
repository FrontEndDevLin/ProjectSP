import { _decorator, Component, find, Game, Node, Prefab, sp, v3, Vec3, Animation, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import OBT_UIManager from '../Manager/OBT_UIManager';
import { EMYInfo, GameConfigInfo, GamePlayEvent, PIXEL_UNIT, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Common/Namespace';
import { getFloatNumber, getRandomNumber } from '../Common/utils';
import OBT from '../OBT';
import ProcessManager from './ProcessManager';
import DBManager from './DBManager';
import { EmyParticleCtrl } from './Class/EmyParticleCtrl';

export interface EnemyInfo {
    x?: number,
    y?: number,
    dis?: number,
    alive: number
}
interface EnemyMap {
    [uuid: string]: EnemyInfo
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
    public enemyMap: EnemyMap = {};

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
    }

    start() {
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_REDUCE_TINY, this._loadEnemy, this);
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
            spawnRole.spawn_count = Math.ceil(spawnRole.spawn_total / spawnRole.spawn_once_time);
            spawnRole.spawned_count = 0;
            spawnRole.next_spawn_time = getFloatNumber(this._waveRole.duration - spawnRole.start_delay);

            this.enemyData[spawnRole.enemy_type].hp = spawnRole.hp;
            this.enemyData[spawnRole.enemy_type].dmg = spawnRole.dmg;
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
            this.createEnemy({
                enemyType: spawnRole.enemy_type,
                enemyCount: spawnRole.spawn_once_time,
                pattern: spawnRole.spawn_pattern,
                batchMode: spawnRole.batch_mode
            });
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
    public createEnemy({ enemyType, enemyCount, pattern, batchMode }: EMYInfo.CreateEMYParams) {
        if (!this.alertRootNode) {
            this.alertRootNode = this.mountEmptyNode({ nodeName: "AlertBox", parentNode: this.rootNode });
        }
        if (!this.enemyRootNode) {
            this.enemyRootNode = this.mountEmptyNode({ nodeName: "EnemyBox", parentNode: this.rootNode });
        }
        console.log(`生成${enemyCount}个${enemyType}类型的敌人, 生成位置模式为${pattern}, 批量生成模式为${batchMode}`);

        switch (batchMode) {
            case "normal": {
                if (!ProcessManager.instance.isOnPlaying()) {
                    return
                }
                for (let i = 0; i < enemyCount; i++) {
                    this._createAnEnemy({ enemyType, pattern }, (i + 1) * 60);
                }
            } break;
        }
    }
    private _createAnEnemy({ enemyType, pattern }: EMYInfo.CreateAnEnemyParams, delay: number = 0) {
        let loc: Vec3 = this._createEnemyLoc(pattern);
        // 生成警告标志
        let alertNode = this.loadPrefab({ prefabPath: `EMY/EmyAlert`, scriptName: "NONE" });
        alertNode.angle = getRandomNumber(0, 360);
        let { x, y } = loc;
        alertNode.setPosition(v3(x, y));
        setTimeout(() => {
            this.mountNode({ node: alertNode, parentNode: this.alertRootNode });
        }, delay);
        let enemyNode = this.loadPrefab({ prefabPath: `EMY/${enemyType}`, scriptName: "EMY" });
        enemyNode.OBT_param1 = this.enemyData[enemyType];
        enemyNode.setPosition(v3(x, y));

        alertNode.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            this.enemyMap[enemyNode.uuid] = { x, y, dis: 0, alive: 1 };
            alertNode.destroy();
            this.mountNode({ node: enemyNode, parentNode: this.enemyRootNode });
        })
    }
    private _createEnemyLoc(pattern: string): Vec3 {
        let x = SCREEN_WIDTH / 2;
        let y = SCREEN_HEIGHT / 2;

        let locX = getRandomNumber(-x, x);
        let locY = getRandomNumber(-y, y);
        // let characterLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
        let characterLoc: Vec3 = v3(0, 0);
        let dis = Math.sqrt(Math.pow(locX - characterLoc.x, 2) + Math.pow(locY - characterLoc.y, 2));
        // 生成一个随机坐标，判断是否与角色距离过近（小于8个单位），如果过近重新生成
        if (dis < 8 * PIXEL_UNIT) {
            return this._createEnemyLoc(pattern);
        }
        return v3(locX, locY);
    }

    public updateEnemy(uuid: string, enemyInfo: EnemyInfo) {
        for (let k in enemyInfo) {
            if (!this.enemyMap[uuid]) {
                continue;
            }
            this.enemyMap[uuid][k] = enemyInfo[k];
        }
    }
    public removeEnemy(uuid: string) {
        delete this.enemyMap[uuid];
    }
    // 移除enemyRootNode下所有节点
    public removeAllEnemy() {
        const nodeList: Node[] = this.enemyRootNode.children;
        nodeList.forEach(node => {
            node.OBT_param2.fadeOut();
        });
        this.enemyMap = {};
    }
    public getNearestEnemy(uuidList: string[]): EnemyInfo {
        let min: number = 0;
        let target: string = null;
        for (let uuid in uuidList) {
            if (!this.enemyMap[uuid]) {
                continue;
            }
            let dis = this.enemyMap[uuid].dis;
            if (!target) {
                min = dis;
                target = uuid;
            } else {
                if (dis < min) {
                    min = dis;
                    target = uuid;
                }
            }
        }
        return this.enemyMap[target];
    }

    public getEnemyDamage(enemyType: string): number {
        return this.enemyData[enemyType].dmg;
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_REDUCE_TINY, this._loadEnemy, this);
    }

    update(deltaTime: number) {
        
    }
}

