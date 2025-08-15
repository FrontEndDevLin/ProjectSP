/**
 * 预设体管理器，管理预设体的显示隐藏
 */

import { _decorator, Node, find, instantiate, Prefab, Component, UITransform } from 'cc';
import OBT_ResourceManager from './OBT_ResourceManager';
import OBT_Component from '../OBT_Component';
// import OBT from '../OBT';

interface LoadPrefabOptions {
    prefabPath: string,
    scriptName?: string
}
interface ShowPrefabOptions extends LoadPrefabOptions {
    parentNode?: Node
}
interface MountNodeOptions {
    node: Node,
    parentNode?: Node
}
interface RemoveNodeOptions {
    nodeName: string,
    parentNode: Node
}
interface MountEmptyNodeOptions {
    nodeName: string,
    parentNode?: Node
}

export default class OBT_UIManager extends OBT_Component {
    static instance: OBT_UIManager = null;
    public rootNode: Node = find("Canvas");

    protected onLoad(): void {
        if (!OBT_UIManager.instance) {
            OBT_UIManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    public showPrefab(showPrefabOptions: ShowPrefabOptions): Node {
        const { prefabPath, scriptName, parentNode } = showPrefabOptions;
        const node: Node = this.loadPrefab({ prefabPath, scriptName });
        if (!node) {
            return null;
        }
        return this.mountNode({ node, parentNode });
    }
    public loadPrefab(loadPrefabOptions: LoadPrefabOptions): Node {
        let { prefabPath, scriptName } = loadPrefabOptions;
        let uiPrefab: Prefab = OBT_ResourceManager.instance.getPrefabAssets(prefabPath) as Prefab;
        if (!uiPrefab) {
            return null;
        }
        const uiNode: Node = instantiate(uiPrefab);
        if (scriptName !== 'NONE') {
            scriptName = scriptName || uiNode.name;
            try {
                uiNode.addComponent(scriptName);
            } catch (error) {
                console.info(`[OBT_UIManager]:showUI:prefab add script ${scriptName} error`);
                console.info(error);
            }
        }
        return uiNode;
    }
    public mountNode(mountNodeOptions: MountNodeOptions): Node {
        let { node, parentNode = this.rootNode } = mountNodeOptions;
        parentNode.addChild(node);
        return node;
    }
    public removeNode(removeNodeOptions: Node | RemoveNodeOptions) {
        if (removeNodeOptions instanceof Node) {
            const node = removeNodeOptions;
            node.destroy();
        } else {
            const { nodeName, parentNode } = removeNodeOptions;
            const node: Node = parentNode.getChildByName(nodeName);
            node.destroy();
        }
    }

    public mountEmptyNode(options: MountEmptyNodeOptions): Node {
        let { nodeName, parentNode } = options
        if (!parentNode) {
            parentNode = this.rootNode;
        }
        let node: Node = new Node(nodeName);
        parentNode.addChild(node);
        return node;
    }
}
