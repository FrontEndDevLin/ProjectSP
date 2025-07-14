import { GamePlayEvent } from "../../Common/Namespace";
import OBT from "../../OBT";
import { BaseCtrl } from "./BaseCtrl";

export default class LevelCtrl extends BaseCtrl {
    static instance: LevelCtrl = null;

    // 本回合升级次数
    private _levelUpCnt: number = 0;
    // 当前角色等级
    public level: number = 0;
    // 升1级所需经验
    public expTotal: number = 0;
    // 当前经验
    public expCurrent: number = 0;

    constructor() {
        super();
        if (!LevelCtrl.instance) {
            LevelCtrl.instance = this;
        } else {
            return LevelCtrl.instance;
        }
    }

    private _calcExpTotal() {
        // 等级计算公式(暂定)
        return this.level * 8 + Math.pow((this.level + 1), 2) + 8;
    }

    private _levelUp() {
        this.level++;
        this._levelUpCnt++;
        let overflowExp: number = this.expCurrent - this.expTotal;
        this.expCurrent = 0;
        this.expTotal = this._calcExpTotal();
        this.addExp(overflowExp);
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.LEVEL_UP, this.level);
    }

    public initLevel(lev?: number, expCur?: number) {
        this.level = lev || 0;
        this.expTotal = this._calcExpTotal();
        this.expCurrent = expCur || 0;
    }

    public addExp(n: number) {
        // TODO: n要经过经验获取效率的修正
        this.expCurrent += n;
        let c: number = this.expCurrent - this.expTotal;
        if (c >= 0) {
            this._levelUp();
        }

        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.EXP_CHANGE, { expCurrent: this.expCurrent, expTotal: this.expTotal });
    }

    public getLevelUpCnt() {
        return this._levelUpCnt;
    }
    // 完成一次升级
    public finishOnceTimeLevelUp() {
        this._levelUpCnt--;
        // TODO: 通知UI更新
    }

    // TODO: 以下所有都迁移到GUI_GamePlayManager里
    public removeLevelUpIconUI() {
        // OO_UIManager.instance.removeUI("LevelUpIconWrap");
        // this._levelUpIconUINode = null;
    }
}
