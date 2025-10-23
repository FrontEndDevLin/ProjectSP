import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import OBT from "../OBT";
import { GamePlayEvent } from "../Common/Namespace";
import ProcessManager from "./ProcessManager";
export default class GUI_GamePlayManager extends OBT_UIManager {
    static instance: GUI_GamePlayManager;

    private _GUIGamePlayNode: Node;
    // 核心选择界面
    private _GUICoreSelectNode: Node;
    // 升级界面
    private _GUILevelUpNode: Node;
    // 备战界面
    private _GUIPrepareNode: Node;
    // 属性界面
    private _GUIPropNode: Node;
    // 弹窗界面
    private _GUIPopupNode: Node;

    // 属性外壳
    private _propWrap: Node;
    // 背包外壳
    private _backPackWrap: Node;

    protected onLoad(): void {
        if (!GUI_GamePlayManager.instance) {
            GUI_GamePlayManager.instance = this
        } else {
            this.destroy();
            return;
        }
    }

    public initGamePlayGUI() {
        this._GUIGamePlayNode = this.showPrefab({ prefabPath: "GUI_GamePlay", parentNode: ProcessManager.instance.uiRootNode });
    }
    public initPropGUI() {
        this._GUIPropNode = this.showPrefab({ prefabPath: "GUI_Prop", parentNode: ProcessManager.instance.uiRootNode });
    }
    public initLevelUpGUI() {
        this._GUILevelUpNode = this.showPrefab({ prefabPath: "GUI_LevelUp", parentNode: ProcessManager.instance.uiRootNode });
    }
    public initPrepareGUI() {
        this._GUIPrepareNode = this.showPrefab({ prefabPath: "GUI_Prepare", parentNode: ProcessManager.instance.uiRootNode });
    }
    public initPopupGUI() {
        this._GUIPopupNode = this.showPrefab({ prefabPath: "GUI_Popup", parentNode: ProcessManager.instance.uiRootNode });
    }
    public initCoreSelectGUI() {
        this._GUICoreSelectNode = this.showPrefab({ prefabPath: "GUI_CoreSelect", parentNode: ProcessManager.instance.uiRootNode });
    }

    public showGamePlayGUI() {
        this.showNode(this._GUIGamePlayNode);
    }
    public hideGamePlayGUI() {
        this.hideNode(this._GUIGamePlayNode);
    }

    public showPropGUI() {
        this.showNode(this._GUIPropNode);
    }
    public hidePropGUI() {
        this.hideNode(this._GUIPropNode);
    }

    public showLevelUpGUI() {
        this.showNode(this._GUILevelUpNode);
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_LEVEL_UP_UI);
    }
    public hideLevelUpGUI() {
        this.hideNode(this._GUILevelUpNode);
    }

    public showPrepareGUI() {
        this.showNode(this._GUIPrepareNode);
    }
    public hidePrepareGUI() {
        this.hideNode(this._GUIPrepareNode);
    }
    public showPopupGUI() {
        this.showNode(this._GUIPopupNode);
    }
    public hidePopupGUI() {
        this.hideNode(this._GUIPopupNode);
    }

    public showCoreSelectGUI() {
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_CORE_SELECT_UI);
        this.showNode(this._GUICoreSelectNode);
    }
    public hideCoreSelectGUI() {
        this.hideNode(this._GUICoreSelectNode);
    }

    public setBackpackWrapNode(node: Node) {
        this._backPackWrap = node;
    }
    public getBackpackWrapNode() {
        return this._backPackWrap;
    }
    public setPropWrapNode(node: Node) {
        this._propWrap = node;
    }
    public getPropWrapNode() {
        return this._propWrap;
    }

    protected onDestroy(): void {
        GUI_GamePlayManager.instance = null;
    }
}
