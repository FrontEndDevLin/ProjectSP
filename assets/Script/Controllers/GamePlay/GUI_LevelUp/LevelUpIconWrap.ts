import { _decorator, Component, Label, Node } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GamePlayEvent } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import OBT from '../../../OBT';
const { ccclass, property } = _decorator;

@ccclass('LevelUpIconWrap')
export class LevelUpIconWrap extends OBT_Component {
    private _props: CHRInfo.upgradeProp;

    protected onLoad(): void {
        // this.node.once(Node.EventType.TOUCH_END, this._touchCard, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP, this._updateLevelIcon, this);
        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.LEVEL_UP_FINISH, this._updateLevelIcon, this);
    }

    start() {
        this._updateLevelIcon();
    }

    private _updateLevelIcon() {
        const levelUpCnt: number = CHRManager.instance.getLevelUpCnt();
        this.node.removeAllChildren();
        // this._levelUpIconUINode.removeAllChildren();
        for (let i = 0; i < levelUpCnt; i++) {
            OBT.instance.uiManager.showPrefab({
                prefabPath: "Common/LevelUpIcon",
                scriptName: "NONE",
                parentNode: this.node
            })
        }
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.LEVEL_UP, this._updateLevelIcon, this);
    }

    update(deltaTime: number) {
        
    }
}


