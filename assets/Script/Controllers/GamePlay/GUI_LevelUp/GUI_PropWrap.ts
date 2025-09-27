import { _decorator, Color, Component, EventTouch, Label, Node, Sprite } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GamePlayEvent } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import OBT from '../../../OBT';
const { ccclass, property } = _decorator;

@ccclass('GUI_PropWrap')
export class GUI_PropWrap extends OBT_Component {
    private _activeAttrTab: number = 0;

    protected onLoad(): void {
        let tabNodeList: Node[] = this.view("Tabs").children;
        tabNodeList.forEach((tabNode: Node, i: number) => {
            tabNode.on(Node.EventType.TOUCH_END, (e: EventTouch) => { this._touchAttrTab(i) });
        });

        OBT.instance.eventCenter.on(GamePlayEvent.GAME_PALY.PROP_INIT, this._initCHRAttrCard, this);
    }

    start() {
    }

    private _touchAttrTab(i: number) {
        if (this._activeAttrTab === i) {
            return;
        }
        let tabNodeList: Node[] = this.view("Tabs").children;
        
        tabNodeList[this._activeAttrTab].children[0].getComponent(Sprite).color = new Color(245, 245, 245, 0);
        tabNodeList[this._activeAttrTab].children[1].getComponent(Label).color = new Color(245, 245, 245);
        tabNodeList[i].children[0].getComponent(Sprite).color = new Color(245, 245, 245);
        tabNodeList[i].children[1].getComponent(Label).color = new Color(51, 51, 51);

        this._activeAttrTab = i;

        let rootPath: string = "Board/"
        let hidePath: string = "";
        let showPath: string = "";
        if (this._activeAttrTab === 0) {
            hidePath = `${rootPath}SubBoardWrap`;
            showPath = `${rootPath}MainBoardWrap`;
        } else {
            hidePath = `${rootPath}/MainBoardWrap`;
            showPath = `${rootPath}SubBoardWrap`;
        }
        this.hideNodeByPath(hidePath);
        this.showNodeByPath(showPath);
    }

    private _initCHRAttrCard() {
        this.hideNodeByPath("Board/SubBoardWrap");

        const groupPropsList: CHRInfo.Prop[][] = [CHRManager.instance.propCtx.getMainPropsList(), CHRManager.instance.propCtx.getSubPropsList()];
        groupPropsList.forEach((propsList: CHRInfo.Prop[], groupIdx: number) => {
            let parentNodePath: string = "Board/MainBoardWrap";
            if (groupIdx === 1) {
                parentNodePath = "Board/SubBoardWrap";
            }
            propsList.forEach((prop: CHRInfo.Prop, i: number) => {
                const propNode: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/CHRAttrItem" });
                propNode.OBT_param1 = prop;
                OBT.instance.uiManager.mountNode({ node: propNode, parentNode: this.view(parentNodePath) });
            })
        })
    }

    protected onDestroy(): void {
        OBT.instance.eventCenter.off(GamePlayEvent.GAME_PALY.PROP_INIT, this._initCHRAttrCard, this);
    }

    update(deltaTime: number) {
        
    }
}


