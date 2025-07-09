import { find, Vec3 } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import DBManager from "./DBManager";
import { CHRInfo } from "../Common/Namespace";
export default class CHRManager extends OBT_UIManager {
    static instance: CHRManager;

    private _CHRLoc: Vec3 = null;

    // 基准属性，不可修改
    public basicProps: CHRInfo.CHRBasicProps;

    protected onLoad(): void {
        if (!CHRManager.instance) {
            CHRManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.rootNode = find("Canvas/GamePlay/GamePlay");

        // console.log('CHRManager Loaded')
        this._initBasicProps();
    }

    private _initBasicProps() {
        const chrDBData: any = DBManager.instance.getDBData("CHR");
        const dataBasicProps: CHRInfo.CHRBasicProps = chrDBData.basic_prop;
        this.basicProps = dataBasicProps;
    }

    public showCHR() {
        this.showPrefab({ prefabPath: "CHR/CHR01", scriptName: "CHR" });
    }
    public showCompass() {
        this.showPrefab({ prefabPath: "Compass" });
    }

    // 更新角色位置
    public setCHRLoc(loc: Vec3): void {
        this._CHRLoc = loc;
    }
    // 获取角色位置
    public getCHRLoc(): Vec3 {
        return this._CHRLoc;
    }

    protected onDestroy(): void {
        console.log('销毁角色管理ing')
        CHRManager.instance = null;
    }
}
