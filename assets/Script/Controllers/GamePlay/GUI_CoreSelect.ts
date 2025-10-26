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
const { ccclass, property } = _decorator;

@ccclass('GUI_CoreSelect')
export class GUI_CoreSelect extends OBT_Component {
    protected onLoad(): void {
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIME_INIT, this._coreSelectTimeInit, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_DEAD_TIME, this._coreSelectDeadTime, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.CORE_SELECT_TIMEOUT, this._coreSelectTimeout, this);

        OBT.instance.eventCenter.on(GamePlayEvent.GUI.HIDE_PROP_UI, this._showCoreSelectUI, this);

        this.view("Bottom/Link").on(Node.EventType.TOUCH_END, this._showPropUI, this);
    }

    start() {
    }

    private _showCoreSelectUI() {
        if (ProcessManager.instance.gameNode !== GAME_NODE.CORE_SELECT) {
            return;
        }
        this.showNodeByPath();
    }

    private _showPropUI() {
        this.hideNodeByPath();
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_PROP_UI);
    }

    private _initCoreCard() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;

        const atkWarCoreList: WarCoreInfo.AtkWarCoreAttr[] = WarCoreManager.instance.getPreCheckAtkWarCoreList();

        atkWarCoreList.forEach((atkWarCore: WarCoreInfo.AtkWarCoreAttr, i) => {
            cardSlotList[i].removeAllChildren();
            const coreCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_CoreSelect/CoreCard" });
            coreCard.OBT_param1 = atkWarCore;
            OBT.instance.uiManager.mountNode({ node: coreCard, parentNode: cardSlotList[i] });
        })
    }

    private _coreSelectTimeInit() {
        this._initCoreCard();
        this.view("Bottom/Link").active = true;
    }

    private _coreSelectDeadTime() {
        // 如果快超时了还停留在属性界面，切换回升级界面，隐藏“查看属性”入口
        this._showCoreSelectUI();

        this.view("Bottom/Link").active = false;
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


