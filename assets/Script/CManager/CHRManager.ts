import { find, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import DBManager from "./DBManager";
import { CHRInfo, GamePlayEvent } from "../Common/Namespace";
import LevelCtrl from "./Class/LevelCtrl";
import OBT from "../OBT";
import PropCtrl from "./Class/PropCtrl";
export default class CHRManager extends OBT_UIManager {
    static instance: CHRManager;

    private _CHRLoc: Vec3 = null;

    private _levelCtrl: LevelCtrl;

    public CHRDBData: any;
    public propCtx: PropCtrl;

    protected onLoad(): void {
        if (!CHRManager.instance) {
            CHRManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.rootNode = find("Canvas/GamePlay/GamePlay");

        this.CHRDBData = DBManager.instance.getDBData("CHR");
        // console.log('CHRManager Loaded')
        this._initProps();

        this._initLevelCtrl();

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_PASS, () => {
            let levelUpCnt: number = this._levelCtrl.getLevelUpCnt();
            console.log(`波次通过, 获得${levelUpCnt}次升级次数`);
        })
    }

    private _initLevelCtrl() {
        this._levelCtrl = new LevelCtrl();
        this._levelCtrl.initLevel();
    }

    private _initProps() {
        this.propCtx = new PropCtrl();
        this.propCtx.initProps(this.CHRDBData.basic_props, this.CHRDBData.props);
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
    public getLevelUpCnt(): number {
        return this._levelCtrl.getLevelUpCnt();
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
