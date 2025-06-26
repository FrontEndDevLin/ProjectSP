import { _decorator, Component, Node, assetManager, AssetManager, Asset, resources } from 'cc';

import { AbDict, ProgressCallback, AbProgressCallback, Callback, ResPkg } from '../Interface';
import OO_Manager from '../OO_Manager';

export default class OO_ResourceManager extends OO_Manager {
    static instance: OO_ResourceManager = null;

    // private _abList: AbDict = {};

    private _rootPath: string = "AssetsPackages/";

    onLoad () {
        super.onLoad();
        if (!OO_ResourceManager.instance) {
            OO_ResourceManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    private loadBundle(abName: string, callback: Callback) {
        console.log(assetManager.getBundle(abName));

        assetManager.loadBundle(`${this._rootPath + abName}`, (err, bundle: AssetManager.Bundle) => {
            if (err) {
                callback(err);
                return;
            }
            // this._abList[bundle.name] = bundle;

            if (callback) {
                callback(null);
            }
        })
    }

    // 预加载ab包
    public proloadBundles(abNameList: string[], progressCallback: AbProgressCallback, callback?: Callback) {
        let total = abNameList.length
        let current = 0
        for (let abName of abNameList) {
            if (assetManager.getBundle(abName)) {
                console.log("[ReourcesManager]:proloadBundles");
                console.log(`asset bundle:${abName} was loaded, now use cache`);
                current++;
                progressCallback(total, current, abName);
                if (current >= total && callback) {
                    callback(null)
                }
                continue;
            } else {
                assetManager.loadBundle(`${this._rootPath}${abName}`, (err, bundle: AssetManager.Bundle) => {
                    if (err && callback) {
                        callback(err);
                        return;
                    }
                    current++;
                    progressCallback(total, current, abName);
                    if (current >= total && callback) {
                        callback(null)
                    }
                })
            }
        }
    }

    // 批量预加载资源 { GUI: { assetType: cc.Prefab, urls: ["", ""] } }
    public preloadResPkg(resPkgs: ResPkg[], progressCallback: ProgressCallback, callback: Callback) {
        let total = 0;
        let current = 0;

        const abNameList = [];
        for (let resPkg of resPkgs) {
            total += resPkg.urls.length;
            abNameList.push(resPkg.abName);
        }

        this.proloadBundles(abNameList, (abTotal, abCurrent) => {}, err => {
            for (let item of resPkgs) {
                let abName = item.abName;
    
                for (let url of item.urls) {
                    // bundle.loadDir 批量加载
                    assetManager.getBundle(abName).load(url, item.assetType, (err, assets: Asset) => {
                        if (err) {
                            console.log("[ReourcesManager]:loadAssetInAssetsBundle");
                            console.log(err);
                            callback(err);
                            return;
                        }
    
                        current++;
    
                        if (progressCallback) {
                            progressCallback(total, current);
                        }
    
                        if (current >= total) {
                            if (callback) {
                                callback(null);
                            }
                        }
                    })
                }
            }
        })
    }

    // 卸载资源包
    public unloadResPkg(abName: string) {
        const bundle: AssetManager.Bundle = assetManager.getBundle(abName);
        bundle.releaseAll();
    }

    // 获取资源
    public getAssets(abName: string, resUrl: string) {
        let bundle = assetManager.getBundle(abName);
        if (!bundle) {
            console.log("[ReourcesManager]:getAssets:" + abName + " bundle not loaded");
            return;
        }
        return bundle.get(resUrl);
    }
}

