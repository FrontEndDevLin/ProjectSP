import { Component } from "cc";
import OBT_EventBusManager from "./OBT_EventBusManager";
import OBT_ResourceManager from "./OBT_ResourceManager";
import OBT_Module from "../Obital_Module";
import { StartMenu } from "../Module/StartMenu";

export enum MODULE_TYPE {
    START_MENU,
    GAME_PLAY
}

export default class OBT_ModuleManager {
    private _currentModule: OBT_Module | null = null;

    constructor(protected eventBus: OBT_EventBusManager, protected resourceManager: OBT_ResourceManager) {}

    public enterModule(moduleType: MODULE_TYPE) {
        if (this._currentModule) {
            this._currentModule.exit();
            this._currentModule.destroy();
        }

        switch (moduleType) {
            case MODULE_TYPE.START_MENU: {
                this._currentModule = new StartMenu(this.eventBus, this.resourceManager);
                this._currentModule.enter();
            } break;
            case MODULE_TYPE.GAME_PLAY: {
                
            } break;
        }
    }
}
