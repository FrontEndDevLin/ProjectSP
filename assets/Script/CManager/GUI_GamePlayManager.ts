import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import OBT from "../OBT";
import { GamePlayEvent } from "../Common/Namespace";
import ProcessManager from "./ProcessManager";
import { GUI_GamePlay } from "../Controllers/GamePlay/GUI_GamePlay";
export default class GUI_GamePlayManager extends OBT_UIManager {
    static instance: GUI_GamePlayManager;

    private _GUIGamePlayNode: Node;
    // 备战界面
    private _GUIPrepareNode: Node;
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
    public initPrepareGUI() {
        this._GUIPrepareNode = this.showPrefab({ prefabPath: "GUI_Prepare", parentNode: ProcessManager.instance.uiRootNode });
    }

    public showGamePlayGUI() {
        this.showNode(this._GUIGamePlayNode);
    }
    public hideGamePlayGUI() {
        this._GUIGamePlayNode.getComponent(GUI_GamePlay).resetGamePlayView();
        this.hideNode(this._GUIGamePlayNode);
    }

    public showLevelUpGUI() {
        this._GUIGamePlayNode.getComponent(GUI_GamePlay).showLevelUpView();
    }

    public showChestOpenGUI() {
        this._GUIGamePlayNode.getComponent(GUI_GamePlay).showChestOpenView();
    }

    public showPrepareGUI() {
        this.showNode(this._GUIPrepareNode);
    }
    public hidePrepareGUI() {
        this.hideNode(this._GUIPrepareNode);
    }

    public showCoreSelectGUI() {
        this._GUIGamePlayNode.getComponent(GUI_GamePlay).showCoreSelectView();
    }

    public showCoreUpgradeGUI() {
        this._GUIGamePlayNode.getComponent(GUI_GamePlay).showCoreUpgradeView();
    }

    public setBackpackWrapNode(node: Node) {
        this._backPackWrap = node;
    }
    public getBackpackWrapNode() {
        return this._backPackWrap;
    }

    protected onDestroy(): void {
        GUI_GamePlayManager.instance = null;
    }
}
