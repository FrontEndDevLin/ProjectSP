import { EventTouch, find, Node, tween, UIOpacity, UITransform, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
import { PropIntro_Tooltips } from "../Controllers/GamePlay/GUI_Tooltips/PropIntro_Tooltips";
import CHRManager from "./CHRManager";
import { CHRInfo } from "../Common/Namespace";
import OBT from "../OBT";
import { transportWorldPosition } from "../Common/utils";

/**
 * 全局轻提示管理
 * 用于角色属性说明
 * 交互Tooltips等
 */
export default class GUI_TooltipsManager extends OBT_UIManager {
    static instance: GUI_TooltipsManager;

    private _tooltipsRootNode: Node;
    private _maskNode: Node;

    private _propIntroNode: Node;
    private _propIntroCtx: PropIntro_Tooltips;

    protected onLoad(): void {
        if (!GUI_TooltipsManager.instance) {
            GUI_TooltipsManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.initMaskNode();
    }

    private initMaskNode() {
        this._maskNode = this.loadPrefab({ prefabPath: "Common/Mask", scriptName: "NONE" });
        this._maskNode.setPosition(v3(0, 0, 0));
        this._maskNode.on(Node.EventType.TOUCH_START, this.preventSwallow, this);
        this._maskNode.on(Node.EventType.TOUCH_END, this.touchMask, this);
    }

    public initRootNode() {
        this._tooltipsRootNode = this.mountEmptyNode({ nodeName: "GUI_TooltipsWrap", parentNode: ProcessManager.instance.uiRootNode });
    }

    /**
     * 角色属性详情
     */
    public showPropIntroTooltips(propKey: string, node: Node) {
        if (!this._propIntroNode) {
            this._propIntroNode = this.loadPrefab({ prefabPath: "GUI_Tooltips/PropIntro_Tooltips" });
            this._propIntroCtx = this._propIntroNode.getComponent(PropIntro_Tooltips);
        }

        this.showMask();

        let position: Vec3 = transportWorldPosition(node.worldPosition);
        let targetUITransform: UITransform = node.getComponent(UITransform);
        let popupUITransform: UITransform = this._propIntroNode.getComponent(UITransform);
        this._propIntroNode.setPosition(v3(position.x + targetUITransform.width / 2 + popupUITransform.width / 2 + 20, position.y + targetUITransform.height / 2 - popupUITransform.height / 2, position.z));
        
        let item: CHRInfo.Prop = CHRManager.instance.propCtx.getPropInfo(propKey);
        this._propIntroCtx.updateView(item);
        this._tooltipsRootNode.addChild(this._propIntroNode);
    }

    /**
     * showMask方法, 决定当前mask是否可见, 点击是否隐藏, 点击是否穿透
     */
    private showMask() {
        this._maskNode.getComponent(UIOpacity).opacity = 0;
        this._tooltipsRootNode.addChild(this._maskNode);
    }

    private touchMask(event: EventTouch) {
        event.preventSwallow = true;
        this._tooltipsRootNode.removeChild(this._propIntroNode);
        this._tooltipsRootNode.removeChild(this._maskNode);
    }
    private preventSwallow(event: EventTouch) {
        event.preventSwallow = true;
    }

    protected onDestroy(): void {
        GUI_TooltipsManager.instance = null;
    }
}
