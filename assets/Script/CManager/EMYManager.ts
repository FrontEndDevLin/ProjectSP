import { _decorator, Component, find, Node, Prefab, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import OBT_UIManager from '../Manager/OBT_UIManager';
import { PIXEL_UNIT, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Common/Namespace';
import { getRandomNumber } from '../Common/utils';
import OBT from '../OBT';

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

        // EnemyDB = DBManager.instance.getDbData("Enemy");

        // TODO: 这里的enemyBox暂时在该方法里生成
        this.enemyRootNode = this.mountEmptyNode({ nodeName: "EnemyBox", parentNode: this.rootNode });

        // OO_AddManager(DropItemManager);
    }

    public createTempEnemy() {
        this._loadEnemy(false, 1);
        OBT.instance.printStructure();
    }

    public startListen() {
        // CountdownManager.instance.on(COUNTDOWN_EVENT.TIME_REDUCE_TINY, this._loadEnemy, this);
    }

    // public getDBEnemyList(attrList: string[] = ['id']): any[] {
    //     if (!EnemyDB) {
    //         console.error("EnemyDB not loaded");
    //         return;
    //     }
    //     let list: any[] = [];
    //     for (let emyId in EnemyDB) {
    //         if (!emyId.includes("EMY")) {
    //             continue;
    //         }
    //         let emyItem = EnemyDB[emyId];
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
    public setRoles(oRole: any): boolean {
        // console.log(oRole)
        let totalSeconds = oRole.seconds;
        let roles = oRole.roles;
        for (let role of roles) {
            // 刷新间隔
            let rfhTime = role.rfh_time;
            // 首次刷出延迟时间
            let fstRfhTime = role.fst_rfh_time || 0;
            // 首次刷出时间点
            let startTime = (role.time_node_start || totalSeconds) - fstRfhTime;
            // 结束刷出时间点
            let endTime = role.time_node_end || 0;
            // 刷出波次
            let rfhCnt = Math.floor((startTime - endTime) / rfhTime);
            let rfhSecondsList = [startTime];
            for (let i = 1; i <= rfhCnt; i++) {
                rfhSecondsList.push( Number((startTime - rfhTime * i).toFixed(1)) )
            }
            rfhSecondsList.forEach(seconds => {
                if (!this._roleMap[seconds]) {
                    this._roleMap[seconds] = [role];
                } else {
                    this._roleMap[seconds].push(role);
                }
            })
        }
        return true;
    }
    private _loadEnemy(err, seconds: number) {
        this.createEnemy();
        return;
        if (this._roleMap.hasOwnProperty(seconds)) {
            let timeRoles = this._roleMap[seconds];

            timeRoles.forEach(enemyItem => {
                let max = enemyItem.emy_max;
                let min = enemyItem.emy_min || max;
                let enemyCount = 0;
                if (max === min) {
                    enemyCount = max;
                } else {
                    enemyCount = Math.floor(Math.random() * (max - min + 1) + min);
                }
                // console.log(`生成${enemyCount}个敌人`)
                for (let i = 0; i < enemyCount; i++) {
                    this.createEnemy()
                }
            })
        }
    }

    /**
     * 临时方法，现用于给玩家角色测试使用
     */
    public initEnemy() {
        this.createEnemy();
    }

    public createEnemy() {
        let loc: Vec3 = this._createEnemyLoc();
        // "enemy/EMY001", "EnemyCtrl"
        let enemyNode = this.loadPrefab({ prefabPath: "EMY/EMY01", scriptName: "EMY" });
        let { x, y } = loc;
        enemyNode.setPosition(v3(x, y));
        this.enemyMap[enemyNode.uuid] = { x, y, dis: 0, alive: 1 };

        this.mountNode({ node: enemyNode, parentNode: this.enemyRootNode });
    }
    private _createEnemyLoc(): Vec3 {
        let x = SCREEN_WIDTH / 2;
        let y = SCREEN_HEIGHT / 2;

        let locX = getRandomNumber(-x, x);
        let locY = getRandomNumber(-y, y);
        // let characterLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
        let characterLoc: Vec3 = v3(0, 0);
        let dis = Math.sqrt(Math.pow(locX - characterLoc.x, 2) + Math.pow(locY - characterLoc.y, 2));
        // 生成一个随机坐标，判断是否与角色距离过近（小于8个单位），如果过近重新生成
        if (dis < 8 * PIXEL_UNIT) {
            return this._createEnemyLoc();
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
    // TODO:
    // public removeAllEnemy() {
    //     const nodeList: Node[] = this.rootNode.children;
    //     nodeList.forEach(node => {
    //         let ctx: EnemyCtrl = node.getComponent(EnemyCtrl);
    //         ctx.dieImmediate();
    //     });
    //     this.enemyMap = {};
    // }
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

    start() {

    }

    update(deltaTime: number) {
        
    }
}

