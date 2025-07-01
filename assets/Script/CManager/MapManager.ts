import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
export default class MapManager extends OBT_UIManager {
    static instance: MapManager;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    protected onLoad(): void {
        if (!MapManager.instance) {
            MapManager.instance = this
        } else {
            this.destroy();
            return;
        }
    }

    public showMap() {
        // console.log(find("Canvas"));
        this.showPrefab({ prefabPath: "Map", scriptName: "NONE" });
        console.log('地图管理:显示地图')
    }

    protected onDestroy(): void {
        console.log('销毁地图管理ing')

        MapManager.instance = null;
    }
}
