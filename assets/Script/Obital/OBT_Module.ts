/**
 * 模块
 * 模块可控制子级模块
 * 
 *        大模块(空预制体)
 *      /       |       \
 *    子模块
 */

import { AssetManager, Component } from "cc";
import OBT from "./OBT";

export default abstract class OBT_Module extends Component {
    public abstract bundleName: string;

    constructor() {
        super();
    }

    public async loadBundle(): Promise<AssetManager.Bundle> {
        if (!this.bundleName) {
            console.log("[OBT_Module]:loadBundle error, 无法加载资源, bundleName为空");
            return;
        }
        return await OBT.instance.resourceManager.loadBundle(this.bundleName);
    }

    public abstract enter(): Promise<void>;
    public abstract exit(): Promise<void>;

    
    protected onLoad(): void {
        
    }
}
