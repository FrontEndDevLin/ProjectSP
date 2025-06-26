import { _decorator, Component, Node, find } from 'cc';
const { ccclass, property } = _decorator;

export default class OO_Manager extends Component {
    protected onLoad(): void {
    }

    // public regis
}

let canvasNode: Node = null;
export function OO_AddManager(Manager) {
    if (!canvasNode) {
        canvasNode = find("Canvas");
    }
    canvasNode.addComponent(Manager)
}
