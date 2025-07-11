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
        // this._loadLevelUpIcon();
        let overflowExp: number = this.expCurrent - this.expTotal;
        this.expCurrent = 0;
        this.expTotal = this._calcExpTotal();
        this.addExp(overflowExp);
        this.runEventFn("levelUp", this.level);
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

        this.runEventFn("expChange", { expCurrent: this.expCurrent, expTotal: this.expTotal })
    }

    public getLevelUpCnt() {
        return this._levelUpCnt;
    }
    // 完成一次升级
    public finishOnceTimeLevelUp() {
        this._levelUpCnt--;
        this._loadLevelUpIcon();
    }

    // TODO: 以下所有都迁移到GUI_GamePlayManager里
    // 右上角升级次数计数
    public showLevelUpIconUI() {
        // this._levelUpIconUINode = OO_UIManager.instance.loadUINode("common/LevelUpIconWrap", "NONE");
        // OO_UIManager.instance.appendUINode(this._levelUpIconUINode);
        // this._levelUpIconUINode.getComponent(Widget).target = find("Canvas");

        // this._loadLevelUpIcon();
    }
    public removeLevelUpIconUI() {
        // OO_UIManager.instance.removeUI("LevelUpIconWrap");
        // this._levelUpIconUINode = null;
    }
    private _loadLevelUpIcon() {
        // this._levelUpIconUINode.removeAllChildren();
        // for (let i = 0; i < this._levelUpCnt; i++) {
        //     this.showUI("common/LevelUpIcon", this._levelUpIconUINode, "NONE");
        // }
    }
}