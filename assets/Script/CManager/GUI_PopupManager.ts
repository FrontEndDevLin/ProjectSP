import { EventTouch, find, Node, tween, UIOpacity, UITransform, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
import { CHRInfo, SCREEN_WIDTH } from "../Common/Namespace";
import { PropBoard_Popup } from "../Controllers/GamePlay/GUI_Popup/PropBoard_Popup";
import GUI_PopupManagerBase, { PopupMethodsMap } from "./GUI_PopupManagerBase";

export enum POPUP_NAME {
    SIDE_PROP = 1
}

/**
 * 全局弹窗管理
 * 弹窗分为
 *  局部弹窗
 *  全局弹窗
 */
export default class GUI_PopupManager extends GUI_PopupManagerBase {
    static instance: GUI_PopupManager;

    protected rootNodeName: string = "GUI_PopupWrap";
    protected maskVisiable: boolean = true;

    private _propBoardNode: Node;
    private _propBoardCtx: PropBoard_Popup;

    protected popupMethodsMap: PopupMethodsMap = {
        [POPUP_NAME.SIDE_PROP]: [this._showPropBoardPopup, this._closePropBoardPopup]
    }

    protected onLoad(): void {
        super.onLoad();
        if (!GUI_PopupManager.instance) {
            GUI_PopupManager.instance = this
        } else {
            this.destroy();
            return;
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

        this.popupRootNode.addChild(this._propBoardNode);
    }
    private _closePropBoardPopup() {
        this.popupRootNode.removeChild(this._propBoardNode);
        this.hideMask();
    }

    protected touchMask(event: EventTouch) {
        switch (this.queue[0]) {
            case POPUP_NAME.SIDE_PROP: {
                this.popQueue(event);
            } break;
        }
    }
    protected startTouchMask(event: EventTouch) {
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
