import { find, Node, tween, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";
export default class MapManager extends OBT_UIManager {
    static instance: MapManager;

    private _mapNode: Node;

    protected shaking: boolean = false;

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

    /**
     * 震屏, 用于触发暴击时
     */
    public shakeMap() {
        if (this.shaking) {
            return;
        }

        tween(this._mapNode)
            .to(0.1, { position: v3(2, 2, 0) }, {
                easing: "backIn",      
                onStart: (target?: object) => {
                    this.shaking = true;
                }
            })
            .to(0.2, { position: v3(0, 0, 0) }, {
                easing: "backIn",
                onComplete: (target?: object) => {
                    this.shaking = false;
                }
            })
            .start();
    }

    protected onDestroy(): void {
        console.log('销毁地图管理ing')

        MapManager.instance = null;
    }
}
