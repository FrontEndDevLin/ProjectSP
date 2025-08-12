/**
 * 游戏中，界面UI控制
 */

import { _decorator, Color, Component, EventTouch, Game, Label, Node, Sprite, UITransform, Widget } from 'cc';
import OBT_Component from '../../OBT_Component';
import OBT_UIManager from '../../Manager/OBT_UIManager';
import OBT from '../../OBT';
import CHRManager from '../../CManager/CHRManager';
import { CHRInfo, GamePlayEvent } from '../../Common/Namespace';
const { ccclass, property } = _decorator;

@ccclass('GUI_LevelUp')
export class GUI_LevelUp extends OBT_Component {
    private _activeAttrTab: number = 0;

    protected onLoad(): void {
        let tabNodeList: Node[] = this.view("Container/InfoWrap/LeftWrap/Tabs").children;
        tabNodeList.forEach((tabNode: Node, i: number) => {
            tabNode.on(Node.EventType.TOUCH_END, (e: EventTouch) => { this._touchAttrTab(i) });
        });

        this._loadLevelUpCard();
        this._initCHRAttrCard();

        this.view("LevelUpIconWrap").addComponent("LevelUpIconWrap");
    }

    start() {
    }

    private _touchAttrTab(i: number) {
        if (this._activeAttrTab === i) {
            return;
        }
        let tabNodeList: Node[] = this.view("Container/InfoWrap/LeftWrap/Tabs").children;
        
        tabNodeList[this._activeAttrTab].children[0].getComponent(Sprite).color = new Color(245, 245, 245, 0);
        tabNodeList[this._activeAttrTab].children[1].getComponent(Label).color = new Color(245, 245, 245);
        tabNodeList[i].children[0].getComponent(Sprite).color = new Color(245, 245, 245);
        tabNodeList[i].children[1].getComponent(Label).color = new Color(51, 51, 51);

        this._activeAttrTab = i;

        let rootPath: string = "Container/InfoWrap/LeftWrap/Board/"
        let hidePath: string = "";
        let showPath: string = "";
        if (this._activeAttrTab === 0) {
            hidePath = `${rootPath}SubBoardWrap`;
            showPath = `${rootPath}MainBoardWrap`;
        } else {
            hidePath = `${rootPath}/MainBoardWrap`;
            showPath = `${rootPath}SubBoardWrap`;
        }
        this.hideNode(hidePath);
        this.showNode(showPath);
    }

    private _initCHRAttrCard() {
        this.hideNode("Container/InfoWrap/LeftWrap/Board/SubBoardWrap");

        const groupPropsList: CHRInfo.CHRPropsAttr[][] = [CHRManager.instance.propCtx.getMainPropsList(), CHRManager.instance.propCtx.getSubPropsList()];
        groupPropsList.forEach((propsList: CHRInfo.CHRPropsAttr[], groupIdx: number) => {
            let parentNodePath: string = "Container/InfoWrap/LeftWrap/Board/MainBoardWrap";
            if (groupIdx === 1) {
                parentNodePath = "Container/InfoWrap/LeftWrap/Board/SubBoardWrap";
            }
            propsList.forEach((prop, i: number) => {
                const propNode: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/CHRAttrItem" });
                propNode.OBT_param1 = prop;
                OBT.instance.uiManager.mountNode({ node: propNode, parentNode: this.view(parentNodePath) });
            })
        })
    }

    private _loadLevelUpCard() {
        const cardSlotList: Node[] = this.view("Container/StoreWrap/CardWrap").children;
        const preLevelUpList: CHRInfo.UpdateProp[] = CHRManager.instance.propCtx.preUpdateList;
        preLevelUpList.forEach((updateProp, i) => {
            // preLevelUpList
            const levelUpCard: Node = OBT.instance.uiManager.loadPrefab({ prefabPath: "GUI_LevelUp/LevelUpCard" });
            levelUpCard.OBT_param1 = updateProp;
            OBT.instance.uiManager.mountNode({ node: levelUpCard, parentNode: cardSlotList[i] });
        })
    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }
}


