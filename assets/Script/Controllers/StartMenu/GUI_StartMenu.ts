import { _decorator, Component, EventTouch, Node } from 'cc';
import OBT from '../../OBT';
import { MODULE_TYPE } from '../../Manager/OBT_ModuleManager';
import OBT_Component from '../../OBT_Component';
// import CHRManager from '../../CManager/CHRManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_StartMenu')
export class GUI_StartMenu extends OBT_Component {
    // protected onLoad(): void {
    //     super.onLoad();
    // }

    private _touchFn(event: EventTouch) {
        // 切换场景进入游戏界面
        OBT.instance.moduleManager.enterModule(MODULE_TYPE.GAME_PLAY);
    }

    start() {
        // console.log(this.view("/StartTxt"))
        this.node.on(Node.EventType.TOUCH_START, this._touchFn);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this._touchFn);
    }

    update(deltaTime: number) {
        
    }
}

