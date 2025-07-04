import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
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

    public showGamePlayGUI() {
        // console.log(find("Canvas"));
        this.showPrefab({ prefabPath: "GUI_GamePlay" });
    }

    protected onDestroy(): void {
        GUI_GamePlayManager.instance = null;
    }
}
