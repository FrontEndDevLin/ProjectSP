import { EventTouch, find, Node, tween, UIOpacity, UITransform, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
import { NodePool } from "cc";
import CHRManager from "./CHRManager";
import { CHRInfo, SCREEN_WIDTH } from "../Common/Namespace";
import OBT from "../OBT";
import { transportWorldPosition } from "../Common/utils";
import { PropBoard_Popup } from "../Controllers/GamePlay/GUI_Popup/PropBoard_Popup";

/**
 * 全局弹窗管理-暂时作废
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

    protected onLoad(): void {
        if (!GUI_PopupManager.instance) {
            GUI_PopupManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.initPopupNode();
    }

    public initPopupNode() {
        this._maskNode = this.loadPrefab({ prefabPath: "Common/Mask", scriptName: "NONE" });
        this._maskNode.setPosition(v3(0, 0, 0));
        this._maskNode.on(Node.EventType.TOUCH_START, this.preventSwallow, this);
        this._maskNode.on(Node.EventType.TOUCH_END, this.touchMask, this);
    }

    public initRootNode() {
        this._popupRootNode = this.mountEmptyNode({ nodeName: "GUI_PopupWrap", parentNode: ProcessManager.instance.uiRootNode });
    }

    /**
     * 角色属性面板弹窗
     */
    public showPropBoardPopup() {
        if (!this._propBoardNode) {
            this._propBoardNode = this.loadPrefab({ prefabPath: "GUI_Popup/PropBoard_Popup" });
            this._propBoardCtx = this._propBoardNode.getComponent(PropBoard_Popup);
            this._propBoardCtx.initBoard();
        }

        this.showMask();
        let position: Vec3 = transportWorldPosition(v3(-SCREEN_WIDTH / 2, 0, 0));
        let popupUITransform: UITransform = this._propBoardNode.getComponent(UITransform);
        // this._propBoardNode.setPosition(v3(position.x + popupUITransform.width / 2, position.y, 0));
        this._propBoardNode.setPosition(v3(0, 0, 0));

        this._popupRootNode.addChild(this._propBoardNode);
    }

    /**
     * showMask方法, 决定当前mask是否可见, 点击是否隐藏, 点击是否穿透
     */
    private showMask() {
        this._maskNode.getComponent(UIOpacity).opacity = 100;
        this._popupRootNode.addChild(this._maskNode);
    }

    private touchMask(event: EventTouch) {
        // event.preventSwallow = true;
    }
    private preventSwallow(event: EventTouch) {
        // event.preventSwallow = true;
    }

    protected onDestroy(): void {
        GUI_PopupManager.instance = null;
    }
}
