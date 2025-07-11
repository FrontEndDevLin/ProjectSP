import { find, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import DBManager from "./DBManager";
import { CHRInfo, GamePlayEvent } from "../Common/Namespace";
import LevelCtrl from "./Class/LevelCtrl";
import OBT from "../OBT";
export default class CHRManager extends OBT_UIManager {
    static instance: CHRManager;

    private _CHRLoc: Vec3 = null;

    private _levelCtrl: LevelCtrl;

    // 基准属性，不可修改
    public basicProps: CHRInfo.CHRBasicProps;

    protected onLoad(): void {
        if (!CHRManager.instance) {
            CHRManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.rootNode = find("Canvas/GamePlay/GamePlay");

        // console.log('CHRManager Loaded')
        this._initBasicProps();

        this._initLevelCtrl();

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_PASS, () => {
            let levelUpCnt: number = this._levelCtrl.getLevelUpCnt();
            console.log(`波次通过, 获得${levelUpCnt}次升级次数`);
        })
    }

    private _initLevelCtrl() {
        this._levelCtrl = new LevelCtrl();
        this._levelCtrl.initLevel();

        this._levelCtrl.on("expChange", (data: any) => {
            // console.log("经验改变", data);
            OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.EXP_CHANGE, data);
        }, this);
        this._levelCtrl.on("levelUp", (level: any) => {
            // console.log("升级了");
            OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.LEVEL_UP, level);
        }, this);
    }

    private _initBasicProps() {
        const chrDBData: any = DBManager.instance.getDBData("CHR");
        const dataBasicProps: CHRInfo.CHRBasicProps = chrDBData.basic_prop;
        this.basicProps = dataBasicProps;
    }

    public showCHR() {
        this.showPrefab({ prefabPath: "CHR/CHR01", scriptName: "CHR" });
    }
    public showCompass() {
        this.showPrefab({ prefabPath: "Compass" });
    }
    public addExp(exp: number) {
        return this._levelCtrl.addExp(exp);
    }
    public getLevel() {
        return this._levelCtrl.level;
    }

    // 更新角色位置
    public setCHRLoc(loc: Vec3): void {
        this._CHRLoc = loc;
    }
    // 获取角色位置
    public getCHRLoc(): Vec3 {
        return this._CHRLoc;
    }

    protected onDestroy(): void {
        console.log('销毁角色管理ing')
        CHRManager.instance = null;
    }
}
