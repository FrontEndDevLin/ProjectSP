/**
 * 事件总线
 */

import { _decorator, Node, EventTarget, Component } from 'cc';
const { ccclass, property } = _decorator;

// export default class OBT_EventBusManager extends Component {
//     static instance: OBT_EventBusManager = null;

//     protected onLoad(): void {
//         if (!OBT_EventBusManager.instance) {
//             OBT_EventBusManager.instance = this;
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

export default class OBT_EventBusManager extends EventTarget {
    constructor() {
        super();
    }
}
