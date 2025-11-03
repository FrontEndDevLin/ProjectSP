/**
 * 游戏中，界面UI控制
 */

import { _decorator, Color, Component, EventTouch, Game, Label, Node, Sprite, UITransform, v3, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { CHRInfo, GAME_NODE, GamePlayEvent, WarCoreInfo } from '../../Common/Namespace';
import ProcessManager from '../../CManager/ProcessManager';
import { getRandomNumber } from '../../Common/utils';
import WarCoreManager from '../../CManager/WarCoreManager';
import { CoreCard } from './GUI_CoreSelect/CoreCard';
const { ccclass, property } = _decorator;

@ccclass('GUI_CoreSelect')
export class GUI_CoreSelect extends OBT_Component {
    protected onLoad(): void {
        // this.view("GUI_Prop").addComponent("GUI_Prop");
        this.view("TrophyIconWrap").addComponent("TrophyIconWrap");

        // 核心选择倒计时
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIME_INIT, this._coreSelectTimeInit, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIME_REDUCE, this._updateCountdownView, this);
        // OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_DEAD_TIME, this._coreSelectDeadTime, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIMEOUT, this._coreSelectTimeout, this);
    }

    start() {
    }

    private _initCoreCard() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;

        const atkWarCoreList: WarCoreInfo.AtkWarCoreAttr[] = WarCoreManager.instance.getPreCheckAtkWarCoreList();
        atkWarCoreList.push(atkWarCoreList[0])
        atkWarCoreList.push(atkWarCoreList[0])

        atkWarCoreList.forEach((atkWarCore: WarCoreInfo.AtkWarCoreAttr, i) => {
            cardSlotList[i].removeAllChildren();
            const coreCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_CoreSelect/CoreCard" });
            const coreCardCtx: CoreCard = <CoreCard>coreCard.getComponent("CoreCard");
            coreCardCtx.updateView(atkWarCore);
            OBT.instance.uiManager.mountNode({ node: coreCard, parentNode: cardSlotList[i] });
        })
    }

    private _updateCountdownView(duration) {
        this.view("Countdown").getComponent(Label).string = duration;
    }

    private _coreSelectTimeInit(duration) {
        this._initCoreCard();
        this._updateCountdownView(duration);
    }

    private _coreSelectDeadTime() {
        // 如果快超时了
    }

    private _coreSelectTimeout() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        let node: Node = cardSlotList[getRandomNumber(0, cardSlotList.length - 1)].children[0];
        node.OBT_param2.autoTouch();
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


