/**
 * 游戏中，界面UI控制
 */

import { _decorator, Component, Label, Node, UITransform, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { CHRInfo, GamePlayEvent } from '../../Common/Namespace';
const { ccclass, property } = _decorator;

@ccclass('GUI_LevelUp')
export class GUI_LevelUp extends OBT_Component {
    protected onLoad(): void {
      this._loadLevelUpCard();
    }

    start() {
    }

    private _loadLevelUpCard() {
      const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
      const preLevelUpList: CHRInfo.UpdateProp[] = CHRManager.instance.propCtx.preUpdateList;
      preLevelUpList.forEach((updateProp, i) => {
        // preLevelUpList
        const levelUpCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/LevelUpCard" });
        levelUpCard.OBT_param1 = updateProp;
        OBT.instance.uiManager.mountNode({ node: levelUpCard, parentNode: cardSlotList[i] });
      })
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {
        
    }
}


