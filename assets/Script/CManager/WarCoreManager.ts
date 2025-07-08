import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import { BulletInfo, WarCoreInfo } from '../Common/Namespace';
import OBT from '../OBT';
import DBManager from './DBManager';
const { ccclass, property } = _decorator;

export default class WarCoreManager extends OBT_UIManager {
    static instance: WarCoreManager = null;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    public warCoreRootNode: Node = null;

    public atkWarCoreData: WarCoreInfo.AtkWarCoreDBData = {}

    public atkWarCore: WarCoreInfo.AtkWarCoreAttr = null;

    start() {
        
    }

    protected onLoad(): void {
        if (!WarCoreManager.instance) {
            WarCoreManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.atkWarCoreData = DBManager.instance.getDBData("AtkWarCore");
    }

    public setWarCoreRootNode(node: Node) {
        this.warCoreRootNode = node;
    }

    public mountAtkWarCore(atkWarCoreId: string) {
        if (this.atkWarCore) {
            console.log('当前已有挂载攻击核心，需要先卸载');
        } else {
            const warCore: WarCoreInfo.AtkWarCoreAttr = this.atkWarCoreData[atkWarCoreId];
            if (warCore) {
                this.atkWarCore = warCore;
                this.showPrefab({ prefabPath: `WarCore/BaseWarCore`, parentNode: this.warCoreRootNode, scriptName: "BaseWarCore" });
            }
        }
    }
    // 卸载当前核心，卸载时，如当前核心有增益类buff，角色属性等值减去所有增益属性
    public unmountAtkWarCore() {

    }

    update(deltaTime: number) {
        
    }
}

