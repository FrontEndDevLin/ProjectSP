import { find } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
export default class CHRManager extends OBT_UIManager {
    static instance: CHRManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    protected onLoad(): void {
        if (!CHRManager.instance) {
            CHRManager.instance = this
        } else {
            this.destroy();
            return;
        }

        console.log('CHRManager Loaded')
    }

    public showCHR() {
        console.log('角色管理:显示角色')
        this.showPrefab({ prefabPath: "CHR/CHR01", scriptName: "NONE" });

        this.showPrefab({ prefabPath: "Compass" });
    }

    protected onDestroy(): void {
        console.log('销毁角色管理ing')

        CHRManager.instance = null;
    }
}
