import { _decorator, JsonAsset, Node } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import OBT from '../OBT';

export default class DBManager extends OBT_UIManager {
    static instance: DBManager = null;

    protected onLoad(): void {
        if (!DBManager.instance) {
            DBManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        console.log("DB Manager loaded");
    }

    start() {

    }

    public getDbData(dbPath: string): any {
        const assets = OBT.instance.resourceManager.getJSONAssets(dbPath) as JsonAsset;
        if (assets) {
            return assets.json;
        }
    }

    update(deltaTime: number) {
        
    }
}

