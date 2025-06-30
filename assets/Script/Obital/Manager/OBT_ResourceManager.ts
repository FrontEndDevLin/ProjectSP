/**
 * 资源管理器
 */

import { _decorator, Component, Node, assetManager, AssetManager, Asset, resources, Prefab } from 'cc';

import { AbDict, ProgressCallback, AbProgressCallback, Callback, ResPkg } from '../Interface';
// import OO_Manager from '../OO_Manager';

export default class OBT_ResourceManager {
    static instance: OBT_ResourceManager = null;

    private _bundleName: string = "";
    // private _commonBundleName: string = "";

    // private _abList: AbDict = {};

    private _rootPath: string = "AssetsPackages/";

    private loadBundle1(abName: string, callback: Callback) {
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

    // 新版start
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
                    } else {
                        console.log(data)
                    }
                    resolve(bundle)
                })

                // bundle.loadDir("/", (err: Error | null, data: AssetManager.RequestItem[]) => {
                    
                // })
            })
        })
    }
    // 获取资源
    public getAssets(prefabName: string): Asset {
        let bundle = assetManager.getBundle(this._bundleName);
        if (!bundle) {
            console.log("[OBT_ReourcesManager]:getAssets:" + this._bundleName + " bundle not loaded");
            return;
        }
        return bundle.get(`Prefabs/${prefabName}`);
    }
    // 释放资源
    public releaseBundle(): void {
        if (!this._bundleName) {
            return;
        }
        let bundle = assetManager.getBundle(this._bundleName);
        bundle.releaseAll()
    }

    // 新版end

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
}

