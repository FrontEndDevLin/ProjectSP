import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import MapManager from '../CManager/MapManager';
import CHRManager from '../CManager/CHRManager';
// import OBT from '../../OBT';
import EMYManager from '../CManager/EMYManager';
import GUI_GamePlayManager from '../CManager/GUI_GamePlayManager';
import OBT from '../OBT';
import { GAME_NODE, GameConfigInfo, GamePlayEvent } from '../Common/Namespace';
import DBManager from './DBManager';
import DropItemManager from './DropItemManager';
import SaveCtrl from './Class/SaveCtrl';
const { ccclass, property } = _decorator;

const LEVEL_UP_TIME: number = 10;
const PREPARE_TIME: number = 5;

/**
 * Game流程管理控制
 */
export default class ProcessManager extends OBT_UIManager {
    static instance: ProcessManager = null;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    // 当前节点 战斗中-升级中-备战中
    public gameNode: GAME_NODE;

    public gameConfig: GameConfigInfo.GameConfig;
    public waveRole: GameConfigInfo.WaveRole;

    public saveCtrl: SaveCtrl;

    // 持续时间
    private _duration: number = 0;
    private _tinyCd: number = 0;

    // 升级持续时间
    private _levelUpDuration: number = LEVEL_UP_TIME;
    private _levelUpSecond: number = 0;
    // 备战持续时间
    private _prepareDuration: number = PREPARE_TIME;
    private _prepareSecond: number = 0;

    start() {
        
    }

    protected onLoad(): void {
        if (!ProcessManager.instance) {
            ProcessManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        this.gameConfig = DBManager.instance.getDBData("GameConfig");

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_FINISH, this._finishLevelUp, this);
    }

    public initGUI() {
        MapManager.instance.initMap();
        CHRManager.instance.initCompass();
        CHRManager.instance.showCHR();
        GUI_GamePlayManager.instance.initGamePlayGUI();
        GUI_GamePlayManager.instance.initLevelUpGUI();
        GUI_GamePlayManager.instance.initPrepareGUI();
    }

    // 最开始
    public startGame(isNewGame: boolean): void {
        if (isNewGame) {
            // saveCtrl用普通类实现
            this.saveCtrl = new SaveCtrl();
            // 先加载存档，后续管理类再从存档中拿取数据
            this.saveCtrl.initSave();
            this._loadWave();
        } else {
            // 需要做读取存档时，判断storage里有没有存档，有则读取存档；没有则读取InitSave.json
            let hasSaveDoc: boolean = false;
        }

        // start 展示第1波UI，倒计时。 这一段用另外的方法包装
        CHRManager.instance.init(this.saveCtrl.save);

        EMYManager.instance.setSpawnRole();
        DropItemManager.instance.initRateMap();
        // end
        this._startWave();
    }

    public toWave() {

    }

