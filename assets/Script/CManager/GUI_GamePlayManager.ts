import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import OBT from "../OBT";
import { GamePlayEvent } from "../Common/Namespace";
import ProcessManager from "./ProcessManager";
export default class GUI_GamePlayManager extends OBT_UIManager {
    static instance: GUI_GamePlayManager;

    private _GUIGamePlayNode: Node;
    // 升级界面
    private _GUILevelUpNode: Node;
    // 备战界面
    private _GUIPrepareNode: Node;
    // 属性界面
    private _GUIPropNode: Node;

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

    protected onDestroy(): void {
        GUI_GamePlayManager.instance = null;
    }
}
