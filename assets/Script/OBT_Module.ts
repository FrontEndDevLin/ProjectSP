/**
 * 模块
 * 模块可控制子级模块
 * 
 *        大模块(空预制体)
 *      /       |       \
 *    子模块
 */

import { AssetManager, Component, Node } from "cc";
import OBT from "./OBT";

export default abstract class OBT_Module {
    public abstract bundleName: string;
    public rootNode: Node;

    public async init(): Promise<void> {
        this._createRootNode();
        await this._loadBundle();
    }

    private async _loadBundle(): Promise<AssetManager.Bundle> {
        if (!this.bundleName) {
            console.log("[OBT_Module]:loadBundle error, 无法加载资源, bundleName为空");
            return;
        }
        return await OBT.instance.resourceManager.loadBundle(this.bundleName);
    }

    private _createRootNode() {
        let moduleRootNode: Node = OBT.instance.uiManager.mountEmptyNode({ nodeName: this.bundleName })
        // 挂载管理节点，该场景的管理器都挂到该节点上
        OBT.instance.uiManager.mountEmptyNode({ nodeName: `${this.bundleName}_Manager`, parentNode: moduleRootNode });
        this.rootNode = moduleRootNode;
    }

    public addCustomManager(manager) {
        let managerNode: Node = this.rootNode.getChildByName(`${this.bundleName}_Manager`);
        managerNode.addComponent(manager);
    }

    public abstract enter(): Promise<void>;
    // public abstract exit(): Promise<void>;
    public async exit() {
        // 释放资源
        OBT.instance.uiManager.removeNode(this.rootNode);
        OBT.instance.resourceManager.releaseBundle();
    }
    
    protected onLoad(): void {
        
    }
}
