/**
 * 游戏中，界面UI控制
 */

import { _decorator, Component, Label, Node, UITransform, v3, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { GAME_NODE, GamePlayEvent } from '../../Common/Namespace';
import DropItemManager from '../../CManager/DropItemManager';
import { transportWorldPosition } from '../../Common/utils';
import ProcessManager from '../../CManager/ProcessManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_GamePlay')
export class GUI_GamePlay extends OBT_Component {
    private _hpBarWidth: number = 0;

    protected onLoad(): void {
        this.view("CHRStatus").getComponent(Widget).target = OBT.instance.uiManager.rootNode;

        this._hpBarWidth = this.view("CHRStatus/HPWrap/BG").getComponent(UITransform).width;

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_START, this._fightStart, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_REDUCE, this._updateCountdownView, this);

        // 升级倒计时
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_TIME_REDUCE, this._updateCountdownView, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.EXP_CHANGE, this._updateExpBar, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.HP_CHANGE, this._updateHPBar, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP, this._updateLevel, this);

        setTimeout(() => {
            DropItemManager.instance.expIconWorldPos = transportWorldPosition(this.view("CHRStatus/Collect/Storage/Ico").worldPosition);
        });

        this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");

        OBT.instance.eventCenter.on(GamePlayEvent.CURRENCY.CURRENCY_CHANGE, this._updateCurrency, this);
        OBT.instance.eventCenter.on(GamePlayEvent.CURRENCY.STORAGE_CHANGE, this._updateStorage, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GUI.SHOW_LEVEL_UP_UI, this._showMask, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GUI.HIDE_LEVEL_UP_UI, this._hideMask, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GUI.HIDE_PROP_UI, this._showMask, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GUI.SHOW_PROP_UI, this._hideMask, this);
    }

    start() {
    }

    private _fightStart(duration) {
        this._updateCountdownView(duration);
        CHRManager.instance.propCtx.initHP();
        this._updateLevel();
        this._updateCurrency();
        this._updateStorage();
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

    private _showMask() {
        if (ProcessManager.instance.gameNode !== GAME_NODE.LEVEL_UP) {
            return;
        }
        this.view("Mask").setPosition(v3(0, 0, 0));
    }
    private _hideMask() {
        this.view("Mask").setPosition(v3(3000, 0, 0));
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.FIGHT_START, this._updateCountdownView, this);
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_REDUCE, this._updateCountdownView, this);
    }

    update(deltaTime: number) {
        
    }
}


