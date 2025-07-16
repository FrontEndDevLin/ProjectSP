import { BaseCtrl } from "./BaseCtrl";
import { SaveDoc } from '../../Common/Namespace';
import DBManager from "../DBManager";

/**
 * 存档管理
 * 
 * 一切以加载存档为先
 * 存档加载完毕后，所有需要数据的类都引用该存档，修改时即可同步修改存档
 */
export default class SaveCtrl extends BaseCtrl {
    static instance: SaveCtrl = null;

    // 存储数据，所有数据都在此管理，角色属性管理只是该对象的一个引用
    public save: SaveDoc;

    constructor() {
        super();
        if (!SaveCtrl.instance) {
            SaveCtrl.instance = this;
        } else {
            return SaveCtrl.instance;
        }
    }

    public initSave() {
        this.save = DBManager.instance.getDBData("InitSave");
    }

    public initCHRSave() {

    }
}

export const getSaveCtrl = () => {
    return SaveCtrl.instance
}
