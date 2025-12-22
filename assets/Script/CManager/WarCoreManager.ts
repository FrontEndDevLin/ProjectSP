import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import { BoostConfig, BulletInfo, CHRInfo, Common, GamePlayEvent, MAX_WAR_CORE_LEVEL, WarCoreInfo } from '../Common/Namespace';
import OBT from '../OBT';
import DBManager from './DBManager';
import { copyObject, getFloatNumber, getRandomNumbers } from '../Common/utils';
import ItemsManager from './ItemsManager';
import BulletManager from './BulletManager';
import DamageManager from './DamageManager';
import CHRManager from './CHRManager';
import ProcessManager from './ProcessManager';
import { getSaveCtrl } from './Class/SaveCtrl';
const { ccclass, property } = _decorator;

export default class WarCoreManager extends OBT_UIManager {
    static instance: WarCoreManager = null;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    public warCoreRootNode: Node = null;

    public warCoreData: WarCoreInfo.WarCoreDBData;

    public atkWarCore: WarCoreInfo.AtkWarCoreAttr = null;
    public realAtkWarCore: WarCoreInfo.AtkWarCoreAttr = null;

    protected unlockWarCore: boolean = false;

    // 当前核心等级
    public coreLevel: number = 0;
    // 升1级所需经验
    public expTotal: number = 0;
    // 当前经验
    public expCurrent: number = 0;

    // 本回合是否有升级
    private _hasUpgrade: boolean = false;
    // private _hasUpgrade: boolean = true;

    protected expList: number[] = [50, 200, 300];

    // 升级槽
    public upgradeSlot: string[] = [];
    public upgradeSlotMap: Common.SimpleObj = {};
    // 当前预览升级核心包
    protected currentPreviewPackId: string = "";

    start() {

    }

    protected onLoad(): void {
        if (!WarCoreManager.instance) {
            WarCoreManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.warCoreData = DBManager.instance.getDBData("WarCore");

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PROP_UPDATE, this.updateRealAtkWarCore, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PICK_UP_TROPHY, this.onPickupTrophy, this);
    }

    protected updateRealAtkWarCore() {
        if (!this.realAtkWarCore) {
            const warCore: WarCoreInfo.AtkWarCoreAttr = this.atkWarCore;
            this.realAtkWarCore = copyObject(warCore);
        }
        let realAttr: WarCoreInfo.AtkWarCoreDataAttr = this.getWarCoreRealAttr(this.realAtkWarCore.id);
        this.realAtkWarCore.base_dmg = realAttr.base_dmg;
        this.realAtkWarCore.dmg = realAttr.dmg;
        this.realAtkWarCore.ctl = realAttr.ctl;
        this.realAtkWarCore.cd = realAttr.cd;
        this.realAtkWarCore.range = realAttr.range;
    }

    // 获得指定核心的当前属性(结合角色属性计算)
    public getWarCoreRealAttr(atkWarCoreId): WarCoreInfo.AtkWarCoreDataAttr {
        const warCore: WarCoreInfo.AtkWarCoreAttr = this.warCoreData.atk_war_core_def[atkWarCoreId];
        if (!warCore) {
            return;
        }
        let bulletId: string = warCore.bullet;
        let base_dmg: number = BulletManager.instance.getBulletDamage(bulletId);
        let dmg: number = DamageManager.instance.getBulletRealDamage(bulletId);
        let boost: BoostConfig = BulletManager.instance.getBulletInfo(bulletId, "boost");
        let ctl: number = CHRManager.instance.propCtx.getPropRealValue("ctl") + warCore.ctl;
        let cd: number = getFloatNumber(warCore.cd / CHRManager.instance.propCtx.getPropRealValue("atk_spd"), 3);
        let range: number = CHRManager.instance.propCtx.getPropRealValue("range") + warCore.range;

        return {
            bulletId,
            base_dmg,
            dmg,
            ctl,
            ctl_dmg_rate: warCore.ctl_dmg_rate,
            split: warCore.split,
            cd,
            range,
            boost
        }
    }

