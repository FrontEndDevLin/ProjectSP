import { find } from "cc";
import OBT from "../OBT";
import OBT_Module from "../OBT_Module";

export class GamePlayModule extends OBT_Module {
    public bundleName: string = "GamePlay";

    public async enter(): Promise<void> {
        // this.resourceManager
        console.log('显示GamePlay')
        OBT.instance.uiManager.showPrefab({ prefabPath: 'Map', parentNode: this.rootNode, scriptName: "NONE" })
    }
}
