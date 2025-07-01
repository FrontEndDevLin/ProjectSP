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

    /**
     * 可以挂入公用的自定义管理器，在这里挂入的管理器不会因为场景的切换而销毁
     */
    public addCustomManager() {

    }

    public async enterModule(moduleType: MODULE_TYPE) {
        if (this._currentModule) {
            this._currentModule.exit();
            this._currentModule = null;
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
