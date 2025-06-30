import OBT_Module from "../OBT_Module";
import { StartMenuModule } from "../Module/StartMenuModule";
import { find } from "cc";
import { GamePlayModule } from "../Module/GamePlayModule";

export enum MODULE_TYPE {
    START_MENU,
    GAME_PLAY
}

export default class OBT_ModuleManager {
    private _currentModule: OBT_Module | null = null;

    public async enterModule(moduleType: MODULE_TYPE) {
        if (this._currentModule) {
            this._currentModule.exit();
            this._currentModule = null;
            console.log(find("Canvas"))
        }

        switch (moduleType) {
            case MODULE_TYPE.START_MENU: {
                this._currentModule = new StartMenuModule();
            } break;
            case MODULE_TYPE.GAME_PLAY: {
                this._currentModule = new GamePlayModule();
            } break;
        }

        if (this._currentModule) {
            await this._currentModule.init();
            await this._currentModule.enter();
        }
    }
}
