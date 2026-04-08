import { EventTouch, find, Node, tween, UIOpacity, UITransform, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
import { NodePool } from "cc";
import CHRManager from "./CHRManager";
import { CHRInfo, SCREEN_WIDTH } from "../Common/Namespace";
import OBT from "../OBT";
import { transportWorldPosition } from "../Common/utils";
import { PropBoard_Popup } from "../Controllers/GamePlay/GUI_Popup/PropBoard_Popup";

export enum POPUP_NAME {
    SIDE_PROP = 1
}

export interface PopupMethodsMap {
    [popupName: string]: Function[]
}

/**
 * 全局弹窗管理
 * 弹窗分为
 *  局部弹窗
 *  全局弹窗
 */
export default class GUI_PopupManager extends OBT_UIManager {
    static instance: GUI_PopupManager;

    private _popupRootNode: Node;
    private _maskNode: Node;

    private _propBoardNode: Node;
    private _propBoardCtx: PropBoard_Popup;

    // 弹窗队列
    private queue: POPUP_NAME[] = [];

    private popupMethodsMap: PopupMethodsMap = {
        [POPUP_NAME.SIDE_PROP]: [this._showPropBoardPopup, this._closePropBoardPopup]
    }

    protected onLoad(): void {
        if (!GUI_PopupManager.instance) {
            GUI_PopupManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.initPopupNode();
    }
    public initRootNode() {
        this._popupRootNode = this.mountEmptyNode({ nodeName: "GUI_PopupWrap", parentNode: ProcessManager.instance.uiRootNode });
    }
    private initPopupNode() {
        this._maskNode = this.loadPrefab({ prefabPath: "Common/Mask", scriptName: "NONE" });
        this._maskNode.setPosition(v3(0, 0, 0));
        this._maskNode.on(Node.EventType.TOUCH_START, this.startTouchMask, this);
        this._maskNode.on(Node.EventType.TOUCH_END, this.touchMask, this);
    }

    /**
     * 队列相关
     * 入队后, 检查当前是否存在弹窗, 有则不处理, 没有则做弹窗
     * 出队后, 检查队列是否还有弹窗任务, 有则继续弹窗, 没有则不处理
     */
    private pushQueue(popupName: POPUP_NAME) {
        this.queue.push(popupName);
        if (this.queue[0] === popupName) {
            let showFn: Function = this.popupMethodsMap[popupName][0];
            if (showFn) {
                showFn.call(this);
            }
        }
    }
    private popQueue(event: EventTouch) {
        let popupName = this.queue[0]
        let closeFn: Function = this.popupMethodsMap[popupName][1];
        closeFn.call(this);
        this.queue.shift();

        let nextPopupName: POPUP_NAME = this.queue[0];
        if (nextPopupName) {
            let showFn: Function = this.popupMethodsMap[nextPopupName][0];
            if (showFn) {
                showFn.call(this);
            }
        }
    }

    /**
     * 角色属性面板弹窗
     */
    public showPropBoardPopup() {
        this.pushQueue(POPUP_NAME.SIDE_PROP);
    }
    private _showPropBoardPopup() {
        if (!this._propBoardNode) {
            this._propBoardNode = this.loadPrefab({ prefabPath: "GUI_Popup/PropBoard_Popup" });
            this._propBoardCtx = this._propBoardNode.getComponent(PropBoard_Popup);
            this._propBoardCtx.initBoard();
        }

        this.showMask();
        let position: Vec3 = v3(-SCREEN_WIDTH / 2, 0, 0);
        let popupUITransform: UITransform = this._propBoardNode.getComponent(UITransform);
        this._propBoardNode.setPosition(v3(position.x + popupUITransform.width / 2, position.y, 0));
        // this._propBoardNode.setPosition(v3(-100, 0, 0));

        this._popupRootNode.addChild(this._propBoardNode);
    }
    private _closePropBoardPopup() {
        this._popupRootNode.removeChild(this._propBoardNode);
        this._popupRootNode.removeChild(this._maskNode);
    }

    /**
     * showMask方法, 当前mask是否可见
     */
    private showMask(visiable: boolean = true) {
        this._maskNode.getComponent(UIOpacity).opacity = visiable ? 100 : 0;
        this._popupRootNode.addChild(this._maskNode);
    }

    private touchMask(event: EventTouch) {
        switch (this.queue[0]) {
            case POPUP_NAME.SIDE_PROP: {
                this.popQueue(event);
            } break;
        }
    }
    private startTouchMask(event: EventTouch) {
        // event.preventSwallow = true;
        switch (this.queue[0]) {
            case POPUP_NAME.SIDE_PROP: {
                // 点击侧边属性弹窗的遮罩, 不穿透事件, 侧边属性弹窗这里不做任何处理
            } break;
        }
    }

    protected onDestroy(): void {
        GUI_PopupManager.instance = null;
    }
}
