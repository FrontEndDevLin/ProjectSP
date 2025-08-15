import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import OBT from "../OBT";
import { GamePlayEvent } from "../Common/Namespace";
export default class GUI_GamePlayManager extends OBT_UIManager {
    static instance: GUI_GamePlayManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    private _GUIGamePlayNode: Node;
    private _GUILevelUpNode: Node;

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

    protected onDestroy(): void {
        GUI_GamePlayManager.instance = null;
    }
}