    // 是否处于战斗中
    public isOnPlaying() {
        return this.gameNode === GAME_NODE.FIGHTING;
    }
    private preplay() {
        if (this.isOnPlaying()) {
            console.log("战斗中不可设置波次时间");
            return;
        }
        let duration: number = this.waveRole.duration;
        this._duration = Math.floor(duration);
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.TIME_INIT, this._duration);
    }
    private _startWave() {
        MapManager.instance.showMap();
        GUI_GamePlayManager.instance.showGamePlayGUI();
        CHRManager.instance.showCompass();
        this.gameNode = GAME_NODE.FIGHTING;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.FIGHT_START, this._duration);
    }
    private _passWave() {
        this.gameNode = GAME_NODE.PASS_FIGHT;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.FIGHT_PASS);

        EMYManager.instance.removeAllEnemy();
        DropItemManager.instance.resRecovery();

        // TODO: 每一帧检测还有没有回收中的块，直到没有，1秒后进入下一环节
        this.scheduleOnce(() => {
            // TODO: 移除所有进行中的项目：GUI
            this._setGameNode();
            this._nextStep();
        }, 2)
    }
    private _finishLevelUp() {
        this.gameNode = GAME_NODE.PASS_LEVEL_UP;
        this.scheduleOnce(() => {
            GUI_GamePlayManager.instance.hideLevelUpGUI();
            this._setGameNode();
            this._nextStep();
        }, 1)
    }
    private _finishPrepare() {
        this.gameNode = GAME_NODE.PASS_PREPARE;
        this.scheduleOnce(() => {
            GUI_GamePlayManager.instance.hidePrepareGUI();
            this._setGameNode();
            this._nextStep();
        }, 1)
    }
    // 根据当前过渡节点，设置下一节点
    private _setGameNode() {
        let currentGameNode: GAME_NODE = this.gameNode;
        switch (currentGameNode) {
            case GAME_NODE.PASS_FIGHT:
            case GAME_NODE.PASS_LEVEL_UP: {
                let levelUpCnt: number = CHRManager.instance.getLevelUpCnt();
                if (levelUpCnt) {
                    this.gameNode = GAME_NODE.LEVEL_UP;
                } else {
                    this.gameNode = GAME_NODE.PREPARE;
                }
            } break;
            case GAME_NODE.PASS_PREPARE: {
                this.gameNode = GAME_NODE.FIGHTING;
            } break;
        }
    }
    // private _passLevelUp() {
    //     this.gameNode = GAME_NODE.PASS_LEVEL_UP;

    //     // TODO: 升级界面隐出效果
    //     this.scheduleOnce(() => {
    //         GUI_GamePlayManager.instance.hideLevelUpGUI();
    //         this.gameNode = GAME_NODE.PREPARE;
    //         this._nextStep();
    //     }, 1)
    // }
    private _nextStep() {
        switch (this.gameNode) {
            case GAME_NODE.LEVEL_UP: {
                GUI_GamePlayManager.instance.hideGamePlayGUI();
                CHRManager.instance.propCtx.refreshPreUpdateList();
                GUI_GamePlayManager.instance.showLevelUpGUI();
                this._levelUpDuration = LEVEL_UP_TIME;
                OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_INIT, this._levelUpDuration);
            } break;
            case GAME_NODE.PREPARE: {
                GUI_GamePlayManager.instance.hideGamePlayGUI();
                CHRManager.instance.propCtx.refreshPreUpdateList();
                GUI_GamePlayManager.instance.showPrepareGUI();
                this._prepareDuration = PREPARE_TIME;
                OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.PREPARE_TIME_INIT, this._prepareDuration);
            } break;
            case GAME_NODE.FIGHTING: {
                // temp
                this.gameNode = GAME_NODE.PASS_LEVEL_UP
                console.log('进入下一波，第一阶段结束')
            } break;
        }
    }
    private _loadWave() {
        const currentWave: number = this.saveCtrl.save.wave;
        this.waveRole = this.gameConfig.waves[currentWave - 1];
        this.preplay();
    }
    private _prepareTimeout() {
        this._finishPrepare();
    }

    update(dt: number) {
        switch (this.gameNode) {
            case GAME_NODE.FIGHTING: {
                this._tinyCd += dt;
                if (this._tinyCd >= 0.1) {
                    this._tinyCd -= 0.1;
                    this._duration = Number((this._duration - 0.1).toFixed(1));
                    OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.TIME_REDUCE_TINY, this._duration);
                    if (this._duration % 1 === 0) {
                        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.TIME_REDUCE, this._duration);
                        if (this._duration <= 0) {
                            this._passWave();
                        }
                    }
                }
            } break;
            case GAME_NODE.LEVEL_UP: {
                if (this._levelUpDuration <= 0) {
                    return;
                }

                this._levelUpSecond += dt;
                if (this._levelUpSecond >= 1) {
                    this._levelUpSecond -= 1;
                    this._levelUpDuration -= 1;
                    OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_REDUCE, this._levelUpDuration);

                    if (this._levelUpDuration <= 0) {
                        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.LEVEL_UP_TIMEOUT);
                    }
                    // if (this._levelUpDuration <= 0) {
                    //     this._passLevelUp();
                    // }
                }
            } break;
            case GAME_NODE.PREPARE: {
                if (this._prepareDuration <= 0) {
                    return;
                }

                this._prepareSecond += dt;
                if (this._prepareSecond >= 1) {
                    this._prepareSecond -= 1;
                    this._prepareDuration -= 1;
                    OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.PREPARE_TIME_REDUCE, this._prepareDuration);

                    if (this._prepareDuration <= 0) {
                        // OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.PREPARE_TIMEOUT);
                        this._prepareTimeout();
                    }
                }
            } break;
        }
    }
}