    public setWarCoreRootNode(node: Node) {
        this.warCoreRootNode = node;
    }

    private _setAtkWarCore(atkWarCoreId: string) {
        const warCore: WarCoreInfo.AtkWarCoreAttr = this.warCoreData.atk_war_core_def[atkWarCoreId];
        if (warCore) {
            this.atkWarCore = warCore;
            this.updateRealAtkWarCore();

            const buffList: CHRInfo.Buff[] = warCore.buff_list;
            if (Array.isArray(buffList) && buffList.length) {
                CHRManager.instance.upgradePropByBuff(buffList);
            }

            const traits: string[] = warCore.traits;
            if (traits && Array.isArray(traits)) {
                traits.forEach((trait: string) => {
                    ProcessManager.instance.traitCtrl.useTrait(trait);
                })
            }
            OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.ATK_CORE_CHANGE);
            this.showPrefab({ prefabPath: `WarCore/${warCore.id}`, parentNode: this.warCoreRootNode, scriptName: warCore.id });
        }
    }

    public initAtkWarCore(atkWarCoreId: string) {
        this._setAtkWarCore(atkWarCoreId);

        let save = getSaveCtrl().save;
        if (save.unlock_war_core) {
            this.unlockWarCore = true;
        }
        this._initWarCoreLevel(save.chr_slot.core_level, save.chr_slot.core_exp);
    }

    // 仅限核心选择时调用
    public mountAtkWarCore(atkWarCoreId: string) {
        if (this.atkWarCore) {
            console.log('当前已有挂载攻击核心，需要先卸载');
            this.unmountAtkWarCore();
        }
        this._setAtkWarCore(atkWarCoreId);
        ItemsManager.instance.expendTrophy();
        this.unlockWarCore = true;
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.CORE_SELECT_FINISH);
    }
    // 卸载当前核心，卸载时，如当前核心有增益类buff，角色属性等值减去所有增益属性
    protected unmountAtkWarCore() {
        this.warCoreRootNode.getChildByName(this.atkWarCore.id).destroy();
        this.atkWarCore = null;
        this.realAtkWarCore = null;
    }

    // 预选进攻核心列表
    public getPreCheckAtkWarCoreList(): WarCoreInfo.AtkWarCoreAttr[] {
        let pubAtkWarCoreList: string[] = this.warCoreData.pub_atk_war_core;
        const MAX: number = 3;
        let list: WarCoreInfo.AtkWarCoreAttr[] = [];
        let randomIdxList = [];
        if (pubAtkWarCoreList.length <= MAX) {
            pubAtkWarCoreList.forEach((_, idx: number) => {
                randomIdxList.push(idx)
            })
        } else {
            randomIdxList = getRandomNumbers(0, pubAtkWarCoreList.length - 1, MAX);
        }

        randomIdxList.forEach((idx: number) => {
            list.push(this.warCoreData.atk_war_core_def[pubAtkWarCoreList[idx]]);
        });

        return list;
    }

    // 获取是否已解锁核心升级
    public getIsUnlockWarCore(): boolean {
        return this.unlockWarCore;
    }

    // 预选核心升级包列表
    public getPreCheckUpgradePackList(): WarCoreInfo.WarCoreUpgradePack[] {
        let upgradePool: string[] = this.atkWarCore.upgrade_pool;
        const MAX: number = 3;
        let list: WarCoreInfo.WarCoreUpgradePack[] = [];
        let randomIdxList: number[] = [];
        if (upgradePool.length <= MAX) {
            upgradePool.forEach((_, idx: number) => {
                randomIdxList.push(idx);
            })
        } else {
            randomIdxList = getRandomNumbers(0, upgradePool.length - 1, MAX);
        }

        randomIdxList.forEach((idx: number) => {
            list.push(this.warCoreData.war_core_upgrade_pack_def[upgradePool[idx]]);
        });

        return list;
    }

    private _initWarCoreLevel(lev?: number, expCur?: number) {
        this.coreLevel = lev || getSaveCtrl().save.chr_slot.core_level;
        if (this.coreLevel >= MAX_WAR_CORE_LEVEL) {
            return;
        }
        this.expTotal = this.expList[this.coreLevel]
        this.expCurrent = expCur || 0;
    }

    protected onPickupTrophy() {
        if (!this.unlockWarCore) {
            return;
        }
        this.addWarCoreExp();
    }

    protected addWarCoreExp(n?: number) {
        if (this.coreLevel >= MAX_WAR_CORE_LEVEL) {
            return;
        }
        let needEff: boolean = true;
        if (typeof n === "number") {
            if (n <= 0) {
                return;
            }
            needEff = false;
        } else {
            n = 3;
        }

        let relExp: number = n;
        // n经过经验获取效率的修正
        if (needEff) {
            // let expEffVal: number = CHRManager.instance.propCtx.getPropRealValue("exp_eff");
            let expEffVal: number = 1;
            relExp = getFloatNumber(n * expEffVal, 2);
        }
        this.expCurrent += relExp;
        let c: number = this.expCurrent - this.expTotal;
        if (c >= 0) {
            this._upgradeWarCore();
        }

        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.CORE_EXP_CHANGE, { expCurrent: this.expCurrent, expTotal: this.expTotal });
    }

    private _upgradeWarCore() {
        this.coreLevel++;
        this._hasUpgrade = true;
        if (this.coreLevel < MAX_WAR_CORE_LEVEL) {
            // this._levelUpCnt++;
            let overflowExp: number = this.expCurrent - this.expTotal;
            this.expCurrent = 0;
            this.expTotal = this.expList[this.coreLevel];
            this.addWarCoreExp(overflowExp);
        }
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.CORE_UPGRADE, this.coreLevel);
    }

    // 挂载升级包
    public mountUpgradePack(packId: string) {
        if (this.upgradeSlot.length >= 3) {
            return;
        }
        const upgradePack: WarCoreInfo.WarCoreUpgradePack = this.getUpgradePackInfo(packId);
        // TODO: do sth...

        this.upgradeSlot.push(packId);
        if (this.upgradeSlotMap[packId]) {
            this.upgradeSlotMap[packId]++;
        } else {
            this.upgradeSlotMap[packId] = 1;
        }

        this.coreLevel++;
        // 挂载完后通知
        ItemsManager.instance.expendTrophy();
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.CORE_UPGRADE_FINISH);

        // TODO: 挂载完后，在Prepare界面解锁对应的升级槽，可点击预览
    }

    public getUpgradePackCnt(packId: string): number {
        return this.upgradeSlotMap[packId];
    }

    public getUpgradePackInfo(packId: string): WarCoreInfo.WarCoreUpgradePack {
        return this.warCoreData.war_core_upgrade_pack_def[packId];
    }

    // TODO: 未用
    public finishLevelUp() {
        this._hasUpgrade = false;
    }
    public hasLevelUp() {
        return this._hasUpgrade;
    }

    // 备战界面触碰升级包预览
    public previewUpgradePack(packId) {
        this.currentPreviewPackId = packId;
    }
    public getPreviewUpgradePackInfo(): WarCoreInfo.WarCoreUpgradePack {
        if (!this.currentPreviewPackId) {
            return;
        }
        return this.getUpgradePackInfo(this.currentPreviewPackId);
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.PROP_UPDATE, this.updateRealAtkWarCore, this);
    }


    /**
     * 黑岩石1200+600
     * 精致凿1200  
     * 松煤600  740
     * 烟罗袋60
     * 镶金5
     * 
     * 风行石
     * =10黑曜+5黑玛瑙+1烟罗袋
     * =20黑岩+20精致凿+10黑岩+10松煤
     * 
     * 风行石x60
     * =600黑曜+300黑玛瑙+60烟罗袋
     * =1200黑岩+1200精致凿+600黑岩+600松煤
     */

    update(deltaTime: number) {
        
    }
}

