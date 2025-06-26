import { _decorator, Node, EventTarget } from 'cc';
import OO_Manager from '../OO_Manager';
const { ccclass, property } = _decorator;

export default class OO_MsgManager extends OO_Manager {
    static instance: OO_MsgManager = null;

    protected onLoad(): void {
        if (!OO_MsgManager.instance) {
            OO_MsgManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    public sendMsg() {
        
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

let EventBusInstance: OO_EventBus = null;
class OO_EventBus extends EventTarget {
    constructor() {
        super();
        EventBusInstance = this;
    }
}

export const EventBus = EventBusInstance ? EventBusInstance : new OO_EventBus();