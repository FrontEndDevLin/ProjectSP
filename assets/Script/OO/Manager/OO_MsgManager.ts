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

let EventCenterInstance: OO_EventCenter = null;
class OO_EventCenter extends EventTarget {
    constructor() {
        super();
        EventCenterInstance = this;
    }
}

export const EventCenter = EventCenterInstance ? EventCenterInstance : new OO_EventCenter();