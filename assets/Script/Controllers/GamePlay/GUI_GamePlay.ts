/**
 * 游戏中，界面UI控制
 */

import { _decorator, Component, Label, Node, UITransform, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_GamePlay')
export class GUI_GamePlay extends OBT_Component {
    private _hpBarWidth: number = 0;

    protected onLoad(): void {
        this.view("CHRStatus").getComponent(Widget).target = OBT.instance.uiManager.rootNode;

        this._hpBarWidth = this.view("CHRStatus/HPWrap/BG").getComponent(UITransform).width;

        // temp
        this._updateHP();
    }

    start() {

    }

    private _updateHP() {
        // let hp: number = CHRManager.instance.hp.value;
        let hp: number = 8;
        // let hp_cur: number = CharacterPropManager.instance.hp_cur.value;
        let hp_cur: number = 8;
        let hpNumStr: string = `${hp_cur}/${hp}`;
        this.view("CHRStatus/HPWrap/HPNum").getComponent(Label).string = hpNumStr;

        let hpBarWidth: number = Math.floor(this._hpBarWidth * hp_cur / hp);
        this.view("CHRStatus/HPWrap/HPProg").getComponent(UITransform).width = hpBarWidth;
    }

    update(deltaTime: number) {
        
    }
}


