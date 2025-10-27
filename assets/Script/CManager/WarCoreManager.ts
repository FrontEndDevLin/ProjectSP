import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import { BulletInfo, GamePlayEvent, WarCoreInfo } from '../Common/Namespace';
import OBT from '../OBT';
import DBManager from './DBManager';
import { getRandomNumbers } from '../Common/utils';
import ItemsManager from './ItemsManager';
const { ccclass, property } = _decorator;

export default class WarCoreManager extends OBT_UIManager {
    static instance: WarCoreManager = null;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");
    public warCoreRootNode: Node = null;

    public warCoreData: WarCoreInfo.WarCoreDBData;

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

        this.warCoreData = DBManager.instance.getDBData("WarCore");
    }

    public setWarCoreRootNode(node: Node) {
        this.warCoreRootNode = node;
    }

    private _setAtkWarCore(atkWarCoreId: string) {
        const warCore: WarCoreInfo.AtkWarCoreAttr = this.warCoreData.atk_war_core_def[atkWarCoreId];
        if (warCore) {
            this.atkWarCore = warCore;
            OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.ATK_CORE_CHANGE);
            this.showPrefab({ prefabPath: `WarCore/${warCore.id}`, parentNode: this.warCoreRootNode, scriptName: warCore.id });
        }
    }

    public initAtkWarCore(atkWarCoreId: string) {
        this._setAtkWarCore(atkWarCoreId);
    }

    // 仅限核心选择时调用
    public mountAtkWarCore(atkWarCoreId: string) {
        if (this.atkWarCore) {
            console.log('当前已有挂载攻击核心，需要先卸载');
            this.unmountAtkWarCore();
        }
        this._setAtkWarCore(atkWarCoreId);
        ItemsManager.instance.expendTrophy();
        OBT.instance.eventCenter.emit(GamePlayEvent.GAME_PALY.CORE_SELECT_FINISH);
    }
    // 卸载当前核心，卸载时，如当前核心有增益类buff，角色属性等值减去所有增益属性
    protected unmountAtkWarCore() {
        this.warCoreRootNode.getChildByName(this.atkWarCore.id).destroy();
        this.atkWarCore = null;
    }

    // 预选进攻核心列表
    public getPreCheckAtkWarCoreList(): WarCoreInfo.AtkWarCoreAttr[] {
        let pubAtkWarCoreList: string[] = this.warCoreData.pub_atk_war_core;
        const MAX: number = 3;
        let list: WarCoreInfo.AtkWarCoreAttr[] = [];
        let randomIdxList = [];
        if (pubAtkWarCoreList.length <= MAX) {
            pubAtkWarCoreList.forEach((_, idx: number) => {
                randomIdxList.push(idx)
            })
        } else {
            randomIdxList = getRandomNumbers(0, pubAtkWarCoreList.length - 1, MAX);
        }

        randomIdxList.forEach((idx: number) => {
            list.push(this.warCoreData.atk_war_core_def[pubAtkWarCoreList[idx]]);
        });

        return list;
    }

    update(deltaTime: number) {
        
    }
}

