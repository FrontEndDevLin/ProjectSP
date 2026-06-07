/**
 * 游戏中，界面UI控制
 */

import { _decorator, Component, Label, Node, Sprite, SpriteFrame, UIOpacity, UITransform, v3, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../Common/Namespace';
import DropItemManager from '../../CManager/DropItemManager';
import { getRandomNumber, transportWorldPosition } from '../../Common/utils';
import ProcessManager from '../../CManager/ProcessManager';
import WarCoreManager from '../../CManager/WarCoreManager';
import GUI_PopupManager from '../../CManager/GUI_PopupManager';
import ItemBase from './Items/ItemBase';
import { CoreUpgradeCard } from './GUI_CoreSelect/CoreUpgradeCard';
import ItemWarCore from './Items/ItemWarCore';
import { CoreCard } from './GUI_CoreSelect/CoreCard';
import { GUI_Prop } from './GUI_Prop';
import ItemsManager from '../../CManager/ItemsManager';
import { ItemCard } from './GUI_Prepare/ItemCard';
const { ccclass, property } = _decorator;

@ccclass('GUI_GamePlay')
export class GUI_GamePlay extends OBT_Component {
    private _hpBarWidth: number = 0;

    private _coreExpBarWidth: number = 0;

    protected onLoad(): void {
        this.view("CHRStatus").getComponent(Widget).target = OBT.instance.uiManager.rootNode;

        this._hpBarWidth = this.view("CHRStatus/HPWrap/BG").getComponent(UITransform).width;

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_START, this._fightStart, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_REDUCE, this._updateCountdownView, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIMEOUT, this._levelUpTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIME_INIT, this._coreSelectTimeInit, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIMEOUT, this._coreSelectTimeout, this);

        // 核心升级包选择倒计时
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_UPGRADE_TIME_INIT, this._coreUpgradeTimeInit, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_UPGRADE_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_UPGRADE_TIMEOUT, this._coreUpgradeTimeout, this);

        // 开箱倒计时
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CHEST_OPEN_TIME_INIT, this._chestOpenTimeInit, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CHEST_OPEN_TIME_REDUCE, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CHEST_OPEN_TIMEOUT, this._chestOpenTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.EXP_CHANGE, this._updateExpBar, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.HP_CHANGE, this._updateHPBar, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP, this._updateLevel, this);

        setTimeout(() => {
            DropItemManager.instance.expIconWorldPos = transportWorldPosition(this.view("CHRStatus/Collect/Storage/Ico").worldPosition);
        });

        this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");
        this.view("TrophyIconWrap").addComponent("TrophyIconWrap");
        this.view("GUI_Prop").addComponent(GUI_Prop);

        OBT.instance.eventCenter.on(GamePlayEvent.CURRENCY.CURRENCY_CHANGE, this._updateCurrency, this);
        OBT.instance.eventCenter.on(GamePlayEvent.CURRENCY.STORAGE_CHANGE, this._updateStorage, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_FINISH, this._showCoreView, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.ATK_CORE_CHANGE, this._updateCoreIcon, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_UPGRADE_FINISH, this._updateCoreIcon, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_EXP_CHANGE, this.updateCoreExpBar, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_UPGRADE, this.coreLevelUp, this);

        this.view("SidePropBtn").on(Node.EventType.TOUCH_END, this.showPropGUI, this);

        OBT.instance.eventCenter.on(GamePlayEvent.STORE.LEVEL_UP_REF_COST_CHANGE, this._updateRefCost, this);
        OBT.instance.eventCenter.on(GamePlayEvent.STORE.LEVEL_UP_LIST_UPDATE, this._updateLevelUpCard, this);
        OBT.instance.eventCenter.on(GamePlayEvent.STORE.LEVEL_UP_REF_COST_CHANGE, this._updateRefCost, this);
        this.view("LevelUpWrap/RefreshBtn").on(Node.EventType.TOUCH_END, this._refreshLevelUpList, this);

        this.view("ChestOpenWrap/Wrap/Container/StoreWrap/CardWrap/ItemCard").addComponent(ItemCard);
        this.view("ChestOpenWrap/Wrap/Container/StoreWrap/OperBar/RecBtn").on(Node.EventType.TOUCH_END, this._recoverChestItem, this);
        this.view("ChestOpenWrap/Wrap/Container/StoreWrap/OperBar/GetBtn").on(Node.EventType.TOUCH_END, this._obtainChestItem, this);
    }

    start() {
    }

    private _fightStart(duration) {
        this._updateCountdownView(duration);
        CHRManager.instance.propCtx.initHP();
        this._updateLevel();
        this._updateCurrency();
        this._updateStorage();
        this._showCoreView();

        this.view("Wave/Val").getComponent(Label).string = `${ProcessManager.instance.waveRole.wave}`;
    }

    private _updateCountdownView(duration) {
        this.view("Countdown").getComponent(Label).string = duration;
    }

    private _updateHPBar() {
        let hp: number = CHRManager.instance.propCtx.getPropValue("hp");
        let hp_cur: number = CHRManager.instance.propCtx.getCurrentHP();
        let hpNumStr: string = `${hp_cur}/${hp}`;
        this.view("CHRStatus/HPWrap/HPNum").getComponent(Label).string = hpNumStr;

        let hpBarWidth: number = Math.floor(this._hpBarWidth * hp_cur / hp);
        this.view("CHRStatus/HPWrap/HPProg").getComponent(UITransform).width = hpBarWidth;
    }
    private _updateExpBar(data: any) {
        let expCurrent: number = Math.floor(data.expCurrent);
        let expTotal: number = data.expTotal;
        
        let expBarWidth: number = Math.floor(this._hpBarWidth * expCurrent / expTotal);

        this.view("CHRStatus/EXPWrap/EXPProg").getComponent(UITransform).width = expBarWidth;
    }
    private _updateLevel() {
        this.view("CHRStatus/EXPWrap/Level/Val").getComponent(Label).string = `${CHRManager.instance.getLevel()}`;
    }

    private _updateCurrency() {
        this.view("CHRStatus/Collect/Currency/Val").getComponent(Label).string = `${CHRManager.instance.currencyCtrl.getCurrency()}`;
    }
    private _updateStorage() {
        this.view("CHRStatus/Collect/Storage/Val").getComponent(Label).string = `${CHRManager.instance.currencyCtrl.getStorage()}`;
    }

    private _showCoreView() {
        let isUnlockWarCore: boolean = WarCoreManager.instance.getIsUnlockWarCore();
        if (isUnlockWarCore) {
            this.view("CoreInfo").active = true;
            this._coreExpBarWidth = this.view("CoreInfo/EXPWrap/BG").getComponent(UITransform).width;
        } else {
            this.view("CoreInfo").active = false;
        }
        return isUnlockWarCore;
    }

    // 展示核心图标, TODO: 强化次数
    private _updateCoreIcon() {
        let isUnlockWarCore: boolean = WarCoreManager.instance.getIsUnlockWarCore();
        if (!isUnlockWarCore) {
            return;
        }
        let assets: SpriteFrame = WarCoreManager.instance.warCore.getAssets();
        this.view("CoreInfo/Top/CoreWrap/CorePic").getComponent(Sprite).spriteFrame = assets;

        let coreLevel: number = WarCoreManager.instance.coreLevel;
        if (coreLevel) {
            this.view("CoreInfo/Top/Reinforce").getComponent(Label).string = `+${coreLevel}`;
            this.view("CoreInfo/Top/Reinforce").active = true;
        }
    }
    
    // 核心经验进度
    protected updateCoreExpBar() {
        let { expCurrent, expTotal } = WarCoreManager.instance;
        expCurrent = Math.floor(expCurrent);
        let expBarWidth: number = Math.floor(this._coreExpBarWidth * expCurrent / expTotal);

        this.view("CoreInfo/EXPWrap/EXPProg").getComponent(UITransform).width = expBarWidth;
    }
    // 核心升级，右上角图标(新图标, TODO)
    protected coreLevelUp(){}

    protected showPropGUI() {
        GUI_PopupManager.instance.showPropBoardPopup();
    }

    // private _showMask() {
    //     let currentGameNode: GAME_NODE = ProcessManager.instance.gameNode;
    //     switch (currentGameNode) {
    //         case GAME_NODE.LEVEL_UP:
    //         case GAME_NODE.CORE_SELECT: {
    //             this.view("Mask").setPosition(v3(0, 0, 0));
    //         } break;
    //     }
    // }
    // private _hideMask() {
    //     this.view("Mask").setPosition(v3(3000, 0, 0));
    // }

    public resetGamePlayView() {
        this.view("Wave").active = true;
        this.view("Mask").active = false;
        this.view("SidePropBtn").active = false;
        this.view("GUI_Prop").active = false;
        this.view("CoreSelectWrap").active = false;
        this.view("CoreUpgradeWrap").active = false;
        this.view("LevelUpWrap").active = false;
        this.view("ChestOpenWrap").active = false;
    }

    /**
     * 显示升级界面
     * 依次:
     * 隐藏开箱界面
     * 隐藏波次文字
     * 显示遮罩
     * 隐藏侧边属性按钮
     * 显示升级界面
     */
    public showLevelUpView() {
        this.view("Wave").active = false;
        this.view("ChestOpenWrap").active = false;
        this.view("Mask").active = true;
        this.view("SidePropBtn").active = false;
        // this.view("GUI_Prop").setPosition(v3(-235, -60, 0));
        this.view("GUI_Prop").getComponent(GUI_Prop).initCHRAttrCard();
        this.view("GUI_Prop").active = true;
        this.view("LevelUpWrap").active = true;
        this.view("CoreSelectWrap").active = false;
    }

    private _updateLevelUpCard() {
        const cardSlotList: Node[] = this.view("LevelUpWrap/Wrap/Container/StoreWrap/CardWrap").children;
        const preLevelUpList: CHRInfo.upgradeProp[] = CHRManager.instance.propCtx.preUpgradeList;
        preLevelUpList.forEach((updateProp, i) => {
            cardSlotList[i].removeAllChildren();
            // preLevelUpList
            const levelUpCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/LevelUpCard" });
            levelUpCard.OBT_param1 = updateProp;
            OBT.instance.uiManager.mountNode({ node: levelUpCard, parentNode: cardSlotList[i] });
        })
    }

    private _levelUpTimeout() {
        const cardSlotList: Node[] = this.view("LevelUpWrap/Wrap/Container/StoreWrap/CardWrap").children;
        let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        node.OBT_param2.autoTouch();
    }

    private _updateRefCost(cost: number) {
        this.view("LevelUpWrap/RefreshBtn/Cost").getComponent(Label).string = `${cost}`;
    }

    private _refreshLevelUpList() {
        CHRManager.instance.propCtx.refreshPreUpgradeList();
    }

    /**
     * 显示核心选择界面 start
     * 依次:
     * 隐藏波次文字
     * 显示遮罩
     * 显示侧边属性按钮
     * 显示核心选择界面
     */
    public showCoreSelectView() {
        this.view("Wave").active = false;
        this.view("Mask").active = true;
        this.view("SidePropBtn").active = true;
        this.view("CoreSelectWrap").active = true;
    }

    private _coreSelectTimeInit(duration) {
        this._initCoreSelectCard();
        this._updateCountdownView(duration);
    }

    private _coreSelectTimeout() {
        const cardSlotList: Node[] = this.view("CoreSelectWrap/Container/StoreWrap/CardWrap").children;
        let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        node.OBT_param2.autoTouch();
    }

    private _initCoreSelectCard() {
        const cardSlotList: Node[] = this.view("CoreSelectWrap/Container/StoreWrap/CardWrap").children;

        const warCoreList: ItemWarCore[] = WarCoreManager.instance.getPreCheckAtkWarCoreList();
        warCoreList.push(warCoreList[0])

        warCoreList.forEach((itemWarCore: ItemWarCore, i) => {
            cardSlotList[i].removeAllChildren();
            const coreCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_CoreSelect/CoreCard" });
            const coreCardCtx: CoreCard = coreCard.getComponent(CoreCard);
            coreCardCtx.updateView(itemWarCore);
            OBT.instance.uiManager.mountNode({ node: coreCard, parentNode: cardSlotList[i] });
        })
    }
    // 显示核心选择界面 end

    /**
     * 显示核心升级界面 start
     * 依次:
     * 隐藏波次文字
     * 显示遮罩
     * 显示侧边属性按钮
     * 隐藏核心选择界面
     * 显示核心升级界面
     */
    public showCoreUpgradeView() {
        this.view("Wave").active = false;
        this.view("Mask").active = true;
        this.view("SidePropBtn").active = true;
        this.view("CoreSelectWrap").active = false;
        this.view("CoreUpgradeWrap").active = true;
    }

    private _coreUpgradeTimeInit(duration) {
        this._initCoreUpgradeCard();
        this._updateCountdownView(duration);
    }

    private _coreUpgradeTimeout() {
        const cardSlotList: Node[] = this.view("CoreUpgradeWrap/Container/StoreWrap/CardWrap").children;
        let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        node.OBT_param2.autoTouch();
    }

    private _initCoreUpgradeCard() {
        const cardSlotList: Node[] = this.view("CoreUpgradeWrap/Container/StoreWrap/CardWrap").children;

        const upgradePackList: ItemBase[] = WarCoreManager.instance.getPreCheckUpgradePackList();
        upgradePackList.forEach((upgradePack: ItemBase, i) => {
            cardSlotList[i].removeAllChildren();
            const coreCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_CoreSelect/CoreUpgradeCard" });
            const coreCardCtx: CoreUpgradeCard = coreCard.getComponent(CoreUpgradeCard);
            coreCardCtx.updateView(upgradePack);
            OBT.instance.uiManager.mountNode({ node: coreCard, parentNode: cardSlotList[i] });
        })
    }
    // 显示核心升级界面 end

    /**
     * 显示开箱界面 start
     * 依次:
     * 隐藏波次文字
     * 显示遮罩
     * 隐藏侧边属性按钮
     * 隐藏核心选择界面
     * 隐藏核心升级界面
     * 显示属性界面
     * 显示开箱界面
     */
    public showChestOpenView() {
        this.view("Wave").active = false;
        this.view("Mask").active = true;
        this.view("SidePropBtn").active = false;
        this.view("CoreSelectWrap").active = false;
        this.view("CoreUpgradeWrap").active = false;
        this._showChestItemCard();
        this.view("GUI_Prop").getComponent(GUI_Prop).initCHRAttrCard();
        this.view("GUI_Prop").active = true;
        this.view("ChestOpenWrap").active = true;
    }

    private _chestOpenTimeInit(duration) {
        this._updateCountdownView(duration);
        this._initChestOpenCard();
    }
    private _chestOpenTimeout() {
        this._recoverChestItem();
    }

    private _initChestOpenCard() {
        ItemsManager.instance.loadChestItem();
        let chestItem: ItemBase = ItemsManager.instance.getChestItem();
        if (chestItem) {
            this.view("ChestOpenWrap/Wrap/Container/StoreWrap/CardWrap/ItemCard").getComponent(ItemCard).updateView(chestItem);
            this.view("ChestOpenWrap/Wrap/Container/StoreWrap/OperBar/RecBtn/Txt/Cost").getComponent(Label).string = `${chestItem.recover_price}`;
        }
    }

    private _obtainChestItem() {
        ItemsManager.instance.obtainChestItem();
        this._fadeOutChestItemCard();
    }

    private _recoverChestItem() {
        ItemsManager.instance.recoverChestItem();
        this._fadeOutChestItemCard();
    }

    private _showChestItemCard() {
        this.view("ChestOpenWrap/Wrap/Container/StoreWrap").getComponent(UIOpacity).opacity = 255;
    }
    private _fadeOutChestItemCard() {
        this.view("ChestOpenWrap/Wrap/Container/StoreWrap").getComponent(UIOpacity).opacity = 0;
    }
    // 显示开箱界面 end

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.FIGHT_START, this._updateCountdownView, this);
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_REDUCE, this._updateCountdownView, this);
    }

    update(deltaTime: number) {
        
    }
}


