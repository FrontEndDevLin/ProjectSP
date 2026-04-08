import { EventTouch, find, Node, tween, UIOpacity, UITransform, v3, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import ProcessManager from "./ProcessManager";

export interface PopupMethodsMap {
    [popupName: string]: Function[]
}

/**
 * 全局弹窗管理
 * 弹窗分为
 *  局部弹窗
 *  全局弹窗
 */
export default class GUI_PopupManagerBase extends OBT_UIManager {
    protected rootNodeName: string = "";

    protected popupRootNode: Node;
    protected maskNode: Node;
    protected maskVisiable: boolean = true;

    // 弹窗队列
    protected queue: number[] = [];

    protected popupMethodsMap: PopupMethodsMap;

    protected onLoad(): void {
        this.initPopupNode();
    }
    public initRootNode() {
        this.popupRootNode = this.mountEmptyNode({ nodeName: this.rootNodeName, parentNode: ProcessManager.instance.uiRootNode });
    }
    private initPopupNode() {
        this.maskNode = this.loadPrefab({ prefabPath: "Common/Mask", scriptName: "NONE" });
        this.maskNode.setPosition(v3(0, 0, 0));
        this.maskNode.on(Node.EventType.TOUCH_START, this.startTouchMask, this);
        this.maskNode.on(Node.EventType.TOUCH_END, this.touchMask, this);
    }

    /**
     * 队列相关
     * 入队后, 检查当前是否存在弹窗, 有则不处理, 没有则做弹窗
     * 出队后, 检查队列是否还有弹窗任务, 有则继续弹窗, 没有则不处理
     */
    protected pushQueue(popupName: number, options?: any) {
        if (this.queue.indexOf(popupName) !== -1) {
            console.log('重复弹窗, 拒绝入队');
            return;
        }
        this.queue.push(popupName);
        if (this.queue[0] === popupName) {
            let showFn: Function = this.popupMethodsMap[popupName][0];
            if (showFn) {
                showFn.call(this, options);
            }
        }
    }
    protected popQueue(event: EventTouch) {
        let popupName = this.queue[0]
        let closeFn: Function = this.popupMethodsMap[popupName][1];
        closeFn.call(this, event);
        this.queue.shift();

        let nextPopupName: number = this.queue[0];
        if (nextPopupName) {
            let showFn: Function = this.popupMethodsMap[nextPopupName][0];
            if (showFn) {
                showFn.call(this);
            }
        }
    }

    /**
     * showMask方法, 当前mask是否可见
     */
    protected showMask(visiable: boolean = this.maskVisiable) {
        this.maskNode.getComponent(UIOpacity).opacity = visiable ? 100 : 0;
        this.popupRootNode.addChild(this.maskNode);
    }
    protected hideMask() {
        this.popupRootNode.removeChild(this.maskNode);
    }

    protected touchMask(event: EventTouch) {}
    protected startTouchMask(event: EventTouch) {}
}
