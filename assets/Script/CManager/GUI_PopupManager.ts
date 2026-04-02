import { EventTouch, find, Node, tween, UIOpacity, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
import { NodePool } from "cc";
import { PropIntro_Popup } from "../Controllers/GamePlay/GUI_Popup/PropIntro_Popup";
import CHRManager from "./CHRManager";
import { CHRInfo } from "../Common/Namespace";
import OBT from "../OBT";

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

    private _propIntroNode: Node;
    private _propIntroCtx: PropIntro_Popup;

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
        this._propIntroNode = this.loadPrefab({ prefabPath: "GUI_Popup/PropIntro_Popup" });
        this._propIntroCtx = this._propIntroNode.getComponent(PropIntro_Popup);
        this._maskNode = this.loadPrefab({ prefabPath: "Common/Mask", scriptName: "NONE" });
        this._maskNode.setPosition(v3(0, 0, 0));
        this._maskNode.on(Node.EventType.TOUCH_START, this.preventSwallow, this);
        this._maskNode.on(Node.EventType.TOUCH_END, this.touchMask, this);
    }

    public initRootNode() {
        this._popupRootNode = this.mountEmptyNode({ nodeName: "GUI_PopupWrap", parentNode: ProcessManager.instance.uiRootNode });
    }

    public showPropIntroPopup(propKey: string) {
        this.showMask();

        let item: CHRInfo.Prop = CHRManager.instance.propCtx.getPropInfo(propKey);
        this._propIntroCtx.updateView(item);
        this._popupRootNode.addChild(this._propIntroNode);
        // OBT.instance.printStructure();
    }

    /**
     * showMask方法, 决定当前mask是否可见, 点击是否隐藏, 点击是否穿透
     */
    
    private showMask() {
        this._maskNode.getComponent(UIOpacity).opacity = 0;
        this._popupRootNode.addChild(this._maskNode);
    }

    private touchMask(event: EventTouch) {
        event.preventSwallow = true;
        this._popupRootNode.removeChild(this._propIntroNode);
        this._popupRootNode.removeChild(this._maskNode);
    }
    private preventSwallow(event: EventTouch) {
        event.preventSwallow = true;
    }

    protected onDestroy(): void {
        GUI_PopupManager.instance = null;
    }
}
