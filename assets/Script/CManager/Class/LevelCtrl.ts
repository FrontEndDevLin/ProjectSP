import { GamePlayEvent, ITEM_QUALITY } from "../../Common/Namespace";
import { getFloatNumber } from "../../Common/utils";
import OBT from "../../OBT";
import CHRManager from "../CHRManager";
import RateConfigManager from "../RateConfigManager";
import { BaseCtrl } from "./BaseCtrl";
import { getSaveCtrl } from "./SaveCtrl";

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
        // return this.level * 8 + Math.pow((this.level + 1), 2) + 8;
        return this.level + Math.pow((this.level + 1), 2);
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
        this.level = lev || getSaveCtrl().save.chr_slot.level;
        this.expTotal = this._calcExpTotal();
        this.expCurrent = expCur || 0;
    }

    public addExp(n: number) {
        if (n <= 0) {
            return;
        }
        // n经过经验获取效率的修正
        let expEffVal: number = CHRManager.instance.propCtx.getPropRealValue("exp_eff");
        let relExp: number = getFloatNumber(n * expEffVal, 2);

        this.expCurrent += relExp;
        let c: number = this.expCurrent - this.expTotal;
        if (c >= 0) {
            this._levelUp();
        }

        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.EXP_CHANGE, { expCurrent: this.expCurrent, expTotal: this.expTotal });
    }

    public getLevelUpCnt() {
        return this._levelUpCnt;
    }
    // 获取当前升级等级
    public getCurrentUpgradeLevel(): number {
        console.log('当前升级等级 ' + (this.level - this._levelUpCnt + 1))
        return this.level - this._levelUpCnt + 1;
    }

    // 完成一次升级
    public finishOnceTimeLevelUp() {
        this._levelUpCnt--;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.LEVEL_UP_FINISH);
    }

    // TODO: 以下所有都迁移到GUI_GamePlayManager里
    public removeLevelUpIconUI() {
        // OO_UIManager.instance.removeUI("LevelUpIconWrap");
        // this._levelUpIconUINode = null;
    }

    // 获取当前升级等级的品质
    public getUpgradeQuality(level: number): ITEM_QUALITY {
        let m: number = level / 5;
        let quality: ITEM_QUALITY;
        // 如果level是5的倍数
        if (m % 1 === 0) {
            switch (m) {
                case 1: {
                    // 当前5级
                    quality = ITEM_QUALITY.LV2
                } break;
                case 2: {
                    // 当前10级
                    quality = ITEM_QUALITY.LV3
                } break;
                case 3: {
                    // 当前15级
                    quality = ITEM_QUALITY.LV3
                } break;
                default: {
                    // 20/25/30...
                    quality = ITEM_QUALITY.LV4
                } break;
            }
        } else {
            // level不是5的倍数, 走随机流程
            quality = RateConfigManager.instance.getUpgradeQuality(level);
        }

        return quality || ITEM_QUALITY.LV1;
    }
}
