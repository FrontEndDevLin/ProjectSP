import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import OBT from "../OBT";
import { GamePlayEvent } from "../Common/Namespace";
export default class GUI_GamePlayManager extends OBT_UIManager {
    static instance: GUI_GamePlayManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    protected onLoad(): void {
        if (!GUI_GamePlayManager.instance) {
            GUI_GamePlayManager.instance = this
        } else {
            this.destroy();
            return;
        }
    }

    public initGamePlayGUI() {
        this.showPrefab({ prefabPath: "GUI_GamePlay" });
    }
    public initLevelUpGUI() {
        this.showPrefab({ prefabPath: "GUI_LevelUp" });
    }

    public showGamePlayGUI() {
        // console.log(find("Canvas"));
        OBT.instance.eventCenter.emit(GamePlayEvent.GUI.SHOW_GAME_PLAY);
    }

    public showLevelUpGUI() {
        this.showPrefab({ prefabPath: "GUI_LevelUp" });
    }
    public hideLevelUpGUI() {
        
    }

    protected onDestroy(): void {
        GUI_GamePlayManager.instance = null;
    }
}
