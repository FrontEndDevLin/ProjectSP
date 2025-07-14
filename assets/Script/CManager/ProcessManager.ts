import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import MapManager from '../CManager/MapManager';
import CHRManager from '../CManager/CHRManager';
// import OBT from '../../OBT';
import EMYManager from '../CManager/EMYManager';
import GUI_GamePlayManager from '../CManager/GUI_GamePlayManager';
import OBT from '../OBT';
import { GameConfigInfo, GamePlayEvent } from '../Common/Namespace';
import DBManager from './DBManager';
import DropItemManager from './DropItemManager';
import SaveCtrl from './Class/SaveCtrl';
const { ccclass, property } = _decorator;

/**
 * Game流程管理控制
 */
export default class ProcessManager extends OBT_UIManager {
    static instance: ProcessManager = null;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    public gameConfig: GameConfigInfo.GameConfig;
    public waveRole: GameConfigInfo.WaveRole;

    public saveCtrl: SaveCtrl;

    // 持续时间
    private _duration: number = 0;
    private _tinyCd: number = 0;
    // 是否战斗中
    private _playing: boolean = false;

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
    }

    // 最开始
    public startGame(isNewGame: boolean): void {
        if (isNewGame) {
            // saveCtrl用普通类实现
            this.saveCtrl = new SaveCtrl();
            this.saveCtrl.initSave();
            this._loadWave();
            // 展示第1波UI，倒计时
            MapManager.instance.showMap();
            CHRManager.instance.showCHR();
            EMYManager.instance.setSpawnRole();
            DropItemManager.instance.initRateMap();
            CHRManager.instance.showCompass();
            GUI_GamePlayManager.instance.showGamePlayGUI();
            
            this._startWave();
        } else {
            // 需要做读取存档时，判断storage里有没有存档，有则读取存档；没有则读取InitSave.json
            let hasSaveDoc: boolean = false;
        }
    }

    // 是否处于战斗中
    public isOnPlaying() {
        return this._playing;
    }
    private preplay() {
        if (this._playing) {
            console.log("战斗中不可设置波次时间");
            return;
        }
        let duration: number = this.waveRole.duration;
        this._duration = Math.floor(duration);
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.TIME_INIT, this._duration);
    }
    private _startWave() {
        this._playing = true;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.FIGHT_START, this._duration);
    }
    private _passWave() {
        this._playing = false;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.FIGHT_PASS);

        // TODO: 移除所有进行中的项目
    }
    private _loadWave() {
        const currentWave: number = this.saveCtrl.save.wave;
        this.waveRole = this.gameConfig.waves[currentWave - 1];
        this.preplay();
    }

    update(deltaTime: number) {
        if (!this._playing) {
            return;
        }
        this._tinyCd += deltaTime;
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
    }
}

