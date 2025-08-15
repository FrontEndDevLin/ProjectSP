/**
 * 游戏中，界面UI控制
 */

import { _decorator, Component, Label, Node, UITransform, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { GamePlayEvent } from '../../Common/Namespace';
import DropItemManager from '../../CManager/DropItemManager';
import { transportWorldPosition } from '../../Common/utils';
const { ccclass, property } = _decorator;

@ccclass('GUI_GamePlay')
export class GUI_GamePlay extends OBT_Component {
    private _hpBarWidth: number = 0;

    protected onLoad(): void {
        this.view("CHRStatus").getComponent(Widget).target = OBT.instance.uiManager.rootNode;

        this._hpBarWidth = this.view("CHRStatus/HPWrap/BG").getComponent(UITransform).width;

        // temp
        this._updateHP();
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.FIGHT_START, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.TIME_REDUCE, this._updateCountdownView, this);

        this._updateLevel();
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.EXP_CHANGE, this._updateExpBar, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP, this._updateLevel, this);

        setTimeout(() => {
            DropItemManager.instance.expIconWorldPos = transportWorldPosition(this.view("CHRStatus/Collect/Storage/Ico").worldPosition);
        });

        this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");
    }

    start() {
    }

    private _updateCountdownView(duration) {
        this.view("Countdown").getComponent(Label).string = duration;
    }

    private _updateHP() {
        // let hp: number = CHRManager.instance.hp.value;
        let hp: number = 8;
        // let hp_cur: number = CharacterPropManager.instance.hp_cur.value;
        let hp_cur: number = 8;
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
        this.view("CHRStatus/Level/Val").getComponent(Label).string = `${CHRManager.instance.getLevel()}`;
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.FIGHT_START, this._updateCountdownView, this);
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_INIT, this._updateCountdownView, this);
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.TIME_REDUCE, this._updateCountdownView, this);
    }

    update(deltaTime: number) {
        
    }
}


