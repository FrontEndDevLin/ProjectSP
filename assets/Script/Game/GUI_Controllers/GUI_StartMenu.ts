import { _decorator, Component, EventTouch, Node } from 'cc';
import OBT from '../../Obital/OBT';
import { MODULE_TYPE } from '../../Obital/Manager/OBT_ModuleManager';
const { ccclass, property } = _decorator;

@ccclass('GUI_StartMenu')
export class GUI_StartMenu extends Component {
    // protected onLoad(): void {
    //     super.onLoad();
    // }

    private _touchFn(event: EventTouch) {
        // 切换场景进入游戏界面
        // EventCenter.emit("startGame")
        OBT.instance.moduleManager.enterModule(MODULE_TYPE.GAME_PLAY);
    }

    start() {
        this.node.on(Node.EventType.TOUCH_START, this._touchFn);
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this._touchFn);
    }

    update(deltaTime: number) {
        
    }
}

