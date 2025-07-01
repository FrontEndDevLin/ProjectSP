import OBT from "../OBT";
import OBT_Module from "../OBT_Module";

export class StartMenuModule extends OBT_Module {
    public bundleName: string = "StartMenu";

    public async enter(): Promise<void> {
        // this.resourceManager
        console.log('这里做预制体的显示')
        OBT.instance.uiManager.showPrefab({ prefabPath: 'GUI_StartMenu', parentNode: this.rootNode })
    }
}
