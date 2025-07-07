import { find } from "cc";
import OBT from "../OBT";
import OBT_Module from "../OBT_Module";
import MapManager from "../CManager/MapManager";
import CHRManager from "../CManager/CHRManager";
import DBManager from "../CManager/DBManager";
import EMYManager from "../CManager/EMYManager";
import GUI_GamePlayManager from "../CManager/GUI_GamePlayManager";
import BulletManager from "../CManager/BulletManager";

export class GamePlayModule extends OBT_Module {
    public bundleName: string = "GamePlay";

    public async enter(): Promise<void> {
        // this.resourceManager
        console.log('显示GamePlay')
        OBT.instance.uiManager.showPrefab({ prefabPath: "GamePlay", parentNode: this.rootNode });
        this.mountManagers();
    }
    
    public mountManagers() {
        this.addCustomManager(DBManager);
        this.addCustomManager(MapManager);
        this.addCustomManager(EMYManager);
        this.addCustomManager(CHRManager);
        this.addCustomManager(BulletManager);
        this.addCustomManager(GUI_GamePlayManager);
    }
}
