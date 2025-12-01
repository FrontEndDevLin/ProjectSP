import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { GamePlayEvent, ItemInfo } from '../../../Common/Namespace';
import OBT from '../../../OBT';
import ItemsManager from '../../../CManager/ItemsManager';
const { ccclass, property } = _decorator;

@ccclass('TrophyIconWrap')
export class TrophyIconWrap extends OBT_Component {
    protected onLoad(): void {
        OBT.instance.eventCenter.on(GamePlayEvent.GUI.UPDATE_TROPHY_ICON, this._updateTrophyIcon, this);
        // OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_FINISH, this._updateLevelIcon, this);
    }

    start() {
    }

    private _updateTrophyIcon() {
        const trophyList: ItemInfo.TROPHY_TYPE[] = ItemsManager.instance.getPickUpTrophyList();
        this.node.removeAllChildren();
        trophyList.forEach((trophy: ItemInfo.TROPHY_TYPE) => {
            let prefabPath: string = "";
            switch (trophy) {
                case ItemInfo.TROPHY_TYPE.CORE: {
                    prefabPath = "Common/CoreIcon";
                } break;
                case ItemInfo.TROPHY_TYPE.CORE_UPGRADE: {
                    prefabPath = "Common/CoreLevelupIcon";
                } break;
            }
            if (prefabPath) {
                OBT.instance.uiManager.showPrefab({
                    prefabPath,
                    scriptName: "NONE",
                    parentNode: this.node
                })
            }
        });
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GUI.UPDATE_TROPHY_ICON, this._updateTrophyIcon, this);
    }

    update(deltaTime: number) {
        
    }
}


