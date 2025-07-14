import { BaseCtrl } from "./BaseCtrl";
import { SaveDoc } from '../../Common/Namespace';
import DBManager from "../DBManager";

/**
 * 存档管理
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
}

export const getSaveCtrl = () => {
    return SaveCtrl.instance
}
