import { find, Vec3, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import DBManager from "./DBManager";
import { CHRInfo, GamePlayEvent, SaveDoc } from "../Common/Namespace";
import LevelCtrl from "./Class/LevelCtrl";
import OBT from "../OBT";
import PropCtrl from "./Class/PropCtrl";
import { CurrencyCtrl } from "./Class/CurrencyCtrl";
import ProcessManager from "./ProcessManager";
export default class CHRManager extends OBT_UIManager {
    static instance: CHRManager;

    private _CHRLoc: Vec3 = null;

    private _levelCtrl: LevelCtrl;
    private _compassNode: Node;

    public CHRDBData: any;
    public propCtx: PropCtrl;
    public currencyCtrl: CurrencyCtrl;

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

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_PASS, () => {
            let levelUpCnt: number = this._levelCtrl.getLevelUpCnt();
            console.log(`波次通过, 获得${levelUpCnt}次升级次数`);
        })

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PICK_UP_EXP, this._pickUpExp, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.RECOVER_EXP, this._recoverExp, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PICK_UP_TROPHY, this._pickUpTrophy, this);
    }

    public init(saveDoc: SaveDoc) {
        this._initLevel(saveDoc.chr_slot.level);
        this._initProps(saveDoc.chr_prop);
        this._initCurrency();
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.PROP_INIT);
    }

    private _initLevel(level: number) {
        this._levelCtrl = new LevelCtrl();
        this._levelCtrl.initLevel(level);
    }

    private _initProps(props: CHRInfo.PropValMap) {
        this.propCtx = new PropCtrl();
        this.propCtx.initProps(props);
    }

    private _initCurrency() {
        this.currencyCtrl = new CurrencyCtrl();
    }

    private _pickUpExp(expCnt: number) {
        this.addExp(expCnt);
        this.currencyCtrl.addCurrency(expCnt);
    }
    private _recoverExp(expCnt: number) {
        this.currencyCtrl.addStorage(expCnt);
    }
    private _pickUpTrophy() {
        // 临时，需要通过计算角色属性(战利品回血量)来得到
        let health: number = 3;
        this.propCtx.addHP(health);
    }

    public initCHR() {

    }
    public showCHR() {
        this.showPrefab({ prefabPath: "CHR/CHR01", scriptName: "CHR", parentNode: ProcessManager.instance.unitRootNode });
    }
    public initCompass() {
        this._compassNode = this.showPrefab({ prefabPath: "Compass", parentNode: ProcessManager.instance.uiRootNode });
    }
    public showCompass() {
        this.showNode(this._compassNode);
    }
    public hideCompass() {
        this.hideNode(this._compassNode);
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

    public upgradeProp(propKey: string) {
        let res: boolean = this.propCtx.upgradeProp(propKey);
        if (res) {
            OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.PROP_UPDATE);
        }
        this._levelCtrl.finishOnceTimeLevelUp();
        return res;
    }

    public upgradePropByBuff(buffList: CHRInfo.Buff[]) {
        let res: boolean = this.propCtx.upgradePropByBuff(buffList);
        if (res) {
            OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.PROP_UPDATE);
        }
        return res;
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
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.PICK_UP_EXP, this._pickUpExp, this);
        CHRManager.instance = null;
    }
}
