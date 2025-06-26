import { _decorator, EventTouch, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
const { ccclass, property } = _decorator;

@ccclass('StartMenuCtrl')
export class StartMenuCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
    }

    private _touchFn(event: EventTouch) {
        // 移除当前UI界面
        // 目前直接进入game play
        EventBus.emit("startGame")
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

