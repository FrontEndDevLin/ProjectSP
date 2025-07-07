import { _decorator, JsonAsset, Node } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import OBT from '../OBT';
import { copyObject } from '../Common/utils';

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

    public getDBData(dbPath: string): any {
        const assets = OBT.instance.resourceManager.getJSONAssets(dbPath) as JsonAsset;
        if (assets) {
            return copyObject(assets.json);
        }
    }

    update(deltaTime: number) {
        
    }
}

