/**
 * 资源管理器
 */

import { _decorator, Component, Node, assetManager, AssetManager, Asset, resources, Prefab, SpriteFrame } from 'cc';

export default class OBT_ResourceManager {
    static instance: OBT_ResourceManager = null;

    constructor() {
        OBT_ResourceManager.instance = this;
    }

    private _bundleName: string = "";

    private _rootPath: string = "AssetsPackages/";

    // 加载bundle包
    public async loadBundle(bundleName: string): Promise<AssetManager.Bundle> {
        return new Promise(resolve => {
            assetManager.loadBundle(`${this._rootPath}/${bundleName}`, (err, bundle: AssetManager.Bundle) => {
                if (err) {
                    console.log("[OBT_ResourceManager]:loadBundle error");
                    console.log(err);
                    return
                }
                this._bundleName = bundleName;

                // 加载bundle包里的资源
                bundle.loadDir("/", (err: Error | null, data: Asset[]) => {
                    if (err) {
                        console.log("[OBT_ResourceManager]:bundle.loadDir error");
                        console.log(err)
                        return
                    }
                    resolve(bundle)
                })

                // bundle.loadDir("/", (err: Error | null, data: AssetManager.RequestItem[]) => {
                    
                // })
            })
        })
    }
    // 获取资源
    public getAssets(assetPath: string, assetFolder?: string): Asset {
        let bundle = assetManager.getBundle(this._bundleName);
        if (!bundle) {
            console.log("[OBT_ReourcesManager]:getAssets:" + this._bundleName + " bundle not loaded");
            return;
        }
        if (!assetFolder) {
            assetFolder = 'Prefabs'
        }
        return bundle.get(`${assetFolder}/${assetPath}`);
    }
    // 获取预设体
    public getPrefabAssets(prefabPath: string) {
        return this.getAssets(prefabPath);
    }
    // 获取JSON Assets
    public getJSONAssets(assetPath: string) {
        return this.getAssets(assetPath, "Data");
    }
    // 获取图片资源
    public getSpriteFrameAssets(assetsPath: string): SpriteFrame {
        return this.getAssets(`${assetsPath}/spriteFrame`, "Materials") as SpriteFrame
    }

    // 释放bundle
    public releaseBundle(): void {
        if (!this._bundleName) {
            return;
        }
        let bundle = assetManager.getBundle(this._bundleName);
        bundle.releaseAll()
    }
}

