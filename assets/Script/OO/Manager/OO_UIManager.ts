import {
    _decorator,
    Node,
    find,
    instantiate,
    Prefab,
    Component,
    UITransform
} from 'cc';
import OO_ResourceManager from './OO_ResourceManager';
import OO_Manager from '../OO_Manager';
import { Callback } from '../Interface';

interface EventAndCtx {
    fn: Callback,
    ctx: any
}

interface EventMap {
    [eventName: string]: EventAndCtx[]
}
export default class OO_UIManager extends OO_Manager {
    static instance: OO_UIManager = null;
    public rootNode: Node = find("Canvas");

    public abName: string = "GUI";
    private _eventMap: EventMap = {};

    protected onLoad(): void {
        if (!OO_UIManager.instance) {
            OO_UIManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    // public showUnVisableUI(uiName, parentNode: Node = this.rootNode) {
    //     let uiPrefab = OO_ResourceManager.instance.getAssets(this.abName, `Prefabs/${uiName}`) as Prefab;
    //     if (!uiPrefab) {
    //         return;
    //     }
    //     const uiNode: Node = instantiate(uiPrefab);
    //     const scriptName: string = `${uiName}Ctrl`;
    //     try {
    //         uiNode.addComponent(scriptName);
    //     } catch (error) {
    //         console.info(`[OO_UIManager]:showUI:prefab ${uiName} doesn't have script ${scriptName}`);
    //     }
    // }
    protected runEventFn(event: number, params?) {
        let eventList: EventAndCtx[] = this._eventMap[event];
        if (eventList && eventList.length) {
            eventList.forEach(item => {
                if (item.ctx) {
                    item.fn.apply(item.ctx, [null, params]);
                } else {
                    item.fn(null, params);
                }
            })
        }
    }
    public on(event: number, callback: Callback, ctx?: any) {
        let eventList: EventAndCtx[] = this._eventMap[event];
        if (eventList && eventList.length) {
            let hasCallback = false;
            for (let eventOp of eventList) {
                if (eventOp.fn === callback && eventOp.ctx === ctx) {
                    hasCallback = true;
                    break;
                }
            }
            if (!hasCallback) {
                eventList.push({ fn: callback, ctx });
            }
        } else {
            this._eventMap[event] = [{ fn: callback, ctx }];
        }
    }
    public off(event: number, callback: Callback, ctx?: any) {
        let eventList: EventAndCtx[] = this._eventMap[event];
        if (eventList && eventList.length) {
            let hasCallback = false;
            let i = 0;
            for (let eventOp of eventList) {
                if (eventOp.fn === callback && eventOp.ctx === ctx) {
                    hasCallback = true;
                    break;
                }
                i++;
            }
            if (hasCallback) {
                eventList = eventList.splice(i, 1);
            }
        }
    }

    public showUI(uiName: string, parentNode: Node = this.rootNode, scriptName?: string): Node {
        const uiNode: Node = this.loadUINode(uiName, scriptName);
        if (!uiNode) {
            return null;
        }
        return this.appendUINode(uiNode, parentNode);
    }

    public appendUINode(uiNode: Node, parentNode: Node = this.rootNode): Node {
        parentNode.addChild(uiNode);
        return uiNode;
    }
    public loadUINode(uiUrl: string, scriptName?: string): Node {
        let abName = this.abName;

        if (uiUrl.includes(":")) {
            let uiUrlAry: string[] = uiUrl.split(":");
            abName = uiUrlAry[0];
            uiUrl = uiUrlAry[1];
        }
        let uiPrefab = OO_ResourceManager.instance.getAssets(abName, `Prefabs/${uiUrl}`) as Prefab;
        if (!uiPrefab) {
            return null;
        }
        const uiNode: Node = instantiate(uiPrefab);
        if (scriptName !== 'NONE') {
            scriptName = scriptName || `${uiUrl}Ctrl`;
            try {
                uiNode.addComponent(scriptName);
            } catch (error) {
                console.info(`[OO_UIManager]:showUI:prefab add script ${scriptName} error`);
                // console.info(error);
            }
        }
        return uiNode;
    }

    // 隐藏指定节点，隐藏后仍然可以触发事件
    public hideUI(uiName: string, parentNode: Node = this.rootNode): void {
        const uiNode: Node = parentNode.getChildByName(uiName);
    }

    public removeUI(uiName: string, parentNode: Node = this.rootNode): void {
        const uiNode: Node = parentNode.getChildByName(uiName);
        if (uiName === 'character/Character') {
            console.log(uiNode)
        }
        if (uiNode) {
            uiNode.destroy();
            // parentNode.removeChild(uiNode);
        }
    }
}
