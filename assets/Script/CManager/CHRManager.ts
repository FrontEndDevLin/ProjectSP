import { find } from "cc";
import OBT_UIManager from "../Manager/OBT_UIManager";
import DBManager from "./DBManager";
import { CHRProp } from "../Common/Namespace";
export default class CHRManager extends OBT_UIManager {
    static instance: CHRManager;

    // 基准属性，不可修改
    public basicProps: CHRProp.CHRBasicProps;
    // 面板属性
    public props: any = {};

    protected onLoad(): void {
        if (!CHRManager.instance) {
            CHRManager.instance = this
        } else {
            this.destroy();
            return;
        }

        this.rootNode = find("Canvas/GamePlay/GamePlay");

        console.log('CHRManager Loaded')
        this._initBasicProps();
        console.log(this.basicProps);
    }

    public showCHR() {
        console.log('角色管理:显示角色')
        this.showPrefab({ prefabPath: "CHR/CHR01", scriptName: "CHR" });
        this.showPrefab({ prefabPath: "Compass" });

        console.log(DBManager.instance.getDbData("CHR"));
    }

    private _initBasicProps() {
        const dataBasicProps: CHRProp.CHRBasicProps = DBManager.instance.getDbData("CHR").basic_prop;
        this.basicProps = dataBasicProps;
    }

    protected onDestroy(): void {
        console.log('销毁角色管理ing')

        CHRManager.instance = null;
    }
}
