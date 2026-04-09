import { EventTouch, find, Node, tween, UIOpacity, UITransform, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
import { PropIntro_Tooltips } from "../Controllers/GamePlay/GUI_Tooltips/PropIntro_Tooltips";
import CHRManager from "./CHRManager";
import { CHRInfo } from "../Common/Namespace";
import OBT from "../OBT";
import { transportWorldPosition } from "../Common/utils";
import GUI_PopupManagerBase, { PopupMethodsMap } from "./GUI_PopupManagerBase";
import { AtkCore_Tooltips } from "../Controllers/GamePlay/GUI_Tooltips/AtkCore_Tooltips";
import { UpgradePack_Tooltips } from "../Controllers/GamePlay/GUI_Tooltips/UpgradePack_Tooltips";

export enum TOOLTIPS_NAME {
    PROP_DETAIL = 1,
    ATK_CORE_DETAIL = 2,
    UPGRADE_PACK_DETAIL = 3,
    ITEM_DETAIL = 4
}

export interface showPropIntroFnOptions {
    propKey: string,
    node: Node
}

/**
 * 全局轻提示管理
 * 用于角色属性说明
 * 交互Tooltips等
 */
export default class GUI_TooltipsManager extends GUI_PopupManagerBase {
    static instance: GUI_TooltipsManager;

    protected rootNodeName: string = "GUI_TooltipsWrap";
    
    protected maskVisiable: boolean = false;

    private _propIntroNode: Node;
    private _propIntroCtx: PropIntro_Tooltips;

    private _atkCoreDetailNode: Node;
    private _atkCoreDetailCtx: AtkCore_Tooltips;

    private _upgradePackDetailNode: Node;
    private _upgradePackDetailCtx: UpgradePack_Tooltips;

    protected popupMethodsMap: PopupMethodsMap = {
        [TOOLTIPS_NAME.PROP_DETAIL]: [this._showPropIntroTooltips, this._closePropIntroTooltips],
        [TOOLTIPS_NAME.ATK_CORE_DETAIL]: [this._showAtkCoreTooltips, this._closeAtkCoreTooltips],
        [TOOLTIPS_NAME.UPGRADE_PACK_DETAIL]: [this._showUpgradePackTooltips, this._closeUpgradePackTooltips],
        [TOOLTIPS_NAME.ITEM_DETAIL]: [this._showItemTooltips, this._closeItemTooltips]
    };

    protected onLoad(): void {
        super.onLoad();
        if (!GUI_TooltipsManager.instance) {
            GUI_TooltipsManager.instance = this
        } else {
            this.destroy();
            return;
        }
    }

    /**
     * 角色属性详情
     */
    public showPropIntroTooltips(options: showPropIntroFnOptions) {
        this.pushQueue(TOOLTIPS_NAME.PROP_DETAIL, options);
    }
    private _showPropIntroTooltips({ propKey, node }: showPropIntroFnOptions) {
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
        this.popupRootNode.addChild(this._propIntroNode);
    }
    private _closePropIntroTooltips(event: EventTouch) {
        event.preventSwallow = true;
        this.popupRootNode.removeChild(this._propIntroNode);
        this.hideMask();
    }

    /**
     * 核心详情
     */
    public showAtkCoreTooltips() {
        this.pushQueue(TOOLTIPS_NAME.ATK_CORE_DETAIL);
    }
    private _showAtkCoreTooltips() {
        if (!this._atkCoreDetailNode) {
            this._atkCoreDetailNode = this.loadPrefab({ prefabPath: "GUI_Tooltips/AtkCore_Tooltips" });
            this._atkCoreDetailCtx = this._atkCoreDetailNode.getComponent(AtkCore_Tooltips);
            this._atkCoreDetailCtx.initAtkCorePreview();
        }

        this.showMask();
        this.popupRootNode.addChild(this._atkCoreDetailNode);
    }
    private _closeAtkCoreTooltips(event: EventTouch) {
        event.preventSwallow = true;
        this.popupRootNode.removeChild(this._atkCoreDetailNode);
        this.hideMask();
    }

    /**
     * 核心升级包详情
     */
    public showUpgradePackTooltips() {
        this.pushQueue(TOOLTIPS_NAME.UPGRADE_PACK_DETAIL);
    }
    private _showUpgradePackTooltips() {
        if (!this._upgradePackDetailNode) {
            this._upgradePackDetailNode = this.loadPrefab({ prefabPath: "GUI_Tooltips/UpgradePack_Tooltips" });
            this._upgradePackDetailCtx = this._upgradePackDetailNode.getComponent(UpgradePack_Tooltips);
            this._upgradePackDetailCtx.initUpgradePackPreview();
        }

        this.showMask();
        this.popupRootNode.addChild(this._upgradePackDetailNode);
    }
    private _closeUpgradePackTooltips(event: EventTouch) {
        event.preventSwallow = true;
        this.popupRootNode.removeChild(this._upgradePackDetailNode);
        this.hideMask();
    }

    /**
     * 道具详情
     */
    public showItemTooltips() {}
    private _showItemTooltips() {}
    private _closeItemTooltips(event: EventTouch) {}

    protected startTouchMask(event: EventTouch) {
        switch (this.queue[0]) {
            case TOOLTIPS_NAME.PROP_DETAIL:
            case TOOLTIPS_NAME.ATK_CORE_DETAIL:
            case TOOLTIPS_NAME.UPGRADE_PACK_DETAIL: {
                event.preventSwallow = true;
            } break;
        }
    }
    protected touchMask(event: EventTouch) {
        switch (this.queue[0]) {
            case TOOLTIPS_NAME.PROP_DETAIL:
            case TOOLTIPS_NAME.ATK_CORE_DETAIL:
            case TOOLTIPS_NAME.UPGRADE_PACK_DETAIL: {
                this.popQueue(event);
            } break;
        }
    }

    protected onDestroy(): void {
        GUI_TooltipsManager.instance = null;
    }
}
