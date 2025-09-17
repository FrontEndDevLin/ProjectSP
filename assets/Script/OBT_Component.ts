/**
 * 通用组件类, 组件应继承本类
 */

import { Component, Node, v3, Vec3 } from "cc";

export default class OBT_Component extends Component {
    public view(path?: string): Node {
        return path ? this.node.getChildByPath(path) : this.node;
    }

    public hideNodeByPath(path: string = "") {
        let node: Node = this.view(path);
        this.hideNode(node);
    }
    public showNodeByPath(path: string = "") {
        let node: Node = this.view(path);
        this.showNode(node);
    }

    public showNode(node: Node) {
        node.setPosition(node.OBT_originalPosition || v3(0, 0, 0));
    }
    public hideNode(node: Node) {
        if (node.position.x === 3000 && node.position.y === 0) {
            return;
        }
        let oldPosition: Vec3 = node.position;
        node.OBT_originalPosition = v3(oldPosition.x, oldPosition.y);
        node.setPosition(v3(3000, 0, 0));
    }
}
