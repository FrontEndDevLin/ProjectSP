import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import OBT from "../OBT";
import { GamePlayEvent } from "../Common/Namespace";
export default class GUI_GamePlayManager extends OBT_UIManager {
    static instance: GUI_GamePlayManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    private _GUIGamePlayNode: Node;
    // 升级界面
    private _GUILevelUpNode: Node;
    // 备战界面
    private _GUIPrepareNode: Node;

    protected onLoad(): void {
        if (!GUI_GamePlayManager.instance) {
            GUI_GamePlayManager.instance = this
        } else {
            this.destroy();
            return;
        }
    }

    public initGamePlayGUI() {
        this._GUIGamePlayNode = this.showPrefab({ prefabPath: "GUI_GamePlay" });
    }
    public initLevelUpGUI() {
        this._GUILevelUpNode = this.showPrefab({ prefabPath: "GUI_LevelUp" });
    }
    public initPrepareGUI() {
        this._GUIPrepareNode = this.showPrefab({ prefabPath: "GUI_Prepare" });
    }

    public showGamePlayGUI() {
        this.showNode(this._GUIGamePlayNode);
    }
    public hideGamePlayGUI() {
        this.hideNode(this._GUIGamePlayNode);
    }

    public showLevelUpGUI() {
        this.showNode(this._GUILevelUpNode);
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
