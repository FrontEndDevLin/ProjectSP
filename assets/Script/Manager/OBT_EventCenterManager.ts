/**
 * 事件总线
 */

import { _decorator, Node, EventTarget, Component } from 'cc';
const { ccclass, property } = _decorator;

// export default class OBT_EventCenterManager extends Component {
//     static instance: OBT_EventCenterManager = null;

//     protected onLoad(): void {
//         if (!OBT_EventCenterManager.instance) {
//             OBT_EventCenterManager.instance = this;
//         } else {
//             this.destroy();
//             return;
//         }
//     }

//     public sendMsg() {
        
//     }

//     start() {

//     }

//     update(deltaTime: number) {
        
//     }
// }

export default class OBT_EventCenterManager extends EventTarget {
    static instance: OBT_EventCenterManager = null;

    constructor() {
        super();

        OBT_EventCenterManager.instance = this;
    }
}
