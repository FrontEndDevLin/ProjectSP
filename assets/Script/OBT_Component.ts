/**
 * 通用组件类, 组件应继承本类
 */

import { Component, Node } from "cc";

export default class OBT_Component extends Component {
    public view(path: string): Node {
        return this.node.getChildByPath(path);
    }
}
