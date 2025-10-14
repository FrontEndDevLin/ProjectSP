import { _decorator, Component, Label, Node, RichText } from 'cc';
import OBT_Component from '../../../OBT_Component';
import { CHRInfo, GAME_NODE, GamePlayEvent, ItemInfo } from '../../../Common/Namespace';
import CHRManager from '../../../CManager/CHRManager';
import ProcessManager from '../../../CManager/ProcessManager';
import OBT from '../../../OBT';
import ItemsManager from '../../../CManager/ItemsManager';
const { ccclass, property } = _decorator;

@ccclass('ItemCard')
export class ItemCard extends OBT_Component {
    protected onLoad(): void {
        const item: ItemInfo.Item = this.node.OBT_param1;

        this.node.OBT_param2 = {
            updateView: this._updateView.bind(this)
        }

        if (item) {
            this._updateView(item);
        }
    }

    start() {

    }

    private _updateView(item) {
        this.view("Head/TitleWrap/ItemName").getComponent(Label).string = item.label;
        let buffTxt: string = ItemsManager.instance.getItemsPanelRichTxt(item.id);
        this.view("Content/RichTxt").getComponent(RichText).string = buffTxt;
    }

    update(deltaTime: number) {
        
    }
}


