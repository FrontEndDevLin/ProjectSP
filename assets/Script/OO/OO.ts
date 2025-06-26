import { _decorator, Component, instantiate, Node, Prefab, UI } from 'cc';
const { ccclass, property } = _decorator;

import OO_MsgManager from './Manager/OO_MsgManager';
import OO_ResourceManager from './Manager/OO_ResourceManager';
import OO_UIManager from './Manager/OO_UIManager';
import Main from '../Game/Main';

interface View {
    [viewPath: string]: Node
}

export class OO_Component extends Component {
    protected views: View = {};
    public abName: string = "GUI";

    private _loadViews(root: Node, path: string = ""): void {
        let children = root.children;
        for (let node of children) {
            let p = path + node.name;
            this.views[p] = node;
            if (node.children.length) {
                this._loadViews(node, `${p}/`);
            }
        }
    }

    public showUI(uiName: string, scriptName?: string): Node {
        const uiNode: Node = this.loadUINode(uiName, scriptName);
        if (!uiNode) {
            return null;
        }
        return this.appendUINode(uiNode);
    }
    public appendUINode(uiNode: Node) {
        this.node.addChild(uiNode);
        return uiNode;
    }
    public loadUINode(uiUrl: string, scriptName?: string) {
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
                console.info(`[OO_Component]:showUI:prefab add script ${scriptName} error`);
                // console.info(error);
            }
        }
        return uiNode;
    }
    public updateView() {
        this.views = {};
        this._loadViews(this.node);
    }

    protected onLoad(): void {
        this.updateView();
    }
}

@ccclass('OO')
export default class OO extends Component {
    protected onLoad(): void {
        this.node.addComponent(OO_MsgManager);
        this.node.addComponent(OO_ResourceManager);
        this.node.addComponent(OO_UIManager);

        this.node.addComponent(Main);

        console.log(`framework [OO] started.`);
        Main.instance.runGame();
    }
}
