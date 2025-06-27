import OBT_Module from "../OBT_Module";
import { StartMenu } from "../Module/StartMenu";

export enum MODULE_TYPE {
    START_MENU,
    GAME_PLAY
}

export default class OBT_ModuleManager {
    private _currentModule: OBT_Module | null = null;

    public async enterModule(moduleType: MODULE_TYPE) {
        if (this._currentModule) {
            this._currentModule.exit();
            this._currentModule.destroy();
        }

        switch (moduleType) {
            case MODULE_TYPE.START_MENU: {
                this._currentModule = new StartMenu();
                await this._currentModule.loadBundle();
                await this._currentModule.enter();
            } break;
            case MODULE_TYPE.GAME_PLAY: {
                
            } break;
        }
    }
}
