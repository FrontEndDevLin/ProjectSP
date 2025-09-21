import { find, Node } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
export default class MapManager extends OBT_UIManager {
    static instance: MapManager;

    private _mapNode: Node;

    protected onLoad(): void {
        if (!MapManager.instance) {
            MapManager.instance = this
        } else {
            this.destroy();
            return;
        }
    }

    public initMap() {
        this._mapNode = this.showPrefab({ prefabPath: "Map", scriptName: "NONE", parentNode: ProcessManager.instance.mapRootNode });
    }

    public showMap() {
        this.showNode(this._mapNode);
    }
    public hideMap() {
        this.hideNode(this._mapNode);
    }

    protected onDestroy(): void {
        console.log('销毁地图管理ing')

        MapManager.instance = null;
    }
}
