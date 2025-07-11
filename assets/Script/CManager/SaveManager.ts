import { _decorator, Component, Node, Prefab, Vec3, tween, v3, find } from 'cc';
import OBT_UIManager from '../Manager/OBT_UIManager';
import DBManager from './DBManager';
import { SaveDoc } from '../Common/Namespace';
const { ccclass, property } = _decorator;

/**
 * 存档管理
 * 
 * TODO: 该类不涉及UI，可用普通的类实现
 */
export default class SaveManager extends OBT_UIManager {
    static instance: SaveManager = null;
    public rootNode: Node = find("Canvas/GamePlay/GamePlay");

    // 存储数据，所有数据都在此管理，角色属性管理只是该对象的一个引用
    public save: SaveDoc;

    start() {
        
    }

    protected onLoad(): void {
        if (!SaveManager.instance) {
            SaveManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    public initSave() {
        this.save = DBManager.instance.getDBData("InitSave");
    }

    update(deltaTime: number) {
        
    }
}

